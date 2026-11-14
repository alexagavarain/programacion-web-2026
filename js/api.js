const TASKS_URL = new URL("../data/tas.json", import.meta.url).href;
const SUBJECTS_URL = new URL("../data/subjects.json", import.meta.url).href;

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

