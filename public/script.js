const today = new Date();
const hourNow = today.getHours();
const minNow = today.getMinutes();
const secNow = today.getSeconds();

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
  "rgba(202, 192, 211, 0.4)",
  "rgba(210, 204, 202, 0.4)",
  "rgba(199, 163, 167, 0.4)",
  "rgba(198, 216, 239, 0.4)",
  "rgba(171, 119, 129, 0.4)",
  "rgba(175, 169, 205, 0.4)",
  "rgba(97, 90, 121, 0.4)",
  "rgba(171, 118, 150, 0.4)",
  "rgba(151, 98, 111, 0.4)"
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
const rangeslider = document.getElementById("rangeSlider");
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
      rangeslider.style.backgroundColor = ('--thumb-color', buttonColors[i]);
    } else {
      img.classList.remove("selected");
    }
  });
   rangeslider.value = selectedIndex;
}

rangeslider.addEventListener("input", () => {
  selectEmoji(parseInt(rangeslider.value));
});

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
        fontColor: '#414141',
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
  const selectedMood = moodcomment.innerText;
  const name = localStorage.getItem('name') || 'Anonymous';
  
  const { sleepHours, exercise, hobby, meal, social, weather, period } = triggers;
  let suggestion = "You’re doing great! Keep looking after yourself.";

  //Mood based suggestions
  switch (selectedMood) {
    case 'calm':
      suggestion = "You seem the be at ease right now, enjoy it.";
      break;
    case 'chill':
      suggestion = "Nice to know you're taking things easy, keep this relaxed energy going!";
      break;
    case 'happy':
      suggestion = "It's great to see you happy! Spread that joy around!";
      break;
    case 'excited':
      suggestion = "You’re buuuzzzzzing with energy. Go make the most of it!";
      break;
    case 'bored':
      suggestion = "Maybe try something new today? A fresh hobby or a walk outside could shake things up.";
      break;
    case 'worried':
      suggestion = "Thing always seem worse in our heads. Try some deep breathing or a short walk to clear your mind.";
      break;
    case 'sad':
      suggestion = "I know it's been a rough day... Be gentle with yourself. Maybe call a friend, take a little me-time or take a warm shower.";
      break;
    case 'frustrated':
      suggestion = "Ugh, frustrating day huh? Step away for a bit maybe working out or some music might help reset your mood.";
      break;
    case 'angry':
      suggestion = "Hmmm, have you tried boxing? Letting out that energy physically might be able to help cool down your anger.";
      break;
  }

  //Trigger based suggestions
  if (sleepHours && sleepHours < 6) {
    suggestion = "Looks like you didn’t get much sleep... But your body and mind need it, aim for at least 7–8 hours.";
  }

  if (exercise && exercise.length > 0) {
    suggestion = `Nice job with ${exercise.join(", ")}! Staying active really supports your mood.`;
  }

  if (hobby && hobby.length > 0) {
    suggestion = `Keep spending time on ${hobby.join(", ")}? Seems like something that will make you feel better.`;
  }

  if (meal && meal.length < 2) {
    suggestion = "Looks like you haven't eaten much today. Grab something to boost your energy!";
  }

  if (meal && meal.includes("midnight snack")) {
    suggestion = "Late-night snacking can affect your rest... Try to wrap up meals earlier when possible.";
  }

  if (social === "alone") {
    suggestion = "We all need some alone time sometimes. Just don’t forget that there're others out there waiting for you to come back.";
  } else if (["friends", "family", "partner"].includes(social)) {
    suggestion = `Nice to see you spending time with your ${social}! Social connection could really strengthen ones' emotional balance.`;
  } else if (social === "alone" && selectedMood === "sad") {
    suggestion = "Being alone is fine, but reaching out to someone can really help.";
  } else if (["friends", "family", "partner"].includes(social) && selectedMood === "frustrated") {
    suggestion = "Seems like you could use some alone time. Others seems to have drained out every last bit of your energy.";
  }

  if (weather && weather.includes("rainy") && ["sad", "worried"].includes(selectedMood)) {
    suggestion = "Rainy days can feel heavier... but maybe a warm drink and some cozy music could lift your mood.";
  }

  if (weather && weather.includes("rainy") && selectedMood === "happy") {
    suggestion = "The sound of rain makes such a nice white noise, doesn’t it?";
  }

  if (weather && weather.includes("sunny") && ["happy", "excited"].includes(selectedMood)) {
    suggestion = "Perfect weather to make the most of your good mood! Get outside and enjoy it!";
  }

  if (weather && weather.includes("snowy")) {
    suggestion = "Brrr… it's so cold outside! A nice cup of hot chocolate might help warm you up.";
  }

  if (period === true && ["sad", "frustrated", "angry"].includes(selectedMood)) {
    suggestion = "Take it easy today, rest, hydrate, and be kind to yourself. Hang in there girl!";
  }

  //Combination conditions
  if (selectedMood === "bored" && (!hobby || hobby.length === 0)) {
    suggestion = "Feeling bored? Maybe pick something from the hobbies section and try it out, it might end up better than you think.";
  }

  if (selectedMood === "angry" && (!exercise || exercise.length === 0)) {
    suggestion = "Channel that anger into action. Go for a walk, run, or just move around can really help.";
  }

  if (selectedMood === "sad" && social === "alone") {
    suggestion = "You don’t have to go through it alone if you don't want to, try reaching out to someone can really help.";
  }

  if (selectedMood === "excited" && weather && weather.includes("sunny")) {
    suggestion = "Sunshine + excitement = perfect combo. Go make a memory today!";
  }

  // Display the suggestion text
  document.getElementById('suggestionText').innerText = suggestion;

  // Save mood entry
  submitMood();

  // Send all data to backend
  await sendMoodData({
    name,moodValue: selectedMood,...triggers, suggestions: suggestion, streak: recordedDayCounter
  });
});


/* ---------- Send Data to Backend ----------*/
async function sendMoodData(data) {
  try {
    const response = await fetch('/mood', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (response.ok) console.log('Mood data saved to MongoDB.');
    else console.error('Failed to save mood data.');
  } catch (err) {
    console.error('Error sending mood data:', err);
  }
}