import express from 'express';
import { sendMessageToGemini } from '../services/geminiService.js';

const router = express.Router();

router.post('/api/chat', async (req, res) => {
  const { userMessage } = req.body;

  if (!userMessage) {
    return res.status(400).json({ error: 'Missing user message' });
  }

  try {
    const geminiResponse = await sendMessageToGemini(userMessage);
    return res.json(geminiResponse);
  } catch (error) {
    console.error('Error calling Gemini:', error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
