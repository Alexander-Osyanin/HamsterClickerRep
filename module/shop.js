import { UI } from "./UI.js";

// Модуль магазина улучшений
// Управляет доступными улучшениями, их ценами и покупками

export const Shop = {

  // Список доступных улучшений
  // Каждое улучшение содержит базовую стоимость, силу и множитель роста цены

  upgrades: [
    {
      id: "clickPower1",
      name: "🐹 Сильная Лапка",
      power: 1,
      baseCost: 10,
      costMultiplier: 1.15,
    },
    {
      id: "clickPower2",
      name: "💪 Тренажёр",
      power: 5,
      baseCost: 100,
      costMultiplier: 1.2,
    },
    {
      id: "clickPower3",
      name: "⚡ Энергетик",
      power: 25,
      baseCost: 1000,
      costMultiplier: 1.25,
    },
  ],

  // Ссылка на объект игры
  game: null,

  // Инициализация магазина
  // game - Ссылка на основной объект игры
  // Создает элементы магазина и настраивает обработчики
  
  init(game) {
    this.game = game;
    this.renderShop();
    this.setupEventListeners();
    this.updateShop(game);
  },

  // Отрисовка элементов магазина
  // Создает DOM-элементы для всех улучшений
  renderShop() {
    this.upgrades.forEach((upgrade) => {
      const shopItem = UI.createShopItem(upgrade);
      UI.elements.shopItems.appendChild(shopItem);
    });
  },

  // Настройка обработчиков кликов для кнопок покупки
  // Привязывает функцию покупки к каждой кнопке улучшения
  setupEventListeners() {
    this.upgrades.forEach((upgrade) => {
      const button = document.getElementById(`${upgrade.id}-btn`);
      button.addEventListener("click", () => {
        this.buyUpgrade(upgrade);
      });
    });
  },

  // Покупка улучшения
  // upgrade - Объект улучшения для покупки
  // Вычисляет текущую цену и пытается купить улучшение
  buyUpgrade(upgrade) {
    const cost = this.getCurrentCost(upgrade);
    const success = this.game.buyUpgrade(upgrade.id, cost, upgrade.power);
    
    if (success) {
      this.updateShop(this.game);
    }
  },

  // Вычисление текущей стоимости улучшения
  // upgrade - Объект улучшения
  // Возвращает стоимость с учетом количества уже купленных копий
  // Формула: baseCost * (costMultiplier ^ количество_купленных)
  getCurrentCost(upgrade) {
    const owned = this.game.upgrades[upgrade.id];
    return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, owned));
  },

  // Обновление отображения магазина
  // game - Текущее состояние игры
  // Обновляет цены и доступность кнопок покупки
  updateShop(game) {
    this.upgrades.forEach((upgrade) => {
      const cost = this.getCurrentCost(upgrade);
      const canAfford = game.coins >= cost;

      const costElement = document.getElementById(`${upgrade.id}-cost`);
      const button = document.getElementById(`${upgrade.id}-btn`);

      costElement.textContent = cost;

      if (canAfford) {
        button.classList.remove("disabled");
      } else {
        button.classList.add("disabled");
      }
    });
  },
};
