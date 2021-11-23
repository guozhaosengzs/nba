# NBA
SQL RDD and Web-App for data on NBA games, teams, and players 

### Datasets
From https://www.kaggle.com/wyattowalsh/basketball \
**Game** 62448 rows, 149 columns \
**Team** 30 rows, 7 colums 

From https://www.kaggle.com/drgilermo/nba-players-stats?select=Seasons_Stats.csv \
**Players** 3922 rows, 8 colums \
**Seasons_Stats** 24691 rows, 53 colums\
Result: data_oringinal 

### Data Cleaning,Database Design and Entity Resolution
Step1:(cleaning1.ipynb)\
Use Pandas to clean Null Values,duplicate rows and columns that are mostly nulls.(preprocessing1.ipynb)\

Step2:(cleaning2.sql)\
Delete rows from Game where participating teams are dated that they do not have team information\
Delete rows from Seasons_Stats where involved teams are dated that they do not have team information\
Changed Team name abbrivations in Game to current used abbreviation in consistent with Team Table.\
Note: This step uses SQL and done in a separate database named Test(This database has been dropped, only resulted excel exported.)

Step3:(cleaning3.ipynb)\
Dropped some duplicate columns and redundant dependent column in Game and Seasons_stats to keep schema in 3NF\
Justify to make sure that each schema is in 3NF(see normalization concerns.pdf)\
Result: data_cleaned

Later changes in RDS: cleaned records in Game before season 1950 and after season 2017 to keep Game consistent with seasonal stats.


