const Sequelize = require('sequelize');

const psqlController = {};

psqlController.connect = connect;
psqlController.viewTableContents = viewTableContents;
psqlController.removeConnection = removeConnection;
psqlController.getAllConnections = getAllConnections;
psqlController.executeQuery = executeQuery;

psqlController.connections = [];

//expire connections after 5 min.
setInterval(() => {
  psqlController.connections.forEach((connection, i) => {
    let now = Number.parseInt(Date.now());
    if (now - Number.parseInt(connection.createdAt) > 300000) {
      psqlController.connections.splice(i,1);
    }
  })
},1000);

function connect(req, res, next) {

  let body = req.body;
  
  let host = body.host;
  let user = body.user;
  let password = body.password;
  let database = body.database;
  let port = body.port;

  const sequelize = new Sequelize(database, user, password, {
    host: host,
    dialect: 'postgres'
  });
  
  //test connection
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });
  
    sequelize.query("SELECT table_schema || '.' || table_name FROM information_schema.tables WHERE table_type = 'BASE TABLE' AND table_schema NOT IN ('pg_catalog', 'information_schema');").then(function(rows) {
    
    let tablesArr = [];
    rows[0].forEach(row => {
      tablesArr.push(row['?column?'].split('.')[1]);
    });
    console.log(tablesArr);


    let sessionId = Math.floor(Math.random()*1000000);

    psqlController.connections.push({
      open: true,
      active: false,
      currentQuery : 'none',
      connection : sequelize,
      sessionId : sessionId,
      createdAt : Date.now(),
    })

    res.header(200);
    res.cookie('sessionId', sessionId);
    res.json(tablesArr);
    res.end();
  });
};

function viewTableContents(req, res, next) {
  if(!req.cookies['sessionId']){
    //return psqlController.connect(req,res,next);
    res.header(500);
    res.send('Session does not exist, should redirect back to authentication page');
  }
  
  let table = req.query.table;
  let sessionId = req.cookies['sessionId'];
  console.log(table);
  console.log(sessionId);

  //find relevant connection object
  let currentConnObj;
  for (let i = 0; i < psqlController.connections.length; i++){
    if(psqlController.connections[i].sessionId == sessionId){
      currentConnObj = psqlController.connections[i];
      break;
    }
  }

  if(!currentConnObj){
    res.header(500);
    res.send('No matching connection object for session cookie, should redirect back to authentication page');
    return;
  }

  currentConnObj.active = true;
  currentConnObj.currentQuery = `select * from ${table}`;

  currentConnObj.connection.query(currentConnObj.currentQuery)
  .then(rows => {

    let responseObj = {
      queryString: currentConnObj.currentQuery
    };

    let headers = []; 
    rows[1].fields.forEach(field => {
      headers.push(field.name);
    })
    responseObj.headers = headers;

    responseObj.data = rows[0];

    res.header(200);
    res.json(responseObj);
    res.end();
  })
  
}

function executeQuery (req, res, next) {
  if(!req.cookies['sessionId']){
    res.header(500);
    res.send('Session does not exist, should redirect back to authentication page');
  }

  let sessionId = req.cookies['sessionId'];
  let queryString = req.body.sqlQuery;

  //find relevant connection object
  let currentConnObj;
  console.log('conn arr length', psqlController.connections.length);
  for (let i = 0; i < psqlController.connections.length; i++){
    console.log(psqlController.connections[i]);
    if(psqlController.connections[i].sessionId == sessionId){
      currentConnObj = psqlController.connections[i];
      break;
    }
  }

  console.log(currentConnObj);
  if(!currentConnObj || currentConnObj === undefined){
    res.header(500);
    res.send('No matching connection object for session cookie, should redirect back to authentication page');
    return;
  }

  currentConnObj.currentQuery = queryString;
  currentConnObj.connection.query(currentConnObj.currentQuery)
  .then(rows => {
    console.log(rows[0]);
    res.header(200);
    res.json(rows[0]);
    res.end();
  })
  .catch(err => {
    console.warn(err);
    res.header(400);
    res.json((err));
    res.end();
  })
}

function removeConnection(req, res, next) {
  let removed = false;
  let sessionId = req.cookies['sessionId'];
  psqlController.connections.forEach((connection, i) => {
    if (connection.sessionId == sessionId) {
      psqlController.connections.splice(i,1);
      removed = true;
    }
  });

  res.header(202);
  res.json(removed ? 'Connection successfuly removed.' : 'Connection unsuccessfully removed.');
  res.end();
}

function getAllConnections(req, res, next){
  console.log(psqlController.connections);
  res.header(200);
  res.end();
}

module.exports = psqlController;

