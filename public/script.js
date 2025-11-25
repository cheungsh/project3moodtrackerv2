const today = new Date();
const hourNow = today.getHours();
const minNow = today.getMinutes();
const secNow = today.getSeconds();
const triggerButtons = document.querySelectorAll('.triggerButton');

/* ---------- User Name ----------*/
const userName = document.getElementById("nameResult");
const infoContainer = document.querySelector(".collectInfoForm");

if (typeof(Storage) !== "undefined") {
  userName.innerHTML = localStorage.getItem("name") || "";
} else {
  userName.innerHTML = "Sorry, your browser does not support local storage.";
}

const checkForm = () => {
  const enteredName = document.getElementById("name").value.trim();
  if (enteredName) {
    userName.innerHTML = enteredName;
    localStorage.setItem("name", enteredName);
    infoContainer.style.display = "none";
  }
};

//Hide form if name already stored
infoContainer.style.display = userName.innerHTML === "" ? "block" : "none";

/* ---------- Greeting ----------*/
const timeOfDay = document.getElementById("timeofday");
let greeting = "Good Morning";
if (hourNow >= 18 || hourNow < 5) greeting = "Good Evening";
else if (hourNow >= 12) greeting = "Good Afternoon";
timeOfDay.innerHTML = greeting;

/* ---------- Mood ----------*/
function openMood(evt, moodName) {
    var i, moodcontent, moodlink;
    moodcontent = document.getElementsByClassName("moodContent");
    
    for (i = 0; i < moodcontent.length; i++) {
        moodcontent[i].style.display = "none";
    }
    moodlink = document.getElementsByClassName("moodLink");
    for (i = 0; i < moodlink.length; i++) {
        moodlink[i].className = moodlink[i].className.replace(" active", "");
    }
    document.getElementById(moodName).style.display = "block";
    evt.currentTarget.className += " active";
}

const emojis = [
    "emoji/calmEmoji.png",
    "emoji/chillEmoji.png",
    "emoji/happyEmoji.png",
    "emoji/excitedEmoji.png",
    "emoji/boredEmoji.png",
    "emoji/worriedEmoji.png",
    "emoji/sadEmoji.png",
    "emoji/frustratedEmoji.png",
    "emoji/angryEmoji.png"
];

const backgroundColors = [
  "rgba(202, 192, 211, 0.6)",
  "rgba(210, 204, 202, 0.6)",
  "rgba(199, 163, 167, 0.6)",
  "rgba(198, 216, 239, 0.6)",
  "rgba(171, 119, 129, 0.6)",
  "rgba(175, 169, 205, 0.6)",
  "rgba(97, 90, 121, 0.6)",
  "rgba(171, 118, 150, 0.6)",
  "rgba(151, 98, 111, 0.6)"
];

const buttonColors = [
  "rgba(202, 192, 211)",
  "rgba(210, 204, 202)",
  "rgba(199, 163, 167)",
  "rgba(198, 216, 239)",
  "rgba(171, 119, 129)",
  "rgba(175, 169, 205)",
  "rgba(97, 90, 121)",
  "rgba(171, 118, 150)",
  "rgba(151, 98, 111)"
];

const moodLabels = [
  "Calm", "Chill", "Happy", "Excited", "Bored", "Worried", "Sad", "Frustrated", "Angry"
];


const m1background = document.getElementById("m1");
const emojiGallerySlide = document.getElementById("emojiGallerySlide");
const moodbutton = document.getElementById("moodButton");
const moodcomment = document.getElementById("moodComment");

emojis.forEach((src, index) => {
  const img = document.createElement("img");
  img.src = src;
  img.alt = moodLabels[index];
  if(index === 0) img.classList.add("selected"); 
  img.addEventListener("click", () => selectEmoji(index));
  emojiGallerySlide.appendChild(img);
});

function selectEmoji(selectedIndex) {
  const allEmojis = emojiGallerySlide.querySelectorAll("img");
  allEmojis.forEach((img, i) => {
    if (i === selectedIndex) {
      img.classList.add("selected");
      m1background.style.backgroundColor = backgroundColors[i];
      moodcomment.innerHTML = moodLabels[i];
      moodbutton.style.backgroundColor = buttonColors[i];
    } else {
      img.classList.remove("selected");
    }
  });
}

/* ---------- Mood Chart ----------*/
const ctx = document.getElementById("moodChart");
const currentMonth = new Date().getMonth();
const lastSavedMonth = parseInt(localStorage.getItem("moodChartMonth"));

