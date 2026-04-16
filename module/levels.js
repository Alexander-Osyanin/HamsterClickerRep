// Модуль системы уровней и прогресса
// Управляет уровнями игрока на основе суммарно заработанных монет

export const Levels = {

  // Таблица уровней
  // Каждый уровень содержит название и порог суммарно заработанных монет для достижения
  table: [
    { level: 1,  name: "Новичок",          threshold: 0       },
    { level: 2,  name: "Хомячок",          threshold: 100     },
    { level: 3,  name: "Грызун",           threshold: 500     },
    { level: 4,  name: "Накопитель",       threshold: 2000    },
    { level: 5,  name: "Предприниматель",  threshold: 8000    },
    { level: 6,  name: "Капиталист",       threshold: 25000   },
    { level: 7,  name: "Магнат",           threshold: 100000  },
    { level: 8,  name: "Олигарх",          threshold: 500000  },
    { level: 9,  name: "Миллионер",        threshold: 2000000 },
    { level: 10, name: "Хомяк-Легенда",    threshold: 10000000},
  ],

  // Ссылка на объект игры
  game: null,

  // Инициализация модуля уровней
  // game - Ссылка на основной объект игры
  init(game) {
    this.game = game;
  },

  // Получение текущего уровня на основе суммарно заработанных монет
  // totalEarned - суммарно заработанные монеты за всё время
  // Возвращает объект уровня из таблицы
  getCurrentLevel(totalEarned) {
    let current = this.table[0];
    for (const lvl of this.table) {
      if (totalEarned >= lvl.threshold) {
        current = lvl;
      }
    }
    return current;
  },

  // Получение следующего уровня
  // currentLevel - номер текущего уровня
  // Возвращает объект следующего уровня или null если максимальный
  getNextLevel(currentLevel) {
    return this.table.find(lvl => lvl.level === currentLevel + 1) || null;
  },

  // Вычисление прогресса в процентах до следующего уровня
  // totalEarned - суммарно заработанные монеты
  // Возвращает число от 0 до 100
  getProgress(totalEarned) {
    const current = this.getCurrentLevel(totalEarned);
    const next = this.getNextLevel(current.level);

    if (!next) return 100;

    const range = next.threshold - current.threshold;
    const progress = totalEarned - current.threshold;
    return Math.min(100, Math.floor((progress / range) * 100));
  },
};
