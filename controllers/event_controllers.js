const events = require('express').Router()
const { Op, Model } = require('sequelize')
const db = require('../models')
const { Event, Stage, Meet_greet, SetTime } = db;

//Find events
events.get('/', async (req, res) => {
    try {
        const foundEvents = await Event.findAll({
            order: [ [ 'date', 'ASC' ] ],
            where : {
                name: { [Op.like]: `%${req.query.name ? req.query.name : ""}%` }
            }
        })
        res.status(200).json(foundEvents)
    } catch (error) {
        res.status(500).json(error)
    }
})

//Find specific event
// Corrected endpoint to find an event by ID
events.get('/:id', async (req, res) => {
    try {
        const foundEvent = await Event.findOne({
            where: { event_id: req.params.id }, // Use correct parameter 'id' to match event_id
            include: [
                {
                    model: Stage, // Include stages associated through stage_event
                    as: 'stages',
                    through: { attributes: [] }, // Optional: exclude attributes from the junction table
                },
                {
                    model: Meet_greet, // Include meet_greets directly associated with the event
                    as: 'meet_greets',
                },
                {
                    model: SetTime, // Include set_times directly associated with the event
                    as: 'set_times',
                }
            ]
        });

        if (foundEvent) {
            res.status(200).json(foundEvent);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json(error);
    }
});


//Create events
events.post('/:id', async (req, res) => {
    try {
        const newEvent = await Event.create(req.body)
        res.status(200).json({
            message: 'Successfully inserted a new event',
            data: newEvent
        })
    } catch (error) {
        res.status(500).json(error)
    }
})

//Update event
events.put('/:id', async(req, res) => {
    try {
        const updatedEvent = await Event.update(req.body, {
            where: {
                event_id: req.params.id
            }
        })
        res.status(200).json({
            message: `Successfully updated ${updatedEvent} event(s)`
        })
    } catch (error) {
        res.status(500).json(error)
    }
})

//Delete event
events.delete('/:id', async(req, res) => {
    try {
        const deletedEvent = await Event.destroy({
            where: {
                event_id: req.params.id
            }
        })
        res.status(200).json({
            message: `Successfully deleted ${deletedEvent} event(s)`
        })
    } catch (error) {
        res.status(200).json(error)
    }
})

//Export
module.exports = events
