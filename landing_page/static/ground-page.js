// index.js ---------------
//Model
//none
// import { sendChat } from 'main.js';
var devURL = 'http://127.0.0.1:8000/api';
var productionURL = 'https://nftjoseph.pythonanywhere.com/api';

var scenarioSelectInput = document.getElementsByClassName("chosen-value")[1];
var caveSelectInput = document.getElementsByClassName("chosen-value")[0];
var sendButton = document.getElementsByClassName("send-text-message")[0];
var inputField = document.getElementsByClassName("text-input")[0];
var bookIDObject = document.getElementsByClassName("book-id")[0];
//var consoleDiv = document.getElementsByClassName("console")[0];
const ctaDivs = document.querySelectorAll(".row.cta");
const ctaButton = document.getElementsByClassName("cta")[1];
const ctaBackButton = document.getElementsByClassName("button-back")[0];
const ctaStartButton = document.getElementsByClassName("button-start")[0];
const removableInputSpacers = document.querySelectorAll(".book-input-spacer");
const tryAgainButton = document.getElementsByClassName("try-again-button")[0];
const mobileMenuButton = document.getElementsByClassName("mobile-menu-button")[0];
const leftContainerDiv = document.getElementsByClassName("left-container")[0];
const footerURL = document.getElementsByClassName("footer-text")[0];
const productionConsole = document.getElementsByClassName("production-console")[0];
const introTextDiv = document.getElementsByClassName("intro-text")[0];
const windowWidth = window.innerWidth;

// Drop Downs
const inputFields = document.querySelectorAll('.chosen-value');
const dropdowns = document.querySelectorAll('.value-list');
const placeholders = ['CAVE', 'SCENARIO']; // Add the desired placeholders in the same order as the forms

// Hidden divs

const messageBoxDiv = document.querySelectorAll(".message-box");
const bookErrorDiv = document.getElementsByClassName("error-book")[0];
const scenarioErrorDiv = document.getElementsByClassName("error-scenario")[0];
const interactionsCountTextDiv = document.getElementsByClassName("interactions-text")[0];
const errorInteractionsDiv = document.getElementsByClassName("error-interactions")[0];
const caveAndScenarioErrorDiv = document.getElementsByClassName("cave-scenario-error")[0];
const chatBox = document.getElementsByClassName("chat-box")[0];
const bookInputs = document.querySelectorAll(".book-inputs.hide");

var interactionsCount;
var scenario_id;
var user_cave;
var bookID;
var scenarioSlect = document.getElementById("scenario_select");
var caveSelect = document.getElementById("cave_select");
var interactionsCount;
var bookID;
window.chat_history = ""

/*/ / / / / / / / / /*/

/*/ / / / / / / / / /*/

/*/ / / / / / / / / /*/

const box = document.querySelector('.box');
const iTag = document.querySelector('i');
const pTag = document.getElementById('oracle-response');
const boxHeight = document.offsetHeight;
const iWidth = iTag.offsetWidth;
var iHeight;
var pHeight;
var counter = 0;

const setBoxHeight = () => {
  box.style.height = '1000px !important';
  adjustBoxHeight();
};

function setWidthAndHeight() {
  const wordCount = WordCount(pTag.innerHTML);
  const minWords = 30;
  const maxWords = 100;
  const minWidth = 15; // in rem
  const maxWidth = 40; // in rem

  // Calculate the width based on the word count and the specified range
  const width = (wordCount <= minWords) ? minWidth :
    (wordCount >= maxWords) ? maxWidth :
    minWidth + ((wordCount - minWords) / (maxWords - minWords)) * (maxWidth - minWidth);

  box.style.width = `${width}rem`; // Calculate the width within the range
}

function WordCount(str) {
  return str.split(" ").length;
}

function adjustBoxHeight() {
  setWidthAndHeight();
  compareHeights();
  adjustHeightIfShort();
  counter = 0;
}

