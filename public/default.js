var submitSearch = function(term) {
  $("#search-input").val("");
  var xhr = new XMLHttpRequest();
  xhr.open("GET", `/search?q=${term}`);
  xhr.send();
  xhr.addEventListener("load", function() {
    if (xhr.responseText) {
      var results = JSON.parse(xhr.responseText);
      displayResults(results);
    } else {
      console.log("No response");
    }
  });
};
var displayResults = function(results) {
  var target = $("#result-list");
  $(target).empty();
  results.forEach(function(item) {
    makeItemBar(item, target, function(){
      return $("<button>").addClass("btn btn-success add-button").attr("data-id", item.id).text("Add to Cart");
    });
  });
  swap($(".results"));
};
var makeItemBar = function(item, target, callback) {
  var itemBar = $("<div>").addClass("item-bar col-md-11");
  var itemImage = $("<img>").attr("src", "./placeholder.png").addClass("col-md-2");
  var itemDetails = $("<div>").addClass("item-details col-md-4");
  var itemTitle = $("<div>").addClass("item-title row").text(item.name);
  var creator = "--";
  if (item.creator.length > 0) {
    creator = item.creator;
  }
  var itemCreator = $("<div>").addClass("item-creator row").text(creator);
  var itemPrice = $("<div>").addClass("item-price row").text(`$${item.price}`);
  var button =callback();
  //var cartButton = $("<button>").addClass("btn btn-success add-button").attr("data-id", item.id).text("Add to Cart");
  $(itemDetails).append(itemTitle, itemCreator, itemPrice);
  $(itemBar).append(itemImage, itemDetails, button);
  $(target).append(itemBar);
};
var swap = function(next) {
  var current = $(".current");
  $(current).addClass("hidden");
  $(next).removeClass("hidden")
    .addClass("current");
};
var addToCart = function(item) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/cart");
  var object = {};
  object.dataID= item;
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(object));
  xhr.addEventListener("load", function() {
    var cart = JSON.parse(xhr.responseText);
    showCart(cart);
  });
};
var removeFromCart = function(item) {
  var xhr = new XMLHttpRequest();
  xhr.open("DELETE", "/cart");
  var object = {};
  object.dataID= item;
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(object));
  xhr.addEventListener("load", function() {
    var cart = JSON.parse(xhr.responseText);
    showCart(cart);
  });
};
var showCart = function(cart) {
  // var xhr = new XMLHttpRequest();
  // xhr.open("GET", "/cart")
  // xhr.addEventListener("load", function() {
  // })
  console.log("showcart");
  var target = $("#cart-items");
  $(target).empty();
  cart.forEach(function(item) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", `/search/item?q=${item}`);
    xhr.send();
    xhr.addEventListener("load", function() {
      console.log(xhr.responseText);
      var item = JSON.parse(xhr.responseText);
      makeItemBar(item, target, function() {
        return $("<button>").addClass("btn btn-danger remove-button").attr("data-id", item.id).text("Remove from Cart");
      });
    })

  });
  swap($(".shopping-cart"));
};
var makeCartItem = function(item, target) {
  var itemBar = $("<div>").addClass("item-bar col-md-11");
  var itemImage = $("<img>").attr("src", "./placeholder.png").addClass("col-md-2");
  var itemDetails = $("<div>").addClass("item-details col-md-4");
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
}
$(".search-button").on("click", function() {
  var input = $("#search-input").val();
  submitSearch(input);
});
$("#search-input").on("keypress", function(e) {
  if (e.keyCode === 13) {
    var input = $("#search-input").val();
    submitSearch(input);
  }
});
$("#cart-button").on("click", function() {
  addToCart();
  swap($(".shopping-cart"));

});
$("#home-button").on("click", function() {
  swap($(".home"));
});
$("#result-list").on("click", ".add-button", function(e) {
  var item = e.target.attributes["data-id"].value;
  addToCart(item);
});
$("#cart-items").on("click", ".remove-button", function(e) {
  var item = e.target.attributes["data-id"].value;
  removeFromCart(item);
  //console.log(item);
});
