export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const buffers = [];

    for await (const chunk of req) {
      buffers.push(chunk);
    }

    const rawBody = Buffer.concat(buffers).toString();
    const { messages } = JSON.parse(rawBody);

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

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

    if (!response.ok) {
      console.error("OpenAI error:", data);
      return res.status(500).json({ error: "OpenAI request failed", details: data });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("Handler error:", err);
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}
