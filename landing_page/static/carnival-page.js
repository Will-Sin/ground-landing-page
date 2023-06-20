// index.js ---------------
//Model
//none
// import { sendChat } from 'main.js';

var devURL = 'http://127.0.0.1:8000/api';
var productionURL = 'https://nftjoseph.pythonanywhere.com/api';

var sendButton = document.getElementsByClassName("send-text-message")[0];
var inputField = document.getElementsByClassName("text-input")[0];
var bookIDObject = document.getElementsByClassName("book-id")[0];
var messageBoxDiv = document.getElementsByClassName("message-box-div");
var interactionsCountDiv = document.getElementsByClassName("interactions")[0];
var consoleDiv = document.getElementsByClassName("console")[0];
var bookError = document.getElementsByClassName("book-error")[0];

var interactionsCount;
var bookID;
window.chat_history = ""

// Listen to the send button for text chat
sendButton.onclick = sendChat;

function checkInputLength() {
  const value = bookIDObject.value;

  if (value.length === 4) {
    // Perform your desired action here
    console.log('Four characters entered!');

    bookError.classList.remove("hide");
    interactionVerify()
    // You can add more code or call another function
  }

  bookError.classList.add("hide");
}

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

    messageBoxDiv[0].classList.add("hide");
    messageBoxDiv[1].classList.add("hide");

    return 0
  } else {

    messageBoxDiv[0]
    messageBoxDiv[1].classList.remove("hide");

    interactionsCountDiv.innerHTML = `<i>You now can ask <b>${interactionsCount}</b> questions to the Oracle. After those are up, you'll need to wait until the next scenario.</i>`

    return 1
  };
};


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
  return fetch(`${productionURL}/script/${bookID}/GREEN/1/`, requestOptions)
};

/** A fetch function that sends the inputed scenario ID and returns whether there is a script to post or not*/
async function fetchScript(bookID) {

  console.log("Book ID:" + bookID)

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
  return fetch(`${productionURL}/script/${bookID}/GREEN/1/`, requestOptions)
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
async function interactionVerify() {

    let oracle_name = "Oracle";

    const res = await fetchScript(bookID);

    response_object = await res.json();

    consoleDiv.innerHTML = JSON.stringify(response_object)

    interactionCalculator(response_object)

};
