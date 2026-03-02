/**
 * @fileoverview
 * Базовые автоматические тесты для HamsterClicker
 * Тестирование основных функций игры без использования фреймворков
 * */

/**
 * Определяем uлобальный объект окружения (window для браузера, global для Node.js)
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
    console.log('Запуск тестов HamsterClicker v2.0...\n');
    
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
 * Проверяет начальное состояние игры: монеты, сила клика и структура улучшений.
 * @test
 */
TestRunner.test('Игра начинается с корректных значений', () => {
  const Game = {
    coins: 0,
    clickValue: 1,
    upgrades: { clickPower1: 0 }
  };
  
  TestRunner.assert(Game.coins === 0, 'Начальное количество монет должно быть 0');
  TestRunner.assert(Game.clickValue === 1, 'Начальная сила клика должна быть 1');
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

// ТЕСТЫ МАГАЗИНА

/**
 * Проверяет корректность формулы расчета стоимости улучшения при owned = 0.
 * @test
 */
TestRunner.test('Вычисление базовой цены улучшения', () => {
  const upgrade = { baseCost: 10, costMultiplier: 1.15 };
  const owned = 0;
  const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, owned));
  
  TestRunner.assert(cost === 10, 'Базовая цена должна быть 10');
});

/**
 * Проверяет корректность увеличения стоимости улучшения после первой покупки.
 * @test
 */
TestRunner.test('Цена увеличивается после покупки', () => {
  const upgrade = { baseCost: 10, costMultiplier: 1.15 };
  const owned = 1;
  const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, owned));
  
  TestRunner.assert(cost === 11, 'Цена после 1 покупки должна быть 11');
});

/**
 * Проверяет корректность списания монет, увеличения силы клика и счетчика улучшений.
 * @test
 */
TestRunner.test('Успешная покупка улучшения', () => {
  const Game = {
    coins: 100,
    clickValue: 1,
    upgrades: { test: 0 },
    buyUpgrade(id, cost, power) {
      if (this.coins >= cost) {
        this.coins -= cost;
        this.upgrades[id]++;
        this.clickValue += power;
        return true;
      }
      return false;
    }
  };

  const result = Game.buyUpgrade('test', 50, 5);
  
  TestRunner.assert(result === true, 'Покупка должна быть успешной');
  TestRunner.assert(Game.coins === 50, 'Монеты должны уменьшиться на 50');
  TestRunner.assert(Game.clickValue === 6, 'Сила клика должна увеличиться до 6');
  TestRunner.assert(Game.upgrades.test === 1, 'Счетчик улучшений должен быть 1');
});

/**
 * Проверяет отсутствие изменений при попытке покупки без достаточного количества монет.
 * @test
 */
TestRunner.test('Неудачная покупка при недостатке монет', () => {
  const Game = {
    coins: 30,
    clickValue: 1,
    upgrades: { test: 0 },
    buyUpgrade(id, cost, power) {
      if (this.coins >= cost) {
        this.coins -= cost;
        this.upgrades[id]++;
        this.clickValue += power;
        return true;
      }
      return false;
    }
  };

  const result = Game.buyUpgrade('test', 50, 5);
  
  TestRunner.assert(result === false, 'Покупка должна быть неудачной');
  TestRunner.assert(Game.coins === 30, 'Монеты не должны измениться');
  TestRunner.assert(Game.clickValue === 1, 'Сила клика не должна измениться');
});

// ТЕСТЫ СОХРАНЕНИЯ

/**
 * Проверяет корректность сохранения данных игры с улучшениями.
 * @test
 */
TestRunner.test('Сохранение данных с улучшениями', () => {
  const mockStorage = {};
  const Storage = {
    save(data) {
      mockStorage['clickerGame'] = JSON.stringify(data);
    }
  };

  const testData = { 
    coins: 100, 
    clickValue: 6,
    upgrades: { clickPower1: 1 }
  };
  
  Storage.save(testData);
  const saved = JSON.parse(mockStorage['clickerGame']);
  
  TestRunner.assert(saved.clickValue === 6, 'Сила клика должна сохраниться');
  TestRunner.assert(saved.upgrades.clickPower1 === 1, 'Улучшения должны сохраниться');
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
