/**
 * Per-user meal library helpers (state.mealLibrary, state.todayPlan).
 */
(function (global) {
  function getMealLibrary(state) {
    return Array.isArray(state?.mealLibrary) ? state.mealLibrary : [];
  }

  function getTodayPlan(state) {
    return Array.isArray(state?.todayPlan) ? state.todayPlan : [];
  }

  function getMeal(state, id) {
    return getMealLibrary(state).find((m) => m.id === id) || null;
  }

  function newMealId() {
    return (
      "meal-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7)
    );
  }

  function parseIngredients(text) {
    return String(text || "")
      .split(/[,;\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  global.MealLibrary = {
    getMealLibrary,
    getTodayPlan,
    getMeal,
    newMealId,
    parseIngredients,
    escapeHtml,
  };
})(window);
