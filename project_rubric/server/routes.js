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
        res.end();
    }
    else{
        const Game_ID = req.query.Game_ID;
        connection.query(
            `WITH Game_Info AS (SELECT Game_ID,Season_ID,Game_Date,T1.Nickname AS Nickname_Home, T2.Nickname AS Nickname_Away,Pts_Home,Pts_Away,Ftm_Home,Ftm_Away,Fgm_Home,Fgm_Away,Team_Abbreviation_Home AS HT ,Team_Abbreviation_Away AS AT
                FROM Game Join Team T1 on Game.Team_Abbreviation_Home = T1.Abbreviation
                          Join Team T2 on Game.Team_Abbreviation_Away = T2.Abbreviation
                WHERE Game_ID = ${Game_ID}),
                HT_win_loss AS(SELECT GAME_ID,HT1.HT AS Home_Team,HT1.HT_win_as_home+ HT2.HT_win_as_away AS Home_seasonal_wins, HT1.HT_lose_as_home + HT2.HT_lose_as_away AS Home_seasonal_losses
                FROM
                (SELECT gi.Game_ID AS GAME_ID, g.Team_Abbreviation_Home AS HT, SUM(CASE WHEN WL_Home = 'W' Then 1 Else 0 End) AS HT_win_as_home, SUM(CASE WHEN WL_Home = 'L' Then 1 Else 0 End) AS HT_lose_as_home
                FROM Game g JOIN Game_Info gi on g.Team_Abbreviation_Home = gi.HT
                Where g.Season_ID = gi.season_Id AND g.Game_Date <= gi.Game_Date) AS HT1
                NATURAL JOIN
                (SELECT gi.Game_ID AS GAME_ID,g.Team_Abbreviation_Away AS HT, SUM(CASE WHEN WL_Home = 'L' Then 1 Else 0 End) AS HT_win_as_away, SUM(CASE WHEN WL_Home = 'W' Then 1 Else 0 End) AS HT_lose_as_away
                FROM Game g JOIN Game_Info gi on g.Team_Abbreviation_Away = gi.HT
                Where g.Season_ID = gi.season_Id AND g.Game_Date <= gi.Game_Date) AS HT2),
                AT_win_loss AS(SELECT GAME_ID,AT1.AT AS Away_Team, AT1.AT_win_as_home+ AT2.AT_win_as_away AS Away_seasonal_wins, AT1.AT_lose_as_home + AT2.AT_lose_as_away AS Away_seasonal_losses
                FROM
                (SELECT gi.Game_ID AS GAME_ID,g.Team_Abbreviation_Home AS AT, SUM(CASE WHEN WL_Home = 'W' Then 1 Else 0 End) AS AT_win_as_home, SUM(CASE WHEN WL_Home = 'L' Then 1 Else 0 End) AS AT_lose_as_home
                FROM Game g JOIN Game_Info gi on g.Team_Abbreviation_Home = gi.AT
                Where g.Season_ID = gi.season_Id AND g.Game_Date <= gi.Game_Date) AS AT1
                NATURAL JOIN
                (SELECT gi.Game_ID AS GAME_ID,g.Team_Abbreviation_Away AS AT, SUM(CASE WHEN WL_Home = 'L' Then 1 Else 0 End) AS AT_win_as_away, SUM(CASE WHEN WL_Home = 'W' Then 1 Else 0 End) AS AT_lose_as_away
                FROM Game g JOIN Game_Info gi on g.Team_Abbreviation_Away = gi.AT
                Where g.Season_ID = gi.season_Id AND g.Game_Date <= gi.Game_Date) AS AT2)
                Select Game_Id, Game_Date,Nickname_Home,Nickname_Away,Pts_Home,Pts_Away,Ftm_Home,Ftm_Away,Fgm_Home,Fgm_Away,Home_seasonal_wins,Home_seasonal_losses,Away_seasonal_wins,Away_seasonal_losses
                FROM Game_Info Natural JOIN HT_win_loss Natural JOIN  AT_win_loss;

                
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
                Ay_stats AS (SELECT CAST(SUM(PTS)/num_games_AT AS DECIMAL(5,1)) AS Away_Season_Pts,CAST(SUM(AST)/num_games_AT AS DECIMAL(5,1)) AS Away_Season_Ast,CAST(SUM(FG)/num_games_AT AS DECIMAL(5,1))  AS Away_Season_FG, CAST(SUM(PF)/num_games_AT AS DECIMAL(5,1)) AS Away_Season_PF
                    FROM Seasons_Stats,count_games_AT
                    WHERE Year IN (SELECT Season_ID From Teams) and Tm = (SELECT AT from Teams))
                SELECT Home_Season_Pts,Away_Season_Pts,Home_Season_FG,Away_Season_FG,Home_Season_Ast,Away_Season_Ast,Home_Season_PF,Away_Season_PF
                FROM HT_stats,Ay_stats;

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
    // Query Parameter(s): Date_From(string)*, Date_To(string)*, Home (string)*, Away (string)*, City (string)* page (int)*, pagesize (int)* (default: 10) 

    const Date_From= req.query.Date_From ? req.query.Date_From : '2018-04-01'
    const Date_To= req.query.Date_To ? req.query.Date_To : '2018-04-11'
    const Home = req.query.Home  ? req.query.Home  : ''
    const Away= req.query.Away ? req.query.Away : ''
    const City= req.query.City ? req.query.City : ''
    const pgsize = req.query.pagesize ? req.query.pagesize : 10
    const offsetnum = pgsize * (req.query.page - 1)
    connection.query(
     `WITH All_games AS (SELECT Game_ID,Season_ID,Game_Date,T1.Nickname AS Nickname_Home, T2.Nickname AS Nickname_Away,Pts_Home,Pts_Away,Team_Abbreviation_Home AS HT,Team_Abbreviation_Away AS AT
            FROM Game Join Team T1 on Game.Team_Abbreviation_Home = T1.Abbreviation
                  Join Team T2 on Game.Team_Abbreviation_Away = T2.Abbreviation
            WHERE Game_Date BETWEEN '${Date_From}' AND '${Date_To}'
            AND Team_Abbreviation_Home LIKE '%${Home}%'
            AND Team_Abbreviation_Away LIKE '%${Away}%'
            AND T1.City LIKE '%${City}%'),
            HT_win_loss AS(SELECT GAME_ID,HT1.HT AS Home_Team,HT1.HT_win_as_home+ HT2.HT_win_as_away AS Home_seasonal_wins, HT1.HT_lose_as_home + HT2.HT_lose_as_away AS Home_seasonal_losses
                FROM
               (SELECT gi.Game_ID AS GAME_ID,gi.HT AS HT, SUM(CASE WHEN WL_Home = 'W' Then 1 Else 0 End) AS HT_win_as_home, SUM(CASE WHEN WL_Home = 'L' Then 1 Else 0 End) AS HT_lose_as_home
                FROM Game g JOIN All_games gi on g.Team_Abbreviation_Home = gi.HT
                Where g.Season_ID = gi.season_Id AND g.Game_Date <= gi.Game_Date
                GROUP BY gi.Game_ID) AS HT1
                NATURAL JOIN
                (SELECT gi.Game_ID AS GAME_ID,gi.HT AS HT, SUM(CASE WHEN WL_Home = 'L' Then 1 Else 0 End) AS HT_win_as_away, SUM(CASE WHEN WL_Home = 'W' Then 1 Else 0 End) AS HT_lose_as_away
                FROM Game g JOIN All_games gi on g.Team_Abbreviation_Away = gi.HT
                Where g.Season_ID = gi.season_Id AND g.Game_Date < gi.Game_Date
                Group BY gi.Game_ID) AS HT2),
            AT_win_loss AS(SELECT GAME_ID,AT1.AT AS Away_Team, AT1.AT_win_as_home+ AT2.AT_win_as_away AS Away_seasonal_wins, AT1.AT_lose_as_home + AT2.AT_lose_as_away AS Away_seasonal_losses
                FROM
                (SELECT gi.Game_ID AS GAME_ID, gi.AT AS AT, SUM(CASE WHEN WL_Home = 'W' Then 1 Else 0 End) AS AT_win_as_home, SUM(CASE WHEN WL_Home = 'L' Then 1 Else 0 End) AS AT_lose_as_home
                FROM Game g JOIN All_games gi on g.Team_Abbreviation_Home = gi.AT
                Where g.Season_ID = gi.season_Id AND g.Game_Date <= gi.Game_Date
                GROUP BY gi.Game_ID) AS AT1
                NATURAL JOIN
                (SELECT gi.Game_ID AS GAME_ID,gi.AT AS AT, SUM(CASE WHEN WL_Home = 'L' Then 1 Else 0 End) AS AT_win_as_away, SUM(CASE WHEN WL_Home = 'W' Then 1 Else 0 End) AS AT_lose_as_away
                FROM Game g JOIN All_games gi on g.Team_Abbreviation_Away = gi.AT
                Where g.Season_ID = gi.season_Id AND g.Game_Date <= gi.Game_Date
                Group BY gi.Game_ID) AS AT2),
    
            Home_Season_King AS (SELECT h.Game_ID AS GAME_ID,h.Player AS Home_Seasonal_Leader,h.pos AS Home_leader_Pos,h.PTS AS Home_leader_Pts,h.PER AS Home_leader_PER,h.TSP AS Home_leader_TSP
                FROM
                (SELECT gi.Game_ID AS GAME_ID,Player,pos,CAST(AVG(PTS/G) AS DECIMAL(5,1)) AS PTS,CAST(AVG(PER) AS DECIMAL(5,1)) AS PER,CAST(AVG(TS_Percentage) AS DECIMAL(5,2)) AS TSP,
                row_number() over (PARTITION BY GAME_ID ORDER BY PTS/G DESC) AS pts_rank
                FROM Seasons_Stats s JOIN All_games gi ON s.Tm = gi.HT
                WHERE s.Year = gi.Season_ID
                Group By Game_Id,Player) AS h
                WHERE h.pts_rank = 1),
            Away_Season_King AS (SELECT a.Game_ID AS GAME_ID,a.Player AS Away_Seasonal_Leader,a.pos AS Away_leader_Pos,a.PTS AS Away_leader_Pts,a.PER AS Away_leader_PER,a.TSP AS Away_leader_TSP
                    FROM
                    (SELECT gi.Game_ID AS GAME_ID,Player,pos,CAST(AVG(PTS/G) AS DECIMAL(5,1)) AS PTS,CAST(AVG(PER) AS DECIMAL(5,1)) AS PER,CAST(AVG(TS_Percentage) AS DECIMAL(5,2)) AS TSP,
                    row_number() over (PARTITION BY GAME_ID ORDER BY PTS/G DESC) AS pts_rank
                    FROM Seasons_Stats s JOIN All_games gi ON s.Tm = gi.AT
                    WHERE s.Year = gi.Season_ID
                    Group By Game_Id,Player) AS a
                    WHERE a.pts_rank = 1)
            SELECT Game_ID,Game_Date,HT as Home_Abbr,AT AS Away_abbr, Nickname_Home,Nickname_Away,Pts_Home,Pts_Away,Home_seasonal_wins,Home_seasonal_losses,Away_seasonal_wins,Away_seasonal_losses,Home_Seasonal_Leader,Away_Seasonal_Leader,Home_Leader_Pos,Away_Leader_Pos,Home_leader_Pts,Away_leader_Pts,Home_leader_PER,Away_leader_PER,Home_leader_TSP,Away_leader_TSP
                    FROM All_games NATURAL JOIN HT_win_loss NATURAL JOIN AT_win_loss NATURAL JOIN Home_Season_King NATURAL JOIN Away_Season_King
                    ORDER BY Game_Date DESC,HT_win_loss.Home_Team ASC,AT_win_loss.Away_Team ASC
                    LIMIT ${offsetnum},${pgsize}
    `, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });  

}



// ********************************************
//            Player Page
// ********************************************

// Route 3 (handler)
async function player(req, res) {
    // returns a list of seasonal information for one specific player
    // Query Parameter(s): player(string), page (int)*, pagesize (int)* (default: 10)

    var player = req.query.player_name;
    const page = req.query.page ? req.query.page : 1;
    const pagesize = req.query.pagesize ? req.query.pagesize : 10;
    var offset = pagesize * (page - 1);
    connection.query(`
    select Year as Season, Tm as Team, Height, Weight,
    Born as Birth_Year, Birth_City, Birth_State, College,
    Pos, (PTS/G) as PPG, (AST/G) as APG, (TRB/G) as RPG, PF, eFG_Percentage as EFG
    from Players natural join Seasons_Stats
    where Player like "${player}"
    order by Season desc limit ${offset}, ${pagesize};
    `, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });  

}

// Route 4(handler)
async function search_player(req, res) {
    // Returns an array of attributes for all the players that match the search query, 
    // sorted by the specified attribute of interest from highest to lowest, limit by 10.
    // If All_Time is True, then the handler returns players’ stats aggregated over all seasons. 
    // Otherwise, the handler returns players’ stats given one specific season.
    // Query Parameter(s): All_Time (boolean), Season (int), Attribute (string), Name (string)*, Team (string)*, Position (string)*
    const Attributes = ['Games', 'Points', 'Assists', 'Rebounds', 'FGs','PFs']
    if (!(req.query.All_Time) || !(req.query.Season) || !(req.query.Attribute)){
        console.log(req.query.All_Time, req.query.Season, req.query.Attribute)
        res.writeHead(500, {'Error': 'Please pass required parameters'});
        res.end();
    } else {
        const attribute = req.query.Attribute;
        const name = req.query.Name ? '%' + req.query.Name + '%' : '%';
        const team = req.query.Team ? '%' + req.query.Team + '%' : '%';
        const position = req.query.Position ? '%' + req.query.Position + '%' : '%';
        if (!Attributes.includes(attribute)) {
            res.writeHead(500, {'Error': 'Please pass required parameters'});
            res.end();
        } else {
            if (req.query.All_Time == true) {
                connection.query(`
                select Player, Pos, sum(G) as Games, sum(PTS) as Points, 
                sum(AST) as Assits, sum(TRB) as Rebounds, sum(PF) as PFs, sum(FG) as FGs
                from Seasons_Stats
                where Player like '${name}' and Tm like '${team}' and Pos like '${position}'
                group by Player
                order by ${attribute} DESC limit 10;`,
                function (error, results, fields) {
                    if (error) {
                        console.log(error)
                        res.json({ error: error })
                    } else if (results) {
                        res.json({ results: results })
                    }
                });
            } else {
                const season = req.query.Season;
                connection.query(`
                select Player, Pos, sum(G) as Games, sum(PTS) as Points,
                sum(AST) as Assits, sum(TRB) as Rebounds, sum(PF) as PFs, sum(FG) as FGs
                from Seasons_Stats
                where Player like '${name}' and Tm like '${team}' and Pos like '${position}' and Year = ${season}
                group by Player
                order by ${attribute} DESC limit 10
                `, function (error, results, fields) {
                    if (error) {
                        console.log(error)
                        res.json({ error: error })
                    } else if (results) {
                        res.json({ results: results })
                    }
                });     
            }
        }
    }

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
        res.end();
    } else {
       
        const team_id = req.query.Team_ID;
        connection.query(
            `SELECT * FROM Team WHERE ID = ${team_id};

            with player_stats as (select Year as Season, Player, Tm, P.height, 
                P.weight, (Seasons_Stats.PTS/Seasons_Stats.G) as avgPoints, (Seasons_Stats.TRB/Seasons_Stats.G) as avgRebounds,
                (Seasons_Stats.AST/Seasons_Stats.G) as avgAssits,
                ROW_NUMBER() over (PARTITION BY Seasons_Stats.Year ORDER BY (Seasons_Stats.PTS/Seasons_Stats.G) DESC) AS ptslist
                from Seasons_Stats NATURAL JOIN Players P
                where Tm in (select Abbreviation from Team WHERE ID = ${team_id})
                group by Year, Player
                order by Year DESC, avgPoints)
                select * from player_stats where ptslist = 1 limit 10;
            
            with all_games as (
                    SELECT Season_ID, (PTS_AWAY - PTS_HOME) as winPts, Team_Abbreviation_Away as self, TEAM_ABBREVIATION_HOME as opponent, Pts_Home as opponentScore, Pts_Away as selfScore
                    from Game
                    where
                          TEAM_ABBREVIATION_AWAY in (select Abbreviation from Team WHERE ID = ${team_id})
                    UNION
                    SELECT Season_ID, (PTS_HOME - PTS_AWAY) as winPts, TEAM_ABBREVIATION_HOME as self, TEAM_ABBREVIATION_AWAY as opponent, Pts_Away as opponentScore, Pts_Home as selfScore
                    from Game
                    where
                          TEAM_ABBREVIATION_HOME in (select Abbreviation from Team WHERE ID = ${team_id}))
                 select Season_ID as Season, self, opponent, selfScore, opponentScore, ROW_NUMBER() over (PARTITION BY Season_ID ORDER BY winPts DESC ) as rankList from all_games order by rankList ASC, Season_ID DESC  LIMIT 10;

            with all_games as (
                    SELECT Season_ID, (PTS_HOME - PTS_AWAY) as lossPts, Team_Abbreviation_Away as self, TEAM_ABBREVIATION_HOME as opponent, Pts_Home as opponentScore, Pts_Away as selfScore
                    from Game
                    where
                          TEAM_ABBREVIATION_AWAY in (select Abbreviation from Team WHERE ID = ${team_id})
                    UNION
                    SELECT Season_ID, (PTS_AWAY - PTS_HOME) as lossPts, TEAM_ABBREVIATION_HOME as self, TEAM_ABBREVIATION_AWAY as opponent, Pts_Away as opponentScore, Pts_Home as selfScore
                    from Game
                    where
                          TEAM_ABBREVIATION_HOME in (select Abbreviation from Team WHERE ID = ${team_id}))
                 select Season_ID as Season, self, opponent, selfScore, opponentScore, ROW_NUMBER() over (PARTITION BY Season_ID ORDER BY lossPts DESC ) as rankList from all_games order by rankList ASC, Season_ID DESC  LIMIT 10;
`, [1, 2, 3, 4], function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: 
                    {'TeamInfo': results[0], 
                    'LeadingPlayer': results[1],
                    'Match_Won_By_Most': results[2],
                    'Match_Lost_By_Most': results[2]
                 }})
            }
        })
    } 

}


// Route 6 (handler)
async function get_team(req, res) {
    const teamName = req.query.Team_Name ? '%' + req.query.Team_Name + '%' : '%';
    connection.query(`select ID from Team where Full_Name like '${teamName}' limit 1`,
    function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}

// ********************************************
//            Home Page
// ********************************************

// Route 7 (handler)
async function player_avg(req, res) {
    // Query Parameter(s): page (int)*, pagesize (int)* (default: 10)
    const page = req.query.page ? req.query.page : 1;
    const pagesize = req.query.pagesize ? req.query.pagesize : 10;
    var offset = pagesize * (page - 1);
    connection.query(`
    with player_yearly_stats as (select Player, Year as Season, Tm as Team, Height, Weight,
        Born as Birth_Year, Birth_City, Birth_State, College,
        Pos, (PTS/G) as PPG, (AST/G) as APG, (TRB/G) as RPG, PF, eFG_Percentage as EFG
        from Players natural join Seasons_Stats
        group by player ,year) select Player, Height, Weight, Birth_Year, Birth_City, Birth_State, College,
        Pos as Position, avg(PPG) as PointPerSeason, avg(APG) as AssistPerSeason, avg(PF) as PersonalFoulPerSeason, avg(EFG) as EFGPerSeason
        from player_yearly_stats group by Player order by PointPerSeason desc
        limit ${offset}, ${pagesize};
    `, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }}
    );
}



module.exports = {
    game,
    search_games,
    player,
    search_player,
    search_team,
    get_team,
    player_avg
}