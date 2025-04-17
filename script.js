const startBtn = document.getElementById("startBtn");
const chatBox = document.getElementById("chatBox");
const eventList = document.getElementById("eventList");

function appendMessage(sender, message) {
  const div = document.createElement("div");
  div.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatBox.appendChild(div);
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = 'en-US';

startBtn.onclick = () => {
  appendMessage("System", "Listening for 'Hey Mark'...");
  recognition.start();
};

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  appendMessage("You", transcript);

  if (transcript.toLowerCase().includes("hey mark")) {
    const command = transcript.toLowerCase().replace("hey mark", "").trim();
    handleCommand(command);
  } else {
    const response = "Say 'Hey Mark' to activate me.";
    appendMessage("Mark", response);
    speak(response);
  }
};

function handleCommand(command) {
  const dateRegex = /\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}(st|nd|rd|th)?\b/i;
  const timeRegex = /\b\d{1,2}(:\d{2})?\s?(a\.?m\.?|p\.?m\.?)\b/i;
  const aboutRegex = /remind me (about|of|to)? (.+?) (on|at|by)?/i;

  const eventDateMatch = command.match(dateRegex);
  const eventTimeMatch = command.match(timeRegex);
  const aboutMatch = command.match(aboutRegex);

  const eventDate = eventDateMatch ? eventDateMatch[0].replace(/(st|nd|rd|th)/i, '') : null;
  const eventTime = eventTimeMatch ? eventTimeMatch[0].replace(/\./g, '') : null;
  const eventName = aboutMatch ? aboutMatch[2].trim() : null;

  if (eventName && eventDate && eventTime) {
    const fullEvent = `${eventName} on ${eventDate} at ${eventTime}`;
    addEventToCalendar(fullEvent);

    const response = `Got it! "${eventName}" on ${eventDate} at ${eventTime} has been scheduled.`;
    appendMessage("Mark", response);
    speak(response);
  } else {
    let followUp = "Hmm, I didn't catch that. ";
    if (!eventName) followUp += "What should I remind you about? ";
    if (!eventDate) followUp += "What date is it for? ";
    if (!eventTime) followUp += "What time should I remind you? ";

    appendMessage("Mark", followUp);
    speak(followUp);
  }
}

function addEventToCalendar(eventText) {
  if (eventList.querySelector("li")?.textContent === "No events yet.") {
    eventList.innerHTML = "";
  }

  const li = document.createElement("li");
  li.textContent = eventText;
  eventList.appendChild(li);
}
