import "./SelectNode.css";
function SelectNode({ processed_data, nodeId }) {
  const getSelectedNodeName = () => {
    if (!processed_data || !nodeId) return null;
    const nodeInfo = processed_data.names?.find((n) => n.name_id === nodeId);
    return nodeInfo?.name || null;
  };

  const selectedName = getSelectedNodeName();

  return (
    <div className="select-node-container">
      <h2 className="select-node-label">選択された哲学者：</h2>
      <span className="select-node-name">{selectedName || "未選択"}</span>
    </div>
  );
}

export default SelectNode;
