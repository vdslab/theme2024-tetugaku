function Information({ processed_data, nodeId }) {
    const nodeName = processed_data.names.find(e => e.name_id === nodeId)

return (
      <div>
        <h1>{nodeId}</h1>
        <h2>{nodeName ? nodeName.name : '該当するデータがありません'}</h2>
      </div>
    );
}
  
export default Information;
  