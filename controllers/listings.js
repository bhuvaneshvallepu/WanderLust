const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.indexRoute = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = async (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showRoute = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("deleted", "Listing Does Not Exists ");
    res.redirect("/listings");
  }
  let response = await geocodingClient.forwardGeocode({
    query: listing.location,
    limit: 1
  })
  .send();
  listing.geometry = response.body.features[0].geometry;
  res.render("listings/show.ejs", { listing });
};

module.exports.createRoute = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;
  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;
  await newListing.save();
  req.flash("success", "New Listing Created Successfully");
  res.redirect("/listings");
};


module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("deleted", "Listing Does Not Exists ");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
};

module.exports.updateRoute = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing=new Listing(req.body.Listing)
    listing.image = { url, filename };
    newListing.geometry=response.body.features[0].geometry;
    await listing.save();
  }

  req.flash("success", "Listing Updated Successfully");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteRoute = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("deleted", "Listing Deleted Successfully");
  res.redirect("/listings");
};