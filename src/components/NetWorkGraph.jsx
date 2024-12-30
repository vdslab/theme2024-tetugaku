import { useEffect, useState ,useRef} from "react";
import * as d3 from 'd3';


function NetworkGraph({processed_data,onNodeClick}) {
    const [data,setData] = useState(null);
    const svgRef = useRef(null);

    // useRefにズーム用インスタンスを保存
    const zoomInstance = useRef(
      d3.zoom().on("zoom", (event) => {
        // "g" 要素に対して transform を適用
        d3.select(svgRef.current).select("g.main-group").attr("transform", event.transform);
      })
    );

    useEffect(() => {
        setData(processed_data);

        if(!data)return;

        const selectByNodeClick = (e,clickedNode) => {
            onNodeClick(clickedNode.id);
        };

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


        const svg = d3.select(svgRef.current)
            // viewBox(minx,miny,w,h) w,hは初期描画範囲の設計　
            // -> 値が大きいほどグラフも大きくなる 
            .attr("viewBox", `0 0 500 415`)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .call(zoomInstance.current);

        const svgGroup = svg.append("g").attr("class", "main-group");
        
        // scaleOrdinalの引数は色範囲
        // 後程でるgroupの個数がドメイン
        // ドメインの長さが範囲を超過する場合、範囲が循環して利用される   
        const color = d3.scaleOrdinal(d3.schemePaired);

        const link = svgGroup.append("g")
            .attr("class", "link")
            .selectAll("line")
            .data(data.links)
            .enter().append("line")
            .attr("stroke-width", function(d) { return Math.sqrt(d.value); })
            .attr("stroke", "black")
            .attr("stroke-opacity", 0.6);

        const node = svgGroup.append("g")
            .attr("class","node")
            .selectAll("circle")
            .data(data.nodes)
            .enter().append("circle")
            .attr("r",7)
            .attr("fill",function(d){ return color(d.group);})
            .on("click.select", selectByNodeClick)
            .on("click.zoom", zoomByNodeClick);

        const simulation = d3.forceSimulation(data.nodes)
            .force("link", d3.forceLink(data.links).id(function(d) { return d.id; }))
            .force("charge", d3.forceManyBody(0).strength(-100))
            .force("center", d3.forceCenter(250, 250));

        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);
            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);
        });

        // 再描画時にsvg内の要素を全て削除
        return () => {
            svg.selectAll("*").remove();
        };
        
    
    },[data])

    return (
        <svg ref={svgRef} className="network-graph" >
        </svg>
    );
};

export default NetworkGraph;