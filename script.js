const talkButton = document.getElementById("talkButton");
const status = document.getElementById("status");
const response = document.getElementById("response");
const events = document.getElementById("events");

const backendURL = "https://01508006-cfdc-4454-b868-bab761f6dad0-00-goqvkypa4isl.spock.replit.dev";

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "en-US";
recognition.interimResults = false;

talkButton.addEventListener("click", () => {
  status.textContent = "Listening...";
  recognition.start();
});

recognition.onresult = async (event) => {
  const userSpeech = event.results[0][0].transcript;
  status.textContent = `Heard: "${userSpeech}"`;

  try {
    const res = await fetch(`${backendURL}/process`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: userSpeech })
    });
    const data = await res.json();
    response.textContent = data.reply;

    const utter = new SpeechSynthesisUtterance(data.reply);
    speechSynthesis.speak(utter);

    events.innerHTML = "";
    data.events.forEach(event => {
      const li = document.createElement("li");
      li.textContent = event;
      events.appendChild(li);
    });
  } catch (err) {
    response.textContent = "Error connecting to Mark.";
  }
};
