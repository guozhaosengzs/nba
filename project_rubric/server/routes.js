const config = require("./config.json");
const mysql = require("mysql");
const e = require("express");

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
  //Return an array with required game information of a specific game, specified by Game_ID, including
  //Game_ID, including Game_ID, Game_Date; Nickname,Points in game, ftm in game, fgm in game ,seasonal wins up to now, seasonal losses up to now for both teams
  if (isNaN(req.query.Game_ID)) {
    res.writeHead(500, { Error: "Please pass parameter Game_ID" });
    res.end();
  } else {
    const Game_ID = req.query.Game_ID;
    connection.query(
      `WITH Game_Info AS (SELECT Game_ID,Season_ID,Game_Date,T1.Nickname AS Nickname_Home, T2.Nickname AS Nickname_Away,Pts_Home,Pts_Away,Ftm_Home,Ftm_Away,Fgm_Home,Fgm_Away,Team_Abbreviation_Home AS HT ,Team_Abbreviation_Away AS AT
FROM Game Join Team T1 on Game.Team_Abbreviation_Home = T1.Abbreviation
                  Join Team T2 on Game.Team_Abbreviation_Away = T2.Abbreviation
 WHERE Game_ID = ${Game_ID})
Select Game_Info.Game_Id, Game_Date,Nickname_Home,Nickname_Away,Pts_Home,Pts_Away,Ftm_Home,Ftm_Away,Fgm_Home,Fgm_Away,Home_seasonal_wins,Home_seasonal_losses,Away_seasonal_wins,Away_seasonal_losses
FROM Game_Info JOIN HT_win_loss ON Game_Info.Game_ID = HT_win_loss.GAME_ID JOIN AT_win_loss ON Game_Info.Game_ID = AT_win_loss.GAME_ID;`,
      function (error, results, fields) {
        if (error) {
          console.log(error);
          res.json({ error: error });
        } else if (results) {
          res.json({ results: results });
        }
      }
    );
  }
}

//Route 2
async function game_team_info(req, res) {
  //Return an array with required information of Home team and Away team for a specific game specified by Game_ID, including :
  //Average stats in this season: pts, ast, fg, pf for both teams
  if (isNaN(req.query.Game_ID)) {
    res.writeHead(500, { Error: "Please pass parameter Game_ID" });
    res.end();
  } else {
    const Game_ID = req.query.Game_ID;
    connection.query(
      `WITH Teams AS (SELECT Season_ID,Team_Abbreviation_Home AS HT ,Team_Abbreviation_Away AS AT
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
                FROM HT_stats,Ay_stats;`,
      function (error, results, fields) {
        if (error) {
          console.log(error);
          res.json({ error: error });
        } else if (results) {
          res.json({ results: results });
        }
      }
    );
  }
}

//Route 3
async function game_player_info(req, res) {
  //Return an array with required information of leading players in home and away team of a specific game, specified by Game_ID, including:
  //player with highest pts and the pts value, player with highest ast and the ast value, player with highest fg and the fg value, player with highest pf and the pf value  for both teams
  if (isNaN(req.query.Game_ID)) {
    res.writeHead(500, { Error: "Please pass parameter Game_ID" });
    res.end();
  } else {
    const Game_ID = req.query.Game_ID;
    connection.query(
      `WITH Teams AS (SELECT Season_ID,Team_Abbreviation_Home AS HT ,Team_Abbreviation_Away AS AT
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
            (SELECT Player AS Away_FG_king,Cast(player_fg AS DECIMAL(5,1)) AS Away_Highest_FG FROM AT_player_ranks WHERE fg_rank = 1) at4`,
      function (error, results, fields) {
        if (error) {
          console.log(error);
          res.json({ error: error });
        } else if (results) {
          res.json({ results: results });
        }
      }
    );
  }
}

