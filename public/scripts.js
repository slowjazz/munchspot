//Is it good practice to 'nest' everything like this?
//A-C-A-O happens bc client cant access cross domain.. why is jsonp a workaround?
//Can bypass ACAO error but GET doesn't return anything... is authorization header wrong?


$(document).ready(function() {
    form_input();

});

//Returns data on form submit
function form_input() {
    autocomplete_init();

}

//Search function
function search(searchString) {
    $.get("/search", searchString, function(data) {
        console.log(data);
        $('p').html(JSON.stringify(data));
    });
}

//Autocomplete_init function
function autocomplete_init() {
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
        }

    });

}

function searchSelect(searchString) {

    if (navigator.geoLocation) {
        console.log("location success");
        navigator.geoLocation.getCurrentPosition(success, error);
        function success(position) {

            searchString.push({ name: 'latitude', value: position.coords.latitude });
            searchString.push({ name: 'longitude', value: position.coords.longitude });
            search(searchString);
        }
    } else {
        //Nest these in another search box for location
        searchString.push({ name: 'location', value: 'san francisco, ca' });
        console.log($.param(searchString));

        search(searchString);
    }
    //CHANGE LOCATION WHEN READY
}


//Function to map search data onto map

//Function to determine what to do with autocomplete data?
