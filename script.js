document.addEventListener("DOMContentLoaded", function () {

  const calendarEl = document.getElementById("calendar");

  fetch("data/sales.json?v=" + Date.now())
    .then(res => res.json())
    .then(salesData => {

      /* ===============================
         CALCULATE MONTHLY TOTALS
         =============================== */
      const monthlyTotals = {};

      salesData.forEach(item => {
        const date = new Date(item.date);
        const key = `${date.getFullYear()}-${date.getMonth()}`;

        const total = Object.values(item.outlets)
          .reduce((a, b) => a + b, 0);

        monthlyTotals[key] = (monthlyTotals[key] || 0) + total;
      });

      /* ===============================
         BUILD EVENTS
         =============================== */
      const events = salesData.map(item => {
        const totalSales = Object.values(item.outlets)
          .reduce((sum, val) => sum + val, 0);

        return {
          title: `₹${totalSales.toLocaleString("en-IN")}`,
          start: item.date,
          allDay: true,
          extendedProps: item.outlets
        };
      });

      /* ===============================
         INIT CALENDAR
         =============================== */
      const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "multiMonthYear",
        multiMonthMaxColumns: 3,
        height: "auto",

        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: ""
        },

        events,

        /* ✅ OFFICIAL & STABLE SOLUTION */
        multiMonthTitleContent: function (arg) {

          const year = arg.date.getFullYear();
          const month = arg.date.getMonth();
          const key = `${year}-${month}`;
          const total = monthlyTotals[key] || 0;

          const monthName = arg.text; // "January 2025"

          return {
            html: `
              <div>
                <div>${monthName}</div>
                <div class="month-total-inline">
                  Total = ₹ ${total.toLocaleString("en-IN")}
                </div>
              </div>
            `
          };
        },

        /* TOOLTIP */
        eventDidMount: function (info) {

          const tooltip = document.createElement("div");
          tooltip.className = "sales-tooltip";

          let html = `<div class="tooltip-title">Outlet-wise Sales</div>`;

          Object.entries(info.event.extendedProps).forEach(([outlet, value]) => {
            html += `
              <div class="tooltip-row">
                <span>${outlet}</span>
                <span>₹${value.toLocaleString("en-IN")}</span>
              </div>
            `;
          });

          tooltip.innerHTML = html;
          document.body.appendChild(tooltip);

          info.el.addEventListener("mouseenter", () => tooltip.style.display = "block");
          info.el.addEventListener("mousemove", e => {
            tooltip.style.left = e.pageX + 12 + "px";
            tooltip.style.top = e.pageY + 12 + "px";
          });
          info.el.addEventListener("mouseleave", () => tooltip.style.display = "none");
        }

      });

      calendar.render();
    });
});
