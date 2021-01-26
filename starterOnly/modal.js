// --------------------------------- DOM ELEMENTS --------------------------------------------------
const modalbg = document.querySelector(".bground");
const modalBtn = document.querySelectorAll(".modal-btn");
const formData = document.querySelectorAll(".formData");
const closeBtn = document.getElementsByClassName("close")[0];
const form = document.getElementsByTagName("form")[0];
const submiConfirm = document.getElementsByClassName("modal-submitted")[0];
const submiCloseBtn = document.querySelector(".modal-submitted input");

// --------------------------------- VARIABLES --------------------------------------------------

//table used to display the error messages
const messageTable = {
  required: "Ce champ doit être renseigné",
  name: "Veuillez entrer un minimum de deux caractères",
  noSpecial: "Veuillez ne pas utiliser de caractères spéciaux ou numériques",
  email: "Veuillez entrer un email valide",
  date: "Veuillez entrer une date de naissance valide",
  numberContests: "Veuillez entrer un nombre entier compris entre 0 et 99",
  radio: "Vous devez sélectionner une ville",
  gcu: "Vous devez accepter les conditions générales d'utilisation",
};

//birthdate range building
//current oldest people is born in 1903 (https://en.wikipedia.org/wiki/Oldest_people checked on 2021/01/25)
form.birthdate.setAttribute("min", "1903-01-01");
//today is set as upper limit, but if the GCU require a minimum age for participation, the limit should be modified accordingly
let today = new Date();
let dd = today.getDate();
let mm = today.getMonth() + 1; //January is 0!
let yyyy = today.getFullYear();
if (dd < 10) {
  dd = "0" + dd;
}
if (mm < 10) {
  mm = "0" + mm;
}
today = yyyy + "-" + mm + "-" + dd;
form.birthdate.setAttribute("max", today);

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
  form.reset();
  //remove all event listener on field (they'll be re-add on new registration)
  form.first.removeEventListener("input", nameValidation);
  form.last.removeEventListener("input", nameValidation);
  form.email.removeEventListener("input", emailValidation);
  form.birthdate.removeEventListener("input", dateValidation);
  form.quantity.removeEventListener("input", contestNumberValidation);
  for (let i = 0; i < form.location.length; i++) {
    form.location[i].removeEventListener("change", locationSelected);
  }
  form.gcu.removeEventListener("change", gcuAccepted);
  //clean all the validation messages and visual indicator
  notifyError(form.first, "");
  notifyError(form.last, "");
  notifyError(form.email, "");
  notifyError(form.birthdate, "");
  notifyError(form.quantity, "");
  notifyError(form.location[0], ""); //need to target one of the radio, not the group
  notifyError(form.gcu, "");
}

// launch modal event
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));

//close modal event
closeBtn.addEventListener("click", closeModal);
submiCloseBtn.addEventListener("click", closeModal);

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
  // case of input field : none or red border
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
    //case of city selection : none or red underline
    case "radio":
      let paragraph = field.parentNode.querySelector("p");
      if (message === "") {
        paragraph.style.textDecoration = "none";
      } else {
        paragraph.style.textDecoration = "underline wavy red";
      }
      break;
    //case of GCU checkbox : none or red underline
    //only call for checkbox1 (=GCU)
    case "checkbox":
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
  //first : HTML5 verifications : value is not "" and more than 2 characters
  if (event.target.validity.valueMissing) {
    notifyError(event.target, messageTable.required);
  } else {
    if (event.target.validity.tooShort) {
      notifyError(event.target, messageTable.name);
    } else {
      //value is ok for HTML5, now more advanced JS verification to avoid special characters and numbers
      let = regex = /^[^@&"()\[\]\{\}<>_$*%§¤€£`+=\/\\|~'"°;:!,\.?#0-9]+$/;
      if (!regex.test(event.target.value)) {
        notifyError(event.target, messageTable.noSpecial);
      } else {
        notifyError(event.target, "");
      }
    }
  }
}

//function to check the validity of the email address
function emailValidation(event) {
  //first : HTML5 verifications : value is not "" and fits a@a
  if (event.target.validity.valueMissing) {
    notifyError(event.target, messageTable.required);
  } else {
    if (event.target.validity.typeMismatch) {
      notifyError(event.target, messageTable.email);
    } else {
      //value is ok for HTML5, now more advanced JS verification to avoid non-whitespace characters and with a domain pattern like "a.a"
      let = regex = /^\S+@\S+\.\S+$/;
      if (!regex.test(event.target.value)) {
        notifyError(event.target, messageTable.email);
      } else {
        notifyError(event.target, "");
      }
    }
  }
}

//function to check the validity of the birthdate
function dateValidation(event) {
  //fully checked with HTML5 verifications : value is not "", is a date and is between lower and upper limits defined in the variable section (see above)
  if (event.target.value === "") {
    notifyError(event.target, messageTable.required);
  } else {
    if (!event.target.validity.valid) {
      notifyError(event.target, messageTable.date);
    } else {
      notifyError(event.target, "");
    }
  }
}

//function to check the validity of number of attented contests
//note : an eventlistener is set to block the input of "," or "." in this field (see section form verification event)
function contestNumberValidation(event) {
  //fully checked with HTML5 verification : value is not "" and is a positive number or 0
  if (event.target.validity.valueMissing) {
    notifyError(event.target, messageTable.required);
  } else {
    if (event.target.validity.typeMismatch || event.target.value < 0) {
      notifyError(event.target, messageTable.numberContests);
    } else {
      notifyError(event.target, "");
      //round the number to the floor in case it's not an integer
      event.target.value = Math.floor(event.target.value);
    }
  }
}

//function to check if a radio is selected
function locationSelected(event) {
  if (event.target.validity.valueMissing) {
    notifyError(event.target, messageTable.radio);
  } else {
    notifyError(event.target, "");
  }
}

//function to check if the gcu checkbox is selected
function gcuAccepted(event) {
  if (event.target.validity.valueMissing) {
    notifyError(event.target, messageTable.gcu);
  } else {
    notifyError(event.target, "");
  }
}

//------------------------FORM VERIFICATION EVENTS-------------------------------------------------------------

//the field number of contest should be a positive integer, remove "." "," or "-" if tipped
form.quantity.addEventListener("keydown", function (event) {
  //condition to catch "." "," and "-" characters
  if (event.key == "," || event.key == "." || event.key == "-") {
    event.preventDefault();
  }
});

//realtime validation of input fields (except radio and checkbox)
//each is launched after first blur
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

    //give the focus to the fisrt field with an error message
    //to avoid several successive focus, tests first which field has focus
    for (let field of formData) {
      if (field.querySelector(".invalid-message").textContent != "") {
        if (field.querySelector("input") != document.activeElement) {
          field.querySelector("input").focus();
        }
        break;
      }
    }
  },
  true
);

//Action on submission of the form : perform JS verification, and if ok do submission
//Do not occur if at least one field is invalid according to HTML5 verification
form.addEventListener("submit", function (event) {
  event.preventDefault();
  let validity = true; // to turn false for any error
  for (let field of formData) {
    //a non-empty message means there is an error, the focus is given to this field and the function finish here
    if (field.querySelector(".invalid-message").textContent != "") {
      validity = false;
      field.querySelector("input").focus();
      break;
    }
  }

  // if true then no error detected => submission ok (confirmation message revealed)
  if (validity) {
    submiConfirm.style.display = "flex";
  }
});
