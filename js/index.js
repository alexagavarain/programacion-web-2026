import { getTasks, getSubjects } from "./api.js";
import {
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

console.log(tasksPageContainer);

// HAMBURGER MENU
menuButton.addEventListener("click", () => {
  sidebarBody.classList.toggle("sidebar__body--open");
});

// LIGHT/DARK MODE
themeButton.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// SUBJECT MENU
subjectsMenu.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const subjectId = btn.dataset.id;

  if (subjectId === "all") {
    resetTasks(userTasks)
  } else {
    filterTasksBySubject(subjectId);
  }
});

tasksPageContainer.addEventListener("click", (e) => {
  const taskCard = e.target.closest(".task-card");
  if (!taskCard) return;
  console.log("click en la tarea");

  //LISTENER DEL CHECKBOX
  const checkbox = e.target.closest(".task-card__check");
  if (!checkbox) return;
  changeCheckStatus(checkbox.dataset.status, checkbox);
});

let userTasks = [];
let userSubjects = [];
let pendingCount = 0;
let completedCount = 0;

async function loadSubjects() {
  const subjectsLoader = createLoadMessage("Cargando materias...")
  tasksPageContainer.prepend(subjectsLoader);
  try {
    userSubjects = await getSubjects();

    if (!userSubjects.length) return;

    subjectsLoader.remove();
  } catch (error) {
    console.error(error);
    subjectsLoader.textContent = "No pudimos cargar tus materias";
  }
}

async function loadTasks() {
  const tasksLoader = createLoadMessage("Cargando tareas...")
  tasksPageContainer.prepend(tasksLoader);
  try {
    const rawTasks = await getTasks();

    if (!rawTasks.length) return;

    userTasks = rawTasks.map(task => ({
      ...task,
      subject: userSubjects.find(s => String(s.id) === String(task.subjectId))
    }));

    tasksLoader.remove();
  } catch (error) {
    console.error(error);
    tasksLoader.textContent = "No pudimos cargar tus tareas";
  }
}

async function init() {
  await loadSubjects();
  await loadTasks();

  createSubjectMenu(userSubjects);

  if (!userTasks.length) {
    updateTasksCount(0, 0);
    createEmptyTasksMessage();
    return;
  }

  createTasksLayout();
  resetTasks(userTasks);
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
    String(t.subject.id) === String(subjectId)
  );

  resetTasks(subjectTasks);
}

await init();
