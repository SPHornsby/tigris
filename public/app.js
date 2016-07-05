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
  var itemBar = $("<div>").addClass("item-bar col-md-11");
  var itemImage = $("<img>").attr("src", "./placeholder.png").addClass("col-md-2");
  var itemDetails = $("<div>").addClass("item-details col-md-8");
  var itemTitle = $("<div>").addClass("item-title row").text(item.name);
  var creator = "--";
  if (item.creator.length > 0) {
    creator = item.creator;
  }
  var itemCreator = $("<div>").addClass("item-creator row").text(creator);
  var itemPrice = $("<div>").addClass("item-price row").text(`$${item.price}`);
  $(itemDetails).append(itemTitle, itemCreator, itemPrice);
  $(itemBar).append(itemImage, itemDetails);
  $(target).append(itemBar);
};

$(".search-button").on("click", function(e) {
  var input = $("#search-input").val();
  submitSearch(input);
})
