import AppController from '../controllers/AppController';

const routes = (app) => {
    // task 2
    app.get('/status', AppController.getAppStatus);
    app.get('/stats', AppController.getAppStats);
};

// task 3
app.post('/users', UserController.postNew);

export default routes;

