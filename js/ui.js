import Swal from "../node_modules/sweetalert2/dist/sweetalert2.esm.all.js"; // the browser needs the real path, not the package name

const tasksPageContainer = document.querySelector(".tasks__content");

let pendingTasksSubtitle = null;
let completedTasksSubtitle = null;
let pendingTasksContainer = null;
let completedTasksContainer = null;

// CREAR SECCIONES DE TAREAS 
function createTaskSection({ sectionId, titleContainerClass, dotSrc, dotAlt, titleId, listId }) {
  const section = document.createElement("section");
  section.id = sectionId;

  const titleWrapper = document.createElement("div");
  titleWrapper.classList.add(titleContainerClass);

  const dot = document.createElement("img");
  dot.classList.add("tasks__status-dot");
  dot.src = dotSrc;
  dot.alt = dotAlt;
  dot.width = 7;
  dot.height = 7;

  const title = document.createElement("h2");
  title.id = titleId;
  title.classList.add("tasks__status-title");

  titleWrapper.append(dot, title);

  const list = document.createElement("div");
  list.id = listId;
  list.classList.add("tasks__list");

  section.append(titleWrapper, list);

  return { section, title, list };
}

export function createTasksLayout() {
  tasksPageContainer.innerHTML = "";

  const pending = createTaskSection({
    sectionId: "pending-tasks",
    titleContainerClass: "pending-tasks__title",
    dotSrc: "assets/icons/pending-tasks-dot.svg",
    dotAlt: "Ícono tareas pendientes",
    titleId: "pending-tasks__title-txt",
    listId: "pending-tasks__list",
  });

  const completed = createTaskSection({
    sectionId: "completed-tasks",
    titleContainerClass: "completed-tasks__title",
    dotSrc: "assets/icons/completed-tasks-dot.svg",
    dotAlt: "Ícono tareas completadas",
    titleId: "completed-tasks__title-txt",
    listId: "completed-tasks__list",
  });

  pendingTasksSubtitle = pending.title;
  pendingTasksContainer = pending.list;

  completedTasksSubtitle = completed.title;
  completedTasksContainer = completed.list;

  tasksPageContainer.append(pending.section, completed.section);
}

export function updateTasksCount(pendingCount, completedCount) {
  const tasksSummary = document.querySelector(".tasks__summary");
  tasksSummary.textContent = `${pendingCount} pendientes • ${completedCount} completadas`;

  if (pendingTasksSubtitle) {
    pendingTasksSubtitle.textContent = `PENDIENTES (${pendingCount})`;
  }

  if (completedTasksSubtitle) {
    completedTasksSubtitle.textContent = `COMPLETADAS (${completedCount})`;
  }
}

export function emptyTasksContainers() {
  if (pendingTasksContainer) pendingTasksContainer.innerHTML = "";
  if (completedTasksContainer) completedTasksContainer.innerHTML = "";
}

export function createEmptyTasksMessage() {
  tasksPageContainer.innerHTML = ""
  emptyTasksContainers();
  const container = document.createElement("div");
  container.classList.add("no-tasks-container");

  const msg = document.createElement("p");
  msg.textContent = "No tienes tareas";
  msg.classList.add("load-msg");

  container.append(msg);
  tasksPageContainer.append(container);
}

export function createLoadMessage(content) {
  const msg = document.createElement("p");
  msg.classList.add("load-msg");
  msg.textContent = content;
  return msg;
}

export function createTaskCards(tasks) {
  tasks?.forEach(t => {
    let isPending;

    t.status === "PENDIENTE" ? isPending = true : isPending = false;

    const taskCard = document.createElement("div");
    taskCard.classList.add("task-card");

    const taskColorBar = document.createElement("div");
    taskColorBar.classList.add("task-card__color");
    taskColorBar.style.backgroundColor = t.subject?.color || "#9ca3af";

    const taskContentBox = document.createElement("div");
    taskContentBox.classList.add("task-card__content");

    const checkbox = document.createElement("img");
    checkbox.dataset.status = isPending ? "pending" : "completed";
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
    taskSubject.style.setProperty("--subject-color", t.subject?.color);
    taskSubject.textContent = t.subject?.name || "Sin materia";

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

    isPending ? pendingTasksContainer?.append(taskCard) : completedTasksContainer?.append(taskCard);
  });
}

export function createSubjectMenu(subjects) {
  const subjectsMenu = document.querySelector(".subjects-menu");

  // Boton para mostrar todas las tareas
  const showAllBtn = document.createElement("button");
  showAllBtn.dataset.id = "all";
  showAllBtn.textContent = "Todas";
  subjectsMenu.append(showAllBtn);

  // Crear botones para las materias
  subjects.forEach(s => {
    if (s.id === 0) return; // Saltar opcion "Selecciona una materia"

    const subjectBtn = document.createElement("button");
    subjectBtn.style.setProperty("--subject-color", s.color);
    subjectBtn.dataset.id = s.id;
    subjectBtn.textContent = s.name;

    subjectsMenu.append(subjectBtn);
  });
}

export function createSelectSubjectMenu(subjects) {
  const select = document.getElementById("subject-id");
  subjects.forEach(s => {
    const option = document.createElement("option");
    option.value = s.id;
    option.textContent = s.name;

    select.appendChild(option);
  });
}

const STATUS_CONFIG = {
  pending: {
    src: "assets/icons/pending-check-icon.svg",
    alt: "Check desmarcado",
  },
  completed: {
    src: "assets/icons/completed-check-icon.svg",
    alt: "Check marcado",
  },
};

export function changeCheckStatus(currentStatus, checkbox) {
  const newStatus = currentStatus === "pending" ? "completed" : "pending";
  const { src, alt } = STATUS_CONFIG[newStatus];

  checkbox.dataset.status = newStatus;
  checkbox.src = src;
  checkbox.alt = alt;

  return newStatus;
}

// THEME
export function applyTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");

  const themeButton = document.querySelector("#theme-button");
  if (themeButton) themeButton.setAttribute("aria-pressed", String(theme === "dark")); // tells screen readers if dark mode is on
}

// FORM UI FUNCTIONS
let successTimeoutId = null;

export function showError(form, fieldName, message) {
  const span = form.querySelector(`[data-error-para="${fieldName}"]`);
  if (span) span.textContent = message;

  const field = form.elements[fieldName];
  if (field) field.classList.add("invalid");
}

export function resetErrors(form) {
  form.querySelectorAll("[data-error-para]").forEach((span) => (span.textContent = ""));
  form.querySelectorAll(".invalid").forEach((field) => field.classList.remove("invalid"));
}

export function resetError(form, fieldName) {
  const span = form.querySelector(`[data-error-para="${fieldName}"]`);
  if (span) span.textContent = "";

  const field = form.elements[fieldName];
  if (field) field.classList.remove("invalid");
}

export function showSuccessMessage() {
  const successMsg = document.querySelector("#success-message");
  if (!successMsg) return;

  if (successTimeoutId) {
    clearTimeout(successTimeoutId);
  }
  successMsg.classList.remove("hidden");

  successTimeoutId = setTimeout(() => {
    hideSuccessMessage();
  }, 5000);
}

export function hideSuccessMessage() {
  const successMsg = document.querySelector("#success-message");
  if (successMsg) {
    successMsg.classList.add("hidden");
  }
}

// ALERTS (SWEETALERT2)
export function showRegisterAlert(name) {
  return Swal.fire({
    icon: "success",
    title: "¡Registro exitoso!",
    text: `Te damos la bienvenida, ${name}. Tu cuenta ha sido registrada.`, // name in text, not title (avoids XSS)
  });
}
