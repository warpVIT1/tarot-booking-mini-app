// Модуль переиспользуемых компонентов с поддержкой системы тарологов
const Components = {
    // Создать карточку временного слота
    createTimeSlot(slot) {
        const startDate = new Date(slot.start);
        const endDate = new Date(slot.end);
        const dateStr = startDate.toLocaleDateString('ru-RU');
        const timeStr = `${startDate.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'})} - ${endDate.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'})}`;

        const statusClass = slot.status === CONFIG.SLOT_STATUS.AVAILABLE ? 'status-available' :
                           slot.status === CONFIG.SLOT_STATUS.PENDING ? 'status-pending' : 'status-booked';

        const statusText = slot.status === CONFIG.SLOT_STATUS.AVAILABLE ? 'Свободно' :
                          slot.status === CONFIG.SLOT_STATUS.PENDING ? 'Ожидает' : 'Занято';

        // Получаем информацию о тарологе если есть
        let tarotInfo = '';
        if (slot.tarotId) {
            const tarotsList = Storage.get('tarots_list') || [];
            const tarot = tarotsList.find(t => t.id.toString() === slot.tarotId.toString());
            if (tarot) {
                tarotInfo = `
                    <div class="slot-tarot">
                        <span class="tarot-name">${tarot.tarotData.displayName}</span>
                        <span class="tarot-price">${tarot.tarotData.price}₽</span>
                    </div>
                `;
            }
        }

        return `
            <div class="time-slot ${slot.status}" onclick="Components.selectTimeSlot('${slot.id}')" data-slot-id="${slot.id}">
                <div class="slot-header">
                    <div class="slot-date">${dateStr}</div>
                    <div class="slot-time">${timeStr}</div>
                </div>
                ${tarotInfo}
                <div class="slot-status">
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </div>
            </div>
        `;
    },

    // Выбор временного слота
    selectTimeSlot(slotId) {
        // Снимаем выделение с других слотов
        document.querySelectorAll('.time-slot.selected').forEach(slot => {
            slot.classList.remove('selected');
        });

        // Выделяем выбранный слот
        const selectedSlot = document.querySelector(`[data-slot-id="${slotId}"]`);
        if (selectedSlot) {
            selectedSlot.classList.add('selected');
        }

        if (typeof BookingSystem !== 'undefined') {
            BookingSystem.selectTimeSlot(slotId);
        } else {
            ConfigUtils.log('BookingSystem не найден');
        }
    },

    // Создать карточку записи с поддержкой тарологов
    createBookingCard(booking) {
        const slot = TimeSlotStorage.findById(booking.slotId);
        let timeInfo = 'Время не найдено';

        if (slot) {
            const startDate = new Date(slot.start);
            const endDate = new Date(slot.end);
            const dateStr = startDate.toLocaleDateString('ru-RU');
            const timeStr = `${startDate.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'})} - ${endDate.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'})}`;
            timeInfo = `${dateStr} ${timeStr}`;
        }

        const statusClass = booking.status === CONFIG.BOOKING_STATUS.PENDING ? 'pending' :
                           booking.status === CONFIG.BOOKING_STATUS.CONFIRMED ? 'confirmed' :
                           booking.status === CONFIG.BOOKING_STATUS.CANCELLED ? 'cancelled' : 'completed';

        const statusText = booking.status === CONFIG.BOOKING_STATUS.PENDING ? 'Ожидает подтверждения' :
                          booking.status === CONFIG.BOOKING_STATUS.CONFIRMED ? 'Подтверждено' :
                          booking.status === CONFIG.BOOKING_STATUS.CANCELLED ? 'Отменено' : 'Завершено';

        // Информация о тарологе
        const tarotInfo = booking.tarotName ? `
            <div class="booking-info-item">
                <span class="booking-info-label">Таролог:</span>
                <span class="tarot-name-highlight">${booking.tarotName}</span>
            </div>
        ` : '';

        // Информация о цене
        const priceInfo = booking.price ? `
            <div class="booking-info-item">
                <span class="booking-info-label">Стоимость:</span>
                <span class="price-highlight">${booking.price}₽</span>
            </div>
        ` : '';

        // Определяем действия в зависимости от роли пользователя
        const currentUser = AuthSystem.getCurrentUser();
        const isClient = currentUser && currentUser.role === CONFIG.USER_ROLES.CLIENT;
        const isTarot = currentUser && currentUser.role === CONFIG.USER_ROLES.TAROT;

        let actionsHtml = '';

        if (isClient) {
            // Действия для клиента
            if (booking.status === CONFIG.BOOKING_STATUS.PENDING || booking.status === CONFIG.BOOKING_STATUS.CONFIRMED) {
                const canCancel = this.canCancelBooking(booking);
                actionsHtml = `
                    <div class="booking-actions">
                        ${canCancel ? `
                            <button class="btn-cancel" onclick="Components.cancelClientBooking('${booking.id}')">
                                Отменить запись
                            </button>
                        ` : ''}
                        <button class="btn-view" onclick="Components.viewBookingDetails('${booking.id}')">
                            Подробнее
                        </button>
                    </div>
                `;
            }
        } else if (isTarot) {
            // Действия для таролога
            if (booking.status === CONFIG.BOOKING_STATUS.PENDING) {
                actionsHtml = `
                    <div class="booking-actions">
                        <button class="btn-confirm" onclick="Components.confirmBooking('${booking.id}')">Подтвердить</button>
                        <button class="btn-reject" onclick="Components.rejectBooking('${booking.id}')">Отклонить</button>
                    </div>
                `;
            } else if (booking.status === CONFIG.BOOKING_STATUS.CONFIRMED) {
                actionsHtml = `
                    <div class="booking-actions">
                        <button class="btn-complete" onclick="Components.completeBooking('${booking.id}')">Завершить</button>
                        <button class="btn-view" onclick="Components.viewBookingDetails('${booking.id}')">Подробнее</button>
                    </div>
                `;
            }
        }

        return `
            <div class="booking-item ${statusClass}">
                <div class="booking-header">
                    <div class="booking-client">${booking.clientName}</div>
                    <span class="status-badge status-${booking.status}">${statusText}</span>
                </div>

                <div class="booking-info">
                    <div class="booking-info-item">
                        <span class="booking-info-label">Время:</span>
                        <span>${timeInfo}</span>
                    </div>
                    ${tarotInfo}
                    <div class="booking-info-item">
                        <span class="booking-info-label">Контакт:</span>
                        <span>${booking.clientContact}</span>
                    </div>
                    <div class="booking-info-item">
                        <span class="booking-info-label">Тип:</span>
                        <span>Онлайн консультация</span>
                    </div>
                    ${priceInfo}
                    ${booking.question ? `
                        <div class="booking-info-item">
                            <span class="booking-info-label">Вопрос:</span>
                            <span>${booking.question}</span>
                        </div>
                    ` : ''}
                </div>

                ${actionsHtml}
            </div>
        `;
    },

    // Проверить можно ли отменить запись
    canCancelBooking(booking) {
        if (booking.status !== CONFIG.BOOKING_STATUS.PENDING &&
            booking.status !== CONFIG.BOOKING_STATUS.CONFIRMED) {
            return false;
        }

        const slot = TimeSlotStorage.findById(booking.slotId);
        if (slot) {
            const slotStart = new Date(slot.start);
            const now = new Date();
            const diffHours = (slotStart - now) / (1000 * 60 * 60);
            return diffHours >= 1; // Минимум час до начала
        }

        return true;
    },

    // Подтвердить запись (для таролога)
    confirmBooking(bookingId) {
        if (typeof AdminPanel !== 'undefined') {
            AdminPanel.confirmBooking(bookingId);
        } else {
            ConfigUtils.log('AdminPanel не найден');
        }
    },

    // Отклонить запись (для таролога)
    rejectBooking(bookingId) {
        if (typeof AdminPanel !== 'undefined') {
            AdminPanel.rejectBooking(bookingId);
        } else {
            ConfigUtils.log('AdminPanel не найден');
        }
    },

    // Завершить консультацию (для таролога)
    completeBooking(bookingId) {
        if (typeof AdminPanel !== 'undefined') {
            AdminPanel.completeBooking(bookingId);
        } else {
            ConfigUtils.log('AdminPanel не найден');
        }
    },

    // Отменить запись (для клиента)
    cancelClientBooking(bookingId) {
        if (typeof BookingSystem !== 'undefined') {
            BookingSystem.cancelExistingBooking(bookingId);
        } else {
            ConfigUtils.log('BookingSystem не найден');
        }
    },

    // Просмотр деталей записи
    viewBookingDetails(bookingId) {
        const booking = BookingStorage.findById(bookingId);
        if (!booking) {
            TelegramApp.showAlert('Запись не найдена');
            return;
        }

        const slot = TimeSlotStorage.findById(booking.slotId);
        const timeInfo = slot ? this.formatDateTime(slot.start) + ' - ' + this.formatTime(slot.end) : 'Время не найдено';

        const modalContent = `
            <div class="booking-details">
                <div class="detail-group">
                    <h4>Основная информация</h4>
                    <p><strong>Клиент:</strong> ${booking.clientName}</p>
                    <p><strong>Время:</strong> ${timeInfo}</p>
                    <p><strong>Статус:</strong> ${this.getStatusText(booking.status)}</p>
                    ${booking.tarotName ? `<p><strong>Таролог:</strong> ${booking.tarotName}</p>` : ''}
                    ${booking.price ? `<p><strong>Стоимость:</strong> ${booking.price}₽</p>` : ''}
                </div>

                <div class="detail-group">
                    <h4>Контактная информация</h4>
                    <p><strong>Способ связи:</strong> ${booking.clientContact}</p>
                </div>

                ${booking.question ? `
                    <div class="detail-group">
                        <h4>Вопрос клиента</h4>
                        <p>${booking.question}</p>
                    </div>
                ` : ''}

                <div class="detail-group">
                    <h4>Служебная информация</h4>
                    <p><strong>ID записи:</strong> ${booking.id}</p>
                    <p><strong>Создано:</strong> ${this.formatDateTime(booking.createdAt)}</p>
                    ${booking.confirmedAt ? `<p><strong>Подтверждено:</strong> ${this.formatDateTime(booking.confirmedAt)}</p>` : ''}
                    ${booking.cancelledAt ? `<p><strong>Отменено:</strong> ${this.formatDateTime(booking.cancelledAt)}</p>` : ''}
                    ${booking.completedAt ? `<p><strong>Завершено:</strong> ${this.formatDateTime(booking.completedAt)}</p>` : ''}
                </div>
            </div>
        `;

        if (typeof Modal !== 'undefined') {
            Modal.showHTML(modalContent, 'Детали записи', 'medium');
        }
    },

    // Получить текст статуса
    getStatusText(status) {
        const statusTexts = {
            [CONFIG.BOOKING_STATUS.PENDING]: 'Ожидает подтверждения',
            [CONFIG.BOOKING_STATUS.CONFIRMED]: 'Подтверждено',
            [CONFIG.BOOKING_STATUS.CANCELLED]: 'Отменено',
            [CONFIG.BOOKING_STATUS.COMPLETED]: 'Завершено'
        };
        return statusTexts[status] || status;
    },

    // Создать форму записи с информацией о тарологе
    createBookingForm(slot, tarot) {
        const startDate = new Date(slot.start);
        const endDate = new Date(slot.end);
        const dateStr = startDate.toLocaleDateString('ru-RU');
        const timeStr = `${startDate.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'})} - ${endDate.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'})}`;

        const tarotInfo = tarot ? `
            <div class="form-group booking-tarot-info">
                <div class="tarot-info-card">
                    <div class="tarot-info-header">
                        <h4>Ваш таролог</h4>
                    </div>
                    <div class="tarot-info-content">
                        <div class="tarot-avatar">
                            ${tarot.photoUrl ?
                                `<img src="${tarot.photoUrl}" alt="${tarot.tarotData.displayName}">` :
                                `<div class="avatar-placeholder">${tarot.tarotData.displayName.charAt(0)}</div>`
                            }
                        </div>
                        <div class="tarot-details">
                            <h5>${tarot.tarotData.displayName}</h5>
                            <p class="tarot-price">Стоимость: ${tarot.tarotData.price}₽</p>
                            <p class="tarot-experience">${this.getExperienceText(tarot.tarotData.experience)}</p>
                        </div>
                    </div>
                </div>
            </div>
        ` : '';

        return `
            <div class="booking-form fade-in">
                <h3>Заполните данные для записи</h3>

                ${tarotInfo}

                <div class="form-group">
                    <label>Выбранное время:</label>
                    <input type="text" id="selected-time" value="${dateStr} ${timeStr}" readonly>
                </div>

                <div class="form-group">
                    <label>Ваше имя:</label>
                    <input type="text" id="client-name" required placeholder="Как к вам обращаться">
                </div>

                <div class="form-group">
                    <label>Способ связи:</label>
                    <input type="text" id="client-contact" required placeholder="Telegram, WhatsApp, телефон">
                    <small>Таролог свяжется с вами для подтверждения</small>
                </div>

                <div class="form-group">
                    <label>Вопрос или тема консультации (необязательно):</label>
                    <textarea id="client-question" rows="3" placeholder="Опишите что вас интересует или оставьте пустым"></textarea>
                    <small>Это поможет тарологу лучше подготовиться к консультации</small>
                </div>

                <div class="form-actions">
                    <button class="primary-btn" onclick="Components.submitBookingForm('${slot.id}')">
                        🔮 Записаться на консультацию
                    </button>
                    <button class="secondary-btn" onclick="Components.cancelBookingForm()">
                        Отмена
                    </button>
                </div>
            </div>
        `;
    },

    // Получить текст опыта
    getExperienceText(experience) {
        const experiences = {
            'beginner': 'Начинающий таролог',
            'intermediate': 'Практикующий таролог',
            'advanced': 'Опытный таролог',
            'expert': 'Эксперт-таролог'
        };
        return experiences[experience] || 'Таролог';
    },

    // Отправить форму записи
    submitBookingForm(slotId) {
        if (typeof BookingSystem !== 'undefined') {
            BookingSystem.submitBooking(slotId);
        } else {
            ConfigUtils.log('BookingSystem не найден');
        }
    },

    // Отменить форму записи
    cancelBookingForm() {
        if (typeof BookingSystem !== 'undefined') {
            BookingSystem.cancelBooking();
        } else {
            ConfigUtils.log('BookingSystem не найден');
        }
    },

    // Создать карточку таролога
    createTarotCard(tarot) {
        const tarotData = tarot.tarotData;

        return `
            <div class="tarot-card" onclick="Components.selectTarot('${tarot.id}')">
                <div class="tarot-header">
                    <div class="tarot-avatar">
                        ${tarot.photoUrl ?
                            `<img src="${tarot.photoUrl}" alt="${tarotData.displayName}">` :
                            `<div class="avatar-placeholder">${tarotData.displayName.charAt(0)}</div>`
                        }
                    </div>
                    <div class="tarot-info">
                        <h4>${tarotData.displayName}</h4>
                        <p class="tarot-experience">${this.getExperienceText(tarotData.experience)}</p>
                    </div>
                </div>

                <div class="tarot-details">
                    <div class="tarot-price">
                        <span class="price-label">Стоимость:</span>
                        <span class="price-value">${tarotData.price}₽</span>
                    </div>

                    ${tarotData.specialization ? `
                        <div class="tarot-specialization">
                            <p>${tarotData.specialization}</p>
                        </div>
                    ` : ''}

                    <div class="tarot-stats">
                        <span class="stat-item">
                            <span class="stat-icon">⭐</span>
                            <span class="stat-value">${tarotData.rating || '5.0'}</span>
                        </span>
                        <span class="stat-item">
                            <span class="stat-icon">👥</span>
                            <span class="stat-value">${tarotData.totalConsultations || 0}</span>
                        </span>
                    </div>
                </div>

                <div class="tarot-actions">
                    <button class="primary-btn btn-sm">
                        Записаться
                    </button>
                </div>
            </div>
        `;
    },

    // Выбрать таролога
    selectTarot(tarotId) {
        if (typeof BookingSystem !== 'undefined') {
            BookingSystem.selectTarot(tarotId);
        } else {
            ConfigUtils.log('BookingSystem не найден');
        }
    },

    // Создать уведомление
    createNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type} fade-in`;

        const icon = this.getNotificationIcon(type);

        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">${icon}</div>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        // Добавляем стили если их нет
        if (!document.getElementById('notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    background: var(--card-bg);
                    border-radius: var(--border-radius);
                    box-shadow: var(--shadow-hover);
                    z-index: 10000;
                    max-width: 400px;
                    border-left: 4px solid var(--info-color);
                    margin-bottom: 10px;
                    animation: slideInRight 0.3s ease;
                }
                .notification.success { border-left-color: var(--success-color); }
                .notification.warning { border-left-color: var(--warning-color); }
                .notification.error { border-left-color: var(--danger-color); }

                .notification-content {
                    padding: 15px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .notification-icon {
                    font-size: 1.2rem;
                    flex-shrink: 0;
                }
                .notification-message {
                    flex: 1;
                    color: var(--text-color);
                    font-size: 0.9rem;
                }
                .notification-close {
                    background: none;
                    border: none;
                    font-size: 18px;
                    cursor: pointer;
                    color: var(--hint-color);
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    flex-shrink: 0;
                }
                .notification-close:hover {
                    background: var(--border-color);
                }

                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `;
            document.head.appendChild(styles);
        }

        // Добавляем к контейнеру уведомлений
        const container = document.getElementById('notifications') || this.createNotificationsContainer();
        container.appendChild(notification);

        // Автоматически убираем через 5 секунд
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideInRight 0.3s ease reverse';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);

        return notification;
    },

    // Создать контейнер для уведомлений
    createNotificationsContainer() {
        let container = document.getElementById('notifications');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notifications';
            container.className = 'notifications-container';
            container.style.cssText = `
                position: fixed;
                top: 80px;
                right: 16px;
                z-index: 3000;
                pointer-events: none;
                max-width: 400px;
            `;
            document.body.appendChild(container);
        }
        return container;
    },

    // Получить иконку для уведомления
    getNotificationIcon(type) {
        const icons = {
            'info': 'ℹ️',
            'success': '✅',
            'warning': '⚠️',
            'error': '❌'
        };
        return icons[type] || icons.info;
    },

    // Показать уведомление
    showNotification(message, type = 'info') {
        this.createNotification(message, type);
    },

    // Форматировать дату
    formatDate(date) {
        return new Date(date).toLocaleDateString('ru-RU');
    },

    // Форматировать время
    formatTime(date) {
        return new Date(date).toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'});
    },

    // Форматировать дату и время
    formatDateTime(date) {
        return new Date(date).toLocaleString('ru-RU');
    },

    // Проверить валидность email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Проверить валидность телефона
    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    },

    // Очистить HTML от потенциально опасных тегов
    sanitizeHTML(html) {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    },

    // Создать переключатель темы
    createThemeToggle() {
        const isDark = document.body.classList.contains('dark-theme');
        const icon = isDark ? '☀️' : '🌙';
        const text = isDark ? 'Светлая' : 'Темная';

        return `
            <button class="theme-toggle" onclick="Components.toggleTheme()">
                ${icon} ${text}
            </button>
        `;
    },

    // Переключить тему
    toggleTheme() {
        const newTheme = ConfigUtils.toggleTheme();

        // Обновляем все переключатели темы
        document.querySelectorAll('.theme-toggle').forEach(btn => {
            const isDark = newTheme === 'dark';
            const icon = isDark ? '☀️' : '🌙';
            const text = isDark ? 'Светлая' : 'Темная';
            btn.innerHTML = `${icon} ${text}`;
        });

        // Тактильная обратная связь
        if (typeof TelegramApp !== 'undefined') {
            TelegramApp.hapticFeedback('selection');
        }
    },

    // Создать кнопку регистрации таролога
    createTarotRegistrationButton() {
        return `
            <div class="tarot-registration-card">
                <div class="registration-content">
                    <h3>🔮 Хотите стать тарологом?</h3>
                    <p>Присоединяйтесь к нашему сообществу и начните проводить консультации</p>
                    <button class="primary-btn" onclick="Components.openTarotRegistration()">
                        Зарегистрироваться как таролог
                    </button>
                </div>
            </div>
        `;
    },

    // Открыть регистрацию таролога
    openTarotRegistration() {
        window.location.href = 'tarot-register.html';
    }
};

// Экспортируем модуль
window.Components = Components;