import dbClient from './utils/db.js';
import express from 'express';
import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/', routes);

const waitForDB = async () => {
    while (!dbClient.connected) {
        console.log('Waiting for MongoDB connection...');
        await new Promise((resolve) => setTimeout(resolve, 100));
    }
};

waitForDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

