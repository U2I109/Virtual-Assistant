const startBtn = document.getElementById("startBtn");
const chatBox = document.getElementById("chatBox");

function appendMessage(sender, message) {
  const div = document.createElement("div");
  div.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatBox.appendChild(div);
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
    appendMessage("Mark", "Thinking...");

    // 🧠 Send it to your backend server
    try {
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: command })
      });

      const data = await response.json();
      appendMessage("Mark", data.reply);
    } catch (error) {
      appendMessage("Mark", "Oops! Something went wrong.");
    }
  } else {
    appendMessage("Mark", "Say 'Hey Mark' to activate me.");
  }
};
