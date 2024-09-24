import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.VITE_OPENAI_API_KEY });

export default async (req: Request) => {
  const requestData = await req.json();
  const { topic } = requestData;

  const example = `
    {
  "elements": {
    "nodes": [
      {
        "id": "Client",
        "type": "User Interface",
        "description": "Web browser or mobile app used by the end-user"
      },
      {
        "id": "LoadBalancer",
        "type": "Load Balancer",
        "description": "Distributes incoming traffic across multiple web servers"
      },
    ],
    "connections": [
      {
        "from": "Client",
        "to": "LoadBalancer",
        "type": "HTTPS Request",
        "description": "Client sends requests to the load balancer"
      },
      {
        "from": "LoadBalancer",
        "to": "WebServer",
        "type": "HTTP Forward",
        "description": "Load balancer forwards requests to a web server"
      },
    ]
  },
  "metadata": {
    "description": "System architecture for a web application interacting with a database, including load balancing, caching, authentication, and client-server communication."
  }
}
`;
  const prompt = `Generate a JSON template for the system design concept: ${topic}. Example: ${example}`;

  const resp = await openai.chat.completions.create({
    response_format: { type: "json_object" },
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful education assistant designed to output structured JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const data = JSON.parse(resp.choices[0]?.message.content || "{}");

  return Response.json(resp.choices[0]?.message.content || "{}");
};
