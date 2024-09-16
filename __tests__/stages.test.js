// stages.test.js

const request = require('supertest');
const app = require('../server');
const { sequelize, Stage } = require('../models');

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

describe('Stages API Endpoints', () => {
    it('should create a new stage', async () => {
        const response = await request(app)
            .post('/stages')
            .send({
                stage_events_id: 1,
                stage_id: 1,
                event_id: 1,
                stage_name: 'Main Stage'
            });
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toHaveProperty('stage_id', 1);
        expect(response.body.data).toHaveProperty('event_id', 1);
        expect(response.body.data).toHaveProperty('stage_name', 'Main Stage');
    });

    // Test for retrieving all stages
    it('should retrieve all stages', async () => {
        await Stage.create({ stage_events_id: 2, stage_id: 2, event_id: 1, stage_name: 'Side Stage' });

        const response = await request(app)
            .get('/stages')
            .query({ name: 'Stage' });
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body[0]).toHaveProperty('stage_name');
    });

    // Test for retrieving a specific stage by id
    it('should retrieve a stage by id', async () => {
        // Ensure the stage is created in the setup or previous test
        await Stage.create({ stage_events_id: 3, stage_id: 3, event_id: 1, stage_name: 'Side Stage' });

        const response = await request(app)
            .get('/stages/3'); // Use stage_id to retrieve the specific stage
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('stage_id', 3);
        expect(response.body).toHaveProperty('stage_name', 'Side Stage');
    });

    // Test for updating a stage
    it('should update an existing stage', async () => {
        // Ensure the stage is created in the setup or previous test
        const stage = await Stage.create({ stage_events_id: 4, stage_id: 4, event_id: 1, stage_name: 'Old Stage' });

        const response = await request(app)
            .put(`/stages/${stage.stage_id}`)
            .send({ stage_name: 'Updated Stage' }); // Update with a new stage_name
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toContain('Succesfully updated');
    });

    // Test for deleting a stage
    it('should delete a stage', async () => {
        // Ensure the stage is created in the setup or previous test
        const stage = await Stage.create({ stage_events_id: 5, stage_id: 5, event_id: 1, stage_name: 'Delete Stage' });

        const response = await request(app)
            .delete(`/stages/${stage.stage_id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toContain('Successfully deleted');
    });
});
