// DOM Elements
const modalbg = document.getElementsByClassName("blur")[0];
const modalBtn = document.getElementsByClassName("btn-signup")[0];
const closeBtn = document.getElementsByClassName("modal__close")[0];


// launch modal event
modalBtn.addEventListener("click", launchModal);
closeBtn.addEventListener("click", closeModal);

// launch modal form
function launchModal() {
  modalbg.style.display = "block";
}
function closeModal() {
  modalbg.style.display = "none";
}