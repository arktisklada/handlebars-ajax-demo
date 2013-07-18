// The primary difference in this application is using only one AJAX call to handle all of the requests, so we don't need to keep writing ajax calls

var pointer = 0;


function ajaxRequest(url, callback) {
  $.ajax({
    url: url,
    type: 'GET',
    async: true,
    success: function(data) {
      callback(data);
    }
  });
}



function populateCountries() {
  if(pointer !== false) {
    var step = parseInt($('#step-input').val());

    ajaxRequest('/countries/' + step + '/' + pointer, populateCountriesRequestCallback)
  }
}
function populateCountriesRequestCallback(data) {
  var content = $('#content');
  var template = Handlebars.compile($('#country-template').html());
  if(data == false) {
    pointer = false;
  } else {
    _.each(data, function(country) {
      content.append(template(country));
      content.children().last().click(function() {
        ajaxRequest('/country/' + country.id, countryClickRequestCallback);
      });
    });
    pointer += data.length;
  }
}

function countryClickRequestCallback(data) {
  alert("Country id id " + data.id + " and added on: " + data.created_at);
}



function populateAll() {
  step = 300;
  offset = 0;

  ajaxRequest('/countries/' + step + '/' + offset, populateAllRequestCallback);
}
function populateAllRequestCallback(data) {
  var content = $('#content');
  var template = Handlebars.compile($('#all-template').html());
  Handlebars.registerPartial("country", $('#country-template').html());

  content.append(template({countries: data}));
}



// Create the event bindings
$(document).ready(function() {
  // Demonstrates using a function name as the event handler instead of including the function inside (like we're used to seeing)
  // This is useful when re-binding events (certain events are unbound when clicking on the various buttons)
  $('#populate-button').click(populateCountries);
  $('#all-button').click(allButtonClick);
  $('#reset-button').click(function() {
    // this function resets the button and scroll bindings, and sets pointer to 0
    pointer = 0;
    $('#content').html('');
    $(window).unbind('scroll').scroll(scrollFunction);
    $('#populate-button').unbind('click').click(populateCountries);
    $('#all-button').unbind('click').click(allButtonClick);
  });

  $(window).scroll(scrollFunction);

  function scrollFunction() {
    var win = $(window);
    // Infinite scroll math!
    if(win.height() + win.scrollTop() >= $(document).height()) {
      populateCountries();
    }
  }

  // Disables other buttons and scroll event so we don't get duplicate data
  // This serves as a demonstration; we could also just set pointer = false
  function allButtonClick() {
    $(window).unbind('scroll');
    $('#populate-button').unbind('click');
    $('#all-button').unbind('click');
    populateAll();
  }

});
