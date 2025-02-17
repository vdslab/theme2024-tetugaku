import InformationCard from "./InformationCard.jsx";
import "./Information.css";
import { useRef } from "react";

export default function Information({
  data,
  nodeId,
  sheetY,
  openPosition,
  onScrollToClose,
}) {
  const containerRef = useRef(null);

  const handleScroll = () => {
    if (containerRef.current.scrollTop === 0) {
      onScrollToClose(); // 最上部に達したらスムーズに閉じる
    }
  };

  return (
    <div
      ref={containerRef}
      className="information-container-fm"
      style={{
        overflowY: sheetY === openPosition ? "auto" : "hidden",
        scrollBehavior: "smooth",
      }}
      onScroll={handleScroll}
    >
      <div className="information-header-fm">解説</div>
      <InformationCard data={data} nodeId={nodeId} />
    </div>
  );
}
