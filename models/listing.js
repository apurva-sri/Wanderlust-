const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: String,
    url:String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  owner:{
    type: Schema.Types.ObjectId,
    ref:"User"
  }
});

listingSchema.post("findOneAndDelete", async(listing)=>{// called when deleting a listing call from app.js
  if(listing){
  await Review.deleteMany({ _id: {$in: listing.reviews}});// delete all listing.reviews from _id
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;