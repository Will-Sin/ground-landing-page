document.addEventListener("DOMContentLoaded", function() {
  const setInputFieldsReadonly = () => {
    inputFields.forEach(inputField => {
      inputField.readOnly = true;
    });
  };

  const filterDropdownOptions = (inputField, dropdownArray) => {
    const inputValue = inputField.value.toLowerCase();

    dropdownArray.forEach(item => {
      const itemText = item.textContent.toLowerCase();
      const startsWithInputValue = itemText.startsWith(inputValue);

      item.classList.toggle('closed', inputValue.length > 0 && !startsWithInputValue);
    });
  };

  const closeDropdown = (inputField, dropdown) => {
    const index = Array.from(inputFields).indexOf(inputField);
    inputField.placeholder = placeholders[index];
    dropdown.classList.remove('open');
    if (inputField.value === '') {
      inputField.placeholder = placeholders[index];
    }
  };

  const attachInputFieldListeners = (inputField, dropdown, dropdownArray) => {
    inputField.addEventListener('input', () => {
      dropdown.classList.add('open');
      filterDropdownOptions(inputField, dropdownArray);
    });

    dropdownArray.forEach(item => {
      item.addEventListener('click', evt => {
        inputField.value = item.textContent;
        dropdownArray.forEach(dropdownItem => {
          dropdownItem.classList.add('closed');
        });
        closeDropdown(inputField, dropdown);
      });
    });

    inputField.addEventListener('focus', () => {
      dropdown.classList.add('open');
      dropdownArray.forEach(dropdownItem => {
        dropdownItem.classList.remove('closed');
      });
    });

    inputField.addEventListener('blur', () => {
      closeDropdown(inputField, dropdown);
    });

    document.addEventListener('click', evt => {
      const isDropdown = dropdown.contains(evt.target);
      const isInput = inputField.contains(evt.target);
      if (!isDropdown && !isInput) {
        closeDropdown(inputField, dropdown);
      }
    });
  };

  const initializeDropdowns = () => {
    const inputFields = document.querySelectorAll('.chosen-value');
    const dropdowns = document.querySelectorAll('.chosen-value + .value-list');
    const placeholders = ['CAVE SELECT', 'SCENARIO SELECT'];

    dropdowns.forEach((dropdown, index) => {
      const inputField = inputFields[index];
      const dropdownArray = Array.from(dropdown.querySelectorAll('li'));

      setInputFieldsReadonly();
      attachInputFieldListeners(inputField, dropdown, dropdownArray);
    });
  };

  initializeDropdowns();
});


// Script to dynamically create an ellipse based on the text it recieves. 
document.addEventListener("DOMContentLoaded", function() {
  const box = document.querySelector('.box');
  const iTag = document.querySelector('i');
  const pTag = document.getElementById('oracle-response');
  const boxHeight = document.offsetHeight;
  const iWidth = iTag.offsetWidth;
  var counter = 0;

  const setBoxHeight = () => {
    box.height = '1000px !important';
    adjustBoxHeight();
  };

  function WordCount(str) {
    return str.split(" ").length;
  }

  function adjustBoxHeight() {
    box.width = `${WordCount(pTag.innerHTML) * 5}px`;
    console.log(box.width)

    compareHeights();
    adjustHeightIfShort();
  }

  function compareHeights() {
    const iHeight = iTag.offsetHeight;
    const pHeight = pTag.offsetHeight;

    if (iHeight > pHeight * 1.1 && counter !== 500) {
      console.log("Frame too tall");
      console.log(pHeight);
      console.log(iHeight);
      box.height = `${iHeight - 2}px`;
      counter++;
      compareHeights(); // Recursively call compareHeights()
    }
  }

  function adjustHeightIfShort() {
    const iHeight = iTag.offsetHeight;
    const pHeight = pTag.offsetHeight;

    if (iHeight < pHeight) {
      console.log("Frame too short");
      console.log(pHeight);
      console.log(iHeight);
      box.height = `${iHeight + 2}px`;
      adjustHeightIfShort(); // Recursively call adjustHeightIfShort()
    }
  }

  //Function that can be used to call the main function.
  function updateBoxHeight() {
    setBoxHeight();
  }

  // Call updateBoxHeight when the h4 header is updated
  const h4Header = document.getElementById('oracle-response');
  h4Header.addEventListener('input', updateBoxHeight);
});


function checkWindowSize() {
  var windowWidth = window.innerWidth;

  // Check if the window width is less than 1280 pixels
  if (windowWidth < 1280) {
    // Perform your desired action here
    console.log('Window width is less than 1280 pixels');
    
    const messageBoxSpace = document.querySelectorAll(".mobile-spacer-remove");
    const footerURL = document.querySelectorAll(".footer-text");

    console.log("hi");
    messageBoxSpace.forEach(function (spacer) {
      spacer.classList.add("hide");
    });

    footerURL.forEach(function (spacer) {
      spacer.classList.add("hide");
    });
  }
}

// Call the function on page load
window.onload = function () {
  checkWindowSize();
};

// Call the function when the window is resized
window.onresize = function () {
  checkWindowSize();
};


