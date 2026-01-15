document.addEventListener("DOMContentLoaded", function () {

  const calendarEl = document.getElementById("calendar");

  fetch("data/sales.json")
    .then(response => response.json())
    .then(salesData => {

      /* ===============================
         BUILD CALENDAR EVENTS
         =============================== */

      const events = salesData.map(item => {

        const totalSales = Object.values(item.outlets)
          .reduce((sum, val) => sum + val, 0);

        return {
          title: `₹${totalSales.toLocaleString()}`,
          start: item.date,
          allDay: true,
          extendedProps: item.outlets
        };
      });

      /* ===============================
         INITIALIZE CALENDAR
         =============================== */

      const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        initialDate: salesData[0].date,
        height: "auto",
        fixedWeekCount: false,
        showNonCurrentDates: false,

        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: ""
        },

        events: events,

        /* ===============================
           CUSTOM TOOLTIP
           =============================== */

        eventDidMount: function (info) {

          const tooltip = document.createElement("div");
          tooltip.className = "sales-tooltip";

          let html = `<div class="tooltip-title">Outlet-wise Sales</div>`;

          Object.entries(info.event.extendedProps).forEach(([outlet, value]) => {
            html += `
              <div class="tooltip-row">
                <span>${outlet}</span>
                <span>₹${value.toLocaleString()}</span>
              </div>
            `;
          });

          tooltip.innerHTML = html;
          document.body.appendChild(tooltip);

          info.el.addEventListener("mouseenter", () => {
            tooltip.style.display = "block";
          });

          info.el.addEventListener("mousemove", (e) => {
            tooltip.style.left = e.pageX + 15 + "px";
            tooltip.style.top = e.pageY + 15 + "px";
          });

          info.el.addEventListener("mouseleave", () => {
            tooltip.style.display = "none";
          });
        }
      });

      calendar.render();
    })
    .catch(err => {
      console.error("Error loading sales-data.json", err);
    });

});
