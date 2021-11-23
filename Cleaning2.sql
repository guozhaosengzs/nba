#delete rows from Game where participating teams are dated that they do not have team information
Delete from Game
Where Team_ID_Away NOT IN(SELECT id from Team) OR Team_ID_Away NOT IN (SELECT id from Team);

#Update team abbreviation in Seasons_Stats that uses a different abbreviation in Team table
Update Seasons_Stats
SET Tm = 'BKN'
WHERE Tm = 'BRK';

Update Seasons_Stats
SET Tm = 'PHX'
WHERE Tm = 'PHO';

Update Seasons_Stats
SET Tm = 'CHA'
WHERE Tm = 'CHO';

#Delete rows from Seasons_Stats where participating teams are dated that they do not have team information
DELETE from Seasons_Stats
WHERE Tm NOT IN (SELECT abbreviation from Team);

#Change Team_Abbriviation_Home in Game, such that the abbriavtion of home team is the one same as in Team table, for each team(same team_id)
Update Game
SET Team_Abbreviation_Home = 'ATL'
WHERE TEAM_ID_HOME ='1610612737';
Update Game
SET Team_Abbreviation_Home = 'BOS'
WHERE TEAM_ID_HOME ='1610612738';
Update Game
SET Team_Abbreviation_Home = 'CLE'
WHERE TEAM_ID_HOME ='1610612739';
Update Game
SET Team_Abbreviation_Home = 'NOP'
WHERE TEAM_ID_HOME ='1610612740';
Update Game
SET Team_Abbreviation_Home = 'CHI'
WHERE TEAM_ID_HOME ='1610612741';
Update Game
SET Team_Abbreviation_Home = 'DAL'
WHERE TEAM_ID_HOME ='1610612742';
Update Game
SET Team_Abbreviation_Home = 'DEN'
WHERE TEAM_ID_HOME ='1610612743';
Update Game
SET Team_Abbreviation_Home = 'GSW'
WHERE TEAM_ID_HOME ='1610612744';
Update Game
SET Team_Abbreviation_Home = 'HOU'
WHERE TEAM_ID_HOME ='1610612745';
Update Game
SET Team_Abbreviation_Home = 'LAC'
WHERE TEAM_ID_HOME ='1610612746';
Update Game
SET Team_Abbreviation_Home = 'LAL'
WHERE TEAM_ID_HOME ='1610612747';
Update Game
SET Team_Abbreviation_Home = 'MIA'
WHERE TEAM_ID_HOME ='1610612748';
Update Game
SET Team_Abbreviation_Home = 'MIL'
WHERE TEAM_ID_HOME ='1610612749';
Update Game
SET Team_Abbreviation_Home = 'MIN'
WHERE TEAM_ID_HOME ='1610612750';
Update Game
SET Team_Abbreviation_Home = 'BKN'
WHERE TEAM_ID_HOME ='1610612751';
Update Game
SET Team_Abbreviation_Home = 'NYK'
WHERE TEAM_ID_HOME ='1610612752';
Update Game
SET Team_Abbreviation_Home = 'ORL'
WHERE TEAM_ID_HOME ='1610612753';
Update Game
SET Team_Abbreviation_Home = 'IND'
WHERE TEAM_ID_HOME ='1610612754';
Update Game
SET Team_Abbreviation_Home = 'PHI'
WHERE TEAM_ID_HOME ='1610612755';
Update Game
SET Team_Abbreviation_Home = 'PHX'
WHERE TEAM_ID_HOME ='1610612756';
Update Game
SET Team_Abbreviation_Home = 'POR'
WHERE TEAM_ID_HOME ='1610612757';
Update Game
SET Team_Abbreviation_Home = 'SAC'
WHERE TEAM_ID_HOME ='1610612758';
Update Game
SET Team_Abbreviation_Home = 'SAS'
WHERE TEAM_ID_HOME ='1610612759';
Update Game
SET Team_Abbreviation_Home = 'OKC'
WHERE TEAM_ID_HOME ='1610612760';
Update Game
SET Team_Abbreviation_Home = 'TOR'
WHERE TEAM_ID_HOME ='1610612761';
Update Game
SET Team_Abbreviation_Home = 'UTA'
WHERE TEAM_ID_HOME ='1610612762';
Update Game
SET Team_Abbreviation_Home = 'MEM'
WHERE TEAM_ID_HOME ='1610612763';
Update Game
SET Team_Abbreviation_Home = 'WAS'
WHERE TEAM_ID_HOME ='1610612764';
Update Game
SET Team_Abbreviation_Home = 'DET'
WHERE TEAM_ID_HOME ='1610612765';
Update Game
SET Team_Abbreviation_Home = 'CHA'
WHERE TEAM_ID_HOME ='1610612766';


