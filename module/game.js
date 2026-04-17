import { Storage } from "./storage.js";
import { UI } from "./UI.js";
import { Shop } from "./shop.js";
import { Generators } from "./generators.js";
import { Levels } from "./levels.js";
import { Achievements } from "./achievements.js";

// Основной игровой модуль HamsterClicker
// Управляет игровой логикой, состоянием и взаимодействием с пользователем

const Game = {
  // Текущее количество монет игрока
  coins: 0,

  // Количество монет за один клик
  clickValue: 1,

  // Пассивный доход в секунду
  coinsPerSec: 0,

  // Объект для хранения купленных улучшений
  // Ключ - ID улучшения, значение - количество купленных копий
  upgrades: {
    clickPower1: 0,
    clickPower2: 0,
    clickPower3: 0,
  },

  // Объект для хранения купленных генераторов пассивного дохода
  // Ключ - ID генератора, значение - количество купленных единиц
  generators: {
    gen1: 0,
    gen2: 0,
    gen3: 0,
  },

  // Расширенная статистика
  stats: {
    totalClicks: 0,       // Всего кликов за всё время
    totalEarned: 0,       // Всего монет заработано за всё время
    totalPurchases: 0,    // Всего совершено покупок
    playTime: 0,          // Время игры в секундах
  },

  // Разблокированные достижения — хранятся отдельно для удобства сохранения
  unlockedAchievements: {},

  // Инициализация игры
  // Загружает сохраненные данные, настраивает обработчики событий и отрисовывает UI
  init() {
    this.loadGame();
    this.setupEventListeners();
    Shop.init(this);
    Generators.init(this);
    Levels.init(this);
    Achievements.init(this, this.unlockedAchievements);
    UI.initTabs();
    this.startPlayTimer();
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
    this.stats.totalClicks++;
    this.stats.totalEarned += this.clickValue;
    this.render();
    this.saveGame();
    this.checkAchievements();
    Shop.updateShop(this);
    Generators.updateGenerators(this);
    UI.animateClick(UI.elements.clickBtn);
    UI.showFloatingText(`+${this.clickValue}`, UI.elements.clickBtn);
  },

  // Покупка улучшения клика
  // upgradeId - ID улучшения для покупки
  // cost - стоимость улучшения
  // power - увеличение силы клика
  // Возвращает true если покупка успешна, false если недостаточно монет
  buyUpgrade(upgradeId, cost, power) {
    if (this.coins >= cost) {
      this.coins -= cost;
      this.upgrades[upgradeId]++;
      this.clickValue += power;
      this.stats.totalPurchases++;
      this.render();
      this.saveGame();
      this.checkAchievements();
      return true;
    }
    return false;
  },

  // Покупка генератора пассивного дохода
  // generatorId - ID генератора для покупки
  // cost - стоимость генератора
  // income - доход в секунду от одной единицы генератора
  // Возвращает true если покупка успешна, false если недостаточно монет
  buyGenerator(generatorId, cost, income) {
    if (this.coins >= cost) {
      this.coins -= cost;
      this.generators[generatorId] = (this.generators[generatorId] || 0) + 1;
      this.coinsPerSec += income;
      this.stats.totalPurchases++;
      this.render();
      this.saveGame();
      this.checkAchievements();
      return true;
    }
    return false;
  },

  // Начисление пассивных монет от генераторов
  // amount - Количество монет для начисления
  addPassiveCoins(amount) {
    this.coins += amount;
    this.stats.totalEarned += amount;
    this.render();
    this.saveGame();
    this.checkAchievements();
  },

  // Проверка достижений по текущей статистике
  // Показывает уведомления для только что открытых достижений
  checkAchievements() {
    const currentLevel = Levels.getCurrentLevel(this.stats.totalEarned);
    const statsForCheck = {
      totalClicks: this.stats.totalClicks,
      totalEarned: this.stats.totalEarned,
      totalPurchases: this.stats.totalPurchases,
      coinsPerSec: this.coinsPerSec,
      level: currentLevel.level,
    };

    const newlyUnlocked = Achievements.check(statsForCheck);
    newlyUnlocked.forEach((achievement) => {
      UI.showAchievementNotification(achievement);
    });

    if (newlyUnlocked.length > 0) {
      this.unlockedAchievements = Achievements.unlocked;
      this.saveGame();
    }
  },

  // Обновление отображения игрового состояния
  // Синхронизирует UI с текущим состоянием игры
  render() {
    UI.updateCoins(this.coins);
    UI.updateMultiplier(this.clickValue);
    UI.updateCoinsPerSec(this.coinsPerSec);
    UI.updateStats(this.stats);
    this.renderLevel();
  },

  // Обновление блока уровня и прогресс-бара
  renderLevel() {
    const totalEarned = this.stats.totalEarned;
    const current = Levels.getCurrentLevel(totalEarned);
    const next = Levels.getNextLevel(current.level);
    const progress = Levels.getProgress(totalEarned);

    const progressCurrent = totalEarned - current.threshold;
    const progressNext = next ? next.threshold - current.threshold : 0;

    UI.updateLevel(
      current.level,
      current.name,
      progress,
      progressCurrent,
      progressNext
    );
  },

  // Запуск таймера игрового времени
  // Каждую секунду увеличивает счётчик и обновляет статистику
  startPlayTimer() {
    setInterval(() => {
      this.stats.playTime++;
      UI.updateStats(this.stats);
    }, 1000);
  },

  // Сохранение текущего состояния игры в localStorage
  saveGame() {
    Storage.save({
      coins: this.coins,
      clickValue: this.clickValue,
      coinsPerSec: this.coinsPerSec,
      upgrades: this.upgrades,
      generators: this.generators,
      stats: this.stats,
      unlockedAchievements: this.unlockedAchievements,
    });
  },

  // Загрузка сохраненного состояния игры из localStorage
  // Восстанавливает прогресс игрока или устанавливает значения по умолчанию
  loadGame() {
    const savedData = Storage.load();
    if (savedData) {
      this.coins = savedData.coins || 0;
      this.clickValue = savedData.clickValue || 1;
      this.coinsPerSec = savedData.coinsPerSec || 0;
      this.upgrades = savedData.upgrades || this.upgrades;
      this.generators = savedData.generators || this.generators;
      this.stats = savedData.stats || this.stats;
      this.unlockedAchievements = savedData.unlockedAchievements || {};
    }
  },
};

// Экспорт для тестирования
export { Game };

// Запуск игры при загрузке модуля
Game.init();
