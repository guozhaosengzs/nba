const config = require('./config.json')
const mysql = require('mysql');
const e = require('express');

// TODO: fill in your connection details here
const connection = mysql.createConnection({
    host: config.rds_host,
    user: config.rds_user,
    password: config.rds_password,
    port: config.rds_port,
    database: config.rds_db,
    multipleStatements: true
});
connection.connect();


// ********************************************
//            Game Page
// ********************************************

// Route 1 (handler)
async function game(req, res) {
    // returns the information of 1 specific game given gameID
    //Results should include:
    // Game_ID, Game_Date
    // Nickname, seasonal wins up to now, seasonal losses up to now, Points in game, ftm in game, fgm in game for both teams
    // Seasonal average stats in this season: pts, ast,fg,pf for both teams
    // Seasonal leading players : player with highest pts, player with highest ast,player with highest fg,player with highest pf for both teams
    // Query Parameter(s): Game_ID(int)
}

// Route 2 (handler)
async function search_games(req, res) {
    // returns a list of games that satisfy the searching params
    // Query Parameter(s): Date(string)*, Home (string)*, Away (string)*, City (string)* page (int)*, pagesize (int)* (default: 5) 

  
    
}



// ********************************************
//            Player Page
// ********************************************

// Route 3 (handler)
async function player(req, res) {
    // returns a list of seasonal information for one specific player
    // Query Parameter(s): player(string), page (int)*, pagesize (int)* (default: 10)

}

// Route 4(handler)
async function search_player(req, res) {
    // Returns an array of attributes for all the players that match the search query, 
    // sorted by the specified attribute of interest from highest to lowest, limit by 10.
    // If All_Time is True, then the handler returns players’ stats aggregated over all seasons. 
    // Otherwise, the handler returns players’ stats given one specific season.
    // Query Parameter(s): All_Time (boolean), Season (int), Name (string)*, Team (string)*, Position (string)*


}


// ********************************************
//            Team Page
// ********************************************

// Route 5 (handler)
async function search_team(req, res) {
    // When specified with a team, returns a JSON array, each JSON object of which contains the team basic information, along with 
    //      the average stats of its leading player for that season; 
    //      the information of the game the team won most points in that season; 
    //      the information of the game the team lost most points in that season
    // Query Parameter(s): Team_ID(string)
    if (isNaN(req.query.Team_ID)) {
        res.writeHead(500, {'Error': 'Please pass parameter Team_ID'});
    } else {
       
        const team_id = req.query.Team_ID;
        connection.query(
            `SELECT * FROM Team WHERE ID = ${team_id};

            with player_stats as (select Year, Player, Tm, P.height, 
                P.weight, (Seasons_Stats.PTS/Seasons_Stats.G) as avgPoints, (Seasons_Stats.TRB/Seasons_Stats.G) as avgRebounds,
                (Seasons_Stats.AST/Seasons_Stats.G) as avgAssits,
                ROW_NUMBER() over (PARTITION BY Seasons_Stats.Year ORDER BY (Seasons_Stats.PTS/Seasons_Stats.G) DESC) AS ptslist
                from Seasons_Stats NATURAL JOIN Players P
                where Tm in (select Abbreviation from Team WHERE ID = ${team_id})
                group by Year, Player
                order by Year DESC, avgPoints)
                select * from player_stats where ptslist = 1 limit 10;

            with all_games as (
                    SELECT (PTS_HOME - PTS_AWAY) as winPts, TEAM_ABBREVIATION_HOME as opponent, Pts_Home as opponentScore, Pts_Away as selfScore
                    from Game
                    where Season_ID = 22017 and
                          TEAM_ABBREVIATION_AWAY = 'OKC'
                    UNION
                    SELECT - (PTS_HOME - PTS_AWAY) as winPts, TEAM_ABBREVIATION_AWAY as opponent, Pts_Away as opponentScore, Pts_Home as selfScore
                    from Game
                    where Season_ID = 22017 and
                          TEAM_ABBREVIATION_HOME = 'OKC')
                 select * from all_games where winPts >= all(select winPts from all_games);

            with all_games as (
                    SELECT (PTS_HOME - PTS_AWAY) as winPts, TEAM_ABBREVIATION_HOME as opponent, Pts_Home as opponentScore, Pts_Away as selfScore
                    from Game
                    where Season_ID = 22017 and
                          TEAM_ABBREVIATION_AWAY in (select Abbreviation from Team WHERE ID = ${team_id})
                    UNION
                    SELECT - (PTS_HOME - PTS_AWAY) as winPts, TEAM_ABBREVIATION_AWAY as opponent, Pts_Away as opponentScore, Pts_Home as selfScore
                    from Game
                    where Season_ID = 22017 and
                          TEAM_ABBREVIATION_HOME in (select Abbreviation from Team WHERE ID = ${team_id}))
                 select * from all_games where winPts <= all(select winPts from all_games);
`, [1, 2, 3, 4], function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: 
                    {'TeamInfo': results[0], 
                    'LeadingPlayer': results[1],
                    'Match_Won_By_Most': results[2],
                    'Match_Lost_By_Most': results[3]
                 }})
            }
        })
    } 

}

// ********************************************
//            Home Page
// ********************************************

// Route 6 (handler)
async function player_avg(req, res) {
    // Query Parameter(s): page (int)*, pagesize (int)* (default: 10)


}



module.exports = {
    game,
    search_games,
    player,
    search_player,
    search_team,
    player_avg
}