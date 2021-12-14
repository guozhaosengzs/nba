import React from "react";

import { PanelGroup, Panel, Grid, Row, Col, FlexboxGrid, Pagination, CustomProvider, InputGroup, Input, DateRangePicker, Button } from "rsuite";
import { Table, ColumnGroup, Column, HeaderCell, Cell } from "rsuite-table";
import { RadarChart, RadarLine, BarChart, Bars } from "@rsuite/charts";
import echarts from 'echarts';

import SearchIcon from '@rsuite/icons/Search';

import TopNav from "../components/TopNav";
import ColumnSort from "../components/ColumnSort";

import { getAllGames, getSearchedGames, getGame, getGameTeamInfo, getGamePlayerInfo } from "../fetcher";

class Games extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            gameResults: [],
            gameLoad: true,

            gamePage: 1,
            gameLimit: 15,

            gameSortType: null,
            gameSortColumn: null,

            showGameBool: false,
            showGameResult: null,
            showTeamResult: null,
            showPlayerResult: null,
            homeQuery: "undefined",
            awayQuery: "undefined",
            cityQuery: "undefined",
            dateFromQuery: "undefined",
            dateToQuery: "undefined"

        };

        this.handleQuerySearch = this.handleQuerySearch.bind(this)

        this.showGame = this.showGame.bind(this)
    }

    handleQuerySearch() {
        getSearchedGames(this.state.homeQuery, this.state.awayQuery, this.state.cityQuery, this.state.dateFromQuery, this.state.dateToQuery).then(res => {
            this.setState({
                gameResults: res.results,
                gameLoad: false
            });
        });
    }

    showGame(Game_ID) {
        getGame(Game_ID).then(res => {
            this.setState({
                showGameResult: res.results[0]
            });
        });
        getGameTeamInfo(Game_ID).then(res => {
            this.setState({
                showTeamResult: res.results[0]
            });
        });

        getGamePlayerInfo(Game_ID).then(res => {
            this.setState({
                showPlayerResult: res.results[0]
            });
        });
        this.setState({
            showGameBool: true
        })
    }

    componentDidMount() {
        getAllGames().then(res => {
            this.setState({
                gameResults: res.results,
                gameLoad: false
            });
        });
    }

    render() {
        return (
            <CustomProvider theme={"dark"}>
                <div>
                    <TopNav />
                    <div style={{ width: "70vw", margin: "0 auto", marginTop: "2vh" }}>
                        <h2>Games</h2>
                        <h5>
                            In this page, you can games with more options, and the details will be displayed below.
                        </h5>
                    </div>
                    <div style={{ width: "70vw", margin: "0 auto", marginTop: "3vh" }}>
                        <FlexboxGrid justify="end" align="bottom">
                            <FlexboxGrid.Item colspan={5}>
                                <div style={{ width: '10vw', padding: 5, align: 'right' }}>
                                    Home Team Abbreviation
                                    <InputGroup>
                                        <Input placeholder=""
                                            onChange={(string, _) => {
                                                this.setState({ gameLoad: true });
                                                this.setState({ homeQuery: string }, this.handleQuerySearch);
                                                setTimeout(() => {
                                                    this.setState({
                                                        gameSortType: null,
                                                        gameSortColumn: null,
                                                        gamePage: 1
                                                    });
                                                }, 300);
                                            }}
                                        />
                                        <InputGroup.Addon>
                                            <SearchIcon />
                                        </InputGroup.Addon>
                                    </InputGroup>
                                </div>
                            </FlexboxGrid.Item>

                            <FlexboxGrid.Item colspan={5}>
                                <div style={{ width: '10vw', padding: 5, align: 'right' }}>
                                    Away Team Abbreviation
                                    <InputGroup>
                                        <Input placeholder=""
                                            onChange={(string, _) => {
                                                this.setState({ gameLoad: true });
                                                this.setState({ awayQuery: string }, this.handleQuerySearch);
                                                setTimeout(() => {
                                                    this.setState({
                                                        gameSortType: null,
                                                        gameSortColumn: null,
                                                        gamePage: 1
                                                    });
                                                }, 300);
                                            }}
                                        />
                                        <InputGroup.Addon>
                                            <SearchIcon />
                                        </InputGroup.Addon>
                                    </InputGroup>
                                </div>
                            </FlexboxGrid.Item>

                            <FlexboxGrid.Item colspan={5}>
                                <div style={{ width: '15vw', padding: 5, align: 'right' }}>
                                    Date Range <br></br>
                                    <DateRangePicker
                                        cleanable={true}
                                        size="lg"
                                        placeholder="2017-01-01 ~ 2017-12-01"
                                        onOk={(dates) => {
                                            this.setState({ gameLoad: true });
                                            this.setState({
                                                gameResults: [],
                                                dateFromQuery: dates[0].toISOString().split('T')[0],
                                                dateToQuery: dates[1].toISOString().split('T')[0]
                                            }, this.handleQuerySearch);

                                            setTimeout(() => {
                                                this.setState({
                                                    gameSortType: null,
                                                    gameSortColumn: null,
                                                    gamePage: 1
                                                });
                                            }, 5000);
                                        }}

                                    />
                                </div>
                            </FlexboxGrid.Item>

                            <FlexboxGrid.Item colspan={3}>
                                <div style={{ width: '10vw', padding: 5, align: 'left' }}>

                                    City
                                    <InputGroup>
                                        <Input placeholder=""
                                            onChange={(string, _) => {
                                                this.setState({ gameLoad: true });
                                                this.setState({ cityQuery: string }, this.handleQuerySearch);
                                                setTimeout(() => {
                                                    this.setState({
                                                        gameSortType: null,
                                                        gameSortColumn: null,
                                                        gamePage: 1
                                                    });
                                                }, 300);
                                            }}
                                        />
                                        <InputGroup.Addon>
                                            <SearchIcon />
                                        </InputGroup.Addon>
                                    </InputGroup>
                                </div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item colspan={1}>
                            </FlexboxGrid.Item>

                        </FlexboxGrid>
                        <br></br>
                        <Table
                            wordWrap
                            hover={true}
                            bordered={true}
                            cellBordered={true}
                            autoHeight={true}
                            headerHeight={100}

                            data={this.state.gameResults.filter(
                                (_, i) =>
                                    i >= this.state.gameLimit * (this.state.gamePage - 1) &&
                                    i < this.state.gameLimit * this.state.gamePage
                            )}

                            loading={this.state.gameLoad}

                            sortColumn={this.state.gameSortColumn}
                            sortType={this.state.gameSortType}
                            onSortColumn={(sortColumn, sortType) => {
                                this.setState({
                                    gameLoad: true,
                                    gamePage: 1
                                });

                                this.state.gameResults.sort((a, b) => {
                                    let x = a[sortColumn];
                                    let y = b[sortColumn];

                                    return ColumnSort(x, y, sortType);
                                });

                                setTimeout(() => {
                                    this.setState({
                                        gameSortType: sortType,
                                        gameSortColumn: sortColumn,
                                        gameLoad: false
                                    });
                                }, 400);
                            }}

                            onRowClick={data => {
                                this.showGame(data.Game_ID);
                            }}
                        >
                            <ColumnGroup header="HOME" align="right">
                                <Column flexGrow={1} sortable align="center">
                                    <HeaderCell>Seasonal Wins</HeaderCell>
                                    <Cell dataKey="Home_seasonal_wins" />
                                </Column>

                                <Column flexGrow={1} sortable align="center">
                                    <HeaderCell>Seasonal Losses</HeaderCell>
                                    <Cell dataKey="Home_seasonal_losses" />
                                </Column>

                                <Column flexGrow={1} sortable align="center">
                                    <HeaderCell>Points</HeaderCell>
                                    <Cell dataKey="Pts_Home" />
                                </Column>

                                <Column flexGrow={1} sortable align="center">
                                    <HeaderCell>Name</HeaderCell>
                                    <Cell dataKey="Home_Abbr" />
                                </Column>
                            </ColumnGroup>

                            <ColumnGroup header="AWAY" align="left">
                                <Column align="center" flexGrow={1} sortable>
                                    <HeaderCell>Name</HeaderCell>
                                    <Cell dataKey="Away_abbr" />
                                </Column>

                                <Column align="center" flexGrow={1} sortable>
                                    <HeaderCell>Points</HeaderCell>
                                    <Cell dataKey="Pts_Away" />
                                </Column>

                                <Column flexGrow={1} sortable align="center">
                                    <HeaderCell>Seasonal Wins</HeaderCell>
                                    <Cell dataKey="Away_seasonal_wins" />
                                </Column>

                                <Column flexGrow={1} sortable align="center">
                                    <HeaderCell>Seasonal Losses</HeaderCell>
                                    <Cell dataKey="Away_seasonal_losses" />
                                </Column>
                            </ColumnGroup>

                            <Column flexGrow={1} align="center" verticalAlign="middle" sortable>
                                <HeaderCell>Game Date</HeaderCell>
                                <Cell dataKey="Game_Date" />
                            </Column>

                            <Column flexGrow={1} align="center" verticalAlign="middle" sortable>
                                <HeaderCell>Game Location</HeaderCell>
                                <Cell dataKey="City" />
                            </Column>
                        </Table>

                        <div style={{ padding: 10 }}>
                            <Pagination
                                prev
                                next
                                first
                                last
                                ellipsis
                                boundaryLinks
                                maxButtons={5}
                                size="xs"
                                layout={["total", "-", "limit", "|", "pager", "skip"]}
                                limit={this.state.gameLimit}
                                limitOptions={[15, 30, 60]}
                                total={this.state.gameResults.length}
                                activePage={this.state.gamePage}
                                onChangePage={p => this.setState({ gamePage: p })}
                                onChangeLimit={dataKey => {
                                    this.setState({
                                        gamePage: 1,
                                        gameLimit: dataKey
                                    });
                                }}
                            />
                        </div>

                    </div>
                </div>

                <div style={{ width: "70vw", margin: "0 auto", padding: 20 }}>
                    {(this.state.showGameBool &&
                        (this.state.showGameResult !== null) &&
                        (this.state.showTeamResult !== null) &&
                        (this.state.showPlayerResult !== null)) &&
                        <div>
                            <PanelGroup accordion bordered>
                                <Panel header="Basic Info" defaultExpanded>
                                    <Grid fluid>
                                        <Row>
                                            <h2 style={{ textAlignVertical: "center", textAlign: "center" }}>
                                                Game Details
                                            </h2>
                                            <br></br>
                                            <h4 style={{ textAlignVertical: "center", textAlign: "center" }}>
                                                {this.state.showGameResult.Game_Date}
                                            </h4>
                                        </Row>
                                        <br></br>
                                        <FlexboxGrid align="bottom">
                                            <FlexboxGrid.Item colspan={8}>
                                                <div style={{ textAlignVertical: "bottom", textAlign: "center", color: "DarkOrange" }}>
                                                    <h3>HOME</h3>
                                                </div>
                                                <div style={{ textAlignVertical: "center", textAlign: "center" }}>
                                                    <img
                                                        src={"images/" + this.state.showGameResult.Nickname_Home + ".png"}
                                                        alt={this.state.showGameResult.Nickname_Home + "Logo"}
                                                        height={200} />
                                                </div>
                                                <h3 style={{ textAlignVertical: "center", textAlign: "center" }}>
                                                    {this.state.showGameResult.Nickname_Home}
                                                </h3>
                                                <h5 style={{ textAlignVertical: "center", textAlign: "center", color: "DarkOrange" }}>
                                                    This Season    {this.state.showGameResult.Home_seasonal_wins} : {this.state.showGameResult.Home_seasonal_losses}
                                                </h5>
                                            </FlexboxGrid.Item>

                                            <FlexboxGrid.Item colspan={8}>
                                                <div style={{ paddingBottom: 150, textAlignVertical: "top", textAlign: "center", color: "DarkRed" }}>
                                                    <h2>VS</h2>
                                                </div>
                                            </FlexboxGrid.Item>
                                            <FlexboxGrid.Item colspan={8}>
                                                <div style={{ textAlignVertical: "bottom", textAlign: "center", color: "DarkOrange" }}>
                                                    <h3>AWAY</h3>
                                                    <br></br>
                                                </div>
                                                <div style={{ textAlignVertical: "center", textAlign: "center" }}>
                                                    <img
                                                        src={"images/" + this.state.showGameResult.Nickname_Away + ".png"}
                                                        alt={this.state.showGameResult.Nickname_Away + "Logo"}
                                                        height={200} />
                                                </div>
                                                <h3 style={{ textAlignVertical: "center", textAlign: "center" }}>
                                                    {this.state.showGameResult.Nickname_Away}

                                                </h3>
                                                <h5 style={{ textAlignVertical: "center", textAlign: "center", color: "DarkOrange" }}>
                                                    This Season    {this.state.showGameResult.Away_seasonal_wins} : {this.state.showGameResult.Away_seasonal_losses}
                                                </h5>
                                            </FlexboxGrid.Item>
                                        </FlexboxGrid>
                                        <br></br>
                                        <Row>
                                            <Col sm={8} style={{ textAlign: "center" }}>
                                                <h5>
                                                    <Table
                                                        wordWrap
                                                        autoHeight={true}
                                                        headerHeight={60}
                                                        data={[this.state.showGameResult]}
                                                    >
                                                        <Column flexGrow={1} align="center">
                                                            <HeaderCell>Field Goals Made</HeaderCell>
                                                            <Cell dataKey="Fgm_Home" />
                                                        </Column>
                                                        <Column flexGrow={1} align="center">
                                                            <HeaderCell>Free Throws Made</HeaderCell>
                                                            <Cell dataKey="Ftm_Home" />
                                                        </Column>
                                                        <Column flexGrow={1} align="center">
                                                            <HeaderCell>Points</HeaderCell>
                                                            <Cell dataKey="Pts_Home" />
                                                        </Column>

                                                    </Table>
                                                </h5>
                                            </Col>
                                            <Col sm={8}>

                                            </Col>
                                            <Col sm={8} style={{ textAlign: "center" }}>
                                                <h5>
                                                    <Table
                                                        wordWrap
                                                        autoHeight={true}
                                                        headerHeight={60}
                                                        data={[this.state.showGameResult]}
                                                    >
                                                        <Column flexGrow={1} align="center">
                                                            <HeaderCell>Points</HeaderCell>
                                                            <Cell dataKey="Pts_Away" />
                                                        </Column>

                                                        <Column flexGrow={1} align="center">
                                                            <HeaderCell>Free Throws Made</HeaderCell>
                                                            <Cell dataKey="Ftm_Away" />
                                                        </Column>
                                                        <Column flexGrow={1} align="center">
                                                            <HeaderCell>Field Goals Made</HeaderCell>
                                                            <Cell dataKey="Fgm_Away" />
                                                        </Column>

                                                    </Table>
                                                </h5>
                                            </Col>
                                        </Row>
                                    </Grid>
                                </Panel>

                                <Panel header="Team Stats in This Season So Far">
                                    <FlexboxGrid align="bottom">
                                        <FlexboxGrid.Item colspan={12}>
                                            <h4 style={{ textAlign: "center" }}>
                                                Average Points Per Game
                                            </h4>
                                            <BarChart name="Points Comparison"
                                                data={[
                                                    [this.state.showGameResult.Nickname_Home, this.state.showTeamResult.Home_Season_Pts], [this.state.showGameResult.Nickname_Away, this.state.showTeamResult.Away_Season_Pts]
                                                ]}
                                            >
                                                <Bars color={["DarkOliveGreen", "DarkViolet"]} />
                                            </BarChart>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item colspan={12}>
                                            <h4 style={{ textAlign: "center" }}>
                                                Average Field Goals Per Game
                                            </h4>
                                            <BarChart name="Points Comparison"
                                                data={[
                                                    [this.state.showGameResult.Nickname_Home, this.state.showTeamResult.Home_Season_FG], [this.state.showGameResult.Nickname_Away, this.state.showTeamResult.Away_Season_FG]
                                                ]}
                                            >
                                                <Bars color={["DarkOliveGreen", "DarkViolet"]} />
                                            </BarChart>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>

                                    <FlexboxGrid align="bottom">
                                        <FlexboxGrid.Item colspan={12}>
                                            <h4 style={{ textAlign: "center" }}>
                                                Average Assists Per Game
                                            </h4>
                                            <BarChart name="Points Comparison"
                                                data={[
                                                    [this.state.showGameResult.Nickname_Home, this.state.showTeamResult.Home_Season_Ast], [this.state.showGameResult.Nickname_Away, this.state.showTeamResult.Away_Season_Ast]
                                                ]}
                                            >
                                                <Bars color={["DarkOliveGreen", "DarkViolet"]} />
                                            </BarChart>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item colspan={12}>
                                            <h4 style={{ textAlign: "center" }}>
                                                Average Personal Fouls Per Game
                                            </h4>
                                            <BarChart name="Points Comparison"
                                                data={[
                                                    [this.state.showGameResult.Nickname_Home, this.state.showTeamResult.Home_Season_PF], [this.state.showGameResult.Nickname_Away, this.state.showTeamResult.Away_Season_PF]
                                                ]}
                                            >
                                                <Bars color={["DarkOliveGreen", "DarkViolet"]} />
                                            </BarChart>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>


                                </Panel>
                                <Panel header="Players Comparison">
                                    <h3 style={{ textAlign: "center" }}>
                                        Players' Highest Seasonal Average Stats Each Team
                                    </h3>
                                    <div style={{ width: "70vw", textAlign: "center" }}>
                                        <RadarChart
                                            data={[
                                                ["PTS", (this.state.showPlayerResult.Home_Highest_PTS + this.state.showPlayerResult.Away_Highest_PTS) / 2 * 1.25, this.state.showPlayerResult.Home_Highest_PTS, this.state.showPlayerResult.Away_Highest_PTS],
                                                ["AST", (this.state.showPlayerResult.Home_Highest_AST + this.state.showPlayerResult.Away_Highest_AST) / 2 * 1.25, this.state.showPlayerResult.Home_Highest_AST, this.state.showPlayerResult.Away_Highest_AST],
                                                ["FG", (this.state.showPlayerResult.Home_Highest_PF + this.state.showPlayerResult.Away_Highest_PF) / 2 * 1.25, this.state.showPlayerResult.Home_Highest_PF, this.state.showPlayerResult.Away_Highest_PF],
                                                ["PF", (this.state.showPlayerResult.Home_Highest_FG + this.state.showPlayerResult.Away_Highest_FG) / 2 * 1.25, this.state.showPlayerResult.Home_Highest_FG, this.state.showPlayerResult.Away_Highest_FG]
                                            ]}                                        >
                                            <RadarLine name={this.state.showGameResult.Nickname_Home} />
                                            <RadarLine name={this.state.showGameResult.Nickname_Away} />
                                        </RadarChart>
                                    </div>
                                </Panel>
                            </PanelGroup>

                            <div style={{ textAlign: "right", padding: 20 }} >
                                <Button
                                    align="right"
                                    appearance="ghost"

                                    onClick={() => {
                                        this.setState({
                                            showGameBool: false,
                                            showGameResult: null,
                                            showTeamResult: null,
                                            showPlayerResult: null,
                                        });
                                    }}>
                                    Clear Details
                                </Button>
                            </div>

                        </div>

                    }
                </div>

                <div style={{ padding: 50 }}>
                </div>
            </CustomProvider >
        );
    }
}
export default Games;
