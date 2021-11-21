# NBA
SQL RDD and Web-App for data on NBA games, teams, and players 

### Datasets
From https://www.kaggle.com/wyattowalsh/basketball \
**Game** 62448 rows, 149 columns \
**Team** 30 rows, 7 colums 

From https://www.kaggle.com/drgilermo/nba-players-stats?select=Seasons_Stats.csv \
**Players** 3922 rows, 8 colums \
**Seasons_Stats** 24691 rows, 53 colums
Result: Datasets_oringinal 

### Database Design and Entity Resolution
Use Pandas to clean Null Values and duplicate rows.(see 550_Project_Preprocessing.ipynb)\
Delete some dated records from Game and Season_Stats table that has no corresponding Player info or Team info using SQL\
Changed several Team name abbrivation in Season_Stats to current used abbreviation using SQL.\
Droped some dependent column to keep each schema in 3NF using SQL (idea see Normalization Concerns.pdf)\
Result: datasets_cleaned


