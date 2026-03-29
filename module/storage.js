// Модуль для работы с localStorage
// Обеспечивает сохранение и загрузку игрового прогресса
// Использует отдельный ключ для совместимости с другими версиями

export const Storage = {

  // Сохранение данных в localStorage
  // Преобразует объект данных в JSON и сохраняет под ключом 'clickerGame'
  // data - Объект с данными игры для сохранения
  
  save(data) {
    localStorage.setItem("clickerGame", JSON.stringify(data));
  },

  // Загрузка данных из localStorage
  // Получает сохраненные данные и парсит из JSON
  // Возвращает объект с сохраненными данными или null, если данных нет
  load() {
    const data = localStorage.getItem("clickerGame");
    return data ? JSON.parse(data) : null;
  },

  // Очистка сохраненных данных
  // Удаляет все сохраненные данные игры из localStorage
  clear() {
    localStorage.removeItem("clickerGame");
  },
};
