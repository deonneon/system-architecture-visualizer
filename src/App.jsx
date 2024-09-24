import { useState } from "react";
import FlowChart from "./components/FlowChart";
import InputForm from "./components/InputForm";

function App() {
  const [systemData, setSystemData] = useState(null);

  const handleGeneratedData = (generatedData) => {
    try {
      const parsedData = JSON.parse(generatedData); // parse the JSON string into a JavaScript object
      setSystemData(parsedData);
    } catch (error) {
      console.error("Failed to parse generated JSON:", error);
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>System Architecture Diagram</h1>
      <InputForm onGenerated={handleGeneratedData} />
      {systemData && <FlowChart systemData={systemData} />}
    </div>
  );
}

export default App;
