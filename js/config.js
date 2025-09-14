// Конфигурация приложения с исправленной логикой ролей
const CONFIG = {
    // Основные настройки
    APP_NAME: 'Tarot Booking',
    VERSION: '1.0.0',

    // Telegram Bot настройки
    BOT_USERNAME: 'Green_tarot_bot',

    // По умолчанию все пользователи - клиенты
    DEFAULT_ROLE: 'client',

    // Форсированная роль (устанавливается динамически)
    FORCE_ROLE: null,

    // API endpoints
    API_BASE_URL: 'https://your-api.com/api',

    // Автоматическая регистрация
    AUTO_REGISTRATION: true,
    SKIP_ROLE_SELECTION: true,

    // Локальное хранилище ключи
    STORAGE_KEYS: {
        USER_DATA: 'tarot_user_data',
        TIME_SLOTS: 'tarot_time_slots',
        BOOKINGS: 'tarot_bookings',
        REFERRALS: 'tarot_referrals',
        SETTINGS: 'tarot_settings',
        SESSION_DATA: 'tarot_session',
        LANGUAGE_OVERRIDE: 'tarot_language_override',
        THEME_OVERRIDE: 'tarot_theme_override',
        TAROT_CLIENTS: 'tarot_clients' // Для связи тарологов с клиентами
    },

    // Роли пользователей
    USER_ROLES: {
        CLIENT: 'client',
        TAROT: 'tarot',
        ADMIN: 'admin'
    },

    // Статусы записей
    BOOKING_STATUS: {
        PENDING: 'pending',
        CONFIRMED: 'confirmed',
        CANCELLED: 'cancelled',
        COMPLETED: 'completed'
    },

    // Статусы временных слотов
    SLOT_STATUS: {
        AVAILABLE: 'available',
        PENDING: 'pending',
        BOOKED: 'booked'
    },

    // Типы консультаций
    CONSULTATION_TYPES: {
        ONLINE: 'online',
        OFFLINE: 'offline'
    },

    // Настройки времени
    TIME_SETTINGS: {
        DEFAULT_DURATION: 60,
        MIN_BOOKING_HOURS: 1,
        MAX_BOOKING_DAYS: 30,
        WORKING_HOURS: {
            START: '09:00',
            END: '21:00'
        },
        AUTO_CLEANUP_EXPIRED: true,
        CLEANUP_INTERVAL: 30 * 60 * 1000
    },

    // Реферальная система (НЕ для приглашений, а для записи к конкретному тарологу)
    TAROT_BOOKING_SYSTEM: {
        ENABLED: true,
        ALLOW_MULTIPLE_TAROTS: true, // Может ли клиент записываться к разным тарологам
        CONFLICT_CHECK: true, // Проверка конфликтов времени
        SWITCH_TAROT_CONFIRMATION: true // Подтверждение при смене таролога
    },

    // Цены и услуги
    SERVICES: {
        DEFAULT_PRICE: 2000,
        MIN_PRICE: 500,
        MAX_PRICE: 10000
    },

    // Уведомления
    NOTIFICATIONS: {
        ENABLED: true,
        BOOKING_REMINDER_HOURS: 2,
        AUTO_CONFIRM_TIMEOUT: 24,
        SOUND_ENABLED: false
    },

    // Telegram Web App настройки
    TELEGRAM: {
        REQUIRED: true,
        EXPAND_ON_LOAD: true,
        ENABLE_CLOSING_CONFIRMATION: true,
        USE_HAPTIC_FEEDBACK: true,
        THEME_SYNC: true // Синхронизация с системной темой
    },

    // Безопасность
    SECURITY: {
        ADMIN_ACCESS_CODES: ['admin2024', 'tarot_admin', 'secure_access'],
        SESSION_TIMEOUT: 24 * 60 * 60 * 1000,
        AUTO_LOGOUT_INACTIVE: 7 * 24 * 60 * 60 * 1000,
        REQUIRE_TELEGRAM_AUTH: true
    },

    // Дебаг режим
    DEBUG: true,
    DEV_MODE: true,

    // Тестовые данные
    DEV_USER: {
        id: 12345678,
        first_name: 'Тестовый',
        last_name: 'Пользователь',
        username: 'test_user',
        language_code: 'ru'
    },

    // Временные зоны
    TIMEZONE: 'Europe/Kiev',

    // Производительность
    PERFORMANCE: {
        AUTO_SAVE_INTERVAL: 10000,
        MAX_BOOKINGS_DISPLAY: 50,
        LAZY_LOAD_ENABLED: true,
        CACHE_DURATION: 5 * 60 * 1000
    }
};

