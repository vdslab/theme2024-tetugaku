import InformationCard from "./InformationCard.jsx";
import "./Information.css";

export default function Information({ data, nodeId }) {
  return (
    <div className="information-container">
      <div className="information-header">解説</div>
      <InformationCard data={data} nodeId={nodeId} />
    </div>
  );
}
