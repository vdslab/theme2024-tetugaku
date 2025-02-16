import React, { useState, useEffect } from "react";

export default function InformationCard({ data, nodeId }) {
  const [nodeInfo, setNodeInfo] = useState(null);
  const [philosopherName, setPhilosopherName] = useState("");

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
      <h2 className="text-xl font-bold mb-4">{philosopherName}</h2>
      <div className="space-y-4">
        <p className="text-gray-700">
          {!data || !nodeInfo
            ? "ノードを選択してください"
            : formatText(nodeInfo.information)}
        </p>
      </div>
    </div>
  );
}
