const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const server = app.listen(port);
const io = require('socket.io')(server);
console.log(`[Server] Node and Socket.io : listening on port ${port}`)
import { cookie } from './custom_modules/cookie-handler';
import { db } from './custom_modules/db-handler';
import { session } from './custom_modules/session-handler';

db.init();

app.use(express.static('client/build'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.post('/register', (req, res) => {

    let data =  {
        'cookie': '',
        'session': {},
        'account': {}
    }
    
    // Set or retrieve cookie
    cookie.handle( req, res, data, (data) => {

        // First create user in the DB
        db.register( req, res, data, (data) => {

            // Then create/update session File
            session.register( req, res, data);
        });
    });
});

app.post('/login', (req, res) => {
    let data =  {
        'cookie': '',
        'session': {},
        'account': {}
    }

    // Set or retrieve cookie
    cookie.handle( req, res, data, (data) => {

        // Get user in the DB
        db.login( req, res, data, (data) => {

            // Then create/update session
            session.register( req, res, data );
        });
    });
    
});

app.post('/disconnect', (req, res) => {
    let data =  {
        'cookie': '',
        'session': {},
        'account': {}
    }

    // Set or retrieve cookie
    cookie.remove( req, res, data, (data) => {
        session.disconnect( req, res, data )
    })

    
});

app.get('/api/', (req, res) => {
    
    let data =  {
        'cookie': '',
        'session': {},
        'account': {}
    }
        
    // Set or retrieve cookie
    cookie.handle( req, res, data, function(data){

        // Set or retrieve session info
        session.handle( req, res, data, function(data){

            // Pass session info to DB to get user info
            db.handle( req, res, data );
        });
    })
    
});

let arrayMsg = [];
io.on('connection', (client) => {
    console.log('[Socket.io] Connected');
    client.on('subscribeToTimer', (interval) => {
        console.log('[Socket.io] Client is subscribing to timer with interval ', interval);
        setInterval(() => {
          client.emit('timer', new Date());
        }, interval);
    });

    client.on('subscribeToArray', () => {
        console.log('[Socket.io] Client is subscribing to Array');
        setInterval(() => {
            //console.log('[Socket.io] Emmitting arrayMsg', arrayMsg)
            client.emit('arrayMessage', arrayMsg)
            }, 1000);
    });

    client.on('message', (msg) => {
        console.log('[Socket.io] receiving Msg: ', msg);
        arrayMsg.push(msg);
        
    });




});
 




//io.listen(8888, () => console.log(`Socket.io: listening on port 8888`) );