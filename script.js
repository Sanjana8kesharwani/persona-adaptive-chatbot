function getTime() {
  const now = new Date();
  return now.getHours() + ":" + String(now.getMinutes()).padStart(2, "0");
}

async function sendMessage() {
  const input = document.getElementById("message");
  const chatBox = document.getElementById("chat-box");

  const message = input.value;
  if (!message) return;

  
  chatBox.innerHTML += `
    <div class="message user">
      ${message}
      <div class="time">${getTime()}</div>
    </div>
  `;

  input.value = "";


  const typing = document.createElement("div");
  typing.className = "message bot";
  typing.innerText = "Typing...";
  chatBox.appendChild(typing);

  chatBox.scrollTop = chatBox.scrollHeight;

  const res = await fetch("https://chatbot-backend-lnuh.onrender.com/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message })
  });

  const data = await res.json();

  typing.remove();

 
  chatBox.innerHTML += `
    <div class="message bot">
      ${data.response}
      <div class="time">${getTime()}</div>
    </div>
  `;

  chatBox.scrollTop = chatBox.scrollHeight;
}


document.getElementById("message").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});