// Route 4 (handler)
async function search_games(req, res) {
  //Return an array with required information of all games that match the constraints. If no match satisfies the constraints, return an empty array as ‘results’ without causing an error.
  //Results should include(for each game):
  //Game_ID, Game_Date; Abbreviation, Nickname, Points in game seasonal wins up to now, seasonal losses up to now, for both teams
  //Seasonal Leader player name and the position, PER , Pts, TSP(ts_percentage) of the leader for both teams

  const Date_From = (req.query.Date_From === "undefined") ? "2017-01-01" : req.query.Date_From;
  const Date_To = (req.query.Date_To === "undefined") ? "2017-12-01" : req.query.Date_To;
  const Home = (req.query.Home === "undefined") ? "" : req.query.Home;
  const Away = (req.query.Away === "undefined") ? "" : req.query.Away;
  const City = (req.query.City === "undefined") ? "" : req.query.City;

  connection.query(
    `WITH All_games AS (SELECT Game_ID,Season_ID,Game_Date,T1.City AS City,T1.Nickname AS Nickname_Home, T2.Nickname AS Nickname_Away,Pts_Home,Pts_Away,Team_Abbreviation_Home AS HT,Team_Abbreviation_Away AS AT
          FROM Game Join Team T1 on Game.Team_Abbreviation_Home = T1.Abbreviation
                Join Team T2 on Game.Team_Abbreviation_Away = T2.Abbreviation
          WHERE Game_Date BETWEEN '${Date_From}' AND '${Date_To}'
          AND Team_Abbreviation_Home LIKE '%${Home}%'
          AND Team_Abbreviation_Away LIKE '%${Away}%'
          AND T1.City LIKE '%${City}%'),
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
          SELECT Game_ID,Game_Date,City,HT as Home_Abbr,AT AS Away_abbr, Nickname_Home,Nickname_Away,Pts_Home,Pts_Away,Home_seasonal_wins,Home_seasonal_losses,Away_seasonal_wins,Away_seasonal_losses,Home_Seasonal_Leader,Away_Seasonal_Leader,Home_Leader_Pos,Away_Leader_Pos,Home_leader_Pts,Away_leader_Pts,Home_leader_PER,Away_leader_PER,Home_leader_TSP,Away_leader_TSP
                  FROM All_games NATURAL JOIN HT_win_loss NATURAL JOIN AT_win_loss NATURAL JOIN Home_Season_King NATURAL JOIN Away_Season_King
                  ORDER BY Game_Date DESC,HT_win_loss.Home_Team ASC,AT_win_loss.Away_Team ASC;`,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  );
}
// ********************************************
//            Player Page
// ********************************************

// Route 5 (handler)
async function player(req, res) {
  // returns a list of seasonal information for one specific player
  // Query Parameter(s): player(string),

  var player = req.query.player_name;
  connection.query(
    `
    select Year as Season, Tm as Team, Height, Weight,
    Born as Birth_Year, Birth_City, Birth_State, College,
    Pos, CAST((PTS/G) AS Decimal(5,2)) as PPG, CAST((AST/G) AS DECIMAL(5,2)) as APG,  CAST((TRB/G) AS DECIMAL(5,2)) as RPG, PF, CAST(eFG_Percentage AS DECIMAL(5,2)) as EFG
    from Players natural join Seasons_Stats
    where Player like "%${player}%"
    order by Season desc;`,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  );
}

