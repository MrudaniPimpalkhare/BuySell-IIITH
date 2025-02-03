import axios from "axios";

export async function sendMessageToGemini(userMessage) {
    const apiKey = process.env.GEMINI_API_KEY;
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

    try {
        const payload = {
            contents: [{ role: "user", parts: [{ text: userMessage }] }]
        };

        console.log("Payload Sent to Gemini:", JSON.stringify(payload, null, 2));

        const response = await axios.post(geminiUrl, payload, {
            headers: { "Content-Type": "application/json" }
        });

        console.log("Raw Gemini API Response:", response.data);

        // Extract chatbot's reply
        const chatbotReply =
            response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "I'm not sure how to respond.";

        return { reply: chatbotReply };
    } catch (error) {
        console.error("Error calling Gemini API:", error.response?.data || error.message);
        return { error: "Failed to connect to Gemini API" };
    }
}
