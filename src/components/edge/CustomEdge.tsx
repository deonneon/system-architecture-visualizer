import React from "react";
import { getBezierPath, EdgeProps } from "reactflow";
import rough from "roughjs/bundled/rough.esm.js";

const CustomEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
}) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const roughSvg = rough.svg(
    document.createElementNS("http://www.w3.org/2000/svg", "svg")
  );
  const roughPath = roughSvg.path(edgePath, {
    stroke: "#000",
    strokeWidth: 1,
    roughness: 2,
    bowing: 2,
  });

  return <g dangerouslySetInnerHTML={{ __html: roughPath.outerHTML }} />;
};

export default CustomEdge;
