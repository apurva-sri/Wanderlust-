const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  // console.log(req.user);
  res.render("./listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
  // let listing = req.body.listing;// JS *object*
  let url = req.file.path;
  let filename = req.file.filename;
  const newlisting = new Listing(req.body.listing);
  newlisting.owner = req.user._id; //it will save the id of curr owner
  // console.log(req.user._id,req.user.owner);
  newlisting.image = { url, filename };
  await newlisting.save();
  req.flash("success", "New Lisiting Created!");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Lisiting you requested for doesn't exist!");
    res.redirect("/listings");
  }
  res.render("./listings/show.ejs", { listing });
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Lisiting you requested for doesn't exist!");
    res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250"); //to make image lower its pixel
  res.render("./listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // deconstructing the vlaues from object. means seperatings each value.
  // res.redirect("/listings");
  if (req.file) {
    //to ensure that from contains file or not
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findByIdAndDelete(id);
  console.log("delete successfully!!");
  req.flash("success", "Lisiting Deleted!");
  res.redirect("/listings");
};

module.exports.showSearchedListing = async (req, res) => {
  let { title } = req.query; // Get the search term from query params

  if (!title) {
    req.flash("error", "Please enter a search term.");
    return res.redirect("/listings");
  }

  try {
    // Search using case-insensitive regex (partial match)
    const listings = await Listing.find({ title: { $regex: title, $options: "i" } });

    if (listings.length === 0) {
      req.flash("error", "No listings found.");
      return res.redirect("/listings");
    }

    // console.log("Search Query:", title);
    // console.log("Listings Found:", listings);

    res.render("./listings/searchList.ejs", { listings });
  } catch (error) {
    console.error("Error in search:", error);
    req.flash("error", "Something went wrong! Try again.");
    res.redirect("/listings");
  }
};


