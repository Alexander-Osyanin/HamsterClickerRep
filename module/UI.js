// Модуль управления пользовательским интерфейсом v2.0
// Отвечает за обновление DOM-элементов и визуальные эффекты

export const UI = {

  // Кэшированные ссылки на DOM-элементы
  // Получаем элементы один раз при загрузке модуля для оптимизации

  elements: {
    coins: document.getElementById("coins"),
    clickBtn: document.getElementById("clickBtn"),
    multiplier: document.getElementById("multiplier"),
    shopItems: document.getElementById("shopItems"),
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

  // Создание элемента улучшения для магазина
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
};
