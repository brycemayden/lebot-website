export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    console.error("Missing OPENAI_API_KEY");
    return res.status(500).json({ error: "Missing OpenAI API key" });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    console.error("Invalid or missing messages in request body");
    return res.status(400).json({ error: "Invalid message format" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      res.status(200).json(data);
    } else {
      console.error("OpenAI API error:", data);
      res.status(response.status).json({ error: data });
    }
  } catch (error) {
    console.error("Unhandled error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

