// events.test.js

const request = require('supertest');
const app = require('../server'); // Import the app without starting the server directly
const { sequelize, Event } = require('../models'); // Import Sequelize instance and Event model for DB setup/teardown

// Before all tests, synchronize the database (optional, depending on test environment setup)
beforeAll(async () => {
    await sequelize.sync({ force: true }); // This will recreate the tables for testing
});

// Close the database connection after all tests
afterAll(async () => {
    await sequelize.close();
});

describe('Events API Endpoints', () => {

    it('should create a new event', async () => {
        const response = await request(app)
            .post('/events/1')
            .send({
                event_id: 1,
                name: 'Music Festival',
                date: '2024-09-20',
                start_time: '2024-09-20T12:00:00Z',
                end_time: '2024-09-20T23:00:00Z'
            });
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toHaveProperty('name', 'Music Festival');
        expect(response.body.data).toHaveProperty('event_id', 1);
    });

    // Test for retrieving all events
    it('should retrieve all events', async () => {
        // Create a sample event to ensure there's data to retrieve
        await Event.create({
            event_id: 2,
            name: 'Rock Concert',
            date: '2024-10-15',
            start_time: '2024-10-15T18:00:00Z',
            end_time: '2024-10-15T22:00:00Z'
        });

        const response = await request(app)
            .get('/events')
            .query({ name: 'Concert' }); // Optional query parameter to filter by name
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body[0]).toHaveProperty('name');
    });

    // Updated test to match corrected endpoint for event retrieval
    it('should retrieve a specific event by ID', async () => {
        await Event.create({
            event_id: 3,
            name: 'Jazz Night',
            date: '2024-11-05',
            start_time: '2024-11-05T19:00:00Z',
            end_time: '2024-11-05T21:00:00Z'
        });

        const response = await request(app)
            .get('/events/3'); // Use '/events/:id' to retrieve event by event_id
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('event_id', 3);
        expect(response.body).toHaveProperty('name', 'Jazz Night');
    });


    // Test for updating an event
    it('should update an existing event', async () => {
        // Ensure the event is created in the setup or previous test
        const event = await Event.create({
            event_id: 4,
            name: 'Old Event',
            date: '2024-12-01',
            start_time: '2024-12-01T18:00:00Z',
            end_time: '2024-12-01T22:00:00Z'
        });

        const response = await request(app)
            .put(`/events/${event.event_id}`)
            .send({ name: 'Updated Event' }); // Update with a new name
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toContain('Successfully updated');
    });

    // Test for deleting an event
    it('should delete an event', async () => {
        // Ensure the event is created in the setup or previous test
        const event = await Event.create({
            event_id: 5,
            name: 'Delete Me',
            date: '2025-01-01',
            start_time: '2025-01-01T20:00:00Z',
            end_time: '2025-01-01T23:00:00Z'
        });

        const response = await request(app)
            .delete(`/events/${event.event_id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toContain('Successfully deleted');
    });
});
