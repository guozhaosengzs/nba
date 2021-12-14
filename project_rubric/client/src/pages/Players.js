import React from 'react';
import { Toggle, InputNumber, List, PanelGroup, Panel, Grid, Row, Col, FlexboxGrid, Pagination, CustomProvider, InputGroup, Input, DateRangePicker, Button } from "rsuite";
import { Table, ColumnGroup, Column, HeaderCell, Cell } from "rsuite-table";
import SearchIcon from '@rsuite/icons/Search';
import { FaChessPawn, FaUserFriends } from "react-icons/fa";

import TopNav from '../components/TopNav';
import ColumnSort from "../components/ColumnSort";
import {
    getPlayerSearch,
    getPlayer
} from "../fetcher";

class Players extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchTopGames: [],
            searchTopPTS: [],
            searchTopAST: [],
            searchTopRB: [],
            searchTopFG: [],
            searchTopPF: [],

            alltimeQuery: true,
            seasonQuery: 2000,
            nameQuery: "",
            teamQuery: "",
            posQuery: "",

            showPlayerInfo: false,
            playerResults: [],

            playerLoad: true,
            playerPage: 1,
            playerLimit: 15,
            playerSortType: null,
            playerSortColumn: null
        };

        this.handleQuerySearch = this.handleQuerySearch.bind(this)
        this.showPlayer = this.showPlayer.bind(this)
    }

    handleQuerySearch() {
        getPlayerSearch(
            this.state.alltimeQuery,
            this.state.seasonQuery,
            "Games",
            this.state.nameQuery,
            this.state.teamQuery,
            this.state.posQuery).then(res => {
                this.setState({
                    searchTopGames: res.results
                });
            });

        getPlayerSearch(
            this.state.alltimeQuery,
            this.state.seasonQuery,
            "Points",
            this.state.nameQuery,
            this.state.teamQuery,
            this.state.posQuery).then(res => {
                this.setState({
                    searchTopPTS: res.results
                });
            });

        getPlayerSearch(
            this.state.alltimeQuery,
            this.state.seasonQuery,
            "Assists",
            this.state.nameQuery,
            this.state.teamQuery,
            this.state.posQuery).then(res => {
                this.setState({
                    searchTopAST: res.results
                });
            });

        getPlayerSearch(
            this.state.alltimeQuery,
            this.state.seasonQuery,
            "Rebounds",
            this.state.nameQuery,
            this.state.teamQuery,
            this.state.posQuery).then(res => {
                this.setState({
                    searchTopRB: res.results
                });
            });

        getPlayerSearch(
            this.state.alltimeQuery,
            this.state.seasonQuery,
            "FGs",
            this.state.nameQuery,
            this.state.teamQuery,
            this.state.posQuery).then(res => {
                this.setState({
                    searchTopFG: res.results
                });
            });

        getPlayerSearch(
            this.state.alltimeQuery,
            this.state.seasonQuery,
            "PFs",
            this.state.nameQuery,
            this.state.teamQuery,
            this.state.posQuery).then(res => {
                this.setState({
                    searchTopPF: res.results
                });
            });
    }

    showPlayer(name) {
        getPlayer(name).then(res => {
            this.setState({
                playerResults: res.results
            });
        });
        this.setState({
            showPlayerInfo: true
        });
    }

    componentDidMount() {
        this.handleQuerySearch()
    }


    render() {
        return (
            <CustomProvider theme={"dark"}>
                <div>
                    <TopNav />
                    <div style={{ width: "81vw", margin: "0 auto", marginTop: "2vh" }}>
                        <h2>Players</h2>
                        <h5> Here are 6 "Top lists" based on different attributes of a player, feel free to filter and click on the players! </h5>
                        <br></br>
                        <br></br>
                        <div>
                            <FlexboxGrid align="bottom" justify="space-around">
                                <FlexboxGrid.Item as={Col} colspan={24} sm={4}>
                                    Check for All-time stats
                                    <br></br>
                                    <Toggle
                                        size="lg"
                                        // defaultChecked={this.state.alltimeQuery}
                                        checkedChildren="All Time"
                                        unCheckedChildren="Seasonal"
                                        defaultChecked={true}
                                        onChange={(checked, _) => {
                                            this.setState({
                                                alltimeQuery: checked
                                            }, this.handleQuerySearch);
                                        }}
                                    />
                                </FlexboxGrid.Item>

                                <FlexboxGrid.Item as={Col} colspan={24} sm={4}>
                                    ... or select a specific season
                                    <InputNumber
                                        defaultValue={2000}
                                        max={2017}
                                        min={1995}
                                        disabled={this.state.alltimeQuery}
                                        onChange={(value, _) => {
                                            this.setState({
                                                seasonQuery: value
                                            }, this.handleQuerySearch);
                                        }}
                                    />
                                </FlexboxGrid.Item>

                                <FlexboxGrid.Item as={Col} colspan={24} sm={4}>
                                    Player's Name
                                    <InputGroup>
                                        <Input placeholder=""
                                            onChange={(string, _) => {
                                                this.setState({
                                                    nameQuery: string
                                                }, this.handleQuerySearch);
                                            }}
                                        />
                                        <InputGroup.Addon>
                                            <SearchIcon />
                                        </InputGroup.Addon>
                                    </InputGroup>
                                </FlexboxGrid.Item>


                                <FlexboxGrid.Item as={Col} colspan={24} sm={4}>
                                    Team Abbreviation (such as 'LAL')
                                    <InputGroup>
                                        <Input placeholder=""
                                            onChange={(string, _) => {
                                                this.setState({
                                                    teamQuery: string
                                                }, this.handleQuerySearch);
                                            }}
                                        />
                                        <InputGroup.Addon>
                                            <FaUserFriends />
                                        </InputGroup.Addon>
                                    </InputGroup>
                                </FlexboxGrid.Item>

                                <FlexboxGrid.Item as={Col} colspan={24} sm={4} smHidden>
                                    Position abbreviation (such as PG, SF, C)
                                    <InputGroup>
                                        <Input placeholder=""
                                            onChange={(string, _) => {
                                                this.setState({
                                                    posQuery: string
                                                }, this.handleQuerySearch);
                                            }}
                                        />
                                        <InputGroup.Addon>
                                            <FaChessPawn />
                                        </InputGroup.Addon>
                                    </InputGroup>
                                </FlexboxGrid.Item>

                            </FlexboxGrid>
                        </div>

                    </div>

                    <Grid fluid style={{ width: "81vw", margin: "0 auto", marginTop: "2vh", textAlign: "center" }}>
                        <Row gutter={50}>
                            <Col sm={8}>
                                <h4 style={{ textAlign: 'left' }}>Games Played</h4>
                                <Table data={this.state.searchTopGames}
                                    autoHeight
                                    onRowClick={data => {
                                        this.showPlayer(data.Player);
                                    }}>
                                    <Column flexGrow={2} align="left" verticalAlign="middle">
                                        <HeaderCell>Player</HeaderCell>
                                        <Cell dataKey="Player" />
                                    </Column>
                                    <Column flexGrow={1} align="left" verticalAlign="middle">
                                        <HeaderCell>Total</HeaderCell>
                                        <Cell dataKey="Games" />
                                    </Column>
                                </Table>
                            </Col>
                            <Col sm={8}>
                                <h4 style={{ textAlign: 'left' }}>Points</h4>
                                <Table data={this.state.searchTopPTS}
                                    autoHeight
                                    onRowClick={data => {
                                        this.showPlayer(data.Player);
                                    }}>
                                    <Column flexGrow={2} align="left" verticalAlign="middle">
                                        <HeaderCell>Player</HeaderCell>
                                        <Cell dataKey="Player" />
                                    </Column>
                                    <Column flexGrow={1} align="left" verticalAlign="middle">
                                        <HeaderCell>Total</HeaderCell>
                                        <Cell dataKey="Points" />
                                    </Column>
                                </Table>
                            </Col>
                            <Col sm={8}>
                                <h4 style={{ textAlign: 'left' }}>Assists</h4>
                                <Table data={this.state.searchTopAST}
                                    autoHeight
                                    onRowClick={data => {
                                        this.showPlayer(data.Player);
                                    }}>
                                    <Column flexGrow={2} align="left" verticalAlign="middle">
                                        <HeaderCell>Player</HeaderCell>
                                        <Cell dataKey="Player" />
                                    </Column>
                                    <Column flexGrow={1} align="left" verticalAlign="middle">
                                        <HeaderCell>Total</HeaderCell>
                                        <Cell dataKey="Assists" />
                                    </Column>
                                </Table>
                            </Col>
                        </Row>
                        <br></br>
                        <Row gutter={50}>
                            <Col sm={8}>
                                <h4 style={{ textAlign: 'left' }}>Rebounds</h4>
                                <Table data={this.state.searchTopRB}
                                    autoHeight
                                    onRowClick={data => {
                                        this.showPlayer(data.Player);
                                    }}>
                                    <Column flexGrow={2} align="left" verticalAlign="middle">
                                        <HeaderCell>Player</HeaderCell>
                                        <Cell dataKey="Player" />
                                    </Column>
                                    <Column flexGrow={1} align="left" verticalAlign="middle">
                                        <HeaderCell>Total</HeaderCell>
                                        <Cell dataKey="Rebounds" />
                                    </Column>
                                </Table>
                            </Col>
                            <Col sm={8}>
                                <h4 style={{ textAlign: 'left' }}>Feild Goal %</h4>
                                <Table data={this.state.searchTopFG}
                                    autoHeight
                                    onRowClick={data => {
                                        this.showPlayer(data.Player);
                                    }}>
                                    <Column flexGrow={2} align="left" verticalAlign="middle">
                                        <HeaderCell>Player</HeaderCell>
                                        <Cell dataKey="Player" />
                                    </Column>
                                    <Column flexGrow={1} align="left" verticalAlign="middle">
                                        <HeaderCell>Total</HeaderCell>
                                        <Cell dataKey="FGs" />
                                    </Column>
                                </Table>
                            </Col>
                            <Col sm={8}>
                                <h4 style={{ textAlign: 'left' }}>Personal Fouls</h4>
                                <Table data={this.state.searchTopPF}
                                    autoHeight
                                    onRowClick={data => {
                                        this.showPlayer(data.Player);
                                    }}>
                                    <Column flexGrow={2} align="left" verticalAlign="middle">
                                        <HeaderCell>Player</HeaderCell>
                                        <Cell dataKey="Player" />
                                    </Column>
                                    <Column flexGrow={1} align="left" verticalAlign="middle">
                                        <HeaderCell>Total</HeaderCell>
                                        <Cell dataKey="PFs" />
                                    </Column>
                                </Table>
                            </Col>
                        </Row>

                    </Grid>
                </div>
                {/* ================Divider for conditional details==============*/}
                <div style={{ width: "81vw", margin: "0 auto", padding: 20 }}>
                    {(this.state.showPlayerInfo &&
                        (this.state.playerResults !== null)) &&
                        <div>
                            {this.state.playerResults.length}
                        </div>
                    }
                </div>

                <div style={{ padding: 50 }}>
                </div>
            </CustomProvider>
        )
    }
}

export default Players


// search him online!
