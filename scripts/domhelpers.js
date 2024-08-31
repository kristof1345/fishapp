// import { supabase } from "./supa.js";

const dropdownBtn = document.getElementById("drop-toggle");
const dropdownBtn2 = document.getElementById("drop-toggle2");
const dropdownDOM = document.getElementById("dropdown");
const dropdownDOM2 = document.getElementById("dropdown2");

const popup = document.getElementById("popup");

const settings = document.getElementById("elem-settings");

function toggleSettings() {
  settings.classList.toggle("opensett");
}

function toggleDropdown() {
  dropdownDOM.classList.toggle("show");

  if (dropdownDOM.classList.contains("show")) {
    dropdownBtn.innerHTML = `<img src="./assets/exit.svg" alt="Exit menu">`;
  } else {
    dropdownBtn.innerHTML = `<img src="./assets/hamburger.svg" alt="Hamburger menu">`;
  }

  if (dropdownDOM2.classList.contains("show")) {
    dropdownDOM2.classList.remove("show");
    dropdownBtn2.innerHTML = `<img src="./assets/progressiveburger.svg" alt="Hamburger menu">`;
  }
}

function toggleDropdown2() {
  dropdownDOM2.classList.toggle("show");

  if (dropdownDOM2.classList.contains("show")) {
    dropdownBtn2.innerHTML = `<img src="./assets/exit.svg" alt="Exit menu">`;
  } else {
    dropdownBtn2.innerHTML = `<img src="./assets/progressiveburger.svg" alt="Hamburger menu">`;
  }

  if (dropdownDOM.classList.contains("show")) {
    dropdownDOM.classList.remove("show");
    dropdownBtn.innerHTML = `<img src="./assets/hamburger.svg" alt="Hamburger menu">`;
  }
}

document.querySelector(".close").addEventListener("click", (e) => {
  popup.style.display = "none";
});
