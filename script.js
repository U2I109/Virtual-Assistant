const button = document.getElementById("talk-button");
const status = document.getElementById("status");
const eventsList = document.getElementById("events");

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "en-US";
recognition.interimResults = false;

const speak = (message) => {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(message);
  synth.speak(utterance);
};

button.addEventListener("click", () => {
  status.textContent = "🎙️ Listening for 'Hey Mark'...";
  recognition.start();
});

recognition.onresult = async (event) => {
  const transcript = event.results[0][0].transcript.toLowerCase();
  status.textContent = "🤖 Thinking...";

  try {
    const response = await fetch("https://01508006-cfdc-4454-b868-bab761f6dad0-00-goqvkypa4isl.spock.replit.dev/process", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: transcript })
    });

    const data = await response.json();

    if (data.reply) {
      speak(data.reply);
    }

    if (data.events && Array.isArray(data.events)) {
      eventsList.innerHTML = data.events.map(event => `<li>${event}</li>`).join("");
    }

    status.textContent = "✅ Mark responded.";
  } catch (error) {
    console.error("Error:", error);
    status.textContent = "⚠️ Failed to reach Mark.";
    speak("Sorry, I had trouble reaching the server.");
  }
};

recognition.onerror = (event) => {
  status.textContent = `⚠️ Error: ${event.error}`;
};
