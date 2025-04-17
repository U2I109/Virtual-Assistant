// 🔧 FRONTEND: script.js
const startBtn = document.getElementById("startBtn");
const chatBox = document.getElementById("chatBox");

const context = [];

function appendMessage(sender, message) {
  const div = document.createElement("div");
  div.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
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

recognition.onresult = async (event) => {
  const transcript = event.results[0][0].transcript;
  appendMessage("You", transcript);

  if (transcript.toLowerCase().startsWith("hey mark")) {
    const command = transcript.toLowerCase().replace("hey mark", "").trim();
    await sendToMark(command);
  } else {
    appendMessage("Mark", "Say 'Hey Mark' to activate me.");
  }
};

async function sendToMark(message) {
  context.push({ role: "user", content: message });

  const response = await fetch("http://localhost:3000/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, context })
  });

  const data = await response.json();
  const reply = data.reply;

  context.push({ role: "assistant", content: reply });
  appendMessage("Mark", reply);
}
