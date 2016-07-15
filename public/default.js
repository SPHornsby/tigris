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

var addToCart = function(item, target) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/cart");
  var object = {};
  object.dataID= item;
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(object));
  xhr.addEventListener("load", function() {
    getCart(target)
  });
};

var removeFromCart = function(item, target) {
  var xhr = new XMLHttpRequest();
  xhr.open("DELETE", "/cart");
  var object = {};
  object.dataID= item;
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(object));
  xhr.addEventListener("load", function() {
    getCart(target)
  });
};

var getCart = function(target){
  $.get("/cart", function(data) {
    var cart = JSON.parse(data);
    showCart(cart, target);
  })
};

var showCart = function(cart, target) {
  $(target).empty();
  if (cart.length > 3) {
    $("#bottom-checkout-button").show();
  } else $("#bottom-checkout-button").hide();
  getItems(cart, target);
  swap($(".shopping-cart"));
};

var getItems = function(cart, target) {
  cart.forEach(function(item) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", `/search/item?q=${item}`);
    xhr.send();
    xhr.addEventListener("load", function() {
      var item = JSON.parse(xhr.responseText);
      makeItemBar(item, target, function() {
        return $("<button>").addClass("btn btn-danger remove-button").attr("data-id", item.id).text("Remove from Cart");
      });
    })
  });
};
var standaloneGet = function() {
  return new Promise(function(resolve, reject) {
    $.get("/cart", function(data) {
      console.log(data);
      resolve(JSON.parse(data));
    });
  });
};

var getDetail = function(target) {
  standaloneGet().then(function(data) {
    console.log(data);
    Promise.all(data.map(item => {
      return promise = new Promise(function(resolve, reject) {
        $.get(`/search/item?q=${item}`, function(data) {
          resolve((data));
        }, "json")
      })
    })).then(value => {
      var prices = value.map((item) => parseFloat(item.price));
      var final = prices.reduce((prev, curr) => {
        return prev + curr;
      }, 0);
      console.log(final);
      makeDetail(final, target);
    });
  });

};

var makeDetail = function(cartCost, target) {
  console.log(target);
  //var detail = $(".price-details");
  $(target).empty();
  var subtotal = $("<p>").text(`Subtotal: $${displayCurrency(cartCost)}`);
  var tax = $("<p>").text(`Tax: $${displayCurrency(cartCost*0.075)}`);
  var total = $("<p>").text(`Total: $${displayCurrency(cartCost*1.075)}`);
  //$(detail).append(subtotal, tax, total);
  $(target).append(subtotal, tax, total);
};

var displayCurrency = function(float) {
  return ((Math.round(float*100))/100).toFixed(2);
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
};
var showCheckout = function() {

  swap($(".check-out"));
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

$(".cart-button").on("click", function() {
  var target = $("#cart-items");
  var priceTarget = $(".price-details");
  getCart(target);
  getDetail(priceTarget);
});

$("#home-button").on("click", function() {
  swap($(".home"));
});

$("#result-list").on("click", ".add-button", function(e) {
  var item = e.target.attributes["data-id"].value;
  var target = $("#cart-items");
  var priceTarget = $(".price-details");
  addToCart(item, target);
  getDetail(priceTarget);
});

$("#cart-items").on("click", ".remove-button", function(e) {
  var item = e.target.attributes["data-id"].value;
  var target = $("#cart-items");
  var priceTarget = $(".price-details");
  removeFromCart(item, target);
  getDetail(priceTarget);
});

$(".checkout-button").on("click", function() {
  var target = $(".price-summary");
  getDetail(target);
  showCheckout();
});

$(function() {
  $("#bottom-checkout-button").hide();
});
