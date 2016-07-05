var submitSearch = function(term) {
  console.log(`Searching for ${term}`);
  var query = term;
  console.log(query);
  var xhr = new XMLHttpRequest();
  xhr.open("GET", `/search?q=${term}`);
  xhr.send();
  xhr.addEventListener("load", function() {
    if (xhr.responseText) {
      var results = JSON.parse(xhr.responseText);
      console.log(results);
      displayResults(results);
    } else {
      console.log("No response");
    }
  })
};
var displayResults = function(results) {
  var target = $("#resultList");
  $(target).empty();
  results.forEach(function(item) {
    makeItemBar(item, target);
  });
};
var makeItemBar = function(item, target) {
  var itemBar = $("<div>").addClass("item-bar col-md-12");
  var priceDisplay = item.price.toString(10);
  var itemDetails = $("<div>").addClass("item-details col-md-8 col-md-offset-2").text(`Item ${item.name} costs: $${item.price}`);
  $(itemBar).append(itemDetails);
  $(target).append(itemBar);
};

$(".search-button").on("click", function(e) {
  var input = $("#search-input").val();
  submitSearch(input);
})
