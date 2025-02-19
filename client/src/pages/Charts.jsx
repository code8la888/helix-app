import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { Colors } from "chart.js";
Chart.register(Colors);
import axios from "axios";

export default function Charts({ id }) {
  const chartRefs = useRef({});
  const [chartData, setChartData] = useState(null);

  async function fetchData() {
    const res = await axios(`/api/strains/${id}`);
    return res.data;
  }

  async function processData() {
    const data = await fetchData();

    // 計算小鼠使用數量
    const usageData = data.mice
      .filter((mouse) => mouse.on_shelf === "已移出")
      .map((mouse) => new Date(mouse.sampling_date).toISOString().slice(0, 7)) //日期格式：2025-02-20T00:00:00.000Z
      .reduce((acc, month) => {
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});

    setChartData([
      {
        id: "onShelfChart",
        type: "bar", // 圖表類型
        label: "小鼠存活狀況分析", // 圖表標題
        data: data.mice.reduce((acc, mouse) => {
          acc[mouse.on_shelf] = (acc[mouse.on_shelf] || 0) + 1;
          return acc;
        }, {}),
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
        ],
      },
      {
        id: "usageChart",
        type: "line",
        label: "每月小鼠使用率",
        data: usageData,
        borderColor: ["rgb(153, 102, 255)"],
        backgroundColor: ["rgb(153, 102, 255)"],
      },
      {
        id: "genderChart",
        type: "pie",
        label: "性別比例分析",
        data: data.mice.reduce((acc, mouse) => {
          acc[mouse.gender] = (acc[mouse.gender] || 0) + 1;
          return acc;
        }, {}),
      },
      {
        id: "birthChart",
        type: "line",
        label: "出生率趨勢分析",
        data: data.mice
          .map((m) => new Date(m.birth_date).toISOString().slice(0, 7))
          .reduce((acc, date) => {
            acc[date] = (acc[date] || 0) + 1;
            return acc;
          }, {}),
        borderColor: ["#FF9F40"],
        backgroundColor: ["#FF9F40"],
      },
    ]);
  }

  function createOrUpdateCharts() {
    if (!chartData) return;

    chartData.forEach(
      ({ id, type, label, data, backgroundColor, borderColor }) => {
        const ctx = document.getElementById(id);

        if (!ctx) return;

        if (chartRefs.current[id]) {
          // 更新現有圖表數據
          chartRefs.current[id].data.labels = Object.keys(data);
          chartRefs.current[id].data.datasets[0].data = Object.values(data);
          chartRefs.current[id].update();
        } else {
          // 初始化圖表
          chartRefs.current[id] = new Chart(ctx, {
            type, // 圖表類型
            data: {
              labels: Object.keys(data), // x軸標題，從data取得標籤
              datasets: [
                {
                  label, // 圖表標題
                  data: Object.values(data), //對應labels的數值 ( y軸數值 )
                  backgroundColor,
                  borderColor,
                  fill: type === "line" ? false : undefined,
                },
              ],
            },
            options: {
              plugins: {
                legend: {
                  labels: {
                    display: true,
                    text: label,
                    font: {
                      size: 20,
                    },
                  },
                },
              },
            },
          });
        }
      }
    );
  }

  useEffect(() => {
    processData();
  }, [id]);

  useEffect(() => {
    createOrUpdateCharts(); // 當數據變更時，更新圖表
  }, [chartData]);

  useEffect(() => {
    return () => {
      Object.values(chartRefs.current).forEach((chart) => chart.destroy());
    };
  }, []);

  return (
    <div className="shadow-lg mt-3 mb-5 p-3 rounded-3">
      <p className="table-title p-0 m-0">圖表分析</p>
      <section className="container-fluid">
        <div className="row row-cols-1 row-cols-md-2 g-4">
          <div className="col d-flex justify-content-center align-items-center">
            <canvas id="birthChart"></canvas>
          </div>
          <div className="col d-flex justify-content-center align-items-center">
            <canvas id="usageChart"></canvas>
          </div>
          <div className="col d-flex justify-content-center align-items-center">
            <canvas id="onShelfChart"></canvas>
          </div>
          <div className="col d-flex justify-content-center align-items-center">
            <canvas id="genderChart"></canvas>
          </div>
        </div>
      </section>
    </div>
  );
}
