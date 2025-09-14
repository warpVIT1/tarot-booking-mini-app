// Модуль авторизации с исправленной логикой ролей
const AuthSystem = {
    currentUser: null,
    selectedTarot: null, // Выбранный таролог для записи

    // Инициализация системы авторизации
    init() {
        ConfigUtils.log('🔐 Инициализация системы авторизации');

        // Отладочная информация
        this.debugTelegramEnvironment();

        // Проверяем существующую авторизацию
        const hasExistingAuth = this.checkExistingAuth();

        if (hasExistingAuth) {
            ConfigUtils.log('✅ Найдена существующая авторизация');
            return true;
        }

        // Автоматическая авторизация через Telegram
        const autoAuthResult = this.attemptAutoAuth();

        if (autoAuthResult) {
            ConfigUtils.log('✅ Автоматическая авторизация успешна');
            return true;
        }

        ConfigUtils.log('❌ Автоматическая авторизация не удалась');
        return false;
    },

    // Отладка Telegram окружения
    debugTelegramEnvironment() {
        try {
            ConfigUtils.log('🔍 === ОТЛАДКА TELEGRAM ENVIRONMENT ===');

            ConfigUtils.log('window.Telegram:', typeof window.Telegram);
            ConfigUtils.log('window.Telegram.WebApp:', typeof window.Telegram?.WebApp);

            if (window.Telegram?.WebApp) {
                const tg = window.Telegram.WebApp;
                ConfigUtils.log('Telegram.WebApp.initData:', tg.initData ? 'Присутствует' : 'Отсутствует');
                ConfigUtils.log('Telegram.WebApp.initDataUnsafe:', tg.initDataUnsafe);
                ConfigUtils.log('Telegram.WebApp.version:', tg.version);
                ConfigUtils.log('Telegram.WebApp.platform:', tg.platform);
                ConfigUtils.log('Telegram.WebApp.colorScheme:', tg.colorScheme);

                if (tg.initDataUnsafe?.user) {
                    ConfigUtils.log('User data найден:', {
                        id: tg.initDataUnsafe.user.id,
                        first_name: tg.initDataUnsafe.user.first_name,
                        language_code: tg.initDataUnsafe.user.language_code
                    });
                } else {
                    ConfigUtils.log('❌ User data не найден в initDataUnsafe');
                }

                // Проверяем start_param для записи к тарологу
                if (tg.initDataUnsafe?.start_param) {
                    ConfigUtils.log('start_param найден:', tg.initDataUnsafe.start_param);
                    this.handleStartParam(tg.initDataUnsafe.start_param);
                }
            } else {
                ConfigUtils.log('❌ Telegram.WebApp недоступен');
            }

            ConfigUtils.log('🔍 === КОНЕЦ ОТЛАДКИ ===');
        } catch (error) {
            ConfigUtils.error('Ошибка отладки Telegram environment:', error);
        }
    },

    // Обработка start_param
    handleStartParam(startParam) {
        if (startParam.startsWith('tarot_')) {
            // Это ссылка для записи к конкретному тарологу
            const tarotId = startParam.replace('tarot_', '');
            ConfigUtils.log('🔗 Обнаружена ссылка для записи к тарологу:', tarotId);

            this.selectedTarot = tarotId;

            // Сохраняем информацию о выбранном тарологе
            this.saveSelectedTarot(tarotId);

            // Показываем подтверждение записи к тарологу
            this.showTarotBookingConfirmation(tarotId);
        }
    },

    // Сохранить выбранного таролога
    saveSelectedTarot(tarotId) {
        // Получаем информацию о тарологе
        const tarotsList = Storage.get('tarots_list') || [];
        const tarotInfo = tarotsList.find(t => t.id.toString() === tarotId.toString());

        if (tarotInfo) {
            // Сохраняем в клиентскую связку
            const clientTarotConnection = Storage.get(CONFIG.STORAGE_KEYS.TAROT_CLIENTS) || {};

            // Получаем текущего пользователя или создаем временную запись
            const currentUser = this.getCurrentUser();
            const userId = currentUser ? currentUser.id : 'temp_' + Date.now();

            if (!clientTarotConnection[userId]) {
                clientTarotConnection[userId] = {
                    selectedTarots: [],
                    currentTarot: null,
                    createdAt: new Date().toISOString()
                };
            }

            // Добавляем таролога в список если его нет
            if (!clientTarotConnection[userId].selectedTarots.find(t => t.tarotId === tarotId)) {
                clientTarotConnection[userId].selectedTarots.push({
                    tarotId: tarotId,
                    tarotName: tarotInfo.tarotData.displayName,
                    addedAt: new Date().toISOString()
                });
            }

            // Устанавливаем как текущего таролога
            clientTarotConnection[userId].currentTarot = tarotId;

            Storage.set(CONFIG.STORAGE_KEYS.TAROT_CLIENTS, clientTarotConnection);

            ConfigUtils.log('🔗 Таролог сохранен для пользователя:', userId, '→', tarotInfo.tarotData.displayName);
        }
    },

    // Показать подтверждение записи к тарологу
    showTarotBookingConfirmation(tarotId) {
        const tarotsList = Storage.get('tarots_list') || [];
        const tarotInfo = tarotsList.find(t => t.id.toString() === tarotId.toString());

        if (!tarotInfo) {
            ConfigUtils.error('Таролог не найден:', tarotId);
            return;
        }

        // Проверяем, есть ли уже связь с другим тарологом
        const currentUser = this.getCurrentUser();
        if (currentUser) {
            const clientConnections = Storage.get(CONFIG.STORAGE_KEYS.TAROT_CLIENTS) || {};
            const userConnections = clientConnections[currentUser.id];

            if (userConnections && userConnections.currentTarot && userConnections.currentTarot !== tarotId) {
                // У пользователя уже есть другой таролог
                this.showSwitchTarotConfirmation(userConnections.currentTarot, tarotId);
                return;
            }
        }

        // Стандартное подтверждение записи
        setTimeout(() => {
            if (typeof TelegramApp !== 'undefined') {
                TelegramApp.showConfirm(
                    `Хотите записаться на консультацию к тарологу ${tarotInfo.tarotData.displayName}?`,
                    (confirmed) => {
                        if (confirmed) {
                            ConfigUtils.log('✅ Пользователь подтвердил запись к тарологу');
                            // Продолжаем обычную авторизацию
                        } else {
                            ConfigUtils.log('❌ Пользователь отменил запись к тарологу');
                            this.selectedTarot = null;
                        }
                    }
                );
            }
        }, 1000);
    },

    // Показать подтверждение смены таролога
    showSwitchTarotConfirmation(currentTarotId, newTarotId) {
        const tarotsList = Storage.get('tarots_list') || [];
        const currentTarot = tarotsList.find(t => t.id.toString() === currentTarotId.toString());
        const newTarot = tarotsList.find(t => t.id.toString() === newTarotId.toString());

        if (!currentTarot || !newTarot) {
            ConfigUtils.error('Таролог не найден при смене:', { currentTarotId, newTarotId });
            return;
        }

        setTimeout(() => {
            if (typeof TelegramApp !== 'undefined') {
                TelegramApp.showConfirm(
                    `Вы уже записаны к тарологу ${currentTarot.tarotData.displayName}.

Хотите отписаться и записаться к ${newTarot.tarotData.displayName}?`,
                    (confirmed) => {
                        if (confirmed) {
                            ConfigUtils.log('✅ Пользователь подтвердил смену таролога');
                            this.switchTarot(currentTarotId, newTarotId);
                        } else {
                            ConfigUtils.log('❌ Пользователь остался с текущим тарологом');
                            // Показываем возможность иметь несколько тарологов
                            this.showMultipleTarotsOption(newTarotId);
                        }
                    }
                );
            }
        }, 1000);
    },

    // Показать опцию множественных тарологов
    showMultipleTarotsOption(newTarotId) {
        const tarotsList = Storage.get('tarots_list') || [];
        const newTarot = tarotsList.find(t => t.id.toString() === newTarotId.toString());

        if (!newTarot) return;

        setTimeout(() => {
            if (typeof TelegramApp !== 'undefined') {
                TelegramApp.showConfirm(
                    `Хотите добавить ${newTarot.tarotData.displayName} в ваш список тарологов?

Вы сможете выбирать между разными тарологами при записи.`,
                    (confirmed) => {
                        if (confirmed) {
                            ConfigUtils.log('✅ Пользователь добавил дополнительного таролога');
                            this.addAdditionalTarot(newTarotId);
                        }
                    }
                );
            }
        }, 500);
    },

    // Переключить таролога
    switchTarot(currentTarotId, newTarotId) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return;

        const clientConnections = Storage.get(CONFIG.STORAGE_KEYS.TAROT_CLIENTS) || {};
        const userConnections = clientConnections[currentUser.id];

        if (userConnections) {
            // Отменяем все активные записи к старому тарологу
            this.cancelBookingsWithTarot(currentUser.id, currentTarotId);

            // Переключаем на нового таролога
            userConnections.currentTarot = newTarotId;

            Storage.set(CONFIG.STORAGE_KEYS.TAROT_CLIENTS, clientConnections);

            ConfigUtils.log('🔄 Таролог переключен:', currentTarotId, '→', newTarotId);
        }
    },

    // Добавить дополнительного таролога
    addAdditionalTarot(tarotId) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return;

        const clientConnections = Storage.get(CONFIG.STORAGE_KEYS.TAROT_CLIENTS) || {};

        if (!clientConnections[currentUser.id]) {
            clientConnections[currentUser.id] = {
                selectedTarots: [],
                currentTarot: null,
                createdAt: new Date().toISOString()
            };
        }

        const userConnections = clientConnections[currentUser.id];

        // Добавляем таролога в список если его нет
        if (!userConnections.selectedTarots.find(t => t.tarotId === tarotId)) {
            const tarotsList = Storage.get('tarots_list') || [];
            const tarotInfo = tarotsList.find(t => t.id.toString() === tarotId.toString());

            if (tarotInfo) {
                userConnections.selectedTarots.push({
                    tarotId: tarotId,
                    tarotName: tarotInfo.tarotData.displayName,
                    addedAt: new Date().toISOString()
                });

                Storage.set(CONFIG.STORAGE_KEYS.TAROT_CLIENTS, clientConnections);

                ConfigUtils.log('➕ Добавлен дополнительный таролог:', tarotInfo.tarotData.displayName);
            }
        }
    },

    // Отменить записи к конкретному тарологу
    cancelBookingsWithTarot(userId, tarotId) {
        const bookings = BookingStorage.getAll();
        const userBookings = bookings.filter(b =>
            b.clientId === userId &&
            b.tarotId.toString() === tarotId.toString() &&
            (b.status === CONFIG.BOOKING_STATUS.PENDING || b.status === CONFIG.BOOKING_STATUS.CONFIRMED)
        );

        userBookings.forEach(booking => {
            BookingStorage.update(booking.id, {
                status: CONFIG.BOOKING_STATUS.CANCELLED,
                cancelledBy: 'client',
                cancelledReason: 'Смена таролога'
            });

            // Освобождаем временной слот
            if (booking.slotId) {
                TimeSlotStorage.update(booking.slotId, {
                    status: CONFIG.SLOT_STATUS.AVAILABLE
                });
            }
        });

        ConfigUtils.log('❌ Отменены записи к тарологу:', tarotId, '(количество:', userBookings.length + ')');
    },

    // Попытка автоматической авторизации
    attemptAutoAuth() {
        try {
            // Определяем роль пользователя
            const role = this.determineUserRole();
            ConfigUtils.log('🎭 Определена роль:', role);

            // Получаем данные пользователя из Telegram
            const telegramUser = TelegramApp.getUserData();

            if (!telegramUser) {
                ConfigUtils.log('❌ Не удалось получить данные пользователя из Telegram');

                // В DEV режиме используем тестового пользователя
                if (CONFIG.DEV_MODE) {
                    ConfigUtils.log('🔧 Используем тестового пользователя (DEV MODE)');
                    return this.createDevUser(role);
                }

                return false;
            }

            ConfigUtils.log('✅ Данные пользователя получены:', telegramUser);

            // Создаем пользователя
            const user = this.createUserFromTelegram(telegramUser, role);

            // Сохраняем пользователя
            this.currentUser = user;
            Storage.set(CONFIG.STORAGE_KEYS.USER_DATA, user);

            ConfigUtils.log('✅ Пользователь создан и сохранен:', user);
            return true;

        } catch (error) {
            ConfigUtils.error('❌ Ошибка автоматической авторизации:', error);

            // В DEV режиме создаем тестового пользователя
            if (CONFIG.DEV_MODE) {
                ConfigUtils.log('🔧 Fallback к тестовому пользователю');
                const role = this.determineUserRole();
                return this.createDevUser(role);
            }

            return false;
        }
    },

    // Определение роли пользователя (ИСПРАВЛЕНО)
    determineUserRole() {
        // 1. Проверяем, есть ли сохраненный таролог
        const savedUser = Storage.get(CONFIG.STORAGE_KEYS.USER_DATA);
        if (savedUser && savedUser.role === CONFIG.USER_ROLES.TAROT) {
            ConfigUtils.log('🎭 Найден сохраненный таролог, открываем панель таролога');
            return CONFIG.USER_ROLES.TAROT;
        }

        // 2. По умолчанию все новые пользователи - клиенты
        ConfigUtils.log('🎭 Назначена роль клиента (по умолчанию)');
        return CONFIG.USER_ROLES.CLIENT;
    },

    // Создание пользователя из данных Telegram
    createUserFromTelegram(telegramUser, role) {
        const user = {
            id: telegramUser.id,
            telegramId: telegramUser.id,
            firstName: telegramUser.firstName,
            lastName: telegramUser.lastName || '',
            username: telegramUser.username || '',
            role: role,
            languageCode: telegramUser.languageCode || 'ru',
            isPremium: telegramUser.isPremium || false,
            photoUrl: telegramUser.photoUrl || '',
            registeredAt: new Date().toISOString(),

            // Связь с тарологом (если есть)
            selectedTarot: this.selectedTarot
        };

        ConfigUtils.log('👤 Создан пользователь:', user);
        return user;
    },

    // Создание тестового пользователя для разработки
    createDevUser(role) {
        try {
            const testUser = {
                id: CONFIG.DEV_USER.id,
                telegramId: CONFIG.DEV_USER.id,
                firstName: CONFIG.DEV_USER.first_name,
                lastName: CONFIG.DEV_USER.last_name || '',
                username: CONFIG.DEV_USER.username || '',
                role: role,
                languageCode: CONFIG.DEV_USER.language_code || 'ru',
                isPremium: false,
                photoUrl: '',
                registeredAt: new Date().toISOString(),
                selectedTarot: this.selectedTarot
            };

            this.currentUser = testUser;
            Storage.set(CONFIG.STORAGE_KEYS.USER_DATA, testUser);

            ConfigUtils.log('🔧 Тестовый пользователь создан:', testUser);
            return true;
        } catch (error) {
            ConfigUtils.error('❌ Ошибка создания тестового пользователя:', error);
            return false;
        }
    },

    // Проверка существующей авторизации
    checkExistingAuth() {
        try {
            const savedUser = Storage.get(CONFIG.STORAGE_KEYS.USER_DATA);

            if (savedUser && this.validateUser(savedUser)) {
                this.currentUser = savedUser;

                // Проверяем, не изменилась ли роль (например, стал тарологом)
                if (savedUser.role === CONFIG.USER_ROLES.TAROT) {
                    ConfigUtils.log('✅ Найден сохраненный таролог:', savedUser.firstName);
                } else {
                    ConfigUtils.log('✅ Найден сохраненный клиент:', savedUser.firstName);
                }

                return true;
            }

            return false;
        } catch (error) {
            ConfigUtils.error('❌ Ошибка проверки существующей авторизации:', error);
            return false;
        }
    },

    // Валидация данных пользователя
    validateUser(user) {
        return user && user.id && user.firstName && user.role;
    },

    // Получить текущего пользователя
    getCurrentUser() {
        return this.currentUser;
    },

    // Проверить роль пользователя
    hasRole(role) {
        return this.currentUser && this.currentUser.role === role;
    },

    // Обновить данные пользователя
    updateUser(updates) {
        if (!this.currentUser) return false;

        this.currentUser = { ...this.currentUser, ...updates };
        Storage.set(CONFIG.STORAGE_KEYS.USER_DATA, this.currentUser);

        ConfigUtils.log('✅ Данные пользователя обновлены');
        return true;
    },

    // Стать тарологом
    becomeTarot(tarotData) {
        if (!this.currentUser) return false;

        // Обновляем роль и добавляем данные таролога
        this.updateUser({
            role: CONFIG.USER_ROLES.TAROT,
            tarotData: tarotData,
            tarotReferralCode: 'tarot_' + this.currentUser.id,
            becameTarotAt: new Date().toISOString()
        });

        ConfigUtils.log('🔮 Пользователь стал тарологом:', this.currentUser.firstName);
        return true;
    },

    // Получить связанных тарологов клиента
    getClientTarots() {
        if (!this.currentUser || this.currentUser.role !== CONFIG.USER_ROLES.CLIENT) {
            return [];
        }

        const clientConnections = Storage.get(CONFIG.STORAGE_KEYS.TAROT_CLIENTS) || {};
        const userConnections = clientConnections[this.currentUser.id];

        if (!userConnections) return [];

        return userConnections.selectedTarots || [];
    },

    // Получить текущего активного таролога
    getCurrentTarot() {
        if (!this.currentUser || this.currentUser.role !== CONFIG.USER_ROLES.CLIENT) {
            return null;
        }

        const clientConnections = Storage.get(CONFIG.STORAGE_KEYS.TAROT_CLIENTS) || {};
        const userConnections = clientConnections[this.currentUser.id];

        if (!userConnections || !userConnections.currentTarot) return null;

        // Получаем информацию о тарологе
        const tarotsList = Storage.get('tarots_list') || [];
        return tarotsList.find(t => t.id.toString() === userConnections.currentTarot.toString());
    },

    // Проверить конфликт времени с другими тарологами
    checkTimeConflict(slotStart, slotEnd, excludeTarotId = null) {
        if (!this.currentUser) return false;

        const allBookings = BookingStorage.getUserBookings(this.currentUser.id);

        // Проверяем активные записи
        const activeBookings = allBookings.filter(booking =>
            booking.status === CONFIG.BOOKING_STATUS.PENDING ||
            booking.status === CONFIG.BOOKING_STATUS.CONFIRMED
        );

        const conflictBooking = activeBookings.find(booking => {
            // Пропускаем записи к тому же тарологу
            if (excludeTarotId && booking.tarotId.toString() === excludeTarotId.toString()) {
                return false;
            }

            const slot = TimeSlotStorage.findById(booking.slotId);
            if (!slot) return false;

            const bookingStart = new Date(slot.start);
            const bookingEnd = new Date(slot.end);
            const newStart = new Date(slotStart);
            const newEnd = new Date(slotEnd);

            // Проверяем пересечение времени
            return (newStart < bookingEnd && newEnd > bookingStart);
        });

        if (conflictBooking) {
            const conflictSlot = TimeSlotStorage.findById(conflictBooking.slotId);
            ConfigUtils.log('⚠️ Обнаружен конфликт времени:', {
                existingBooking: conflictBooking,
                conflictSlot: conflictSlot
            });

            return {
                hasConflict: true,
                conflictBooking: conflictBooking,
                conflictSlot: conflictSlot
            };
        }

        return { hasConflict: false };
    },

    // Выход из системы
    logout() {
        if (typeof TelegramApp !== 'undefined') {
            TelegramApp.showConfirm('Вы уверены, что хотите выйти?', (confirmed) => {
                if (confirmed) {
                    Storage.clear();
                    this.currentUser = null;
                    this.selectedTarot = null;
                    window.location.reload();
                }
            });
        } else {
            if (confirm('Вы уверены, что хотите выйти?')) {
                Storage.clear();
                this.currentUser = null;
                this.selectedTarot = null;
                window.location.reload();
            }
        }
    }
};

// Экспортируем модуль
window.AuthSystem = AuthSystem;