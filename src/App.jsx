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
              <div className="list-container">
                
              </div>
              {/* item-styles.css適用箇所 */}
              <div className="vis-container">
                {/* <NetworkGraph1 /> */}
              </div>
              <div className="info-book-container">
                <div className="info-container">
                <h1>思想家の詳細</h1>
                </div>
                <div className="book-container">
                <h1>本棚</h1>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  export default App;