// -- FIXES --
// EMPTY SEARCH BUTTON FIX
// CLEAR SEARCH OPTION
// NEW BACKGROUND


// SHOW ABOUT SECTION START
$('#show-about').on('click', function() {
	// We need to display flex the main nav
	$('.popup-about').toggleClass('show');
	// If/else statement allows the text to change, allowing user to see how to close
	// about popup easier
	var about = $('#about').text();
	if (about === "about") {
		$('#about').text('close');
	}
	else {
		$('#about').text('about');
	}
});

$('#close-about').on('click', function() {
	$('.popup-about').removeClass('show');
	// Repeating from earlier function, just this time it's if you click
	// On the 'close-about' option
	var about = $('#about').text();
	if (about === "about") {
		$('#about').text('close');
	}
	else  {
		$('#about').text('about');
	}
});

// SHOW ABOUT END

var recipeFinder = {
	// Will hold an object
};

// Storing key/value pairs
recipeFinder.apiUrl = 'http://api.yummly.com/v1/api/recipes';
recipeFinder.key = 'adb94000e8a9955814a483ef0ca4592b';
recipeFinder.ID = '6cebcd5a';

// Performing Ajax request
recipeFinder.getData = function(query) {
	$.ajax({
		url: recipeFinder.apiUrl,
		data: {
			_app_key: recipeFinder.key,
			_app_id: recipeFinder.ID,
			q: query,
			requirePictures: true,
		    maxResult: 20
		},
		method: 'GET',
		dataType: 'json'
	})
	.then(function(res) {
		// We now import that list into the displayResults() function
		recipeFinder.displayResults(res)
	});
};

// Shuffle will randomize the results on user input
recipeFinder.shuffle = function(array) {
	var counter = array.length;

	// While there are elements in the array
	while (counter > 0) {
	    // Pick a random index
	    var index = Math.floor(Math.random() * counter);

	    // Decrease counter by 1
	    counter--;

	    // And swap the last element with it
	    var temp = array[counter];
	    array[counter] = array[index];
	    array[index] = temp;
	}

	return array;
};

// Checkbox will cover the entire box
// On click of the '.ingredientOptions' div, the checkbox will become checked

recipeFinder.checkboxClick = function() {
	$('.ingredient-options').on('click', function() {
		$(this).toggleClass('clicked');
	});
};

recipeFinder.reset = function() {
	// Reset button will empty search 
	$('#reset').on('click', function() {
		// If it's checked
        if (this.checked == true) {
            $('.ingredient').find('input[name="ingredient"]').prop('checked', true);
        }
        // If it's not
        else {
        	// Remove the checked state
            $('.ingredient').find('input[name="ingredient"]').prop('checked', false);
            // Remove the checked class (which is the black border)
        	$('.ingredient-options').removeClass('clicked');
        	// Change '.search-display' to another value
        	$('.search-display').text('Click on an ingredient to begin another search!');
        	// Empty both the results-intro and results sections
        	$('.results-intro').empty();
        	$('.results').empty();
        }
    });
};

