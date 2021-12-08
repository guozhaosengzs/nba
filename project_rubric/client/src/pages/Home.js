import React from 'react';

import { Pagination } from 'rsuite';
import { Table, Column, HeaderCell, Cell } from 'rsuite-table';

import TopNav from '../components/TopNav';
import { getAllPlayersAvg, getAllGames} from '../fetcher'


// const { Column, ColumnGroup } = Table;

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
            <div>
                <TopNav />
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

                    {/* <Table dataSource={this.state.playersResults} columns={playerColumns} pagination={{ pageSizeOptions: [5, 10], defaultPageSize: 5, showQuickJumper: true }} /> */}
                </div>


            </div>
        )
    }
}
export default Home
