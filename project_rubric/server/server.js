const express = require('express');
const mysql = require('mysql');


const routes = require('./routes')
const config = require('./config.json')
const cors = require('cors');


const app = express();
app.use(cors({
    origin: '*'
}));

//page game: route 1-2
app.get('/game', routes.game)
app.get('/search/games', routes.search_games)

//page player: route 3-4
app.get('/players', routes.player)
app.get('/search/players', routes.search_player)

//page team: route 5-6
app.get('/search/team', routes.search_team)
app.get('/team', routes.get_team)

//page home: route 7-
app.get('/player_avg', routes.player_avg)

app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});

module.exports = app;