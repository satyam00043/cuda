function sendMessage() {
    const userInput = document.getElementById("userInput").value;
    const chatbox = document.getElementById("chatbox");
  
    if (userInput) {
      const userMessage = document.createElement("div");
      userMessage.classList.add("user-message");
      userMessage.innerText = userInput;
      chatbox.appendChild(userMessage);
  
      // Auto-response from bot
      const botMessage = document.createElement("div");
      botMessage.classList.add("bot-message");
      botMessage.innerText = "Thanks for reaching out! We’ll get back to you soon.";
      chatbox.appendChild(botMessage);
  
      // Clear the input
      document.getElementById("userInput").value = "";
      chatbox.scrollTop = chatbox.scrollHeight;
    }
  }
  