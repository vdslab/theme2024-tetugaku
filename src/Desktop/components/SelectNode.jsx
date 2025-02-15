import "./SelectNode.css";

function SelectNode({ processed_data, nodeId }) {
  const getSelectedNodeName = () => {
    if (!processed_data || !nodeId) return null;
    const nodeInfo = processed_data.names?.find((n) => n.name_id === nodeId);
    return nodeInfo?.name || null;
  };

  const selectedName = getSelectedNodeName();

  // 凡例データ（NetworkGraph の color(d.group) に対応）
  const legendData = [
    { label: "古代", color: "#5EC2A2" },
    { label: "中世", color: "#626BFF" },
    { label: "近代", color: "#CD55D3" },
    { label: "現代", color: "#FCE94E" },
  ];

  return (
    <div className="select-node-container">
      <div className="legend-container">
        {legendData.map((item, index) => (
          <div key={index} className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: item.color }}
            ></div>
            <div className="legend-label">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="selected-node-info">
        <div className="select-node-label">選択された哲学者：</div>
        <div className="select-node-name">{selectedName || "未選択"}</div>
      </div>
    </div>
  );
}

export default SelectNode;
