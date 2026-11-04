const themeButton = document.querySelector("#theme-button");
const newTaskForm = document.querySelector("#new-task-form");

// LIGHT/DARK MODE
themeButton.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// VALIDATORS
const isFilled = (value = "") => value.trim() !== ""; // FormData leaves out a select on its disabled placeholder, so value can be undefined
const hasMinLength = (value, min) => value.trim().length >= min;

function validateNewTask({ title, description, subject, due_date, due_time }) {
  const errors = {}; // {} means everything is valid
  if (!hasMinLength(title, 3)) errors.title = "Escribe un título (mínimo 3 letras)";
  if (!isFilled(description)) errors.description = "Escribe una descripción";
  if (!isFilled(subject)) errors.subject = "Selecciona una materia";
  if (!isFilled(due_date)) errors.due_date = "Elige una fecha de entrega";
  if (!isFilled(due_time)) errors.due_time = "Elige una hora de entrega";
  return errors; 
}

// NEW TASK FORM
newTaskForm.addEventListener("submit", (e) => {
  e.preventDefault(); // stops the page reload
  const data = Object.fromEntries(new FormData(newTaskForm));
  const errors = validateNewTask(data);

  if (Object.keys(errors).length > 0) {
    console.log("Errores:", errors); // for now errors only go to the console
    return;
  }
  console.log("Tarea válida:", data);
});
