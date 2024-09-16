// bands.test.js

const request = require('supertest');
const app = require('../server');
const { sequelize, Band, Meet_greet, SetTime, Event, Stage } = require('../models');

beforeAll(async () => {
    // Sync the database with force, which will drop all tables
    await sequelize.sync({force: true});

    // Create an entry in the `Event` table
    await Event.create({
        event_id: 1,
        name: 'Rock Concert',
        date: '2024-10-10',
        start_time: '2024-10-10T18:00:00Z',
        end_time: '2024-10-10T22:00:00Z',
    });

    // Provide event_id when creating Stage entry
    await Stage.create({
        stage_id: 1,
        stage_name: 'Main Stage',
        event_id: 1, // Ensure event_id is not null and corresponds to an existing event
    });

    await Band.create({
        band_id: 1,
        name: 'The Rockers',
        genre: 'Rock',
        available_start_time: '2024-10-10T18:00:00Z',
        end_time: '2024-10-10T22:00:00Z',
    });

    // Create Meet_greet with valid foreign keys
    await Meet_greet.create({
        meet_greet_id: 1,
        event_id: 1, // Existing event_id
        band_id: 1,  // Existing band_id
        meet_start_time: '2024-10-10T16:00:00Z',
        meet_end_time: '2024-10-10T17:00:00Z',
    });

    // Create SetTime entry with valid foreign keys
    await SetTime.create({
        set_time_id: 1,
        event_id: 1,
        stage_id: 1, // Existing stage_id
        band_id: 1,
        set_time_hour: 19,
        end_time: '2024-10-10T20:00:00Z',
    });
});

afterAll(async () => {
    await sequelize.close();
});

describe('Bands API Endpoints', () => {

    it('should create a new band', async () => {
        const response = await request(app)
            .post('/bands')
            .send({
                band_id: 2,
                name: 'Jazz Masters',
                genre: 'Jazz',
                available_start_time: '2024-11-15T18:00:00Z',
                end_time: '2024-11-15T22:00:00Z',
            });
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toHaveProperty('name', 'Jazz Masters');
    });

    it('should retrieve a specific band by Name', async () => {
        const response = await request(app)
            .get('/bands/Rockers');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('band_id', 1);
        expect(response.body).toHaveProperty('name', 'The Rockers');
    });

    it('should update an existing band', async () => {
        const response = await request(app)
            .put('/bands/1')
            .send({ name: 'The Updated Rockers' });
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toContain('Successfully updated');
    });

    it('should delete a band', async () => {
        const response = await request(app)
            .delete('/bands/1');
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toContain('Successfully deleted');
    });
});
