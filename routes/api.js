import HyperExpress from 'hyper-express';

const Router = new HyperExpress.Router();

Router.get('/test', (request, response) => {
    response.send('This is test');
});

export default Router