const mongoose = require('mongoose');

var Order = mongoose.model('Order',{
  _creator:{
    type: mongoose.Schema.ObjectId,
    required: true
  },
  address:{
    type: Object,
    required: true,
    trim: true,
    minlength: 2
  },
  loc: {
        type: [Number],
        index: '2dsphere',
        required: true
  },
  currentLoc: {
        type: [Number],
        index: '2dsphere',
        default:[null,null]
  },
  restraunt:{
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },
  item:{
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },
  status:{
    type: String,
    required: true,
    trim: true
  },
  placedAt:{
    type: Number,
    default: null
  },
  completedAt:{
    type: Number,
    default: null
  },
  device:{
    type: String,
    default: ''
  },
});

module.exports = {
  Order
}
