import { getTasks, getSubjects, createTask } from "./api.js";
import { save, read, STORAGE_KEYS } from "./storage.js";
import { validateNewTask } from "./validators.js";
import {
  resetErrors,
  resetError,
  showError,
  showSuccessMessage,
  applyTheme,
  updateTasksCount,
  createTaskCards,
  createSubjectMenu,
  emptyTasksContainers,
  changeCheckStatus,
  createTasksLayout,
  createLoadMessage,
  createEmptyTasksMessage
} from "./ui.js";

const menuButton = document.querySelector("#menu-button");
const sidebarBody = document.querySelector(".sidebar__body");
const themeButton = document.querySelector("#theme-button");
const subjectsMenu = document.querySelector(".subjects-menu");
const tasksPageContainer = document.querySelector(".tasks__content");
const newTaskBtn = document.getElementById("new-task-button");
const newTaskModal = document.getElementById("new-task-modal");
const newTaskForm = document.getElementById("new-task-form");
const cancelModalBtn = document.getElementById("cancel-modal-btn")
const saveModalBtn = document.getElementById("save-modal-btn");

// HAMBURGER MENU
menuButton.addEventListener("click", () => {
  sidebarBody.classList.toggle("sidebar__body--open");
});

// LIGHT/DARK MODE
let theme = read(STORAGE_KEYS.theme, "light"); // the first visit uses light
if (theme !== "light" && theme !== "dark") theme = "light"; // ignores an unexpected saved value
applyTheme(theme);

themeButton.addEventListener("click", () => {
  theme = theme === "light" ? "dark" : "light";
  applyTheme(theme);
  save(STORAGE_KEYS.theme, theme);
});

// SUBJECT MENU
subjectsMenu.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const subjectId = btn.dataset.id;

  if (subjectId === "all") {
    if (!userTasks.length) {
      updateTasksCount(0, 0);
      return createEmptyTasksMessage();
    }

    createTasksLayout();
    resetTasks(userTasks);
  } else {
    filterTasksBySubject(subjectId);
  }
});

// NEW TASK FORM
newTaskBtn.addEventListener("click", () => {
  newTaskModal.showModal();
});

cancelModalBtn.addEventListener("click", () => {
  newTaskModal.close();
});

newTaskForm.addEventListener("input", (e) => {
  if (e.target.name) {
    resetError(newTaskForm, e.target.name);
  }
});

newTaskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  resetErrors(newTaskForm);

  const subjectSelect = newTaskForm.querySelector("select");
  const selectedSubjectId = Number(subjectSelect.value);

  const formData = Object.fromEntries(new FormData(newTaskForm));
  formData.subjectId = subjectSelect.value;

  const errors = validateNewTask(formData);

  if (Object.keys(errors).length > 0) {
    Object.entries(errors).forEach(([fieldName, message]) => {
      showError(newTaskForm, fieldName, message);
    });
    return;
  }

  const payload = {
    title: formData.title,
    description: formData.description || "",
    subjectId: selectedSubjectId,
    dueDate: formData.due_date || "",
    dueTime: formData.due_time || ""
  };

  try {
    saveModalBtn.disabled = true;
    saveModalBtn.textContent = "Guardando...";

    const createdTask = await createTask(payload);

    const enrichedTask = {
      ...createdTask,
      status: createdTask.status || "pending",
      subject: userSubjects.find(s => String(s.id) === String(createdTask.subjectId))
    };

    userTasks.push(enrichedTask);
    createTasksLayout();
    resetTasks(userTasks);

    resetErrors(newTaskModal);
    newTaskModal.close();
    showSuccessMessage();
  } catch (error) {
    console.error(error);
    showError(newTaskForm, "title", error.message);
  } finally {
    saveModalBtn.disabled = false;
    saveModalBtn.textContent = "Guardar";
  }
});

tasksPageContainer.addEventListener("click", (e) => {
  const taskCard = e.target.closest(".task-card");
  if (!taskCard) return;

  //LISTENER DEL CHECKBOX
  const checkbox = e.target.closest(".task-card__check");
  if (!checkbox) return;
  changeCheckStatus(checkbox.dataset.status, checkbox);
});

let userTasks = [];
let userSubjects = [];
let pendingCount = 0;
let completedCount = 0;

async function init() {
  const loader = createLoadMessage("Cargando tus tareas...");
  tasksPageContainer.append(loader);

  try {
    const [subjects, rawTasks] = await Promise.all([
      getSubjects(),
      getTasks()
    ]);

    userSubjects = subjects;
    userTasks = rawTasks.map(task => ({
      ...task,
      subject: userSubjects.find(s => String(s.id) === String(task.subjectId))
    }));

    loader.remove();

    if (!subjects.length) {
      createEmptyTasksMessage();
      return;
    }

    createSubjectMenu(userSubjects);

    if (!userTasks.length || !userSubjects.length) {
      updateTasksCount(0, 0);
      createEmptyTasksMessage();
      return;
    }

    createTasksLayout();
    resetTasks(userTasks);
  } catch (error) {
    console.error(error);
    loader.textContent = "No pudimos cargar tu información. Intenta de nuevo.";
  }
}

function resetTasks(tasks) {
  emptyTasksContainers();
  createTaskCards(tasks);
  countTasks(tasks);
  updateTasksCount(pendingCount, completedCount);
}

function countTasks(tasks) {
  pendingCount = 0;
  completedCount = 0;
  tasks?.forEach(t => t.status === "pending" ? pendingCount++ : completedCount++);
}

// FILTRAR TAREAS POR MATERIA
function filterTasksBySubject(subjectId) {
  const subjectTasks = userTasks.filter(t =>
    String(t.subject?.id) === String(subjectId) // a task whose subject wasn't found has no subject
  );

  if (!subjectTasks.length) {
    updateTasksCount(0, 0); // otherwise the summary keeps the previous filter's numbers
    return createEmptyTasksMessage();
  }

  createTasksLayout();
  resetTasks(subjectTasks);
}

await init();
