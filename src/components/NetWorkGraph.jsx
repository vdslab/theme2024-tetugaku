import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import "./NetworkGraph.css";

function NetworkGraph({
  processed_data,
  onNodeClick,
  selectedNodeId,
  selectedGroupId,
  handleRenderComplete,
  stateM,
  stateN,
  stateU,
  stateA,
}) {
  const [data, setData] = useState(null);
  const svgRef = useRef(null);
  const [initialMount, setInitialMount] = useState(true);
  const linkRef = useRef(null);
  const nodeRef = useRef(null);

  // 有向エッジの集合
  const activeLinkIndicesRef = useRef(new Set());

  // todo 有向エッジの色変更
  const iroCd = {
    M: "#82BC8A", //師弟関係
    N: "#D98050", //批判的影響
    U: "#D06098", //弁証法的影響
    A: "#5B43FF", //肯定的影響
  };

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
  const highlightByNodeClick = (e, clickedNode) => {
    const highlightedEdgeIndices = new Set();
    const highlightedNodeIds = new Set();
    linkRef.current
      .transition()
      .duration(300)
      .attr("stroke-opacity", (l) => {
        const sourceId = typeof l.source === "object" ? l.source.id : l.source;
        const targetId = typeof l.target === "object" ? l.target.id : l.target;

        const isHighlighted1 = sourceId === clickedNode.id || targetId === clickedNode.id;
        const isHighlighted2 = targetId === clickedNode.id;

        // どちらかの条件でリンクをハイライト
        const isEdgeHighlighted =
          isHighlighted2 ||
          (isHighlighted1 && !activeLinkIndicesRef.current.has(l.index));

        // マーカーの透明度を更新
        d3.select(`#arrow-${l.index} path`)
          .transition()
          .duration(300)
          .attr("opacity", () =>
            activeLinkIndicesRef.current.has(l.index)
              ? isHighlighted2
                ? 1
                : 0.15
              : 0
          );

        if (isEdgeHighlighted) {
          highlightedEdgeIndices.add(l.index);
          highlightedNodeIds.add(sourceId);
          highlightedNodeIds.add(targetId);
        }

        return isEdgeHighlighted ? 1 : 0.15;
      });

    nodeRef.current
      .transition()
      .duration(300)
      .attr("fill-opacity", (d) =>
        (clickedNode.id === d.id || highlightedNodeIds.has(d.id)) ? 1 : 0.15
      );
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
        .translate(250 - 2 * x, 250 - 2 * y - 50)
        .scale(2);

      // プラトンの初期座標値はここで取得
      // console.log(x);
      // console.log(y);

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
    defs
      .selectAll("marker")
      .data(data.links)
      .enter()
      .append("marker")
      .attr("id", (d, i) => {
        return `arrow-${i}`;
      })
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 10)
      .attr("refY", 5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,0 L0,10 L10,5 Z")
      .transition()
      .duration(300)
      .attr("fill", (d) => iroCd[d.relation_id]);

    const svgGroup = svg.append("g").attr("class", "main-group");

    // scaleOrdinalの引数は色範囲
    // groupの個数がドメイン
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
      .attr("stroke", "#737373")
      .attr("stroke-opacity", 0.15);

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
      .attr("fill-opacity", 0.15)
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
      .attr("fill", "#737373")
      .text((d) => {
        // names配列の中から対応するIDのオブジェクトを探して name を返す
        const nameObj = data.names?.find((n) => n.name_id === d.id);
        return nameObj ? nameObj.name : d.id;
      });
    linkRef.current = link;
    nodeRef.current = node;

    // シミュレーション設定
    const simulation = d3
      .forceSimulation(data.nodes)
      .force(
        "link",
        d3
          .forceLink(data.links)
          .id((d) => d.id)
          .distance(80)
      )
      .force("charge", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(250, 250))
      .force("x", d3.forceX(250).strength(0.01))
      .force("y", d3.forceY(250).strength(0.01));

    // シミュレーション
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => {
          const dx = d.target.x - d.source.x;
          const dy = d.target.y - d.source.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const offset = 6.5; // 短くする長さ（仮）
          return d.source.x + (dx / dist) * offset;
        })
        .attr("y1", (d) => {
          const dx = d.target.x - d.source.x;
          const dy = d.target.y - d.source.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const offset = 6.5;
          return d.source.y + (dy / dist) * offset;
        })
        .attr("x2", (d) => {
          const dx = d.target.x - d.source.x;
          const dy = d.target.y - d.source.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const offset = 6.5;
          return d.target.x - (dx / dist) * offset;
        })
        .attr("y2", (d) => {
          const dx = d.target.x - d.source.x;
          const dy = d.target.y - d.source.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const offset = 6.5;
          return d.target.y - (dy / dist) * offset;
        });
      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

      labels.attr("x", (d) => d.x).attr("y", (d) => d.y);
    });

    // 初期描画が終了したタイミングでinitialMountflagをおろす
    simulation.on("end", () => {
      setInitialMount(false);
      handleRenderComplete();
    });

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
      const toCenter = d3.zoomIdentity
        .translate(250 - 2 * x, 250 - 2 * y - 50)
        .scale(2);
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
    const groupNodes = data.nodes.filter(
      (node) => node.group === selectedGroupId
    );

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
    const toCenter = d3.zoomIdentity
      .translate(250 - 2 * x, 250 - 2 * y - 50)
      .scale(2);
    d3.select(svgRef.current)
      .transition()
      .duration(750)
      .call(zoomInstance.current.transform, toCenter);
  }, []);

  // 初期レンダリング時にプラトンを選択
  useEffect(() => {
    if (initialMount) return;
    onNodeClick(5);
  }, [initialMount]);

  useEffect(() => {
    if (initialMount) return;

    // 有向エッジの集合を初期化
    activeLinkIndicesRef.current.clear();
    // state変更時、nodeのopacityを初期化
    nodeRef.current.nodes().forEach((t, i) => {
      d3.select(t).transition().duration(300).attr("fill-opacity", 0.15);
    });

    linkRef.current.nodes().forEach((t, i) => {
      let strokeColor = "#737373";
      let strokeOpacity = 0.15;
      let markerEnd = `url(#arrow-${i})`;
      let markerColor = "#737373";
      let markerOpacity = 0;
      if (stateM && t.__data__.relation_id === "M") {
        activeLinkIndicesRef.current.add(i);
        strokeColor = iroCd["M"];
        strokeOpacity = 1;
        markerColor = iroCd["M"];
        markerOpacity = 1;

        nodeRef.current.nodes().forEach((t2, i) => {
          if (
            t2.__data__.id === t.__data__.source.id ||
            t2.__data__.id === t.__data__.target.id
          ) {
            d3.select(t2).transition().duration(300).attr("fill-opacity", 1);
          }
        });
      }

      if (stateN && t.__data__.relation_id === "N") {
        activeLinkIndicesRef.current.add(i);
        strokeColor = iroCd["N"];
        strokeOpacity = 1;
        markerEnd = `url(#arrow-${i})`;
        markerColor = iroCd["N"];
        markerOpacity = 1;

        nodeRef.current.nodes().forEach((t2, i) => {
          if (
            t2.__data__.id == t.__data__.source.id ||
            t2.__data__.id == t.__data__.target.id
          ) {
            d3.select(t2).transition().duration(300).attr("fill-opacity", 1);
          }
        });
      }

      if (stateU && t.__data__.relation_id === "U") {
        activeLinkIndicesRef.current.add(i);
        strokeColor = iroCd["U"];
        strokeOpacity = 1;
        markerEnd = `url(#arrow-${i})`;
        markerColor = iroCd["U"];
        markerOpacity = 1;

        nodeRef.current.nodes().forEach((t2, i) => {
          if (
            t2.__data__.id == t.__data__.source.id ||
            t2.__data__.id == t.__data__.target.id
          ) {
            d3.select(t2).transition().duration(300).attr("fill-opacity", 1);
          }
        });
      }

      if (stateA && t.__data__.relation_id === "A") {
        activeLinkIndicesRef.current.add(i);
        strokeColor = iroCd["A"];
        strokeOpacity = 1;
        markerEnd = `url(#arrow-${i})`;
        markerColor = iroCd["A"];
        markerOpacity = 1;

        nodeRef.current.nodes().forEach((t2, i) => {
          if (
            t2.__data__.id == t.__data__.source.id ||
            t2.__data__.id == t.__data__.target.id
          ) {
            d3.select(t2).transition().duration(300).attr("fill-opacity", 1);
          }
        });
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
  }, [stateM, stateN, stateU, stateA, initialMount]);

  return <svg ref={svgRef} className="network-graph"></svg>;
}

export default NetworkGraph;
