import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Doughnut, Radar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler,
  Title,
  Tooltip,
  Legend
);

/* ============================================================
   SHARED WRAPPER
   ============================================================ */
export const ChartCard = ({ title, subtitle, actions, children, span }) => (
  <div className={`chart-card ${span ? `chart-card-span-${span}` : ''}`}>
    <div className="chart-card-head">
      <div className="chart-card-head-text">
        {title && <h3 className="chart-card-title">{title}</h3>}
        {subtitle && <p className="chart-card-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="chart-card-actions">{actions}</div>}
    </div>
    <div className="chart-card-body">{children}</div>
  </div>
);

/* ============================================================
   CHART 1 — Revenue timeline (dual axis)
   ============================================================ */
export const RevenueTimelineChart = ({ data = [], height = 300 }) => {
  const hasData = data.some((d) => Number(d.revenue) > 0 || Number(d.orders) > 0);

  if (!hasData) {
    return (
      <div style={{ height }} className="chart-empty">
        <i className="fas fa-chart-line"></i>
        <p>No revenue data for this range</p>
      </div>
    );
  }
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: 'Revenue',
        data: data.map((d) => d.revenue),
        borderColor: '#194d26',
        backgroundColor: 'rgba(25, 77, 38, 0.08)',
        fill: true,
        tension: 0.35,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#194d26',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
        borderWidth: 2.5,
        yAxisID: 'y',
      },
      {
        label: 'Orders',
        data: data.map((d) => d.orders),
        borderColor: '#c47a0a',
        backgroundColor: 'transparent',
        borderDash: [4, 4],
        tension: 0.35,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#c47a0a',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
        borderWidth: 2,
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          padding: 12,
          font: { size: 11, weight: '600' },
        },
      },
      tooltip: {
        backgroundColor: '#1c1917',
        padding: 10,
        titleFont: { size: 12, weight: '700' },
        bodyFont: { size: 12 },
        callbacks: {
          label: (ctx) =>
            ctx.dataset.yAxisID === 'y'
              ? ` Revenue: $${Number(ctx.parsed.y).toLocaleString()}`
              : ` Orders: ${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 }, color: '#78716c', maxRotation: 0 },
      },
      y: {
        position: 'left',
        beginAtZero: true,
        grid: { color: '#f2efe9' },
        border: { display: false },
        ticks: {
          font: { size: 10 },
          color: '#78716c',
          callback: (v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`,
        },
      },
      y1: {
        position: 'right',
        beginAtZero: true,
        grid: { display: false },
        border: { display: false },
        ticks: { font: { size: 10 }, color: '#78716c' },
      },
    },
  };

  return (
    <div style={{ height }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

/* ============================================================
   CHART 2 — User growth (stacked bar)
   ============================================================ */
export const UserGrowthChart = ({ data = [], height = 300 }) => {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: 'Customers',
        data: data.map((d) => d.customers),
        backgroundColor: '#4a7c2e',
        borderRadius: 6,
        stack: 'users',
        maxBarThickness: 22,
      },
      {
        label: 'Farmers',
        data: data.map((d) => d.farmers),
        backgroundColor: '#c47a0a',
        borderRadius: 6,
        stack: 'users',
        maxBarThickness: 22,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          padding: 12,
          font: { size: 11, weight: '600' },
        },
      },
      tooltip: { backgroundColor: '#1c1917', padding: 10, cornerRadius: 8 },
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: { font: { size: 10 }, color: '#78716c' },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: { color: '#f2efe9' },
        border: { display: false },
        ticks: { font: { size: 10 }, color: '#78716c', precision: 0 },
      },
    },
  };

  return (
    <div style={{ height }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

/* ============================================================
   CHART 3 — Order status doughnut
   ============================================================ */
export const OrderStatusChart = ({ data = [], height = 280 }) => {
  const palette = [
    '#194d26',
    '#4a7c2e',
    '#7ba05b',
    '#c47a0a',
    '#d4a017',
    '#8b5e3c',
    '#5a8f7b',
    '#a3c585',
  ];

  const chartData = {
    labels: data.map((d) => d.status.replace(/_/g, ' ')),
    datasets: [
      {
        data: data.map((d) => d.total),
        backgroundColor: data.map((_, i) => palette[i % palette.length]),
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          padding: 12,
          font: { size: 11, weight: '600' },
          color: '#57534e',
        },
      },
      tooltip: {
        backgroundColor: '#1c1917',
        padding: 10,
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
            const pct = ((ctx.parsed / total) * 100).toFixed(1);
            return ` ${ctx.label}: ${ctx.parsed} (${pct}%)`;
          },
        },
      },
    },
  };

  return (
    <div style={{ height }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

/* ============================================================
   CHART 4 — Top items (horizontal bar)
   ============================================================ */
export const TopFarmersChart = ({ data = [], height = 300 }) => {
  const chartData = {
    labels: data.map((d) => d.stall_name || d.name || ''),
    datasets: [
      {
        label: 'Revenue',
        data: data.map((d) => Number(d.revenue || 0)),
        backgroundColor: '#194d26',
        borderRadius: 6,
        maxBarThickness: 26,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1c1917',
        padding: 10,
        callbacks: {
          label: (ctx) => ` $${Number(ctx.parsed.x).toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: { color: '#f2efe9' },
        border: { display: false },
        ticks: {
          font: { size: 10 },
          color: '#78716c',
          callback: (v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`,
        },
      },
      y: {
        grid: { display: false },
        ticks: { font: { size: 11, weight: '600' }, color: '#44403c' },
      },
    },
  };

  return (
    <div style={{ height }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

/* ============================================================
   CHART 5 — Top categories (pie)
   ============================================================ */
export const TopCategoriesChart = ({ data = [], height = 280 }) => {
  const palette = ['#194d26', '#4a7c2e', '#7ba05b', '#c47a0a', '#a3c585', '#8b5e3c'];

  const chartData = {
    labels: data.map((d) => d.name),
    datasets: [
      {
        data: data.map((d) => d.count),
        backgroundColor: data.map((_, i) => palette[i % palette.length]),
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          padding: 12,
          font: { size: 11, weight: '600' },
          color: '#57534e',
        },
      },
      tooltip: { backgroundColor: '#1c1917', padding: 10 },
    },
  };

  return (
    <div style={{ height }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

/* ============================================================
   CHART 6 — Ratings radar
   ============================================================ */
export const RatingsRadarChart = ({ data = [], height = 300 }) => {
  const byRating = [5, 4, 3, 2, 1].map((r) => {
    const hit = data.find((d) => d.rating === r);
    return hit ? hit.total : 0;
  });

  const chartData = {
    labels: ['5 ★', '4 ★', '3 ★', '2 ★', '1 ★'],
    datasets: [
      {
        label: 'Reviews',
        data: byRating,
        backgroundColor: 'rgba(25, 77, 38, 0.18)',
        borderColor: '#194d26',
        borderWidth: 2,
        pointBackgroundColor: '#194d26',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#1c1917', padding: 10 },
    },
    scales: {
      r: {
        beginAtZero: true,
        grid: { color: '#ebe8e2' },
        angleLines: { color: '#ebe8e2' },
        pointLabels: { font: { size: 11, weight: '600' }, color: '#57534e' },
        ticks: { display: false, stepSize: 1 },
      },
    },
  };

  return (
    <div style={{ height }}>
      <Radar data={chartData} options={options} />
    </div>
  );
};

/* ============================================================
   CHART 7 — AOV trend
   ============================================================ */
export const AovChart = ({ data = [], height = 240 }) => {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: 'Avg. order value',
        data: data.map((d) => d.value),
        borderColor: '#c47a0a',
        backgroundColor: 'rgba(196, 122, 10, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1c1917',
        padding: 10,
        callbacks: { label: (ctx) => ` $${Number(ctx.parsed.y).toFixed(2)}` },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 }, color: '#78716c' },
      },
      y: {
        beginAtZero: true,
        grid: { color: '#f2efe9' },
        border: { display: false },
        ticks: {
          font: { size: 10 },
          color: '#78716c',
          callback: (v) => `$${v}`,
        },
      },
    },
  };

  return (
    <div style={{ height }}>
      <Line data={chartData} options={options} />
    </div>
  );
};