const Sequelize = require('sequelize');

const psqlController = {};

psqlController.connect = connect;
psqlController.viewTableContents = viewTableContents;
psqlController.connections = [];

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
    })

    //console.log('connections', psqlController.connections);

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
    res.send('session does not exist');
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
  currentConnObj.active = true;
  currentConnObj.currentQuery = `select * from ${table}`;

  currentConnObj.connection.query(currentConnObj.currentQuery)
  .then(rows => {
    console.log(rows[0]);

    let responseObj = {};
    let headers = [];
    Object.keys(rows[0][0]).forEach(key => {
      headers.push(key);
    });
    responseObj.headers = headers;
    responseObj.data = rows[0];

    res.header(200);
    res.json(responseObj);
    res.end();
  })
  
}

module.exports = psqlController;



  // //define model (i.e. table)
  // const Events = sequelize.define('events', {
  //   id : {
  //     type: Sequelize.TEXT, primaryKey: true
  //   },
  //   summary : {
  //     type: Sequelize.TEXT
  //   },
  //   htmlLink : {
  //     type: Sequelize.TEXT
  //   },
  //   start : {
  //     type: Sequelize.DATE
  //   },
  //   end : {
  //     type: Sequelize.DATE
  //   },
  //   createdAt : {
  //     type: Sequelize.DATE
  //   },
  //   updatedAt : {
  //     type: Sequelize.DATE
  //   },
  //   sequence : {
  //     type: Sequelize.INTEGER
  //   },
  // },{
  //   tableName: 'events'
  // });

  // Events.sync({force: false}).then(() => {
  //   console.log('table created');

  // sequelize.close();
    
  // });