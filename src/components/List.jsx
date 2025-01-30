import { useEffect, useState } from "react";

function List({ processed_data, nodeId, highlightNode }){
    const [keyword,setKeyword] = useState("");

    const keywords = processed_data.keywords
      ? processed_data.keywords.filter(t => t.name_id === nodeId).map(t => t.keyword)
      : [];

    // todo keywordマウスオーバー時の挙動(css)
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
  
    return (
      <div>
        <h1>キーワード</h1>
        {keywords.map(k => (
          <div key={k}>
            <span onClick={() => setKeyword(k)} id="mylink">{k}</span>
          </div>
        ))}
  
        <h2>この思想家が影響を与えた相手</h2>
        {edgesTo.map(link => {
          const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
          const sourceName = processed_data.names.find(n => n.name_id === sourceId)?.name;
          return (
            <div key={link.index}>
              {sourceName}（relation_id={link.relation_id}）
            </div>
          );
        })}
  
        <h2>この思想家が影響を受けた相手</h2>
        {edgesFrom.map(link => {
          const targetId = typeof link.target === 'object' ? link.target.id : link.target;
          const targetName = processed_data.names.find(n => n.name_id === targetId)?.name;
          return (
            <div key={link.index}>
              {targetName}（relation_id={link.relation_id}）
            </div>
          );
        })}
      </div>
    );
}
  
export default List;