//Is it good practice to 'nest' everything like this?
//A-C-A-O happens bc client cant access cross domain.. why is jsonp a workaround?
//Can bypass ACAO error but GET doesn't return anything... is authorization header wrong?

$(document).ready(function() {

  	//getLocation();
    form_input();


});

//Returns data on form submit
function form_input() {
    $('#search_box').keypress((event) => {
        console.log("pressed");
        if (event.which == 13) {
            var searchString = $('#search_box').serializeArray();

            //CHANGE LOCATION WHEN READY
            searchString.push({ name: 'location', value: 'san francisco, ca' });
            console.log($.param(searchString));

            search(searchString);

            event.preventDefault();

        }
    });

}

//With access token, returns JSON of get 
function search(searchString) {
    $.get("/search", searchString, function(data) {
        console.log(data);
        $('p').html(JSON.stringify(data));
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
