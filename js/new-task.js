const themeButton = document.querySelector("#theme-button");

// LIGHT/DARK MODE
themeButton.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
