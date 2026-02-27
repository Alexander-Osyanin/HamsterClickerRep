import { Storage } from "./storage.js";
import { UI } from "./UI.js";

// Основной игровой модуль HamsterClicker
// Управляет игровой логикой, состоянием и взаимодействием с пользователем

const Game = {
  // Текущее количество монет игрока
  coins: 0,
  
  // Количество монет за один клик
  clickValue: 1,


  // Инициализация игры
  // Загружает сохраненные данные, настраивает обработчики событий и отрисовывает UI

  init() {
    this.loadGame();
    this.setupEventListeners();
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
    UI.animateClick(UI.elements.clickBtn);
  },

  // Обновление отображения игрового состояния
  // Синхронизирует UI с текущим состоянием игры

  render() {
    UI.updateCoins(this.coins);
  },


  // Сохранение текущего состояния игры в localStorage
  // Сохраняет количество монет и значение клика

  saveGame() {
    Storage.save({
      coins: this.coins,
      clickValue: this.clickValue,
    });
  },


  // Загрузка сохраненного состояния игры из localStorage
  // Восстанавливает прогресс игрока или устанавливает значения по умолчанию

  loadGame() {
    const savedData = Storage.load();
    if (savedData) {
      this.coins = savedData.coins || 0;
      this.clickValue = savedData.clickValue || 1;
    }
  },
};

// Экспорт для тестирования
export { Game };

// Запуск игры при загрузке модуля
Game.init();