recipeFinder.displayResults = function(results) {
	// We then access our information that we stored within this method
	console.log(results);
	var recipeObjects = results.matches;
	recipeObjects = recipeFinder.shuffle(recipeObjects);
	if(recipeObjects.length > 0) {
		for(i = 0; i < recipeObjects.length; i++) {
			var recipeName = recipeObjects[i].recipeName;
			// Because no large image is provided, we replace the default [s90] with [s250] 
			var recipeImage = recipeObjects[i].smallImageUrls[0].replace(/s90/g, 's250');
			var recipeLink = "http://www.yummly.com/recipe/" + recipeObjects[i].id;
			var recipeCookTime = recipeObjects[i].totalTimeInSeconds / 60;
			var recipeStyle = recipeObjects[i].attributes.course;
			if(i < 10) {
				$('.results').append('<div id="recipe-item'+ i + '" class="yummly"></div>')
			}

			else {
				$('.results').append('<div id="recipe-item'+ i + '" class="yummly hidden"></div>')
			}

			// Adding div
			// Image
			// Add a div, then add an image as the background-image of that div
			$('#recipe-item' + i).append('<div id="recipe-image'+ i + '" class="recipe-images"></div>');
			// Then the background-image
			$('#recipe-image' + i).css('background-image', 'url("' + recipeImage + '")');
			// Now we add a text field for the rest of the content
			$('#recipe-item' + i).append('<div id="recipe-text'+ i + '" class="recipe-text"></div>');
			// Name
			$('#recipe-text' + i).append('<h2>' + recipeName + '</h2>');
			// Style
			if (recipeStyle != null) {
				$('#recipe-text' + i).append('<h3>' + recipeStyle + '</h3>');
			}
			// Cooking time
			$('#recipe-text' + i).append('<h4>Canadianized in ' + recipeCookTime + ' minutes</h4>');
			// Link
			$('#recipe-text' + i).append("<a target='_blank' href=" + recipeLink + ">" + "<p>View recipe</p>" + "</a>");
		}
			// Click more button 
			// This button will allow us to show more results
			$('.results').append('<button value="more" id="results-see-more" placeholder="more"><p>see more</p></button>');

			// Now we want to show those results when the button is clicked
				$('#results-see-more').on('click', function() {
					$('.yummly').removeClass('hidden');
					$(this).addClass('hidden');
				});
				// Below if statement hides see more button if results length is less than 10
				if(recipeObjects.length < 10) {
					$('#results-see-more').addClass('hidden');
				}
		}

		else {
			$('.results-intro').addClass('results-intro-active');
			$('.results-intro').append("<h3>Uh, oh... It appears you've made a selection that's a too little Canadian! Sorry!</h3>")
			$('.results-intro').append("<input type='submit' id='randomize' value='Try a random recipe?'>")
			// Resetting '.search-display' to reflect a random search
			$('#randomize').on('click', function(){
				$('.search-display').text('Currently searching for randomized Canadian recipes');
			});
			$('.search-display').text('No recipes were found. Try a random recipe!');
			$('#randomize').on('click', function() {	
				recipeFinder.getData("Canada");
				$('.results').empty();
			});
			$('#results-see-more').hide();
		}

		// Smooth scroll
		$('html, body').animate({
	       scrollTop: $('.results').offset().top
	    }, 850);

	    // Added again, but for the top button
	    $('.back-to-top').on('click', function() {
	        $('html, body').animate({
	           scrollTop: $('#top').offset().top
	        }, 850);
	    });
	}

// The initialize function
recipeFinder.init = function() {
	// On submission of the form, we want to prevent the reload and log the users input
	$('form').on('submit', function(e) {
		// Preventing a reload when form is submitted 
		e.preventDefault();
		// Adding the objects obtained from the API call
		// Grabbing all inputs that are checked
		var userInput = $('input[type=checkbox]:checked');
		// Now create userSearch, which is an empty array
		var userSearch = [];
		// for each item in userInput, we will push the value the user put in (through the input)
		userInput = userInput.each(function(index, item) {
			userSearch.push($(item).val());
		});
		// Now we combine userSearch through .join() to create one string
		// This will allow a search of multiple ingredients in the same query
		userSearch = userSearch.join();
		// This loads our API call along with our search query 
		recipeFinder.getData(userSearch);
		console.log(userSearch);	
		$('.search-display').text('Currently searching for recipes containing' + userSearch);

		// Now we call our results 
	});
	// This clears the results when the user submits their choices 
	$('#submit').on('click', function() {
		$('.results').empty();
		$('.results-intro').empty();
	});
	// This adds the checkbox function to the init function
	recipeFinder.checkboxClick();
	// Adding the reset function to the init function
	recipeFinder.reset();
};

// Document ready
$(document).ready(function() {
	// Loading in the initialize function
	recipeFinder.init();
});
