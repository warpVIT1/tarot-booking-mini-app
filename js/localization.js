// Система локализации для поддержки многих языков
const Localization = {
    // Текущий язык
    currentLanguage: 'ru',

    // Поддерживаемые языки
    supportedLanguages: ['ru', 'en', 'uk'],

    // Словари переводов
    translations: {
        // Русский язык
        ru: {
            // Общие
            app_name: 'Запись к тарологу',
            loading: 'Загрузка...',
            error: 'Ошибка',
            success: 'Успешно',
            cancel: 'Отмена',
            save: 'Сохранить',
            delete: 'Удалить',
            edit: 'Редактировать',
            close: 'Закрыть',
            back: 'Назад',
            next: 'Далее',
            yes: 'Да',
            no: 'Нет',
            ok: 'OK',

            // Авторизация
            welcome_client: 'Добро пожаловать! Выберите удобное время для консультации',
            welcome_tarot: 'Добро пожаловать в панель таролога! Управляйте записями и расписанием',
            auth_error: 'Ошибка авторизации через Telegram',
            telegram_required: 'Приложение работает только в Telegram',

            // Роли
            role_client: 'Клиент',
            role_tarot: 'Таролог',
            role_admin: 'Администратор',

            // Навигация для клиентов
            nav_booking: 'Записаться',
            nav_my_bookings: 'Мои записи',
            nav_profile: 'Профиль',
            nav_referrals: 'Рефералы',

            // Навигация для тарологов
            nav_client_bookings: 'Записи',
            nav_schedule: 'Расписание',
            nav_statistics: 'Статистика',

            // Записи
            booking_title: 'Выберите время консультации',
            booking_subtitle: 'Доступные временные слоты от наших тарологов',
            booking_form_title: 'Заполните данные для записи',
            booking_name: 'Ваше имя',
            booking_contact: 'Телефон или Telegram',
            booking_question: 'Вопрос или комментарий (необязательно)',
            booking_submit: 'Отправить заявку',
            booking_success: 'Заявка отправлена! Таролог свяжется с вами для подтверждения',
            booking_error: 'Ошибка при создании записи',

            // Статусы записей
            status_pending: 'Ожидает',
            status_confirmed: 'Подтверждено',
            status_cancelled: 'Отменено',
            status_completed: 'Завершено',

            // Статусы слотов
            slot_available: 'Свободно',
            slot_pending: 'Ожидает',
            slot_booked: 'Занято',

            // Временные слоты
            time_management: 'Управление расписанием',
            add_time_slot: 'Добавить время',
            select_date: 'Выберите дату',
            select_time: 'Выберите время',
            available_time: 'Доступное время',
            add_selected_times: 'Добавить выбранное время',

            // Профиль
            profile_title: 'Мой профиль',
            profile_statistics: 'Статистика',
            profile_info: 'Информация о профиле',
            total_bookings: 'Всего записей',
            completed_bookings: 'Завершено',
            pending_bookings: 'Ожидает',
            referrals_count: 'Приглашено',

            // Реферальная система
            referral_title: 'Пригласи друзей',
            referral_subtitle: 'Получайте бонусы за каждого приглашенного друга',
            referral_link: 'Ваша реферальная ссылка',
            referral_copy: 'Копировать',
            referral_share: 'Поделиться в Telegram',
            referral_qr: 'QR-код',
            referral_copied: 'Реферальная ссылка скопирована!',
            referral_discount: 'Вы получили скидку {percent}% на первую консультацию!',

            // Уведомления
            booking_reminder: 'Не забудьте о консультации {time}!',
            booking_confirmed_notification: 'Запись подтверждена',
            booking_cancelled_notification: 'Запись отменена',

            // Настройки
            settings_title: 'Настройки',
            language_title: 'Язык приложения',
            theme_title: 'Тема оформления',
            theme_light: 'Светлая',
            theme_dark: 'Темная',
            theme_auto: 'Автоматически',
            notifications_title: 'Уведомления',
            notifications_enabled: 'Включить уведомления',

            // Ошибки
            error_no_slots: 'Свободного времени пока нет',
            error_slot_unavailable: 'Этот временной слот уже недоступен',
            error_fill_required: 'Пожалуйста, заполните все обязательные поля',
            error_network: 'Ошибка сети. Проверьте подключение к интернету',

            // Дни недели
            monday: 'Понедельник',
            tuesday: 'Вторник',
            wednesday: 'Среда',
            thursday: 'Четверг',
            friday: 'Пятница',
            saturday: 'Суббота',
            sunday: 'Воскресенье',

            // Месяцы
            january: 'Январь',
            february: 'Февраль',
            march: 'Март',
            april: 'Апрель',
            may: 'Май',
            june: 'Июнь',
            july: 'Июль',
            august: 'Август',
            september: 'Сентябрь',
            october: 'Октябрь',
            november: 'Ноябрь',
            december: 'Декабрь'
        },

        // Английский язык
        en: {
            // General
            app_name: 'Tarot Booking',
            loading: 'Loading...',
            error: 'Error',
            success: 'Success',
            cancel: 'Cancel',
            save: 'Save',
            delete: 'Delete',
            edit: 'Edit',
            close: 'Close',
            back: 'Back',
            next: 'Next',
            yes: 'Yes',
            no: 'No',
            ok: 'OK',

            // Authorization
            welcome_client: 'Welcome! Choose a convenient time for your consultation',
            welcome_tarot: 'Welcome to the tarot reader panel! Manage bookings and schedule',
            auth_error: 'Telegram authorization error',
            telegram_required: 'This app only works in Telegram',

            // Roles
            role_client: 'Client',
            role_tarot: 'Tarot Reader',
            role_admin: 'Administrator',

            // Navigation for clients
            nav_booking: 'Book',
            nav_my_bookings: 'My Bookings',
            nav_profile: 'Profile',
            nav_referrals: 'Referrals',

            // Navigation for tarot readers
            nav_client_bookings: 'Bookings',
            nav_schedule: 'Schedule',
            nav_statistics: 'Statistics',

            // Bookings
            booking_title: 'Choose consultation time',
            booking_subtitle: 'Available time slots from our tarot readers',
            booking_form_title: 'Fill in booking details',
            booking_name: 'Your name',
            booking_contact: 'Phone or Telegram',
            booking_question: 'Question or comment (optional)',
            booking_submit: 'Submit request',
            booking_success: 'Request sent! The tarot reader will contact you for confirmation',
            booking_error: 'Error creating booking',

            // Booking statuses
            status_pending: 'Pending',
            status_confirmed: 'Confirmed',
            status_cancelled: 'Cancelled',
            status_completed: 'Completed',

            // Slot statuses
            slot_available: 'Available',
            slot_pending: 'Pending',
            slot_booked: 'Booked',

            // Time slots
            time_management: 'Schedule Management',
            add_time_slot: 'Add Time',
            select_date: 'Select Date',
            select_time: 'Select Time',
            available_time: 'Available Time',
            add_selected_times: 'Add Selected Times',

            // Profile
            profile_title: 'My Profile',
            profile_statistics: 'Statistics',
            profile_info: 'Profile Information',
            total_bookings: 'Total Bookings',
            completed_bookings: 'Completed',
            pending_bookings: 'Pending',
            referrals_count: 'Referrals',

            // Referral system
            referral_title: 'Invite Friends',
            referral_subtitle: 'Get bonuses for each invited friend',
            referral_link: 'Your referral link',
            referral_copy: 'Copy',
            referral_share: 'Share on Telegram',
            referral_qr: 'QR Code',
            referral_copied: 'Referral link copied!',
            referral_discount: 'You got {percent}% discount on your first consultation!',

            // Notifications
            booking_reminder: 'Don\'t forget about your consultation at {time}!',
            booking_confirmed_notification: 'Booking confirmed',
            booking_cancelled_notification: 'Booking cancelled',

            // Settings
            settings_title: 'Settings',
            language_title: 'App Language',
            theme_title: 'Theme',
            theme_light: 'Light',
            theme_dark: 'Dark',
            theme_auto: 'Auto',
            notifications_title: 'Notifications',
            notifications_enabled: 'Enable notifications',

            // Errors
            error_no_slots: 'No available time slots yet',
            error_slot_unavailable: 'This time slot is no longer available',
            error_fill_required: 'Please fill in all required fields',
            error_network: 'Network error. Check your internet connection',

            // Days of week
            monday: 'Monday',
            tuesday: 'Tuesday',
            wednesday: 'Wednesday',
            thursday: 'Thursday',
            friday: 'Friday',
            saturday: 'Saturday',
            sunday: 'Sunday',

            // Months
            january: 'January',
            february: 'February',
            march: 'March',
            april: 'April',
            may: 'May',
            june: 'June',
            july: 'July',
            august: 'August',
            september: 'September',
            october: 'October',
            november: 'November',
            december: 'December'
        },

        // Украинский язык
        uk: {
            // Загальні
            app_name: 'Запис до таролога',
            loading: 'Завантаження...',
            error: 'Помилка',
            success: 'Успішно',
            cancel: 'Скасувати',
            save: 'Зберегти',
            delete: 'Видалити',
            edit: 'Редагувати',
            close: 'Закрити',
            back: 'Назад',
            next: 'Далі',
            yes: 'Так',
            no: 'Ні',
            ok: 'OK',

            // Авторизація
            welcome_client: 'Ласкаво просимо! Оберіть зручний час для консультації',
            welcome_tarot: 'Ласкаво просимо до панелі таролога! Керуйте записами та розкладом',
            auth_error: 'Помилка авторизації через Telegram',
            telegram_required: 'Додаток працює тільки в Telegram',

            // Ролі
            role_client: 'Клієнт',
            role_tarot: 'Таролог',
            role_admin: 'Адміністратор',

            // Навігація для клієнтів
            nav_booking: 'Записатися',
            nav_my_bookings: 'Мої записи',
            nav_profile: 'Профіль',
            nav_referrals: 'Реферали',

            // Навігація для тарологів
            nav_client_bookings: 'Записи',
            nav_schedule: 'Розклад',
            nav_statistics: 'Статистика',

            // Записи
            booking_title: 'Оберіть час консультації',
            booking_subtitle: 'Доступні часові слоти від наших тарологів',
            booking_form_title: 'Заповніть дані для запису',
            booking_name: 'Ваше ім\'я',
            booking_contact: 'Телефон або Telegram',
            booking_question: 'Питання або коментар (необов\'язково)',
            booking_submit: 'Відправити заявку',
            booking_success: 'Заявку відправлено! Таролог зв\'яжеться з вами для підтвердження',
            booking_error: 'Помилка при створенні запису',

            // Статуси записів
            status_pending: 'Очікує',
            status_confirmed: 'Підтверджено',
            status_cancelled: 'Скасовано',
            status_completed: 'Завершено',

            // Статуси слотів
            slot_available: 'Вільно',
            slot_pending: 'Очікує',
            slot_booked: 'Зайнято',

            // Часові слоти
            time_management: 'Керування розкладом',
            add_time_slot: 'Додати час',
            select_date: 'Оберіть дату',
            select_time: 'Оберіть час',
            available_time: 'Доступний час',
            add_selected_times: 'Додати обраний час',

            // Профіль
            profile_title: 'Мій профіль',
            profile_statistics: 'Статистика',
            profile_info: 'Інформація профілю',
            total_bookings: 'Всього записів',
            completed_bookings: 'Завершено',
            pending_bookings: 'Очікує',
            referrals_count: 'Запрошено',

            // Реферальна система
            referral_title: 'Запроси друзів',
            referral_subtitle: 'Отримуйте бонуси за кожного запрошеного друга',
            referral_link: 'Ваше реферальне посилання',
            referral_copy: 'Копіювати',
            referral_share: 'Поділитися в Telegram',
            referral_qr: 'QR-код',
            referral_copied: 'Реферальне посилання скопійовано!',
            referral_discount: 'Ви отримали знижку {percent}% на першу консультацію!',

            // Сповіщення
            booking_reminder: 'Не забудьте про консультацію о {time}!',
            booking_confirmed_notification: 'Запис підтверджено',
            booking_cancelled_notification: 'Запис скасовано',

            // Налаштування
            settings_title: 'Налаштування',
            language_title: 'Мова додатку',
            theme_title: 'Тема оформлення',
            theme_light: 'Світла',
            theme_dark: 'Темна',
            theme_auto: 'Автоматично',
            notifications_title: 'Сповіщення',
            notifications_enabled: 'Увімкнути сповіщення',

            // Помилки
            error_no_slots: 'Вільного часу поки немає',
            error_slot_unavailable: 'Цей часовий слот вже недоступний',
            error_fill_required: 'Будь ласка, заповніть всі обов\'язкові поля',
            error_network: 'Помилка мережі. Перевірте підключення до інтернету',

            // Дні тижня
            monday: 'Понеділок',
            tuesday: 'Вівторок',
            wednesday: 'Середа',
            thursday: 'Четвер',
            friday: 'П\'ятниця',
            saturday: 'Субота',
            sunday: 'Неділя',

            // Місяці
            january: 'Січень',
            february: 'Лютий',
            march: 'Березень',
            april: 'Квітень',
            may: 'Травень',
            june: 'Червень',
            july: 'Липень',
            august: 'Серпень',
            september: 'Вересень',
            october: 'Жовтень',
            november: 'Листопад',
            december: 'Грудень'
        }
    },

    // Инициализация системы локализации
    init() {
        this.detectLanguage();
        this.applyLanguage();
        ConfigUtils.log('🌐 Система локализации инициализирована:', this.currentLanguage);
    },

    // Автоматическое определение языка
    detectLanguage() {
        let detectedLanguage = 'ru'; // По умолчанию русский

        try {
            // 1. Проверяем сохраненные настройки
            const savedSettings = ConfigUtils.getUserSettings();
            if (savedSettings.language && this.supportedLanguages.includes(savedSettings.language)) {
                detectedLanguage = savedSettings.language;
                ConfigUtils.log('🌐 Язык из настроек:', detectedLanguage);
                this.currentLanguage = detectedLanguage;
                return;
            }

            // 2. Получаем язык из Telegram
            if (ConfigUtils.isTelegramApp()) {
                const tg = window.Telegram.WebApp;
                const telegramUser = tg.initDataUnsafe?.user;

                if (telegramUser?.language_code) {
                    const telegramLang = telegramUser.language_code.toLowerCase();
                    ConfigUtils.log('🌐 Язык из Telegram:', telegramLang);

                    // Маппинг языковых кодов
                    if (telegramLang.startsWith('en')) {
                        detectedLanguage = 'en';
                    } else if (telegramLang.startsWith('uk')) {
                        detectedLanguage = 'uk';
                    } else if (telegramLang.startsWith('ru')) {
                        detectedLanguage = 'ru';
                    }
                }
            }

            // 3. Проверяем язык браузера
            if (detectedLanguage === 'ru') {
                const browserLang = navigator.language || navigator.userLanguage;
                ConfigUtils.log('🌐 Язык браузера:', browserLang);

                if (browserLang) {
                    const lang = browserLang.toLowerCase();
                    if (lang.startsWith('en')) {
                        detectedLanguage = 'en';
                    } else if (lang.startsWith('uk')) {
                        detectedLanguage = 'uk';
                    }
                }
            }

            // 4. Определение по часовому поясу (приблизительно)
            if (detectedLanguage === 'ru') {
                const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                ConfigUtils.log('🌐 Часовой пояс:', timezone);

                // Украина
                if (timezone.includes('Kiev') || timezone.includes('Ukraine')) {
                    detectedLanguage = 'uk';
                }
                // Канада/США
                else if (timezone.includes('America/') || timezone.includes('Canada/')) {
                    detectedLanguage = 'en';
                }
            }

        } catch (error) {
            ConfigUtils.error('Ошибка определения языка:', error);
        }

        this.currentLanguage = detectedLanguage;
        ConfigUtils.log('🌐 Определен язык:', detectedLanguage);
    },

    // Применение языка к интерфейсу
    applyLanguage() {
        try {
            // Обновляем title страницы
            document.title = this.t('app_name');

            // Обновляем все элементы с data-i18n
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                const translation = this.t(key);

                if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'email')) {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            });

            // Устанавливаем атрибут lang для HTML
            document.documentElement.lang = this.currentLanguage;

            // Устанавливаем направление текста (для будущего расширения)
            document.documentElement.dir = this.isRTL() ? 'rtl' : 'ltr';

            ConfigUtils.log('🌐 Язык применен к интерфейсу');

        } catch (error) {
            ConfigUtils.error('Ошибка применения языка:', error);
        }
    },

    // Получить перевод по ключу
    t(key, params = {}) {
        try {
            const translation = this.translations[this.currentLanguage]?.[key] ||
                               this.translations['ru'][key] ||
                               key;

            // Подстановка параметров
            return translation.replace(/\{(\w+)\}/g, (match, param) => {
                return params[param] || match;
            });

        } catch (error) {
            ConfigUtils.error('Ошибка получения перевода для ключа:', key, error);
            return key;
        }
    },

    // Сменить язык
    setLanguage(language) {
        if (!this.supportedLanguages.includes(language)) {
            ConfigUtils.error('Неподдерживаемый язык:', language);
            return false;
        }

        this.currentLanguage = language;

        // Сохраняем в настройки
        const settings = ConfigUtils.getUserSettings();
        settings.language = language;
        ConfigUtils.saveUserSettings(settings);

        // Применяем к интерфейсу
        this.applyLanguage();

        // Обновляем пользователя в системе авторизации
        if (typeof AuthSystem !== 'undefined' && AuthSystem.getCurrentUser()) {
            AuthSystem.updateUser({
                language: language,
                languageCode: language
            });
        }

        ConfigUtils.log('🌐 Язык изменен на:', language);

        // Показываем уведомление
        if (typeof Components !== 'undefined') {
            Components.showNotification(this.t('language_changed'), 'success');
        }

        return true;
    },

    // Получить текущий язык
    getCurrentLanguage() {
        return this.currentLanguage;
    },

    // Получить список поддерживаемых языков
    getSupportedLanguages() {
        return this.supportedLanguages.map(lang => ({
            code: lang,
            name: this.getLanguageName(lang),
            nativeName: this.getLanguageNativeName(lang),
            flag: this.getLanguageFlag(lang)
        }));
    },

    // Получить название языка на английском
    getLanguageName(language) {
        const names = {
            'ru': 'Russian',
            'en': 'English',
            'uk': 'Ukrainian'
        };
        return names[language] || language;
    },

    // Получить название языка на родном языке
    getLanguageNativeName(language) {
        const names = {
            'ru': 'Русский',
            'en': 'English',
            'uk': 'Українська'
        };
        return names[language] || language;
    },

    // Получить флаг языка
    getLanguageFlag(language) {
        const flags = {
            'ru': '🇷🇺',
            'en': '🇺🇸',
            'uk': '🇺🇦'
        };
        return flags[language] || '🌐';
    },

    // Проверить, является ли язык RTL (справа налево)
    isRTL() {
        const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
        return rtlLanguages.includes(this.currentLanguage);
    },

    // Форматирование даты в соответствии с локалью
    formatDate(date, options = {}) {
        const locale = this.getLocale();
        return new Date(date).toLocaleDateString(locale, options);
    },

    // Форматирование времени в соответствии с локалью
    formatTime(date, options = {}) {
        const locale = this.getLocale();
        return new Date(date).toLocaleTimeString(locale, options);
    },

    // Форматирование даты и времени
    formatDateTime(date, options = {}) {
        const locale = this.getLocale();
        return new Date(date).toLocaleString(locale, options);
    },

    // Получить локаль для форматирования
    getLocale() {
        const locales = {
            'ru': 'ru-RU',
            'en': 'en-US',
            'uk': 'uk-UA'
        };
        return locales[this.currentLanguage] || 'ru-RU';
    },

    // Форматирование чисел
    formatNumber(number, options = {}) {
        const locale = this.getLocale();
        return new Intl.NumberFormat(locale, options).format(number);
    },

    // Форматирование валюты
    formatCurrency(amount, currency = 'UAH') {
        const locale = this.getLocale();

        // Определяем валюту по языку если не указана
        if (currency === 'UAH') {
            const currencies = {
                'ru': 'RUB',
                'en': 'USD',
                'uk': 'UAH'
            };
            currency = currencies[this.currentLanguage] || 'UAH';
        }

        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency
        }).format(amount);
    },

    // Создать переключатель языков
    createLanguageSelector(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const languages = this.getSupportedLanguages();

        container.innerHTML = `
            <div class="language-selector">
                <h4>${this.t('language_title')}</h4>
                <div class="language-options">
                    ${languages.map(lang => `
                        <button class="language-option ${lang.code === this.currentLanguage ? 'active' : ''}"
                                onclick="Localization.setLanguage('${lang.code}')">
                            <span class="language-flag">${lang.flag}</span>
                            <span class="language-name">${lang.nativeName}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        // Добавляем стили если их нет
        if (!document.getElementById('language-selector-styles')) {
            const styles = document.createElement('style');
            styles.id = 'language-selector-styles';
            styles.textContent = `
                .language-selector {
                    margin: 20px 0;
                }
                .language-options {
                    display: grid;
                    gap: 10px;
                    margin-top: 10px;
                }
                .language-option {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 12px 16px;
                    border: 2px solid var(--border-color);
                    border-radius: 8px;
                    background: var(--card-bg);
                    cursor: pointer;
                    transition: var(--transition);
                    font-size: 1rem;
                }
                .language-option:hover {
                    border-color: var(--primary-color);
                }
                .language-option.active {
                    border-color: var(--primary-color);
                    background: var(--primary-color);
                    color: white;
                }
                .language-flag {
                    font-size: 1.2rem;
                }
                .language-name {
                    font-weight: 500;
                }
            `;
            document.head.appendChild(styles);
        }
    }
};

// Функция для быстрого доступа к переводам
window.t = (key, params) => Localization.t(key, params);

// Экспортируем модуль
window.Localization = Localization;