// Refresh chart every month
if (lastSavedMonth !== currentMonth) {
    moodLabels.forEach(label => localStorage.setItem(`${label}ChartData`, 0));
    localStorage.setItem("moodChartMonth", currentMonth);
}

const chartData = moodLabels.map(
  label => parseInt(localStorage.getItem(`${label}ChartData`)) || 0
);

/* Start of Code https://www.w3schools.com/ai/ai_chartjs.asp */
let chartTextColor = '#414141';

const myChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: moodLabels,
    datasets: [{
      label: '# of Emotions',
      data: chartData,
      backgroundColor: buttonColors,
      borderWidth: 3
    }]
  },
  options: {
    legend: {
      position: 'bottom',
      labels: {
        fontSize: 16,
        FontFacet: 'Open Sans',
        fontColor: chartTextColor,
        padding: 10,
        boxWidth: 15
      }
    }
  }
});

/* End of Code https://www.w3schools.com/ai/ai_chartjs.asp */

/* ---------- Recorded Days ----------*/
const counterElement = document.getElementById("recordedDayCounter");
let recordedDayCounter = parseInt(localStorage.getItem("recordedDayCounter")) || 0;
counterElement.innerHTML = recordedDayCounter;

/* ---------- Submit Mood ----------*/
function submitMood() {
  const selectedMood = moodcomment.innerHTML;
  const name = localStorage.getItem("name") || "Anonymous";

  /* ---------- Recorded Days Counter ----------*/
  const todayString = new Date().toDateString();
  const lastRecorded = localStorage.getItem("lastRecordedDate");
  
  if (lastRecorded !== todayString) {
    recordedDayCounter++;
    localStorage.setItem("recordedDayCounter", recordedDayCounter);
    localStorage.setItem("lastRecordedDate", todayString);
  }
  counterElement.innerHTML = recordedDayCounter;
  
  const moodIndex = moodLabels.indexOf(selectedMood);
  if (moodIndex !== -1) {
    myChart.data.datasets[0].data[moodIndex]++;
    localStorage.setItem(`${selectedMood}ChartData`, myChart.data.datasets[0].data[moodIndex]);
    myChart.update();
  }
}

/* ---------- Triggers ----------*/
document.querySelectorAll('.accordionHeader').forEach(header => {
  header.addEventListener('click', () => {
    const content = header.nextElementSibling;
    content.classList.toggle('active');
    header.classList.toggle('active');
  });
});

const triggers = {
  sleepStart: null,
  sleepEnd: null,
  sleepHours: 0,
  exercise: [],
  hobby: [],
  meal: [],
  social: [],
  weather: [],
  period: false
};

// Sleep inputs
const sleepStartEl = document.getElementById('sleepStart');
const sleepEndEl = document.getElementById('sleepEnd');
const sleepDateEl = document.getElementById('sleepDateStart');

sleepStartEl.addEventListener('change', () => updateSleep());
sleepEndEl.addEventListener('change', () => updateSleep());
sleepDateEl.addEventListener('change', () => updateSleep());

function updateSleep() {
  const date = sleepDateEl.value;
  const start = sleepStartEl.value;
  const end = sleepEndEl.value;

  if (date && start && end) {
    const startDateTime = new Date(`${date}T${start}:00Z`);
    const endDateTime = new Date(`${date}T${end}:00Z`);

    triggers.sleepStart = startDateTime;
    triggers.sleepEnd = endDateTime;

    let diff = (endDateTime - startDateTime) / (1000 * 60 * 60);
    if (diff < 0) diff += 24;
    triggers.sleepHours = diff;
  }
}

// Trigger buttons
document.querySelectorAll('.triggerButton').forEach(btn => {
  btn.addEventListener('click', e => {
    const { type, value } = e.currentTarget.dataset;

    // Toggle the value in the array
    const index = triggers[type].indexOf(value);

    if (index === -1) {
      triggers[type].push(value);
      e.currentTarget.classList.add('active');
    } else {
      triggers[type].splice(index, 1);
      e.currentTarget.classList.remove('active');
    }
  });
});

// Period toggle
const periodToggle = document.getElementById('periodToggle');
if (periodToggle) periodToggle.addEventListener('change', e => triggers.period = e.target.checked);

