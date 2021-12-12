import React from "react";

import { FlexboxGrid, Pagination, CustomProvider, InputGroup, Input, DateRangePicker } from "rsuite";
import { Table, ColumnGroup, Column, HeaderCell, Cell } from "rsuite-table";

import SearchIcon from '@rsuite/icons/Search';

import TopNav from "../components/TopNav";
import ColumnSort from "../components/ColumnSort";

import { getAllGames, getSearchedGames, getGame } from "../fetcher";

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

            teams: ['ATL',
                'BOS',
                'CLE',
                'NOP',
                'CHI',
                'DAL',
                'DEN',
                'GSW',
                'HOU',
                'LAL',
                'MIA',
                'LAC',
                'MIL',
                'MIN',
                'BKN',
                'NYK',
                'ORL',
                'IND',
                'PHI',
                'PHX',
                'POR',
                'SAC',
                'SAS',
                'OKC',
                'TOR',
                'UTA',
                'MEM',
                'WAS',
                'DET',
                'CHA',
            ],

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
            this.setState({ gameResults: res.results });
        });
    }

    showGame(Game_ID) {
        getGame(Game_ID).then(res => {
            this.setState({
                showGameResult: res.results,
                showGameBool: true
            });
        });
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
                        <br></br>
                        <FlexboxGrid justify="end">
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
                                                        gameLoad: false,
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
                                                        gameLoad: false,
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
                                <div style={{  width: '10vw', padding: 5, align: 'right' }}>
                                    Date Range
                                    <DateRangePicker
                                        onOk={(dates) => {
                                            this.setState({ gameLoad: true });
                                            this.setState({ 
                                                dateFromQuery: dates[0].toISOString().split('T')[0],
                                                dateToQuery: dates[1].toISOString().split('T')[0]
                                            }, this.handleQuerySearch);

                                            console.log(typeof this.state.dateFromQuery);

                                            setTimeout(() => {
                                                this.setState({
                                                    gameSortType: null,
                                                    gameSortColumn: null,
                                                    gameLoad: false,
                                                    gamePage: 1
                                                });
                                            }, 300);
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
                                                        gameLoad: false,
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
                            bordered={true}
                            cellBordered={true}
                            autoHeight={true}
                            headerHeight={80}

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
                    {this.showGameBool &&
                        <h2>
                            if true show
                        </h2>
                    }
                    {/* {this.showGameBool ?
                        <div style={{ width: "70vw", margin: "0 auto" }}>
                            if true show

                        </div>

                        : ''} */}
                </div>

                <div style={{ padding: 50 }}>
                </div>
            </CustomProvider>
        );
    }
}
export default Games;
