$(document).ready(function () {
  // task 2 - API status used localhost since 0.0.0.0 didn't work why?
  const apiStatus = 'http://localhost:5001/api/v1/status/';

  $.getJSON(apiStatus, (data) => {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });

  const amenity = {};

  $('li input[type=checkbox]').change(function () {
    if (this.checked) {
      amenity[$(this).data('id')] = $(this).data('name');
    } else {
      delete amenity[$(this).data('id')];
    }
    const names = Object.values(amenity);

    if (names.length === 0) {
      $('.amenities h4').html('&nbsp;');
    } else if (names.length > 0 && names.length <= 3) {
      $('.amenities h4').text(names.sort().join(', '));
    } else if (names.length > 3) {
      $('.amenities h4').text(names.sort().slice(0, 3).join(', ') + '...');
    }
  });
});
