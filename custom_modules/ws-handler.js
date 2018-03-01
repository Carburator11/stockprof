import { args } from '../config/connect';
import { server } from '../api/routes.js';
const io = require('socket.io')(server);
const WebSocket = require('ws');
const chalk = require('chalk');
console.log(chalk.green('[Chalk] Hello world!'));

let arrayMsg = [];
let data = 'data incoming...'

const cexioWS = function(client){
    
    // Connect to CEX.io ws-APi
    const cexWS = new WebSocket('wss://ws.cex.io/ws/', { perMessageDeflate: false });
    console.log('[cexioWS] - starting'); 
    cexWS.on('open', function(){
        console.log(chalk.green('[cexioWS] - open') ); 
        cexWS.on('message', function(el){
            //console.log('[CEX server] message:', el);
            let msg = JSON.parse(el);
            
            if(client){
                client.emit('btc', data);
            }
            if(msg['e'] === 'ping'){
                //console.log('[CEX client] Connection active')
                cexWS.send(JSON.stringify({"e":"pong"}));
            }
    
            if(msg.data){
                if(msg.data.symbol1 ){
                    //console.log(chalk.green('[CEX server] BTC'));
                    
                    console.log('[CEX server]', JSON.stringify(msg) );
                    data = msg.data;
                    
    
                }
            }
        });
    
    
        cexWS.on('open',    (el) => console.log('[CEX.io] open: ',el) );
        cexWS.on('error',   (el) => console.log('[CEX.io] error: ',el) );
        cexWS.on('close',   (el) => console.log('[CEX.io] close: ',el) );
        cexWS.send( JSON.stringify(args) );
    
        cexWS.send(JSON.stringify({
            e: 'subscribe',
            rooms: ['tickers']
            })
        )
    });

}

export const ioServer = io.on('connection', function(client){
    
    console.log('[Socket.io] Connected');
    client.on('subscribeToTimer', (interval) => {
        console.log('[Socket.io] Client is subscribing to timer with interval ', interval);
        setInterval(() => {
            client.emit('timer', new Date());
        }, interval);
    });

    client.on('chatMessage', (msg) => {
        console.log('[Socket.io] receiving Msg: ', msg);
        arrayMsg.push(msg);
        client.emit('arrayMessage', arrayMsg)
    });

    //
    cexioWS(client);

});