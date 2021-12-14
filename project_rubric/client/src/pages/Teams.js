import React from "react";

import { Grid, Row, Col, CustomProvider, Button } from "rsuite";
import { Table, ColumnGroup, Column, HeaderCell, Cell } from "rsuite-table";

import TopNav from "../components/TopNav";
import ColumnSort from "../components/ColumnSort";
import {
    getTeamInfo,
    getTeamSeaonalBest,
    getTeamSeaonalWorst,
    getTeamSeaonalPlayer
} from "../fetcher";

class Teams extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            teamWinLoad: false,
            teamWinSortType: null,
            teamWinSortColumn: null,

            teamLossLoad: false,
            teamLossSortType: null,
            teamLossSortColumn: null,

            teamPlayerLoad: false,
            teamPlayerSortType: null,
            teamPlayerSortColumn: null,

            showDetail: false,

            query: null,
            showTeamInfo: null,
            showWinResults: null,
            showLossResults: null,
            showPlayerResults: null,
        };
        this.showTeam = this.showTeam.bind(this)
    }

    showTeam() {
        getTeamInfo(this.state.query).then(res => {
            this.setState({
                showTeamInfo: res.results[0]
            });
        });

        getTeamSeaonalBest(this.state.query).then(res => {
            this.setState({
                showWinResults: res.results
            });
        });

        getTeamSeaonalWorst(this.state.query).then(res => {
            this.setState({
                showLossResults: res.results
            });
        });

        getTeamSeaonalPlayer(this.state.query).then(res => {
            this.setState({
                showPlayerResults: res.results,
                showDetail: true
            });
        });
    }

    // componentDidMount() {
    // }

    render() {
        return (
            <CustomProvider theme={"dark"}>
                <div>
                    <TopNav />
                    <div style={{ width: "70vw", margin: "0 auto", marginTop: "2vh" }}>
                        <h2>Teams</h2>
                        <h5>
                            Learn more about the teams in NBA!
                        </h5>
                        <br></br>
                        <div style={{ width: "60vw", margin: "0 auto", marginTop: "2vh" }}>

                            <Grid fluid>
                                <Row >
                                    <Col md={8}>
                                        <h4>ATLANTIC</h4>
                                        <hr></hr>
                                        <div
                                            style={{ textAlignVertical: "center" }}
                                            onClick={() => {
                                                this.setState({ query: 1610612738 },
                                                    this.showTeam)
                                            }}>
                                            <h5> <img
                                                src={"images/Celtics.png"}
                                                alt={"Team logo"}
                                                height={60}
                                                width={60} />
                                                &nbsp;
                                                Boston Celtics</h5>
                                        </div>

                                        <div
                                            style={{ textAlignVertical: "center" }}
                                            onClick={() => {
                                                this.setState({ query: 1610612751 },
                                                    this.showTeam)
                                            }}>
                                            <h5> <img
                                                src={"images/Nets.png"}
                                                alt={"Team logo"}
                                                height={60}
                                                width={60} />
                                                &nbsp;
                                                Brooklyn Nets
                                            </h5>
                                        </div>

                                        <div
                                            style={{ textAlignVertical: "center" }}
                                            onClick={() => {
                                                this.setState({ query: 1610612752 },
                                                    this.showTeam)
                                            }}>
                                            <h5> <img
                                                src={"images/Knicks.png"}
                                                alt={"Team logo"}
                                                height={60}
                                                width={60} />
                                                &nbsp;
                                                New York Knicks
                                            </h5>
                                        </div>

                                        <div
                                            style={{ textAlignVertical: "center" }}
                                            onClick={() => {
                                                this.setState({ query: 1610612755 },
                                                    this.showTeam)
                                            }}>
                                            <h5> <img
                                                src={"images/76ers.png"}
                                                alt={"Team logo"}
                                                height={60}
                                                width={60} />
                                                &nbsp;
                                                Philadelphia 76ers
                                            </h5>
                                        </div>

                                        <div
                                            style={{ textAlignVertical: "center" }}
                                            onClick={() => {
                                                this.setState({ query: 1610612761 },
                                                    this.showTeam)
                                            }}>
                                            <h5> <img
                                                src={"images/Raptors.png"}
                                                alt={"Team logo"}
                                                height={60}
                                                width={60} />
                                                &nbsp;
                                                Toronto Raptors
                                            </h5>
                                        </div>
                                    </Col>
                                    <Col md={8}>
                                        <h4>CENTRAL</h4>
                                        <hr></hr>
                                        <div
                                            style={{ textAlignVertical: "center" }}
                                            onClick={() => {
                                                this.setState({ query: 1610612741 },
                                                    this.showTeam)
                                            }}>
                                            <h5> <img
                                                src={"images/Bulls.png"}
                                                alt={"Team logo"}
                                                height={60}
                                                width={60} />
                                                &nbsp;
                                                Chicago Bulls</h5>
                                        </div>

                                        <div
                                            style={{ textAlignVertical: "center" }}
                                            onClick={() => {
                                                this.setState({ query: 1610612739 },
                                                    this.showTeam)
                                            }}>
                                            <h5> <img
                                                src={"images/Cavaliers.png"}
                                                alt={"Team logo"}
                                                height={60}
                                                width={60} />
                                                &nbsp;
                                                Cleveland Cavaliers
                                            </h5>
                                        </div>

                                        <div
                                            style={{ textAlignVertical: "center" }}
                                            onClick={() => {
                                                this.setState({ query: 1610612765 },
                                                    this.showTeam)
                                            }}>
                                            <h5> <img
                                                src={"images/Pistons.png"}
                                                alt={"Team logo"}
                                                height={60}
                                                width={60} />
                                                &nbsp;
                                                Detroit Pistons
                                            </h5>
                                        </div>

                                        <div
                                            style={{ textAlignVertical: "center" }}
                                            onClick={() => {
                                                this.setState({ query: 1610612754 },
                                                    this.showTeam)
                                            }}>
                                            <h5> <img
                                                src={"images/Pacers.png"}
                                                alt={"Team logo"}
                                                height={60}
                                                width={60} />
                                                &nbsp;
                                                Indiana Pacers
                                            </h5>
                                        </div>

                                        <div
                                            style={{ textAlignVertical: "center" }}
                                            onClick={() => {
                                                this.setState({ query: 1610612749 },
                                                    this.showTeam)
                                            }}>
                                            <h5> <img
                                                src={"images/Bucks.png"}
                                                alt={"Team logo"}
                                                height={60}
                                                width={60} />
                                                &nbsp;
                                                Milwaukee Bucks
                                            </h5>
                                        </div>
                                    </Col>
                                    <Col md={8}>
                                        <h4>SOUTHEAST</h4>
                                        <hr></hr>
                                        <div
                                            style={{ textAlignVertical: "center" }}
                                            onClick={() => {
                                                this.setState({ query: 1610612737 },
                                                    this.showTeam)
                                            }}>
                                            <h5> <img
                                                src={"images/Hawks.png"}
                                                alt={"Team logo"}
                                                height={60}
                                                width={60} />
                                                &nbsp;
                                                Atlanta Hawks
                                            </h5>
                                        </div>

                                        <div
                                            style={{ textAlignVertical: "center" }}
                                            onClick={() => {
                                                this.setState({ query: 1610612766 },
                                                    this.showTeam)
                                            }}>
                                            <h5> <img
                                                src={"images/Hornets.png"}
                                                alt={"Team logo"}
                                                height={60}
                                                width={60} />
                                                &nbsp;
                                                Charlotte Hornets
                                            </h5>
                                        </div>

                                        <div
                                            style={{ textAlignVertical: "center" }}
                                            onClick={() => {
                                                this.setState({ query: 1610612748 },
                                                    this.showTeam)
                                            }}>
                                            <h5> <img
                                                src={"images/Heat.png"}
                                                alt={"Team logo"}
                                                height={60}
                                                width={60} />
                                                &nbsp;
                                                Miami Heat
                                            </h5>
                                        </div>

                                        <div
                                            style={{ textAlignVertical: "center" }}
                                            onClick={() => {
                                                this.setState({ query: 1610612753 },
                                                    this.showTeam)
                                            }}>
                                            <h5> <img
                                                src={"images/Magic.png"}
                                                alt={"Team logo"}
                                                height={60}
                                                width={60} />
                                                &nbsp;
                                                Orlando Magic
                                            </h5>
                                        </div>

                                        <div
                                            style={{ textAlignVertical: "center" }}
                                            onClick={() => {
                                                this.setState({ query: 1610612764 },
                                                    this.showTeam)
                                            }}>
                                            <h5> <img
                                                src={"images/Wizards.png"}
                                                alt={"Team logo"}
                                                height={60}
                                                width={60} />
                                                &nbsp;
                                                Washington Wizards
                                            </h5>
                                        </div>
                                    </Col>
                                </Row>
                                <br></br>
                                <Row>
                                    <Col md={8}>
                                        <h4>NORTHWEST</h4>
                                        <hr></hr>
                                        <div
                                            style={{ textAlignVertical: "center" }}
                                            onClick={() => {
                                                this.setState({ query: 1610612743 },
                                                    this.showTeam)
                                            }}>
                                            <h5> <img
                                                src={"images/Nuggets.png"}
                                                alt={"Team logo"}
                                                height={60}
                                                width={60} />
                                                &nbsp;
                                                Denver Nuggets
                                            </h5>
                                        </div>

                                        <div
                                            style={{ textAlignVertical: "center" }}
                                            onClick={() => {
                                                this.setState({ query: 1610612750 },
                                                    this.showTeam)
                                            }}>
                                            <h5> <img
                                                src={"images/Timberwolves.png"}
                                                alt={"Team logo"}
                                                height={60}
                                                width={60} />
                                                &nbsp;
                                                Minnesota Timberwolves
                                            </h5>
                                        </div>

                                        <div
                                            style={{ textAlignVertical: "center" }}
                                            onClick={() => {
                                                this.setState({ query: 1610612760 },
                                                    this.showTeam)
                                            }}>
                                            <h5> <img
                                                src={"images/Thunder.png"}
                                                alt={"Team logo"}
                                                height={60}
                                                width={60} />
                                                &nbsp;
                                                Oklahoma City Thunder
                                            </h5>
                                        </div>

                                        <div
                                            style={{ textAlignVertical: "center" }}
                                            onClick={() => {
                                                this.setState({ query: 1610612757 },
                                                    this.showTeam)
                                            }}>
                                            <h5> <img
                                                src={"images/Trail Blazers.png"}
                                                alt={"Team logo"}
                                                height={60}
                                                width={60} />
                                                &nbsp;
                                                Portland Trail Blazers
                                            </h5>
                                        </div>

                                        <div
                                            style={{ textAlignVertical: "center" }}
                                            onClick={() => {
                                                this.setState({ query: 1610612762 },
                                                    this.showTeam)
                                            }}>
                                            <h5> <img
                                                src={"images/Jazz.png"}
                                                alt={"Team logo"}
                                                height={60}
                                                width={60} />
                                                &nbsp;
                                                Utah Jazz
                                            </h5>
                                        </div>
                                    </Col>
                                    <Col md={8}>
                                        <h4>PACIFIC</h4>
                                        <hr></hr>
                                        <div
                                            style={{ textAlignVertical: "center" }}
                                            onClick={() => {
                                                this.setState({ query: 1610612744 },
                                                    this.showTeam)
                                            }}>
                                            <h5> <img
                                                src={"images/Warriors.png"}
                                                alt={"Team logo"}
                                                height={60}
                                                width={60} />
                                                &nbsp;
                                                Golden State Warriors
                                            </h5>
                                        </div>

                                        <div
                                            style={{ textAlignVertical: "center" }}
                                            onClick={() => {
                                                this.setState({ query: 1610612746 },
                                                    this.showTeam)
                                            }}>
                                            <h5> <img
                                                src={"images/Clippers.png"}
                                                alt={"Team logo"}
                                                height={60}
                                                width={60} />
                                                &nbsp;
                                                LA Clippers
                                            </h5>
                                        </div>

                                        <div
                                            style={{ textAlignVertical: "center" }}
                                            onClick={() => {
                                                this.setState({ query: 1610612747 },
                                                    this.showTeam)
                                            }}>
                                            <h5> <img
                                                src={"images/Lakers.png"}
                                                alt={"Team logo"}
                                                height={60}
                                                width={60} />
                                                &nbsp;
                                                Los Angeles Lakers
                                            </h5>
                                        </div>

                                        <div
                                            style={{ textAlignVertical: "center" }}
                                            onClick={() => {
                                                this.setState({ query: 1610612756 },
                                                    this.showTeam)
                                            }}>
                                            <h5> <img
                                                src={"images/Suns.png"}
                                                alt={"Team logo"}
                                                height={60}
                                                width={60} />
                                                &nbsp;
                                                Phoenix Suns
                                            </h5>
                                        </div>

                                        <div
                                            style={{ textAlignVertical: "center" }}
                                            onClick={() => {
                                                this.setState({ query: 1610612758 },
                                                    this.showTeam)
                                            }}>
                                            <h5> <img
                                                src={"images/Kings.png"}
                                                alt={"Team logo"}
                                                height={60}
                                                width={60} />
                                                &nbsp;
                                                Sacramento Kings
                                            </h5>
                                        </div>

                                    </Col>
                                    <Col md={8}>
                                        <h4>SOUTHWEST</h4>
                                        <hr></hr>
                                        <div
                                            style={{ textAlignVertical: "center" }}
                                            onClick={() => {
                                                this.setState({ query: 1610612742 },
                                                    this.showTeam)
                                            }}>
                                            <h5> <img
                                                src={"images/Mavericks.png"}
                                                alt={"Team logo"}
                                                height={60}
                                                width={60} />
                                                &nbsp;
                                                Dallas Mavericks
                                            </h5>
                                        </div>

                                        <div
                                            style={{ textAlignVertical: "center" }}
                                            onClick={() => {
                                                this.setState({ query: 1610612745 },
                                                    this.showTeam)
                                            }}>
                                            <h5> <img
                                                src={"images/Rockets.png"}
                                                alt={"Team logo"}
                                                height={60}
                                                width={60} />
                                                &nbsp;
                                                Houston Rockets
                                            </h5>
                                        </div>

                                        <div
                                            style={{ textAlignVertical: "center" }}
                                            onClick={() => {
                                                this.setState({ query: 1610612763 },
                                                    this.showTeam)
                                            }}>
                                            <h5> <img
                                                src={"images/Grizzlies.png"}
                                                alt={"Team logo"}
                                                height={60}
                                                width={60} />
                                                &nbsp;
                                                Memphis Grizzlies
                                            </h5>
                                        </div>

                                        <div
                                            style={{ textAlignVertical: "center" }}
                                            onClick={() => {
                                                this.setState({ query: 1610612740 },
                                                    this.showTeam)
                                            }}>
                                            <h5> <img
                                                src={"images/Pelicans.png"}
                                                alt={"Team logo"}
                                                height={60}
                                                width={60} />
                                                &nbsp;
                                                New Orleans Pelicans
                                            </h5>
                                        </div>

                                        <div
                                            style={{ textAlignVertical: "center" }}
                                            onClick={() => {
                                                this.setState({ query: 1610612759 },
                                                    this.showTeam)
                                            }}>
                                            <h5> <img
                                                src={"images/Spurs.png"}
                                                alt={"Team logo"}
                                                height={60}
                                                width={60} />
                                                &nbsp;
                                                San Antonio Spurs
                                            </h5>
                                        </div>

                                    </Col>
                                </Row>
                            </Grid>
                        </div>
                    </div>
                </div>

                <div style={{ width: "70vw", margin: "0 auto", padding: 20 }}>
                    {(this.state.showDetail &&
                        (this.state.showTeamInfo !== null) &&
                        (this.state.showWinResults !== null) &&
                        (this.state.showLossResults !== null) &&
                        (this.state.showPlayerResults !== null)) &&
                        <div style={{ width: "70vw", margin: "0 auto", marginTop: "2vh" }}>       {/* start of the team details page */}
                            <div style={{ textAlign: "right", padding: 20 }} >
                                <Button
                                    align="right"
                                    appearance="ghost"

                                    onClick={() => {
                                        this.setState({
                                            teamWinLoad: false,
                                            teamWinSortType: null,
                                            teamWinSortColumn: null,

                                            teamLossLoad: false,
                                            teamLossSortType: null,
                                            teamLossSortColumn: null,

                                            teamPlayerLoad: false,
                                            teamPlayerSortType: null,
                                            teamPlayerSortColumn: null,

                                            showDetail: false,

                                            query: null,
                                            showTeamInfo: null,
                                            showWinResults: null,
                                            showLossResults: null,
                                            showPlayerResults: null,
                                        });
                                    }}>
                                    Clear Team Details
                                </Button>
                            </div>
                            <div style={{ textAlign: "center", padding: 35 }} >
                                <h2>
                                    {this.state.showTeamInfo.Full_Name}
                                </h2>
                                <img
                                    src={"images/" + this.state.showTeamInfo.Nickname + ".png"}
                                    alt={this.state.showTeamInfo.Nickname + "Logo"}
                                    height={200} />
                                <div>
                                    {this.state.showTeamInfo.State}, {this.state.showTeamInfo.City}  &nbsp;&nbsp;&nbsp; Founded in <b>{this.state.showTeamInfo.Year_Founded}</b>
                                </div>
                            </div>
                            <br></br>
                            <Grid fluid>
                                <Row>
                                    <Col md={12} style={{ textAlign: "center", textAlignVertical: "center" }}>
                                        <h4><i>Best Game in Each Season</i></h4>
                                        <div>
                                            Here are the game that <b>{this.state.showTeamInfo.Nickname}</b> has won by the most points in each of the 10 seasons pre-2018.
                                        </div>
                                        <br></br>
                                        <Table
                                            wordWrap
                                            hover={true}
                                            bordered={true}
                                            cellBordered={true}
                                            autoHeight={true}
                                            headerHeight={80}
                                            data={this.state.showWinResults}
                                            loading={this.state.teamWinLoad}
                                            sortColumn={this.state.teamWinSortColumn}
                                            sortType={this.state.teamWinSortType}
                                            onSortColumn={(sortColumn, sortType) => {
                                                this.setState({
                                                    teamWinLoad: true,
                                                });

                                                this.state.showWinResults.sort((a, b) => {
                                                    let x = a[sortColumn];
                                                    let y = b[sortColumn];

                                                    return ColumnSort(x, y, sortType);
                                                });

                                                setTimeout(() => {
                                                    this.setState({
                                                        teamWinSortType: sortType,
                                                        teamWinSortColumn: sortColumn,
                                                        teamWinLoad: false
                                                    });
                                                }, 100);
                                            }}
                                        >
                                            <Column align="center" verticalAlign="middle" sortable>
                                                <HeaderCell>Season</HeaderCell>
                                                <Cell dataKey="Season" />
                                            </Column>
                                            <ColumnGroup header="This Team" align="center">
                                                <Column flexGrow={1} sortable align="center">
                                                    <HeaderCell>Name</HeaderCell>
                                                    <Cell dataKey="self" />
                                                </Column>

                                                <Column flexGrow={1} sortable align="center">
                                                    <HeaderCell>Score</HeaderCell>
                                                    <Cell dataKey="selfScore" />
                                                </Column>
                                            </ColumnGroup>

                                            <ColumnGroup header="The Opponent" align="center">
                                                <Column flexGrow={1} sortable align="center">
                                                    <HeaderCell>Name</HeaderCell>
                                                    <Cell dataKey="opponent" />
                                                </Column>

                                                <Column flexGrow={1} sortable align="center">
                                                    <HeaderCell>Score</HeaderCell>
                                                    <Cell dataKey="opponentScore" />
                                                </Column>
                                            </ColumnGroup>
                                            <Column align="center" verticalAlign="middle" sortable>
                                                <HeaderCell>Won-by (PTS)</HeaderCell>
                                                <Cell dataKey="winPts" />
                                            </Column>
                                        </Table>
                                    </Col>

                                    <Col md={12} style={{ textAlign: "center", textAlignVertical: "center" }}>
                                        <h4><i>Worst Game in Each Season</i></h4>
                                        <div>
                                            Here are the game that <b>{this.state.showTeamInfo.Nickname}</b> has lost by the most points in each of the 10 seasons pre-2018.
                                        </div>
                                        <br></br>
                                        <Table
                                            wordWrap
                                            hover={true}
                                            bordered={true}
                                            cellBordered={true}
                                            autoHeight={true}
                                            headerHeight={80}
                                            data={this.state.showLossResults}
                                            loading={this.state.teamLossLoad}
                                            sortColumn={this.state.teamLossSortColumn}
                                            sortType={this.state.teamLossSortType}
                                            onSortColumn={(sortColumn, sortType) => {
                                                this.setState({
                                                    teamLossLoad: true,
                                                });

                                                this.state.showLossResults.sort((a, b) => {
                                                    let x = a[sortColumn];
                                                    let y = b[sortColumn];

                                                    return ColumnSort(x, y, sortType);
                                                });

                                                setTimeout(() => {
                                                    this.setState({
                                                        teamLossSortType: sortType,
                                                        teamLossSortColumn: sortColumn,
                                                        teamLossLoad: false
                                                    });
                                                }, 100);
                                            }}
                                        >
                                            <Column align="center" verticalAlign="middle" sortable>
                                                <HeaderCell>Season</HeaderCell>
                                                <Cell dataKey="Season" />
                                            </Column>
                                            <ColumnGroup header="This Team" align="center">
                                                <Column flexGrow={1} sortable align="center">
                                                    <HeaderCell>Name</HeaderCell>
                                                    <Cell dataKey="self" />
                                                </Column>

                                                <Column flexGrow={1} sortable align="center">
                                                    <HeaderCell>Score</HeaderCell>
                                                    <Cell dataKey="selfScore" />
                                                </Column>
                                            </ColumnGroup>

                                            <ColumnGroup header="The Opponent" align="center">
                                                <Column flexGrow={1} sortable align="center">
                                                    <HeaderCell>Name</HeaderCell>
                                                    <Cell dataKey="opponent" />
                                                </Column>

                                                <Column flexGrow={1} sortable align="center">
                                                    <HeaderCell>Score</HeaderCell>
                                                    <Cell dataKey="opponentScore" />
                                                </Column>
                                            </ColumnGroup>
                                            <Column align="center" verticalAlign="middle" sortable>
                                                <HeaderCell>Lost-by (PTS)</HeaderCell>
                                                <Cell dataKey="lossPts" />
                                            </Column>
                                        </Table>
                                    </Col>
                                </Row>
                                <br></br>
                                <Row>
                                    <Col md={24} style={{ textAlign: "center", textAlignVertical: "center" }}>
                                        <h4><i>Seasonal Best</i></h4>
                                        <div>
                                            Who was the best player in <b>{this.state.showTeamInfo.Nickname}</b> in the past few seasons?
                                        </div>
                                        <br></br>
                                        <Table
                                            wordWrap
                                            hover={true}
                                            bordered={true}
                                            cellBordered={true}
                                            autoHeight={true}
                                            headerHeight={40}
                                            data={this.state.showPlayerResults}
                                            loading={this.state.teamPlayerLoad}
                                            sortColumn={this.state.teamPlayerSortColumn}
                                            sortType={this.state.teamPlayerSortType}
                                            onSortColumn={(sortColumn, sortType) => {
                                                this.setState({
                                                    teamPlayerLoad: true,
                                                });

                                                this.state.showPlayerResults.sort((a, b) => {
                                                    let x = a[sortColumn];
                                                    let y = b[sortColumn];

                                                    return ColumnSort(x, y, sortType);
                                                });

                                                setTimeout(() => {
                                                    this.setState({
                                                        teamPlayerSortType: sortType,
                                                        teamPlayerSortColumn: sortColumn,
                                                        teamPlayerLoad: false
                                                    });
                                                }, 100);
                                            }}
                                        >
                                            <Column flexGrow={1} align="center" sortable>
                                                <HeaderCell>Season</HeaderCell>
                                                <Cell dataKey="Season" />
                                            </Column>

                                            <Column width={300} sortable align="center">
                                                <HeaderCell>Name</HeaderCell>
                                                <Cell dataKey="Player" />
                                            </Column>

                                            <Column width={200} sortable align="center">
                                                <HeaderCell>Height (cm)</HeaderCell>
                                                <Cell dataKey="height" />
                                            </Column>

                                            <Column width={200} sortable align="center">
                                                <HeaderCell>Weight (cm)</HeaderCell>
                                                <Cell dataKey="weight" />
                                            </Column>

                                            <Column width={200} sortable align="center">
                                                <HeaderCell>AVG PTS/Game</HeaderCell>
                                                <Cell dataKey="avgPoints" />
                                            </Column>

                                            <Column width={200} sortable align="center">
                                                <HeaderCell>AVG AST/Game</HeaderCell>
                                                <Cell dataKey="avgAssits" />
                                            </Column>

                                            <Column width={200} align="middle" sortable>
                                                <HeaderCell>AVG RB/Game</HeaderCell>
                                                <Cell dataKey="avgRebounds" />
                                            </Column>
                                        </Table>
                                    </Col>
                                </Row>
                            </Grid>


                            {/* End of the team detail page*/} </div>
                    }
                </div>
                <div style={{ padding: 50 }}>
                </div>
            </CustomProvider >
        );
    }
}

export default Teams;

