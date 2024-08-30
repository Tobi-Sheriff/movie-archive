const express = require('express');
const app = express();
const { response } = require('./seeds/movies');


app.get('/v1/movies', (req, res) => {
    try {
        const { page, limit } = req.query;
        let pageRez = [];
        for (const eachrez of response) {
            if (pageRez.length < limit) {
                pageRez.push(eachrez)
            }
        }
        res.status(200);
        res.json(pageRez);
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/v1/movies/search', async (req, res) => {
    try {
        const { q } = req.query;
        const searchedMovie = response.find((movies) =>
            movies.title.includes(q));
        if (searchedMovie) {
            res.status(200).json(searchedMovie.title);
        } else {
            res.status(404).json({ message: 'Movie not found' });
        }
    } catch (err) {
        console.log("Express Error");
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/v1/movies/:id', (req, res) => {
    try {
        const { id } = req.params;
        const finddMovie = response.find((movie) =>
            movie.id === parseInt(id));
        if (finddMovie) {
            res.status(200).json(finddMovie);
        } else {
            res.status(404).json({ message: 'Movie not found' });
        }
    } catch (error) {
        console.log(error)
    }
})



// app.listen('3000', () => {
//     console.log('Listening on port 3000');
// })

module.exports = app;
