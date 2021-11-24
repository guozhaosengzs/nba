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
    //Return an array with required information of a specific game.
    //Results should include 3 JSON objects:
    //Team_Game_Info: Game_ID, Game_Date; Nickname, seasonal wins up to now, seasonal losses up to now, Points in game, ftm in game, fgm in game for both teams
    //Team_Season_Stats: Average stats in this season: pts, ast, fg, pf for both teams
    //Leading_player_Info : player with highest pts and the pts value, player with highest ast and the ast value, player with highest fg and the fg value, player with highest pf and the pf value  for both teams
    if (isNaN(req.query.Game_ID)) {
        res.writeHead(500, {'Error': 'Please pass parameter Game_ID'});
    }
    else{
        const Game_ID = req.query.Game_ID;
        connection.query(
            `WITH Game_Info AS (SELECT Game_ID,Season_ID,Game_Date,T1.Nickname AS Nickname_Home, T2.Nickname AS Nickname_Away,Pts_Home,Pts_Away,Ftm_Home,Ftm_Away,Fgm_Home,Fgm_Away,Team_Abbreviation_Home AS HT ,Team_Abbreviation_Away AS AT
                FROM Game Join Team T1 on Game.Team_Abbreviation_Home = T1.Abbreviation
                          Join Team T2 on Game.Team_Abbreviation_Away = T2.Abbreviation
                WHERE Game_ID = ${Game_ID}),         
                HT_win_loss AS(SELECT HT1.HT AS Home_Team,HT1.HT_win_as_home+ HT2.HT_win_as_away AS Home_seasonal_wins, HT1.HT_lose_as_home + HT2.HT_lose_as_away AS Home_seasonal_losses
                FROM
                (SELECT g.Team_Abbreviation_Home AS HT, SUM(CASE WHEN WL_Home = 'W' Then 1 Else 0 End) AS HT_win_as_home, SUM(CASE WHEN WL_Home = 'L' Then 1 Else 0 End) AS HT_lose_as_home
                FROM Game g JOIN Game_Info gi on g.Team_Abbreviation_Home = gi.HT
                Where g.Season_ID = gi.season_Id AND g.Game_Date <= gi.Game_Date) AS HT1
                NATURAL JOIN
                (SELECT g.Team_Abbreviation_Away AS HT, SUM(CASE WHEN WL_Home = 'L' Then 1 Else 0 End) AS HT_win_as_away, SUM(CASE WHEN WL_Home = 'W' Then 1 Else 0 End) AS HT_lose_as_away
                FROM Game g JOIN Game_Info gi on g.Team_Abbreviation_Away = gi.HT
                Where g.Season_ID = gi.season_Id AND g.Game_Date < gi.Game_Date) AS HT2),
                AT_win_loss AS(SELECT AT1.AT AS Away_Team, AT1.AT_win_as_home+ AT2.AT_win_as_away AS Away_seasonal_wins, AT1.AT_lose_as_home + AT2.AT_lose_as_away AS Away_seasonal_losses
                FROM
                (SELECT g.Team_Abbreviation_Home AS AT, SUM(CASE WHEN WL_Home = 'W' Then 1 Else 0 End) AS AT_win_as_home, SUM(CASE WHEN WL_Home = 'L' Then 1 Else 0 End) AS AT_lose_as_home
                FROM Game g JOIN Game_Info gi on g.Team_Abbreviation_Home = gi.AT
                Where g.Season_ID = gi.season_Id AND g.Game_Date < gi.Game_Date) AS AT1
                NATURAL JOIN
                (SELECT g.Team_Abbreviation_Away AS AT, SUM(CASE WHEN WL_Home = 'L' Then 1 Else 0 End) AS AT_win_as_away, SUM(CASE WHEN WL_Home = 'W' Then 1 Else 0 End) AS AT_lose_as_away
                FROM Game g JOIN Game_Info gi on g.Team_Abbreviation_Away = gi.AT
                Where g.Season_ID = gi.season_Id AND g.Game_Date <= gi.Game_Date) AS AT2)
                Select Game_Id, Game_Date,Nickname_Home,Nickname_Away,Pts_Home,Pts_Away,Ftm_Home,Ftm_Away,Fgm_Home,Fgm_Away,Home_seasonal_wins,Home_seasonal_losses,Away_seasonal_wins,Away_seasonal_losses
                FROM Game_Info,HT_win_loss,AT_win_loss;

                
                WITH Teams AS (SELECT Season_ID,Team_Abbreviation_Home AS HT ,Team_Abbreviation_Away AS AT
                    FROM Game
                    WHERE Game_ID = ${Game_ID}),
                count_games_HT AS(SELECT count(*) AS num_games_HT
                    FROM Game
                    WHERE Season_ID IN (SELECT Season_ID FROM Teams) AND (Team_Abbreviation_Home IN (SELECT HT FROM Teams) OR Team_Abbreviation_Away IN (SELECT HT FROM Teams))),
                count_games_AT AS(SELECT count(*) AS num_games_AT
                    FROM Game
                    WHERE Season_ID IN (SELECT Season_ID FROM Teams) AND (Team_Abbreviation_Home IN (SELECT AT FROM Teams) OR Team_Abbreviation_Away IN (SELECT AT FROM Teams))),
                HT_stats AS(SELECT CAST(SUM(PTS)/num_games_HT AS DECIMAL(5,1)) AS Home_Season_Pts,CAST(SUM(AST)/num_games_HT AS DECIMAL(5,1)) AS Home_Season_Ast,CAST(SUM(FG)/num_games_HT AS DECIMAL(5,1))  AS Home_Season_FG, CAST(SUM(PF)/num_games_HT AS DECIMAL(5,1)) AS Home_Season_PF
                    FROM Seasons_Stats,count_games_HT
                    WHERE Year IN (SELECT Season_ID From Teams) and Tm = (SELECT HT from Teams)),
                AT_stats AS (SELECT CAST(SUM(PTS)/num_games_AT AS DECIMAL(5,1)) AS Away_Season_Pts,CAST(SUM(AST)/num_games_AT AS DECIMAL(5,1)) AS Away_Season_Ast,CAST(SUM(FG)/num_games_AT AS DECIMAL(5,1))  AS Away_Season_FG, CAST(SUM(PF)/num_games_AT AS DECIMAL(5,1)) AS Away_Season_PF
                    FROM Seasons_Stats,count_games_AT
                    WHERE Year IN (SELECT Season_ID From Teams) and Tm = (SELECT AT from Teams))
                SELECT Home_Season_Pts,Away_Season_Pts,Home_Season_FG,Away_Season_FG,Home_Season_Ast,Away_Season_Ast,Home_Season_PF,Away_Season_PF
                FROM HT_stats,AT_stats；

    
                WITH Teams AS (SELECT Season_ID,Team_Abbreviation_Home AS HT ,Team_Abbreviation_Away AS AT
                    FROM Game
                    WHERE Game_ID = ${Game_ID}),
                HT_player_ranks AS(SELECT Player,AVG(PTS/G) AS player_pts,AVG(AST/G) AS player_ast,AVG(PF/G) AS player_pf,AVG(FG/G) AS player_fg,
                ROW_NUMBER() over (ORDER BY AVG(PTS/G) DESC) AS pts_rank,
                ROW_NUMBER() over (ORDER BY AVG(AST/G) DESC) AS ast_rank,
                ROW_NUMBER() over (ORDER BY AVG(PF/G) DESC) AS pf_rank,
                ROW_NUMBER() over (ORDER BY AVG(FG/G) DESC) AS fg_rank
                From Seasons_Stats
                WHERE Year IN (Select Season_ID From Teams) AND (Tm IN (Select HT FROM Teams))
                GROUP BY Player),
                AT_player_ranks AS(SELECT Player,AVG(PTS/G) AS player_pts,AVG(AST/G) AS player_ast,AVG(PF/G) AS player_pf,AVG(FG/G) AS player_fg,
                ROW_NUMBER() over (ORDER BY AVG(PTS/G) DESC) AS pts_rank,
                ROW_NUMBER() over (ORDER BY AVG(AST/G) DESC) AS ast_rank,
                ROW_NUMBER() over (ORDER BY AVG(PF/G) DESC) AS pf_rank,
                ROW_NUMBER() over (ORDER BY AVG(FG/G) DESC) AS fg_rank
                From Seasons_Stats
                WHERE Year IN (Select Season_ID From Teams) AND (Tm IN (Select AT FROM Teams))
                GROUP BY Player)
                SELECT *
                FROM (SELECT Player AS Home_PTS_king,Cast(player_pts AS DECIMAL(5,1)) AS Home_Highest_PTS FROM HT_player_ranks WHERE pts_rank = 1) ht1,
                (SELECT Player AS Away_PTS_king,Cast(player_pts AS DECIMAL(5,1)) AS Away_Highest_PTS FROM AT_player_ranks WHERE pts_rank = 1) at1,
                (SELECT Player AS Home_AST_king,Cast(player_ast AS DECIMAL(5,1)) AS Home_Highest_AST FROM HT_player_ranks WHERE ast_rank = 1) ht2,
                (SELECT Player AS Away_AST_king,Cast(player_ast AS DECIMAL(5,1)) AS Away_Highest_AST FROM AT_player_ranks WHERE ast_rank = 1) at2,
                (SELECT Player AS Home_PF_king,Cast(player_pf AS DECIMAL(5,1))  AS Home_Highest_PF  FROM HT_player_ranks WHERE pf_rank = 1) ht3,
                (SELECT Player AS Away_PF_king,Cast(player_pf AS DECIMAL(5,1))  AS Away_Highest_PF  FROM AT_player_ranks WHERE pf_rank = 1) at3,
                (SELECT Player AS Home_FG_king,Cast(player_fg AS DECIMAL(5,1)) AS Home_Highest_FG FROM HT_player_ranks WHERE fg_rank = 1) ht4,
                (SELECT Player AS Away_FG_king,Cast(player_fg AS DECIMAL(5,1)) AS Away_Highest_FG FROM AT_player_ranks WHERE fg_rank = 1) at4

                `, [1, 2, 3], function (error, results, fields) {
                    if (error) {
                        console.log(error)
                        res.json({ error: error })
                    } else if (results) {
                        res.json({ results: 
                            {'Game_Team_Info': results[0], 
                             'Team_Season_Stats': results[1],
                             'Leading_Player_Info': results[2]
                         }})
                    }
                })
    }
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