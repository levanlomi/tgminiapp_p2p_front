// Словари локализации
const i18n = {
    ru: {
        headerLabel: "АКТУАЛЬНЫЙ КУРС P2P",
        subheaderLabel: "Покупка VND за рубли",
        refreshBtn: "Обновить курсы",
        refreshing: "Получаем данные...",
        error: "Ошибка сети",
        loading: "Загрузка предложений...",
        ratePrefix: "Курс: "
    }
};

const currentLang = 'ru'; 
const t = i18n[currentLang];

// Элементы DOM
const headerLabel = document.getElementById('header-label');
const subheaderLabel = document.getElementById('subheader-label');
const tiersContainer = document.getElementById('tiers-container');
const refreshBtn = document.getElementById('refresh-btn');

// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

// Применение текстов интерфейса
headerLabel.textContent = t.headerLabel;
subheaderLabel.textContent = t.subheaderLabel;
refreshBtn.textContent = t.refreshBtn;

// Форматирование чисел
function formatNumber(number) {
    return new Intl.NumberFormat('ru-RU').format(Math.floor(number));
}

// Отрисовка карточек с предложениями
function renderTiers(tiers) {
    tiersContainer.innerHTML = ''; // Очищаем контейнер

    tiers.forEach(tier => {
        const card = document.createElement('div');
        card.className = "tier-card p-4 rounded-2xl flex justify-between items-center shadow-sm";
        
        // Левая часть (Рубли)
        const leftSide = document.createElement('div');
        leftSide.className = "flex flex-col";
        
        const rubTitle = document.createElement('span');
        rubTitle.className = "text-sm font-semibold";
        rubTitle.style.color = "var(--hint-color)";
        rubTitle.textContent = "Отдаете";

        const rubAmount = document.createElement('span');
        rubAmount.className = "text-xl font-bold";
        rubAmount.textContent = `${formatNumber(tier.rubAmount)} ₽`;
        
        leftSide.appendChild(rubTitle);
        leftSide.appendChild(rubAmount);

        // Правая часть (Донги и курс)
        const rightSide = document.createElement('div');
        rightSide.className = "flex flex-col items-end";
        
        const vndAmount = document.createElement('span');
        vndAmount.className = "text-xl font-extrabold text-green-500";
        vndAmount.textContent = `${formatNumber(tier.totalVnd)} ₫`;

        const rateInfo = document.createElement('span');
        rateInfo.className = "text-xs font-medium mt-1";
        rateInfo.style.color = "var(--hint-color)";
        rateInfo.textContent = `${t.ratePrefix}${tier.rate}`;

        rightSide.appendChild(vndAmount);
        rightSide.appendChild(rateInfo);

        card.appendChild(leftSide);
        card.appendChild(rightSide);
        
        tiersContainer.appendChild(card);
    });
}

// Запрос к прокси-бэкенду
async function fetchRates() {
    try {
        refreshBtn.textContent = t.refreshing;
        refreshBtn.disabled = true;
        refreshBtn.style.opacity = '0.5';
        
        // Показываем состояние загрузки внутри контейнера
        tiersContainer.innerHTML = `<div class="text-center p-4 font-medium" style="color: var(--hint-color)">${t.loading}</div>`;

        // Ссылка на твой Render
        const response = await fetch('https://tgminiapp-p2p.onrender.com/api/rate');
        const data = await response.json();

        if (data.success && data.tiers) {
            renderTiers(data.tiers);
        } else {
            tiersContainer.innerHTML = `<div class="text-center p-4 text-red-500 font-bold">${t.error}</div>`;
        }
    } catch (error) {
        tiersContainer.innerHTML = `<div class="text-center p-4 text-red-500 font-bold">${t.error}</div>`;
        console.error("Fetch API error:", error);
    } finally {
        refreshBtn.textContent = t.refreshBtn;
        refreshBtn.disabled = false;
        refreshBtn.style.opacity = '1';
    }
}

// Слушатели событий
refreshBtn.addEventListener('click', fetchRates);

// Первичная загрузка
fetchRates();