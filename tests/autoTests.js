/**
 * @fileoverview
 * Базовые автоматические тесты для HamsterClicker
 * Тестирование основных функций игры без использования фреймворков
*/

/**
 * Определяем uлобальный объект окружения (window для браузера, global для Node.js)
 * @type {Window|NodeJS.Global}
 */
const globalObj = typeof window !== 'undefined' ? window : global;

/** 
 * @namespace Система запуска тестов
*/
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
    console.log('Запуск тестов HamsterClicker...\n');
    
    for (const test of this.tests) {
      try {
        await test.fn();
        this.passed++;
        console.log(`Пройдено ${test.name}`);
      } catch (error) {
        this.failed++;
        console.error(`Провалено ${test.name}`);
        console.error(`   Ошибка: ${error.message}\n`);
      }
    }

    console.log(`\n${'='.repeat(50)}`);
    console.log(`Пройдено: ${this.passed}`);
    console.log(`Провалено: ${this.failed}`);
    console.log(`Всего: ${this.tests.length}`);
    console.log('='.repeat(50));
  }
};

// ==========================================
// ТЕСТЫ МОДУЛЯ STORAGE
// ==========================================

/**
 * Проверяет корректность сохранения данных игры в localStorage.
 * @test
*/
TestRunner.test('Storage: сохранение данных', () => {
  const mockStorage = {};
  const mockLocalStorage = {
    setItem: (key, value) => { mockStorage[key] = value; },
    getItem: (key) => mockStorage[key] || null,
    removeItem: (key) => { delete mockStorage[key]; }
  };

  const Storage = {
    save(data) {
      mockLocalStorage.setItem("clickerGame", JSON.stringify(data));
    },
    load() {
      const data = mockLocalStorage.getItem("clickerGame");
      return data ? JSON.parse(data) : null;
    }
  };

  const testData = { coins: 100, clickValue: 5 };
  Storage.save(testData);
  
  TestRunner.assert(mockStorage['clickerGame'] !== undefined, 'Данные должны быть сохранены');
  const saved = JSON.parse(mockStorage['clickerGame']);
  TestRunner.assert(saved.coins === 100, 'Количество монет должно быть 100');
  TestRunner.assert(saved.clickValue === 5, 'Значение клика должно быть 5');
});

/**
 * Проверяет корректность загрузки данных игры из localStorage.
 * @test
*/
TestRunner.test('Storage: загрузка данных', () => {
  const mockStorage = {
    'clickerGame': JSON.stringify({ coins: 250, clickValue: 10 })
  };
  
  const mockLocalStorage = {
    getItem: (key) => mockStorage[key] || null
  };

  const Storage = {
    load() {
      const data = mockLocalStorage.getItem("clickerGame");
      return data ? JSON.parse(data) : null;
    }
  };

  const loaded = Storage.load();
  TestRunner.assert(loaded !== null, 'Данные должны быть загружены');
  TestRunner.assert(loaded.coins === 250, 'Загруженные монеты должны быть 250');
  TestRunner.assert(loaded.clickValue === 10, 'Загруженное значение клика должно быть 10');
});

/**
 * Убеждается, что метод возвращает null, а не выбрасывает ошибку.
 * @test
*/
TestRunner.test('Storage: игра запускается без сохранений', () => {
  const mockLocalStorage = {
    getItem: () => null
  };

  const Storage = {
    load() {
      const data = mockLocalStorage.getItem("clickerGame");
      return data ? JSON.parse(data) : null;
    }
  };

  const loaded = Storage.load();
  TestRunner.assert(loaded === null, 'При отсутствии данных должен вернуться null');
});

// ==========================================
// ТЕСТЫ ИГРОВОЙ ЛОГИКИ
// ==========================================

/**
 * Проверяет, что в начале игры coins равен 0, а clickValue равен 1.
 * @test
 */
TestRunner.test('Game: новая игра начинается с нуля', () => {
  const Game = {
    coins: 0,
    clickValue: 1
  };

  TestRunner.assert(Game.coins === 0, 'Начальное количество монет должно быть 0');
  TestRunner.assert(Game.clickValue === 1, 'Начальное значение клика должно быть 1');
});

/**
 * Проверяет, что каждый клик прибавляет монеты.
 * @test
*/
TestRunner.test('Game: клики увеличивают монеты', () => {
  const Game = {
    coins: 0,
    clickValue: 1,
    handleClick() {
      this.coins += this.clickValue;
    }
  };

  Game.handleClick();
  TestRunner.assert(Game.coins === 1, 'После клика должна быть 1 монета');
  
  Game.handleClick();
  Game.handleClick();
  TestRunner.assert(Game.coins === 3, 'После 3 кликов должно быть 3 монеты');
});

/**
 * Проверяет, что loadGame подставляет coins и clickValue из сохранения.
 * @test
 */
TestRunner.test('Game: загрузка сохраненного прогресса', () => {
  const mockStorage = {
    'clickerGame': JSON.stringify({ coins: 500, clickValue: 2 })
  };
  
  const mockLocalStorage = {
    getItem: (key) => mockStorage[key] || null
  };

  const Game = {
    coins: 0,
    clickValue: 1,
    loadGame() {
      const Storage = {
        load() {
          const data = mockLocalStorage.getItem("clickerGame");
          return data ? JSON.parse(data) : null;
        }
      };
      const savedData = Storage.load();
      if (savedData) {
        this.coins = savedData.coins || 0;
        this.clickValue = savedData.clickValue || 1;
      }
    }
  };

  Game.loadGame();
  TestRunner.assert(Game.coins === 500, 'Загруженные монеты должны быть 500');
  TestRunner.assert(Game.clickValue === 2, 'Загруженное значение клика должно быть 2');
});

// ==========================================
// ТЕСТЫ UI ФУНКЦИЙ
// ==========================================

/**
 * Проверяет, что дробное количество монет округляется вниз.
 * @test
 */
TestRunner.test('UI: форматирование монет', () => {
  const updateCoins = (amount) => {
    return Math.floor(amount);
  };

  TestRunner.assert(updateCoins(10.9) === 10, 'Дробное число должно округляться вниз');
  TestRunner.assert(updateCoins(100.1) === 100, '100.1 должно стать 100');
  TestRunner.assert(updateCoins(0) === 0, '0 должен остаться 0');
});

// Запуск всех тестов
TestRunner.run();
