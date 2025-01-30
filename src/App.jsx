import { useState, useEffect } from "react";
import NetworkGraph from "./components/NetWorkGraph";
import Information from "./components/Information";
import SearchAndFilter from "./components/SearchAndFilter";
import processed_data from "/create_json/output_data/processed_data";
import BookShelf from "./components/BookShelf";
import SelectNode from "./components/SelectNode";
import List from "./components/List";

function App() {
  const [clickedNodeId, setClickedNodeId] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [renderComplete, setRenderComplete] = useState(null);

  const [highlightNode,setHighlightNode] = useState([]);

  // ノードクリックを感知して、idをclickedNodeIdにセット
  const handleSetNodeId = (newNodeId) => {
    setClickedNodeId(newNodeId);
  };

  const handleSetGroupId = (newGroupId) => {
    setSelectedGroupId(newGroupId);
  };

  // レンダリング処理の完了を示すフラグを立てる
  const handleRenderComplete = () => {
    setRenderComplete(true);
  };

  return (
    <div className="wrapper">
      {/* wrapper-styles.css適用箇所 */}
      <header>
        <div className="header-title">
          <h1>哲学思想ネットワーク</h1>
        </div>
        <div className="header-controls">
          <SearchAndFilter
            processed_data={processed_data}
            selectNode={handleSetNodeId}
            selectGroup={handleSetGroupId}
            renderComplete={renderComplete}
          />
        </div>
      </header>
      <main>
        {/* main-styles.css適用箇所 */}
        <div className="full-container">
          {/* <div className="select-container"> */}
          {/* <h1>セレクトボタン</h1> */}
          {/* <SearchAndFilter
              processed_data={processed_data}
              selectNode={handleSetNodeId}
              selectGroup={handleSetGroupId}
              renderComplete={renderComplete}
            /> */}
          {/* </div> */}
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
                <List 
                  processed_data={processed_data}
                  nodeId={clickedNodeId}
                  highlightNode={setHighlightNode}
                />
              </div>
            </div>
            <div className="vis-container">
              <SelectNode
                processed_data={processed_data}
                nodeId={clickedNodeId}
              />
              <NetworkGraph
                processed_data={processed_data}
                onNodeClick={handleSetNodeId}
                selectedNodeId={clickedNodeId}
                selectedGroupId={selectedGroupId}
                handleRenderComplete={handleRenderComplete}
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
