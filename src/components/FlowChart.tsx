import React, { useEffect, useState, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (nodes, edges, direction = "LR") => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? "left" : "top";
    node.sourcePosition = isHorizontal ? "right" : "bottom";

    // Shift node position to center
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes: layoutedNodes, edges };
};

const FlowChart = ({ systemData, onExpand }) => {
  const [elements, setElements] = useState({ nodes: [], edges: [] });
  const [selectedNodes, setSelectedNodes] = useState([]);

  const onSelectionChange = useCallback(({ nodes }) => {
    setSelectedNodes(nodes);
  }, []);

  useEffect(() => {
    if (systemData) {
      // Parse nodes
      const parsedNodes = systemData.elements.nodes.map((node) => ({
        id: node.id,
        data: {
          label: (
            <div>
              <strong>{node.id}</strong>
              <br />
              {node.description}
            </div>
          ),
        },
        type: "default",
      }));

      // Parse edges
      const parsedEdges = systemData.elements.connections.map(
        (conn, index) => ({
          id: `e${conn.from}-${conn.to}-${index}`,
          source: conn.from,
          target: conn.to,
          label: conn.type,
          animated: false,
          style: { stroke: "#000" },
          labelStyle: { fill: "#000", fontWeight: 700 },
          arrowHeadType: "arrowclosed",
        })
      );

      const layouted = getLayoutedElements(parsedNodes, parsedEdges);
      setElements(layouted);
    }
  }, [systemData]);

  const handleExpand = () => {
    if (selectedNodes.length > 0) {
      onExpand(selectedNodes);
      setSelectedNodes([]);
    }
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      {selectedNodes.length > 0 && (
        <button
          style={{
            position: "absolute",
            zIndex: 10,
            top: 10,
            left: 10,
          }}
          onClick={handleExpand}
        >
          Expand
        </button>
      )}
      <ReactFlowProvider>
        <ReactFlow
          nodes={elements.nodes}
          edges={elements.edges}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
          onSelectionChange={onSelectionChange}
          selectNodesOnDrag={true}
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};

export default FlowChart;
