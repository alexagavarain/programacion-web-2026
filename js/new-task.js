//IMPORTS 
import { validateNewTask } from "./validators.js";
import { resetErrors, resetError, showError, showSuccessMessage, applyTheme } from "./ui.js";
import { save, read, STORAGE_KEYS } from "./storage.js";

const themeButton = document.querySelector("#theme-button");
const newTaskForm = document.querySelector("#new-task-form");

// LIGHT/DARK MODE
let theme = read(STORAGE_KEYS.theme, "light"); // the first visit uses light
if (theme !== "light" && theme !== "dark") theme = "light"; // ignores an unexpected saved value
applyTheme(theme);

themeButton.addEventListener("click", () => {
  theme = theme === "light" ? "dark" : "light";
  applyTheme(theme);
  save(STORAGE_KEYS.theme, theme);
});

// NEW TASK FORM
newTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  resetErrors(newTaskForm);

  const formData = Object.fromEntries(new FormData(newTaskForm));
  const errors = validateNewTask(formData);

  if (Object.keys(errors).length > 0) {
    Object.entries(errors).forEach(([fieldName, message]) => {
      showError(newTaskForm, fieldName, message);
    });
    return;
  }
  console.log("Tarea válida:", formData);
  newTaskForm.reset();
  showSuccessMessage();
});

newTaskForm.addEventListener("input", (e) => {
  if (e.target.name) {
    resetError(newTaskForm, e.target.name);
  }
});
