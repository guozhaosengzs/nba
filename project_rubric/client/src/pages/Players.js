import React from 'react';
import { Pagination, CustomProvider } from 'rsuite';
import { Table, Column, ColumnGroup, HeaderCell, Cell } from 'rsuite-table';
import { List } from 'rsuite';

import TopNav from '../components/TopNav';
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

            alltimeQuery: "True",
            seasonQuery: 0,
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
        getPlayerSearch("True", 0, "Games", "", "", "").then(res => {
            this.setState({
                searchTopGames: res.results,
            });
        });

        getPlayerSearch("True", 0, "Points", "", "", "").then(res => {
            this.setState({
                searchTopPTS: res.results
            });
        });

        getPlayerSearch("True", 0, "Assists", "", "", "").then(res => {
            this.setState({
                searchTopAST: res.results
            });
        });

        getPlayerSearch("True", 0, "Rebounds", "", "", "").then(res => {
            this.setState({
                searchTopRB: res.results
            });
        });

        getPlayerSearch("True", 0, "FGs", "", "", "").then(res => {
            this.setState({
                searchTopFG: res.results
            });
        });

        getPlayerSearch("True", 0, "PFs", "", "", "").then(res => {
            this.setState({
                searchTopPF: res.results
            });
        });
        console.log(this.state.searchTopGames)
    }


    render() {
        return (
            <CustomProvider theme={"dark"}>
                <div>
                    <TopNav />
                    <div style={{ width: "70vw", margin: "0 auto", marginTop: "2vh" }}>
                        <h2>Players</h2>
                        <h5> Here are 6 "Top lists" based on different attributes of a player, feel free to filter and click on the players! </h5>
                    </div>
                </div>
            </CustomProvider>
        )
    }
}

export default Players


// search him online!
{/* <div>
<List hover>
  <List.Item onClick={() => { console.log(1)
  }}>
    x {this.state.gamesPageSize}
  </List.Item>
</List>
</div> */}