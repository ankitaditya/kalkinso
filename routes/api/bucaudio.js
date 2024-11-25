require('dotenv').config();
const express = require('express')
const BuCAudio = require('../../models/BuCAudio')
const BuCAudioAuthor = require('../../models/BuCAudioAuthor')
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        // Fetch all audio records with status = 1
        const audios = await BuCAudio.find({ status: 1 }).exec();

        // Extract all unique author IDs from the audio records
        const authorIds = [...new Set(audios.map((audio) => audio.author))];

        // Fetch authors from BuCAudioAuthor model
        const authors = await BuCAudioAuthor.find({ id: { $in: authorIds } }).exec();

        // Create a map for quick lookup of authors by ID
        const authorMap = authors.reduce((acc, author) => {
                                acc[author.id] = author.name;
                                return acc;
                            }, {});
        // Replace the author field in each audio record with the corresponding author name
        const result = audios.map((audio) => {
            return {
                ...audio.toJSON(),
                author: authorMap[audio.author.toString()] || "Unknown" // Fallback if no author found
            };
        });

        // Send the final response
        res.json(result);
    } catch (error) {
        console.error("Error fetching audio with authors:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

router.get('/authors/:id', async (req, res) => {
    let authors = [];
    if(req?.params?.id) {
        authors = await BuCAudioAuthor.find({id:req?.params?.id});
    } else {
        authors = await BuCAudioAuthor.find();
    }
    res.json(authors)
})

module.exports = router