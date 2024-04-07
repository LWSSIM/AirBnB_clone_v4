$(document).ready(function () {
  const amenity = {};

  $('li input[type=checkbox]').change(function () {
    const count = $('li input[type=checkbox]:checked').length;
    if (this.checked) {
      amenity[$(this).data('id')] = $(this).data('name');
    } else {
      delete amenity[$(this).data('id')];
    }
    const names = Object.values(amenity);

    if (names.length === 0) {
      $('.amenities h4').html('&nbsp;');
    } else if (names.length > 0 && count <= 3) {
      $('.amenities h4').text(names.sort().join(', '));
    } else if (count > 3) {
      $('.amenities h4').text(names.sort().slice(0, 3).join(', ') + '...');
    }
  });
});
