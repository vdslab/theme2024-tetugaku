import { useState, useEffect } from "react";
import Network from "@m/components/organisms/network/Network.jsx";
import BottomSheet from "@m/components/organisms/bottom-sheet/BottomSheet.jsx";
import { fetchData } from "@m/api/fetchData";

export default function Home() {
  const [processedData, setProcessedData] = useState(null);
  const [nodeId, setNodeId] = useState(5);

  useEffect(() => {
    fetchData().then((data) => setProcessedData(data));
  }, []);

  return (
    <>
      <Network />
      <BottomSheet data={processedData} nodeId={nodeId} />
    </>
  );
}
