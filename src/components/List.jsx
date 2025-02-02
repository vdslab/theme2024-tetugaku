import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import "./List.css";

// relation_id をラベルに変換
const RELATION_ID_MAP = {
  U: "弁証法的影響",
  A: "肯定的影響",
  N: "批判的影響",
  M: "師弟関係",
};

const RELATION_DESCRIPTION = {
  U: "弁証法的影響とは、対立する思想を統合しながら新たな概念を生み出す影響関係を指します。",
  A: "肯定的影響とは、ある思想が別の思想を支持・肯定することで議論を発展させていく影響関係を指します。",
  N: "批判的影響とは、ある思想が別の思想を否定・批判することで新たな議論や発展を生み出す影響関係を指します。",
  M: "師弟関係とは、直接的な教育・指導を通じて影響を与えた関係を指します。",
};

function List({ processed_data, nodeId }) {
  const keywords = processed_data.keywords
    ? processed_data.keywords
        .filter((t) => t.name_id === nodeId)
        .map((t) => t.keyword)
    : [];

  const edgesTo = processed_data.links.filter((l) => {
    const t = typeof l.target === "object" ? l.target.id : l.target;
    return t === nodeId;
  });

  return (
    <div>
      <div className="information-header">キーワードと詳細adwdwdadwaqqqqqq</div>
      <div className="list-content">
        {/* キーワード一覧 */}
        <h2 className="text-xl font-bold mb-4">キーワード</h2>
        {keywords.length === 0 ? (
          <div className="mb-4">キーワードは登録されていません</div>
        ) : (
          <div className="mb-4">
            {keywords.map((k) => (
              <div key={k} className="keyword-item">
                <div className="keyword-link">{k}</div>
              </div>
            ))}
          </div>
        )}

        {/* この思想家が影響を受けた相手 */}
        <h2 className="text-xl font-bold mt-4 mb-2">
          影響を与えた思想家とその詳細
        </h2>
        {edgesTo.length === 0 ? (
          <div className="mb-4">該当なし</div>
        ) : (
          <div>
            {edgesTo.map((link) => {
              const sourceId =
                typeof link.source === "object" ? link.source.id : link.source;
              const sourceName =
                processed_data.names.find((n) => n.name_id === sourceId)
                  ?.name || `ID: ${sourceId}`;

              const relationLabel =
                RELATION_ID_MAP[link.relation_id] || link.relation_id;

              const relationDescription =
                RELATION_DESCRIPTION[link.relation_id] || "説明がありません";

              return (
                <div key={link.index} className="relation-item">
                  <div className="relation-main">
                    {sourceName}（{relationLabel}
                    {/* info アイコンの追加 */}
                    <span className="info-icon">
                      <FaInfoCircle />
                      <span className="tooltip">{relationDescription}</span>
                    </span>
                    ）
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
