//IMPORTS 
import { validateNewTask } from "./validators.js";
import { resetErrors, resetError, showError, showSuccessMessage } from "./ui.js";

const themeButton = document.querySelector("#theme-button");
const newTaskForm = document.querySelector("#new-task-form");

// LIGHT/DARK MODE
themeButton.addEventListener("click", () => {
  document.body.classList.toggle("dark");
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
