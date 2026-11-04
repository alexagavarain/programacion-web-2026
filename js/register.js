// IMPORTS
import { validateRegister } from "./validators.js";
import { resetErrors, resetError, showError, showSuccessMessage } from "./ui.js";

const themeButton = document.querySelector("#theme-button");
const registerForm = document.querySelector("#register-form");

// LIGHT/DARK MODE
themeButton.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// REGISTER FORM
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  resetErrors(registerForm);

  const formData = Object.fromEntries(new FormData(registerForm));
  const errors = validateRegister(formData);

  if (Object.keys(errors).length > 0) {
    Object.entries(errors).forEach(([fieldName, message]) => {
      showError(registerForm, fieldName, message);
    });
    return;
  }

  console.log("Registro válido:", formData);
  registerForm.reset();
  showSuccessMessage();
});

registerForm.addEventListener("input", (e) => {
  if (e.target.name) {
    resetError(registerForm, e.target.name);
  }
});
