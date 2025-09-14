// Модуль системы записей с поддержкой конкретных тарологов
const BookingSystem = {
    selectedSlot: null,
    currentTarot: null,

    // Инициализация
    init() {
        ConfigUtils.log('Инициализация системы записей');
        this.loadCurrentTarot();
        this.loadAvailableSlots();
    },

    // Загрузить информацию о текущем тарологе
    loadCurrentTarot() {
        const currentUser = AuthSystem.getCurrentUser();
        if (!currentUser || currentUser.role !== CONFIG.USER_ROLES.CLIENT) {
            return;
        }

        // Получаем текущего активного таролога
        this.currentTarot = AuthSystem.getCurrentTarot();

        if (this.currentTarot) {
            ConfigUtils.log('🔮 Текущий таролог:', this.currentTarot.tarotData.displayName);
            this.showTarotInfo();
        } else {
            ConfigUtils.log('ℹ️ Нет выбранного таролога');
            this.showNoTarotMessage();
        }
    },

    // Показать информацию о тарологе
    showTarotInfo() {
        const container = document.querySelector('.section-header');
        if (!container || !this.currentTarot) return;

        const tarotData = this.currentTarot.tarotData;

        container.innerHTML = `
            <h2>🔮 Запись к тарологу</h2>
            <div class="current-tarot-info">
                <div class="tarot-card">
                    <div class="tarot-avatar">
                        ${this.currentTarot.photoUrl ?
                            `<img src="${this.currentTarot.photoUrl}" alt="${tarotData.displayName}">` :
                            `<div class="avatar-placeholder">${tarotData.displayName.charAt(0)}</div>`
                        }
                    </div>
                    <div class="tarot-details">
                        <h3>${tarotData.displayName}</h3>
                        <p class="tarot-price">${tarotData.price}₽ за консультацию</p>
                        <p class="tarot-experience">Опыт: ${this.getExperienceText(tarotData.experience)}</p>
                        ${tarotData.specialization ?
                            `<p class="tarot-specialization">${tarotData.specialization}</p>` : ''
                        }
                    </div>
                </div>
                <div class="tarot-actions">
                    <button onclick="BookingSystem.switchTarot()" class="secondary-btn btn-sm">
                        Сменить таролога
                    </button>
                </div>
            </div>
            <p>Выберите удобное время для консультации</p>
        `;
    },

    // Показать сообщение об отсутствии таролога
    showNoTarotMessage() {
        const container = document.getElementById('available-slots');
        if (!container) return;

        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔮</div>
                <h3>Выберите таролога</h3>
                <p>Сначала выберите таролога, к которому хотите записаться</p>
                <button onclick="BookingSystem.showTarotsList()" class="primary-btn" style="margin-top: 20px;">
                    Выбрать таролога
                </button>
            </div>
        `;
    },

    // Показать список тарологов
    showTarotsList() {
        const tarotsList = Storage.get('tarots_list') || [];

        if (tarotsList.length === 0) {
            TelegramApp.showAlert('Тарологи пока недоступны. Попробуйте позже.');
            return;
        }

        const tarots = tarotsList.map((tarot, index) => ({
            value: tarot.id,
            title: tarot.tarotData.displayName,
            description: `${tarot.tarotData.price}₽ • ${this.getExperienceText(tarot.tarotData.experience)}`,
            icon: '🔮'
        }));

        if (typeof Modal !== 'undefined') {
            Modal.showSelect(
                'Выберите таролога',
                tarots,
                (tarotId) => this.selectTarot(tarotId),
                () => ConfigUtils.log('Выбор таролога отменен')
            );
        }
    },

    // Выбрать таролога
    selectTarot(tarotId) {
        const tarotsList = Storage.get('tarots_list') || [];
        const selectedTarot = tarotsList.find(t => t.id.toString() === tarotId.toString());

        if (!selectedTarot) {
            TelegramApp.showAlert('Таролог не найден');
            return;
        }

        // Проверяем, не является ли это сменой таролога
        const currentUser = AuthSystem.getCurrentUser();
        if (currentUser) {
            const clientConnections = Storage.get(CONFIG.STORAGE_KEYS.TAROT_CLIENTS) || {};

            if (!clientConnections[currentUser.id]) {
                clientConnections[currentUser.id] = {
                    selectedTarots: [],
                    currentTarot: null,
                    createdAt: new Date().toISOString()
                };
            }

            const userConnections = clientConnections[currentUser.id];

            // Добавляем таролога в список
            if (!userConnections.selectedTarots.find(t => t.tarotId.toString() === tarotId.toString())) {
                userConnections.selectedTarots.push({
                    tarotId: tarotId,
                    tarotName: selectedTarot.tarotData.displayName,
                    addedAt: new Date().toISOString()
                });
            }

            // Устанавливаем как текущего
            userConnections.currentTarot = tarotId;

            Storage.set(CONFIG.STORAGE_KEYS.TAROT_CLIENTS, clientConnections);
        }

        this.currentTarot = selectedTarot;

        TelegramApp.showAlert(`Выбран таролог: ${selectedTarot.tarotData.displayName}`);
        TelegramApp.hapticFeedback('success');

        // Обновляем интерфейс
        this.showTarotInfo();
        this.loadAvailableSlots();

        ConfigUtils.log('✅ Выбран таролог:', selectedTarot.tarotData.displayName);
    },

    // Сменить таролога
    switchTarot() {
        const clientTarots = AuthSystem.getClientTarots();

        if (clientTarots.length <= 1) {
            this.showTarotsList();
            return;
        }

        // Показываем список уже выбранных тарологов + возможность добавить нового
        const tarots = clientTarots.map(ct => ({
            value: ct.tarotId,
            title: ct.tarotName,
            description: 'Ваш таролог',
            icon: '🔮'
        }));

        tarots.push({
            value: 'add_new',
            title: 'Добавить нового таролога',
            description: 'Выбрать из списка доступных',
            icon: '➕'
        });

        if (typeof Modal !== 'undefined') {
            Modal.showSelect(
                'Выберите таролога',
                tarots,
                (value) => {
                    if (value === 'add_new') {
                        this.showTarotsList();
                    } else {
                        this.selectTarot(value);
                    }
                }
            );
        }
    },

    // Получить текст опыта
    getExperienceText(experience) {
        const experiences = {
            'beginner': 'Начинающий',
            'intermediate': 'Практикующий',
            'advanced': 'Опытный',
            'expert': 'Эксперт'
        };
        return experiences[experience] || 'Не указан';
    },

    // Загрузить доступные временные слоты
    loadAvailableSlots() {
        const container = document.getElementById('available-slots');
        if (!container) {
            ConfigUtils.log('Контейнер available-slots не найден');
            return;
        }

        // Если нет выбранного таролога, показываем сообщение
        if (!this.currentTarot) {
            this.showNoTarotMessage();
            return;
        }

        // Получаем слоты конкретного таролога
        const availableSlots = this.getTarotAvailableSlots(this.currentTarot.id);
        ConfigUtils.log('Найдено доступных слотов для таролога:', availableSlots.length);

        if (availableSlots.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📅</div>
                    <h3>Нет доступного времени</h3>
                    <p>У таролога ${this.currentTarot.tarotData.displayName} пока нет свободных слотов</p>
                    <button onclick="BookingSystem.switchTarot()" class="secondary-btn" style="margin-top: 15px;">
                        Выбрать другого таролога
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = availableSlots.map(slot =>
            Components.createTimeSlot(slot)
        ).join('');

        ConfigUtils.log('Доступные слоты загружены');
    },

    // Получить доступные слоты конкретного таролога
    getTarotAvailableSlots(tarotId) {
        const allSlots = TimeSlotStorage.getAll();
        const now = new Date();

        return allSlots.filter(slot => {
            const slotStart = new Date(slot.start);
            return (
                slot.status === CONFIG.SLOT_STATUS.AVAILABLE &&
                slotStart > now &&
                slot.tarotId && slot.tarotId.toString() === tarotId.toString()
            );
        }).sort((a, b) => new Date(a.start) - new Date(b.start));
    },

    // Выбрать временной слот
    selectTimeSlot(slotId) {
        const slot = TimeSlotStorage.findById(slotId);
        if (!slot) {
            ConfigUtils.error('Слот не найден:', slotId);
            return;
        }

        if (slot.status !== CONFIG.SLOT_STATUS.AVAILABLE) {
            TelegramApp.showAlert('Этот временной слот уже недоступен');
            return;
        }

        // Проверяем конфликт времени с другими тарологами
        const conflictCheck = AuthSystem.checkTimeConflict(
            slot.start,
            slot.end,
            this.currentTarot?.id
        );

        if (conflictCheck.hasConflict) {
            this.showTimeConflictWarning(conflictCheck, slot);
            return;
        }

        this.selectedSlot = slot;
        ConfigUtils.log('Выбран слот:', slot);

        // Показываем форму записи
        this.showBookingForm(slot);

        // Тактильная обратная связь
        TelegramApp.hapticFeedback('selection');
    },

    // Показать предупреждение о конфликте времени
    showTimeConflictWarning(conflictCheck, newSlot) {
        const conflictSlot = conflictCheck.conflictSlot;
        const conflictBooking = conflictCheck.conflictBooking;

        const conflictStart = new Date(conflictSlot.start);
        const conflictEnd = new Date(conflictSlot.end);
        const newStart = new Date(newSlot.start);
        const newEnd = new Date(newSlot.end);

        const message = `
У вас уже есть запись на это время:

Существующая запись:
${conflictStart.toLocaleDateString('ru-RU')}
${conflictStart.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'})} - ${conflictEnd.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'})}

