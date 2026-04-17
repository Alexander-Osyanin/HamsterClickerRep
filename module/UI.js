// Модуль управления пользовательским интерфейсом v4.0
// Отвечает за обновление DOM-элементов и визуальные эффекты

export const UI = {

  // Кэшированные ссылки на DOM-элементы
  // Получаем элементы один раз при загрузке модуля для оптимизации

  elements: {
    coins: document.getElementById("coins"),
    clickBtn: document.getElementById("clickBtn"),
    multiplier: document.getElementById("multiplier"),
    shopItems: document.getElementById("shopItems"),
    generatorItems: document.getElementById("generatorItems"),
    achievementItems: document.getElementById("achievementItems"),
    coinsPerSec: document.getElementById("coinsPerSec"),
    tabUpgrades: document.getElementById("tab-upgrades"),
    tabGenerators: document.getElementById("tab-generators"),
    tabAchievements: document.getElementById("tab-achievements"),
    panelUpgrades: document.getElementById("panel-upgrades"),
    panelGenerators: document.getElementById("panel-generators"),
    panelAchievements: document.getElementById("panel-achievements"),
    level: document.getElementById("level"),
    levelName: document.getElementById("levelName"),
    progressBar: document.getElementById("progressBar"),
    progressCurrent: document.getElementById("progressCurrent"),
    progressNext: document.getElementById("progressNext"),
    totalClicks: document.getElementById("totalClicks"),
    totalEarned: document.getElementById("totalEarned"),
    totalPurchases: document.getElementById("totalPurchases"),
    playTime: document.getElementById("playTime"),
  },

  // Обновление отображения количества монет
  // amount - Количество монет для отображения
  updateCoins(amount) {
    this.elements.coins.textContent = Math.floor(amount);
  },

  // Обновление отображения множителя кликов
  // value - Текущий множитель (сила одного клика)
  updateMultiplier(value) {
    this.elements.multiplier.textContent = value;
  },

  // Обновление отображения пассивного дохода в секунду
  // value - Количество монет в секунду
  updateCoinsPerSec(value) {
    this.elements.coinsPerSec.textContent = value;
  },

  // Обновление блока уровня и прогресс-бара
  // level - Номер текущего уровня
  // levelName - Название текущего уровня
  // progress - Прогресс в % до следующего уровня
  // current - Текущие заработанные монеты в рамках уровня
  // next - Порог следующего уровня (0 если максимальный)
  updateLevel(level, levelName, progress, current, next) {
    this.elements.level.textContent = level;
    this.elements.levelName.textContent = levelName;
    this.elements.progressBar.style.width = progress + "%";
    this.elements.progressCurrent.textContent = Math.floor(current);
    this.elements.progressNext.textContent = next > 0 ? next : "MAX";
  },

  // Обновление расширенной статистики
  // stats - Объект с полями totalClicks, totalEarned, totalPurchases, playTime
  updateStats(stats) {
    this.elements.totalClicks.textContent = stats.totalClicks;
    this.elements.totalEarned.textContent = Math.floor(stats.totalEarned);
    this.elements.totalPurchases.textContent = stats.totalPurchases;
    this.elements.playTime.textContent = this.formatTime(stats.playTime);
  },

  // Форматирование времени в секундах в строку MM:SS или H:MM:SS
  // seconds - Количество секунд
  formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }
    return `${m}:${String(s).padStart(2, "0")}`;
  },

  // Инициализация переключения табов магазина
  // Привязывает обработчики к кнопкам переключения разделов
  initTabs() {
    this.elements.tabUpgrades.addEventListener("click", () => {
      this.switchTab("upgrades");
    });
    this.elements.tabGenerators.addEventListener("click", () => {
      this.switchTab("generators");
    });
    this.elements.tabAchievements.addEventListener("click", () => {
      this.switchTab("achievements");
    });
  },

  // Переключение активного таба магазина
  // tab - Название таба: 'upgrades', 'generators' или 'achievements'
  switchTab(tab) {
    const tabs = {
      upgrades:     { tab: this.elements.tabUpgrades,     panel: this.elements.panelUpgrades     },
      generators:   { tab: this.elements.tabGenerators,   panel: this.elements.panelGenerators   },
      achievements: { tab: this.elements.tabAchievements, panel: this.elements.panelAchievements },
    };

    Object.entries(tabs).forEach(([key, el]) => {
      const isActive = key === tab;
      el.tab.classList.toggle("active", isActive);
      el.panel.classList.toggle("hidden", !isActive);
    });
  },

  // Анимация клика по кнопке
  // Создает визуальный эффект нажатия с помощью трансформации масштаба
  // button - Элемент кнопки для анимации
  animateClick(button) {
    button.style.transform = "scale(0.95)";
    setTimeout(() => {
      button.style.transform = "";
    }, 100);
  },

  // Показ плавающего текста при клике
  // Создает анимированный текст, показывающий количество заработанных монет
  // text - Текст для отображения
  // element - Элемент, относительно которого позиционируется текст
  showFloatingText(text, element) {
    const floatingText = document.createElement("div");
    floatingText.className = "floating-text";
    floatingText.textContent = text;

    const rect = element.getBoundingClientRect();
    floatingText.style.left = rect.left + rect.width / 2 + "px";
    floatingText.style.top = rect.top + "px";

    document.body.appendChild(floatingText);

    setTimeout(() => {
      floatingText.remove();
    }, 1000);
  },

  // Показ уведомления о разблокировке достижения
  // achievement - Объект достижения с полями name и desc
  showAchievementNotification(achievement) {
    const note = document.createElement("div");
    note.className = "achievement-notification";
    note.innerHTML = `<span class="notif-title">🏆 Достижение!</span><span class="notif-name">${achievement.name}</span>`;

    document.body.appendChild(note);

    setTimeout(() => {
      note.classList.add("notif-hide");
      setTimeout(() => note.remove(), 500);
    }, 3000);
  },

  // Создание элемента улучшения для магазина кликов
  // upgrade - Объект с данными улучшения (id, name, power, baseCost)
  // Возвращает готовый DOM-элемент для вставки в магазин
  createShopItem(upgrade) {
    const item = document.createElement("div");
    item.className = "shop-item";
    item.innerHTML = `
      <div class="shop-item-info">
        <div class="shop-item-name">${upgrade.name}</div>
        <div class="shop-item-power">+${upgrade.power} к клику</div>
      </div>
      <div class="shop-item-buy">
        <div class="shop-item-cost" id="${upgrade.id}-cost">${upgrade.baseCost}</div>
        <button class="shop-item-btn" id="${upgrade.id}-btn">Купить</button>
      </div>
    `;
    return item;
  },

  // Создание элемента генератора пассивного дохода
  // generator - Объект с данными генератора (id, name, income, baseCost)
  // owned - Количество уже купленных единиц
  // Возвращает готовый DOM-элемент для вставки в список генераторов
  createGeneratorItem(generator, owned) {
    const item = document.createElement("div");
    item.className = "shop-item";
    item.innerHTML = `
      <div class="shop-item-info">
        <div class="shop-item-name">${generator.name}</div>
        <div class="shop-item-power">+${generator.income} 💰/сек</div>
        <div class="shop-item-owned">Куплено: <span id="${generator.id}-owned">${owned}</span></div>
      </div>
      <div class="shop-item-buy">
        <div class="shop-item-cost" id="${generator.id}-cost">${generator.baseCost}</div>
        <button class="shop-item-btn" id="${generator.id}-btn">Купить</button>
      </div>
    `;
    return item;
  },

  // Обновление счётчика купленных генераторов
  // generatorId - ID генератора
  // owned - Новое количество купленных единиц
  updateGeneratorOwned(generatorId, owned) {
    const el = document.getElementById(`${generatorId}-owned`);
    if (el) el.textContent = owned;
  },

  // Создание карточки достижения
  // achievement - Объект достижения (id, name, desc)
  // isUnlocked - Разблокировано ли достижение
  // Возвращает готовый DOM-элемент для вставки в панель достижений
  createAchievementItem(achievement, isUnlocked) {
    const item = document.createElement("div");
    item.className = `shop-item achievement-item ${isUnlocked ? "unlocked" : "locked"}`;
    item.id = `achievement-${achievement.id}`;
    item.innerHTML = `
      <div class="shop-item-info">
        <div class="shop-item-name">${isUnlocked ? achievement.name : "🔒 ???"}</div>
        <div class="achievement-desc">${isUnlocked ? achievement.desc : "Условие не выполнено"}</div>
      </div>
      <div class="achievement-status">${isUnlocked ? "✅ Получено" : "🔒 Заблокировано"}</div>
    `;
    return item;
  },

  // Обновление карточки достижения после разблокировки
  // achievementId - ID достижения
  // achievement - Полный объект достижения с name и desc
  updateAchievementStatus(achievementId, achievement) {
    const el = document.getElementById(`achievement-${achievementId}`);
    if (!el) return;

    el.classList.add("unlocked");
    el.classList.remove("locked");

    const nameEl = el.querySelector(".shop-item-name");
    const descEl = el.querySelector(".achievement-desc");
    const statusEl = el.querySelector(".achievement-status");

    if (nameEl) nameEl.textContent = achievement.name;
    if (descEl) descEl.textContent = achievement.desc;
    if (statusEl) statusEl.textContent = "✅ Получено";
  },
};
