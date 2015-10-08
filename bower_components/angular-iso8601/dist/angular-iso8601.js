angular.module('rt.iso8601', []).factory('iso8601', function () {
  function toInt(val) {
    return parseInt(val, 10);
  }
  return {
    parse: function parse(str) {
      var year;
      var month;
      var day;
      var hours;
      var minutes;
      var seconds;
      // Default time to midnight.
      hours = minutes = seconds = 0;
      if (!str || str.length === 0) {
        return null;
      }
      if (str.length >= 10) {
        var datePieces = str.substring(0, 10).split('-');
        year = toInt(datePieces[0]);
        month = toInt(datePieces[1]) - 1;
        day = toInt(datePieces[2]);
      }
      if (str.length >= 11) {
        var timePieces = str.substring(11).split(':');
        hours = toInt(timePieces[0]);
        minutes = toInt(timePieces[1]);
        seconds = toInt(timePieces[2]);
      }
      return new Date(year, month, day, hours, minutes, seconds, 0);
    }
  };
});