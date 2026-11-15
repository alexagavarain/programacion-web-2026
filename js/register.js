// IMPORTS
import { validateRegister } from "./validators.js";
import { resetErrors, resetError, showError, applyTheme, showRegisterAlert } from "./ui.js";
import { save, read, STORAGE_KEYS } from "./storage.js";

const themeButton = document.querySelector("#theme-button");
const registerForm = document.querySelector("#register-form");

// LIGHT/DARK MODE
let theme = read(STORAGE_KEYS.theme, "light"); // the first visit uses light
if (theme !== "light" && theme !== "dark") theme = "light"; // ignores an unexpected saved value
applyTheme(theme);

themeButton.addEventListener("click", () => {
  theme = theme === "light" ? "dark" : "light";
  applyTheme(theme);
  save(STORAGE_KEYS.theme, theme);
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
  showRegisterAlert(formData.name.trim()); // ui.js decides how it looks
});

registerForm.addEventListener("input", (e) => {
  if (e.target.name) {
    resetError(registerForm, e.target.name);
  }
});
