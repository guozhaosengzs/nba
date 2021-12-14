// import React from 'react';
// import { Pagination, CustomProvider } from 'rsuite';
// import { Table, Column, ColumnGroup, HeaderCell, Cell } from 'rsuite-table';

// import TopNav from '../components/TopNav';

// class Players extends React.Component {
//     constructor(props) {
//         super(props);

//         this.state = {
//             gameResults: [],
//             gameLoad: true,

//             gamePage: 1,
//             gameLimit: 15,

//             gameSortType: null,
//             gameSortColumn: null,

//             showGameBool: false,
//             showGameResult: null,
//             showTeamResult: null,
//             showPlayerResult: null,
//             homeQuery: "undefined",
//             awayQuery: "undefined",
//             cityQuery: "undefined",
//             dateFromQuery: "undefined",
//             dateToQuery: "undefined"

//         };

//         this.handleQuerySearch = this.handleQuerySearch.bind(this)

//         this.showPlayer = this.showPlayer.bind(this)
//     }

//     handleQuerySearch() {
//         getSearchedGames(this.state.homeQuery, this.state.awayQuery, this.state.cityQuery, this.state.dateFromQuery, this.state.dateToQuery).then(res => {
//             this.setState({
//                 gameResults: res.results,
//                 gameLoad: false
//             });
//         });
//     }

//     showGame(Game_ID) {
//         getGame(Game_ID).then(res => {
//             this.setState({
//                 showGameResult: res.results[0]
//             });
//         });
//         getGameTeamInfo(Game_ID).then(res => {
//             this.setState({
//                 showTeamResult: res.results[0]
//             });
//         });

//         getGamePlayerInfo(Game_ID).then(res => {
//             this.setState({
//                 showPlayerResult: res.results[0]
//             });
//         });
//         this.setState({
//             showGameBool: true
//         })
//     }
// }

// export default Players
