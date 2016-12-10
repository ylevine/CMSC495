"use strict";

$(function () { //Functions in this scope will run when the document ready even is fired
    $.ajax({
        type: "GET",
        url: "http://ec2-35-165-233-39.us-west-2.compute.amazonaws.com:3000/api", //Change this if using web address..
      //  url:'http://localhost:3000/api',
        dataType: "json",
        success: function (data){
            var tbody= $('#scores');
            data.forEach(function (datum,index) {
                var tr = $('<tr>');
                var rank = $('<td>');
                var score = $('<td>');
                var name = $('<td>');
                rank.html(index+1+'.');
                tr.append(rank);
                score.html(datum.score);
                tr.append(score);
                name.html(datum.name);
                tr.append(name);
                tbody.append(tr);
            });
        }
    });
});