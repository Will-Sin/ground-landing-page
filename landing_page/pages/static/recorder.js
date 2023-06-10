// index.js ---------------
//Model
//none
// import { sendChat } from 'main.js';

var devURL = 'http://127.0.0.1:8000/api';
var productionURL = 'https://nftjoseph.pythonanywhere.com/api';

var scenarioSelectDiv = document.getElementById("scenario_select");
var caveSelectDiv = document.getElementById("cave_select");
var sendButton = document.getElementsByClassName("send-text-message")[0];
var inputField = document.getElementById("text-input");
var bookIDObject = document.getElementsByClassName("book-id")[0];
var recorderDiv = document.getElementsByClassName("recorder-div");
var messageBoxDiv = document.getElementsByClassName("message-box-div");
var interactionsCountDiv = document.getElementsByClassName("interactions")[0];
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

// Listen to Scenario Selector
scenarioSelectDiv.onchange = scnearioVerify;

// Listen to Scenario Selector
caveSelectDiv.onchange = caveVerify;

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

  if (interactionsCount == 0) {
    recorderDiv[0].classList.remove("hide");
    recorderDiv[1].classList.remove("hide");

    messageBoxDiv[0].classList.add("hide");
    messageBoxDiv[1].classList.add("hide");

    return 0
  } else {
    recorderDiv[0].classList.add("hide");
    recorderDiv[1].classList.add("hide");

    messageBoxDiv[0]
    messageBoxDiv[1].classList.remove("hide");

    interactionsCountDiv.innerHTML = `<i>You now can ask <b>${interactionsCount}</b> questions to the Oracle. After those are up, you'll need to wait until the next scenario.</i>`

    return 1
  };
};

/***/
function caveAndScenarioCheck(cave, scenario) {

    if (cave === "CAVE SELECT" || scenario === "SCENARIO SELECT") {
        caveAndScenarioErrorDiv.classList.remove("hide");
        return 0
    } else {
        caveAndScenarioErrorDiv.classList.add("hide");
        return 1
    }
}