function compareHeights() {
  iHeight = iTag.offsetHeight;
  pHeight = pTag.offsetHeight;

  if (iHeight > pHeight * 1.1 && counter !== 500) {
    //console.log("Frame too tall");
    //console.log(pHeight);
    //console.log(iHeight);
    box.style.height = `${iHeight - 2}px`;
    counter++;
    compareHeights(); // Recursively call compareHeights()
  }
}

function adjustHeightIfShort() {
  iHeight = iTag.offsetHeight;
  pHeight = pTag.offsetHeight;

  if (iHeight < pHeight && counter !== 500) {
    //console.log("Frame too short");
    //console.log(pHeight);
    //console.log(iHeight);
    box.style.height = `${iHeight + 2}px`;
    counter++
    adjustHeightIfShort(); // Recursively call adjustHeightIfShort()
  }
}

/*/ / / / / / / / / /*/

/*/ / / / / / / / / /*/

/*/ / / / / / / / / /*/

/*/ / / / / / / / / /*/

  /**/

ctaStartButton.addEventListener("click", function () {

  // Add removeable spacers if the screen is greater than 1280
  if (!mobileCheck()) {
    removableInputSpacers.forEach(function (col) {
      col.classList.add("hide");
    });
  } else {
    mobileMenuButton.classList.remove("hide");
    footerURL.classList.remove("hide");
  };

  ctaStartButton.innerHTML ="Update";

  const chosenValueInputs = document.querySelectorAll('.chosen-value');
  let isListValid = true;
  let isBookValid = true;

  chosenValueInputs.forEach(function (input) {
    if (input.value.trim() == "") {
      isListValid = false;
      caveAndScenarioErrorDiv.classList.remove("hide");
    }
  });

  const bookIdInput = document.querySelector('.book-id');
  const bookIdValue = bookIdInput.value.trim();

  if (bookIdValue.length !== 5) {
    isBookValid = false;
    bookErrorDiv.classList.remove("hide");
  }

  if (isListValid && isBookValid) {
    bookErrorDiv.classList.add("hide");
    caveAndScenarioErrorDiv.classList.add("hide");
    valueVerify();

    // Check if the window width is less than 1280 pixels and then hide the upper (left) pannel.
    if (mobileCheck()) {
      leftContainerDiv.classList.add("hide");
    } else {
      productionConsole.style.maxWidth = "34rem";
    };
  }
});

// On CTA button click, hides CTA elements and shows next divs.
ctaButton.addEventListener("click", function () {
  ctaDivs.forEach((item) => {
    item.classList.add("hide");
  });
  bookInputs.forEach((item) => {
    item.classList.remove("hide");
  });

  // If on desktop, remove the mobile maxWidth CSS parameter.
  if (!mobileCheck()) {
    productionConsole.style.maxWidth = null;
  };
});

// On CTA button click, hides CTA elements and shows next divs.
ctaBackButton.addEventListener("click", function () {
  ctaDivs.forEach((item) => {
    item.classList.remove("hide");
  });
  bookInputs.forEach((item) => {
    item.classList.add("hide");
  });

  removableInputSpacers.forEach(function (col) {
    col.classList.remove("hide");
  });

  messageBoxDiv.forEach((item) => {
    // Check if the "hide" class is NOT present in the current element's classList
    if (!item.classList.contains("hide")) {
      // Add the "hide" class to the current element
      item.classList.add('hide');
    }
  });

});

// Button to be clicked after recieving a response from the Oracle, and to access the message pannel again.
tryAgainButton.addEventListener("click", function () {
  tryAgainButton.classList.add("hide")
  messageBoxDiv[0].classList.remove("hide")
  sendButton.classList.remove("hide")
});

// Listen to the send button for text chat
sendButton.onclick = sendChat;

// Mobile menu button on click
mobileMenuButton.addEventListener("click", function () {
  leftContainerDiv.classList.remove("hide");
  mobileMenuButton.classList.add("hide");

  messageBoxDiv.forEach((item) => {
    // Check if the "hide" class is NOT present in the current element's classList
    if (!item.classList.contains("hide")) {
      // Add the "hide" class to the current element
      item.classList.add('hide');
    }
  });
});

