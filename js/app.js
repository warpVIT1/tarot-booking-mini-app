// Главный модуль приложения - исправленная версия
const App = {
    // Состояние приложения
    state: {
        initialized: false,
        currentScreen: 'loading',
        user: null,
        role: null,
        selectedTarot: null
    },

    // Инициализация приложения
    async init() {
        ConfigUtils.log('🚀 Запуск Tarot Booking App v' + CONFIG.VERSION);

        try {
            // Показываем загрузочный экран
            this.showLoadingScreen();

            // Небольшая задержка для UX
            await this.delay(1000);

            // Принудительный переход к основному интерфейсу через 4 секунды
            setTimeout(() => {
                if (!this.state.initialized) {
                    ConfigUtils.log('⚠️ Принудительный запуск приложения');
                    this.forceShowMainApp();
                }
            }, 4000);

            // Попытка инициализации
            await this.tryInitialization();

        } catch (error) {
            ConfigUtils.error('💥 Критическая ошибка инициализации:', error);
            this.forceShowMainApp();
        }
    },

    // Попытка инициализации
    async tryInitialization() {
        try {
            // Инициализируем конфигурацию (язык, тема)
            ConfigUtils.init();

            // Инициализируем Telegram Web App
            TelegramApp.init();

            // Задержка для инициализации Telegram
            await this.delay(500);

            // Инициализируем систему хранения
            this.initStorage();

            // Попытка авторизации
            const authResult = this.tryAuth();

            // Если авторизация прошла
            if (authResult) {
                this.state.user = AuthSystem.getCurrentUser();
                this.state.role = this.state.user?.role;
                ConfigUtils.log('✅ Пользователь авторизован:', this.state.user?.firstName, 'роль:', this.state.role);
            } else {
                // Создаем тестового пользователя
                ConfigUtils.log('⚠️ Создаем тестового пользователя');
                this.createTestUser();
            }

            // Проверяем выбранного таролога
            this.checkSelectedTarot();

            // Показываем основное приложение
            await this.delay(500);
            this.showMainApp();

            this.state.initialized = true;
            ConfigUtils.log('✅ Приложение инициализировано');

        } catch (error) {
            ConfigUtils.error('❌ Ошибка попытки инициализации:', error);
            this.forceShowMainApp();
        }
    },

    // Проверить выбранного таролога
    checkSelectedTarot() {
        if (this.state.user && this.state.user.selectedTarot) {
            this.state.selectedTarot = this.state.user.selectedTarot;
            ConfigUtils.log('🔗 Обнаружен выбранный таролог:', this.state.selectedTarot);
        }
    },

    // Попытка авторизации
    tryAuth() {
        try {
            // Проверяем Telegram Web App
            if (ConfigUtils.isTelegramApp()) {
                const authResult = AuthSystem.init();
                if (authResult) {
                    return true;
                }
            }

            // Fallback - создаем тестового пользователя
            return false;

        } catch (error) {
            ConfigUtils.error('❌ Ошибка авторизации:', error);
            return false;
        }
    },

    // Создание тестового пользователя
    createTestUser() {
        try {
            // По умолчанию все новые пользователи - клиенты
            const role = CONFIG.USER_ROLES.CLIENT;

            const testUser = {
                id: Date.now(),
                telegramId: Date.now(),
                firstName: 'Тестовый пользователь',
                lastName: '',
                username: 'test_user',
                role: role,
                languageCode: 'ru',
                isPremium: false,
                photoUrl: '',
                registeredAt: new Date().toISOString(),
                selectedTarot: this.state.selectedTarot
            };

            // Сохраняем тестового пользователя
            AuthSystem.currentUser = testUser;
            Storage.set(CONFIG.STORAGE_KEYS.USER_DATA, testUser);

            this.state.user = testUser;
            this.state.role = role;

            ConfigUtils.log('🔧 Создан тестовый пользователь:', testUser);
            return true;

        } catch (error) {
            ConfigUtils.error('❌ Ошибка создания тестового пользователя:', error);
            return false;
        }
    },

    // Показать загрузочный экран
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('active');
            this.updateLoadingMessage();
        }
    },

    // Обновление сообщения загрузки
    updateLoadingMessage() {
        const loadingText = document.querySelector('#loading-screen p');
        if (loadingText) {
            const messages = [
                'Подключение к Telegram...',
                'Определение языка и темы...',
                'Загрузка профиля...',
                'Инициализация интерфейса...',
                'Почти готово...'
            ];

            let index = 0;
            const updateInterval = setInterval(() => {
                if (index < messages.length && !this.state.initialized) {
                    loadingText.textContent = messages[index];
                    index++;
                } else {
                    clearInterval(updateInterval);
                }
            }, 600);
        }
    },

    // Показать основное приложение
    showMainApp() {
        try {
            // Скрываем загрузочный экран
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.remove('active');
                // Принудительно скрываем через некоторое время
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }

            // Показываем основное приложение
            const mainApp = document.getElementById('main-app');
            if (mainApp) {
                mainApp.classList.add('active');
                mainApp.style.display = 'block';
            }

            // Обновляем интерфейс пользователя
            this.updateUserInterface();

            // Настраиваем навигацию
            this.setupNavigation();

            // Инициализируем модули в зависимости от роли
            this.initRoleBasedModules();

            // Показываем информацию о выбранном тарологе если есть
            this.showSelectedTarotInfo();

            ConfigUtils.log('🎉 Основное приложение показано');

        } catch (error) {
            ConfigUtils.error('❌ Ошибка показа основного приложения:', error);
        }
    },

    // Показать информацию о выбранном тарологе
    showSelectedTarotInfo() {
        if (this.state.selectedTarot && this.state.role === CONFIG.USER_ROLES.CLIENT) {
            // Показываем уведомление о выбранном тарологе
            setTimeout(() => {
                const tarotsList = Storage.get('tarots_list') || [];
                const tarot = tarotsList.find(t => t.id.toString() === this.state.selectedTarot.toString());

                if (tarot) {
                    Components.showNotification(
                        `Вы перешли по ссылке для записи к тарологу ${tarot.tarotData.displayName}`,
                        'info'
                    );
                }
            }, 2000);
        }
    },

    // Принудительный показ приложения
    forceShowMainApp() {
        try {
            ConfigUtils.log('🔧 ПРИНУДИТЕЛЬНЫЙ ЗАПУСК ПРИЛОЖЕНИЯ');

            // Создаем минимального пользователя если его нет
            if (!this.state.user) {
                this.createTestUser();
            }

            // Показываем интерфейс
            this.showMainApp();

            this.state.initialized = true;

        } catch (error) {
            ConfigUtils.error('❌ Ошибка принудительного запуска:', error);

            // Критический fallback - показать хотя бы базовый интерфейс
            document.body.innerHTML = `
                <div style="padding: 20px; text-align: center; background: var(--bg-color); color: var(--text-color); min-height: 100vh;">
                    <h1>🔮 Tarot Booking</h1>
                    <p>Приложение запущено в режиме восстановления</p>
                    <button onclick="window.location.reload()" style="
                        background: var(--primary-color);
                        color: white;
                        border: none;
                        padding: 15px 30px;
                        border-radius: 10px;
                        font-size: 16px;
                        margin-top: 20px;
                        cursor: pointer;
                    ">
                        🔄 Перезапустить
                    </button>
                </div>
            `;
        }
    },

    // Обновление интерфейса пользователя
    updateUserInterface() {
        try {
            const user = this.state.user;
            if (!user) return;

            // Обновляем аватар
            const avatarEl = document.getElementById('user-avatar');
            if (avatarEl) {
                const initials = this.getInitials(user.firstName, user.lastName);
                avatarEl.textContent = initials;
            }

            // Обновляем имя
            const nameEl = document.getElementById('user-name');
            if (nameEl) {
                nameEl.textContent = user.firstName + (user.lastName ? ' ' + user.lastName : '');
            }

            // Обновляем роль
            const contactEl = document.getElementById('user-contact');
            if (contactEl) {
                const roleText = user.role === CONFIG.USER_ROLES.CLIENT ? 'Клиент' :
                               user.role === CONFIG.USER_ROLES.TAROT ? 'Таролог' : 'Администратор';
                contactEl.textContent = roleText;
            }

            // Обновляем переключатель темы
            this.updateThemeToggle();

            ConfigUtils.log('👤 Интерфейс обновлен');

        } catch (error) {
            ConfigUtils.error('❌ Ошибка обновления интерфейса:', error);
        }
    },

    // Обновить переключатель темы
    updateThemeToggle() {
        const themeButtons = document.querySelectorAll('.theme-toggle');
        themeButtons.forEach(btn => {
            const isDark = document.body.classList.contains('dark-theme');
            const icon = isDark ? '☀️' : '🌙';
            const text = isDark ? 'Светлая' : 'Темная';
            btn.innerHTML = `${icon} ${text}`;
        });
    },

    // Получить инициалы
    getInitials(firstName, lastName) {
        const first = firstName ? firstName.charAt(0).toUpperCase() : '';
        const last = lastName ? lastName.charAt(0).toUpperCase() : '';
        return first + last || '👤';
    },

    // Настройка навигации
    setupNavigation() {
        try {
            const navButtons = document.querySelectorAll('.nav-btn');

            navButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const tabName = e.currentTarget.dataset.tab;
                    this.switchTab(tabName);
                });
            });

            // Показываем первую доступную вкладку в зависимости от роли
            this.showDefaultTab();

            ConfigUtils.log('🧭 Навигация настроена');

        } catch (error) {
            ConfigUtils.error('❌ Ошибка настройки навигации:', error);
        }
    },

    // Показать вкладку по умолчанию
    showDefaultTab() {
        const role = this.state.role;
        let defaultTab = 'booking'; // По умолчанию

        if (role === CONFIG.USER_ROLES.TAROT) {
            defaultTab = 'bookings'; // Для тарологов - записи клиентов
        } else if (role === CONFIG.USER_ROLES.CLIENT) {
            defaultTab = 'booking'; // Для клиентов - запись на консультацию
        }

        this.switchTab(defaultTab);
    },

    // Переключение вкладок
    switchTab(tabName) {
        try {
            // Убираем активность
            document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

            // Активируем выбранную
            const navBtn = document.querySelector(`[data-tab="${tabName}"]`);
            const tabContent = document.getElementById(`${tabName}-tab`);

            if (navBtn) navBtn.classList.add('active');
            if (tabContent) tabContent.classList.add('active');

            // Загружаем контент вкладки
            this.loadTabContent(tabName);

            ConfigUtils.log('🔄 Переключение на вкладку:', tabName);

        } catch (error) {
            ConfigUtils.error('❌ Ошибка переключения вкладки:', error);
        }
    },

    // Загрузка контента вкладки
    loadTabContent(tabName) {
        try {
            switch (tabName) {
                case 'booking':
                    this.loadBookingContent();
                    break;
                case 'bookings':
                    this.loadBookingsContent();
                    break;
                case 'schedule':
                    this.loadScheduleContent();
                    break;
                case 'profile':
                    this.loadProfileContent();
                    break;
                case 'referral':
                    this.loadReferralContent();
                    break;
                default:
                    ConfigUtils.log('⚠️ Неизвестная вкладка:', tabName);
            }
        } catch (error) {
            ConfigUtils.error('❌ Ошибка загрузки контента:', error);
        }
    },

    // Загрузка контента записи
    loadBookingContent() {
        if (this.state.role === CONFIG.USER_ROLES.CLIENT) {
            if (typeof BookingSystem !== 'undefined') {
                BookingSystem.init();
            }
        } else if (this.state.role === CONFIG.USER_ROLES.TAROT) {
            if (typeof AdminPanel !== 'undefined') {
                AdminPanel.init();
            }
        }
    },

    // Загрузка контента записей
    loadBookingsContent() {
        const container = document.getElementById('user-bookings') || document.getElementById('admin-bookings');
        if (!container) return;

        if (this.state.role === CONFIG.USER_ROLES.CLIENT) {
            // Показываем записи клиента
            if (typeof BookingSystem !== 'undefined') {
                container.innerHTML = BookingSystem.showBookingHistory();
            }
        } else if (this.state.role === CONFIG.USER_ROLES.TAROT) {
            // Показываем записи таролога
            if (typeof AdminPanel !== 'undefined') {
                AdminPanel.loadBookings();
            }
        }
    },

    // Загрузка расписания
    loadScheduleContent() {
        if (this.state.role === CONFIG.USER_ROLES.TAROT) {
            if (typeof AdminPanel !== 'undefined') {
                AdminPanel.setupTimeManagement();
            }
        }
    },

    // Загрузка профиля
    loadProfileContent() {
        if (typeof ProfileManager !== 'undefined') {
            ProfileManager.init();
        }

        // Добавляем кнопку регистрации таролога для клиентов
        if (this.state.role === CONFIG.USER_ROLES.CLIENT) {
            setTimeout(() => {
                const profileContent = document.getElementById('profile-content');
                if (profileContent && !profileContent.querySelector('.tarot-registration-card')) {
                    const registrationButton = Components.createTarotRegistrationButton();
                    profileContent.insertAdjacentHTML('beforeend', registrationButton);
                }
            }, 1000);
        }
    },

    // Загрузка рефералов
    loadReferralContent() {
        if (typeof ReferralSystem !== 'undefined') {
            ReferralSystem.init();
        }
    },

    // Инициализация модулей по ролям
    initRoleBasedModules() {
        try {
            // Инициализируем общие модули
            if (typeof ProfileManager !== 'undefined') {
                ProfileManager.init();
            }

            if (typeof ReferralSystem !== 'undefined') {
                ReferralSystem.init();
            }

            // Модули по ролям
            if (this.state.role === CONFIG.USER_ROLES.CLIENT) {
                if (typeof BookingSystem !== 'undefined') {
                    BookingSystem.init();
                }
                ConfigUtils.log('📦 Инициализированы модули клиента');
            } else if (this.state.role === CONFIG.USER_ROLES.TAROT) {
                if (typeof AdminPanel !== 'undefined') {
                    AdminPanel.init();
                }
                ConfigUtils.log('📦 Инициализированы модули таролога');
            }

            ConfigUtils.log('📦 Модули инициализированы для роли:', this.state.role);

        } catch (error) {
            ConfigUtils.error('❌ Ошибка инициализации модулей:', error);
        }
    },

    // Инициализация хранилища
    initStorage() {
        try {
            // Проверяем доступность localStorage
            if (typeof Storage === 'undefined') {
                ConfigUtils.error('❌ Storage модуль недоступен');
                return;
            }

            // Очищаем устаревшие данные
            this.cleanupStorage();

            const storageSize = ConfigUtils.getStorageSize();
            ConfigUtils.log(`💾 Размер хранилища: ${(storageSize / 1024).toFixed(1)} KB`);

        } catch (error) {
            ConfigUtils.error('❌ Ошибка инициализации хранилища:', error);
        }
    },

    // Очистка устаревших данных
    cleanupStorage() {
        try {
            // Очищаем устаревшие временные слоты
            if (typeof TimeSlotStorage !== 'undefined') {
                TimeSlotStorage.cleanupExpired();
            }

            ConfigUtils.log('🧹 Очистка устаревших данных завершена');
        } catch (error) {
            ConfigUtils.error('❌ Ошибка очистки данных:', error);
        }
    },

    // Задержка
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    // Получить информацию о приложении
    getAppInfo() {
        return {
            name: CONFIG.APP_NAME,
            version: CONFIG.VERSION,
            user: this.state.user,
            role: this.state.role,
            selectedTarot: this.state.selectedTarot,
            initialized: this.state.initialized,
            telegramSupport: ConfigUtils.isTelegramApp(),
            theme: document.body.classList.contains('dark-theme') ? 'dark' : 'light',
            language: document.documentElement.lang || 'ru'
        };
    },

    // Перезапустить приложение
    restart() {
        this.state.initialized = false;
        this.state.user = null;
        this.state.role = null;
        this.state.selectedTarot = null;

        ConfigUtils.log('🔄 Перезапуск приложения...');
        window.location.reload();
    },

    // Обработчик ошибок
    handleError(error, context) {
        ConfigUtils.error(`❌ Ошибка в ${context}:`, error);

        // Показываем уведомление пользователю
        if (typeof Components !== 'undefined') {
            Components.showNotification(
                'Произошла ошибка. Попробуйте обновить страницу.',
                'error'
            );
        }
    }
};

// Глобальные функции
window.toggleTheme = () => {
    const newTheme = ConfigUtils.toggleTheme();
    App.updateThemeToggle();

    if (typeof TelegramApp !== 'undefined') {
        TelegramApp.hapticFeedback('selection');
    }

    ConfigUtils.log('🎨 Тема переключена на:', newTheme);
};

// Функция для открытия регистрации таролога
window.openTarotRegistration = () => {
    window.location.href = 'tarot-register.html';
};

// Обработчик ошибок для всего приложения
window.addEventListener('error', (event) => {
    App.handleError(event.error, 'Global Error Handler');
});

// Обработчик нераспознанных промисов
window.addEventListener('unhandledrejection', (event) => {
    App.handleError(event.reason, 'Unhandled Promise Rejection');
});

// Автозапуск приложения
document.addEventListener('DOMContentLoaded', () => {
    ConfigUtils.log('📄 DOM загружен, запуск приложения...');

    // Убираем дебаг информацию если не в дев режиме
    if (!CONFIG.DEV_MODE) {
        const debugElements = document.querySelectorAll('.debug-info');
        debugElements.forEach(el => el.remove());
    }

    App.init();
});

// Экспорт
window.App = App;