import * as echarts from "echarts";
import { useEffect, useRef } from "react";

// 图标初始化
function echartInit(node, xData, sData, title) {
  const myChart = echarts.init(node);
  // 绘制图表
  myChart.setOption({
    title: {
      text: title,
    },
    tooltip: {},
    xAxis: {
      data: xData,
    },
    yAxis: {},
    series: [
      {
        name: "销量",
        type: "bar",
        data: sData,
      },
    ],
  });
}

// Bar 组件
function Bar({ style, xData, sData, title }) {
  const nodeRef = useRef(null);
  useEffect(() => {
    echartInit(nodeRef.current, xData, sData, title);
  }, [xData, sData]);
  return <div ref={nodeRef} style={style}></div>;
}

export default Bar;
