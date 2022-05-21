import "dotenv/config.js";
import HyperExpress from 'hyper-express';
import Api from './routes/api.js';
import Socket from './routes/socket.js'

const Server = new HyperExpress.Server();

Server.listen(8100)
    .then((socket) => {
        console.log('Webserver started on port 8100');
        console.log(process.env.ENV);
    })
    .catch((error) => console.log('Failed to start webserver on port 8100'));

Server.get('/', (request, response) => {
    response.send('Hello World');
})

Server.use('/api', Api);

// Websocket connections can now connect to '/ws/connect'
Server.use('/ws', Socket);