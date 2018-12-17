const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const path = require('path');
const apiRouter = express.Router();

const psqlController = require('./psql/psqlController');

app.use(bodyParser());
app.use(cookieParser());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.listen(80, () => {
  console.log('listening at http://localhost:80');
});

// //CLIENT ROUTES
app.get('/', (req, res, next) => {
  res.header(200);
  res.sendFile(path.join(__dirname,'../../dist','index.html'))
});
app.get('/bundle.js', (req, res, next) => {
  res.header(200);
  res.sendFile(path.join(__dirname,'../../dist','bundle.js'))
});

//API ROUTES
app.use('/api', apiRouter);

apiRouter.get('/connect', psqlController.getAllConnections)
apiRouter.post('/connect', psqlController.connect);
apiRouter.delete('/connect', psqlController.removeConnection)

apiRouter.get('/table', psqlController.authenticate, psqlController.viewTableContents);
apiRouter.post('/table', psqlController.authenticate, psqlController.executeQuery);
apiRouter.patch('/table', psqlController.authenticate, psqlController.handleUpdateCell, psqlController.executeQuery)


module.exports = app;
