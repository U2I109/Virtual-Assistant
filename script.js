const startBtn = document.getElementById("start-btn");
const statusText = document.getElementById("status");
const responseText = document.getElementById("response");
const eventsList = document.getElementById("events");

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "en-US";
recognition.interimResults = false;

startBtn.addEventListener("click", () => {
  responseText.textContent = "";
  statusText.textContent = "System: Listening for 'Hey Mark'...";
  recognition.start();
});

recognition.onresult = async (event) => {
  const transcript = event.results[0][0].transcript.toLowerCase();
  statusText.textContent = "System: Thinking...";
  responseText.textContent = `You: ${transcript}`;

  try {
    const response = await fetch("https://01508006-cfdc-4454-b868-bab761f6dad0-00-goqvkypa4isl.spock.replit.dev/process", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: transcript }),
    });

    const data = await response.json();
    responseText.textContent = `Mark: ${data.reply}`;

    if (data.events && data.events.length > 0) {
      eventsList.innerHTML = "";
      data.events.forEach((event) => {
        const li = document.createElement("li");
        li.textContent = event;
        eventsList.appendChild(li);
      });
    }
  } catch (error) {
    responseText.textContent = "Mark: Sorry, I had trouble processing that.";
    console.error(error);
  }
};

recognition.onerror = (event) => {
  statusText.textContent = "System: Error occurred while listening.";
  console.error("Speech recognition error", event);
};
