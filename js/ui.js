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

let successTimeoutId = null;

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