import { UI } from "./UI.js";

// Модуль генераторов пассивного дохода
// Управляет автоматическим заработком монет в секунду

export const Generators = {

  // Список доступных генераторов пассивного дохода
  // Каждый генератор содержит базовую стоимость, доход в секунду и множитель роста цены

  list: [
    {
      id: "gen1",
      name: "🌻 Семечки",
      income: 1,
      baseCost: 15,
      costMultiplier: 1.15,
    },
    {
      id: "gen2",
      name: "🏃 Колесо",
      income: 8,
      baseCost: 150,
      costMultiplier: 1.2,
    },
    {
      id: "gen3",
      name: "🏭 Хомячья Ферма",
      income: 50,
      baseCost: 1500,
      costMultiplier: 1.25,
    },
  ],

  // Ссылка на объект игры
  game: null,

  // Инициализация модуля генераторов
  // game - Ссылка на основной объект игры
  // Создает элементы генераторов в DOM, настраивает обработчики и запускает таймер

  init(game) {
    this.game = game;
    this.renderGenerators();
    this.setupEventListeners();
    this.updateGenerators(game);
    this.startPassiveIncome();
  },

  // Отрисовка элементов генераторов
  // Создает DOM-элементы для всех генераторов с учётом уже купленных
  renderGenerators() {
    this.list.forEach((generator) => {
      const owned = this.game.generators[generator.id] || 0;
      const item = UI.createGeneratorItem(generator, owned);
      UI.elements.generatorItems.appendChild(item);
    });
  },

  // Настройка обработчиков кликов для кнопок покупки генераторов
  // Привязывает функцию покупки к каждой кнопке генератора
  setupEventListeners() {
    this.list.forEach((generator) => {
      const button = document.getElementById(`${generator.id}-btn`);
      button.addEventListener("click", () => {
        this.buyGenerator(generator);
      });
    });
  },

  // Покупка генератора
  // generator - Объект генератора для покупки
  // Вычисляет текущую цену и пытается купить генератор
  buyGenerator(generator) {
    const cost = this.getCurrentCost(generator);
    const success = this.game.buyGenerator(generator.id, cost, generator.income);

    if (success) {
      UI.updateGeneratorOwned(generator.id, this.game.generators[generator.id]);
      this.updateGenerators(this.game);
    }
  },

  // Вычисление текущей стоимости генератора
  // generator - Объект генератора
  // Возвращает стоимость с учётом количества уже купленных единиц
  // Формула: baseCost * (costMultiplier ^ количество_купленных)
  getCurrentCost(generator) {
    const owned = this.game.generators[generator.id] || 0;
    return Math.floor(generator.baseCost * Math.pow(generator.costMultiplier, owned));
  },

  // Обновление отображения генераторов
  // game - Текущее состояние игры
  // Обновляет цены и доступность кнопок покупки
  updateGenerators(game) {
    this.list.forEach((generator) => {
      const cost = this.getCurrentCost(generator);
      const canAfford = game.coins >= cost;

      const costElement = document.getElementById(`${generator.id}-cost`);
      const button = document.getElementById(`${generator.id}-btn`);

      costElement.textContent = cost;

      if (canAfford) {
        button.classList.remove("disabled");
      } else {
        button.classList.add("disabled");
      }
    });
  },

  // Запуск таймера пассивного дохода
  // Каждую секунду начисляет монеты на основе суммарного дохода всех генераторов
  startPassiveIncome() {
    setInterval(() => {
      const totalIncome = this.getTotalIncome();
      if (totalIncome > 0) {
        this.game.addPassiveCoins(totalIncome);
        this.updateGenerators(this.game);
      }
    }, 1000);
  },

  // Подсчёт суммарного дохода в секунду от всех генераторов
  // Возвращает суммарное количество монет в секунду
  getTotalIncome() {
    return this.list.reduce((total, generator) => {
      const owned = this.game.generators[generator.id] || 0;
      return total + owned * generator.income;
    }, 0);
  },
};
