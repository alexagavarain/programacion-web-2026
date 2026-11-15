// STORAGE: saves and reads localStorage as JSON

export const STORAGE_KEYS = {
  theme: "unitasks_theme",
};

// SAVE
export function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value)); // localStorage only keeps text
    return true;
  } catch (error) {
    console.error(`No fue posible guardar "${key}"`, error);
    return false;
  }
}

// READ
export function read(key, fallback = null) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback; // a missing key gives null, so ?? returns the fallback
  } catch (error) {
    console.warn(`No fue posible leer "${key}"; se usará el valor por defecto.`, error); // damaged JSON doesn't break the page
    return fallback;
  }
}
