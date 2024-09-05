// import { supabase } from "./supa.js";

const dropdownBtn = document.getElementById("drop-toggle");
const dropdownBtn3 = document.getElementById("drop-toggle3");
const dropdownDOM = document.getElementById("dropdown");
const dropdownDOM3 = document.getElementById("dropdown3");

const dropdowns = document.getElementsByClassName("dropdown");
const dropdownToggles = document.getElementsByClassName("drop-toggle");

const popup = document.getElementById("popup");

const settings = document.getElementById("elem-settings");

function toggleSettings() {
  settings.classList.toggle("opensett");
}

function toggleDropdown() {
  if (!dropdownDOM.classList.contains("show")) {
    dropdownDOM.classList.add("show");
    dropdownBtn.innerHTML = `<img src="../assets/exit.svg" alt="Exit hamburger menu">`;
  } else {
    dropdownDOM.classList.remove("show");
    dropdownBtn.innerHTML = `<img src="../assets/hamburger.svg" alt="Hamburger menu">`;
  }
}

function toggleDropdown3() {
  if (!dropdownDOM3.classList.contains("show")) {
    dropdownDOM3.classList.add("show");
    dropdownBtn3.innerHTML = `<img src="../assets/exit.svg" alt="Exit eye menu">`;
  } else {
    dropdownDOM3.classList.remove("show");
    dropdownBtn3.innerHTML = `<img src="../assets/eye.svg" alt="Eye icon">`;
  }
}

document.querySelector(".close").addEventListener("click", (e) => {
  popup.style.display = "none";
});
