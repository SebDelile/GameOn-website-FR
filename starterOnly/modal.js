// --------------------------------- DOM ELEMENTS --------------------------------------------------
const modalbg = document.querySelector(".bground");
const modalBtn = document.querySelectorAll(".modal-btn");
const formData = document.querySelectorAll(".formData");
const closeBtn = document.getElementsByClassName("close")[0];
const form = document.getElementsByTagName("form")[0];

// --------------------------------- VARIABLES --------------------------------------------------
const messageTable = {
  required: "Ce champ doit être renseigné",
  name: "Veuillez entrer un minimum de deux caractères",
  email : "Veuillez entrer un email valide",
  date : "Veuillez entrer une date de naissance valide",
  numberContests : "Veuillez entrer un nombre entier compris entre 0 et 99"
};

// ------------------------------- MENU OPENING MOBILE MODE ----------------------------------------------

// function to open menu in mobile mode, replace with CSS ??
function editNav() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

// ------------------------------- OPEN AND CLOSE THE MODAL ---------------------------------------------------

// launch modal form
function launchModal() {
  modalbg.style.display = "block";
}

// close modal form
function closeModal() {
  modalbg.style.display = "none";
}
// launch modal event
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));

//close modal event
closeBtn.addEventListener("click", closeModal);

// ------------------------------------ FORM VALIDATION ------------------------------------------

// Disable the default error message on invalid fields in the form (replaced by custom message)
form.addEventListener(
  "invalid",
  function (e) {
    e.preventDefault();
    console.error("DEV : au moins une erreur dans le formulaire");
  },
  true
);

//add a span to receive the error message under each field
for (let field of formData) {
  field.insertAdjacentHTML("beforeEnd", "<span class='invalid-message'></span>");
}

//function to edit the message in the span of invalid fields
function invalidMessage(field, message) {
  field.parentNode.getElementsByClassName("invalid-message")[0].textContent = message;
}

// function to check the first and last name : at least 2 characters, not empty
function nameValidation(event) {
  if (event.target.validity.valueMissing) {
    //if no value, message to require a value
    invalidMessage(event.target, messageTable.required);
  } else {
    //there is a value, checking the lenght
    if (event.target.validity.tooShort) {
      //value is too short => message to require more than 2 characters
      invalidMessage(event.target, messageTable.name);
    } else {
      //value is ok, erase error message
      invalidMessage(event.target, "");
    }
  }
}

//function to check the validity of the email address
function emailValidation(event) {
  if (event.target.validity.valueMissing) {
    //if no value, message to require a value
    invalidMessage(event.target, messageTable.required);
  } else {
    //there is a value, checking the type
    if (event.target.validity.typeMismatch) {
      //value is not an email => message to require a valid email
      invalidMessage(event.target, messageTable.email);
    } else {
      //value is ok, erase error message
      invalidMessage(event.target, "");
    }
  }
}

//function to check the validity of the birthdate
function dateValidation(event) {
  if (event.target.validity.valueMissing) {
    //if no value, message to require a value
    invalidMessage(event.target, messageTable.required);
  } else {
    //there is a value, checking if this is a date
    if (!event.target.validity.valid) {
      //value is not a date => message to require a valid date
      invalidMessage(event.target, messageTable.date);
    } else {
      //value is ok, erase error message
      invalidMessage(event.target, "");
    }
  }
}

//function to check the validity of the email address
function contestNumberValidation(event) {
  if (event.target.validity.valueMissing) {
    //if no value, message to require a value
    invalidMessage(event.target, messageTable.required);
  } else {
    //there is a value, checking the type and the range
;    if (event.target.validity.typeMismatch || event.target.value < 0 || event.target.value > 99) {
      //value is not a number or not in the range 0 ~ 99 => message to require a between 0 and 99
      invalidMessage(event.target, messageTable.numberContests);
    } else {
      //value is ok, erase error message
      invalidMessage(event.target, "");
      //round the number to the floor in case it's not an integer
      event.target.value = Math.floor(event.target.value);
    }
  }
}


//realtime validation of input fields (except radio and checkbox)
form.first.addEventListener("input", nameValidation);
form.last.addEventListener("input", nameValidation);
form.email.addEventListener("input", emailValidation);
form.birthdate.addEventListener("input", dateValidation);
form.quantity.addEventListener("input", contestNumberValidation);




// form verification on submission
form.addEventListener("submit", function (event) {
  //submission is stoped for verifaction
  event.preventDefault();

  //all field are valid => submit the form
  if (form.checkValidity) {
  }
  //there is at least one error => stop submission
  else {
  }
});
