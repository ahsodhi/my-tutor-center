var findMinDate = function(events) {
  if (events.length > 0) {
    var minDate = Date.parse(events[0].start);
    events.forEach(event => {
      const date = Date.parse(event.start);
      if (date < minDate) {
        minDate = date;
      }
    });
    return new Date(minDate);
  }
}

var findMaxDate = function(events) {
  if (events.length > 0) {
    var maxDate = new Date(events[0].start);
    events.forEach(event => {
      const date = Date.parse(event.start);
      if (date > maxDate) {
        maxDate = date;
      }
    });
    return new Date(maxDate);
  }
}

module.exports = { findMinDate, findMaxDate };
