import "dotenv/config.js";
import HyperExpress from 'hyper-express';
import Api from './routes/api.js';
import Socket from './routes/socket.js'
import CorsMiddleware from './middlewares/cors.js'
import JwtMiddleware from './middlewares/jwt.js'

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

Server.options('/*', async (request, response) => {
    res.send('Preflight passed');
})

Server.use(CorsMiddleware);
Server.use('/api', JwtMiddleware);
Server.use('/api', Api);
Server.use('/ws', Socket);