// Утилиты конфигурации с исправленным определением языка и темы
const ConfigUtils = {
    // Инициализация конфигурации
    init() {
        this.validateConfig();
        this.detectAndSetLanguage();
        this.detectAndSetTheme();
        this.log('Конфигурация инициализирована');
    },

    // Определение языка по системным настройкам
    detectAndSetLanguage() {
        let detectedLanguage = 'ru'; // По умолчанию русский

        try {
            // 1. Проверяем сохраненные пользователем настройки
            const savedLanguage = localStorage.getItem(CONFIG.STORAGE_KEYS.LANGUAGE_OVERRIDE);
            if (savedLanguage) {
                detectedLanguage = savedLanguage;
                this.log('🌐 Язык из настроек пользователя:', detectedLanguage);
                this.setLanguage(detectedLanguage);
                return;
            }

            // 2. Получаем язык из системы (браузер)
            const systemLanguage = navigator.language || navigator.userLanguage;
            if (systemLanguage) {
                const lang = systemLanguage.toLowerCase();
                if (lang.startsWith('en')) {
                    detectedLanguage = 'en';
                } else if (lang.startsWith('uk')) {
                    detectedLanguage = 'uk';
                } else if (lang.startsWith('ru')) {
                    detectedLanguage = 'ru';
                }
                this.log('🌐 Язык определен по системе:', detectedLanguage, '(системный:', systemLanguage + ')');
            }

            // 3. Fallback - проверяем Telegram (если доступен)
            if (this.isTelegramApp()) {
                const tg = window.Telegram.WebApp;
                const telegramUser = tg.initDataUnsafe?.user;

                if (telegramUser?.language_code && detectedLanguage === 'ru') {
                    const telegramLang = telegramUser.language_code.toLowerCase();
                    if (telegramLang.startsWith('en')) {
                        detectedLanguage = 'en';
                    } else if (telegramLang.startsWith('uk')) {
                        detectedLanguage = 'uk';
                    }
                    this.log('🌐 Язык уточнен из Telegram:', detectedLanguage);
                }
            }

        } catch (error) {
            this.error('Ошибка определения языка:', error);
        }

        this.setLanguage(detectedLanguage);
        this.log('🌐 Финальный язык:', detectedLanguage);
    },

    // Определение темы по системным настройкам
    detectAndSetTheme() {
        let detectedTheme = 'light'; // По умолчанию светлая

        try {
            // 1. Проверяем сохраненные пользователем настройки
            const savedTheme = localStorage.getItem(CONFIG.STORAGE_KEYS.THEME_OVERRIDE);
            if (savedTheme && savedTheme !== 'auto') {
                detectedTheme = savedTheme;
                this.log('🎨 Тема из настроек пользователя:', detectedTheme);
                this.setTheme(detectedTheme);
                return;
            }

            // 2. Определяем по системной теме
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                detectedTheme = 'dark';
                this.log('🎨 Определена темная тема системы');
            } else {
                detectedTheme = 'light';
                this.log('🎨 Определена светлая тема системы');
            }

            // 3. Fallback - проверяем Telegram (если доступен)
            if (this.isTelegramApp() && CONFIG.TELEGRAM.THEME_SYNC) {
                const tg = window.Telegram.WebApp;
                if (tg.colorScheme) {
                    detectedTheme = tg.colorScheme;
                    this.log('🎨 Тема из Telegram:', detectedTheme);
                }
            }

        } catch (error) {
            this.error('Ошибка определения темы:', error);
        }

        this.setTheme(detectedTheme);
        this.log('🎨 Финальная тема:', detectedTheme);
    },

    // Установить язык
    setLanguage(language) {
        const supportedLanguages = ['ru', 'en', 'uk'];

        if (!supportedLanguages.includes(language)) {
            this.error('Неподдерживаемый язык:', language);
            return false;
        }

        // Обновляем HTML атрибуты
        document.documentElement.lang = language;
        document.body.setAttribute('lang', language);

        this.log('🌐 Язык установлен:', language);
        return true;
    },

    // Установить тему
    setTheme(theme) {
        // Удаляем старые классы темы
        document.body.classList.remove('light-theme', 'dark-theme');

        // Устанавливаем новую тему
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.add('light-theme');
        }

        this.log('🎨 Тема установлена:', theme);
        return true;
    },

    // Переключить тему
    toggleTheme() {
        const isDark = document.body.classList.contains('dark-theme');
        const newTheme = isDark ? 'light' : 'dark';

        this.setTheme(newTheme);

        // Сохраняем выбор пользователя
        localStorage.setItem(CONFIG.STORAGE_KEYS.THEME_OVERRIDE, newTheme);

        this.log('🎨 Тема переключена на:', newTheme);
        return newTheme;
    },

    // Сохранить выбор языка пользователем
    saveLanguageChoice(language) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.LANGUAGE_OVERRIDE, language);
        this.setLanguage(language);
        this.log('🌐 Язык сохранен пользователем:', language);
    },

    // Определить роль пользователя
    determineUserRole(telegramData) {
        // 1. Проверяем, есть ли сохраненная роль таролога
        const savedUser = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_DATA);
        if (savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                if (userData.role === CONFIG.USER_ROLES.TAROT) {
                    this.log('🎭 Найден сохраненный таролог');
                    return CONFIG.USER_ROLES.TAROT;
                }
            } catch (error) {
                this.error('Ошибка парсинга сохраненных данных пользователя:', error);
            }
        }

        // 2. Проверяем start_param для записи к конкретному тарологу
        if (telegramData?.start_param?.startsWith('tarot_')) {
            this.log('🎭 Обнаружена ссылка для записи к тарологу');
            // Сохраняем информацию о выбранном тарологе
            const tarotId = telegramData.start_param.replace('tarot_', '');
            this.saveSelectedTarot(tarotId);
        }

        // 3. По умолчанию все новые пользователи - клиенты
        this.log('🎭 Назначена роль клиента (по умолчанию)');
        return CONFIG.USER_ROLES.CLIENT;
    },

    // Сохранить выбранного таролога для клиента
    saveSelectedTarot(tarotId) {
        const selectedTarots = this.getSelectedTarots();
        if (!selectedTarots.includes(tarotId)) {
            selectedTarots.push(tarotId);
            localStorage.setItem('selected_tarots', JSON.stringify(selectedTarots));
            this.log('🔗 Сохранен выбранный таролог:', tarotId);
        }
    },

    // Получить список выбранных тарологов
    getSelectedTarots() {
        try {
            const saved = localStorage.getItem('selected_tarots');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            this.error('Ошибка получения списка тарологов:', error);
            return [];
        }
    },

    // Создать ссылку для записи к тарологу
    createTarotBookingLink(tarotId) {
        return `https://t.me/${CONFIG.BOT_USERNAME}?start=tarot_${tarotId}`;
    },

    // Валидация конфигурации
    validateConfig() {
        if (!CONFIG.BOT_USERNAME) {
            this.error('BOT_USERNAME не настроен');
        }

        if (CONFIG.TELEGRAM.REQUIRED && !this.isTelegramApp()) {
            this.log('⚠️ Приложение предназначено для запуска в Telegram');
        }
    },

    // Проверить, запущено ли приложение в Telegram
    isTelegramApp() {
        return window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData;
    },

    // Получить размер хранилища
    getStorageSize() {
        let total = 0;
        Object.values(CONFIG.STORAGE_KEYS).forEach(key => {
            const item = localStorage.getItem(key);
            if (item) {
                total += item.length;
            }
        });
        return total;
    },

    // Логирование
    log(...args) {
        if (CONFIG.DEBUG) {
            console.log('[Tarot App]:', new Date().toLocaleTimeString(), ...args);
        }
    },

    // Обработка ошибок
    error(...args) {
        console.error('[Tarot App Error]:', new Date().toLocaleTimeString(), ...args);
    }
};

// Автоинициализация при загрузке
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
    window.ConfigUtils = ConfigUtils;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => ConfigUtils.init());
    } else {
        ConfigUtils.init();
    }
}