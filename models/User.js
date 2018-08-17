const mongoose = require('mongoose');
const { Schema } = mongoose;
const userId = require('shortid');

const userSchema = new Schema({
  userId: { type: String, unique: true, default: userId.generate },
  username: { type: String, required: true, unique: true },
});

mongoose.model('User', userSchema);

// https://fuschia-custard.glitch.me/api/exercise/new-user
/*{
  "username": "addassad",
  "_id": "Hkv7BsXLm"
}*/



//https://fuschia-custard.glitch.me/api/exercise/add
/*{
  "username": "addassad",
  "description": "dsdsf",
  "duration": 23,
  "_id": "Hkv7BsXLm",
  "date": "Fri Aug 17 2018"
}*/