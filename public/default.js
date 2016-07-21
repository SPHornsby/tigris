var submitSearch = function(term) {
  $("#search-input").val("");
  var xhr = new XMLHttpRequest();
  xhr.open("GET", `/search?q=${term}`);
  xhr.send();
  xhr.addEventListener("load", function() {
    if (xhr.responseText) {
      var results = JSON.parse(xhr.responseText);
      displayResults(results);
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
  var reviews = "--";
  if (item.reviews.length > 0) {
    reviews = item.reviews[item.reviews.length-1];
  }
  var reviewLink = $("<div>").addClass("review-link").text(reviews);
  var creator = "--";

  if (item.creator.length > 0) {
    creator = item.creator;
  }
  var itemCreator = $("<div>").addClass("item-creator row").text(creator);
  var itemPrice = $("<div>").addClass("item-price row").text(`$${item.price}`);
  var button = callback();
  $(itemDetails).append(itemTitle, itemCreator, itemPrice, reviewLink);
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
    showCart(target)
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
    showCart(target)
  });
};

var showCart = function(target) {
  getCart().then(function(data){
    $(target).empty();
    if (data.length > 3) {
      $("#bottom-checkout-button").show();
    } else $("#bottom-checkout-button").hide();
    getItems(data, target);
    swap($(".shopping-cart"));
  });
};

var getItems = function(cart, target) {
  cart.forEach(function(item) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", `/search/item?q=${item}`);
    xhr.send();
    xhr.addEventListener("load", function() {
      var item = JSON.parse(xhr.responseText);
      makeItemBar(item, target, function() {
        var div = $("<div>");
        var remove = $("<button>").addClass("btn btn-danger remove-button col-sm-3").attr("data-id", item.id).text("Remove from Cart");
        var review = $("<button>").addClass("btn btn-warning review-button col-sm-2 col-sm-offset-1").attr("data-id", item.id).text("Add Review");
        $(div).append(remove, review);
        return div;
      });
    })
  });
};

var getCart = function() {
  return new Promise(function(resolve, reject) {
    $.get("/cart", function(data) {
      resolve(JSON.parse(data));
    });
  });
};

var getDetail = function(target) {
  getCart().then(function(data) {
    Promise.all(data.map(item => {
      return promise = new Promise(function(resolve, reject) {
        $.get(`/search/item?q=${item}`, function(data) {
          resolve(data);
        }, "json")
      })
    })).then(value => {
      var prices = value.map((item) => parseFloat(item.price));
      var final = prices.reduce((prev, curr) => {
        return prev + curr;
      }, 0);
      makeDetail(final, target);
    });
  });
};

var makeDetail = function(cartCost, target) {
  $(target).empty();
  var subtotal = $("<p>").text(`Subtotal: $${displayCurrency(cartCost)}`);
  var tax = $("<p>").text(`Tax: $${displayCurrency(cartCost*0.075)}`);
  var total = $("<p>").addClass("payment-total").text(`Total: $${displayCurrency(cartCost*1.075)}`);
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
};

var getPayment = function() {
  return $("input[type='radio'][name='payment']:checked").val();
};

var submitOrder = function(order) {
  return new Promise(function(resolve, reject) {
    var data = order;
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "/user");
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(JSON.stringify(data));
    xhr.addEventListener("load", function(){
      resolve(JSON.parse(xhr.responseText));
    });
  });
};

var submitReview = function(item, review) {
  return new Promise(function(resolve, reject) {
    var data = JSON.stringify({item: item, review: review});
    $.ajax({
      method: "PUT",
      url: "/item",
      headers: { "Content-type": "application/json"},
      data: data,
      success: function() {
        resolve();
      }
    });
  });
}

var showConfirmation = function(data) {
  var lastOrder = data.pop();
  var target = $(".orders");
  showOrder(lastOrder, target);
  swap($(".confirmation"));
};

var showOrder = function(order, target) {
  $(target).empty();
  var block = $("<div>").addClass("well");
  var title = $("<h3>").text("Order Confirmation:").addClass("text-center");
  var date = $("<div>").text(`Ordered on: ${new Date(order.date)}`);
  var payment = $("<div>").text(`Paid with: ${order.payment}`);
  $(block).append(title, date, payment);
  $(target).append(block);
};

var writeReview = function(item) {
  var target = $(".review-panel");
  //TODO get the item title from the row with the review button
  $(".review-heading").text(`Review for item: ${item}`)
  swap($(".review"));
  makeReview(target, item);
};

var makeReview = function(target, item) {
  $(target).empty();

  var input = $("<textarea>").attr({
    class: "form-control",
    rows: 3,
    placeholder: "Enter review here..."
  }).addClass("review-text");
  var button = $("<button>").attr({
    "data-id": item,
    class: "btn btn-success add-review"
  }).text("Submit review");
  $(target).append(input, button);
};

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
  showCart(target);
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

$(".pay-button").on("click", function(e) {
  var payment = getPayment();
  getCart().then(function(cart) {
    var date = Date.now();
    var order = {date: date, cart: cart, payment: payment};
    submitOrder(order).then(function(data) {
      showConfirmation(data);
    });
  });
});

$("#cart-items").on("click", ".review-button", function(e) {
  var item = e.target.attributes["data-id"].value;
  writeReview(item);
});

$(".review").on("click", ".add-review", function(e) {
  var item = e.target.attributes["data-id"].value;
  var review = $(".review-text").val();
  submitReview(item, review);
});

$(function() {
  $("#bottom-checkout-button").hide();
});