Новая запись:
${newStart.toLocaleDateString('ru-RU')}
${newStart.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'})} - ${newEnd.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'})}

Выберите другое время или отмените существующую запись.`;

        TelegramApp.showAlert(message);
        TelegramApp.hapticFeedback('error');
    },

    // Показать форму записи
    showBookingForm(slot) {
        const formContainer = document.getElementById('booking-form');
        if (!formContainer) {
            ConfigUtils.error('Контейнер booking-form не найден');
            return;
        }

        formContainer.innerHTML = Components.createBookingForm(slot, this.currentTarot);
        formContainer.style.display = 'block';

        // Прокручиваем к форме
        formContainer.scrollIntoView({ behavior: 'smooth' });

        ConfigUtils.log('Форма записи показана');
    },

    // Отправить запись
    submitBooking(slotId) {
        const name = document.getElementById('client-name')?.value?.trim();
        const contact = document.getElementById('client-contact')?.value?.trim();
        const question = document.getElementById('client-question')?.value?.trim();

        // Валидация
        if (!name) {
            TelegramApp.showAlert('Пожалуйста, укажите ваше имя');
            return;
        }

        if (!contact) {
            TelegramApp.showAlert('Пожалуйста, укажите способ связи');
            return;
        }

        if (!this.currentTarot) {
            TelegramApp.showAlert('Ошибка: таролог не выбран');
            return;
        }

        // Проверяем что слот еще доступен
        const slot = TimeSlotStorage.findById(slotId);
        if (!slot || slot.status !== CONFIG.SLOT_STATUS.AVAILABLE) {
            TelegramApp.showAlert('Выбранное время уже недоступно. Пожалуйста, выберите другое время.');
            this.loadAvailableSlots();
            this.cancelBooking();
            return;
        }

        // Повторная проверка конфликта времени
        const conflictCheck = AuthSystem.checkTimeConflict(
            slot.start,
            slot.end,
            this.currentTarot.id
        );

        if (conflictCheck.hasConflict) {
            TelegramApp.showAlert('Обнаружен конфликт времени. Пожалуйста, выберите другое время.');
            this.cancelBooking();
            return;
        }

        const currentUser = AuthSystem.getCurrentUser();
        if (!currentUser) {
            ConfigUtils.error('Пользователь не авторизован');
            return;
        }

        // Создаем запись
        const booking = {
            clientId: currentUser.id,
            clientName: name,
            clientContact: contact,
            slotId: slotId,
            consultationType: 'online',
            question: question || '',
            tarotId: this.currentTarot.id,
            tarotName: this.currentTarot.tarotData.displayName,
            price: this.currentTarot.tarotData.price
        };

        try {
            // Сохраняем запись
            const savedBooking = BookingStorage.add(booking);

            // Обновляем статус слота
            TimeSlotStorage.update(slotId, { status: CONFIG.SLOT_STATUS.PENDING });

            ConfigUtils.log('Запись создана:', savedBooking);

            // Показываем уведомление об успехе
            TelegramApp.showAlert(`Заявка отправлена тарологу ${this.currentTarot.tarotData.displayName}! Ожидайте подтверждения.`);

            // Тактильная обратная связь
            TelegramApp.hapticFeedback('success');

            // Очищаем форму и обновляем слоты
            this.cancelBooking();
            this.loadAvailableSlots();

            // Показываем уведомление в интерфейсе
            Components.showNotification('Заявка успешно отправлена!', 'success');

        } catch (error) {
            ConfigUtils.error('Ошибка создания записи:', error);
            TelegramApp.showAlert('Произошла ошибка при создании записи. Попробуйте еще раз.');
            TelegramApp.hapticFeedback('error');
        }
    },

    // Отменить запись
    cancelBooking() {
        const formContainer = document.getElementById('booking-form');
        if (formContainer) {
            formContainer.style.display = 'none';
            formContainer.innerHTML = '';
        }

        this.selectedSlot = null;
        ConfigUtils.log('Форма записи скрыта');

        // Убираем выделение со слотов
        document.querySelectorAll('.time-slot.selected').forEach(slot => {
            slot.classList.remove('selected');
        });
    },

    // Получить записи пользователя
    getUserBookings() {
        const currentUser = AuthSystem.getCurrentUser();
        if (!currentUser) {
            return [];
        }

        return BookingStorage.getUserBookings(currentUser.id);
    },

    // Показать историю записей
    showBookingHistory() {
        const bookings = this.getUserBookings();

        if (bookings.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-state-icon">📋</div>
                    <h3>У вас пока нет записей</h3>
                    <p>Выберите удобное время для первой консультации</p>
                </div>
            `;
        }

        return bookings.map(booking => Components.createBookingCard(booking)).join('');
    },

    // Отменить существующую запись
    cancelExistingBooking(bookingId) {
        TelegramApp.showConfirm('Вы уверены, что хотите отменить эту запись?', (confirmed) => {
            if (confirmed) {
                const booking = BookingStorage.findById(bookingId);
                if (booking) {
                    // Обновляем статус записи
                    BookingStorage.update(bookingId, {
                        status: CONFIG.BOOKING_STATUS.CANCELLED,
                        cancelledBy: 'client',
                        cancelledAt: new Date().toISOString()
                    });

                    // Освобождаем временной слот
                    if (booking.slotId) {
                        TimeSlotStorage.update(booking.slotId, { status: CONFIG.SLOT_STATUS.AVAILABLE });
                    }

                    ConfigUtils.log('Запись отменена:', bookingId);
                    TelegramApp.showAlert('Запись отменена');
                    TelegramApp.hapticFeedback('success');

                    // Обновляем интерфейс
                    this.loadAvailableSlots();
                    Components.showNotification('Запись отменена', 'success');
                }
            }
        });
    },

    // Проверить можно ли отменить запись
    canCancelBooking(booking) {
        if (booking.status !== CONFIG.BOOKING_STATUS.PENDING &&
            booking.status !== CONFIG.BOOKING_STATUS.CONFIRMED) {
            return false;
        }

        // Проверяем время (можно отменить минимум за час)
        const slot = TimeSlotStorage.findById(booking.slotId);
        if (slot) {
            const slotStart = new Date(slot.start);
            const now = new Date();
            const diffHours = (slotStart - now) / (1000 * 60 * 60);

            return diffHours >= 1; // Минимум час до начала
        }

        return true;
    },

    // Получить информацию о связях клиента с тарологами
    getClientTarotConnections() {
        const currentUser = AuthSystem.getCurrentUser();
        if (!currentUser) return null;

        const clientConnections = Storage.get(CONFIG.STORAGE_KEYS.TAROT_CLIENTS) || {};
        return clientConnections[currentUser.id] || null;
    }
};

// Экспортируем модуль
window.BookingSystem = BookingSystem;