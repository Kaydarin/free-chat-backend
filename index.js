import "dotenv/config.js";
import HyperExpress from 'hyper-express';
const Server = new HyperExpress.Server();

Server.listen(9999)
    .then((socket) => {
        console.log('Webserver started on port 9999');
        console.log(process.env.ENV);
    })
    .catch((error) => console.log('Failed to start webserver on port 9999'));