/* ---------- Gather Data for Backend Send ----------*/
moodbutton.addEventListener('click', async () => {
  showLoader();

  const selectedMood = moodcomment.innerText;
  const name = localStorage.getItem('name') || 'Anonymous';
  const { sleepHours, exercise, hobby, meal, social, weather, period } = triggers;

  // For user feedback: show a loading state while awaiting Gemini suggestion
  document.getElementById('suggestionText').innerText = "Generating...";

  // Save mood entry locally
  submitMood();

  // Send all data to backend and use AI suggestion from the response
  await sendMoodData({
    name,
    moodValue: selectedMood,
    ...triggers,
    streak: recordedDayCounter
  });
  // Return to statistics tab after submit
  showSection('statistics');

  // Clear all previous selections for next submission
  triggerButtons.forEach(btn => btn.classList.remove('active'));
  Object.keys(triggers).forEach(key => {
    if (Array.isArray(triggers[key])) triggers[key] = [];
    if (typeof triggers[key] === 'boolean') triggers[key] = false;
    if (key === 'period' && periodToggle) periodToggle.checked = false;
    if (key === 'sleepHours' || key === 'sleepStart' || key === 'sleepEnd') triggers[key] = null;
  });

  // Reset sleep inputs
  sleepStartEl.value = '';
  sleepEndEl.value = '';
  sleepDateEl.value = '';

  // Reset mood selection to default
  const allEmojis = emojiGallerySlide.querySelectorAll('img');
  allEmojis.forEach((img, i) => img.classList.toggle('selected', i === 0));
  m1background.style.backgroundColor = backgroundColors[0];
  moodcomment.innerHTML = moodLabels[0];
  moodbutton.style.backgroundColor = buttonColors[0];

});

/* ---------- Log Section Back Button ----------*/
document.getElementById('backToStatsBtn').addEventListener('click', function() {
  showSection('statistics');
});

/* ---------- Send Data to Backend ----------*/
async function sendMoodData(data) {
  try {
    const response = await fetch('/mood', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (response.ok) {
      const respData = await response.json();
      if (respData.suggestions) {
        document.getElementById('suggestionText').innerText = respData.suggestions;
      } else {
        document.getElementById('suggestionText').innerText = "Sorry, no suggestions available.";
      }
      console.log('Mood data saved to MongoDB.');
    } else {
      document.getElementById('suggestionText').innerText = "Failed to get suggestion, try again.";
      console.error('Failed to save mood data.');
    }
  } catch (err) {
    document.getElementById('suggestionText').innerText = "Error connecting to server.";
    console.error('Error sending mood data:', err);
  }
  hideLoader();
}

/* ---------- Bottom Navbar ----------*/
const tabSections = {
  statistics: document.getElementById('statisticsSection'),
  log: document.getElementById('logSection'),
  profile: document.getElementById('profileSection'),
};

const navButtons = document.querySelectorAll('.bottomNav .navBtn');
const bottomNav = document.querySelector('.bottomNav');
const moodButtonNav = document.getElementById('moodButtonNav');

// Switch + Hide bottom nav
function showSection(section) {
  Object.entries(tabSections).forEach(([key, el]) => {
    el.style.display = (key === section) ? 'block' : 'none';
  });

  navButtons.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-section') === section);
  });

  // Hide bottom nav on log tab, show otherwise
  if (section === 'log') {
    bottomNav.style.display = 'none';
    moodButtonNav.style.display = 'flex';
  } else {
    bottomNav.style.display = 'flex';
    moodButtonNav.style.display = 'none';
  }
}

// Nav button click listeners
navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-section');
    showSection(target);
  });
});

// On startup: show statistics tab, hide moodButton, show bottom nav
window.addEventListener('DOMContentLoaded', () => {
  showSection('statistics');
});

/*-------------------Dark Mode---------------------*/
let bdy = document.body;
let mode = "light";

//check if browser has storage
if (typeof (Storage) !== "undefined") {
    //do we have a value already?
    if (localStorage.hasOwnProperty("mode")) {
        //retrieve
        if (localStorage.getItem("mode") == "dark") {
            mode = localStorage.getItem("mode");
            bdy.classList.toggle("dark-mode");
        }
    } else {
        console.log("nothing stored");
    }
}

if (mode === "dark") {
    bdy.classList.add("dark-mode");
    updateChartForDarkMode(true);
} else {
    updateChartForDarkMode(false);
}

function updateChartForDarkMode(isDark) {
    chartTextColor = isDark ? '#ffffff' : '#414141';
    if (myChart && myChart.options && myChart.options.legend && myChart.options.legend.labels) {
        myChart.options.legend.labels.fontColor = chartTextColor;
        myChart.update();
    }
}

function toggle() {
    bdy.classList.toggle("dark-mode");
    mode = bdy.classList.contains("dark-mode") ? "dark" : "light";
    localStorage.setItem("mode", mode);
    updateChartForDarkMode(mode === "dark");
}

