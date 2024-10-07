import React, { useEffect, useRef } from "react";
import rough from "roughjs/bundled/rough.esm.js";

const nodeWidth = 172;
const nodeHeight = 36;

const CustomNode = ({ data }) => {
  const nodeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (nodeRef.current) {
      const rc = rough.svg(nodeRef.current);
      const node = rc.rectangle(0, 0, nodeWidth, nodeHeight, {
        fill: "white",
        fillStyle: "solid",
        stroke: "#000",
        strokeWidth: 1,
        roughness: 2,
      });
      nodeRef.current.appendChild(node);
    }
  }, []);

  return (
    <div className="custom-node">
      <svg
        ref={nodeRef}
        width={nodeWidth}
        height={nodeHeight}
        style={{ position: "absolute", top: 0, left: 0 }}
      />
      <div className="node-content" style={{ position: "relative", zIndex: 1 }}>
        <div className="node-header">{data.label}</div>
        <div>{data.content}</div>
      </div>
    </div>
  );
};

export default CustomNode;
