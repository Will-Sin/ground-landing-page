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

// Hidden divs

var introBookDiv = document.getElementsByClassName("intro-book")[0];
var messageBoxDiv = document.getElementsByClassName("message-box");
var bookErrorDiv = document.getElementsByClassName("error-book")[0];
var interactionsCountDiv = document.getElementsByClassName("interactions")[0];
var interactionsCountTextDiv = document.getElementsByClassName("interactions-text")[0];
var errorInteractionsDiv = document.getElementsByClassName("error-interactions")[0];
var caveAndScenarioErrorDiv = document.getElementsByClassName("cave-scenario-error")[0];
var chatBoxRow = document.getElementsByClassName("chat_box_row")[0];

var interactionsCount;
var scenario_id;
var user_cave;
var bookID;
var scenarioSlect = document.getElementById("scenario_select");
var caveSelect = document.getElementById("cave_select");
var interactionsCount;
var bookID;
window.chat_history = ""

// Listen to the send button for text chat
sendButton.onclick = sendChat;

// Loop through each dropdown
dropdowns.forEach((dropdown, index) => {
  const inputField = inputFields[index];
  const dropdownArray = [...dropdown.querySelectorAll('li')];

  // Rest of your existing dropdown code...

  dropdownArray.forEach(item => {
    item.addEventListener('click', () => {
      inputField.value = item.textContent;
      dropdown.classList.remove('open');
      // Trigger scenario verification when a list item is clicked
      console.log(scenarioSelectInput)
      if (inputField === scenarioSelectInput) {
        scenarioVerify();
      }
      // Trigger cave verification when a list item is clicked
      if (inputField === caveSelectInput) {
        caveVerify();
      }
    });
  });

});

function checkInputLength(test) {
  const value = bookIDObject.value;

  if (value.length === 5) {
    // Perform your desired action here
    console.log('Five characters entered!');

    introBookDiv.classList.add("hide");
    //BookAndInteractionVerify(value)
    if (test === 1) {
      scenarioVerify()
    }
    return true;
    // You can add more code or call another function
  } else {
    introBookDiv.classList.remove("hide");

    return false;
  }
}

function bookVerify(response_object) {
  if (response_object["Book ID"] == "Invalid") {
    //Error message about Offering String
    console.log("error 2")
    bookErrorDiv.classList.remove("hide");
    return false;
  }
  else {
    //Success message about Offering String
    bookErrorDiv.classList.add("hide");
    return true;
  }
}

/** Takes a text input and user name to then post the chat repsonse into the DOM*/
function update_DOM(input, user) {
  const chatDiv = document.getElementById("chat_box");
  let textP = document.createElement("p");
  chatBoxRow.classList.remove("hide");
  textP.className = "fade-in"
  textP.innerHTML = `${user}: ${input}<br>`;
  chatDiv.innerHTML = ""
  chatDiv.appendChild(textP);

};

/** Called once a voice note is sent and determines what do to given how many interactions are returned*/
function interactionCalculator(response_object) {
  interactionsCount = response_object["interactions_available"];

  console.log(interactionsCount);

  if (interactionsCount <= 0) {

    messageBoxDiv[0].classList.add("hide");
    interactionsCountDiv.classList.remove("hide")
    interactionsCountTextDiv.innerHTML = `<i>You are out of questions...</i>`;

    return 0;
  } else {

    messageBoxDiv[0].classList.remove("hide");
    interactionsCountDiv.classList.remove("hide")
    interactionsCountTextDiv.innerHTML = `<i>You now can ask <b>${interactionsCount}</b> questions to the Oracle. After those are up, you'll need a new offering.</i>`;

    return 1;
  }
}

/***/
function caveAndScenarioCheck(cave, scenario) {

    if (cave === "" || scenario === "") {
        caveAndScenarioErrorDiv.classList.remove("hide");
        return 0;
    } else {
        caveAndScenarioErrorDiv.classList.add("hide");
        return 1;
    }
}

/***/
function caveAndScenarioSetVariables() {

    scenario_id = scenarioSelectInput.value;
    user_cave = caveSelectInput.value;
    bookID = bookIDObject.value;

    return caveAndScenarioCheck(user_cave, scenario_id);
}


/** A fetch function that sends inputed text to the Oracle Endpoint and returns its response*/
async function fetchChat(user_input, chat_history) {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
    "book": {
        "current_inquiry": String(user_input),
        "chat_history": String(chat_history)
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
    let user_input = inputField.value;
    let user_name = "You";
    let oracle_name = "Oracle";

    console.log(inputField.value);

    //update_DOM(user_input, user_name);

    const res = await fetchChat(user_input, chat_history);

    response_object = await res.json();
    console.log(response_object);

    response = response_object["gpt response"];
    window.chat_history = response_object["chat history"];

    interactionCalculator(response_object);
    update_DOM(response, oracle_name);
}


/** Called once the scenario is changed or selected, and checks if there needs to be script for the Oracle or not*/
async function BookAndInteractionVerify(bookID) {

    let oracle_name = "Oracle";

    const res = await fetchScript(bookID);

    response_object = await res.json();

    //consoleDiv.innerHTML = JSON.stringify(response_object);
    console.log("error 1")
    if (bookVerify(response_object)) {
      console.log("error 3")
      interactionCalculator(response_object)  ;
    }


}

/** Called once the scenario is changed or selected, and checks if there needs to be script for the Oracle or not*/
async function scenarioVerify() {

    let check = await caveAndScenarioSetVariables();

    if (check === 0) {
        return;
    }

    if (checkInputLength(0)) {
    } else {

      return;
    }

    let oracle_name = "Oracle";
    console.log("error 4")
    const res = await fetchScript(bookID, scenario_id, user_cave);

    response_object = await res.json();
    response = response_object["scenario_script"];

    if (response != "400") {
      if (response != "no script needed") {
        window.chat_history = response;
        console.log(response_object);
        //consoleDiv.innerHTML = JSON.stringify(response_object)
      } else {
        console.log(response_object);
        //consoleDiv.innerHTML = JSON.stringify(response_object)
      }
    }

    //consoleDiv.innerHTML = JSON.stringify(response_object)

    if (bookVerify(response_object)) {
      console.log("error 3")
      interactionCalculator(response_object)  ;
    }

    if (response !== "no script needed") {
        update_DOM(response, oracle_name);
    }

};

/** Called once the scenario is changed or selected, and checks if there needs to be script for the Oracle or not*/
async function caveVerify() {

    let check = await caveAndScenarioSetVariables()


    if (check === 0) {
        return;
    }

    if (checkInputLength(0)) {
    } else {
      return;
    }

    let oracle_name = "Oracle";

    const res = await fetchScript(bookID, scenario_id, user_cave);

    response_object = await res.json();
    response = response_object["scenario_script"];

    if (response != "400") {
      if (response != "no script needed") {
        window.chat_history = response;
        console.log(response_object);
        //consoleDiv.innerHTML = JSON.stringify(response_object)
      } else {
        console.log(response_object);
        //consoleDiv.innerHTML = JSON.stringify(response_object)
      }
    }

    //consoleDiv.innerHTML = JSON.stringify(response_object)

    if (bookVerify(response_object)) {
      console.log("error 3")
      interactionCalculator(response_object)  ;
    }

    if (response !== "no script needed") {
        update_DOM(response, oracle_name);
    }

};