/*-------------------Loading Screen---------------------*/
const loaderContainer = document.getElementById("loaderContainer");

function showLoader() {
  loaderContainer.style.display = "flex";
  triggerButtons.forEach(btn => btn.disabled = false);
  moodbutton.disabled = true;
}

function hideLoader() {
  loaderContainer.style.display = "none";
  triggerButtons.forEach(btn => btn.disabled = false);
  moodbutton.disabled = false;
}


/*-------------------Emotional Recognition---------------------*/
let capture;
let captureWidth = 640;
let captureHeight = 480;
let faceapi;
let detections = [];
let emotions = ["neutral", "happy", "sad", "angry", "fearful", "disgusted", "surprised"];
let moodStarted = false;
let canvasRef = null;

const checkMoodBtn = document.getElementById("checkMoodBtn");
const checkMoodBackBtn = document.getElementById("checkMoodBackBtn");
const moodModal = document.getElementById("moodModal");
const canvasContainer = document.getElementById("canvasContainer");

checkMoodBtn.addEventListener("click", () => {
  openMoodModal();
});
checkMoodBackBtn.addEventListener("click", () => {
  closeMoodModal();
});

function openMoodModal() {
  moodModal.style.display = "flex";
  moodModal.setAttribute("aria-hidden", "false");

  if (!moodStarted) {
    startMoodCheck();
    moodStarted = true;
  } else {
    loop(); // resume draw loop if already started
  }

  // Resize pixel canvas to match CSS container width after modal is visible
  setTimeout(resizeCanvasToContainer, 0);
}

function closeMoodModal() {
  moodModal.style.display = "none";
  moodModal.setAttribute("aria-hidden", "true");
  noLoop();

  // Stop webcam tracks and clean up capture
  if (capture && capture.elt && capture.elt.srcObject) {
    const tracks = capture.elt.srcObject.getTracks();
    tracks.forEach(t => t.stop());
  }
  if (capture) {
    capture.remove();
    capture = null;
  }

  clear();
  moodStarted = false;
}

function setup() {
  pixelDensity(1); // prevent HiDPI scaling issues
  canvasRef = createCanvas(captureWidth, captureHeight);
  canvasRef.parent("canvasContainer");
  noLoop();

  // Initialize webcam capture after p5 is ready
  capture = createCapture(VIDEO, () => {});
  capture.size(captureWidth, captureHeight);
  capture.hide(); // hide default video element to control display via canvas
}

function startMoodCheck() {
  if (!capture) return;

  capture.elt.onloadeddata = () => {
    const faceOptions = {
      withLandmarks: true,
      withExpressions: true,
      withDescriptors: false,
    };
    faceapi = ml5.faceApi(capture, faceOptions, () => {
      faceapi.detect(gotFaces);
      loop(); // start draw loop
    });
  };
}

function gotFaces(error, result) {
  if (error) {
    console.error(error);
    return;
  }
  detections = result || [];
  if (faceapi) faceapi.detect(gotFaces);
}

function draw() {
  if (!moodStarted) return;

  background(0);
  if (capture) {
    image(capture, 0, 0, width, height);
  }

  push();
  fill('limegreen');
  stroke('limegreen');
  strokeWeight(1);

  if (detections.length > 0) {
    for (let i = 0; i < detections.length; i++) {
      const d = detections[i];

      // Draw facial landmarks
      const points = d.landmarks.positions;
      for (let j = 0; j < points.length; j++) {
        const pt = points[j];
        circle(pt._x, pt._y, 5);
      }

      // Draw emotion bars
      noStroke();
      fill(255);
      textSize(14);
      let startY = 30;
      let startX = 40;
      for (let k = 0; k < emotions.length; k++) {
        const emo = emotions[k];
        const val = d.expressions[emo] || 0;
        fill(255);
        text(`${emo}: ${nf(val, 1, 2)}`, startX, startY + 30 * k);
        fill('limegreen');
        rect(startX, startY + 30 * k + 6, val * 120, 10);
      }
    }
  }

  pop();
}
function resizeCanvasToContainer() {
  const container = document.getElementById("canvasContainer");
  if (!container) return;

  const displayW = container.clientWidth;
  const aspect = captureWidth / captureHeight;
  const displayH = Math.round(displayW / aspect);

  resizeCanvas(displayW, displayH);

  if (capture) capture.size(displayW, displayH);
}

function windowResized() {
  if (moodModal.style.display === "flex") {
    resizeCanvasToContainer();
  }
}
