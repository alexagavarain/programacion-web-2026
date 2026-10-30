const menuButton = document.querySelector("#menu-button");
const sidebarBody = document.querySelector(".sidebar__body");
const themeButton = document.querySelector("#theme-button");

// HAMBURGER MENU
menuButton.addEventListener("click", () => {
  sidebarBody.classList.toggle("sidebar__body--open");
});

// LIGHT/DARK MODE
themeButton.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
