$(document).ready(function() {
    loadLocation();
    autocomplete_init();
});

//Search function
function search(searchString) {
    $.get("/search", searchString, function(data) {
        $('p').html(JSON.stringify(data));
        plotResponse(data, 0);

    });
}

function plotResponse(data, i) {
    var marker = new google.maps.Marker({
            position: { lat: data[i].coordinates.latitude, lng: data[i].coordinates.longitude},
            map: map,
            title: data[i].name
        });

    // var markers = [];

    // function addMarkers() {
    //     

    //     for (var i = 0; i < data.length; ++i) {
    //         markers.push(i);
    //     }
    // }


    // function clearMarkers() {
    //     setMapOnAll(null);
    //     markers = [];
    // }
}



//Autocomplete_init function
function autocomplete_init() {
    $('#search_box').keypress((e) => {
        if (e.which == 13) {
            searchSelect($('#search_box').serializeArray());
            e.preventDefault();
        }
    });
    $('#search_box').autocomplete({
        source: (request, response) => {
            $.get("/autocomplete", '&text=' + request.term, function(data) {
                response($.merge($.map(data.terms, (entry, key) => {
                    return entry.text;
                }), $.map(data.categories, (entry, key) => {
                    return entry.alias;
                })));
                //Convert data to dictionary of terms to match autocomplete format 
                //response.send(data);  //TEST THIS *****************************************************************************
            });
        },

        select: (event, ui) => {
            $('#search_box').text(ui.item.label);
            searchSelect($('#search_box').serializeArray());
        },

        messages: {
            noResults: 'No results',
            results: function() {}
        }

    });

}

//Handles if location box is empty
function searchSelect(searchString) {
    if (!$('#location_box').is('empty')) {
        console.log("location success");
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                searchString.push({ name: 'latitude', value: position.coords.latitude });
                searchString.push({ name: 'longitude', value: position.coords.longitude });
                search(searchString);
            });
        } else {
            console.log('manual location');
            searchString.push({ name: 'location', value: $('#location_box').val() })
            search(searchString);
            $('#location_box').keypress((e) => {
                if (e.which == 13) {
                    search(searchString);
                    e.preventDefault();
                }
            });

        }

    } else { //Possibly implement google maps api autocomplete
        console.log("Geolocation is not supported by this browser.");
        if ($('location_box').is('empty')) {
            alert("Please enter a location.");
        }
    }
}

function loadLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            $('#location_box').val("Nashville, TN"); //Replace later with google geocoder api
            map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: position.coords.latitude, lng: position.coords.longitude },
                zoom: 14
            });
        });
    } else {
        //Generate default location 
        alert("Geolocation is disabled!");
        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 4
        });
    }

}

//Update map on location changes, also add functionality to update search if zoomed in/out
window.initMap = function() {}

//Function to mark a map with a JSON of markers
