require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');

const HowTo = require('../../models/HowTo'); // Ensure this path matches your model location

const router = express.Router();

// Middleware to check authorization
const auth = require('../../middleware/auth');

// GET all HowTo documents
router.get('/', auth, async (req, res) => {
    try {
        const howtos = await HowTo.find();
        res.json(howtos);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET search for HowTo documents based on keywords
router.get('/search', auth, async (req, res) => {
    const { query } = req.query; // Assume the query is passed as a URL query parameter

    if (!query) {
        return res.status(400).json({ msg: 'Search query is required' });
    }

    try {
        const howtos = await HowTo.find({
            $text: { $search: query }
        }, {
            score: { $meta: "textScore" }
        }).sort({
            score: { $meta: "textScore" }
        });

        if (howtos.length === 0) {
            return res.status(404).json({ msg: 'No HowTo documents found' });
        }

        res.json(howtos);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET a single HowTo document by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const howto = await HowTo.findById(req.params.id);
        if (!howto) return res.status(404).json({ msg: 'HowTo not found' });
        res.json(howto);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'HowTo not found' });
        }
        res.status(500).send('Server Error');
    }
});

// POST a new HowTo document
router.post(
    '/',
    [ auth,
      body('title', 'Title is required').not().isEmpty(),
      body('description', 'Description is required').not().isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description, steps, materials, category, tags, estimatedTime, difficulty } = req.body;

        try {
            const newHowTo = new HowTo({
                title,
                description,
                steps, // Assume steps and other fields are properly formatted according to the schema
                materials,
                category,
                tags,
                estimatedTime,
                difficulty,
                author: req.user.id // Assuming the user ID is stored in req.user.id
            });

            const howto = await newHowTo.save();
            res.json(howto);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// PUT update a HowTo document
router.put('/:id', auth, async (req, res) => {
    const { title, description, steps, materials, category, tags, estimatedTime, difficulty } = req.body;

    // Build a HowTo object
    const howToFields = {};
    if (title) howToFields.title = title;
    if (description) howToFields.description = description;
    if (steps) howToFields.steps = steps;
    if (materials) howToFields.materials = materials;
    if (category) howToFields.category = category;
    if (tags) howToFields.tags = tags;
    if (estimatedTime) howToFields.estimatedTime = estimatedTime;
    if (difficulty) howToFields.difficulty = difficulty;

    try {
        let howto = await HowTo.findById(req.params.id);
        if (!howto) return res.status(404).json({ msg: 'HowTo not found' });

        howto = await HowTo.findByIdAndUpdate(
            req.params.id,
            { $set: howToFields },
            { new: true }
        );

        res.json(howto);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// DELETE a HowTo document
router.delete('/:id', auth, async (req, res) => {
    try {
        const howto = await HowTo.findById(req.params.id);
        if (!howto) return res.status(404).json({ msg: 'HowTo not found' });

        await HowTo.deleteOne({_id:req.params.id});
        res.json({ msg: `${req.params.id} removed` });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'HowTo not found' }); 
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;