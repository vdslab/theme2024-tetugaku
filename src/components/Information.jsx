import React, { useEffect, useState } from "react";
import "./Information.css";

function Information({ processed_data, nodeId }) {
  const [nodeInfo, setNodeInfo] = useState(null);
  const [philosopherName, setPhilosopherName] = useState("");

  useEffect(() => {
    if (!processed_data || !nodeId) return;

    const selectedNode = processed_data.nodes?.find(
      (node) => node.id === nodeId
    );

    if (selectedNode && processed_data.names) {
      setNodeInfo(selectedNode);
      const nameInfo = processed_data.names.find(
        (name) => Number(name.name_id) === Number(nodeId)
      );
      if (nameInfo) {
        setPhilosopherName(nameInfo.name);
      }
    }
  }, [processed_data, nodeId]);

  const formatText = (text) => {
    if (!text) return "";
    return text.split("\\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index !== text.split("\\n").length - 1 && <br />}
      </React.Fragment>
    ));
  };

  if (!nodeInfo) {
    return (
      <div className="information-container">
        <div className="information-header">Information</div>
        <div className="information-content">
          <div className="p-4">ノードを選択してください</div>
        </div>
      </div>
    );
  }

  return (
    <div className="information-container">
      <div className="information-header">Information</div>
      <div className="information-content">
        <h2 className="text-xl font-bold mb-4">{philosopherName}</h2>
        <div className="space-y-4">
          <p className="text-gray-700">{formatText(nodeInfo.information)}</p>
          {nodeInfo.additionalInfo && (
            <div className="mt-2 text-sm text-gray-600">
              {formatText(nodeInfo.additionalInfo)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Information;
