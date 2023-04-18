const mongoose = require("mongoose");

const { Schema } = mongoose;

const photoSchema = new Schema({
  image: String,
  title: String,
  likes: Array,
  commenst: Array,
  userId: mongoose.ObjectId,
  userName: String,
},
{
    timestamps:true
}
);

const Photo = mongoose.model("Photo", photoShema);

module.exports= Photo
