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

//page team: route 7-11
app.get('/search/team_info', routes.search_team_info)
app.get('/search/team_win', routes.search_team_win)
app.get('/search/team_loses', routes.search_team_loses)
app.get('/search/team_player', routes.search_team_player)
app.get('/team', routes.get_team)

//page home: route 12
app.get('/player_avg', routes.player_avg)

//page facts: route 13-16
app.get('/first_all_nba', routes.first_all_nba)
app.get('/only_got_numbers', routes.only_got_numbers)
app.get('/lucky', routes.lucky)
app.get('/contributes_most', routes.contributes_most)

app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});

module.exports = app;