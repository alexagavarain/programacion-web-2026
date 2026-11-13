const pendingTasksContainer = document.getElementById("pending-tasks__list");
const completedTasksContainer = document.getElementById("completed-tasks__list");
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

export function updateTasksCount(pendingCount, completedCount) {
  const tasksSummary = document.querySelector(".tasks__summary");
  tasksSummary.textContent = `${pendingCount} pendientes • ${completedCount} completadas`;

  const pendingTasksSubtitle = document.getElementById("pending-tasks__title-txt");
  pendingTasksSubtitle.textContent = `PENDIENTES (${pendingCount})`;

  const completedTasksSubtitle = document.getElementById("completed-tasks__title-txt");
  completedTasksSubtitle.textContent = `COMPLETADAS (${completedCount})`;
}

export function createTaskCards(tasks) {
  tasks?.forEach(t => {
    let isPending;

    t.status === "pending" ? isPending = true : isPending = false;

    const taskCard = document.createElement("div");
    taskCard.classList.add("task-card");

    const taskColorBar = document.createElement("div");
    taskColorBar.classList.add("task-card__color");
    taskColorBar.style.backgroundColor = t.subject?.color || "#9ca3af";

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

    isPending ? pendingTasksContainer.append(taskCard) : completedTasksContainer.append(taskCard);
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
    const subjectBtn = document.createElement("button");
    subjectBtn.style.setProperty("--subject-color", s.color);
    subjectBtn.dataset.id = s.id;
    subjectBtn.textContent = s.name;

    subjectsMenu.append(subjectBtn);
  });
}

export function emptyTasksContainers() {
  pendingTasksContainer.innerHTML = "";
  completedTasksContainer.innerHTML = "";
}