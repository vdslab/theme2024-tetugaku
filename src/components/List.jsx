import { useEffect, useState } from "react";

function List({ processed_data, nodeId, highlightNode }) {
    const [keyword,setKeyword] = useState("");

    const handleClick = (e) => {
        setKeyword(e.target.textContent);
    }

    const keywords = [];
    
    processed_data.keywords.forEach(t => t.name_id === nodeId && keywords.push(t.keyword));


    // todo keywordマウスオーバー時の挙動(css)
    // 選択したkeywordを持つ思想家のname_idを取得

    useEffect(() => {
        const s = new Set();
        keyword && processed_data.keywords.forEach((t) => {
            t.keyword === keyword && s.add(t.name_id);
        })
        highlightNode([...s]);
    },[keyword])
    
    // todo 影響を与えた(与えられた哲学者のリスト)
    

    return (
      <div>
        <h1>キーワード</h1>
        {   
            keywords.map((t) => {
                return (
                    <div key={t}>
                        <span onClick={handleClick} id="mylink">{t}</span>
                    </div>
            )})
        }
      </div>
    );
}
  
export default List;