// Loop through each dropdown
dropdowns.forEach((dropdown, index) => {
  const inputField = inputFields[index];
  const dropdownArray = [...dropdown.querySelectorAll('li')];

  // Rest of your existing dropdown code...

  dropdownArray.forEach(item => {
    item.addEventListener('click', () => {
      inputField.value = item.textContent;
      dropdown.classList.remove('open');
    });
  });

});

function bookVerify(response_object) {
  if (response_object["Book ID"] == "Invalid") {
    //Error message about Offering String
    bookErrorDiv.classList.remove("hide");
    return false;
  }
  else {
    //Success message about Offering String
    bookErrorDiv.classList.add("hide");
    return true;
  }
}

function scenarioVerify(response_object) {
  if (response_object["response"] == "Please select the correct scenario.") {
    //Error message about the selected scenario
    scenarioErrorDiv.classList.remove("hide");
    return false;
  }
  else {
    scenarioErrorDiv.classList.add("hide");
    return true;
  }
}

// A function to check whether the screen width is larger or less than 1280 pixels, which can then be used to determine how to display
// certain elements.
function mobileCheck() {
  // If on desktop return false
  if (windowWidth >= 1280) {
    return false;
  } else if (windowWidth < 1280) {
    return true;
  };
}

// Sets the token count for the Oracle response because it cannot be larger than 140 tokens, otherwise it will overflow on the screen.
// A better solution to this would be to have "pages" where if the response is larger than 140 tokens, there is a NEXT and a BACK button that
// will allow the user to flip through the pages of the response.
function mobileCharacterCountUpdate() {
  if (mobileCheck()) {
    return "mobile";
  } else {
    return "desktop";
  };
};

/** Takes a text input and user name to then post the chat repsonse into the DOM*/
function update_DOM(input, user) {
  const textH4 = document.getElementById("oracle-response");
  textH4.innerHTML = `<span class="highlight stroke-text smooth-16">${user}: ${input}</span>`;
  chatBox.classList.remove("hide");
  setBoxHeight()
};

/** Called once a voice note is sent and determines what do to given how many interactions are returned*/
function interactionCalculator(response_object) {
  interactionsCount = response_object["interactions_available"];

  console.log(interactionsCount);

  // If the interaction count is equal to or less than 0, hide the TRY AGAIN button so people are restricted to their interactions count.
  // The Else statement is whether there is interactions still available.
  if (interactionsCount <= 0) {
    console.log("HIDE TRY AGAIN")
    tryAgainButton.classList.add("hide");

    messageBoxDiv.forEach((item) => {
        // Check if the "hide" class is NOT present in the current element's classList
        if (!item.classList.contains("hide")) {
          // Add the "hide" class to the current element
          item.classList.add('hide');
        }
      });

    interactionsCountTextDiv.classList.remove("hide")
    interactionsCountTextDiv.innerHTML = `<i>You are out of questions...</i>`;

    // Check if the window width is less than 1280 pixels and then show the upper (left) pannel.
    if (mobileCheck()) {
      leftContainerDiv.classList.remove("hide");
      mobileMenuButton.classList.add("hide");
    };
  } else {
    console.log("ELSE");

    // If the send button is hidden, show the TRY AGAIN button because this is within the Else statement that states there are interactions
    // available, which means the user should be able to send another message by clicking the TRY AGAIN button.
    // The Else statement would trigger if the SEND button is not hidden, and the rest of the Message Box divs will then be shown
    // so that the user can ingage with the Oracle.
    if (sendButton.classList.contains("hide")) {
      console.log("SHOW TRY AGAIN");
      tryAgainButton.classList.remove("hide");
    } else {
      messageBoxDiv[0].classList.remove("hide");
      messageBoxDiv[1].classList.remove("hide");
    };
    interactionsCountTextDiv.classList.remove("hide");
    interactionsCountTextDiv.innerHTML = `<i>You now can ask <b>${interactionsCount}</b> questions to the Oracle. After those are up, you'll need a new offering.</i>`;
  }
}


