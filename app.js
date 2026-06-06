// Словари локализации
const i18n = {
    ru: {
        headerLabel: "АКТУАЛЬНЫЙ КУРС P2P",
        subheaderLabel: "Покупка VND за рубли",
        refreshBtn: "Обновить курсы",
        refreshing: "Обновление...",
        error: "Ошибка сети",
        loading: "Загрузка...",
        ratePrefix: "Курс: ",
        updatePrefix: "Последнее обновление: "
    }
};

const t = i18n.ru;

// Элементы DOM
const headerLabel = document.getElementById('header-label');
const subheaderLabel = document.getElementById('subheader-label');
const updateTimeEl = document.getElementById('update-time');
const tiersContainer = document.getElementById('tiers-container');
const refreshBtn = document.getElementById('refresh-btn');

// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

// Применение начальных текстов
headerLabel.textContent = t.headerLabel;
subheaderLabel.textContent = t.subheaderLabel;
refreshBtn.textContent = t.refreshBtn;
updateTimeEl.textContent = t.updatePrefix + "--:--";

// Форматирование чисел
function formatNumber(number) {
    return new Intl.NumberFormat('ru-RU').format(Math.floor(number));
}

// Обновление метки времени
function updateTimestamp() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    updateTimeEl.textContent = `${t.updatePrefix}${timeString}`;
}

// Отрисовка карточек
function renderTiers(tiers) {
    tiersContainer.innerHTML = '';
    tiers.forEach(tier => {
        const card = document.createElement('div');
        card.className = "tier-card p-4 rounded-2xl flex justify-between items-center shadow-sm";
        
        card.innerHTML = `
            <div class="flex flex-col">
                <span class="text-xs font-semibold" style="color: var(--hint-color)">Отдаете</span>
                <span class="text-lg font-bold">${formatNumber(tier.rubAmount)} ₽</span>
            </div>
            <div class="flex flex-col items-end">
                <span class="text-lg font-extrabold text-green-500">${formatNumber(tier.totalVnd)} ₫</span>
                <span class="text-[10px] font-medium" style="color: var(--hint-color)">${t.ratePrefix}${tier.rate}</span>
            </div>
        `;
        tiersContainer.appendChild(card);
    });
}

// Запрос данных
async function fetchRates() {
    try {
        refreshBtn.textContent = t.refreshing;
        refreshBtn.disabled = true;
        tiersContainer.innerHTML = `<div class="text-center p-4 text-sm" style="color: var(--hint-color)">${t.loading}</div>`;

        const response = await fetch('https://tgminiapp-p2p.onrender.com/api/rate');
        const data = await response.json();

        if (data.success && data.tiers) {
            renderTiers(data.tiers);
            updateTimestamp();
        } else {
            throw new Error();
        }
    } catch (error) {
        tiersContainer.innerHTML = `<div class="text-center p-4 text-red-500 font-bold">${t.error}</div>`;
        console.error("Fetch error:", error);
    } finally {
        refreshBtn.textContent = t.refreshBtn;
        refreshBtn.disabled = false;
    }
}

refreshBtn.addEventListener('click', fetchRates);
fetchRates();