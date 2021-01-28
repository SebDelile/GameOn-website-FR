// --------------------------------- DOM ELEMENTS --------------------------------------------------
const modalbg = document.querySelector(".bground");
const modalBtn = document.querySelectorAll(".modal-btn");
const formData = document.querySelectorAll(".formData");
const closeBtn = document.querySelector(".close");
const form = document.querySelector("form");
const submiConfirm = document.querySelector(".modal-submitted");
const submiCloseBtn = document.querySelector(".modal-submitted input");

// --------------------------------- VARIABLES --------------------------------------------------

//table used to display the error messages
const messageTable = {
  required: "Ce champ doit être renseigné",
  name: "Veuillez entrer un minimum de deux caractères",
  noSpecial: "Veuillez ne pas utiliser de caractères spéciaux ou numériques",
  email: "Veuillez entrer un email valide",
  date: "Veuillez entrer une date de naissance valide",
  numberContests: "Veuillez entrer un nombre entier positif ou nul",
  radio: "Vous devez sélectionner une ville",
  gcu: "Vous devez accepter les conditions d'utilisation",
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

// launch modal form, add the animation properties and then delete them to allow reverse animation to occur on close
function launchModal() {
  modalbg.querySelector(".content").classList.add("modal-appear");
  modalbg.style.display = "block";
  setTimeout(function () {
    modalbg.querySelector(".content").classList.remove("modal-appear");
  }, 800);
}

// close modal form, add the animation properties and then delete them to allow reverse animation to occur on open
function closeModal() {
  modalbg.querySelector(".content").classList.add("modal-disappear");
  setTimeout(function () {
    modalbg.querySelector(".content").classList.remove("modal-disappear");
  }, 800);
  setTimeout(function () {
    modalbg.style.display = "none";
  }, 800); // let the animation goes on before vanish
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

// ------------------------------------ FORM ERROR NOTIFICATION ------------------------------------------

//add a span to receive the error message under each field
for (let field of formData) {
  field.insertAdjacentHTML("beforeEnd", "<span class='invalid-message'></span>");
}

//function to edit the message in the span of invalid fields and add/remove a visual indication to the field
function notifyError(field, message) {
  //edit the message, if message ="", then the span is not visible
  field.parentNode.querySelector(".invalid-message").textContent = message;
  //visual indication adding/removing
  //case of input field : none or red border
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
    //case of city selection or checkbox1 (=GCU) : none or red underline on P/label
    case "radio":
    case "checkbox":
      let text;
      if (field.type === "radio") {
        text = field.parentNode.querySelector("p");
      }
      if (field.type === "checkbox") {
        text = field.parentNode.querySelector("label");
      }
      if (message === "") {
        text.style.textDecoration = "none";
      } else {
        text.style.textDecoration = "underline wavy red";
      }
      break;
  }
}

// ------------------------------------ FORM VALIDATION FUNCTIONS ------------------------------------------

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
      let = regex = /^[^@&"()\[\]\{\}<>_$*%§¤€£`+=\/\\|~'"°;:!,?#0-9]+$/;
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
  //first : HTML5 verifications : value is not "" and fits x@x
  if (event.target.validity.valueMissing) {
    notifyError(event.target, messageTable.required);
  } else {
    if (event.target.validity.typeMismatch) {
      notifyError(event.target, messageTable.email);
    } else {
      //value is ok for HTML5, now more advanced JS verification to avoid non-whitespace characters and with a pattern like "x@x.x"
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
  console.log(event.target.value);
  if (event.target.validity.valueMissing) {
    // note: in case of an impossible date (like 31-02-2000), the value is also set as "" by browser
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
//note : an eventlistener is set to block the input of "," "." or "-" in this field (see section form verification event)
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
    //After first submission, add event listener to radio and checkbox fields (and other fields in case they had no blur until now)
    for (let i = 0; i < form.location.length; i++) {
      form.location[i].addEventListener("change", locationSelected);
    }
    form.gcu.addEventListener("change", gcuAccepted);
    form.first.addEventListener("input", nameValidation);
    form.last.addEventListener("input", nameValidation);
    form.email.addEventListener("input", emailValidation);
    form.birthdate.addEventListener("input", dateValidation);
    form.quantity.addEventListener("input", contestNumberValidation);

    //give the focus to the first field with an error message
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
function validate(event) {
  for (let field of formData) {
    //a non-empty message means there is an error, the focus is given to this field and the function finish here
    if (field.querySelector(".invalid-message").textContent != "") {
      field.querySelector("input").focus();
      event.preventDefault();
      break;
    }
  }
  // if it gets here without activating "preventDefault()", the submission is done
  // So the page is reload with a modified URL (method get, see HTML file)
}

//if submission has occured, page is reload and the url contain "?" plus the values of the submitted form
//thus it needs to display the confirmation message (not included to the validate() function because there is a reload of the page)
const url = window.location.href;
if (
  url.indexOf("?") != -1 &&
  url.indexOf("first=") != -1 &&
  url.indexOf("&last=") != -1 &&
  url.indexOf("&email=") != -1 &&
  url.indexOf("&birthdate=") != -1 &&
  url.indexOf("&quantity=") != -1 &&
  url.indexOf("&location=") != -1 &&
  url.indexOf("&gcu=") != -1
) {
  submiConfirm.style.display = "flex";
  submiConfirm.querySelector("p").classList.add("modal-appear");
  modalbg.style.display = "block";
}
