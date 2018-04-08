const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserScehma = new mongoose.Schema({
  type:{
    type: String,
    required: true,
    trim: true
  },
  loc: {
        type: [Number],
        index: '2dsphere'
  },
  email: {
    type: String,
    required: [true, 'User email required'],
    trim: true,
    minlength: 1,
    unique:true,
    validate:{
      validator : validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    required: [true, 'Password email required'],
    type: String,
    minlength: 6
  },
  tokens : [{
    access: {
      reuired: true,
      type: String
    },
    token: {
      required: true,
      type: String
    }
  }]
});

UserScehma.methods.toJSON = function(){
  var user = this;
  var userObj = user.toObject();

  return _.pick(userObj, ['email', '_id', 'loc']);
}

UserScehma.methods.generateAuthToken = function(){
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id :user._id.toHexString()}, process.env.JWT_SECRET).toString();

  // user.tokens.push({access, token});// may cause problem
  user.tokens = user.tokens.concat([{access, token}]); //proof method

  return user.save().then(() => { // return here so that server.js can grab the token in its then
    return token; // if we dont return a promise, we can return some val, it is legal and it will be passed as arg to success callback of then
  });
}

UserScehma.methods.removeToken = function(token){
  var user = this;
  console.log('Inside user method Remove token');
  //pull an object from tokens array where object property is token and is equal to token
  //returning a promise.
  return user.update({
    $pull: { //mongodb operator $pull, removes entire object, with any matching property
      tokens:{token}
    }
  });
}

UserScehma.statics.findByToken = function(token) {
  var User = this; //gets User, the model
  var decoded;

  try{
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  }
  catch(e){
    //if token is not valid, we send reject directly
    //leads to firing of error callback in then rightaway
    // return new Promise((resolve, reject) => { // returning a promise and rejecting it rightaway
    //   reject();
    // })

    return Promise.reject(); // does the same work as above
    //whatever is sent in reject(here) is passed on to err/e in catch or err call back
  }
  //finding by sub properties requires . operator to access
  //returning the promise passed by findOne
  return User.findOne({
    _id : decoded._id,
    'tokens.token':token,
    'tokens.access':'auth'
  })
}

UserScehma.statics.findByCredentials = function(email, password) {
  var User = this;

  return User.findOne({email}).then((user) => {

    if(!user){
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {

      bcrypt.compare(password, user.password, (err, res) => {
        //bcrypt uses call only not promises, so passing as a promise inside a new promise

        if(err){
          reject(err);
        }

        if(res){
          // var user = _.pick(user, ['email','tokens']);
          // resolve(_.pick(user, ['email','tokens'])); // sends tokens too
          resolve(user); // sends email and _id only
        }
        else {
          reject()
        }
      })

    })

  })
}

UserScehma.pre('save', function(next){ //mongoose middleware
  var user = this;

  if(user.isModified('password')){ // to check if password field is isModified
    //then only apply presave routine
    bcrypt.genSalt(2, (err, salt) => {
      console.log('salt-> ', salt);
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  }else {
    next();
  }

});

var User = mongoose.model('User', UserScehma);
//this user model doesnt not support function that can act on models
//for that we define mongoose schema and attacth methods to it to call and run and override what mongosse can send back as json response
// var User = mongoose.model('User',{
//   email: {
//     type: String,
//     required: [true, 'User email required'],
//     trim: true,
//     minlength: 1,
//     unique:true,
//     validate:{
//       validator : validator.isEmail, // validator.isEmail(value) return boolean
//       message: '{VALUE} is not a valid email'
//     }
//   },
//   password: {
//     required: [true, 'Password email required'],
//     type: String,
//     minlength: 6
//   },
//   tokens : [{ // objects for multiple devices, each object is per device
//     access: { //access token type name
//       reuired: true,
//       type: String
//     },
//     token: { // actual token
//       required: true,
//       type: String
//     }
//   }]
// });

module.exports = {
  User
}
