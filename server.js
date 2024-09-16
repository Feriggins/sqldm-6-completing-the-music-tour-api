// server.js
const express = require('express');
const app = express();
const { sequelize } = require('./models');

require('dotenv').config();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const bandsController = require('./controllers/bands_controller');
app.use('/bands', bandsController);
const eventsController = require('./controllers/event_controllers');
app.use('/events', eventsController);
const stagesController = require('./controllers/stage_controllers');
app.use('/stages', stagesController);

sequelize.authenticate()
    .then(async () => {
        console.log('Connected with Sequelize');
        return sequelize.sync();
    })
    .then(() => {
        console.log('Database & tables created!');
    })
    .catch(error => {
        console.error('Unable to connect to the database or sync tables:', error);
    });

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to the Music Tour API'
    });
});

if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🎸 Rockin' on port: ${PORT}`);
    });
}

module.exports = app;
