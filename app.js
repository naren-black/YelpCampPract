var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    seedDB = require("./seeds");
    
seedDB();
mongoose.connect("mongodb://localhost/yelp_camp");


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

app.get("/campgrounds/new", function(req, res) {
  res.render("new");
});

app.post("/campgrounds", function(req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCampy = {name: name, image: image, description: desc};
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

app.get("/campgrounds/:id", function(req, res) {
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampGround) {
    if(err) {
      console.log(err);
    } else {
      console.log(foundCampGround);
      res.render("show", {campground: foundCampGround});
    }
    
  });
});

app.listen(process.env.PORT, process.env.IP, function() {
  console.log("YelpCamp server has started...");
});