import React from 'react';
import USAMap from "react-usa-map";

import { Toggle, InputNumber, Grid, Row, Col, FlexboxGrid, Pagination, CustomProvider, InputGroup, Input, Button } from "rsuite";
import { Table, Column, HeaderCell, Cell } from "rsuite-table";
import SearchIcon from '@rsuite/icons/Search';
import ReloadIcon from '@rsuite/icons/Reload';
import { FaChessPawn, FaUserFriends } from "react-icons/fa";
import SearchPeopleIcon from '@rsuite/icons/SearchPeople';

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
            stQuery: "",

            showPlayerInfo: false,
            playerResults: [],

            playerLoad: true,
            playerPage: 1,
            playerName: "",
            playerLimit: 5,
            playerSortColumn: null,
            playerSortType: null
        };

        this.handleQuerySearch = this.handleQuerySearch.bind(this)
        this.showPlayer = this.showPlayer.bind(this)
        this.getStateFullName = this.getStateFullName.bind(this)

        this.stateList = {
            AZ: 'Arizona',
            AL: 'Alabama',
            AK: 'Alaska',
            AR: 'Arkansas',
            CA: 'California',
            CO: 'Colorado',
            CT: 'Connecticut',
            DC: 'District of Columbia',
            DE: 'Delaware',
            FL: 'Florida',
            GA: 'Georgia',
            HI: 'Hawaii',
            ID: 'Idaho',
            IL: 'Illinois',
            IN: 'Indiana',
            IA: 'Iowa',
            KS: 'Kansas',
            KY: 'Kentucky',
            LA: 'Louisiana',
            ME: 'Maine',
            MD: 'Maryland',
            MA: 'Massachusetts',
            MI: 'Michigan',
            MN: 'Minnesota',
            MS: 'Mississippi',
            MO: 'Missouri',
            MT: 'Montana',
            NE: 'Nebraska',
            NV: 'Nevada',
            NH: 'New Hampshire',
            NJ: 'New Jersey',
            NM: 'New Mexico',
            NY: 'New York',
            NC: 'North Carolina',
            ND: 'North Dakota',
            OH: 'Ohio',
            OK: 'Oklahoma',
            OR: 'Oregon',
            PA: 'Pennsylvania',
            RI: 'Rhode Island',
            SC: 'South Carolina',
            SD: 'South Dakota',
            TN: 'Tennessee',
            TX: 'Texas',
            UT: 'Utah',
            VT: 'Vermont',
            VA: 'Virginia',
            WA: 'Washington',
            WV: 'West Virginia',
            WI: 'Wisconsin',
            WY: 'Wyoming'
        }
    }

    handleQuerySearch() {
        getPlayerSearch(
            this.state.alltimeQuery,
            this.state.seasonQuery,
            "Games",
            this.state.nameQuery,
            this.state.teamQuery,
            this.state.posQuery, this.state.stQuery).then(res => {
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
            this.state.posQuery, this.state.stQuery).then(res => {
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
            this.state.posQuery, this.state.stQuery).then(res => {
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
            this.state.posQuery, this.state.stQuery).then(res => {
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
            this.state.posQuery, this.state.stQuery).then(res => {
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
            this.state.posQuery, this.state.stQuery).then(res => {
                this.setState({
                    searchTopPF: res.results,
                    showPlayerInfo: false
                });
            });
    }

    showPlayer(name) {
        getPlayer(name).then(res => {
            this.setState({
                playerResults: res.results,
                playerName: name,
                playerLoad: false
            });
        });
        this.setState({
            showPlayerInfo: true
        });
    }

    componentDidMount() {
        this.handleQuerySearch()
    }

    getStateFullName = function (stateAbbr) {
        return this.stateList[stateAbbr];
    }


    render() {
        return (
            <CustomProvider theme={"dark"}>
                <div>
                    <TopNav />
                    <div style={{ width: "81vw", margin: "0 auto", marginTop: "2vh" }}>
                        <h2>Players</h2>
                        <h5> Here are 6 "Top lists" based on different attributes of a player, feel free to filter and click on the players! </h5>
                        <h5>(The names that has an asterisk (*) indicates that the player has been elected to the Hall of Fame.)</h5>
                        <br></br>
                        <br></br>

                        <div style={{ textAlign: "center", width: "70vw", margin: "0 auto", marginTop: "2vh" }}>
                            <h5>Click on the map to select a state and only see the players born from there!</h5>
                            <USAMap
                                height={400}
                                onClick={(event) => {
                                    var stateFullName = this.getStateFullName(event.target.dataset.name);
                                    this.setState({
                                        stQuery: stateFullName
                                    }, this.handleQuerySearch);
                                }} />
                        </div>
                        <br></br>
                        <div style={{ textAlign: "center" }}>
                            <Button
                                color="violet" 
                                appearance="ghost"
                                onClick={() => this.setState({
                                        stQuery: ""
                                    }, this.handleQuerySearch)}>
                                <ReloadIcon />
                                &nbsp;&nbsp;&nbsp; You current state selection is - &nbsp; {this.state.stQuery} - &nbsp;, click to clear.
                            </Button>
                        </div>
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
                                <h4 style={{ textAlign: 'left' }}>Field Goal %</h4>
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
                            <hr></hr>
                            <div style={{ textAlign: "right", padding: 20 }} >
                                <Button
                                    align="right"
                                    appearance="ghost"

                                    onClick={() => {
                                        this.setState({
                                            showPlayerInfo: false,
                                            playerResults: [],

                                            playerLoad: true,
                                            playerName: "",
                                            playerPage: 1,
                                            playerLimit: 5,
                                            playerSortType: null,
                                            playerSortColumn: null
                                        });
                                    }}>
                                    Hide Player Details
                                </Button>
                            </div>

                            <div style={{ textAlign: "center" }}>
                                <h3>{this.state.playerName} </h3>
                                <h5>
                                    Here are is some information about him and his average performances in each season.
                                </h5>
                                <br></br>
                                <Table
                                    height={80}
                                    data={this.state.playerResults}>
                                    <Column flexGrow={1} align="center">
                                        <HeaderCell>Born in City</HeaderCell>
                                        <Cell dataKey="Birth_City" />
                                    </Column>
                                    <Column flexGrow={1} align="center">
                                        <HeaderCell>Born in State</HeaderCell>
                                        <Cell dataKey="Birth_State" />
                                    </Column>
                                    <Column flexGrow={1} align="center">
                                        <HeaderCell>Born in</HeaderCell>
                                        <Cell dataKey="Birth_Year" />
                                    </Column>
                                    <Column flexGrow={1} align="center">
                                        <HeaderCell>Height</HeaderCell>
                                        <Cell dataKey="Height" />
                                    </Column>
                                    <Column flexGrow={1} align="center">
                                        <HeaderCell>Weight</HeaderCell>
                                        <Cell dataKey="Weight" />
                                    </Column>
                                    <Column flexGrow={1} align="center">
                                        <HeaderCell>Undergrad</HeaderCell>
                                        <Cell dataKey="College" />
                                    </Column>
                                </Table>

                                <br></br>
                                <Table
                                    wordWrap
                                    hover={true}
                                    bordered={true}
                                    cellBordered={true}
                                    autoHeight={true}

                                    data={this.state.playerResults.filter(
                                        (_, i) =>
                                            i >= this.state.playerLimit * (this.state.playerPage - 1) &&
                                            i < this.state.playerLimit * this.state.playerPage
                                    )}

                                    loading={this.state.playerLoad}

                                    sortColumn={this.state.playerSortColumn}
                                    sortType={this.state.playerSortType}
                                    onSortColumn={(sortColumn, sortType) => {
                                        this.setState({
                                            playerLoad: true,
                                            playerPage: 1
                                        });

                                        this.state.playerResults.sort((a, b) => {
                                            let x = a[sortColumn];
                                            let y = b[sortColumn];

                                            return ColumnSort(x, y, sortType);
                                        });

                                        setTimeout(() => {
                                            this.setState({
                                                playerSortType: sortType,
                                                playerSortColumn: sortColumn,
                                                playerLoad: false
                                            });
                                        }, 200);
                                    }}
                                >
                                    <Column flexGrow={1} sortable align="center">
                                        <HeaderCell>Season</HeaderCell>
                                        <Cell dataKey="Season" />
                                    </Column>

                                    <Column flexGrow={1} sortable align="center">
                                        <HeaderCell>Team</HeaderCell>
                                        <Cell dataKey="Team" />
                                    </Column>

                                    <Column flexGrow={1} sortable align="center">
                                        <HeaderCell>Position</HeaderCell>
                                        <Cell dataKey="Pos" />
                                    </Column>

                                    <Column flexGrow={1} sortable align="center">
                                        <HeaderCell>PTS/G</HeaderCell>
                                        <Cell dataKey="PPG" />
                                    </Column>
                                    <Column flexGrow={1} sortable align="center">
                                        <HeaderCell>ATS/G</HeaderCell>
                                        <Cell dataKey="APG" />
                                    </Column>
                                    <Column flexGrow={1} sortable align="center">
                                        <HeaderCell>RB/G</HeaderCell>
                                        <Cell dataKey="RPG" />
                                    </Column>
                                    <Column flexGrow={1} sortable align="center">
                                        <HeaderCell>PF</HeaderCell>
                                        <Cell dataKey="PF" />
                                    </Column>
                                    <Column flexGrow={1} sortable align="center">
                                        <HeaderCell>eFG %</HeaderCell>
                                        <Cell dataKey="EFG" />
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
                                        limit={this.state.playerLimit}
                                        limitOptions={[5, 10, 30]}
                                        total={this.state.playerResults.length}
                                        activePage={this.state.playerPage}
                                        onChangePage={p => this.setState({ playerPage: p })}
                                        onChangeLimit={dataKey => {
                                            this.setState({
                                                playerPage: 1,
                                                playerLimit: dataKey
                                            });
                                        }}
                                    />
                                </div>
                                <br></br>
                                <br></br>
                                <Button
                                    color="red"
                                    appearance="primary"
                                    onClick={() => {
                                        window.open("https://google.com/search?q=" + this.state.playerName, '_blank');;
                                    }}>
                                    <SearchPeopleIcon />
                                    What to search more about this player? Click here!
                                </Button>
                            </div>
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