/** A fetch function that sends inputed text to the Oracle Endpoint and returns its response*/
async function fetchChat(user_input, chat_history, device) {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
    "book": {
        "current_inquiry": String(user_input),
        "chat_history": String(chat_history),
        "device": String(device)
    }
    });

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

  // GREEN and 1 are place holders because API needs them, but it doesn't affect anything.
  return fetch(`${productionURL}/book/${bookID}/${user_cave}/${scenario_id}/`, requestOptions)
}


/** A fetch function that sends the inputed scenario ID and returns whether there is a script to post or not*/
async function fetchScript(bookID, scenario_id, user_cave) {

  console.log("Book ID:" + bookID);

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
  "book": {
    "blank": String(bookID),
    }
  });

  var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  // GREEN and 1 are place holders because API needs them, but it doesn't affect anything.
  return fetch(`${productionURL}/script/${bookID}/${user_cave}/${scenario_id}/`, requestOptions);
}


/** Called once the send button is clicked and sends the inputed text to the fetch function that calls the Oracle Endpoint*/
async function sendChat() {
    sendButton.innerHTML ="CONTACTING...";
    messageBoxDiv[0].classList.add("hide")

    let user_input = inputField.value;
    let user_name = "You";
    let oracle_name = "Oracle";

    console.log(inputField.value);


    //update_DOM(user_input, user_name);

    let device = mobileCharacterCountUpdate();
    console.log(device);

    const res = await fetchChat(user_input, chat_history);

    response_object = await res.json();
    console.log(response_object);

    response = response_object["gpt response"];
    window.chat_history = response_object["chat history"];

    // Calls the InteractionCalculator to determine if there are enough interactions left to interact with the Oracle
    // and the proper buttons will or will not be shown depending on the available interactions.
    interactionCalculator(response_object);
    update_DOM(response, oracle_name);
    sendButton.innerHTML = "SEND MESSAGE";

    // The message is cleared from the message box once the send call is completed.
    document.getElementsByClassName("text-input")[0].value = '';
};


/** Called once the scenario is changed or selected, and checks if there needs to be script for the Oracle or not*/
async function BookAndInteractionVerify(bookID) {

    let oracle_name = "Oracle";

    const res = await fetchScript(bookID);

    response_object = await res.json();

    //consoleDiv.innerHTML = JSON.stringify(response_object);

    if (bookVerify(response_object)) {

      interactionCalculator(response_object)  ;
    }


}

/** Called once the scenario is changed or selected, and checks if there needs to be script for the Oracle or not*/
async function valueVerify() {

    scenario_id = scenarioSelectInput.value;
    user_cave = caveSelectInput.value;
    bookID = bookIDObject.value;

    let oracle_name = "Oracle";
    const res = await fetchScript(bookID, scenario_id, user_cave);

    response_object = await res.json();
    response = response_object["scenario_script"];

    console.log(response);

    // Need to look through this.
    if (response != "400") {
      if (response != "no script needed") {
        window.chat_history = response;
        console.log(response_object);
      } else {
        console.log(response_object);
      };
    };

    // Checks to see if the response object claimed the book was valid or not, and whether the correct scenario was selected.
    if (bookVerify(response_object) & scenarioVerify(response_object)) {
      // Calls the InteractionCalculator to determine if there are enough interactions left to interact with the Oracle
      // and the proper buttons will or will not be shown depending on the available interactions.
      interactionCalculator(response_object);

      // If the repsonse object does not say "no script needed" and the response isn't empty, update the Oracles response.
      if (response != "no script needed" && response != "") {
        console.log(response);
        update_DOM(response, oracle_name);
      };
    } else {
      // If there is an error with the bookVerify or ScenarioVerify, the SEND button and messgae box will be hidden, and
      // the interactions notification will be removed.
      messageBoxDiv[0].classList.add("hide");
      messageBoxDiv[1].classList.add("hide");
      interactionsCountTextDiv.classList.add("hide");
    };

    if (response_object["next_scenario"] >= 2) {
      introTextDiv.classList.add("hide");
    };
};