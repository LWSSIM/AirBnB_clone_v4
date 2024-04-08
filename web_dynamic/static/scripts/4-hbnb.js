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

  // task 4 - Fetch places
  $.ajax({
    url: 'http://localhost:5001/api/v1/places_search',
    type: 'POST',
    contentType: 'application/json',
    data: '{}',
    success: (data) => {
      for (const place of data) {
      const template = `
      <article>
        <div class="title_box">
          <h2>${place.name}</h2>
          <div class="price_by_night">$${place.price_by_night}</div>
        </div>
        <div class="information">
          <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
          <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
          <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
        </div>
        <div class="description">
          ${place.description}
        </div>
      </article>`;
      $('section.places').append(template);
      }
    }
  });

  // task 5 - Filter places by amenities
  $('button').click(() => {
    const data = JSON.stringify({ amenities: Object.keys(amenity) });
    $.ajax({
      url: 'http://localhost:5001/api/v1/places_search',
      type: 'POST',
      contentType: 'application/json',
      data,
      success: (data) => {
        $('section.places').empty();
        for (const place of data) {
          const template = `
          <article>
            <div class="title_box">
              <h2>${place.name}</h2>
              <div class="price_by_night">$${place.price_by_night}</div>
            </div>
            <div class="information">
              <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
              <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
              <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
            </div>
            <div class="description">
              ${place.description}
            </div>
          </article>`;
          $('section.places').append(template);
        }
      }
    });
  });
});
