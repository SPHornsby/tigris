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

    var listItem = $("<li>").text(`Item ${item.name} costs: $${item.price}`);
    $(target).append(listItem);
  });
}
$(".search-button").on("click", function(e) {
  var input = $("#search-input").val();
  submitSearch(input);
})
