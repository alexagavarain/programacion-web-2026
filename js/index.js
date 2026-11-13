import { getTasks, getSubjects } from "./api.js";
import {
  updateTasksCount,
  createTaskCards,
  createSubjectMenu,
  emptyTasksContainers
} from "./ui.js";

const menuButton = document.querySelector("#menu-button");
const sidebarBody = document.querySelector(".sidebar__body");
const themeButton = document.querySelector("#theme-button");
const subjectsMenu = document.querySelector(".subjects-menu");

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

let userTasks = [];
let userSubjects = [];
let pendingCount = 0;
let completedCount = 0;

async function init() {
  try {
    const rawTasks = await getTasks();
    userSubjects = await getSubjects();

    // ASIGNAR EL OBJ MATERIA A CADA TAREA
    userTasks = rawTasks.map(task => ({
      ...task,
      subject: userSubjects.find(s => String(s.id) === String(task.subjectId))
    }));

    createSubjectMenu(userSubjects);
    resetTasks(userTasks);
    return;
  } catch (error) {
    console.error(error)
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
    String(t.subject.id) === String(subjectId)
  );

  resetTasks(subjectTasks);
}

await init();
