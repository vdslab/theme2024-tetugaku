import React, { useEffect, useState } from "react";
import "./List.css";

// relation_id をラベルに変換したい場合の例
const RELATION_ID_MAP = {
  U: "弁証法的影響",
  A: "肯定的影響",
  N: "批判的影響",
  M: "師弟関係"
};

function List({ processed_data, nodeId, highlightNode }){
    const [keyword,setKeyword] = useState("");

    const keywords = processed_data.keywords
      ? processed_data.keywords.filter(t => t.name_id === nodeId).map(t => t.keyword)
      : [];

    // 選択したkeywordを持つ思想家のname_idを取得

    useEffect(() => {
        const s = new Set();
        keyword && processed_data.keywords.forEach((t) => {
            t.keyword === keyword && s.add(t.name_id);
        })
        highlightNode([...s]);
    },[keyword])

    const edgesFrom = processed_data.links.filter(l => {
      const s = typeof l.source === 'object' ? l.source.id : l.source;
      return s === nodeId;
    });
    const edgesTo = processed_data.links.filter(l => {
      const t = typeof l.target === 'object' ? l.target.id : l.target;
      return t === nodeId;
    });

  // // 何も選択されていない場合
  // if (!nodeId) {
  //   return <div className="p-4">ノードを選択してください</div>;
  // }

  return (
    <div>
      <div className="information-header">キーワードと詳細</div>
        <div className="list-content">
        {/* キーワード一覧 */}
        <h2 className="text-xl font-bold mb-4">キーワード</h2>
        {keywords.length === 0 ? (
          <div className="mb-4">キーワードは登録されていません</div>
        ) : (
          <div className="mb-4">
            {keywords.map((k) => (
              <div key={k} className="keyword-item">
                <span onClick={() => setKeyword(k)} className="keyword-link">
                  {k}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* この思想家が影響を与えた相手 */}
        {/* <h2 className="text-xl font-bold mb-2">この思想家が影響を与えた相手</h2>
        {edgesFrom.length === 0 ? (
          <div className="mb-4">該当なし</div>
        ) : (
          <div>
            {edgesFrom.map((link) => {
              const targetId =
                typeof link.target === "object" ? link.target.id : link.target;
              const targetName =
                processed_data.names.find((n) => n.name_id === targetId)?.name ||
                `ID: ${targetId}`;

              // relation_id → ラベル変換
              const relationLabel =
                RELATION_ID_MAP[link.relation_id] || link.relation_id;

              return (
                <div key={link.index} className="relation-item">
                  <div className="relation-main">
                    {targetName}（{relationLabel}）
                  </div>
                  {/* 説明があれば表示 */}
                  {/* {link.relation_info && (
                    <div className="relation-info">{link.relation_info}</div>
                  )}
                </div>
              );
            })}
          </div> */}
        {/* )}} */}

        
        {/* この思想家が影響を受けた相手 */}
        <h2 className="text-xl font-bold mt-4 mb-2">影響を与えた思想家とその詳細</h2>
        {edgesTo.length === 0 ? (
          <div className="mb-4">該当なし</div>
        ) : (
          <div>
            {edgesTo.map((link) => {
              const sourceId =
                typeof link.source === "object" ? link.source.id : link.source;
              const sourceName =
                processed_data.names.find((n) => n.name_id === sourceId)?.name ||
                `ID: ${sourceId}`;

              const relationLabel =
                RELATION_ID_MAP[link.relation_id] || link.relation_id;

              return (
                <div key={link.index} className="relation-item">
                  <div className="relation-main">
                    {sourceName}（{relationLabel}）
                  </div>
                  {link.relation_info && (
                    <div className="relation-info">{link.relation_info}</div>
                  )}
                </div>
              );
            })}
          </div>
        )}
       
      </div>
    </div>
  );
}
export default List;