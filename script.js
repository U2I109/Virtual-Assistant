const startBtn = document.getElementById("startBtn");
const chatBox = document.getElementById("chatBox");
const eventsList = document.getElementById("events");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "en-US";
recognition.continuous = false;
recognition.interimResults = false;

startBtn.onclick = () => {
  appendMessage("System", "Listening for 'Hey Mark'...");
  recognition.start();
};

recognition.onresult = async (event) => {
  const transcript = event.results[0][0].transcript.toLowerCase();
  appendMessage("You", transcript);

  if (transcript.includes("hey mark")) {
    const command = transcript.replace("hey mark", "").trim();
    appendMessage("System", "Thinking...");

    try {
      const response = await fetch("http://localhost:3000/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: command }),
      });

      const data = await response.json();
      const reply = data.reply;

      appendMessage("Mark", reply);

      if (reply.includes("has been scheduled")) {
        const match = reply.match(/"(.*?)" on (.*?) at (.*)/i);
        if (match) {
          const [_, title, date, time] = match;
          const li = document.createElement("li");
          li.textContent = `${title} on ${date} at ${time}`;
          eventsList.appendChild(li);
        }
      }
    } catch (error) {
      appendMessage("Mark", "Sorry, I had trouble processing that.");
      console.error(error);
    }
  } else {
    appendMessage("Mark", "Say 'Hey Mark' to activate me.");
  }
};

function appendMessage(sender, text) {
  const div = document.createElement("div");
  div.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(div);
}
