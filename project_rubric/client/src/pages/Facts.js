import React from "react";

import { Pagination, CustomProvider } from "rsuite";
import { Table, Column, HeaderCell, Cell } from "rsuite-table";

import TopNav from "../components/TopNav";
import ColumnSort from "../components/ColumnSort";
import {
    getTopPOSPlayer,
    getTopPlayerNoWin,
    getLucky,
    getMostContributing
} from "../fetcher";

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fact1Results: [],
            fact1Page: 1,
            fact1Limit: 10,
            fact1Load: true,
            fact1SortType: null,
            fact1SortColumn: null,

            fact2Results: [],
            fact2Page: 1,
            fact2Limit: 10,
            fact2Load: true,
            fact2SortType: null,
            fact2SortColumn: null,

            fact3Results: [],
            fact3Page: 1,
            fact3Limit: 10,
            fact3Load: true,
            fact3SortType: null,
            fact3SortColumn: null,

            fact4Results: [],
            fact4Page: 1,
            fact4Limit: 10,
            fact4Load: true,
            fact4SortType: null,
            fact4SortColumn: null
        };

        this.goToGame = this.goToGame.bind(this);
    }

    goToGame(Game_ID) {
        window.location = `/game?id=${Game_ID}`;
    }

    componentDidMount() {
        getTopPOSPlayer().then(res => {
            this.setState({ fact1Results: res.results });
            this.setState({ fact1Load: false });
        });

        getTopPlayerNoWin().then(res => {
            this.setState({ fact2Results: res.results });
            this.setState({ fact2Load: false });
        }); 
 
        getLucky().then(res => {
            this.setState({ fact3Results: res.results });
            this.setState({ fact3Load: false });
        });

        getMostContributing().then(res => {
            this.setState({ fact4Results: res.results });
            this.setState({ fact4Load: false });
        });
    }

    render() {
        return (
            <CustomProvider theme={"dark"}>
                <div>
                    <TopNav />
                    <div style={{ width: "80vw", margin: "0 auto", marginTop: "2vh" }}>
                        <h2>Fun Facts</h2>
                        <h5>
                            With the dataset on NBA, there are a lot of interesting topics to discover,
                            and below are some of the things that we were interested to find out.{" "}
                        </h5>
                    </div>

                    <div style={{ width: "80vw", margin: "0 auto", marginTop: "3vh" }}>
                        <h3>Best Positional Players in Top Teams</h3>
                        <br></br>
                        {/* =====================TABLE 1=============================== */}
                        <h5>
                            Who are the top scoring players for each position from teams that has more than 50 wins in the season?
                        </h5>
                        <br></br>
                        <Table
                            bordered
                            cellBordered
                            autoHeight={true}
                            headerHeight={40}
                            data={this.state.fact1Results.filter(
                                (_, i) =>
                                    i >= this.state.fact1Limit * (this.state.fact1Page - 1) &&
                                    i < this.state.fact1Limit * this.state.fact1Page
                            )}
                            loading={this.state.fact1Load}
                            sortColumn={this.state.fact1SortColumn}
                            sortType={this.state.fact1SortType}
                            onSortColumn={(sortColumn, sortType) => {
                                this.setState({ fact1Load: true });
                                this.setState({ fact1Page: 1 });

                                this.state.fact1Results.sort((a, b) => {
                                    let x = a[sortColumn];
                                    let y = b[sortColumn];

                                    return ColumnSort(x, y, sortType);
                                });

                                setTimeout(() => {
                                    this.setState({ fact1SortType: sortType });
                                    this.setState({ fact1SortColumn: sortColumn });
                                    this.setState({ fact1Load: false });
                                }, 500);
                            }}
                        >
                            <Column width={100}  fixed flexGrow={1} sortable>
                                <HeaderCell>Name</HeaderCell>
                                <Cell dataKey="Player" />
                            </Column>

                            <Column flexGrow={1} sortable>
                                <HeaderCell>Team</HeaderCell>
                                <Cell dataKey="Tm" />
                            </Column>

                            <Column flexGrow={1} sortable>
                                <HeaderCell>Position</HeaderCell>
                                <Cell dataKey="Pos" />
                            </Column>

                            <Column flexGrow={1} sortable>
                                <HeaderCell>PTS / game</HeaderCell>
                                <Cell dataKey="pointsPerGame" />
                            </Column>

                            <Column flexGrow={1} sortable>
                                <HeaderCell>Season Wins</HeaderCell>
                                <Cell dataKey="totalWins" />
                            </Column>

                            <Column flexGrow={1} sortable>
                                <HeaderCell> Player Height</HeaderCell>
                                <Cell dataKey="Height" />
                            </Column>

                            <Column flexGrow={1} sortable>
                                <HeaderCell> Player Weight</HeaderCell>
                                <Cell dataKey="Weight" />
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
                                limit={this.state.fact1Limit}
                                limitOptions={[10, 25, 50]}
                                total={this.state.fact1Results.length}
                                activePage={this.state.fact1Page}
                                onChangePage={p => this.setState({ fact1Page: p })}
                                onChangeLimit={dataKey => {
                                    this.setState({ fact1Page: 1 });
                                    this.setState({ fact1Limit: dataKey });
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ width: "80vw", margin: "0 auto", marginTop: "3vh" }}>
                        <h3>Top Players in Not-So-Good Teams</h3>
                        <br></br>
                        {/* =====================TABLE 2=============================== */}
                        <h5>
                            Who are the top player in teams that has more losses than wins in the season?
                        </h5>
                        <br></br>
                        <Table
                            bordered
                            cellBordered
                            autoHeight={true}
                            headerHeight={40}
                            data={this.state.fact2Results.filter(
                                (_, i) =>
                                    i >= this.state.fact2Limit * (this.state.fact2Page - 1) &&
                                    i < this.state.fact2Limit * this.state.fact2Page
                            )}
                            loading={this.state.fact2Load}
                            sortColumn={this.state.fact2SortColumn}
                            sortType={this.state.fact2SortType}
                            onSortColumn={(sortColumn, sortType) => {
                                this.setState({ fact2Load: true });
                                this.setState({ fact2Page: 1 });

                                this.state.fact2Results.sort((a, b) => {
                                    let x = a[sortColumn];
                                    let y = b[sortColumn];

                                    return ColumnSort(x, y, sortType);
                                });

                                setTimeout(() => {
                                    this.setState({ fact2SortType: sortType });
                                    this.setState({ fact2SortColumn: sortColumn });
                                    this.setState({ fact2Load: false });
                                }, 500);
                            }}
                        >
                            <Column width={100}  fixed flexGrow={1} sortable>
                                <HeaderCell>Name</HeaderCell>
                                <Cell dataKey="Player" />
                            </Column>

                            <Column flexGrow={1} sortable>
                                <HeaderCell>Team</HeaderCell>
                                <Cell dataKey="Tm" />
                            </Column>

                            <Column flexGrow={1} sortable>
                                <HeaderCell>Position</HeaderCell>
                                <Cell dataKey="Pos" />
                            </Column>

                            <Column flexGrow={1} sortable>
                                <HeaderCell>PTS / game/</HeaderCell>
                                <Cell dataKey="pointsPerGame" />
                            </Column>

                            <Column flexGrow={1} sortable>
                                <HeaderCell>AST / game</HeaderCell>
                                <Cell dataKey="assistsPerGame" />
                            </Column>

                            <Column flexGrow={1} sortable>
                                <HeaderCell>TRB / game</HeaderCell>
                                <Cell dataKey="reboundsPerGame" />
                            </Column>

                            <Column flexGrow={1} sortable>
                                <HeaderCell> Total Wins</HeaderCell>
                                <Cell dataKey="totalWins" />
                            </Column>

                            <Column flexGrow={1} sortable>
                                <HeaderCell> Total Losses</HeaderCell>
                                <Cell dataKey="totalLosses" />
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
                                limit={this.state.fact2Limit}
                                limitOptions={[10, 25, 50]}
                                total={this.state.fact2Results.length}
                                activePage={this.state.fact2Page}
                                onChangePage={p => this.setState({ fact2Page: p })}
                                onChangeLimit={dataKey => {
                                    this.setState({ fact2Page: 1 });
                                    this.setState({ fact2Limit: dataKey });
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ width: "80vw", margin: "0 auto", marginTop: "3vh" }}>
                        <h3>Lucky or Home Advantage</h3>
                        <br></br>
                        {/* =====================TABLE 3=============================== */}
                        <h5>
                            Where did the team achieve most victory? Is it at home?<br></br>
                            Is the top player in the team born in this city?
                        </h5>
                        <br></br>
                        <Table
                            bordered
                            cellBordered
                            autoHeight={true}
                            headerHeight={40}
                            data={this.state.fact3Results}
                            loading={this.state.fact3Load}
                        >
                            <Column fixed flexGrow={1} >
                                <HeaderCell>Team</HeaderCell>
                                <Cell dataKey="The_Team" />
                            </Column>

                            <Column width={150} flexGrow={1} >
                                <HeaderCell>City with Most Win</HeaderCell>
                                <Cell dataKey="lucky_city" />
                            </Column>

                            <Column flexGrow={1} >
                                <HeaderCell> ...Home City?</HeaderCell>
                                <Cell dataKey="IS_HOME_CITY" />
                            </Column>

                            <Column width={150} flexGrow={1} >
                                <HeaderCell>Player with Most PTS</HeaderCell>
                                <Cell dataKey="lucky_player" />
                            </Column>

                            <Column flexGrow={1} >
                                <HeaderCell>... Born in This City?</HeaderCell>
                                <Cell dataKey="Born_in_lucky_CITY" />
                            </Column>
                        </Table>
                    </div>
                    <div style={{ width: "80vw", margin: "0 auto", marginTop: "3vh" }}>
                        <h3>It's All 'bout Contribution</h3>
                        <br></br>
                        {/* =====================TABLE 4=============================== */}
                        <h5>
                            Sometimes points can define a "top" player, but now let's check out the
                            player who contributes the highest percentage of points to their team 
                            in each season.
                        </h5>
                        <br></br>
                        <Table
                            bordered
                            cellBordered
                            autoHeight={true}
                            headerHeight={40}
                            data={this.state.fact4Results.filter(
                                (_, i) =>
                                    i >= this.state.fact4Limit * (this.state.fact4Page - 1) &&
                                    i < this.state.fact4Limit * this.state.fact4Page
                            )}
                            loading={this.state.fact4Load}
                            sortColumn={this.state.fact4SortColumn}
                            sortType={this.state.fact4SortType}
                            onSortColumn={(sortColumn, sortType) => {
                                this.setState({ fact4Load: true });
                                this.setState({ fact4Page: 1 });

                                this.state.fact4Results.sort((a, b) => {
                                    let x = a[sortColumn];
                                    let y = b[sortColumn];

                                    return ColumnSort(x, y, sortType);
                                });

                                setTimeout(() => {
                                    this.setState({ fact4SortType: sortType });
                                    this.setState({ fact4SortColumn: sortColumn });
                                    this.setState({ fact4Load: false });
                                }, 500);
                            }}
                        >
                            <Column fixed flexGrow={1} sortable>
                                <HeaderCell>Season</HeaderCell>
                                <Cell dataKey="Season" />
                            </Column>

                            <Column flexGrow={1} sortable>
                                <HeaderCell>Team</HeaderCell>
                                <Cell dataKey="Abbreviation" />
                            </Column>

                            <Column flexGrow={1} sortable>
                                <HeaderCell> Player Name</HeaderCell>
                                <Cell dataKey="Player" />
                            </Column>

                            <Column flexGrow={1} sortable>
                                <HeaderCell>Personal PTS</HeaderCell>
                                <Cell dataKey="personalPTS" />
                            </Column>

                            <Column flexGrow={1} sortable>
                                <HeaderCell>Contribution (percentage)</HeaderCell>
                                <Cell dataKey="Contribution" />
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
                                limit={this.state.fact4Limit}
                                limitOptions={[10, 25, 50]}
                                total={this.state.fact4Results.length}
                                activePage={this.state.fact4Page}
                                onChangePage={p => this.setState({ fact4Page: p })}
                                onChangeLimit={dataKey => {
                                    this.setState({ fact4Page: 1 });
                                    this.setState({ fact4Limit: dataKey });
                                }}
                            />
                        </div>
                    </div>
                </div>
            </CustomProvider>
        );
    }
}
export default Home;
