import { UI } from "./UI.js";

// Модуль системы достижений
// Управляет списком достижений и проверкой их выполнения

export const Achievements = {

  // Список достижений
  // Каждое достижение содержит id, название, описание и функцию-проверку условия
  list: [
    {
      id: "firstClick",
      name: "🐾 Первый Клик",
      desc: "Кликнуть хотя бы 1 раз",
      check: (stats) => stats.totalClicks >= 1,
    },
    {
      id: "click100",
      name: "👆 Кликер",
      desc: "Сделать 100 кликов",
      check: (stats) => stats.totalClicks >= 100,
    },
    {
      id: "click1000",
      name: "⚡ Фанатик Клика",
      desc: "Сделать 1000 кликов",
      check: (stats) => stats.totalClicks >= 1000,
    },
    {
      id: "earn100",
      name: "💰 Первые Монеты",
      desc: "Заработать 100 монет",
      check: (stats) => stats.totalEarned >= 100,
    },
    {
      id: "earn10000",
      name: "💎 Богач",
      desc: "Заработать 10 000 монет",
      check: (stats) => stats.totalEarned >= 10000,
    },
    {
      id: "earn1000000",
      name: "🏆 Миллионер",
      desc: "Заработать 1 000 000 монет",
      check: (stats) => stats.totalEarned >= 1000000,
    },
    {
      id: "buy1",
      name: "🛒 Первая Покупка",
      desc: "Купить 1 улучшение или генератор",
      check: (stats) => stats.totalPurchases >= 1,
    },
    {
      id: "buy10",
      name: "🏪 Шопоголик",
      desc: "Совершить 10 покупок",
      check: (stats) => stats.totalPurchases >= 10,
    },
    {
      id: "level5",
      name: "🌟 Опытный Хомяк",
      desc: "Достичь 5 уровня",
      check: (stats) => stats.level >= 5,
    },
    {
      id: "level10",
      name: "👑 Хомяк-Легенда",
      desc: "Достичь максимального уровня",
      check: (stats) => stats.level >= 10,
    },
    {
      id: "passive10",
      name: "😴 Пассивный Доход",
      desc: "Зарабатывать 10 монет в секунду",
      check: (stats) => stats.coinsPerSec >= 10,
    },
    {
      id: "passive100",
      name: "🏭 Промышленник",
      desc: "Зарабатывать 100 монет в секунду",
      check: (stats) => stats.coinsPerSec >= 100,
    },
  ],

  // Объект разблокированных достижений
  // Ключ - ID достижения, значение - true если разблокировано
  unlocked: {},

  // Ссылка на объект игры
  game: null,

  // Инициализация модуля достижений
  // game - Ссылка на основной объект игры
  // unlocked - Сохранённые разблокированные достижения
  init(game, unlocked) {
    this.game = game;
    this.unlocked = unlocked || {};
    this.renderAchievements();
  },

  // Отрисовка всех достижений в панели
  // Создаёт DOM-элементы для всех достижений
  renderAchievements() {
    this.list.forEach((achievement) => {
      const isUnlocked = !!this.unlocked[achievement.id];
      const item = UI.createAchievementItem(achievement, isUnlocked);
      UI.elements.achievementItems.appendChild(item);
    });
  },

  // Проверка всех достижений по текущей статистике
  // stats - Объект со статистикой игры
  // Разблокирует новые достижения и возвращает массив только что открытых
  check(stats) {
    const newlyUnlocked = [];

    this.list.forEach((achievement) => {
      if (!this.unlocked[achievement.id] && achievement.check(stats)) {
        this.unlocked[achievement.id] = true;
        newlyUnlocked.push(achievement);
        UI.updateAchievementStatus(achievement.id, achievement);
      }
    });

    return newlyUnlocked;
  },

  // Получение количества разблокированных достижений
  getUnlockedCount() {
    return Object.keys(this.unlocked).length;
  },
};
