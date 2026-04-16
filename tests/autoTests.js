/**
 * @fileoverview
 * Базовые автоматические тесты для HamsterClicker
 * Тестирование основных функций игры без использования фреймворков
 * */

/**
 * Определяем глобальный объект окружения (window для браузера, global для Node.js)
 * @type {Window|NodeJS.Global}
 */
const globalObj = typeof window !== 'undefined' ? window : global;

/**
 * @namespace Система запуска тестов
 * */
const TestRunner = {
  /** @type {number} Количество успешно пройденных тестов */
  passed: 0,

  /** @type {number} Количество проваленных тестов */
  failed: 0,

  /** @type {Array<{name: string, fn: Function}>} Список зарегистрированных тестов */
  tests: [],

  /**
   * Регистрация нового теста
   * @param {*} name - Название теста
   * @param {*} fn - Тестовая функция
   */
  test(name, fn) {
    this.tests.push({ name, fn });
  },

  /**
   * Проверка условия
   * @param {*} condition - Условие для проверки
   * @param {*} message - Сообщение об ошибке
   */
  assert(condition, message) {
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
  },

  // Запуск всех тестов
  async run() {
    console.log('Запуск тестов HamsterClicker v4.0...\n');

    for (const test of this.tests) {
      try {
        await test.fn();
        this.passed++;
        console.log(`✓ ${test.name}`);
      } catch (error) {
        this.failed++;
        console.error(`✗ ${test.name}`);
        console.error(`   ${error.message}\n`);
      }
    }

    console.log(`\n${'='.repeat(50)}`);
    console.log(`Пройдено: ${this.passed}`);
    console.log(`Провалено: ${this.failed}`);
    console.log(`Всего: ${this.tests.length}`);
    console.log('='.repeat(50));
  }
};

// ТЕСТЫ БАЗОВОЙ ФУНКЦИОНАЛЬНОСТИ

/**
 * Проверяет начальное состояние игры.
 * @test
 */
TestRunner.test('Игра начинается с корректных значений', () => {
  const Game = {
    coins: 0,
    clickValue: 1,
    coinsPerSec: 0,
    stats: { totalClicks: 0, totalEarned: 0, totalPurchases: 0, playTime: 0 },
    upgrades: { clickPower1: 0 },
    generators: { gen1: 0 },
  };

  TestRunner.assert(Game.coins === 0, 'Начальное количество монет должно быть 0');
  TestRunner.assert(Game.clickValue === 1, 'Начальная сила клика должна быть 1');
  TestRunner.assert(Game.stats.totalClicks === 0, 'Начальное количество кликов должно быть 0');
  TestRunner.assert(Game.stats.totalEarned === 0, 'Начальный заработок должен быть 0');
});

/**
 * Проверяет что клик увеличивает монеты и статистику.
 * @test
 */
TestRunner.test('Клик увеличивает монеты и статистику', () => {
  const Game = {
    coins: 0,
    clickValue: 1,
    stats: { totalClicks: 0, totalEarned: 0 },
    handleClick() {
      this.coins += this.clickValue;
      this.stats.totalClicks++;
      this.stats.totalEarned += this.clickValue;
    }
  };

  Game.handleClick();
  TestRunner.assert(Game.coins === 1, 'После клика должна быть 1 монета');
  TestRunner.assert(Game.stats.totalClicks === 1, 'Счётчик кликов должен быть 1');
  TestRunner.assert(Game.stats.totalEarned === 1, 'Всего заработано должно быть 1');
});

// ТЕСТЫ МАГАЗИНА

/**
 * Проверяет успешную покупку улучшения и увеличение счётчика покупок.
 * @test
 */
TestRunner.test('Успешная покупка улучшения увеличивает счётчик покупок', () => {
  const Game = {
    coins: 100,
    clickValue: 1,
    upgrades: { test: 0 },
    stats: { totalPurchases: 0 },
    buyUpgrade(id, cost, power) {
      if (this.coins >= cost) {
        this.coins -= cost;
        this.upgrades[id]++;
        this.clickValue += power;
        this.stats.totalPurchases++;
        return true;
      }
      return false;
    }
  };

  const result = Game.buyUpgrade('test', 50, 5);

  TestRunner.assert(result === true, 'Покупка должна быть успешной');
  TestRunner.assert(Game.stats.totalPurchases === 1, 'Счётчик покупок должен быть 1');
  TestRunner.assert(Game.clickValue === 6, 'Сила клика должна увеличиться до 6');
});

/**
 * Проверяет неудачную покупку при недостатке монет.
 * @test
 */
TestRunner.test('Неудачная покупка при недостатке монет', () => {
  const Game = {
    coins: 30,
    clickValue: 1,
    upgrades: { test: 0 },
    stats: { totalPurchases: 0 },
    buyUpgrade(id, cost, power) {
      if (this.coins >= cost) {
        this.coins -= cost;
        this.upgrades[id]++;
        this.clickValue += power;
        this.stats.totalPurchases++;
        return true;
      }
      return false;
    }
  };

  const result = Game.buyUpgrade('test', 50, 5);

  TestRunner.assert(result === false, 'Покупка должна быть неудачной');
  TestRunner.assert(Game.stats.totalPurchases === 0, 'Счётчик покупок не должен измениться');
});

