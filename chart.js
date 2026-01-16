let monthlySalesChart = null;

function renderMonthlySalesChart(monthlyTotals) {
  const ctx = document.getElementById("monthlySalesChart");
  if (!ctx) { console.error("Canvas #monthlySalesChart not found"); return; }

  if (monthlySalesChart) monthlySalesChart.destroy();

  const labels = [];
  const values = [];

  Object.keys(monthlyTotals)
    .sort((a, b) => {
      const [y1, m1] = a.split("-");
      const [y2, m2] = b.split("-");
      return new Date(y1, m1) - new Date(y2, m2);
    })
    .forEach(key => {
      const [year, month] = key.split("-");
      const date = new Date(year, month);
      labels.push(date.toLocaleString("en-IN", { month: "short", year: "numeric" }));
      values.push(monthlyTotals[key].total);
    });

  monthlySalesChart = new Chart(ctx.getContext("2d"), {
    type: "bar",
    data: { labels, datasets: [{ label: "Total Sales", data: values, backgroundColor: "#2563eb", borderRadius: 10 }] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => `₹${ctx.parsed.y.toLocaleString("en-IN")}` } } },
      scales: { x: { grid: { display: false } }, y: { ticks: { callback: v => `₹${v.toLocaleString("en-IN")}` }, grid: { color: "#e5e7eb" } } }
    }
  });
}
