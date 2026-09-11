const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const SYSTEM_INSTRUCTION = `
You are the official assistant for Libas, an online clothing e-commerce marketplace.
Only answer questions related to Libas — products, orders, sellers, returns, account help,
and shopping guidance on this platform.

If asked something unrelated (general knowledge, coding, other companies, personal topics),
politely decline and redirect the user back to Libas-related help.

Keep responses concise, friendly, and in a helpful customer-support tone.
Never invent product, price, or policy details you don't actually have.
`;

const chatAI = async (req, res) => {
  try {
    const { message } = req.body;

    console.log("Message:", message);

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // Tell browser that we are sending a stream
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Create Gemini stream
    const stream = await ai.interactions.create({
      model: "gemini-3.7-flash",
      system_instruction: SYSTEM_INSTRUCTION,
      input: message,
      stream: true,
    });

    // Read Gemini events
    for await (const event of stream) {
      if (event.event_type === "step.delta" && event.delta?.type === "text") {
        const text = event.delta.text;

        // Send chunk to React
        res.write(text);
      }
    }

    res.end();
  } catch (error) {
    console.error("AI Error:", error);

    // If headers haven't been sent yet
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "AI request failed",
        error: error.message,
      });
    }

    res.end();
  }
};

module.exports = { chatAI };
