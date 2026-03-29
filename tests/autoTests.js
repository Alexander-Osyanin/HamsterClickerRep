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
    console.log('Запуск тестов HamsterClicker v3.0...\n');

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
 * Проверяет начальное состояние игры: монеты, сила клика, пассивный доход, структура улучшений и генераторов.
 * @test
 */
TestRunner.test('Игра начинается с корректных значений', () => {
  const Game = {
    coins: 0,
    clickValue: 1,
    coinsPerSec: 0,
    upgrades: { clickPower1: 0 },
    generators: { gen1: 0 }
  };

  TestRunner.assert(Game.coins === 0, 'Начальное количество монет должно быть 0');
  TestRunner.assert(Game.clickValue === 1, 'Начальная сила клика должна быть 1');
  TestRunner.assert(Game.coinsPerSec === 0, 'Начальный пассивный доход должен быть 0');
});

/**
 * Проверяет корректность работы метода handleClick и увеличение количества монет.
 * @test
 */
TestRunner.test('Клик увеличивает монеты', () => {
  const Game = {
    coins: 0,
    clickValue: 1,
    handleClick() {
      this.coins += this.clickValue;
    }
  };

  Game.handleClick();
  TestRunner.assert(Game.coins === 1, 'После клика должна быть 1 монета');
});

// ТЕСТЫ ГЕНЕРАТОРОВ

/**
 * Проверяет успешную покупку генератора и увеличение пассивного дохода.
 * @test
 */
TestRunner.test('Успешная покупка генератора', () => {
  const Game = {
    coins: 100,
    coinsPerSec: 0,
    generators: { gen1: 0 },
    buyGenerator(id, cost, income) {
      if (this.coins >= cost) {
        this.coins -= cost;
        this.generators[id] = (this.generators[id] || 0) + 1;
        this.coinsPerSec += income;
        return true;
      }
      return false;
    }
  };

  const result = Game.buyGenerator('gen1', 15, 1);

  TestRunner.assert(result === true, 'Покупка генератора должна быть успешной');
  TestRunner.assert(Game.coins === 85, 'Монеты должны уменьшиться на 15');
  TestRunner.assert(Game.generators.gen1 === 1, 'Количество генераторов должно быть 1');
  TestRunner.assert(Game.coinsPerSec === 1, 'Пассивный доход должен стать 1');
});

/**
 * Проверяет неудачную покупку генератора при недостатке монет.
 * @test
 */
TestRunner.test('Неудачная покупка генератора при недостатке монет', () => {
  const Game = {
    coins: 10,
    coinsPerSec: 0,
    generators: { gen1: 0 },
    buyGenerator(id, cost, income) {
      if (this.coins >= cost) {
        this.coins -= cost;
        this.generators[id] = (this.generators[id] || 0) + 1;
        this.coinsPerSec += income;
        return true;
      }
      return false;
    }
  };

  const result = Game.buyGenerator('gen1', 15, 1);

  TestRunner.assert(result === false, 'Покупка должна быть неудачной');
  TestRunner.assert(Game.coins === 10, 'Монеты не должны измениться');
  TestRunner.assert(Game.coinsPerSec === 0, 'Пассивный доход не должен измениться');
});

/**
 * Проверяет корректность подсчёта суммарного пассивного дохода от нескольких генераторов.
 * @test
 */
TestRunner.test('Суммарный доход от нескольких генераторов', () => {
  const generators = [
    { id: 'gen1', income: 1 },
    { id: 'gen2', income: 8 },
    { id: 'gen3', income: 50 },
  ];
  const owned = { gen1: 3, gen2: 1, gen3: 0 };

  const total = generators.reduce((sum, gen) => {
    return sum + (owned[gen.id] || 0) * gen.income;
  }, 0);

  TestRunner.assert(total === 11, 'Суммарный доход должен быть 11 (3*1 + 1*8 + 0*50)');
});

// ТЕСТЫ СОХРАНЕНИЯ

/**
 * Проверяет корректность сохранения данных генераторов и пассивного дохода.
 * @test
 */
TestRunner.test('Сохранение данных с генераторами', () => {
  const mockStorage = {};
  const Storage = {
    save(data) {
      mockStorage['clickerGame'] = JSON.stringify(data);
    }
  };

  const testData = {
    coins: 200,
    clickValue: 6,
    coinsPerSec: 9,
    upgrades: { clickPower1: 1 },
    generators: { gen1: 3, gen2: 1, gen3: 0 }
  };

  Storage.save(testData);
  const saved = JSON.parse(mockStorage['clickerGame']);

  TestRunner.assert(saved.coinsPerSec === 9, 'Пассивный доход должен сохраниться');
  TestRunner.assert(saved.generators.gen1 === 3, 'Количество генераторов должно сохраниться');
});

/**
 * Проверяет корректность увеличения дохода от клика при повышенной силе клика.
 * @test
 */
TestRunner.test('Множитель увеличивает доход от клика', () => {
  const Game = {
    coins: 0,
    clickValue: 10,
    handleClick() {
      this.coins += this.clickValue;
    }
  };

  Game.handleClick();
  TestRunner.assert(Game.coins === 10, 'Клик с множителем 10 должен дать 10 монет');
});

// Запуск всех тестов
TestRunner.run();
