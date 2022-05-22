import "dotenv/config.js";
import HyperExpress from 'hyper-express';
import Api from './routes/api.js';
import Socket from './routes/socket.js'
import cors from 'cors';

const Server = new HyperExpress.Server();

Server.listen(process.env.PORT)
    .then((socket) => {
        console.log('Webserver started on port ' + process.env.PORT);
        console.log(process.env.ENV);
    })
    .catch((error) => console.log('Failed to start webserver on port ' + process.env.PORT));

Server.get('/', (request, response) => {
    response.send('Hello World');
})

Server.use(cors({
    origin: '*'
}));
Server.use('/api', Api);

// Websocket connections can now connect to '/ws/connect'
Server.use('/ws', Socket);