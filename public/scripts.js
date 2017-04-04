$(document).ready(function() {
    loadLocation();
    autocomplete_init();
    formListeners();
});

//Search function
function search(searchString) {
    $.get("/search", searchString, function(data) {
        $('#display_results').html('');
        plotResponse(data, 0);
        
        for(var i = 0; i< 20; ++i){
            createCard(data, i);
        }
        
        

    });
}


//Create a card based on JSON basic search data 
function createCard(data, i) {
    var new_div = document.createElement('div');
    new_div.setAttribute('class', 'card');
    new_div.id = "card_"+i;
    var img_div = document.createElement('div');
    img_div.setAttribute('class',"card-image waves-effect waves-block waves-light");

    var img_wrap = document.createElement('div');
    var img = document.createElement('img');
    img.setAttribute('class','activator');
    img.src = data[i].image_url;
    img_wrap.setAttribute('class',"crop activator");
    img_wrap.appendChild(img);

    img_div.appendChild(img_wrap);
    new_div.appendChild(img_div);
    var card_content = document.createElement('div');
    card_content.setAttribute('class','card-content');
    var card_title = document.createElement('span');
    card_title.setAttribute('class','card-title activator grey-text text-darken-4');
    card_title.innerHTML = data[i].name;
    var card_title_content = document.createElement('p');
    card_title_content.innerHTML = data[i].price;
    card_content.appendChild(card_title);
    card_content.appendChild(card_title_content);
    new_div.appendChild(card_content);

    var card_reveal = document.createElement('div');
    card_reveal.setAttribute('class', 'card-reveal');
    var card_reveal_title = document.createElement('span');
    card_reveal_title.setAttribute('class','card-title grey-text text-darken-4');
    card_reveal_title.innerHTML = data[i].name;
    card_reveal_content  = document.createElement('p');
    card_reveal_content.innerHTML = data[i].id;
    card_reveal.appendChild(card_reveal_title);    
    card_reveal.appendChild(card_reveal_content);
    new_div.appendChild(card_reveal);

    document.getElementById('display_results').appendChild(new_div);

    // .appendChild(document.createElement('div').setAttribute("class",
    //         "card-image waves-effect waves-block waves-light")
    //     .appendChild(document.createElement('img').setAttribute({
    //         "class": "activator",
    //         "src": data[i].image_url
    //     }))).appendChild(document.createElement('div').setAttribute("card-title activator grey-text text-darken-4")););


}

function plotResponse(data, i) {
    var marker = new google.maps.Marker({
        position: { lat: data[i].coordinates.latitude, lng: data[i].coordinates.longitude },
        map: map,
        title: data[i].name
    });
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

        //Check values of price check boxes on input
        var priceInput = "";
        if ($('#price1').is(':checked')) {
            priceInput += "1 ";
        }
        if ($('#price2').is(':checked')) {
            priceInput += "2 ";
        }
        if ($('#price3').is(':checked')) {
            priceInput += "3 ";
        }
        if ($('#price4').is(':checked')) {
            priceInput += "4 ";
        }
        if (priceInput != "") searchString.push({ name: 'price', value: priceInput.split(" ").slice(0, -1) });

        searchString.push({name: 'radius',value: Math.round(parseInt($('#dist_output').text()) * 1609.34)});

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
            $('#location_box').val("Nashville, TN"); //Replace later with google geocoder api, reverse geocoding 
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

//set of listeners on forms 
function formListeners() {
    $("#dist_radius").on("input", function() {
        $('#dist_output').html(this.value);
    });

}
