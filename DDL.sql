-- Create Database
CREATE DATABASE NBA;
USE NBA;

-- Player
CREATE TABLE Players (
	Player varchar(128),
	Height float(8),
	Weight float(8),
	College varchar(128),
	Born int(8),
	Birth_City varchar(128),
	Birth_State varchar(128),
	PRIMARY KEY (Player)
);
-- Drop Player Table
-- DROP TABLE Player;

-- Team
CREATE TABLE Team (
	ID int(64) NOT NULL,
	Full_Name varchar(128) NOT NULL,
	Abbreviation varchar(128),
	Nickname varchar(128) NOT NULL,
	City varchar(128),
	State varchar(128),
	Year_Founded int(8),
	PRIMARY KEY (Abbreviation),
    UNIQUE (ID),
    UNIQUE (Full_Name),
    UNIQUE (Nickname)
);
-- Drop Team Table
-- DROP TABLE Team;

-- Create Seasons_Stats Table
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
	FG int(8),
	FGA int(8),
	2P int(8),
	2PA int(8),
    eFG_Percentage float(8),
	FT int(8),
	FTA int(8),
	TRB int(8),
	AST int(8),
	PF int(8),
	PTS int(8),
	PRIMARY KEY (Player, Year, Tm, Pos),
	FOREIGN KEY (Player) REFERENCES Players(Player),
	FOREIGN KEY (Tm) REFERENCES Team(Abbreviation)
);
-- Drop Seasons_Stats Table
-- DROP TABLE Seasons_Stats;

-- Create Game Table
CREATE TABLE Game (
Game_ID int(64),
Season_ID int(64),
Team_Abbreviation_Home varchar(128),
Game_Date varchar(128),
WL_Home varchar(128),
Min_Home int(8),
Fgm_Home int(8),
Ftm_Home int(8),
Pts_Home int(8),
Video_Available_Home int(8),
Team_Abbreviation_Away varchar(128),
Min_Away int(8),
Fgm_Away int(8),
Ftm_Away int(8),
Pts_Away int(8),
Video_Available_Away int(8),
Series_Leader varchar(128),
PRIMARY KEY (Game_ID),
FOREIGN KEY (Team_Abbreviation_Away) REFERENCES Team(Abbreviation),
FOREIGN KEY (Team_Abbreviation_Home) REFERENCES Team(Abbreviation)
);
-- Drop Game Table
DROP TABLE Game;


