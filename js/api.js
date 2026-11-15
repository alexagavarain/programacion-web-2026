const TASKS_URL = new URL("../data/tasks.json", import.meta.url).href;
const SUBJECTS_URL = new URL("../data/subjects.json", import.meta.url).href;

// No try/catch: errors go up to init()
export async function getTasks() {
  const res = await fetch(TASKS_URL);
  if (!res.ok) throw new Error(res.status); // fetch doesn't reject on 404 or 500
  return await res.json();
}

export async function getSubjects() {
  const res = await fetch(SUBJECTS_URL);
  if (!res.ok) throw new Error(res.status);
  return await res.json();
}

