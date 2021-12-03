const express = require('express');
const mysql = require('mysql');


const routes = require('./routes')
const config = require('./config.json')
const cors = require('cors');


const app = express();
app.use(cors({
    origin: '*'
}));

//page game: route 1-4
app.get('/game', routes.game)
app.get('/gameteam', routes.game_team_info)
app.get('/gameplayer', routes.game_player_info)
app.get('/search/games', routes.search_games)

//page player: route 5-6
app.get('/players', routes.player)
app.get('/search/players', routes.search_player)

//page team: route 7-8
app.get('/search/team', routes.search_team)
app.get('/team', routes.get_team)

//page home: route 9
app.get('/player_avg', routes.player_avg)

//page facts: route 10-13
app.get('/first_all_nba', routes.first_all_nba)
app.get('/only_got_numbers', routes.only_got_numbers)

app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});

module.exports = app;