// Route 6 (handler)
async function search_player(req, res) {
  // Returns an array of attributes for all the players that match the search query,
  // sorted by the specified attribute of interest from highest to lowest, limit by 10.
  // If All_Time is True, then the handler returns players’ stats aggregated over all seasons.
  // Otherwise, the handler returns players’ stats given one specific season.
  // Query Parameter(s): All_Time (boolean), Season (int), Attribute (string), Name (string)*, Team (string)*, Position (string)*
  const Attributes = ["Games", "Points", "Assists", "Rebounds", "FGs", "PFs"];
  if (!req.query.All_Time || !req.query.Season || !req.query.Attribute) {
    console.log(req.query.All_Time, req.query.Season, req.query.Attribute);
    res.writeHead(500, { Error: "Please pass required parameters" });
    res.end();
  } else {
    const attribute = req.query.Attribute;
    const name = req.query.Name ? "%" + req.query.Name + "%" : "%";
    const team = req.query.Team ? "%" + req.query.Team + "%" : "%";
    const position = req.query.Position ? "%" + req.query.Position + "%" : "%";
    const state = req.query.State ? "%" + req.query.State + "%" : "%";
    if (!Attributes.includes(attribute)) {
      res.writeHead(500, { Error: "Please pass required parameters" });
      res.end();
    } else {
      if (req.query.All_Time == "true") {
        connection.query(
          `
                select Player, Pos, sum(G) as Games, sum(PTS) as Points,
                sum(AST) as Assists, sum(TRB) as Rebounds, sum(PF) as PFs, sum(FG) as FGs
                from Seasons_Stats natural join Players
                where Player like '${name}' and Tm like '${team}' and Pos like '${position}' and Birth_State like '${state}'
                group by Player
                order by ${attribute} DESC limit 10;`,
          function (error, results, fields) {
            if (error) {
              console.log(error);
              res.json({ error: error });
            } else if (results) {
              res.json({ results: results });
            }
          }
        );
      } else {
        const season = req.query.Season;
        connection.query(
          `
                select Player, Pos, sum(G) as Games, sum(PTS) as Points,
                sum(AST) as Assists, sum(TRB) as Rebounds, sum(PF) as PFs, sum(FG) as FGs
                from Seasons_Stats natural join Players
                where Player like '${name}' and Tm like '${team}' and Pos like '${position}' and Year = ${season} and Birth_State like '${state}'
                group by Player
                order by ${attribute} DESC limit 10
                `,
          function (error, results, fields) {
            if (error) {
              console.log(error);
              res.json({ error: error });
            } else if (results) {
              res.json({ results: results });
            }
          }
        );
      }
    }
  }
}

// ********************************************
//            Team Page
// ********************************************

