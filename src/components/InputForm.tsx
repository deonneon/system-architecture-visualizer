import React, { useState } from "react";

const InputForm = ({ onGenerated }) => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (input.trim() === "") {
      alert("Please enter a system design concept");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/.netlify/functions/generateJSONResponse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: input,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData = await response.json();
      const jsonString = JSON.stringify(jsonData, null, 2);
      console.log("output generated", jsonString);

      setOutput(jsonString);
      onGenerated(jsonData); // Pass jsonData instead of response
    } catch (error) {
      console.error("Error generating response:", error);
      alert("Error generating response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <textarea
        rows={2}
        cols={50}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter a system design concept, e.g., 'Twitter Newsfeed'"
        style={{ paddingLeft: "10px", paddingTop: "10px" }}
      />
      <br />
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate Diagram"}
      </button>
      {/* <h2>Output:</h2>
      <pre>{output}</pre> */}
    </div>
  );
};

export default InputForm;
