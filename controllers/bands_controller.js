//Dependencies
const bands = require('express').Router()
const { Op } = require('sequelize')
const db = require('../models')
const { Band, Meet_greet, SetTime, Event } = db

//Find all bands
bands.get('/:id', async (req, res) => {
    console.log(req.params.id);
    try {
        const foundBand = await Band.findOne({
            where: {
                name: { [Op.like]: `%${req.params.id}%` } // Use LIKE to find names that contain the parameter value
            },
            include: [
                {
                    model: Meet_greet,
                    as: 'meet_greets',
                    include: [
                        {
                            model: Event,
                            as: 'event',
                            where: { name: { [Op.like]: `%${req.query.event ? req.query.event : ''}%` } }
                        }
                    ]
                },
                {
                    model: SetTime,
                    as: 'set_times',
                    include: [
                        {
                            model: Event,
                            as: 'event',
                            where: { name: { [Op.like]: `%${req.query.event ? req.query.event : ''}%` } }
                        }
                    ]
                }
            ]
        });

        if (foundBand) {
            res.status(200).json(foundBand);
        } else {
            res.status(404).json({ message: 'Band not found' });
        }
    } catch (error) {
        console.error('Error fetching band:', error.errors || error.message); // Log specific validation error details
        res.status(500).json({ message: 'An error occurred', errors: error.errors || error.message });
    }
});



//Create bands
bands.post('/', async (req, res) => {
    try {
        const newBand = await Band.create(req.body)
        res.status(200).json({
            message: 'Successfully inserted a new band',
            data: newBand
        })
    } catch (error) {
        res.status(500).json(error)
    }
})

//Update Band
bands.put('/:id', async (req, res) => {
    try {
        const updatedBands = await Band.update(req.body, {
            where: {
                band_id: req.params.id
            }
        })
        res.status(200).json({
            message: `Successfully updated ${updatedBands} band(s)`
        })
     } catch (error) {
        console.error('Error fetching all bands:', error.errors || error.message); // Log specific validation error details
        res.status(500).json({ message: 'An error occurred', errors: error.errors || error.message });
    }
})

//Delete Band
bands.delete('/:id', async(req, res) => {
    try {
        const deletedBands = await Band.destroy({
            where: {
                band_id: req.params.id
            }
        })
        res.status(200).json({
            message: `Successfully deleted ${deletedBands} band(s)`
        })
    } catch (error) {
        res.status(200).json(error)
    }
})

//Exports
module.exports = bands
