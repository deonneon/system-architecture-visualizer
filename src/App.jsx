import { useState } from "react";
import InputForm from "./components/InputForm";
import FlowChart from "./components/FlowChart";

const App = () => {
  const [systemData, setSystemData] = useState(null);

  const handleGenerated = (data) => {
    setSystemData(data);
  };

  const handleExpand = async (selectedNodes) => {
    try {
      const response = await fetch("/.netlify/functions/generateJSONResponse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nodes: selectedNodes.map((node) => node.id),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData = await response.json();

      // Merge the new data with existing systemData
      const existingNodes = systemData.elements.nodes;
      const existingConnections = systemData.elements.connections;

      // Merge nodes
      const newNodes = jsonData.elements.nodes;
      const mergedNodes = [...existingNodes];

      newNodes.forEach((node) => {
        if (!existingNodes.some((n) => n.id === node.id)) {
          mergedNodes.push(node);
        }
      });

      // Merge connections
      const newConnections = jsonData.elements.connections;
      const mergedConnections = [...existingConnections];

      newConnections.forEach((conn) => {
        if (
          !existingConnections.some(
            (c) =>
              c.from === conn.from && c.to === conn.to && c.type === conn.type
          )
        ) {
          mergedConnections.push(conn);
        }
      });

      // Update systemData
      const updatedSystemData = {
        ...systemData,
        elements: {
          nodes: mergedNodes,
          connections: mergedConnections,
        },
      };

      setSystemData(updatedSystemData);
    } catch (error) {
      console.error("Error expanding nodes:", error);
      alert("Error expanding nodes. Please try again.");
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>
        System Architecture Diagram Generator
      </h1>
      <InputForm onGenerated={handleGenerated} />

      <FlowChart systemData={systemData} onExpand={handleExpand} />
    </div>
  );
};

export default App;
