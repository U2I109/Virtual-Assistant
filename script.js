const startBtn = document.getElementById("startBtn");
const chatBox = document.getElementById("chatBox");

function appendMessage(sender, message) {
  const div = document.createElement("div");
  div.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatBox.appendChild(div);
}

// ✅ Function to make Mark talk back
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}

// Check for browser support
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
    speak(response); // Mark talks back
  } else {
    const response = "Say 'Hey Mark' to activate me.";
    appendMessage("Mark", response);
    speak(response); // Mark corrects you out loud
  }
};
