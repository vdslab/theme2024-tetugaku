import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";

function NetworkGraph({ processed_data, onNodeClick, selectedNodeId, selectedGroupId, handleRenderComplete }) {
  const [data, setData] = useState(null);
  const svgRef = useRef(null);
  const [initialMount,setInitialMount] = useState(true);
  const linkRef = useRef(null);
  const nodeRef = useRef(null);

  const [stateM,setStateM] = useState(false);
  const [stateN,setStateN] = useState(false);
  const [stateU,setStateU] = useState(false);

  // todo できればiroCd(変更していい)を使ってまとめたい
  const iroCd = {
    'M':"red",
    'N':"blue",
    'U':"green"
  }
  // デバッグ用
  function handleClickA(){
    setStateM(!stateM);
  }  
  function handleClickB(){
    setStateN(!stateN);
  }
  function handleClickC(){
    setStateU(!stateU);
  }
  // 隣接リストの準備
  const nearestNodeList = useRef({});

  // useRefにズーム用インスタンスを保存
  const zoomInstance = useRef(
    d3.zoom().on("zoom", (event) => {
      // "g" 要素に対して transform を適用
      d3.select(svgRef.current)
        .select("g.main-group")
        .attr("transform", event.transform);
    })
  );

  // ノードクリックでノードとエッジをハイライト表示
  const highlightByNodeClick = (e, clickedNode ) => {
    const nearests = nearestNodeList.current[clickedNode.id];
    nodeRef.current
      .transition()
      .duration(300)
      .attr("fill-opacity", (d) => {
        return d.id === clickedNode.id || nearests.has(d.id) ? 1 : 0.5;
      });
    linkRef.current
      .transition()
      .duration(300)
      .attr("stroke-opacity", (l) => {
        const sourceId =
          typeof l.source === "object" ? l.source.id : l.source;
        const targetId =
          typeof l.target === "object" ? l.target.id : l.target;

        const isHighlighted =
          sourceId === clickedNode.id || targetId === clickedNode.id;

        // マーカーの透明度を更新
        d3.select(`#arrow-${l.index} path`)
          .transition()
          .duration(300)
          .attr("opacity", isHighlighted ? 1 : 0.1);

        return isHighlighted ? 1 : 0.1;
      });
  };

  // グラフの描画
  useEffect(() => {
    setData(processed_data);

    if (!data) return;

    // ノードクリックでonNodeClickを実行
    const selectByNodeClick = (e, clickedNode) => {
      onNodeClick(clickedNode.id);
    };

    // ノードクリックでノードを中心へ移動
    const zoomByNodeClick = (e, clickedNode) => {
      const x = clickedNode.x;
      const y = clickedNode.y;

      // ノードを中心へ移動
      const toCenter = d3.zoomIdentity
      .translate(250 - 2*x, 250 - 2*y-50)
      .scale(2);

      // プラトンの初期座標値はここで取得
      console.log(x);
      console.log(y);
      
      svg
        .transition()
        .duration(750)
        .call(zoomInstance.current.transform, toCenter);
    };


    const svg = d3
      .select(svgRef.current)
      // viewBox(minx,miny,w,h) w,hは初期描画範囲の設計
      // -> 値が大きいほどグラフも大きくなる
      .attr("viewBox", `0 0 500 440`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .call(zoomInstance.current);

    const defs = svg.append("defs");
    console.log("#aaaa")
    defs
      .selectAll("marker")
      .data(data.links)
      .enter()
      .append("marker")
      .attr("id", (d,i) => {
        console.log(i)
        return (
        `arrow-${i}`
      )})
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 21)
      .attr("refY", 5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,0 L0,10 L10,5 Z")
      .attr("fill", (d) => iroCd[d.relation_id]);

    const svgGroup = svg.append("g").attr("class", "main-group");

    // scaleOrdinalの引数は色範囲
    // 後程でるgroupの個数がドメイン
    // ドメインの長さが範囲を超過する場合、範囲が循環して利用される
    const color = d3
      .scaleOrdinal()
      .range(["#5EC2A2", "#626BFF", "#CD55D3", "#FCE94E"]);

    // エッジの描画
    const link = svgGroup
      .append("g")
      .attr("class", "link")
      .selectAll("line")
      .data(data.links)
      .enter()
      .append("line")
      .attr("stroke-width", function (d) {
        return Math.sqrt(d.value);
      })
      .attr("stroke", "black")
      .attr("stroke-opacity", 0.6);

    // ノードの描画
    const node = svgGroup
      .append("g")
      .attr("class", "node")
      .selectAll("circle")
      .data(data.nodes)
      .enter()
      .append("circle")
      .attr("r", 7)
      .attr("fill", function (d) {
        return color(d.group);
      })
      .on("click.select", selectByNodeClick)
      .on("click.zoom", zoomByNodeClick)
      .on("mouseover.highlight", highlightByNodeClick);

    const labels = svgGroup
      .append("g")
      .attr("class", "labels")
      .selectAll("text")
      .data(data.nodes)
      .enter()
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", -10)
      .attr("font-size", "11px")
      .attr("fill", "#454545")
      .text((d) => {
        // names配列の中から対応するIDのオブジェクトを探して name を返す
        const nameObj = data.names?.find((n) => n.name_id === d.id);
        return nameObj ? nameObj.name : d.id;
      });
      linkRef.current = link;
      nodeRef.current = node;

    // シミュレーション設定
    const simulation = d3.forceSimulation(data.nodes)
      .force(
        "link",
        d3.forceLink(data.links)
          .id(d => d.id)
          .distance(70)
      )
      .force("charge", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(250, 250))
      .force("x", d3.forceX(250).strength(0.01))
      .force("y", d3.forceY(250).strength(0.01));

    // シミュレーション
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);
      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

      labels.attr("x", (d) => d.x).attr("y", (d) => d.y);
    });

    // 初期描画が終了したタイミングでinitialMountflagをおろす
    simulation.on("end",() => {
      setInitialMount(false)
      handleRenderComplete();
    })

    // todo 初期描画が終了するまでセレクトボタンを使用できなくする

    // 隣接リストの作成
    nearestNodeList.current = {};
    data.nodes.forEach((node) => {
      nearestNodeList.current[node.id] = new Set(); // 重複禁止
    });

    data.links.forEach((link) => {
      // forceシュミレーションが行われる際、source,targetの中身がidになったりobjectになったりするらしい
      const sourceId =
        typeof link.source === "object" ? link.source.id : link.source;
      const targetId =
        typeof link.target === "object" ? link.target.id : link.target;
      nearestNodeList.current[sourceId].add(targetId);
      nearestNodeList.current[targetId].add(sourceId);
    });

    // 再描画時にクリーンアップ
    return () => {
      d3.select(svgRef.current).selectAll("*").remove();
    };
  }, [data]);

  // selectedNodeIdを持つノードを中心に移動 & ハイライト
  useEffect(() => {
    if (initialMount || !data || !selectedNodeId) return;
    const selectedNode = data.nodes.find((node) => node.id === selectedNodeId);
    if (selectedNode) {
      const x = selectedNode.x;
      const y = selectedNode.y;
      const toCenter = d3.zoomIdentity.translate(250 - 2*x, 250 - 2*y-50).scale(2);
      d3.select(svgRef.current)
        .transition()
        .duration(750)
        .call(zoomInstance.current.transform, toCenter)
        .on("end", () => {
          highlightByNodeClick(null, selectedNode);
        });
    }
  }, [selectedNodeId, data]);

  // selectedGroupIdを持つノードの中心座標(平均)を計算して移動
  useEffect(() => {
    if (!data || !selectedGroupId) return;

    // selectedGroupIdと一致するノードを抽出
    const groupNodes = data.nodes.filter((node) => node.group === selectedGroupId);

    // ノード群の x, y の平均(重心)を計算
    const avgX = d3.mean(groupNodes, (d) => d.x);
    const avgY = d3.mean(groupNodes, (d) => d.y);

    // 重心に向けてズーム
    const toCenter = d3.zoomIdentity.translate(250 - avgX, 250 - avgY).scale(1);

    d3.select(svgRef.current)
      .transition()
      .duration(750)
      .call(zoomInstance.current.transform, toCenter);
  }, [selectedGroupId, data]);

  // プラトンの座標を初期値として登録
  useEffect(() => {
    const x = 306.6817111535429;
    const y = 196.75920984957799;
    const toCenter = d3.zoomIdentity.translate(250 - 2*x, 250 - 2*y-50).scale(2);
    d3.select(svgRef.current)
      .transition()
      .duration(750)
      .call(zoomInstance.current.transform, toCenter);
  },[])

  // 初期レンダリング時にプラトンを選択
  useEffect(()=> {
    if (initialMount) return;
    onNodeClick(5);
  },[initialMount]);


  useEffect(() => {
    if (initialMount) return;
    
    // state変更時、nodeのopacityを初期化 
    nodeRef.current.nodes().forEach((t,i) => {
      d3.select(t).attr("fill-opacity",0.1);
    })

    linkRef.current.nodes().forEach((t,i) => {
      let strokeColor = "black";
      let strokeOpacity = 0.05;
      let markerEnd = null;
      let markerColor = "black";
      let markerOpacity = 0;
      if (stateM && t.__data__.relation_id === "M") {
        strokeColor = "red";
        strokeOpacity = 1;
        markerEnd = `url(#arrow-${i})`;
        markerColor = "red";
        markerOpacity = 1;

        nodeRef.current.nodes().forEach((t2,i) => {
          console.log(t.__data__.source.id)
          if(t2.__data__.id === t.__data__.source.id || t2.__data__.id === t.__data__.target.id){
            d3.select(t2).attr("fill-opacity",1);
          }
        })
      } 
      if (stateN && t.__data__.relation_id === "N") {
        strokeColor = "blue";
        strokeOpacity = 1;
        markerEnd = `url(#arrow-${i})`;
        markerColor = "blue";
        markerOpacity = 1;

        nodeRef.current.nodes().forEach((t2,i) => {
          console.log(t2.__data__)
          if(t2.__data__.id == t.__data__.source.id || t2.__data__.id == t.__data__.target.id){
            d3.select(t2).attr("fill-opacity",1);
          }
        })
      } 
      if (stateU && t.__data__.relation_id === "U") {
        strokeColor = "green";
        strokeOpacity = 1;
        markerEnd = `url(#arrow-${i})`;
        markerColor = "green";
        markerOpacity = 1;

        nodeRef.current.nodes().forEach((t2,i) => {
          console.log(t2.__data__)
          if(t2.__data__.id == t.__data__.source.id || t2.__data__.id == t.__data__.target.id){
            d3.select(t2).attr("fill-opacity",1);
          }
        })
      }
      d3.select(t)
        .transition()
        .duration(300)
        .attr("stroke", strokeColor)
        .attr("stroke-opacity", strokeOpacity)
        .attr("marker-end", markerEnd);

      d3.select(`#arrow-${i} path`)
        .transition()
        .duration(300)
        .attr("fill", markerColor)
        .attr("opacity", markerOpacity);
    });
  }, [stateM, stateN, stateU, initialMount]);



  return (
    <>
      <button onClick={handleClickA}>切り替えA</button>
      <button onClick={handleClickB}>切り替えB</button>
      <button onClick={handleClickC}>切り替えC</button>
      <svg ref={svgRef} className="network-graph"></svg>
    </>
  );
}

export default NetworkGraph;
