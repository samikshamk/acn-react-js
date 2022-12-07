import React from "react";
import Plot from "react-plotly.js";

function BaseStats(props) {
  const chartData = props.chartData;

  let xArr = [];
  let yArr = [];

  chartData.forEach((value) => {
    xArr.push(value.stat.name);
    yArr.push(value.base_stat);
  });

  return (
    <div className="">
      <Plot
        data={[{ type: "bar", x: xArr, y: yArr }]}
        layout={{ width: "80%", title: "Base Stat" }}
      />
    </div>
  );
}

export default BaseStats;
