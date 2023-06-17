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
//var recorderDiv = document.getElementsByClassName("recorder-div");
var messageBoxDiv = document.getElementsByClassName("message-box-div");
//var interactionsCountDiv = document.getElementsByClassName("interactions")[0];
var caveAndScenarioErrorDiv = document.getElementsByClassName("cave-scenario-error")[0];
var consoleDiv = document.getElementsByClassName("console")[0];

var interactionsCount;
var scenario_id;
var user_cave;
var bookID;
var scenarioSlect = document.getElementById("scenario_select");
var caveSelect = document.getElementById("cave_select");
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
      if (inputField === scenarioSelectInput) {
        scenarioVerify();
      }
      // Trigger cave verification when a list item is clicked
      if (inputField === caveSelectInput) {
        caveVerify();
      }
    });
  });

  // Rest of your existing dropdown code...
});

/** Takes a text input and user name to then post the chat repsonse into the DOM*/
function update_DOM(input, user) {
  const chatDiv = document.getElementById("chat_box");
  let textP = document.createElement("p");
  textP.className = "clear"
  textP.className = "fade-in"
  textP.innerHTML = `${user}: ${input}<br>`;
  textP.classList.remove("clear");
  chatDiv.appendChild(textP);

};

/** Called once a voice note is sent and determines what do to given how many interactions are returned*/
function interactionCalculator(response_object) {
  interactionsCount = response_object["interactions_available"];

  console.log(interactionsCount)

  if (interactionsCount <= 0) {

    interactionsCountDiv.innerHTML = `<i>You have no more interactions with the Oracle. SORRY!</i>`

/**
    recorderDiv[0].classList.remove("hide");
    recorderDiv[1].classList.remove("hide");
**/
    messageBoxDiv[0].classList.add("hide");
    messageBoxDiv[1].classList.add("hide");
/**
    return 0
  } else {
    recorderDiv[0].classList.add("hide");
    recorderDiv[1].classList.add("hide");
**/
    console.log(111)
    messageBoxDiv[0].classList.remove("hide");
    messageBoxDiv[1].classList.remove("hide");


    interactionsCountDiv.innerHTML = `<i>You now can ask <b>${interactionsCount}</b> questions to the Oracle. After those are up, you'll need to wait until the next scenario.</i>`

    return 1
  };
};

/***/
function caveAndScenarioCheck(cave, scenario) {

    if (cave === "" || scenario === "") {
        caveAndScenarioErrorDiv.classList.remove("hide");
        return 0
    } else {
        caveAndScenarioErrorDiv.classList.add("hide");
        return 1
    }
}

/***/
function caveAndScenarioSetVariables() {

    scenario_id = scenarioSelectInput.value;
    user_cave = caveSelectInput.value;
    bookID = bookIDObject.value;

    return caveAndScenarioCheck(user_cave, scenario_id)
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

    return fetch(`${productionURL}/book/${bookID}/${user_cave}/${scenario_id}/`, requestOptions)
};

/** A fetch function that sends the inputed scenario ID and returns whether there is a script to post or not*/
async function fetchScript() {

  console.log(scenario_id, user_cave)

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
  "book": {
    "blank": "blank",
    }
  });

  var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  return fetch(`${productionURL}/script/${bookID}/${user_cave}/${scenario_id}/`, requestOptions)
};

/** Called once the send button is clicked and sends the inputed text to the fetch function that calls the Oracle Endpoint*/
async function sendChat() {
    let user_input = inputField.value;
    let user_name = "You";
    let oracle_name = "Oracle";

    console.log(inputField.value);

    update_DOM(user_input, user_name);

    const res = await fetchChat(user_input, chat_history);

    response_object = await res.json();
    console.log(response_object);

    response = response_object["gpt response"];
    window.chat_history = response_object["chat history"];

    interactionCalculator(response_object)
    update_DOM(response, oracle_name);
};


/** Called once the scenario is changed or selected, and checks if there needs to be script for the Oracle or not*/
async function scenarioVerify() {

    let check = await caveAndScenarioSetVariables()

    if (check === 0) {
        return
    }

    let oracle_name = "Oracle";

    const res = await fetchScript(scenario_id);

    response_object = await res.json();
    response = response_object["scenario_script"];

    if (response != "400") {
      if (response != "no script needed") {
        window.chat_history = response;
        console.log(response_object);
        consoleDiv.innerHTML = JSON.stringify(response_object)
      } else {
        console.log(response_object);
        consoleDiv.innerHTML = JSON.stringify(response_object)
      }
    }

    consoleDiv.innerHTML = JSON.stringify(response_object)

    interactionCalculator(response_object)

    if (response !== "no script needed") {
        update_DOM(response, oracle_name);
    }

};

/** Called once the scenario is changed or selected, and checks if there needs to be script for the Oracle or not*/
async function caveVerify() {

    let check = await caveAndScenarioSetVariables()

    if (check === 0) {
        return
    }

    let oracle_name = "Oracle";

    const res = await fetchScript();

    response_object = await res.json();
    response = response_object["scenario_script"];

    if (response != "400") {
      if (response != "no script needed") {
        window.chat_history = response;
        console.log(response_object);
        consoleDiv.innerHTML = JSON.stringify(response_object)
      } else {
        console.log(response_object);
        consoleDiv.innerHTML = JSON.stringify(response_object)
      }
    }

    consoleDiv.innerHTML = JSON.stringify(response_object)

    interactionCalculator(response_object)

    if (response !== "no script needed") {
        update_DOM(response, oracle_name);
    }

};




//
//
//
//
//
//

