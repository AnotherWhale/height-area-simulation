document
  .getElementById("startSimulation")
  .addEventListener("click", function () {
    const input = document.getElementById("heightArray").value;
    const speed = reverseSpeed(
      parseInt(document.getElementById("speedRange").value, 10)
    );

    // Split the input by commas and trim any extra spaces, while filtering out empty strings
    const height = input
      .split(",")
      .map((x) => x.trim())
      .filter((x) => x !== "")
      .map(Number);

    // Validate if all the entries are numbers and if the length is greater than 1
    if (height.length < 2 || height.some(isNaN)) {
      alert("Please enter a valid array of numbers (at least two).");
      return;
    }

    document.getElementById("result").textContent = "";
    startSimulation(height, speed);
  });

// Reverse the speed value from slider (5-1000) to delay (1000-5)
function reverseSpeed(sliderValue) {
  return 1005 - sliderValue;
}

function startSimulation(height, speed) {
  const graph = document.getElementById("graph");
  graph.innerHTML = "";

  const maxHeight = Math.max(...height); // Find the maximum height in the array
  const maxPixelHeight = window.innerHeight * 0.6; // Scale the graph to 60% of the screen height

  // Create bars for the graph and scale them based on the maximum height
  height.forEach((h) => {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    const scaledHeight = (h / maxHeight) * maxPixelHeight; // Scale height based on max
    bar.style.height = `${scaledHeight}px`; // Set scaled height
    graph.appendChild(bar);
  });

  let pl = 0;
  let pr = height.length - 1;
  let bestArea = 0;
  let bestLeft = pl;
  let bestRight = pr;

  const findArea = (i1, i2, h1, h2) => {
    const length = i2 - i1;
    const minHeight = Math.min(h1, h2);
    return length * minHeight;
  };

  function updateBars(left, right) {
    const bars = document.getElementsByClassName("bar");
    // Clear all previous highlights
    for (let i = 0; i < bars.length; i++) {
      bars[i].classList.remove("highlight");
    }
    // Highlight only the current left and right pointers
    bars[left].classList.add("highlight");
    bars[right].classList.add("highlight");
  }

  function showMaxArea(left, right, area) {
    const bars = document.getElementsByClassName("bar");
    const leftBar = bars[left];
    const rightBar = bars[right];
    const graphContainer = document.getElementById("graph");

    // Clear all highlights first
    for (let i = 0; i < bars.length; i++) {
      bars[i].classList.remove("highlight");
    }

    // Highlight only the two bars forming the optimal container
    leftBar.classList.add("highlight");
    rightBar.classList.add("highlight");

    // Calculate and show the semi-transparent rectangle
    const leftPos = leftBar.offsetLeft;
    const rightPos = rightBar.offsetLeft + rightBar.offsetWidth;
    const maxHeight = Math.min(leftBar.offsetHeight, rightBar.offsetHeight);

    const areaBox = document.createElement("div");
    areaBox.id = "max-area";
    areaBox.style.left = `${leftPos}px`;
    areaBox.style.width = `${rightPos - leftPos}px`;
    areaBox.style.height = `${maxHeight}px`;

    graphContainer.appendChild(areaBox);

    document.getElementById("result").textContent = `Max Area: ${area}`;
  }

  function nextIteration() {
    if (pl >= pr) {
      showMaxArea(bestLeft, bestRight, bestArea);
      return;
    }

    updateBars(pl, pr);

    let curArea = findArea(pl, pr, height[pl], height[pr]);
    if (curArea > bestArea) {
      bestArea = curArea;
      bestLeft = pl;
      bestRight = pr;
    }

    if (height[pl] < height[pr]) {
      pl++;
    } else {
      pr--;
    }

    // Use the reversed slider value for the delay
    setTimeout(nextIteration, speed);
  }

  nextIteration();
}
