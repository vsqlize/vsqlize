const Sequelize = require('sequelize');

const psqlController = {};

psqlController.connect = connect;
psqlController.authenticate = authenticate;
psqlController.viewTableContents = viewTableContents;
psqlController.removeConnection = removeConnection;
psqlController.getAllConnections = getAllConnections;
psqlController.executeQuery = executeQuery;
psqlController.handleUpdateCell = handleUpdateCell;

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

function authenticate(req, res, next) {
  if(!req.cookies['sessionId']){
    //return psqlController.connect(req,res,next);
    res.header(500);
    res.send({AuthError: 'Authentication Error: Session does not exist, should redirect back to authentication page'});
  }

  let sessionId = req.cookies['sessionId'];
  let currentConnObj;
  for (let i = 0; i < psqlController.connections.length; i++){
    if(psqlController.connections[i].sessionId == sessionId){
      currentConnObj = psqlController.connections[i];
      break;
    }
  }

  if(!currentConnObj){
    res.header(500);
    res.send({AuthError : 'Authentication Error: No matching connection object for session cookie, should redirect back to authentication page'});
    return;
  }

  req.connObj = currentConnObj;
  next();
}

function viewTableContents(req, res, next) {
  
  let table = req.query.table;

  let currentConnObj = req.connObj;
  currentConnObj.active = true;
  currentConnObj.currentQuery = `select * from ${table}`;
  currentConnObj.createdAt = Date.now();

  currentConnObj.connection.query(currentConnObj.currentQuery)
  .then(rows => {
    let headers = []; 
    rows[1].fields.forEach(field => {
      headers.push(field.name);
    })

    let responseObj = {
      queryString: currentConnObj.currentQuery,
      headers : headers,
      data : rows[0],
    };

    currentConnObj.connection.query(`SELECT constraint_name, table_name, column_name, ordinal_position FROM information_schema.key_column_usage WHERE table_name = '${table}';`)
    .then(rows => {
      let fieldAttributes = (rows[1].rows);
      let pkey;
      fieldAttributes.forEach(field => {
        if(field.constraint_name == `${table}_pkey`) {
          pkey = field.column_name;
        }
      });
      responseObj.primaryKey = pkey;

      res.header(200);
      res.json(responseObj);
      res.end();
    })
  })
  
}

function handleUpdateCell (req, res, next) {

  let table = req.body.table;
  let primaryKey = req.body.primaryKey;
  let primaryKeyValue = req.body.primaryKeyValue;
  let updateField = req.body.updateField;
  let updateFieldValue = req.body.updateFieldValue;

  let queryString = `update ${table} set ${updateField} = '${updateFieldValue.trim()}' where ${primaryKey} = ${primaryKeyValue}`;

  let currentConnObj = req.connObj;
  currentConnObj.active = true;
  currentConnObj.currentQuery = queryString;
  currentConnObj.createdAt = Date.now();

  currentConnObj.connection.query(currentConnObj.currentQuery)
  .then(() => {
    req.body.sqlQuery = `select * from ${table}`;
    req.body.updateQuery = queryString;
    next();
  })
  .catch(err => {
    console.warn(err);
    res.header(400);
    res.json((err));
    res.end();
  })
  
}

function executeQuery (req, res, next) {
 
  let queryString = req.body.sqlQuery;

  let currentConnObj = req.connObj;
  currentConnObj.active = true;
  currentConnObj.currentQuery = queryString;
  currentConnObj.createdAt = Date.now();

  currentConnObj.connection.query(currentConnObj.currentQuery)
  .then(rows => {
    let headers = []; 
    rows[1].fields.forEach(field => {
      headers.push(field.name);
    })

    
    let responseObj = {
      queryString: req.body.updateQuery ? req.body.updateQuery : currentConnObj.currentQuery,
      //queryString: currentConnObj.currentQuery,
      headers : headers,
      data : rows[0],
    };

    res.header(200);
    res.json(responseObj);
    res.end();
  })
  .catch(err => {
    console.warn(err);
    res.header(400);
    res.json(({
      DatabaseError: err
    }));
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

