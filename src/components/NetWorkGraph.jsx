import { useEffect, useState ,useRef} from "react";
import * as d3 from 'd3';


function NetworkGraph({processed_data,onNodeClick,selectedNodeId}) {
    const [data,setData] = useState(null);
    const svgRef = useRef(null);

    // useRefにズーム用インスタンスを保存
    const zoomInstance = useRef(
      d3.zoom().on("zoom", (event) => {
        // "g" 要素に対して transform を適用
        d3.select(svgRef.current).select("g.main-group").attr("transform", event.transform);
      })
    );

    // 隣接リストの準備
    const nearestNodeList = useRef({});

    useEffect(() => {
        setData(processed_data);

        if(!data)return;

        // ノードクリックでonNodeClickを実行
        const selectByNodeClick = (e,clickedNode) => {
            onNodeClick(clickedNode.id);
        };

        // ノードクリックでノードを中心へ移動
        const zoomByNodeClick = (e,clickedNode) => {
            const x = clickedNode.x;
            const y = clickedNode.y;

            // ノードを中心へ移動   
            const toCenter = d3.zoomIdentity
              .translate(250 - x, 250 - y)

            svg.transition()
               .duration(750)  
               .call(zoomInstance.current.transform, toCenter);
        }

        // ノードクリックでノードとエッジをハイライト表示
        const highlightByNodeClick = (e,clickedNode) => {
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
                const sourceId = typeof l.source === "object" ? l.source.id : l.source;
                const targetId = typeof l.target === "object" ? l.target.id : l.target;

                return sourceId === clickedNode.id || targetId === clickedNode.id ? 1 : 0.1;
            });
        }

        const svg = d3.select(svgRef.current)
            // viewBox(minx,miny,w,h) w,hは初期描画範囲の設計　
            // -> 値が大きいほどグラフも大きくなる 
            .attr("viewBox", `0 0 500 500`)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .call(zoomInstance.current);

        const svgGroup = svg.append("g").attr("class", "main-group");
        
        // scaleOrdinalの引数は色範囲
        // 後程でるgroupの個数がドメイン
        // ドメインの長さが範囲を超過する場合、範囲が循環して利用される   
        const color = d3.scaleOrdinal(d3.schemeCategory10);

        // エッジの描画
        const link = svgGroup.append("g")
            .attr("class", "link")
            .selectAll("line")
            .data(data.links)
            .enter().append("line")
            .attr("stroke-width", function(d) { return Math.sqrt(d.value); })
            .attr("stroke", "black")
            .attr("stroke-opacity", 0.6);

        // ノードの描画
        const node = svgGroup.append("g")
            .attr("class","node")
            .selectAll("circle")
            .data(data.nodes)
            .enter().append("circle")
            .attr("r",7)
            .attr("fill",function(d){ return color(d.group);})
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
            .attr("fill", "#333")
            .text((d) => {
              // names配列の中から対応するIDのオブジェクトを探して name を返す
              const nameObj = data.names?.find((n) => n.name_id === d.id);
              return nameObj ? nameObj.name : d.id;
            });

        // シミュレーション設定
        const simulation = d3.forceSimulation(data.nodes)
            .force("link", d3.forceLink(data.links).id(function(d) { return d.id; }))
            .force("charge", d3.forceManyBody(0).strength(-100))
            .force("center", d3.forceCenter(250, 250));

        // シミュレーション
        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);
            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);

            labels
                .attr("x", (d) => d.x)
                .attr("y", (d) => d.y);
        });

        // 隣接リストの作成
        nearestNodeList.current = {};
        data.nodes.forEach((node) => {
            nearestNodeList.current[node.id] = new Set(); // 重複禁止
        });

        data.links.forEach((link) => {
            // forceシュミレーションが行われる際、source,targetの中身がidになったりobjectになったりするらしい
            const sourceId = typeof link.source === "object" ? link.source.id : link.source;
            const targetId = typeof link.target === "object" ? link.target.id : link.target;
            nearestNodeList.current[sourceId].add(targetId);
            nearestNodeList.current[targetId].add(sourceId);
        });

        // 再描画時にクリーンアップ
        return () => {
            d3.select(svgRef.current).selectAll("*").remove();
        };
    
    },[data])

    // selectedNodeIdを持つノードを中心に移動
    useEffect(() => {
        if (!data || !selectedNodeId) return;

        const selectedNode = data.nodes.find((node) => node.id === selectedNodeId);
        if (selectedNode) {
            const x = selectedNode.x;
            const y = selectedNode.y;

            const toCenter = d3.zoomIdentity.translate(250 - x, 250 - y);

            d3.select(svgRef.current).transition().duration(750).call(zoomInstance.current.transform, toCenter);
        }
    }, [selectedNodeId, data]);    

    return (
        <svg ref={svgRef} className="network-graph" >
        </svg>
    );
};

export default NetworkGraph;