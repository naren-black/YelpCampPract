var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");

var campgroundSchema = mongoose.Schema({
  name: String,
  image: String,
  descry: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
//   "name" : "Babaji", 
//   "image" : "https://s-media-cache-ak0.pinimg.com/736x/05/53/4a/05534ae73104d10207cb339b239d13b6.jpg",
//   "descy": "The divinity who is one with God Shiva!"
// }, function(err, camp) {
//   if(err) {
//     console.log(err);
//   } else {
//     console.log("The record got created: ");
//     console.log(camp);
//   }
// });

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
  res.render("landing");
});

app.get("/campgrounds", function(req, res) {
  Campground.find({}, function(err, campgrounds) {
    if(err) {
      console.log(err);
    } else {
      res.render("index", {campgrounds: campgrounds});
    }
  });
});

app.post("/campgrounds", function(req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.descry;
  var newCampy = {name: name, image: image, descry: desc};
  Campground.create(newCampy, function(err, camp) {
    if(err) {
      console.log(err);
    } else {
      console.log("The new campground has been added..");
      console.log(camp);
    }
  });
  res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
  res.render("new");
});

app.get("/campgrounds/:id", function(req, res) {
  Campground.findById(req.params.id, function(err, foundCampGround) {
    if(err) {
      console.log(err);
    } else {
      res.render("show", {campground: foundCampGround});
    }
    
  });
});

app.listen(process.env.PORT, process.env.IP, function() {
  console.log("YelpCamp server has started...");
});