import "dotenv/config.js";
import HyperExpress from 'hyper-express';
const Server = new HyperExpress.Server();
const Router = new HyperExpress.Router();

Server.listen(8100)
    .then((socket) => {
        console.log('Webserver started on port 8100');
        console.log(process.env.ENV);
    })
    .catch((error) => console.log('Failed to start webserver on port 8100'));

Server.get('/', (request, response) => {
    response.send('Hello World');
})

Router.ws('/connect', {
    idle_timeout: 60,
    // max_payload_length: 32 * 1024
}, (ws) => {


    console.log(ws.ip + ' is now connected using websockets!');

    ws.on('message', (message) => {
        const status = ws.send(message);
        console.log('is message send?', status);
    });

    ws.on('close', () => console.log(ws.ip + ' has now disconnected!'));
});

// Websocket connections can now connect to '/ws/connect'
Server.use('/ws', Router);