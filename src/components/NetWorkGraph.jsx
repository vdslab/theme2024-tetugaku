import FetchData from "./FetchData";
import { useEffect,useState } from "react";
import * as d3 from 'd3';


function NetworkGraph() {
    const [data,setData] = useState(null);

    // FetchDataを呼び出して、その返り値(Promise)を処理する
    useEffect(() => {
        FetchData()
          .then(data => {
            console.log("get data");
            setData(data);
          })
          .catch(err => {
            console.error("not get error:", err);
          });
    },[]);

    useEffect(() => {
        // dataが入っているときに、描画を行う

        if(!data)console.log("dont have data")
        else{
            console.log(data);
            console.log("have data");
            // .network-graphでsvg指定
            const svg = d3.select(".network-graph")
                // viewBox(minx,miny,w,h) w,hは初期描画範囲の設計　
                // -> 値が大きいほどグラフも大きくなる 
                .attr("viewBox", `0 0 500 415`)
                .attr("preserveAspectRatio", "xMidYMid meet");
            
            // scaleOrdinalの引数は色範囲
            // 後程でるgroupの個数がドメイン
            // ドメインの長さが範囲を超過する場合、範囲が循環して利用される   
            const color = d3.scaleOrdinal(d3.schemePaired);

            const link = svg.append("g")
                .attr("class", "link")
                .selectAll("line")
                .data(data.links)
                .enter().append("line")
                .attr("stroke-width", function(d) { return Math.sqrt(d.value); })
                .attr("stroke", "black")
                .attr("stroke-opacity", 0.6);

            const node = svg.append("g")
                .attr("class","node")
                .selectAll("circle")
                .data(data.nodes)
                .enter().append("circle")
                .attr("r",7)
                .attr("fill",function(d){ return color(d.group);})
                .on("click", (e,d) => {
                    // 第一引数はポインタイベント
                    // 第二引数がデータオブジェクト
                    onNodeClick(d.id)
                })

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
        }
    
    },[data])

    return (
        <svg className="network-graph" >

        </svg>
    );
};

export default NetworkGraph;