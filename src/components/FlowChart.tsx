import React, { useEffect, useState, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";

import TwitterNewsfeed from "../data/twitterNewsfeed.json";
import WebBasic from "../data/webBasic.json";

const nodeWidth = 172;
const nodeHeight = 36;

import CustomNode from "./node/CustomNode";
import CustomEdge from "./edge/CustomEdge";

const nodeTypes = {
  custom: CustomNode,
};
const edgeTypes = {
  custom: CustomEdge,
};

const getLayoutedElements = (nodes, edges, direction = "LR") => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 80,
    ranksep: 100,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target, { weight: 1 });
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? "left" : "top";
    node.sourcePosition = isHorizontal ? "right" : "bottom";

    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes: layoutedNodes, edges };
};

const parseSystemData = (data) => {
  if (!data || !data.elements) return { nodes: [], edges: [] };

  const parsedNodes = data.elements.nodes.map((node) => ({
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

  const parsedEdges = data.elements.connections.map((conn, index) => ({
    id: `e${conn.from}-${conn.to}-${index}`,
    source: conn.from,
    target: conn.to,
    label: conn.type,
    // type: "custom", // Use the custom edge type
    animated: true,
    style: { stroke: "#000" },
    labelStyle: { fill: "#000", fontWeight: 700 },
  }));

  return getLayoutedElements(parsedNodes, parsedEdges);
};

const FlowChart = ({ systemData, onExpand }) => {
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onSelectionChange = useCallback(({ nodes }) => {
    setSelectedNodes(nodes);
  }, []);

  const handleExampleSwitch = (exampleData) => {
    const parsedElements = parseSystemData(exampleData);
    setNodes(parsedElements.nodes);
    setEdges(parsedElements.edges);
  };

  useEffect(() => {
    if (systemData) {
      const { nodes: parsedNodes, edges: parsedEdges } =
        parseSystemData(systemData);
      setNodes(parsedNodes);
      setEdges(parsedEdges);
    } else {
      handleExampleSwitch(TwitterNewsfeed); // Load the first example by default
    }
  }, [systemData, setNodes, setEdges]);

  const onNodeClick = useCallback(
    (event, node) => {
      onExpand([node]);
    },
    [onExpand]
  );

  const handleExpand = () => {
    if (selectedNodes.length > 0) {
      onExpand(selectedNodes);
      setSelectedNodes([]);
    }
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <div style={{ position: "absolute", zIndex: 10, top: 10, left: 10 }}>
        <button onClick={() => handleExampleSwitch(TwitterNewsfeed)}>
          Twitter Newsfeed
        </button>
        <button onClick={() => handleExampleSwitch(WebBasic)}>Web Basic</button>
      </div>

      {selectedNodes.length > 0 && (
        <button
          style={{
            position: "absolute",
            zIndex: 10,
            top: 10,
            right: 20,
          }}
          onClick={handleExpand}
        >
          Expand
        </button>
      )}

      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
          onSelectionChange={onSelectionChange}
          selectNodesOnDrag={true}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
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
