import React, { useState, useEffect } from "react";
import "./Information.css";

export default function InformationCard({ data, nodeId }) {
  const [nodeInfo, setNodeInfo] = useState(null);
  const [philosopherName, setPhilosopherName] = useState("");

  nodeId = 21;
  useEffect(() => {
    if (!data || !nodeId) return;

    const selectedNode = data.nodes?.find((node) => node.id === nodeId);

    if (selectedNode && data.names) {
      setNodeInfo(selectedNode);
      const nameInfo = data.names.find(
        (name) => Number(name.name_id) === Number(nodeId)
      );
      if (nameInfo) {
        setPhilosopherName(nameInfo.name);
      }
    }
  }, [data, nodeId]);

  const formatText = (text) => {
    if (!text) return "";
    return text.split("\\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index !== text.split("\\n").length - 1 && <br />}
      </React.Fragment>
    ));
  };
  return (
    <div>
      <h1 className="information-name-fm">{philosopherName}</h1>
      <div className="information-text-fm">
        {!data || !nodeInfo
          ? "ノードを選択してください"
          : formatText(nodeInfo.information)}
      </div>
    </div>
  );
}
