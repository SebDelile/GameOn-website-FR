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
  email: "Veuillez entrer un email valide",
  date: "Veuillez entrer une date de naissance valide",
  numberContests: "Veuillez entrer un nombre entier compris entre 0 et 99",
  radio: "Vous devez sélectionner une ville",
  gcu: "Vous devez accepter les conditions générales d'utilisation",
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

// ------------------------------------ FORM VALIDATION FUNCTIONS ------------------------------------------


//add a span to receive the error message under each field
for (let field of formData) {
  field.insertAdjacentHTML("beforeEnd", "<span class='invalid-message'></span>");
}

//function to edit the message in the span of invalid fields and add/remove a visual indication to the field
function notifyError(field, message) {
  //edit the message, if message ="", then the span is not visible
  field.parentNode.getElementsByClassName("invalid-message")[0].textContent = message;
  //visual indication adding/removing
  switch (field.type) {
    case "text":
    case "date":
    case "email":
    case "number":
      if (message === "") {
        field.style.border = "none";
      } else {
        field.style.border = "2px solid red";
      }
      break;
    case "radio":
      let paragraph = field.parentNode.querySelector("p");
      if (message === "") {
        paragraph.style.textDecoration = "none";
      } else {
        paragraph.style.textDecoration = "underline wavy red";
      }
      break;
    case "checkbox": //only call for checkbox1 (=GCU)
      let label = field.parentNode.querySelector("label");
      if (message === "") {
        label.style.textDecoration = "none";
      } else {
        label.style.textDecoration = "underline wavy red";
      }
      break;
  }
}

// function to check the first and last name : at least 2 characters, not empty
function nameValidation(event) {
  if (event.target.validity.valueMissing) {
    //if no value, message to require a value
    notifyError(event.target, messageTable.required);
  } else {
    //there is a value, checking the lenght
    if (event.target.validity.tooShort) {
      //value is too short => message to require more than 2 characters
      notifyError(event.target, messageTable.name);
    } else {
      //value is ok, erase error message
      notifyError(event.target, "");
    }
  }
}

//function to check the validity of the email address
function emailValidation(event) {
  if (event.target.validity.valueMissing) {
    //if no value, message to require a value
    notifyError(event.target, messageTable.required);
  } else {
    //there is a value, checking the type
    if (event.target.validity.typeMismatch) {
      //value is not an email => message to require a valid email
      notifyError(event.target, messageTable.email);
    } else {
      //value is ok, erase error message
      notifyError(event.target, "");
    }
  }
}

//function to check the validity of the birthdate
function dateValidation(event) {
  if (event.target.value === "") {
    //valueMissing ne se déclenche pas à cause du placeholder
    //if no value, message to require a value
    notifyError(event.target, messageTable.required);
  } else {
    //there is a value, checking if this is a valid date
    if (!event.target.validity.valid) {
      //value is not a valid date => message to require a valid date
      notifyError(event.target, messageTable.date);
    } else {
      //value is ok, erase error message
      notifyError(event.target, "");
    }
  }
}

//function to check the validity of the email address
function contestNumberValidation(event) {
  if (event.target.validity.valueMissing) {
    //if no value, message to require a value
    notifyError(event.target, messageTable.required);
  } else {
    //there is a value, checking the type and the range
    if (event.target.validity.typeMismatch || event.target.value < 0 || event.target.value > 99) {
      //value is not a number or not in the range 0 ~ 99 => message to require a between 0 and 99
      notifyError(event.target, messageTable.numberContests);
    } else {
      //value is ok, erase error message
      notifyError(event.target, "");
      //round the number to the floor in case it's not an integer
      event.target.value = Math.floor(event.target.value);
    }
  }
}

//function to check if a radio is selected
function locationSelected(event) {
  if (event.target.validity.valueMissing || event.target.value === "") {
    //if no value, message to require a value
    notifyError(event.target, messageTable.radio);
  } else {
    //there is a value, erase error message
    notifyError(event.target, "");
  }
}

//function to check if the gcu checkbox is selected
function gcuAccepted(event) {
  if (event.target.validity.valueMissing) {
    //if no value, message to require a value
    notifyError(event.target, messageTable.gcu);
  } else {
    //there is a value, erase error message
    notifyError(event.target, "");
  }
}

//------------------------FORM VERIFICATION EVENTS-------------------------------------------------------------

//realtime validation of input fields (except radio and checkbox)
//each is launched after first blue
form.first.addEventListener("blur", function (event) {
  nameValidation(event);
  form.first.addEventListener("input", nameValidation);
});

form.last.addEventListener("blur", function (event) {
  nameValidation(event);
  form.last.addEventListener("input", nameValidation);
});

form.email.addEventListener("blur", function (event) {
  emailValidation(event);
  form.email.addEventListener("input", emailValidation);
});

form.birthdate.addEventListener("blur", function (event) {
  dateValidation(event);
  form.birthdate.addEventListener("input", dateValidation);
});

form.quantity.addEventListener("blur", function (event) {
  contestNumberValidation(event);
  form.quantity.addEventListener("input", contestNumberValidation);
});

// form verification on submission
// Is automattically called on submit event
form.addEventListener(
  "invalid",
  function (event) {
    // Disable the default error message on invalid fields in the form (replaced by custom message)
    event.preventDefault();
    //launch suitable function for each of invalid field
    switch (event.target) {
      case form.first:
      case form.last:
        nameValidation(event);
        break;
      case form.email:
        emailValidation(event);
        break;
      case form.birthdate:
        dateValidation(event);
        break;
      case form.quantity:
        contestNumberValidation(event);
        break;
      case form.location[0]: //need to catch any of the radio input, but not all of them as a list 
        locationSelected(event);
        break;
      case form.gcu:
        gcuAccepted(event);
        break;
    }
    //After first submission, add event listener to radio and checkbox fields
    for (let i = 0; i < form.location.length; i++) {
      form.location[i].addEventListener("change", locationSelected);
    }
    form.gcu.addEventListener("change", gcuAccepted);
  },
  true
);

//Action on submission of the form
//Do not occur if at least one field is invalid
form.addEventListener("submit", function (event) {
  event.preventDefault();
  console.log("submission ok");

});
