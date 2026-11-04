export const isEmpty = (value) => !value || value.trim().length === 0;

export const hasMinLength = (value, min) => {
  return value.trim().length >= min;
}

export const isNameValid = (name) => {
  return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+(\s[a-zA-ZáéíóúÁÉÍÓÚñÑ]+)*$/.test(name);
};

export const isEmailValid = (email) => { return /^[a-zA-Z0-9._%+-]+@alu\.uabcs\.mx$/.test(email); }

export function validateRegister({ name, "last-name": lastName, email, password }) {
  const errors = {};

  if (isEmpty(name)) errors.name = "Ingresa tu(s) nombre(s)";
  else if (!hasMinLength(name, 3)) errors.name = "El nombre debe contener mínimo 3 letras";
  else if (!isNameValid(name)) errors.name = "Este campo no acepta caracteres numéricos ni especiales";

  if (isEmpty(lastName)) errors["last-name"] = "Ingresa tu(s) apellido(s)"
  else if (!hasMinLength(lastName, 3)) errors["last-name"] = "Tu apellido debe contener mínimo 3 letras";
  else if (!isNameValid(lastName)) errors["last-name"] = "Este campo no acepta caracteres numéricos ni especiales"

  if (isEmpty(email)) errors.email = "Ingresa tu correo institucional";
  else if (!isEmailValid(email)) errors.email = "El correo institucional no es válido";

  if (isEmpty(password)) errors.password = "Ingresa tu nueva contraseña"
  else if (!hasMinLength(password, 8)) errors.password = "La contraseña debe tener al menos 8 caracteres";

  return errors;
}

export function validateNewTask({ title, due_date, due_time }) {
  const errors = {};

  if (isEmpty(title)) errors.title = "Ingresa el título de la tarea"
  if (isEmpty(due_date)) errors.due_date = "Elige una fecha de entrega";
  if (isEmpty(due_time)) errors.due_time = "Elige una hora de entrega";
  return errors;
}
