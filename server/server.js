require('./config/server.config')

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const _ = require('lodash');
const socketio = require('socket.io');

const publicPath = path.join(__dirname, `../public`)
const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');
const {User} = require('./models/user');
const {Order} = require('./models/order');
const {authenticate} = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT;

var server = http.createServer(app);
var io = socketio.listen(server);
var clients = [];

app.use(bodyParser.json());

app.use(express.static(publicPath));

//----------User
//----------User
//----------User
app.post('/api/users', (req, res) => {
  var body = _.pick(req.body, ['type','email', 'password']);

  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken()
  })
  .then((token) => {
    res.header('x-auth', token).send(user);
  })
  .catch((err) => res.status(400).send(err))
})

app.get('/api/users/me', authenticate, (req, res) => {
  res.send(req.user);
})

app.post('/api/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {

      io.on('connect', (socket) => {
        clients.push(socket);
        socket.on('agentUpdate', (data) => {
          socket.emit('trackingUpdate', data);
        });
      });

      res.header('x-auth',token).send(user);
    })
  })
  .catch((e) => {
    res.status(400).send();
  })
})

app.delete('/api/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  })
  .catch((e) => res.status(400).send())
})

app.post('/api/users/order', authenticate, (req, res) => {
  var body = _.pick(req.body, ['address','loc', 'restraunt', 'item']);
  console.log(body);
  var newOrder = new Order({
    _creator: req.user._id,
    address: req.body.address,
    loc: req.body.loc,
    restraunt: req.body.restraunt,
    item: req.body.item
  });

  newOrder.save().then(
    (order) => {
      res.send(order);
    },
    (err) => {
      res.status(400).send(err)
    }
  );
})

//----------User-end

//----------Agent
//----------Agent
//----------Agent
app.post('/api/agent/users', (req, res) => {
  var body = _.pick(req.body, ['type', 'email', 'password', 'loc']);

  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken()
  })
  .then((token) => {
    res.header('x-auth', token).send(user);
  })
  .catch((err) => res.status(400).send(err))
})

app.get('/api/agent/users/me', authenticate, (req, res) => {
  res.send(req.user);
})

app.post('/api/agent/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth',token).send(user);
    })
  })
  .catch((e) => {
    res.status(400).send();
  })
})

app.delete('/api/agent/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  })
  .catch((e) => res.status(400).send())
})

app.get('/api/agent/users/orders', authenticate, (req, res) => {

  Order.find({ loc : { $nearSphere: req.user.loc, $maxDistance: 12000} }).then(
    (orders) => {
      res.send({orders});
    }
  ).catch((e) => {
    res.status(400).send(e)
  });
})

app.post('/api/agent/users/order', authenticate, (req, res) => {
  var body = _.pick(req.body, ['status', '_id']);

  if(!ObjectID.isValid(body._id)){
    return res.status(404).send();
  }
  console.log(req.user.loc);
  Order.findOneAndUpdate({_id:body._id}, {$set: {status:body.status, currentLoc:req.user.loc}}, {new:true}).then((order) => {
    if(!order){
      return res.status(404).send()
    }

    res.send({order});

  })
  .catch((e) => res.status(404).send())
})

//----------Agent-end

app.get('*', function (req, res) {
    res.sendFile(path.resolve(publicPath+'/index.html'));
})

server.listen(port,() => {
  console.log(`Server started at ${port}`);
});

module.exports = {
  app
};
