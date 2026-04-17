// Модуль управления пользовательским интерфейсом v3.0
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
    coinsPerSec: document.getElementById("coinsPerSec"),
    tabUpgrades: document.getElementById("tab-upgrades"),
    tabGenerators: document.getElementById("tab-generators"),
    panelUpgrades: document.getElementById("panel-upgrades"),
    panelGenerators: document.getElementById("panel-generators"),
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

  // Инициализация переключения табов магазина
  // Привязывает обработчики к кнопкам переключения разделов
  initTabs() {
    this.elements.tabUpgrades.addEventListener("click", () => {
      this.switchTab("upgrades");
    });
    this.elements.tabGenerators.addEventListener("click", () => {
      this.switchTab("generators");
    });
  },

  // Переключение активного таба магазина
  // tab - Название таба: 'upgrades' или 'generators'
  switchTab(tab) {
    const isUpgrades = tab === "upgrades";

    this.elements.tabUpgrades.classList.toggle("active", isUpgrades);
    this.elements.tabGenerators.classList.toggle("active", !isUpgrades);
    this.elements.panelUpgrades.classList.toggle("hidden", !isUpgrades);
    this.elements.panelGenerators.classList.toggle("hidden", isUpgrades);
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
};
