import React from 'react';
import { Form, FormInput, FormGroup, Button, Card, CardBody, CardTitle, Progress } from "shards-react";


import {
    Table,
    Pagination,
    Row,
    Col,
    Divider,

} from 'antd'

import { getMatchSearch, getMatch } from '../fetcher'


import MenuBar from '../components/MenuBar';

const { Column, ColumnGroup } = Table;


class MatchesPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            awayQuery: "",
            homeQuery: "",
            matchesResults: [],
            selectedMatchId: window.location.search ? window.location.search.substring(1).split('=')[1] : 0,
            selectedMatchDetails: null

        }

        this.handleAwayQueryChange = this.handleAwayQueryChange.bind(this)
        this.handleHomeQueryChange = this.handleHomeQueryChange.bind(this)
        this.updateSearchResults = this.updateSearchResults.bind(this)
        this.goToMatch = this.goToMatch.bind(this)

    }



    handleAwayQueryChange(event) {
        this.setState({ awayQuery: event.target.value })
    }

    handleHomeQueryChange(event) {
        // TASK 10: update state variables appropriately. See handleAwayQueryChange(event) for reference
    this.setState({homeQuery:event.target.value})
    }
    goToMatch(matchId) {
        window.location = `/matches?id=${matchId}`
    }

    updateSearchResults() {
        //TASK 11: call getMatchSearch and update matchesResults in state. See componentDidMount() for a hint
        getMatchSearch(this.state.homeQuery, this.state.awayQuery, null, null).then(res => 
            {
            this.setState({matchesResults:res.results})
        })
    }

    componentDidMount() {
        getMatchSearch(this.state.homeQuery, this.state.awayQuery, null, null).then(res => {
            this.setState({ matchesResults: res.results })
        })

        getMatch(this.state.selectedMatchId).then(res => {
            this.setState({ selectedMatchDetails: res.results[0] })
        })




    }

    render() {
        return (
            <div>
                <MenuBar />
                <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
                    <Row>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Home Team</label>
                            <FormInput placeholder="Home Team" value={this.state.homeQuery} onChange={this.handleHomeQueryChange} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Away Team</label>
                            <FormInput placeholder="Away Team" value={this.state.awayQuery} onChange={this.handleAwayQueryChange} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                            <Button style={{ marginTop: '4vh' }} onClick={this.updateSearchResults}>Search</Button>
                        </FormGroup></Col>

                    </Row>


                </Form>
                <Divider />
                {/* TASK 12: Copy over your implementation of the matches table from the home page */}
                <Table onRow={(record, rowIndex) => {
                    return {
                        onClick: event => {this.goToMatch(record.MatchId)},
                    };}} dataSource={this.state.matchesResults} pagination={{pageSizeOptions:[10, 20], defaultPageSize:10, showQuickJumper:true}}>
                        <ColumnGroup title="Teams">
                            <Column title="Home" dataIndex="Home" key="Home" sorter= {(a, b) => a.Home.localeCompare(b.Home)}/>
                            <Column title="Away" dataIndex="Away" key="Away" sorter= {(a, b) => a.Away.localeCompare(b.Away)}/>
                        </ColumnGroup>
                        <ColumnGroup title="Goals">
                            <Column title="HomeGoals" dataIndex="HomeGoals" key="HomeGoals" sorter= {(a, b) => a.HomeGoals-b.HomeGoals}/>
                            <Column title="AwayGoals" dataIndex="AwayGoals" key="AwayGoals" sorter= {(a, b) => a.AwayGoals-b.AwayGoals}/>
                        </ColumnGroup>
                        <Column title="Date" dataIndex="Date" key="Date"/>
                        <Column title="Time" dataIndex="Time" key="Time"/>
                </Table>                
                <Divider />
                {this.state.selectedMatchDetails ? <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
                    <Card>
                        <CardBody>


                            <Row gutter='30' align='middle' justify='center'>
                                <Col flex={2} style={{ textAlign: 'left' }}>
                                    <CardTitle>{this.state.selectedMatchDetails.Home}</CardTitle>

                                </Col>
                                <Col flex={2} style={{ textAlign: 'center' }}>
                                    {this.state.selectedMatchDetails.Date} at {this.state.selectedMatchDetails.Time}
                                </Col>
                                {/* TASK 13: Add a column with flex = 2, and text alignment = right to display the name of the away team - similar to column 1 in this row */}
                                <Col flex={2} style={{textAlign:'right'}}>
                                    <CardTitle>{this.state.selectedMatchDetails.Away}</CardTitle>
                                </Col>
                            </Row>
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                    <h3>{this.state.selectedMatchDetails.HomeGoals}</h3>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' }}>
                                    Goals
                                </Col >
                                {/* TASK 14: Add a column with span = 9, and text alignment = right to display the # of goals the away team scored - similar 1 in this row */}
                                <Col span={9} style={{ textAlign:'right'}}>
                                    <h3>{this.state.selectedMatchDetails.AwayGoals}</h3>
                                </Col>
                     
                            </Row>
                            {/* TASK 15: create a row for goals at half time similar to the row for 'Goals' above, but use h5 in place of h3!  */}
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                    <h5>{this.state.selectedMatchDetails.HTHomeGoals}</h5>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' }}>
                                    Goals at Half Time
                                </Col >
                                <Col span={9} style={{ textAlign: 'right' }}>
                                    <h5>{this.state.selectedMatchDetails.HTAwayGoals}</h5>
                                </Col >
                            </Row>
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                <Progress value={this.state.selectedMatchDetails.ShotsOnTargetHome * 100 / this.state.selectedMatchDetails.ShotsHome}>{this.state.selectedMatchDetails.ShotsOnTargetHome} / {this.state.selectedMatchDetails.ShotsHome}</Progress>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' }}>
                                    Shot Accuracy
                                </Col >
                                <Col span={9} style={{ textAlign: 'right' }}>
                                    {/* TASK 18: add a progress bar to display the shot accuracy for the away team -  look at the progress bar in column 1 of this row for reference*/}
                                <Progress value={this.state.selectedMatchDetails.ShotsOnTargetAway * 100 / this.state.selectedMatchDetails.ShotsAway}>{this.state.selectedMatchDetails.ShotsOnTargetAway} / {this.state.selectedMatchDetails.ShotsAway}</Progress>
                                </Col>
                            </Row>
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                    <h5>{this.state.selectedMatchDetails.CornersHome}</h5>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' }}>
                                    Corners
                                </Col >
                                <Col span={9} style={{ textAlign: 'right' }}>
                                    <h5>{this.state.selectedMatchDetails.CornersAway}</h5>
                                </Col>
                            </Row>
                            {/* TASK 16: add a row for fouls cards - check out the above lines for how we did it for corners */}
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                    <h5>{this.state.selectedMatchDetails.FoulsHome}</h5>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' }}>
                                    Fouls
                                </Col >
                                <Col span={9} style={{ textAlign: 'right' }}>
                                    <h5>{this.state.selectedMatchDetails.FoulsAway}</h5>
                                </Col>
                            </Row>
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                    <h5>{this.state.selectedMatchDetails.RCHome}</h5>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' }}>
                                    Red Cards
                                </Col >
                                <Col span={9} style={{ textAlign: 'right' }}>
                                    <h5>{this.state.selectedMatchDetails.RCAway}</h5>
                                </Col>
                            </Row>
                            {/* TASK 17: add a row for yellow cards - check out the above lines for how we did it for red cards */}
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                    <h5>{this.state.selectedMatchDetails.YCHome}</h5>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' }}>
                                    Yello Cards
                                </Col >
                                <Col span={9} style={{ textAlign: 'right' }}>
                                    <h5>{this.state.selectedMatchDetails.YCAway}</h5>
                                </Col>
                            </Row>

                        </CardBody>
                    </Card>
                    
                </div> : null}
                <Divider />

            </div>
        )
    }
}

export default MatchesPage

