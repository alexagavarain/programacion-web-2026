const menuButton = document.querySelector("#menu-button");
const sidebarBody = document.querySelector(".sidebar__body");
const themeButton = document.querySelector("#theme-button");
const pendingTasksContainer = document.getElementById("pending-tasks__list");
const completedTasksContainer = document.getElementById("completed-tasks__list");

// MATERIAS
const userSubjects = [{
  id: 1,
  name: "Materia 1"
}, {
  id: 2,
  name: "Materia 2"
}, {
  id: 3,
  name: "Materia 3"
}, {
  id: 4,
  name: "Materia 4"
}, {
  id: 5,
  name: "Materia 5"
}]

// TAREAS
const userTasks = [{
  id: 1,
  title: "Tarea 1",
  description: "Descripcion de la tarea 1",
  subject: userSubjects[0],
  dueDate: "2026-10-30",
  status: "pending"
}, {
  id: 2,
  title: "Tarea 2",
  description: "Descripcion de la tarea 2",
  subject: userSubjects[1],
  dueDate: "2026-10-30",
  status: "pending"
}, {
  id: 3,
  title: "Tarea 3",
  description: "Descripcion de la tarea 3",
  subject: userSubjects[2],
  dueDate: "2026-10-30",
  status: "pending"
}, {
  id: 4,
  title: "Tarea 4",
  description: "Descripcion de la tarea 4",
  subject: userSubjects[3],
  dueDate: "2026-10-30",
  status: "completed"
}, {
  id: 5,
  title: "Tarea 5",
  description: "Descripcion de la tarea 5",
  subject: userSubjects[4],
  dueDate: "2026-10-30",
  status: "completed"
}];

// HAMBURGER MENU
menuButton.addEventListener("click", () => {
  sidebarBody.classList.toggle("sidebar__body--open");
});

// LIGHT/DARK MODE
themeButton.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

let pendingCount;
let completedCount;

// CREAR TAREAS
function createTaskCards(tasks) {
  pendingCount = 0;
  completedCount = 0;

  tasks.forEach(t => {
    let isPending;

    t.status === "pending" ? isPending = true : isPending = false;

    isPending ? pendingCount++ : completedCount++;

    const taskCard = document.createElement("div");
    taskCard.classList.add("task-card");

    const taskColorBar = document.createElement("div");
    taskColorBar.classList.add("task-card__color");

    const taskContentBox = document.createElement("div");
    taskContentBox.classList.add("task-card__content");

    const checkbox = document.createElement("img");
    checkbox.src = isPending ? "assets/icons/pending-check-icon.svg" : "assets/icons/completed-check-icon.svg";
    checkbox.alt = isPending ? "Check desmarcado" : "Check marcado";
    checkbox.classList.add("task-card__check");

    const taskCardData = document.createElement("div");
    taskCardData.classList.add("task-card__data");

    const taskTitle = document.createElement("p");
    taskTitle.textContent = t.title;
    taskTitle.classList.add("task-card__title");

    const editIcon = document.createElement("img");
    editIcon.src = "assets/icons/edit-icon.svg";
    editIcon.alt = "Editar tarea";

    const taskDescription = document.createElement("p");
    taskDescription.textContent = t.description;
    taskDescription.classList.add("task-card__description");

    const taskSouthContainer = document.createElement("div");
    taskSouthContainer.classList.add("task-card__south-container");

    const taskSubject = document.createElement("span");
    taskSubject.classList.add("task-card__subject");
    taskSubject.textContent = t.subject.name;

    const taskDateInfo = document.createElement("span");
    taskDateInfo.classList.add("task-card__date-info");
    const dateIcon = document.createElement("img");
    dateIcon.src = "assets/icons/date-icon.svg";
    dateIcon.alt = "Fecha de la tarea";
    dateIcon.classList.add("task-card__date-icon")
    const taskDate = document.createElement("p")
    taskDate.classList.add("task-card__date");
    taskDate.textContent = t.dueDate;

    taskDateInfo.append(dateIcon);
    taskDateInfo.append(taskDate);

    taskSouthContainer.append(taskSubject);
    taskSouthContainer.append(taskDateInfo);

    taskCardData.append(taskTitle);
    taskCardData.append(editIcon);
    taskCardData.append(taskDescription);
    taskCardData.append(taskSouthContainer);

    taskContentBox.append(checkbox);
    taskContentBox.append(taskCardData);

    taskCard.append(taskColorBar);
    taskCard.append(taskContentBox);

    isPending ? pendingTasksContainer.append(taskCard) : completedTasksContainer.append(taskCard);

    updateTasksCount();
  });
}

// ACTUALIZAR CONTADORES DE TAREAS
function updateTasksCount() {
  const tasksSummary = document.querySelector(".tasks__summary");
  tasksSummary.textContent = `${pendingCount} pendientes • ${completedCount} completadas`;

  const pendingTasksSubtitle = document.getElementById("pending-tasks__title-txt");
  pendingTasksSubtitle.textContent = `PENDIENTES (${pendingCount})`;

  const completedTasksSubtitle = document.getElementById("completed-tasks__title-txt");
  completedTasksSubtitle.textContent = `COMPLETADAS (${completedCount})`;
}

// CREAR MENU DE MATERIAS
function createSubjectMenu() {
  const subjectsMenu = document.querySelector(".subjects-menu");

  // Boton para mostrar todas las tareas
  const showAllBtn = document.createElement("button");
  showAllBtn.textContent = "Todas";

  showAllBtn.addEventListener("click", () => {
    pendingTasksContainer.innerHTML = "";
    completedTasksContainer.innerHTML = ""
    createTaskCards(userTasks);
  });

  subjectsMenu.append(showAllBtn);

  // Crear botones para las materias
  userSubjects.forEach(s => {
    const subjectBtn = document.createElement("button");
    subjectBtn.id = s.id;
    subjectBtn.textContent = s.name;

    subjectBtn.addEventListener("click", () => {
      filterTasksBySubject(s.id);
    });

    subjectsMenu.append(subjectBtn);
  });
}

// FILTRAR TAREAS POR MATERIA
function filterTasksBySubject(subject) {
  const subjectTasks = userTasks.filter(t =>
    t.subject.id === subject
  );

  // Vaciar contenedores
  pendingTasksContainer.innerHTML = "";
  completedTasksContainer.innerHTML = ""
  createTaskCards(subjectTasks);
}

createSubjectMenu();
createTaskCards(userTasks);