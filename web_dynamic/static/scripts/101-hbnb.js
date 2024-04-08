$(document).ready(function () {
  const HOST = 'localhost';

  // Function to update locations based on states and cities
  function updateLocations (states, cities) {
    const locations = { ...states, ...cities };
    const number = Object.keys(locations).length;
    const $locationsHeader = $('.locations h4');
    if (number === 0) {
      $locationsHeader.html('&nbsp;');
    } else if (number < 4) {
      $locationsHeader.text(Object.values(locations).join(', '));
    } else {
      $locationsHeader.text(`${number} locations`);
    }
  }

  // Function to handle changes in filters (states, cities, amenities)
  function handleFilterChange (category, filter) {
    category[filter.data('id')] = filter.data('name');
    updateLocations(states, cities);
  }

  // Event handler for state and city filters
  $('#state_filter, #city_filter').click(function () {
    const category = $(this).attr('id').includes('state') ? states : cities;
    if ($(this).is(':checked')) {
      handleFilterChange(category, $(this));
    } else {
      delete category[$(this).data('id')];
      updateLocations(states, cities);
    }
  });

  // Event handler for amenity checkboxes
  $('.amenities input[type="checkbox"]').click(function () {
    const amenityId = $(this).data('id');
    if ($(this).is(':checked')) {
      amenities[amenityId] = $(this).data('name');
    } else {
      delete amenities[amenityId];
    }
    const number = Object.keys(amenities).length;
    const $amenitiesHeader = $('.amenities h4');
    if (number === 0) {
      $amenitiesHeader.html('&nbsp;');
    } else if (number < 4) {
      $amenitiesHeader.text(Object.values(amenities).join(', '));
    } else {
      $amenitiesHeader.text(`${number} amenities`);
    }
  });

  // Function to perform search with filters
  function search (filters = {}) {
    $.ajax({
      type: 'POST',
      url: `http://${HOST}:5001/api/v1/places_search`,
      data: JSON.stringify(filters),
      dataType: 'json',
      contentType: 'application/json',
      success: function (data) {
        const $placesSection = $('SECTION.places');
        $placesSection.empty();
        data.forEach(function (place) {
          const template = `
                    <article>
                        <div class="title_box">
                            <h2>${place.name}</h2>
                            <div class="price_by_night">$${place.price_by_night}</div>
                        </div>
                        <div class="information">
                            <div class="max_guest">${place.max_guest} Guests${place.max_guest !== 1 ? 's' : ''}</div>
                            <div class="number_rooms">${place.number_rooms} Bedrooms${place.number_rooms !== 1 ? 's' : ''}</div>
                            <div class="number_bathrooms">${place.number_bathrooms} Bathrooms${place.number_bathrooms !== 1 ? 's' : ''}</div>
                        </div>
                        <div class="description">
                            ${place.description}
                            <br>
                            <div class="reviews hidden">
                                <h2>Reviews<span class="toggle-reviews">show</span></h2>
                                <ul></ul>
                            </div>
                        </div>
                    </article>`;
          const $template = $(template);
          $placesSection.append($template);
          const $toggleReviews = $template.find('.toggle-reviews');
          const $reviews = $template.find('.reviews');
          $toggleReviews.click(function () {
            if ($reviews.hasClass('hidden')) {
              // Fetch and display reviews
              $.get(`http://${HOST}:5001/api/v1/places/${place.id}/reviews`, function (reviews) {
                const $ul = $reviews.find('ul');
                reviews.forEach(function (review) {
                  const reviewHTML = `
                                    <li>
                                        <h3>From ${review.user} the ${review.date}</h3>
                                        <p>${review.text}</p>
                                    </li>`;
                  $ul.append(reviewHTML);
                });
                $reviews.removeClass('hidden');
                $toggleReviews.text('hide');
              });
            } else {
              // Hide reviews
              $reviews.addClass('hidden').find('ul').empty();
              $toggleReviews.text('show');
            }
          });
        });
      }
    });
  }

  // Event handler for search button click
  $('button').click(function () {
    const filters = {
      states: Object.keys(states),
      cities: Object.keys(cities),
      amenities: Object.keys(amenities)
    };
    search(filters);
  });

  // Initial API status check
  $.get(`http://${HOST}:5001/api/v1/status/`, function (data) {
    const $apiStatusDiv = $('DIV#api_status');
    if (data.status === 'OK') {
      $apiStatusDiv.addClass('available');
    } else {
      $apiStatusDiv.removeClass('available');
    }
  });

  // Initial search with no filters
  search();

  // Initialize states, cities, and amenities objects
  const states = {};
  const cities = {};
  const amenities = {};
});
