import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.VITE_OPENAI_API_KEY });

export default async (req: Request) => {
  const requestData = await req.json();
  const { topic, nodes } = requestData;

  let prompt;

  if (topic) {
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
    prompt = `Generate a JSON template for the system design concept: ${topic}. Example: ${example}. Depending on the concept, it does not have to be technical in nature and be abstract.`;
  } else if (nodes) {
    // If nodes are provided, we need to generate expanded data for those nodes
    const nodesList = nodes.join(", ");
    const example = `
    {
      "elements": {
        "nodes": [
          {
            "id": "CacheServer",
            "type": "Cache",
            "description": "Stores frequently accessed data for quick retrieval"
          },
          {
            "id": "AuthenticationService",
            "type": "Service",
            "description": "Handles user authentication and authorization"
          },
        ],
        "connections": [
          {
            "from": "WebServer",
            "to": "CacheServer",
            "type": "Cache Lookup",
            "description": "Web server checks cache for data"
          },
          {
            "from": "Client",
            "to": "AuthenticationService",
            "type": "Login Request",
            "description": "Client sends login request to authentication service"
          },
        ]
      }
    }
    `;
    prompt = `Expand the following nodes in a system design diagram and provide additional details in JSON format. Nodes: ${nodesList}. Use the same JSON format as before. Example: ${example}`;
  } else {
    return new Response(
      JSON.stringify({ error: "No topic or nodes provided" }),
      {
        status: 400,
      }
    );
  }

  try {
    const resp = await openai.chat.completions.create({
      response_format: { type: "json_object" },
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that generates system design diagrams in JSON format.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const data = JSON.parse(resp.choices[0]?.message.content || "{}");

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return new Response(
      JSON.stringify({ error: "Error calling OpenAI API", details: error }),
      { status: 500 }
    );
  }
};
