-- CREATE DATABASE UPDATED_NBA;
-- USE UPDATED_NBA;

-- DROP TABLE Players;
CREATE TABLE Players (
    Player varchar(128),
    Height float(8),
    Weight float(8),
    Collage varchar(128),
    Born int(8),
    Birth_City varchar(128),
    Birth_State varchar(128),
    PRIMARY KEY (Player)
);

-- DROP TABLE Team;
CREATE TABLE Team (
    ID int(64),
    Full_Name varchar(128),
    Abbreviation varchar(128),
    Nickname varchar(128),
    City varchar(128),
    State varchar(128),
    Year_Founded int(8),
    PRIMARY KEY (Abbreviation)
);


-- DROP TABLE Seasons_Stats;
CREATE TABLE Seasons_Stats (
    Year int(8),
    Player varchar(128),
    Pos varchar(128),
    Age int(8),
    Tm varchar(256),
    G int(8),
    MP int(8),
    PER float(8),
    TS_Percentage float(8),
    FTr float(8),
    OWS float(8),
    DWS float(8),
    WS float(8),
    WS_Divide_48 float(8),
    FG int(8),
    FGA int(8),
    FG_Percentage float(8),
    2P int(8),
    2PA int(8),
    2P_Percentage float(8),
    eFG_Percentage float(8),
    FT int(8),
    FTA int(8),
    FT_Percentage float(8),
    TRB int(8),
    AST int(8),
    PF int(8),
    PTS int(8),
    PRIMARY KEY (Player, Year, Tm, Pos),
    FOREIGN KEY (Player) REFERENCES Players(Player),
    FOREIGN KEY (Tm) REFERENCES Team(Abbreviation)
);

-- DROP TABLE Game;
CREATE TABLE Game (
    Game_ID int(64),
    Season_ID int(64),
    Team_ID_Home int(64),
    Team_Abbreviation_Home varchar(128),
    Team_Name_Home varchar(128),
    Game_Date varchar(128),
    Matchup_Home varchar(128),
    WL_Home varchar(128),
    Min_Home int(8),
    Fgm_Home int(8),
    Ftm_Home int(8),
    Pts_Home int(8),
    Plus_Minus_Home int(8),
    Video_Available_Home int(8),
    Team_ID_Away int(64),
    Team_Abbreviation_Away varchar(128),
    Team_Name_Away varchar(128),
    Matchup_Away varchar(128),
    WL_Away varchar(128),
    Min_Away int(8),
    Fgm_Away int(8),
    Ftm_Away int(8),
    Pts_Away int(8),
    Plus_Minus_Away int(8),
    Video_Available_Away int(8),
    Game_Date_EST varchar(128),
    Game_Status_ID int(8),
    Game_Code varchar(128),
    Home_Team_ID int(64),
    Visitor_Team_ID int(64),
    Season int(8),
    Live_Period int(8),
    Live_Period_Time_BCAST varchar(128),
    WH_Status int(8),
    Game_Date_Day varchar(128),
    Team_City_Name_Home varchar(128),
    Team_Nickname_Home varchar(128),
    Team_Wins_Losses_Home varchar(128),
    Pts_Home_y int(8),
    Team_City_Name_Away varchar(128),
    Team_Nickname_Away varchar(128),
    Team_Wins_Losses_Away varchar(128),
    Home_Team_Wins int(8),
    Home_Team_Losses int(8),
    Series_Leader varchar(128),
    Video_Available_Flag int(8),
    PT_Available int(8),
    PT_XYZ_Available int(8),
    Hustle_Status int(8),
    Historical_Status int(8),
    PRIMARY KEY (Game_ID),
    FOREIGN KEY (Team_Abbreviation_Away) REFERENCES Team(Abbreviation),
    FOREIGN KEY (Team_Abbreviation_Home) REFERENCES Team(Abbreviation)
);
