'use strict';

var sliderStuff = {};

$(document).ready(function() {

    $.ajax({
        url: "https://dazzling-inferno-209.firebaseio.com/.json",
        dataType: "jsonp",
        success: function(data){
            console.log(data);
          for (var i = 0; i < data.length; i++) {
            // console.log(data);
            // console.log(data[0].title);
            $("#majorDiv").append("<div class='col-md-3 center-it'>" + ("<img class='auction-size' src='" + data[i].image +"'>") + 
                "<br>" + 
                "<span class='to-left'>" + data[i].title + "</span>" +
                "<span class='to-right'>" + data[i].price +  "</span>" +
                "<br>" +
                "<span class='to-left'>" + data[i].seller + "</span>" +
                "<span class='to-right'>" + data[i].endDate + "</span>" +
                "<br>" +
                "</div>");
      }
    }
  })

      $(".editButton").click(function () {
    window.location.href = "/merchy/" + $(this)[0].id;
  });

  // User clicked on a delete button
  $(".deleteButton").click(function () {
    var merchItemId = $(this)[0].id;

    $.ajax({
      url: "/merchy",
      method: "DELETE",
      data: {
        merch_id: merchItemId
      },
      success: function (response) {
        $("#merch_"+merchItemId).remove();  // Remove the DOM element on success
      }
    });
  });

    sliderStuff.outputUpdate = function(price, id) {
    $('#js-' + id).val(price);
    }
});