// Route 7 (handler)
async function search_team_info(req, res) {
  // When specified with a team, returns a JSON array, the team basic information
  // Query Parameter(s): Team_ID(string)
  if (isNaN(req.query.Team_ID)) {
    res.writeHead(500, { Error: "Please pass parameter Team_ID" });
    res.end();
  } else {
    const team_id = req.query.Team_ID;
    connection.query(`SELECT * FROM Team WHERE ID = ${team_id};`, function (
      error,
      results,
      fields
    ) {
      if (error) {
        console.log(error);
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    });
  }
}

// Route 8 (handler)
async function search_team_win(req, res) {
  // When specified with a team,
  //      the information of the game the team won most points in that season;
  // Query Parameter(s): Team_ID(string)
  if (isNaN(req.query.Team_ID)) {
    res.writeHead(500, { Error: "Please pass parameter Team_ID" });
    res.end();
  } else {
    const team_id = req.query.Team_ID;
    connection.query(
      `with all_games as (
        SELECT Season_ID, (PTS_AWAY - PTS_HOME) as winPts, Team_Abbreviation_Away as self, TEAM_ABBREVIATION_HOME as opponent, Pts_Home as opponentScore, Pts_Away as selfScore
        from Game
        where
              TEAM_ABBREVIATION_AWAY in (select Abbreviation from Team WHERE ID = ${team_id})
        UNION
        SELECT Season_ID, (PTS_HOME - PTS_AWAY) as winPts, TEAM_ABBREVIATION_HOME as self, TEAM_ABBREVIATION_AWAY as opponent, Pts_Away as opponentScore, Pts_Home as selfScore
        from Game
        where
              TEAM_ABBREVIATION_HOME in (select Abbreviation from Team WHERE ID = ${team_id})),
        rank_win as(select Season_ID as Season, self, opponent, selfScore, opponentScore, winPts, ROW_NUMBER() over (PARTITION BY Season_ID ORDER BY winPts DESC ) as rankList
        from all_games)
        select *
        from rank_win
        WHERE rankList = 1
        order by Season DESC LIMIT 10;`,
      function (error, results, fields) {
        if (error) {
          console.log(error);
          res.json({ error: error });
        } else if (results) {
          res.json({ results: results });
        }
      }
    );
  }
}

// Route 9 (handler)
async function search_team_loses(req, res) {
  // When specified with a team,
  // the information of the game the team lost most points in that season
  // Query Parameter(s): Team_ID(string)
  if (isNaN(req.query.Team_ID)) {
    res.writeHead(500, { Error: "Please pass parameter Team_ID" });
    res.end();
  } else {
    const team_id = req.query.Team_ID;
    connection.query(
      `with all_games as (
        SELECT Season_ID, (PTS_HOME - PTS_AWAY) as lossPts, Team_Abbreviation_Away as self, TEAM_ABBREVIATION_HOME as opponent, Pts_Home as opponentScore, Pts_Away as selfScore
        from Game
        where
              TEAM_ABBREVIATION_AWAY in (select Abbreviation from Team WHERE ID = ${team_id})
        UNION
        SELECT Season_ID, (PTS_AWAY - PTS_HOME) as lossPts, TEAM_ABBREVIATION_HOME as self, TEAM_ABBREVIATION_AWAY as opponent, Pts_Away as opponentScore, Pts_Home as selfScore
        from Game
        where
              TEAM_ABBREVIATION_HOME in (select Abbreviation from Team WHERE ID = ${team_id})),
        rank_loss AS(select Season_ID as Season, self, opponent, selfScore, opponentScore, lossPts, ROW_NUMBER() over (PARTITION BY Season_ID ORDER BY lossPts DESC ) as rankList from all_games )
        SELECT * FROM rank_loss WHERE ranklist = 1
        order by  Season DESC LIMIT 10;`,
      function (error, results, fields) {
        if (error) {
          console.log(error);
          res.json({ error: error });
        } else if (results) {
          res.json({ results: results });
        }
      }
    );
  }
}

// Route 10 (handler)
async function search_team_player(req, res) {
  // 
  //      the average stats of its leading player for that season;
  // Query Parameter(s): Team_ID(string)
  if (isNaN(req.query.Team_ID)) {
    res.writeHead(500, { Error: "Please pass parameter Team_ID" });
    res.end();
  } else {
    const team_id = req.query.Team_ID;
    connection.query(
      `
            with player_stats as (select Year as Season, Player, Tm, P.height,
                P.weight, (Seasons_Stats.PTS/Seasons_Stats.G) as avgPoints, (Seasons_Stats.TRB/Seasons_Stats.G) as avgRebounds,
                (Seasons_Stats.AST/Seasons_Stats.G) as avgAssits,
                ROW_NUMBER() over (PARTITION BY Seasons_Stats.Year ORDER BY (Seasons_Stats.PTS/Seasons_Stats.G) DESC) AS ptslist
                from Seasons_Stats NATURAL JOIN Players P
                where Tm in (select Abbreviation from Team WHERE ID = ${team_id})
                group by Year, Player
                order by Year DESC, avgPoints)
                select * from player_stats where ptslist = 1 limit 10;
            `,
      function (error, results, fields) {
        if (error) {
          console.log(error);
          res.json({ error: error });
        } else if (results) {
          res.json({ results: results });
        }
      }
    );
  }
}

// Route 11 (handler)
async function get_team(req, res) {
  //Get Team_Id from team_name
  const teamName = req.query.Team_Name ? "%" + req.query.Team_Name + "%" : "%";
  connection.query(
    `select ID from Team where Full_Name like '${teamName}' limit 1`,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  );
}

// ********************************************
//            Home Page
// ********************************************

// Route 12 (handler)
async function player_avg(req, res) {
  connection.query(
    ` with player_yearly_stats as (select Player, Year as Season, Tm as Team, Height, Weight,
      Born as Birth_Year, Birth_City, Birth_State, College,
      Pos, (PTS/G)as PPG, (AST/G) as APG, (TRB/G) as RPG, PF, eFG_Percentage as EFG
      from Players natural join Seasons_Stats
      group by player ,year)
      select Player, Height, Weight, Birth_Year, Birth_City, Birth_State, College,
      Pos as Position, ROUND(avg(PPG),2) as PointPerSeason, ROUND(avg(APG),2)as AssistPerSeason, ROUND(avg(PF),2) as PersonalFoulPerSeason, ROUND(avg(EFG),2) as EFGPerSeason
      from player_yearly_stats
      group by Player
      order by PointPerSeason desc;`,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  );
}

// ********************************************
//            Facts Page
// ********************************************

// Route 13 (handler)
async function first_all_nba(req, res) {
  // Query Parameter(s): Season (int)
  // const season = typeof req.query.Season === "number" ? req.query.Season : 2015;
  const season = req.query.Season && !isNaN(req.query.Season) ? req.query.Season : 2015;

  connection.query(
    `
    With gameStats as (select Season_ID, WL_Home, Team_Abbreviation_Home, Team_Abbreviation_Away, Game_ID from Game where Season_ID = ${season}),
  topTeams as (select * from
    (select Team_Abbreviation_Home, sum(case when WL_Home = 'W' then 1 else 0 end) as homeWins
    from gameStats
    group by Team_Abbreviation_Home) as hw
    join
    (select Team_Abbreviation_Away, sum(case when WL_Home = 'W' then 0 else 1 end) as awayWins
    from gameStats
    group by Team_Abbreviation_Away) as aw
    on hw.Team_Abbreviation_Home = aw.Team_Abbreviation_Away
    where homeWins + awayWins > 50),
  playerStats as (select Player, Height, Weight, Pos, Tm, (PTS/G) as pointsPerGame, row_number() over (partition by Pos order by (PTS/G) desc ) as posRank
  from (select * from Seasons_Stats where Year = ${season}) as seasonalStats natural join Players
  where Tm in (select Team_Abbreviation_Away from topTeams)),
  topPlayers as (select Player, Pos, Tm,Height, Weight, pointsPerGame from playerStats where posRank=1)
select Player, Pos, Tm, round(pointsPerGame,2) AS pointsPerGame, Height, Weight,(homeWins+awayWins) as totalWins from topPlayers join topTeams on topPlayers.Tm = topTeams.Team_Abbreviation_Away;
  `,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  );
}

// Route 14 (handler)
async function only_got_numbers(req, res) {
  // Query Parameter(s): Season (int), p
  const season = req.query.Season && !isNaN(req.query.Season) ? req.query.Season : 2015;
  // const season = req.query.Season ? req.query.Season : 2015;
  connection.query(
    `
    select Player, Pos, Tm, round(pointsPerGame,2) AS pointsPerGame, round((AST/G),2) as assistsPerGame, round((TRB/G),2) as reboundsPerGame, DWS, OWS, FG, FGA, FT, FTA, (homeWins + awayWins) as totalWins, (homeLosses + awayLosses) as totalLosses from
    (select *, (PTS/G) as pointsPerGame, row_number() over (partition by Tm, Season_ID order by (PTS/G) desc) as tmRank
    from
    (select *, max(homeLosses+homeWins+awayLosses+awayWins) as allGames from
    (select Team_Abbreviation_Home, Season_ID, sum(case when WL_Home = 'W' then 1 else 0 end) as homeWins,
            sum(case when WL_Home = 'W' then 0 else 1 end) as homeLosses
    from Game where Season_ID = ${season}
    group by Team_Abbreviation_Home, Season_ID) as hw
    join
    (select Team_Abbreviation_Away, Season_ID as si, sum(case when WL_Home = 'W' then 0 else 1 end) as awayWins,
            sum(case when WL_Home = 'W' then 1 else 0 end) as awayLosses
    from Game where Season_ID = ${season}
    group by Team_Abbreviation_Away, Season_ID) as aw
    on hw.Team_Abbreviation_Home = aw.Team_Abbreviation_Away and hw.Season_ID = aw.si
    where homeWins + awayWins < homeLosses + awayLosses
    group by Team_Abbreviation_Home, hw.Season_ID) as badTeams join
        Seasons_Stats
        on badTeams.Team_Abbreviation_Home = Seasons_Stats.Tm and badTeams.Season_ID = Seasons_Stats.Year group by  Player, Season_ID) as allPlayers
    where tmRank=1`,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  );
}

// Route 15 (handler)
async function lucky(req, res) {
  //query parameter: Team(string)
  // const Team = req.query.Team ? req.query.Team  : 'CLE';
  // const Team = !(req.query.Team == null) ? '%' + req.query.Team + '%' : '%CLE%';
  const T = (req.query.Team === "undefined") ? '%CLE%' : '%' + req.query.Team + '%';
  connection.query(
    `
      WITH game_city AS(SELECT Team_Abbreviation_Home AS THE_TEAM,WL_HOME AS WL,T.City AS CITY
          FROM Game JOIN Team T on Game.Team_Abbreviation_Home = T.Abbreviation
          WHERE Team_Abbreviation_Home LIKE '${T}'
          UNION ALL
          SELECT Team_Abbreviation_AWAY AS THE_TEAM,(CASE WHEN WL_Home = 'W' Then 'L' ELSE 'W' END)AS WL,T.City AS CITY
          FROM Game JOIN Team T on Game.Team_Abbreviation_Home = T.Abbreviation
          WHERE Team_Abbreviation_AWAY LIKE '${T}'),
        win AS (SELECT The_team, SUM(CASE WHEN WL = 'W' THEN 1 ELSE 0 END)/count(*) AS win_rate,city
        FROM game_city
        GROUP BY city),
        player_sum AS (SELECT Tm,Player,SUM(PTS) AS sum_pts
        FROM Seasons_Stats
        WHERE Tm LIKE '${T}'
        GROUP BY Player)

        SELECT The_Team,win.city AS lucky_city,CASE WHEN win.city = Team.CITY THEN 'YES' ELSE 'NO' END AS 'IS_HOME_CITY',
              player_sum.Player AS lucky_player,CASE WHEN Players.birth_city = win.city THEN 'YES' ELSE 'NO' END AS 'Born_in_lucky_CITY'
        FROM win INNER JOIN Team ON The_team = Team.Abbreviation
        INNER JOIN player_sum ON The_team = Tm
        INNER JOIN Players ON player_sum.Player = Players.Player
        WHERE win.win_rate IN (SELECT MAX(win_rate) FROM win)
        AND player_sum.sum_pts IN (SELECT MAX(sum_pts) FROM player_sum)
    `,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  );
}

// Route 16 (handler)
async function contributes_most(req, res) {
  connection.query(
    `
    WITH newGame AS(
        SELECT *, SUM(G1.Pts_Home) AS totalHomePTS,
               SUM(G1.Pts_Away) AS totalAwayPTS,
               (SUM(G1.Pts_Home) + SUM(G1.Pts_Away)) AS seasonTotalPTS
        FROM Game G1
        GROUP BY G1.Season_ID, G1.Team_Abbreviation_Home
      )
      SELECT G.Season_ID AS Season,
           G.Team_Abbreviation_Home AS Abbreviation,
            SS.Player AS Player, SS.PTS AS personalPTS,
            round(((SS.PTS / seasonTotalPTS) * 100),3) AS Contribution
      FROM newGame G
      JOIN Seasons_Stats AS SS
      ON G.Season_ID = SS.Year
      AND G.Team_Abbreviation_Home = SS.Tm
      JOIN Team T on SS.Tm = T.Abbreviation
      GROUP BY G.Season_ID, G.Team_Abbreviation_Home, SS.Player
      ORDER BY G.Season_ID DESC,Contribution DESC;
      `,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  );
}

module.exports = {
  game,
  game_team_info,
  game_player_info,
  search_games,
  player,
  search_player,
  search_team_info,
  search_team_loses,
  search_team_win,
  search_team_player,
  get_team,
  player_avg,
  first_all_nba,
  only_got_numbers,
  lucky,
  contributes_most
};
