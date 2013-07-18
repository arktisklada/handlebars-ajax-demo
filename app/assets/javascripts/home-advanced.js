var pointer = 0;

// This function handles the "Populate" button and scrolling, sending a step value (limit) and pointer (offset) through an ajax function
function populateCountries() {
  // the controller should return json: false if the result set is 0, indicating we have reached the end of the list
  if(pointer !== false) {
    // grab the stepping value (limit)
    var step = parseInt($('#step-input').val());

    // ajax call to /countries/step/pointer (in routes.rb: /countries/:step/:offset)
    $.ajax({
      url: '/countries/' + step + '/' + pointer, // bulding our URL so it matches the route
      type: 'GET', // vs POST
      async: true, // Demonstrate what can happen if async is false and we scroll very fast (we get duplicate data)
      success: function(data) {
        // grab the html content from the template and compile into a handlebars template
        var template = Handlebars.compile($('#country-template').html());
        if(data == false) {
          // if the data returned is false, set pointer to false so we can skip this function if we're at the end
          pointer = false;
        } else {
          // iterate through each data result (countries array) using underscore
          _.each(data, function(country) {
            // append the rendered template to the content div
            $('#content').append(template(country));


            // THE ADVANCED EXERCISE /////////////////////
            // When a user clicks on a country row, make another ajax call to retrieve that country's created_at date
            // And display an alert with the country id and created_at date
            $('#content').children().last().click(function() {
              $.ajax({
                url: '/country/' + country.id,
                type: 'GET',
                success: function(data) {
                  alert("Country id id " + data.id + " and added on: " + data.created_at);
                }
              });
            });
            //////////////////////////////////////////////


          });
          // update the pointer to include our recent data set
          pointer += data.length;
        }
      }
    });
  }
}

// This function retrieves all data from the backend at once, without stepping.  Uses a handlebars partial for each country
// ** Demonstrates basic use of handlebars partials
function populateAll() {
  $.ajax({
    url: '/countries/300/0',
    type: 'GET',
    success: function(data) {
      // grab the html from the all template and compile into a handlebars template
      var template = Handlebars.compile($('#all-template').html());
      // register the country template as a partial called "country" so we can use it in the "all" template (demonstrates partials)
      Handlebars.registerPartial("country", $('#country-template').html());

      // set the rendered template as the html of the content div
      $('#content').html(template({countries: data}));
    }
  });
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
