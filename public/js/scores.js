"use strict";

$(function () { //Functions in this scope will run when the document ready even is fired
    $.ajax({
        type: "GET",
        url: "http://ec2-35-165-233-39.us-west-2.compute.amazonaws.com:3000/api", //Change this if using web address..
        type: "json",
        success: function (data){
            //BUILD elements in here using the data that was returned
        }
    });
});