#Change Team_Abbriviation_Away in Game, such that the abbriavtion of away team is the one same as in Team table, for each team(same team_id)
Update Game
SET Team_Abbreviation_Away = 'ATL'
WHERE TEAM_ID_Away ='1610612737';
Update Game
SET Team_Abbreviation_Away = 'BOS'
WHERE TEAM_ID_Away ='1610612738';
Update Game
SET Team_Abbreviation_Away = 'CLE'
WHERE TEAM_ID_Away ='1610612739';
Update Game
SET Team_Abbreviation_Away = 'NOP'
WHERE TEAM_ID_Away ='1610612740';
Update Game
SET Team_Abbreviation_Away = 'CHI'
WHERE TEAM_ID_Away ='1610612741';
Update Game
SET Team_Abbreviation_Away = 'DAL'
WHERE TEAM_ID_Away ='1610612742';
Update Game
SET Team_Abbreviation_Away = 'DEN'
WHERE TEAM_ID_Away ='1610612743';
Update Game
SET Team_Abbreviation_Away = 'GSW'
WHERE TEAM_ID_Away ='1610612744';
Update Game
SET Team_Abbreviation_Away = 'HOU'
WHERE TEAM_ID_Away ='1610612745';
Update Game
SET Team_Abbreviation_Away = 'LAC'
WHERE TEAM_ID_Away ='1610612746';
Update Game
SET Team_Abbreviation_Away = 'LAL'
WHERE TEAM_ID_Away ='1610612747';
Update Game
SET Team_Abbreviation_Away = 'MIA'
WHERE TEAM_ID_Away ='1610612748';
Update Game
SET Team_Abbreviation_Away = 'MIL'
WHERE TEAM_ID_Away ='1610612749';
Update Game
SET Team_Abbreviation_Away = 'MIN'
WHERE TEAM_ID_Away ='1610612750';
Update Game
SET Team_Abbreviation_Away = 'BKN'
WHERE TEAM_ID_Away ='1610612751';
Update Game
SET Team_Abbreviation_Away = 'NYK'
WHERE TEAM_ID_Away ='1610612752';
Update Game
SET Team_Abbreviation_Away = 'ORL'
WHERE TEAM_ID_Away ='1610612753';
Update Game
SET Team_Abbreviation_Away = 'IND'
WHERE TEAM_ID_Away ='1610612754';
Update Game
SET Team_Abbreviation_Away = 'PHI'
WHERE TEAM_ID_Away ='1610612755';
Update Game
SET Team_Abbreviation_Away = 'PHX'
WHERE TEAM_ID_Away ='1610612756';
Update Game
SET Team_Abbreviation_Away = 'POR'
WHERE TEAM_ID_Away ='1610612757';
Update Game
SET Team_Abbreviation_Away = 'SAC'
WHERE TEAM_ID_Away ='1610612758';
Update Game
SET Team_Abbreviation_Away = 'SAS'
WHERE TEAM_ID_Away ='1610612759';
Update Game
SET Team_Abbreviation_Away = 'OKC'
WHERE TEAM_ID_Away ='1610612760';
Update Game
SET Team_Abbreviation_Away = 'TOR'
WHERE TEAM_ID_Away ='1610612761';
Update Game
SET Team_Abbreviation_Away = 'UTA'
WHERE TEAM_ID_Away ='1610612762';
Update Game
SET Team_Abbreviation_Away = 'MEM'
WHERE TEAM_ID_Away ='1610612763';
Update Game
SET Team_Abbreviation_Away = 'WAS'
WHERE TEAM_ID_Away ='1610612764';
Update Game
SET Team_Abbreviation_Away = 'DET'
WHERE TEAM_ID_Away ='1610612765';
Update Game
SET Team_Abbreviation_Away = 'CHA'
WHERE TEAM_ID_Away ='1610612766';