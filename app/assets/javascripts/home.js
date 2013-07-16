var pointer = 0;


function populateCountries() {
  if(pointer !== false) {
    var step = parseInt($('#step-input').val());

  //    var template = Handlebars.compile(countryTemplate());
    ajaxRequest('/countries/' + step + '/' + pointer, countryScrollRequestCallback)
  }
}

function countryScrollRequestCallback(data) {
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
  alert("Country id:" + data.id);
}



function populateData() {
  step = 300;
  offset = 0;

  ajaxRequest('/countries/' + step + '/' + offset, populateDataRequestCallback);
}

function populateDataRequestCallback(data) {
  var content = $('#content');
  var template = Handlebars.compile($('#data-template').html());
  Handlebars.registerPartial("country", $('#country-template').html());

  content.append(template({countries: data}));
}



function ajaxRequest(url, callback) {
  $.ajax({
    url: url,
    type: 'GET',
    success: function(data) {
      callback(data);
    }
  });
}




$(document).ready(function() {
  $('#populate-button').click(populateCountries);
  $('#data-button').click(dataButtonClick);
  $('#reset-button').click(function() {
    pointer = 0;
    $('#content').html('');
    $(window).unbind('scroll').scroll(scrollFunction);
    $('#populate-button').unbind('click').click(populateCountries);
    $('#data-button').unbind('click').click(dataButtonClick);
  });

  $(window).scroll(scrollFunction);

  function scrollFunction() {
    var win = $(window);
    if(win.height() + win.scrollTop() >= $(document).height()) {
      populateCountries();
    }
  }

  function dataButtonClick() {
    $(window).unbind('scroll');
    $('#populate-button').unbind('click');
    $('#data-button').unbind('click');
    populateData();
  }

});
