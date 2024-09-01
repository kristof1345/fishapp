// import { supabase } from "./supa.js";

const dropdownBtn = document.getElementById("drop-toggle");
const dropdownBtn2 = document.getElementById("drop-toggle2");
const dropdownBtn3 = document.getElementById("drop-toggle3");
const dropdownDOM = document.getElementById("dropdown");
const dropdownDOM2 = document.getElementById("dropdown2");
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
    dropdownBtn.innerHTML = `<img src="./assets/exit.svg" alt="Exit hamburger menu">`;
  } else {
    dropdownDOM.classList.remove("show");
    dropdownBtn.innerHTML = `<img src="./assets/hamburger.svg" alt="Hamburger menu">`;
  }
}

function toggleDropdown2() {
  if (!dropdownDOM2.classList.contains("show")) {
    dropdownDOM2.classList.add("show");
    dropdownBtn2.innerHTML = `<img src="./assets/exit.svg" alt="Exit levels menu">`;
  } else {
    dropdownDOM2.classList.remove("show");
    dropdownBtn2.innerHTML = `<img src="./assets/levels.svg" alt="Levels menu">`;
  }
}

function toggleDropdown3() {
  if (dropdownDOM3.classList.contains("show")) {
    dropdownDOM3.classList.add("show");
    dropdownBtn3.innerHTML = `<img src="./assets/exit.svg" alt="Exit eye menu">`;
  } else {
    dropdownDOM3.classList.remove("show");
    dropdownBtn3.innerHTML = `<img src="./assets/eye.svg" alt="Eye icon">`;
  }
}

// function unToggleRest(unless) {
//   let drops = [...dropdowns].filter((drop) => drop != unless);
//   console.log(drops);

//   drops.map((drop) => {
//     if (drop.classList.contains("show")) {
//       drop.classList.remove("show");
//       console.log(drop.parentNode.children[0].children[0]);
//     }
//   });
// }

document.querySelector(".close").addEventListener("click", (e) => {
  popup.style.display = "none";
});
