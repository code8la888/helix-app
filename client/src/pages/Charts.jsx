import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { Colors } from "chart.js";
Chart.register(Colors);

export default function Charts({ id }) {
  const chartRefs = useRef({});

  async function fetchData() {
    const res = await fetch(`/api/strains/${id}`);
    const data = await res.json();
    return data;
  }

  async function createCharts() {
    const data = await fetchData();
    console.log(data);

    const usageData = data.mice
      .filter((mouse) => mouse.on_shelf === "已移出") // 只統計「已移出」的小鼠
      .map((mouse) => new Date(mouse.sampling_date).toISOString().slice(0, 7)) // 取出年月
      .reduce((acc, month) => {
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});

    const chartsData = [
      {
        id: "onShelfChart",
        type: "bar",
        label: "小鼠存活狀況分析",
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
    ];

    chartsData.forEach(
      ({ id, type, label, data, backgroundColor, borderColor }) => {
        const ctx = document.getElementById(id);

        if (chartRefs.current[id]) {
          chartRefs.current[id].destroy(); // 銷毀舊圖表
        }

        chartRefs.current[id] = new Chart(ctx, {
          type,
          data: {
            labels: Object.keys(data),
            datasets: [
              {
                label,
                data: Object.values(data),
                backgroundColor,
                borderColor,
                fill: type === "line" ? false : undefined,
              },
            ],
            options: {
              plugins: {
                legend: {
                  labels: {
                    display: true,
                    text: label,
                    font: {
                      size: 28,
                    },
                  },
                },
              },
            },
          },
        });
      }
    );
  }

  useEffect(() => {
    createCharts();
    return () => {
      Object.values(chartRefs.current).forEach((chart) => chart.destroy());
    };
  }, []);

  return (
    <div className="shadow-lg mt-3 mb-5 p-3 rounded-3">
      <p className="table-title">圖表分析</p>
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
