import { Storage } from "./storage.js";
import { UI } from "./UI.js";
import { Shop } from "./shop.js";

// Основной игровой модуль HamsterClicker
// Управляет игровой логикой, состоянием и взаимодействием с пользователем

const Game = {
  // Текущее количество монет игрока
  coins: 0,
  
  // Количество монет за один клик
  clickValue: 1,

  // Объект для хранения купленных улучшений
  // Ключ - ID улучшения, значение - количество купленных копий
  upgrades: {
    clickPower1: 0,
    clickPower2: 0,
    clickPower3: 0,
  },

  // Инициализация игры
  // Загружает сохраненные данные, настраивает обработчики событий и отрисовывает UI
  init() {
    this.loadGame();
    this.setupEventListeners();
    Shop.init(this);
    this.render();
  },

  // Настройка обработчиков событий
  // Привязывает клик по кнопке к обработчику
  setupEventListeners() {
    UI.elements.clickBtn.addEventListener("click", () => {
      this.handleClick();
    });
  },

  // Обработчик клика по кнопке
  // Увеличивает счетчик монет, обновляет UI, сохраняет прогресс и запускает анимацию
  handleClick() {
    this.coins += this.clickValue;
    this.render();
    this.saveGame();
    Shop.updateShop(this);
    UI.animateClick(UI.elements.clickBtn);
    UI.showFloatingText(`+${this.clickValue}`, UI.elements.clickBtn);
  },

  // Покупка улучшения
  // upgradeId - ID улучшения для покупки
  // cost - стоимость улучшения
  // power - увеличение силы клика
  // Возвращает true если покупка успешна, false если недостаточно монет
  buyUpgrade(upgradeId, cost, power) {
    if (this.coins >= cost) {
      this.coins -= cost;
      this.upgrades[upgradeId]++;
      this.clickValue += power;
      this.render();
      this.saveGame();
      return true;
    }
    return false;
  },

  // Обновление отображения игрового состояния
  // Синхронизирует UI с текущим состоянием игры
  render() {
    UI.updateCoins(this.coins);
    UI.updateMultiplier(this.clickValue);
  },

  // Сохранение текущего состояния игры в localStorage
  // Сохраняет количество монет, значение клика и купленные улучшения
  saveGame() {
    Storage.save({
      coins: this.coins,
      clickValue: this.clickValue,
      upgrades: this.upgrades,
    });
  },

  // Загрузка сохраненного состояния игры из localStorage
  // Восстанавливает прогресс игрока или устанавливает значения по умолчанию
  loadGame() {
    const savedData = Storage.load();
    if (savedData) {
      this.coins = savedData.coins || 0;
      this.clickValue = savedData.clickValue || 1;
      this.upgrades = savedData.upgrades || this.upgrades;
    }
  },
};

// Экспорт для тестирования
export { Game };

// Запуск игры при загрузке модуля
Game.init();
