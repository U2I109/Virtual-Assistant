const startBtn = document.getElementById("startBtn");
const chatBox = document.getElementById("chatBox");
const eventList = document.getElementById("eventList");

function appendMessage(sender, message) {
  const div = document.createElement("div");
  div.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatBox.appendChild(div);
}

// 🧠 Mark talks back
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}

// 🎤 Voice recognition setup
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

  if (transcript.toLowerCase().startsWith("hey mark")) {
    const command = transcript.toLowerCase().replace("hey mark", "").trim();
    handleCommand(command);
  } else {
    const response = "Say 'Hey Mark' to activate me.";
    appendMessage("Mark", response);
    speak(response);
  }
};

// 📅 Handle the actual command
function handleCommand(command) {
  // Very basic event detection (example: "remind me about pizza on April 20 at 6 PM")
  const eventPattern = /remind me about (.+?) on (\w+ \d{1,2}) at (\d{1,2}(:\d{2})?\s?(am|pm))/i;
  const match = command.match(eventPattern);

  if (match) {
    const eventName = match[1];
    const eventDate = match[2];
    const eventTime = match[3];

    const fullEvent = `${eventName} on ${eventDate} at ${eventTime}`;
    addEventToCalendar(fullEvent);

    const response = `Event "${eventName}" scheduled for ${eventDate} at ${eventTime}.`;
    appendMessage("Mark", response);
    speak(response);
  } else {
    const response = "Sorry, I didn’t understand. Try saying something like 'Remind me about the dentist on April 20 at 10 AM.'";
    appendMessage("Mark", response);
    speak(response);
  }
}

// 🗓️ Add event to the calendar list
function addEventToCalendar(eventText) {
  if (eventList.querySelector("li")?.textContent === "No events yet.") {
    eventList.innerHTML = "";
  }

  const li = document.createElement("li");
  li.textContent = eventText;
  eventList.appendChild(li);
}
