import React from "react";

import { Pagination, CustomProvider } from "rsuite";
import { Table, Column, ColumnGroup, HeaderCell, Cell } from "rsuite-table";

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
            fact2SortColumn: null
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
    }

    render() {
        return (
            <CustomProvider theme={"dark"}>
                <div>
                    <TopNav />
                    <div style={{ width: "70vw", margin: "0 auto", marginTop: "5vh" }}>
                        <h2>Fun Facts</h2>
                        <h5>
                            With the dataset on NBA, there are a lot of interesting topics to discover,
                            and below are some of the things that we were interested to find out.{" "}
                        </h5>
                    </div>

                    <div style={{ width: "70vw", margin: "0 auto", marginTop: "5vh" }}>
                        <h3>Best Position in Good Teams</h3>
                        <h5>
                            Who are the top scoring players for each position from teams that has more than 50 wins in the season?
                        </h5>
                        <br></br>
                        <Table
                            bordered
                            cellBordered
                            height={460}
                            headerHeight={40}
                            data={this.state.fact1Results.filter(
                                (_, i) =>
                                    i > this.state.fact1Limit * (this.state.fact1Page - 1) &&
                                    i <= this.state.fact1Limit * this.state.fact1Page
                            )}
                            loading={this.state.fact1Load}
                            sortColumn={this.state.fact1SortColumn}
                            sortType={this.state.fact1SortType}
                            onSortColumn={(sortColumn, sortType) => {
                                this.setState({ fact1Load: true });

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
                            <Column width={100} align="center" fixed flexGrow={1} sortable>
                                <HeaderCell>Name</HeaderCell>
                                <Cell dataKey="Player" />
                            </Column>

                            <Column width={100} flexGrow={1} sortable>
                                <HeaderCell>POS</HeaderCell>
                                <Cell dataKey="Position" />
                            </Column>

                            <Column width={100} flexGrow={1} sortable>
                                <HeaderCell>PTS</HeaderCell>
                                <Cell dataKey="PointPerSeason" />
                            </Column>

                            <Column width={100} flexGrow={1} sortable>
                                <HeaderCell>AST</HeaderCell>
                                <Cell dataKey="AssistPerSeason" />
                            </Column>

                            <Column width={100} flexGrow={1} sortable>
                                <HeaderCell>PF</HeaderCell>
                                <Cell dataKey="PersonalFoulPerSeason" />
                            </Column>

                            <Column width={100} flexGrow={1} sortable>
                                <HeaderCell>EFG</HeaderCell>
                                <Cell dataKey="EFGPerSeason" />
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

                    <div style={{ width: "70vw", margin: "0 auto", marginTop: "5vh" }}>
                        <h3>Games</h3>

                        <Table
                            bordered
                            cellBordered
                            height={420}
                            headerHeight={80}
                            data={this.state.fact2Results.filter(
                                (_, i) =>
                                    i > this.state.fact2Limit * (this.state.fact2Page - 1) &&
                                    i <= this.state.fact2Limit * this.state.fact2Page
                            )}
                            loading={this.state.fact2Load}
                            sortColumn={this.state.fact2SortColumn}
                            sortType={this.state.fact2SortType}
                            onSortColumn={(sortColumn, sortType) => {
                                this.setState({ fact2Load: true });

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
                            onRowClick={data => {
                                this.goToGame(data.Game_ID);
                            }}
                        >
                            <Column width={150} align="center" verticalAlign="middle" sortable>
                                <HeaderCell>Game Date</HeaderCell>
                                <Cell dataKey="Game_Date" />
                            </Column>

                            <ColumnGroup header="HOME" align="center">
                                <Column width={130} flexGrow={1} sortable>
                                    <HeaderCell>Points</HeaderCell>
                                    <Cell dataKey="Pts_Home" />
                                </Column>

                                <Column width={130} flexGrow={1} sortable>
                                    <HeaderCell>Name</HeaderCell>
                                    <Cell dataKey="Home_Abbr" />
                                </Column>
                            </ColumnGroup>

                            <ColumnGroup header="AWAY" align="center">
                                <Column width={130} flexGrow={1} sortable>
                                    <HeaderCell>Name</HeaderCell>
                                    <Cell dataKey="Away_abbr" />
                                </Column>

                                <Column width={130} flexGrow={1} sortable>
                                    <HeaderCell>Points</HeaderCell>
                                    <Cell dataKey="Pts_Away" />
                                </Column>
                            </ColumnGroup>
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
                </div>
            </CustomProvider>
        );
    }
}
export default Home;
