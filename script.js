const REPLIT_BACKEND_URL = "https://01508006-cfdc-4454-b868-bab761f6dad0-00-goqvkypa4isl.spock.replit.dev";

const synth = window.speechSynthesis;

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;

document.getElementById('talk-button').addEventListener('click', () => {
  document.getElementById('response').innerText = 'System: Listening for "Hey Mark"...';
  recognition.start();
});

recognition.onresult = function (event) {
  const transcript = event.results[0][0].transcript.toLowerCase();
  document.getElementById('response').innerText = `You: ${transcript}`;
  
  fetch(REPLIT_BACKEND_URL + '/process', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text: transcript })
  })
  .then(response => response.json())
  .then(data => {
    const responseText = data.reply;
    document.getElementById('response').innerText = `Mark: ${responseText}`;

    // 🔊 Make Mark speak
    const utterance = new SpeechSynthesisUtterance(responseText);
    utterance.voice = speechSynthesis.getVoices().find(voice => voice.name.includes('Google') || voice.name.includes('Microsoft') || voice.default);
    utterance.pitch = 1;
    utterance.rate = 1;
    speechSynthesis.speak(utterance);

    if (data.events) {
      updateEventList(data.events);
    }
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('response').innerText = 'Mark: Sorry, I had trouble processing that.';
  });
};

function updateEventList(events) {
  const eventList = document.getElementById('event-list');
  eventList.innerHTML = '';
  events.forEach(event => {
    const li = document.createElement('li');
    li.textContent = event;
    eventList.appendChild(li);
  });
}
