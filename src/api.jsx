const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const generateJSONResponse = async (concept) => {
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
  const prompt = `Generate a JSON template for the system design concept: ${concept}. Example: ${example}`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        response_format: { type: "json_object" },
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful education assistant designed to output structured JSON.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error.message || "Error generating response");
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw error;
  }
};
