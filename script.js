const startBtn = document.getElementById("startBtn");
const chatBox = document.getElementById("chatBox");
const eventList = document.getElementById("eventList");

function appendMessage(sender, message) {
  const div = document.createElement("div");
  div.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatBox.appendChild(div);
}

// ✅ Mark talks back
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}

// 🎤 Voice Recognition Setup
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
    const response = `Got it! "${command}" will be processed.`;
    appendMessage("Mark", response);
    speak(response);

    // ✅ Soon: We'll extract date/time & add to calendar here
  } else {
    const response = "Say 'Hey Mark' to activate me.";
    appendMessage("Mark", response);
    speak(response);
  }
};
