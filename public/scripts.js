var access_token;
var auth_header;

$(document).ready(function() {
    $.post("/", function(data) {
        var client = $.parseJSON(data);
        access_token = client.access_token;
        auth_header = 'Bearer '+access_token;
        console.log(auth_header);
        //getLocation();
        form_input();

    });
});

//Returns data on form submit
function form_input() {
    $('#search_box').keypress((event) => {
        console.log("pressed");
        if (event.which == 13) {
            var searchString = $('#search_box').serializeArray();
            
            //CHANGE LOCATION WHEN READY
            searchString.push({name: 'location',value:'san francisco, ca'});
            console.log($.param(searchString));

            search(searchString);
            event.preventDefault();

        }
    });

}

//With access token, returns JSON of get 
function search(searchString) {
	console.log("search in progress");
    $.ajax({
        type: "GET",
        url: 'https://api.yelp.com/v3/businesses/search',
        data: searchString,
        beforeSend: function(xhr){
        	xhr.setRequestHeader('Authorization', auth_header);
        },
        success: (data)=>{
        	console.log(data);
        }
    });
}

//Geolocation from w3
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    console.log("Latitude: " + position.coords.latitude +
        "<br>Longitude: " + position.coords.longitude);
}
