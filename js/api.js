const TASKS_URL = "../data/tasks.json"
const SUBJECTS_URL = "../data/subjects.json"

export async function getTasks() {
  try {
    const res = await fetch(TASKS_URL);
    if (!res.ok) throw new Error(res.status);
    return await res.json();
  } catch (err) {
    console.error(err.message);
    return [];
  }
}

export async function getSubjects() {
  try {
    const res = await fetch(SUBJECTS_URL);
    if (!res.ok) throw new Error(res.status);
    return await res.json();
  } catch (err) {
    console.error(err.message);
    return [];
  }
}

