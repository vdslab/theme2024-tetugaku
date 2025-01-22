import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";

function NetworkGraph({ processed_data, onNodeClick, selectedNodeId, selectedGroupId, handleRenderComplete }) {
  const [data, setData] = useState(null);
  const svgRef = useRef(null);
  const [initialMount,setInitialMount] = useState(true);
  const linkRef = useRef(null);

  const [stateA,setStateA] = useState(false);
  const [stateB,setStateB] = useState(false);
  const [stateC,setStateC] = useState(false);

  // todo できればiroCd(変更していい)を使ってまとめたい
  const iroCd = [
    {'M':"red"},
    {'N':"blue"},
    {'U':"green"}
  ]

  // デバッグ用
  function handleClick(){
    setStateA(!stateA);
    setStateB(!stateB);
    setStateC(!stateC);
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
      .translate(250 - x * 2, 250 - y * 2)
      .scale(2);

      // プラトンの初期座標値はここで取得
      console.log(x);
      console.log(y);
      
      svg
        .transition()
        .duration(750)
        .call(zoomInstance.current.transform, toCenter);
    };

    // ノードクリックでノードとエッジをハイライト表示
    const highlightByNodeClick = (e, clickedNode) => {
      const nearests = nearestNodeList.current[clickedNode.id];

      node
        .transition()
        .duration(300)
        .attr("fill-opacity", (d) => {
          return d.id === clickedNode.id || nearests.has(d.id) ? 1 : 0.5;
        });

      link
        .transition()
        .duration(300)
        .attr("stroke-opacity", (l) => {
          const sourceId =
            typeof l.source === "object" ? l.source.id : l.source;
          const targetId =
            typeof l.target === "object" ? l.target.id : l.target;

          return sourceId === clickedNode.id || targetId === clickedNode.id
            ? 1
            : 0.1;
        });
    };

    const svg = d3
      .select(svgRef.current)
      // viewBox(minx,miny,w,h) w,hは初期描画範囲の設計
      // -> 値が大きいほどグラフも大きくなる
      .attr("viewBox", `0 0 500 440`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .call(zoomInstance.current);

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

    // シミュレーション設定
    const simulation = d3
      .forceSimulation(data.nodes)
      .force(
        "link",
        d3.forceLink(data.links).id(function (d) {
          return d.id;
        })
      )
      .force("charge", d3.forceManyBody(0).strength(-100))
      .force("center", d3.forceCenter(250, 250));

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

  // selectedNodeIdを持つノードを中心に移動
  useEffect(() => {
    if (initialMount || !data || !selectedNodeId) return;
    const selectedNode = data.nodes.find((node) => node.id === selectedNodeId);
    if (selectedNode) {
      const x = selectedNode.x;
      const y = selectedNode.y;
      const toCenter = d3.zoomIdentity.translate(250 - x, 250 - y);
      d3.select(svgRef.current)
        .transition()
        .duration(750)
        .call(zoomInstance.current.transform, toCenter);
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
    const x = 323.9262121518633;
    const y = 169.9527236526979;
    const toCenter = d3.zoomIdentity.translate(250 - x, 250 - y);
    d3.select(svgRef.current)
      .transition()
      .duration(750)
      .call(zoomInstance.current.transform, toCenter);
  },[])

  useEffect(() => {
    if(initialMount)return;
    // relation_idの取得
    console.log(linkRef.current.nodes()[0].__data__.relation_id);
    console.log(stateA)
    if(stateA){
      linkRef.current.nodes().forEach((t) => {
        if(t.__data__.relation_id === 'M'){
          console.log("A")
          d3.select(t).attr("stroke","red");
        }
      })
    }else{
      linkRef.current.nodes().forEach((t) => {
        d3.select(t).attr("stroke","black");
      })
    }
    if(stateB){
      linkRef.current.nodes().forEach((t) => {
        if(t.__data__.relation_id === 'N'){
          d3.select(t).attr("stroke","blue");
        }
      })
    }else{
      linkRef.current.nodes().forEach((t) => {
        d3.select(t).attr("stroke","black");
      })
    }
    if(stateC){
      linkRef.current.nodes().forEach((t) => {
        if(t.__data__.relation_id === 'U'){
          d3.select(t).attr("stroke","green");
        }
      })
    }else{
      linkRef.current.nodes().forEach((t) => {
        d3.select(t).attr("stroke","black");
      })
    }
  },[stateA,stateB,stateC])

  return (
    <>
      <button onClick={handleClick}>切り替え</button>
      <svg ref={svgRef} className="network-graph"></svg>
    </>
  );
}

export default NetworkGraph;
