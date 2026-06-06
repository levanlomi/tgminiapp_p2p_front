// Словари локализации (строго по гайдлайну)
const i18n = {
    ru: {
        rateLabel: "ТЕКУЩИЙ КУРС P2P BYBIT",
        rubLabel: "ЗА 1 РУБЛЬ",
        calcLabel: "Отдаете (RUB):",
        resultLabel: "Получаете на карту (VND):",
        refreshBtn: "Обновить курс",
        refreshing: "Обновляем...",
        error: "Ошибка сети"
    }
};

const currentLang = 'ru'; // В будущем можно брать из tg.initDataUnsafe.user.language_code
const t = i18n[currentLang];

// Элементы DOM
const rateValueEl = document.getElementById('rate-value');
const amountInput = document.getElementById('amount-input');
const resultValueEl = document.getElementById('result-value');
const refreshBtn = document.getElementById('refresh-btn');

// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand(); // Разворачиваем Mini App на всю высоту экрана
tg.ready();

// Глобальная переменная для хранения текущего курса
let currentRate = 0;

// Применение текстов интерфейса
document.getElementById('rate-label').textContent = t.rateLabel;
document.getElementById('rub-label').textContent = t.rubLabel;
document.getElementById('calc-label').textContent = t.calcLabel;
document.getElementById('result-label').textContent = t.resultLabel;
refreshBtn.textContent = t.refreshBtn;

// Функция для красивого форматирования вьетнамских донгов (разделение тысяч пробелами)
function formatVND(number) {
    return new Intl.NumberFormat('vi-VN').format(Math.floor(number));
}

// Запрос к твоему прокси-бэкенду
async function fetchRate() {
    try {
        refreshBtn.textContent = t.refreshing;
        refreshBtn.disabled = true;
        refreshBtn.style.opacity = '0.5';

        // Твоя ссылка на Render
        const response = await fetch('https://tgminiapp-p2p.onrender.com/api/rate');
        const data = await response.json();

        if (data.success) {
            currentRate = data.rate;
            rateValueEl.textContent = currentRate;
            calculateResult(); // Пересчитываем итог, если в инпуте уже введены цифры
        } else {
            rateValueEl.textContent = t.error;
        }
    } catch (error) {
        rateValueEl.textContent = t.error;
        console.error("Fetch API error:", error);
    } finally {
        refreshBtn.textContent = t.refreshBtn;
        refreshBtn.disabled = false;
        refreshBtn.style.opacity = '1';
    }
}

// Логика калькулятора "на лету"
function calculateResult() {
    const amount = parseFloat(amountInput.value);
    
    if (isNaN(amount) || amount <= 0) {
        resultValueEl.textContent = "0 VND";
        return;
    }
    
    const result = amount * currentRate;
    resultValueEl.textContent = `${formatVND(result)} VND`;
}

// Слушатели событий
amountInput.addEventListener('input', calculateResult);
refreshBtn.addEventListener('click', fetchRate);

// Первичная загрузка данных при открытии Mini App
fetchRate();