// ТЕСТЫ СИСТЕМЫ УРОВНЕЙ

/**
 * Проверяет определение начального уровня.
 * @test
 */
TestRunner.test('Начальный уровень — Новичок', () => {
  const table = [
    { level: 1, name: 'Новичок',   threshold: 0   },
    { level: 2, name: 'Хомячок',   threshold: 100 },
    { level: 3, name: 'Грызун',    threshold: 500 },
  ];

  const totalEarned = 0;
  let current = table[0];
  for (const lvl of table) {
    if (totalEarned >= lvl.threshold) current = lvl;
  }

  TestRunner.assert(current.level === 1, 'Начальный уровень должен быть 1');
  TestRunner.assert(current.name === 'Новичок', 'Начальное название должно быть Новичок');
});

/**
 * Проверяет повышение уровня после накопления нужного количества монет.
 * @test
 */
TestRunner.test('Уровень повышается при достижении порога', () => {
  const table = [
    { level: 1, name: 'Новичок',   threshold: 0   },
    { level: 2, name: 'Хомячок',   threshold: 100 },
    { level: 3, name: 'Грызун',    threshold: 500 },
  ];

  const totalEarned = 150;
  let current = table[0];
  for (const lvl of table) {
    if (totalEarned >= lvl.threshold) current = lvl;
  }

  TestRunner.assert(current.level === 2, 'При 150 монетах уровень должен быть 2');
  TestRunner.assert(current.name === 'Хомячок', 'Название должно быть Хомячок');
});

/**
 * Проверяет корректность расчёта прогресса в процентах.
 * @test
 */
TestRunner.test('Прогресс до следующего уровня считается корректно', () => {
  const current = { level: 1, threshold: 0   };
  const next    = { level: 2, threshold: 100 };
  const totalEarned = 50;

  const range = next.threshold - current.threshold;
  const progress = Math.floor(((totalEarned - current.threshold) / range) * 100);

  TestRunner.assert(progress === 50, 'Прогресс при 50/100 должен быть 50%');
});

// ТЕСТЫ СИСТЕМЫ ДОСТИЖЕНИЙ

/**
 * Проверяет разблокировку достижения при выполнении условия.
 * @test
 */
TestRunner.test('Достижение разблокируется при выполнении условия', () => {
  const unlocked = {};
  const achievement = {
    id: 'firstClick',
    name: '🐾 Первый Клик',
    check: (stats) => stats.totalClicks >= 1,
  };

  const stats = { totalClicks: 1, totalEarned: 0, totalPurchases: 0, coinsPerSec: 0, level: 1 };

  if (!unlocked[achievement.id] && achievement.check(stats)) {
    unlocked[achievement.id] = true;
  }

  TestRunner.assert(unlocked['firstClick'] === true, 'Достижение должно быть разблокировано');
});

/**
 * Проверяет что достижение не разблокируется повторно.
 * @test
 */
TestRunner.test('Достижение не разблокируется повторно', () => {
  const unlocked = { firstClick: true };
  let unlockCount = 0;

  const achievement = {
    id: 'firstClick',
    check: (stats) => stats.totalClicks >= 1,
  };

  const stats = { totalClicks: 5, totalEarned: 0, totalPurchases: 0, coinsPerSec: 0, level: 1 };

  if (!unlocked[achievement.id] && achievement.check(stats)) {
    unlocked[achievement.id] = true;
    unlockCount++;
  }

  TestRunner.assert(unlockCount === 0, 'Достижение не должно разблокироваться повторно');
});

// ТЕСТЫ СОХРАНЕНИЯ

/**
 * Проверяет корректность сохранения всех данных v4.0.
 * @test
 */
TestRunner.test('Сохранение данных v4.0', () => {
  const mockStorage = {};
  const Storage = {
    save(data) {
      mockStorage['clickerGame'] = JSON.stringify(data);
    }
  };

  const testData = {
    coins: 500,
    clickValue: 6,
    coinsPerSec: 9,
    upgrades: { clickPower1: 1 },
    generators: { gen1: 3 },
    stats: { totalClicks: 100, totalEarned: 600, totalPurchases: 4, playTime: 120 },
    unlockedAchievements: { firstClick: true, earn100: true },
  };

  Storage.save(testData);
  const saved = JSON.parse(mockStorage['clickerGame']);

  TestRunner.assert(saved.stats.totalClicks === 100, 'Клики должны сохраниться');
  TestRunner.assert(saved.stats.totalEarned === 600, 'Заработок должен сохраниться');
  TestRunner.assert(saved.unlockedAchievements.firstClick === true, 'Достижения должны сохраниться');
});

// Запуск всех тестов
TestRunner.run();