/*
const backgroundURL = "images/Backgrounds/";

// List of background images with the "Background-X-Y" format, where X represents the layer and Y represents the .
const backgrounds = [
  `${backgroundURL}Background-0-1.png`,
  `${backgroundURL}Background-0-2.png`,
  `${backgroundURL}Background-1-1.png`,
  `${backgroundURL}Background-1-2.png`,
  `${backgroundURL}Background-1-3.png`,
  `${backgroundURL}Background-1-4.png`,
  `${backgroundURL}Background-1-5.png`,
  `${backgroundURL}Background-1-6.png`,
  `${backgroundURL}Background-2-1.png`,
  `${backgroundURL}Background-2-2.png`,
  `${backgroundURL}Background-2-3.png`
  // Add more background images here..
];

let currentBackground1 = 0;
let currentBackground2 = 0;
let currentBackground3 = 0;

function changeBackground1() {
  const backgroundContainer = document.getElementByClassName("layer-0");

  if (Math.random() < 0.25) {
    backgroundContainer.style.backgroundImage = "none"; // Show a blank background
  } else {
    backgroundContainer.style.backgroundImage = `url('${backgrounds[currentBackground1]}')`;
  }
  currentBackground1 = (currentBackground1 + 1) % 2; // Loop between 0 and 1
}

function changeBackground2() {
  const backgroundContainer = document.getElementByClassName("layer-1");

  if (Math.random() < 0.25) {
    backgroundContainer.style.backgroundImage = "none"; // Show a blank background
  } else {
    backgroundContainer.style.backgroundImage = `url('${backgrounds[currentBackground2 + 2]}')`;
  }
  currentBackground2 = (currentBackground2 + 1) % 4; // Loop between 0 and 3
}

function changeBackground3() {
  const backgroundContainer = document.getElementByClassName("layer-2");

  if (Math.random() < 0.25) {
    backgroundContainer.style.backgroundImage = "none"; // Show a blank background
  } else {
    backgroundContainer.style.backgroundImage = `url('${backgrounds[currentBackground3 + 6]}')`;
  }
  currentBackground3 = (currentBackground3 + 1) % 3; // Loop between 0 and 2
}

function getRandomInterval() {
  // Generate a random interval between 4 and 10 seconds
  return Math.floor(Math.random() * 7000) + 4000;
}

// Start the loops with random intervals
setInterval(changeBackground1, getRandomInterval());
setInterval(changeBackground2, getRandomInterval());
setInterval(changeBackground3, getRandomInterval());


// Function to generate a random number within a given range
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


// Function to shuffle an array randomly
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Function to show a random set of backgrounds
function showRandomBackground() {
  const elements = document.querySelectorAll('.background-image');

   // Generate a list of layer numbers [0, 1, 2]
  const availableLayers = [0, 1, 2];

  // Shuffle the list of available layers to get a unique random selection
  shuffleArray(availableLayers);

  // Generate a random number of layers to show (1 to 3)
  const numLayersToShow = getRandomNumber(1, 3);

  // Select the first numLayersToShow layers from the shuffled list
  const selectedLayers = availableLayers.slice(0, numLayersToShow);

  // Array to hold the backgrounds to show from each layer
  const shuffledBackgrounds = [];

  // Loop through each selected layer and choose one background from that layer
  selectedLayers.forEach(layer => {
    // Filter backgrounds based on the randomly chosen layer
    const filteredBackgrounds = backgrounds.filter(background => background.includes(`Background-${layer}`));

    // Shuffle the filtered backgrounds and select the first one
    //shuffleArray(filteredBackgrounds);
    shuffledBackgrounds.push(filteredBackgrounds[0]);
  });

  console.log(`${availableLayers}`);
  console.log(`${selectedLayers}`);
  console.log(elements);

  // Apply the fade-out effect to the current backgrounds before removing them
  elements.forEach((el) => {
    el.style.opacity = '0';
  });

  // Add a small delay before showing the new set of backgrounds to ensure the fade-out effect completes
  setTimeout(() => {
    // Apply the randomly selected backgrounds to the background elements
    elements.forEach((el, index) => {
      // Get the current layer for the current element
      const layer = selectedLayers[index];
      console.log(layer);
      setTimeout(() => { 
        if (shuffledBackgrounds[index]) {
          el.style.backgroundImage = `url('${shuffledBackgrounds[index]}')`;
          el.style.opacity = '1';

          // Add appropriate class for mix blend mode based on the layer
          if (layer === 2) {
            el.classList.remove('layer-1', 'layer-0')
            el.classList.add('layer-2');
          } else if (layer === 1) {
            el.classList.remove('layer-2', 'layer-0')
            el.classList.add('layer-1');
          } else if (layer === 0) {
            el.classList.remove('layer-2', 'layer-1')
            el.classList.add('layer-0');
          }

          // Add the fade-in animation class to the element
          el.classList.add('fade-in');

        } else {
          el.style.opacity = '0';
          el.classList.remove('layer-1', 'layer-2', 'fade-in'); // Also remove the fade-in class when hiding the element
        }
      }, 500);
    });
  }, 700); // Show the new set of backgrounds after a delay (0.5 seconds) to ensure fade-out completion


  // After 7 seconds, show a new set of backgrounds
  setTimeout(showRandomBackground, 5000); // Show a new set of backgrounds after 7 seconds
}

// Start the initial background animation
showRandomBackground();
*/