/***/
function caveAndScenarioSetVariables() {

    scenario_id = scenarioSlect.options[scenarioSlect.selectedIndex].text;
    user_cave = caveSelect.options[caveSelect.selectedIndex].text;
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
async function scnearioVerify() {

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

//View
var microphoneButton = document.getElementsByClassName("start-recording-button")[0];
var stopRecordingButton = document.getElementsByClassName("stop-recording-button")[0];
var cancelRecordingButton = document.getElementsByClassName("cancel-recording-button")[0];
var sendRecordingButton = document.getElementsByClassName("send-recording-button")[0];
var elapsedTimeTag = document.getElementsByClassName("elapsed-time")[0];
var closeBrowserNotSupportedBoxButton = document.getElementsByClassName("close-browser-not-supported-box")[0];
var overlay = document.getElementsByClassName("overlay")[0];
var audioElement = document.getElementsByClassName("audio-element")[0];
var audioElementSource = document.getElementsByClassName("audio-element")[0]
    .getElementsByTagName("source")[0];


//Listeners

//Listen to start recording button
microphoneButton.onclick = startAudioRecording;

//Listen to stop recording button
stopRecordingButton.onclick = stopAudioRecording;

//Listen to cancel recording button
cancelRecordingButton.onclick = cancelAudioRecording;

//Listen to send recording button
sendRecordingButton.onclick = sendAudioRecording;

//Listen to when the ok button is clicked in the browser not supporting audio recording box
closeBrowserNotSupportedBoxButton.onclick = hideBrowserNotSupportedOverlay;

/** Displays recording control buttons */
function handleDisplayingRecordingControlButtons() {
    //Hide the microphone button that starts audio recording
    microphoneButton.classList.add("hide");
    sendRecordingButton.classList.add("hide");

    //Display the recording control buttons
    stopRecordingButton.classList.remove("hide");
    cancelRecordingButton.classList.remove("hide");

    //Handle the displaying of the elapsed recording time
    handleElapsedRecordingTime();
}

/** Hide the displayed recording control buttons */
function handleHidingRecordingControlButtons() {
    //Display the microphone button that starts audio recording
    microphoneButton.classList.remove("hide");

    stopRecordingButton.classList.add("hide");
    cancelRecordingButton.classList.add("hide");

    //Hide the recording control buttons
    elapsedTimeTag.classList.add("hide");
}

function handleHidingRecordingControlButtonsShowSend() {
    microphoneButton.classList.remove("hide");
    sendRecordingButton.classList.remove("hide");

    stopRecordingButton.classList.add("hide");
    cancelRecordingButton.classList.add("hide");

    //Hide the recording control buttons
    elapsedTimeTag.classList.add("hide");
}

/** Hide the send button after clicking*/
function handleHindingSendButton() {
    sendRecordingButton.classList.add("hide");
}

/** Displays browser not supported info box for the user*/
function displayBrowserNotSupportedOverlay() {
    overlay.classList.remove("hide");
}

/** Displays browser not supported info box for the user*/
function hideBrowserNotSupportedOverlay() {
    overlay.classList.add("hide");
}

/** Creates a source element for the the audio element in the HTML document*/
function createSourceForAudioElement() {
    let sourceElement = document.createElement("source");
    audioElement.appendChild(sourceElement);

    audioElementSource = sourceElement;
}

/** Called to check if voice note is longer than 10 seconds*/

function checkIfVoiceNoteLongerThanTenSeconds() {
    // Splits time string into arrary [minutes, seconds]
    let timeArray = elapsedTimeTag.innerHTML.split(":")

    // Creates an integer of total seconds
    let totalSeconds = timeArray[0] * 60 + timeArray[1]

    // If the total amount of seconds on the recording is more than 10 seconds, send the recording, otherwise unhide html element saying you need a longer recording.
    if (totalSeconds > 10) {

        return 1
    } else {
        return 0
    }
}


//Controller

/** Stores the actual start time when an audio recording begins to take place to ensure elapsed time start time is accurate*/
var audioRecordStartTime;

/** Stores the maximum recording time in hours to stop recording once maximum recording hour has been reached */
var maximumRecordingTimeInHours = 1;

/** Stores the reference of the setInterval function that controls the timer in audio recording*/
var elapsedTimeTimer;

/** Starts the audio recording*/
function startAudioRecording() {

    console.log("Recording Audio...");

    //If a previous audio recording is playing, pause it
    let recorderAudioIsPlaying = !audioElement.paused; // the paused property tells whether the media element is paused or not
    console.log("paused?", !recorderAudioIsPlaying);

    //start recording using the audio recording API
    audioRecorder.start()
        .then(() => { //on success

            //store the recording start time to display the elapsed time according to it
            audioRecordStartTime = new Date();

            //display control buttons to offer the functionality of stop and cancel
            handleDisplayingRecordingControlButtons();
        })
        .catch(error => { //on error
            //No Browser Support Error
            if (error.message.includes("mediaDevices API or getUserMedia method is not supported in this browser.")) {
                console.log("To record audio, use browsers like Chrome and Firefox.");
                displayBrowserNotSupportedOverlay();
            }

            //Error handling structure
            switch (error.name) {
                case 'AbortError': //error from navigator.mediaDevices.getUserMedia
                    console.log("An AbortError has occured.");
                    break;
                case 'NotAllowedError': //error from navigator.mediaDevices.getUserMedia
                    console.log("A NotAllowedError has occured. User might have denied permission.");
                    break;
                case 'NotFoundError': //error from navigator.mediaDevices.getUserMedia
                    console.log("A NotFoundError has occured.");
                    break;
                case 'NotReadableError': //error from navigator.mediaDevices.getUserMedia
                    console.log("A NotReadableError has occured.");
                    break;
                case 'SecurityError': //error from navigator.mediaDevices.getUserMedia or from the MediaRecorder.start
                    console.log("A SecurityError has occured.");
                    break;
                case 'TypeError': //error from navigator.mediaDevices.getUserMedia
                    console.log("A TypeError has occured.");
                    break;
                case 'InvalidStateError': //error from the MediaRecorder.start
                    console.log("An InvalidStateError has occured.");
                    break;
                case 'UnknownError': //error from the MediaRecorder.start
                    console.log("An UnknownError has occured.");
                    break;
                default:
                    console.log("An error occured with the error name " + error.name);
            };
        });
}

/** Stop the currently started audio recording & sends it*/
function stopAudioRecording() {

    console.log("Stopping Audio Recording...");

    audioRecorder.ondataavailable = function(e) {
        audioBlobs.push(e.data);
    }

    //stop the recording using the audio recording API
    audioRecorder.stop()
        .then(audioAsblob => {

            //Play recorder audio
            playAudio(audioAsblob);

            recordedBlob = audioAsblob;

            //hide recording control button & return record icon
            handleHidingRecordingControlButtonsShowSend();
        })
        .catch(error => {
            //Error handling structure
            switch (error.name) {
                case 'InvalidStateError': //error from the MediaRecorder.stop
                    console.log("An InvalidStateError has occured.");
                    break;
                default:
                    console.log("An error occured with the error name " + error.name);
            };
        });
}

/** Cancel the currently started audio recording */
function cancelAudioRecording() {
    console.log("Canceling audio...");

    //cancel the recording using the audio recording API
    audioRecorder.cancel();

    //hide recording control button & return record icon
    handleHidingRecordingControlButtons();
}

/** Sends the current recording to ORACLE Endpoint */
function sendAudioRecording() {
    // Check to see if recording is longer than 10 seconds
    let binary = checkIfVoiceNoteLongerThanTenSeconds()

    if (binary == 1) {
        audioRecorder.send()
    } else {
        // error message
        console.log("Voice note is not longer than 10 seconds")
        let voiceNoteHeader = document.getElementsByClassName("voice-note-header")[0]
        voiceNoteHeader.innerHTML = "<i>Record a message for the Oracle to be granted 3 questions.</i><br><br>The voice note you recorded was too short. Please record one longer than 10 seconds."
    }
    handleHindingSendButton()
}

/** Plays recorded audio using the audio element in the HTML document
 * @param {Blob} recorderAudioAsBlob - recorded audio as a Blob Object
*/
function playAudio(recorderAudioAsBlob) {

    //read content of files (Blobs) asynchronously
    let reader = new FileReader();

    //once content has been read
    reader.onload = (e) => {
        //store the base64 URL that represents the URL of the recording audio
        let base64URL = e.target.result;

        //If this is the first audio playing, create a source element
        //as pre populating the HTML with a source of empty src causes error
        if (!audioElementSource) //if its not defined create it (happens first time only)
            createSourceForAudioElement();

        //set the audio element's source using the base64 URL
        audioElementSource.src = base64URL;

        //set the type of the audio element based on the recorded audio's Blob type
        let BlobType = recorderAudioAsBlob.type.includes(";") ?
            recorderAudioAsBlob.type.substr(0, recorderAudioAsBlob.type.indexOf(';')) : recorderAudioAsBlob.type;
        audioElementSource.type = BlobType

        //call the load method as it is used to update the audio element after changing the source or other settings
        audioElement.load();

        //play the audio after successfully setting new src and type that corresponds to the recorded audio
        console.log("Playing audio...");
        audioElement.play();


    };

    //read content and convert it to a URL (base64)
    reader.readAsDataURL(recorderAudioAsBlob);
}

/** Computes the elapsed recording time since the moment the function is called in the format h:m:s*/
function handleElapsedRecordingTime() {

    elapsedTimeTag.classList.remove("hide");

    //display inital time when recording begins
    displayElapsedTimeDuringAudioRecording("00:00");

    //create an interval that compute & displays elapsed time, as well as, animate red dot - every second
    elapsedTimeTimer = setInterval(() => {
        //compute the elapsed time every second
        let elapsedTime = computeElapsedTime(audioRecordStartTime); //pass the actual record start time
        //display the elapsed time
        displayElapsedTimeDuringAudioRecording(elapsedTime);
    }, 1000); //every second
}

/** Display elapsed time during audio recording
 * @param {String} elapsedTime - elapsed time in the format mm:ss or hh:mm:ss
 */
function displayElapsedTimeDuringAudioRecording(elapsedTime) {
    //1. display the passed elapsed time as the elapsed time in the elapsedTime HTML element
    elapsedTimeTag.innerHTML = elapsedTime;

    //2. Stop the recording when the max number of hours is reached
    if (elapsedTimeReachedMaximumNumberOfHours(elapsedTime)) {
        stopAudioRecording();
    }
}

/**
 * @param {String} elapsedTime - elapsed time in the format mm:ss or hh:mm:ss
 * @returns {Boolean} whether the elapsed time reached the maximum number of hours or not
 */
function elapsedTimeReachedMaximumNumberOfHours(elapsedTime) {
    //Split the elapsed time by the symbo :
    let elapsedTimeSplitted = elapsedTime.split(":");

    //Turn the maximum recording time in hours to a string and pad it with zero if less than 10
    let maximumRecordingTimeInHoursAsString = maximumRecordingTimeInHours < 10 ? "0" + maximumRecordingTimeInHours : maximumRecordingTimeInHours.toString();

    //if it the elapsed time reach hours and also reach the maximum recording time in hours return true
    if (elapsedTimeSplitted.length === 3 && elapsedTimeSplitted[0] === maximumRecordingTimeInHoursAsString)
        return true;
    else //otherwise, return false
        return false;
}

/** Computes the elapsedTime since the moment the function is called in the format mm:ss or hh:mm:ss
 * @param {String} startTime - start time to compute the elapsed time since
 * @returns {String} elapsed time in mm:ss format or hh:mm:ss format, if elapsed hours are 0.
 */
function computeElapsedTime(startTime) {
    //record end time
    let endTime = new Date();

    //time difference in ms
    let timeDiff = endTime - startTime;

    //convert time difference from ms to seconds
    timeDiff = timeDiff / 1000;

    //extract integer seconds that dont form a minute using %
    let seconds = Math.floor(timeDiff % 60); //ignoring uncomplete seconds (floor)

    //pad seconds with a zero if neccessary
    seconds = seconds < 10 ? "0" + seconds : seconds;

    //convert time difference from seconds to minutes using %
    timeDiff = Math.floor(timeDiff / 60);

    //extract integer minutes that don't form an hour using %
    let minutes = timeDiff % 60; //no need to floor possible incomplete minutes, becase they've been handled as seconds
    minutes = minutes < 10 ? "0" + minutes : minutes;

    //convert time difference from minutes to hours
    timeDiff = Math.floor(timeDiff / 60);

    //extract integer hours that don't form a day using %
    let hours = timeDiff % 24; //no need to floor possible incomplete hours, becase they've been handled as seconds

    //convert time difference from hours to days
    timeDiff = Math.floor(timeDiff / 24);

    // the rest of timeDiff is number of days
    let days = timeDiff; //add days to hours

    let totalHours = hours + (days * 24);
    totalHours = totalHours < 10 ? "0" + totalHours : totalHours;

    if (totalHours === "00") {
        return minutes + ":" + seconds;
    } else {
        return totalHours + ":" + minutes + ":" + seconds;
    }
}

// audio-recording.js ---------------
//API to handle audio recording

var audioRecorder = {
    /** Stores the recorded audio as Blob objects of audio data as the recording continues*/
    audioBlobs: [],/*of type Blob[]*/
    /** Stores the reference of the MediaRecorder instance that handles the MediaStream when recording starts*/
    mediaRecorder: null, /*of type MediaRecorder*/
    /** Stores the reference to the stream currently capturing the audio*/
    streamBeingCaptured: null, /*of type MediaStream*/
    /** Start recording the audio
     * @returns {Promise} - returns a promise that resolves if audio recording successfully started
     */
    start: function () {
        //Feature Detection
        if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
            //Feature is not supported in browser
            //return a custom error
            return Promise.reject(new Error('mediaDevices API or getUserMedia method is not supported in this browser.'));
        }

        else {
            //Feature is supported in browser

            //create an audio stream
            return navigator.mediaDevices.getUserMedia({ audio: true }/*of type MediaStreamConstraints*/)
                //returns a promise that resolves to the audio stream
                .then(stream /*of type MediaStream*/ => {

                    //save the reference of the stream to be able to stop it when necessary
                    audioRecorder.streamBeingCaptured = stream;

                    //create a media recorder instance by passing that stream into the MediaRecorder constructor
                    audioRecorder.mediaRecorder = new MediaRecorder(stream); /*the MediaRecorder interface of the MediaStream Recording
                    API provides functionality to easily record media*/

                    //clear previously saved audio Blobs, if any
                    audioRecorder.audioBlobs = [];

                    //add a dataavailable event listener in order to store the audio data Blobs when recording
                    audioRecorder.mediaRecorder.addEventListener("dataavailable", event => {
                        //store audio Blob object
                        audioRecorder.audioBlobs.push(event.data);
                    });

                    //start the recording by calling the start method on the media recorder
                    audioRecorder.mediaRecorder.start();
                });

            /* errors are not handled in the API because if its handled and the promise is chained, the .then after the catch will be executed*/
        }
    },
    /** Stop the started audio recording
     * @returns {Promise} - returns a promise that resolves to the audio as a blob file
     */
    stop: function () {
        //return a promise that would return the blob or URL of the recording
        return new Promise(resolve => {
            //save audio type to pass to set the Blob type
            let mimeType = audioRecorder.mediaRecorder.mimeType;

            //listen to the stop event in order to create & return a single Blob object
            audioRecorder.mediaRecorder.addEventListener("stop", () => {
                //create a single blob object, as we might have gathered a few Blob objects that needs to be joined as one
                let audioBlob = new Blob(audioRecorder.audioBlobs, { type: "audio/webm" });

                //resolve promise with the single audio blob representing the recorded audio
                resolve(audioBlob);
            });
            audioRecorder.cancel();
        });
    },
    /** Cancel audio recording*/
    cancel: function () {
        //stop the recording feature
        audioRecorder.mediaRecorder.stop();

        //stop all the tracks on the active stream in order to stop the stream
        audioRecorder.stopStream();

        //reset API properties for next recording
        audioRecorder.resetRecordingProperties();
    },
    /** Sends audio recording to ORACLE endpoint*/
    send: function () {

        if (audioRecorder.audioBlobs.length === 0) {
            console.log("No audio recorded to send");
            return;
        }

        console.log("Sending audio...")

        const formData = new FormData();

        formData.append('file', new File(audioRecorder.audioBlobs, 'recording.wav'));

        // console.log(formData);
        // consoleDiv.innerHTML = JSON.stringify(formData)

        fetch(`${productionURL}/upload/${bookID}/${user_cave}/${scenario_id}/`, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
              consoleDiv.innerHTML = 'Network response was not ok'
              throw new Error('Network response was not ok');
            }

            return response.json();
        })
        .then(data => {
            console.log('Server response:', data);
            consoleDiv.innerHTML = JSON.stringify(data)
            var binary = interactionCalculator(data);

            update_DOM(data["gpt response"], "Oracle:");
        })

    },
    /** Stop all the tracks on the active stream in order to stop the stream and remove
     * the red flashing dot showing in the tab
     */
    stopStream: function () {
        //stopping the capturing request by stopping all the tracks on the active stream
        audioRecorder.streamBeingCaptured.getTracks() //get all tracks from the stream
            .forEach(track /*of type MediaStreamTrack*/ => track.stop()); //stop each one
    },
    /** Reset all the recording properties including the media recorder and stream being captured*/
    resetRecordingProperties: function () {
        audioRecorder.mediaRecorder = null;
        audioRecorder.streamBeingCaptured = null;

        /*No need to remove event listeners attached to mediaRecorder as
        If a DOM element which is removed is reference-free (no references pointing to it), the element itself is picked
        up by the garbage collector as well as any event handlers/listeners associated with it.
        getEventListeners(audioRecorder.mediaRecorder) will return an empty array of events.*/
    }
}