const TASKS_URL = new URL("../api/tasks.php", import.meta.url).href;
const SUBJECTS_URL = new URL("../data/subjects.json", import.meta.url).href;

export async function getTasks() {
  const res = await fetch(TASKS_URL);
  if (!res.ok) throw new Error(res.status);
  return await res.json();
}

export async function getSubjects() {
  const res = await fetch(SUBJECTS_URL);
  if (!res.ok) throw new Error(res.status);
  return await res.json();
}

export async function createTask(taskData) {
  const response = await fetch("../api/tasks.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(taskData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al guardar la tarea");
  }

  return data;
}

