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
          input,
        }),
      });

      const jsonData = await response.json();
      const jsonString = JSON.stringify(jsonData, null, 2);

      setOutput(jsonString);
      onGenerated(response);
    } catch (error) {
      alert("Error generating response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>System Design JSON Generator</h1>
      <textarea
        rows={4}
        cols={50}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter a system design concept, e.g., 'Twitter Newsfeed'"
      />
      <br />
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate JSON"}
      </button>
      {/* <h2>Output:</h2>
      <pre>{output}</pre> */}
    </div>
  );
};

export default InputForm;
