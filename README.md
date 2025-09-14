# 🔮 Tarot Booking App

Telegram Mini App для записи к тарологу с реферальной системой.

## 🚀 Быстрый старт

### Установка зависимостей
```bash
# 1. СНАЧАЛА установите зависимости
npm install

# 2. Проверьте что все установилось
npm list --depth=0
```

### Разработка
```bash
# Запуск локального сервера с hot-reload
npm run dev

# Или альтернативная команда
npm start
```

### ⚠️ Если возникают ошибки "command not found":
```bash
# Установите недостающие пакеты глобально
npm install -g live-server
npm install -g serve
npm install -g ngrok
npm install -g netlify-cli
```

### Запуск с HTTPS (для тестирования Telegram)
```bash
# Генерация самоподписанного сертификата
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem

# Запуск HTTPS сервера
npm run serve-https
```

### Создание туннеля для Telegram
```bash
# Установка ngrok (если не установлен)
npm install -g ngrok

# Создание туннеля
npm run tunnel
```

## 📁 Структура проекта

```
tarot-booking-app/
├── index.html              # Главная страница
├── styles/
│   ├── main.css            # Основные стили
│   └── components.css      # Стили компонентов
├── js/
│   ├── config.js           # Конфигурация
│   ├── telegram.js         # Telegram API
│   ├── auth.js             # Авторизация
│   ├── storage.js          # Хранение данных
│   ├── app.js              # Главный модуль
│   ├── booking.js          # Система записей
│   ├── admin.js            # Админ панель
│   ├── referral.js         # Реферальная система
│   ├── profile.js          # Профиль
│   ├── modal.js            # Модальные окна
│   └── components.js       # Компоненты
├── images/                 # Изображения
├── dist/                   # Собранные файлы
└── docs/                   # Документация
```

## ⚙️ Команды Fleet

### Запуск в Fleet:
1. Откройте Fleet
2. Откройте папку проекта
3. В терминале выполните:
```bash
npm run dev
```

### Полезные команды в Fleet:
```bash
# Быстрый старт разработки
npm start

# Сборка для продакшена
npm run build

# Деплой на Netlify
npm run deploy-netlify

# Деплой на Vercel
npm run deploy-vercel

# Линтинг кода
npm run lint

# Форматирование кода
npm run format

# Валидация HTML
npm run validate
```

## 🔧 Настройка для Telegram

### 1. Создание Telegram бота
```bash
# Напишите @BotFather в Telegram
/newbot
# Следуйте инструкциям

# Настройка Mini App
/newapp
# Выберите вашего бота
# Укажите URL: https://your-domain.com
```

### 2. Настройка конфигурации
Отредактируйте `js/config.js`:
```javascript
const CONFIG = {
    BOT_USERNAME: 'Green_tarot_bot', // Ваш бот @Green_tarot_bot
    // ... остальные настройки
};
```

### 3. Тестирование
```bash
# Запустите локальный сервер
npm run dev

# В другом терминале создайте туннель
npm run tunnel

# Скопируйте HTTPS URL из ngrok в настройки бота
```

## 🌐 Деплой

### Netlify (рекомендуется)
```bash
# Установка CLI
npm install -g netlify-cli

# Вход в аккаунт
netlify login

# Деплой
npm run deploy-netlify
```

### Vercel
```bash
# Установка CLI
npm install -g vercel

# Вход в аккаунт
vercel login

# Деплой
npm run deploy-vercel
```

### GitHub Pages
```bash
# Создайте репозиторий на GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/tarot-booking-app.git
git push -u origin main

# В настройках репозитория включите GitHub Pages
```

## 🛠 Разработка

### Добавление новых функций
1. Создайте новый файл в папке `js/`
2. Добавьте подключение в `index.html`
3. Инициализируйте в `app.js`

### Стили
- `styles/main.css` - основные стили и темы
- `styles/components.css` - компоненты интерфейса

### Данные
- Используется localStorage для хранения
- Модули в `storage.js` для управления данными

## 🐛 Отладка

### В Chrome DevTools:
1. F12 → Application → Local Storage
2. Console для логов приложения
3. Network для отладки API

### В Telegram:
1. Откройте бота
2. Используйте команду `/start`
3. Проверьте консоль разработчика

## 📱 Возможности

### Для клиентов:
- ✅ Просмотр доступного времени
- ✅ Запись на консультацию
- ✅ Реферальная система
- ✅ История записей

### Для тарологов:
- ✅ Управление расписанием
- ✅ Подтверждение записей
- ✅ Статистика клиентов
- ✅ Реферальные бонусы

## 🔐 Безопасность

- Данные хранятся локально в браузере
- Используется Telegram Web App API для аутентификации
- SSL сертификат для HTTPS соединения

## 🆘 Помощь

### Частые проблемы:
1. **"Приложение не открывается"** - проверьте HTTPS
2. **"Ошибка авторизации"** - проверьте настройки бота
3. **"Нет данных"** - очистите localStorage

### Контакты:
- Telegram: @your_username
- Email: your@email.com
- GitHub Issues: https://github.com/username/tarot-booking-app/issues

## 📄 Лицензия

MIT License - можете использовать в коммерческих проектах.