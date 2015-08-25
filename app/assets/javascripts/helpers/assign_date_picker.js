// Assign Bootstrap DatePicker to Jquery object
App.Helpers.assignDatePicker = function(container, options) {
  var settings = {
        autoclose: false,
        calendarWeeks: false,
        format: "yyyy-mm-dd",
        orientation: "top auto",
        todayBtn: true,
        todayHighlight: true,
        weekStart: 1,
      };

  _.extend(settings, options);

  container.datepicker(settings);
};
