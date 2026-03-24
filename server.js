const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Server is running ");
});



function detectPersona(message) {
  const msg = message.toLowerCase();

  if (msg.includes("error") || msg.includes("api") || msg.includes("bug")) {
    return "technical";
  } else if (
    msg.includes("worst") ||
    msg.includes("not working") ||
    msg.includes("frustrated")
  ) {
    return "frustrated";
  } else if (
    msg.includes("update") ||
    msg.includes("status") ||
    msg.includes("business")
  ) {
    return "business";
  } else {
    return "general";
  }
}



const knowledgeBase = [
  {
    keywords: ["password", "reset"],
    answer: "Click on 'Forgot Password' and follow the steps."
  },
  {
    keywords: ["api", "error"],
    answer: "Check API logs and ensure correct endpoint usage."
  },
  {
    keywords: ["pricing", "cost"],
    answer: "Our pricing details are available on the pricing page."
  }
];



function getAnswer(message, persona) {
  const msg = message.toLowerCase();

 
  for (let item of knowledgeBase) {
    if (item.keywords.some(keyword => msg.includes(keyword))) {
      return item.answer;
    }
  }

 
  if (persona === "technical") {
    return "Technical Insight: Check API logs and verify endpoints.";
  }

  if (persona === "frustrated") {
    return "I understand your frustration. Let me help you resolve this issue.";
  }

  if (persona === "business") {
    return "Here is the current status of your request. Everything is being processed.";
  }

  return null; 
}



function adaptTone(persona, answer) {
  if (persona === "frustrated") {
    return "⚠️ " + answer;
  }
  if (persona === "business") {
    return "📊 " + answer;
  }
  return answer;
}



app.post("/chat", (req, res) => {
  const userMessage = req.body.message;

  const persona = detectPersona(userMessage);

  const answer = getAnswer(userMessage, persona); 

  if (!answer) {
    return res.json({
      persona,
      response: "Escalating to human agent",
      escalate: true
    });
  }

  const finalResponse = adaptTone(persona, answer);

  res.json({
    persona,
    response: finalResponse,
    escalate: false
  });
});



app.listen(3000, () => {
  console.log("Server running on port 3000");
});