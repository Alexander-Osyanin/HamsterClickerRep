// Модуль управления пользовательским интерфейсом
// Отвечает за обновление DOM-элементов и визуальные эффекты

export const UI = {

  // Кэшированные ссылки на DOM-элементы
  // Получаем элементы один раз при загрузке модуля для оптимизации

  elements: {
    coins: document.getElementById("coins"),
    clickBtn: document.getElementById("clickBtn"),
  },

  
  // Обновление отображения количества монет
  // amount - Количество монет для отображения
  
  updateCoins(amount) {
    this.elements.coins.textContent = Math.floor(amount);
  },

  
  // Анимация клика по кнопке
  // Создает визуальный эффект нажатия с помощью трансформации масштаба
  // button - Элемент кнопки для анимации
  
  animateClick(button) {
    button.style.transform = "scale(0.95)";
    setTimeout(() => {
      button.style.transform = "";
    }, 100);
  },
};
