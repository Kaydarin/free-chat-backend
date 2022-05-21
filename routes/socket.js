import HyperExpress from 'hyper-express';

const Router = new HyperExpress.Router();

Router.ws('/connect', {
    idle_timeout: 60,
    // max_payload_length: 32 * 1024
}, (ws) => {

    console.log(ws.ip + ' is now connected using websockets!');

    ws.subscribe('chat-all');

    ws.on('message', (message) => {
        ws.publish('chat-all', message);
    });

    ws.on('close', () => {
        ws.unsubscribe('chat-all');
        console.log(ws.ip + ' has now disconnected!')
    });
});

export default Router;