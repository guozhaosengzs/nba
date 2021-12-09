import React from 'react';

import { Pagination, CustomProvider } from 'rsuite';
import { Table, Column, ColumnGroup, HeaderCell, Cell } from 'rsuite-table';

import TopNav from '../components/TopNav';
import { getAllPlayersAvg, getAllGames } from '../fetcher'

class Home extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            gamesResults: [],
            gamesPageNumber: 1,
            gamesPageSize: 10,
            playersResults: [],
            pagination: null
        }

        this.goToGame = this.goToGame.bind(this)
    }

    goToGame(Game_ID) {
        window.location = `/game?id=${Game_ID}`
    }

    componentDidMount() {
        getAllGames().then(res => {
            this.setState({ gamesResults: res.results })
        })

        getAllPlayersAvg().then(res => {
            console.log(res.results)
            this.setState({ playersResults: res.results })
        })
    }

    render() {
        return (
            <CustomProvider theme={'dark'}>
                <div>
                    <TopNav />
                    <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
                        <h2>Welcome to the NBA Database!</h2>
                        <h4>Here you can look for information about players, teams, and matches throughout the history of NBA - good luck exploring! </h4>
                    </div>

                    <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
                        <h3>Player Stats (Average per Season)</h3>

                        <Table data={this.state.playersResults} loading={false}>
                            <Column width={100} align="center" fixed>
                                <HeaderCell>Name</HeaderCell>
                                <Cell dataKey="Player" />
                            </Column>

                            <Column width={100} flexGrow={1}>
                                <HeaderCell>POS</HeaderCell>
                                <Cell dataKey="Position" />
                            </Column>

                            <Column width={100} flexGrow={1}>
                                <HeaderCell>PTS</HeaderCell>
                                <Cell dataKey="PointPerSeason" />
                            </Column>

                            <Column width={100} flexGrow={1}>
                                <HeaderCell>AST</HeaderCell>
                                <Cell dataKey="AssistPerSeason" />
                            </Column>

                            <Column width={100} flexGrow={1}>
                                <HeaderCell>PF</HeaderCell>
                                <Cell dataKey="PersonalFoulPerSeason" />
                            </Column>
                            <Column width={100} flexGrow={1}>
                                <HeaderCell>EFG</HeaderCell>
                                <Cell dataKey="EFGPerSeason" />
                            </Column>
                        </Table>
                        <div style={{ padding: 20 }}>
                            <Pagination
                                prev
                                next
                                first
                                last
                                ellipsis
                                boundaryLinks
                                maxButtons={5}
                                size="xs"
                                layout={['total', '-', 'limit', '|', 'pager', 'skip']}
                                limit={10}
                            />
                        </div>
                    </div>

                    <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
                        <h3>Games</h3>

                        {/* <Table onRow={(record, rowIndex) => {
                            return {
                                onClick: event => { this.goToGame(record.Game_ID) },
                            };
                        }} data={this.state.gamesResults} > */}
                        <Table
                        bordered
                        cellBordered
                        height={420}
                        headerHeight={80}
                        data={this.state.gamesResults}
                        onRowClick={data => { this.goToGame(data.Game_ID) }}
                        >
                        <Column width={150} align="center" >
                        <HeaderCell>Game Date</HeaderCell>
                        <Cell dataKey="Game_Date" />
                        </Column>

                        <ColumnGroup header="HOME" align="center">

                        <Column width={130} flexGrow={1}>
                        <HeaderCell>Points</HeaderCell>
                        <Cell dataKey="Pts_Home" />
                        </Column>

                        <Column width={130} flexGrow={1}>
                        <HeaderCell>Name</HeaderCell>
                        <Cell dataKey="Home_Abbr" />
                        </Column>

                        </ColumnGroup>

                        <ColumnGroup header="AWAY" align="center">

                        <Column width={130} flexGrow={1}>
                        <HeaderCell>Name</HeaderCell>
                        <Cell dataKey="Away_abbr" />
                        </Column>

                        <Column width={130} flexGrow={1}>
                        <HeaderCell>Points</HeaderCell>
                        <Cell dataKey="Pts_Away" />
                        </Column>

                        </ColumnGroup>
                        </Table>
                    </div>
                </div>
            </CustomProvider>
        )
    }
}
export default Home
