document.addEventListener('DOMContentLoaded', function () {

  fetch('data/sales.json')
    .then(response => response.json())
    .then(data => {

      const events = data.map(item => ({
        title: "₹" + item.totalSales.toLocaleString(),   // ONLY TOTAL SALES SHOWN
        start: item.date,
        allDay: true,
        extendedProps: item.outlets                      // STORE OUTLET DATA
      }));

      const calendar = new FullCalendar.Calendar(
        document.getElementById('calendar'),
        {
          initialView: 'multiMonthYear',
          multiMonthMaxColumns: 3,
          height: 'auto',

          events: events,

          eventDidMount: function(info) {
            let tooltip = "<b>Outlet-wise Sales</b><br>";

            for (let outlet in info.event.extendedProps) {
              tooltip += `${outlet}: ₹${info.event.extendedProps[outlet].toLocaleString()}<br>`;
            }

            info.el.setAttribute("title", tooltip);
          }
        }
      );

      calendar.render();
    });
});
