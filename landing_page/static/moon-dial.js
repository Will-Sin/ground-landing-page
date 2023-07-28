function createImages() {
  const numImages = 8; // Total number of images
  const imageWidth = 40; // Width of the images
  const ellipseXSizeVW = 40; // X size of the ellipse in viewport width (vw)
  const ellipseYSizeVW = 30; // Y size of the ellipse in viewport width (vw)
  const ellipseXCenter = 200; // X center of the ellipse in pixels
  const ellipseYCenter = 200; // Y center of the ellipse in pixels

  const currentMoonPhase = calculateMoonPhase();
  var imageNumber = 2 - currentMoonPhase;
  if (imageNumber <= 0) {
          imageNumber += 8;
  }

  // Calculate the actual pixel values for the ellipse X and Y sizes based on viewport width
  const vwToPixels = vw => (vw * window.innerWidth) / 100;
  const ellipseXSize = vwToPixels(ellipseXSizeVW);
  const ellipseYSize = vwToPixels(ellipseYSizeVW);

  // Create the ellipse border
  const ellipse = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
  ellipse.setAttribute("cx", ellipseXCenter);
  ellipse.setAttribute("cy", ellipseYCenter);
  ellipse.setAttribute("rx", ellipseXSize);
  ellipse.setAttribute("ry", ellipseYSize);
  ellipse.setAttribute("fill", "none");
  ellipse.setAttribute("stroke", "black");
  ellipse.setAttribute("stroke-width", "3");
  document.querySelector("svg").appendChild(ellipse);

  // For some reason there is a null error here once i reaches 8. Doesn't effect anything but can't figure it out.
  for (let i = 0; i < numImages; i++) {
    const angle = (2 * Math.PI * i) / numImages;
    const x = ellipseXCenter + ellipseXSize * Math.cos(angle) - imageWidth / 2;
    const y = ellipseYCenter + ellipseYSize * Math.sin(angle) - imageWidth / 2;

    const imageUrl = `images/phases/moon-phase-${imageNumber}.png`;

    const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
    image.setAttributeNS("http://www.w3.org/1999/xlink", "href", imageUrl);
    image.setAttribute("width", imageWidth);
    image.setAttribute("height", imageWidth);

    const animateMotion = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "animateMotion"
    );
    animateMotion.setAttribute("begin", "0s");
    animateMotion.setAttribute("dur", "12s");
    animateMotion.setAttribute("repeatCount", "indefinite");

    const mpath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "mpath"
    );
    mpath.setAttribute("xlink:href", "#orbit");

    animateMotion.appendChild(mpath);
    image.appendChild(animateMotion);
    document.querySelector("svg").appendChild(image);

    // Position each image along the ellipse path
    image.setAttribute("x", x);
    image.setAttribute("y", y);

    // Set x and y values for the header with class "moonDialLabel" to match the position of the 3rd moon image
    if (i === 2) {
      const moonDialLabel = document.querySelector(".moonDialLabel");
      moonDialLabel.style.postition = "absolute";      
      moonDialLabel.style.top = y+"px";
      moonDialLabel.style.left = x+"px";
    }

    // Increment the imageNumber for the next iteration   
    imageNumber = (imageNumber + 1) % numImages;
    if (imageNumber === 0) {
      imageNumber = 8;
    } else {
      imageNumber = imageNumber;
    }
  }
}

// Call the function to create and position the images
createImages();



// Function to calculate the current moon phase
function calculateMoonPhase() {
  // Define the total number of moon phases
  const totalMoonPhases = 8;
  const moonCycleDays = 29.53; // Duration of a complete moon cycle in days

  // Get the current date
  const currentDate = new Date();

  // Replace with the date of the last new moon in 'YYYY-MM-DD' format
  const lastNewMoonDate = '2023-06-18';
  const [year, month, day] = lastNewMoonDate.split('-');
  const lastNewMoon = new Date(Number(year), Number(month) - 1, Number(day));

  // Calculate the number of days since the last new moon
  const daysSinceNewMoon = Math.floor((currentDate - lastNewMoon) / (1000 * 60 * 60 * 24));

  // Calculate the current moon phase
  const currentPhase = Math.floor((daysSinceNewMoon % moonCycleDays) / (moonCycleDays / totalMoonPhases)) + 1;

  // The current phase will be the 3rd circle to be added if on desktop. This logic still needs to be created to connect MoonCycles to SVGs

  return currentPhase
}

// Execute functions on page load
window.addEventListener("load", function () {
  

  console.log("Current Moon Phase:", abc);
});


