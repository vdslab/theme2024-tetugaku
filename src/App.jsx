import NetworkGraph from "./components/NetWorkGraph";

function App() {
    return (
      <div className="wrapper">
        {/* wrapper-styles.css適用箇所 */}
        <header><h1>ヘッダー</h1></header>
        <main>
          {/* main-styles.css適用箇所 */}
          <div className="full-container">
            <div className="select-container">
              <h1>セレクトボタン</h1>
            </div>
            <div className="item-container">
              {/* item-styles.css適用箇所 */}
              <div className="info-list-container">
                <div className="info-container">
                <h1>思想家の詳細</h1>
                </div>
                <div className="list-container">
                <h1>リストの表示</h1>
                </div>
              </div>
              <div className="vis-container">
                <NetworkGraph/>
              </div>
              <div className="book-container">
              <h1>本棚</h1>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  export default App;