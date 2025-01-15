import { useState } from "react";
import NetworkGraph from "./components/NetWorkGraph";
import Information from "./components/Information";
import SearchAndFilter from "./components/SearchAndFilter";
import processed_data from "/create_json/output_data/processed_data";
import BookShelf from "./components/BookShelf";
import SelectNode from "./components/SelectNode";

function App() {
  const [clickedNodeId, setClickedNodeId] = useState(null);
  // ノードクリックを感知して、idをclickedNodeIdにセット
  const handleNodeClick = (newNodeId) => {
    setClickedNodeId(newNodeId);
  };

  return (
    <div className="wrapper">
      {/* wrapper-styles.css適用箇所 */}
      <header>
        <h1>ヘッダー</h1>
      </header>
      <main>
        {/* main-styles.css適用箇所 */}
        <div className="full-container">
          <div className="select-container">
            {/* <h1>セレクトボタン</h1> */}
            <SearchAndFilter processed_data={processed_data} />
          </div>
          <div className="item-container">
            {/* item-styles.css適用箇所 */}
            <div className="info-list-container">
              <div className="info-container">
                <Information
                  processed_data={processed_data}
                  nodeId={clickedNodeId}
                />
              </div>
              <div className="list-container">
                <h1>リストの表示</h1>
              </div>
            </div>
            <div className="vis-container">
              <SelectNode
                processed_data={processed_data}
                nodeId={clickedNodeId}
              />
              <NetworkGraph
                processed_data={processed_data}
                onNodeClick={handleNodeClick}
              />
            </div>
            <div className="book-container">
              <BookShelf
                processed_data={processed_data}
                nodeId={clickedNodeId}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
