const themeButton = document.querySelector("#theme-button");
const registerForm = document.querySelector("#register-form");

// LIGHT/DARK MODE
themeButton.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// VALIDATORS
const hasMinLength = (value, min) => value.trim().length >= min;
const isEmailValid = (value) => /^\S+@\S+\.\S+$/.test(value); // something@something.something

function validateRegister({ full_name, email, password }) {
  const errors = {}; // {} means everything is valid
  if (!hasMinLength(full_name, 3)) errors.full_name = "Escribe tu nombre (mínimo 3 letras)";
  if (!isEmailValid(email)) errors.email = "Correo inválido";
  if (!hasMinLength(password, 8)) errors.password = "La contraseña debe tener al menos 8 caracteres";
  return errors;
}

// REGISTER FORM
registerForm.addEventListener("submit", (e) => {
  e.preventDefault(); // stops the page reload
  const data = Object.fromEntries(new FormData(registerForm));
  const errors = validateRegister(data);

  if (Object.keys(errors).length > 0) {
    console.log("Errores:", errors); // for now errors only go to the console
    return;
  }
  console.log("Registro válido:", data);
});
