import React from 'react';
import {
  Table,
  Pagination,
  Select
} from 'antd'

import MenuBar from '../components/MenuBar';
import { getAllMatches, getAllPlayers } from '../fetcher'
const { Column, ColumnGroup } = Table;
const { Option } = Select;


const playerColumns = [
  {
    title: 'Name',
    dataIndex: 'Name',
    key: 'Name',
    sorter: (a, b) => a.Name.localeCompare(b.Name),
    render: (text, row) => <a href={`/players?id=${row.PlayerId}`}>{text}</a>
  },
  {
    title: 'Nationality',
    dataIndex: 'Nationality',
    key: 'Nationality',
    sorter: (a, b) => a.Nationality.localeCompare(b.Nationality)
  },
  {
    title: 'Rating',
    dataIndex: 'Rating',
    key: 'Rating',
    sorter: (a, b) => a.Rating - b.Rating
    
  },
  // TASK 7: add a column for Potential, with the ability to (numerically) sort ,
  // TASK 8: add a column for Club, with the ability to (alphabetically) sort 
  // TASK 9: add a column for Value - no sorting required
{title: 'Potential',
  dataIndex: 'Potential',
  key: 'Potential',
  sorter: (a, b) => a.Potential - b.Potential
},
{title: 'Club',
  dataIndex: 'Club',
  key: 'Club',
  sorter: (a, b) => a.Club.localeCompare(b.Club)
},  
{title: 'Value',
dataIndex: 'Value',
key: 'Value'
}
];

class HomePage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      matchesResults: [],
      matchesPageNumber: 1,
      matchesPageSize: 10,
      playersResults: [],
      pagination: null  
    }

    this.leagueOnChange = this.leagueOnChange.bind(this)
    this.goToMatch = this.goToMatch.bind(this)
  }


  goToMatch(matchId) {
    window.location = `/matches?id=${matchId}`
  }

  leagueOnChange(value) {
    // TASK 2: this value should be used as a parameter to call getAllMatches in fetcher.js with the parameters page and pageSize set to null
    // then, matchesResults in state should be set to the results returned - see a similar function call in componentDidMount()
    getAllMatches(null, null, value).then(res => 
      {
      this.setState({matchesResults:res.results})
    }
    )
  }

  componentDidMount() {
    getAllMatches(null, null, 'D1').then(res => {
      this.setState({ matchesResults: res.results })
    })

    getAllPlayers().then(res => {
      console.log(res.results)
      // TASK 1: set the correct state attribute to res.results
      this.setState({playersResults:res.results})
    })

 
  }


  render() {

    return (
      <div>
        <MenuBar />
        <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
          <h3>Players</h3>
          <Table dataSource={this.state.playersResults} columns={playerColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
        </div>
        <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
          <h3>Matches</h3>
          <Select defaultValue="D1" style={{ width: 120 }} onChange={this.leagueOnChange}>
            <Option value="D1">Bundesliga</Option>
             {/* TASK 3: Take a look at Dataset Information.md from MS1 and add other options to the selector here  */}
             <Option value="F1">Ligue 1</Option>
             <Option value="I1">Serie A</Option>
             <Option value="E0">Premier League</Option>
          </Select>
          
          <Table onRow={(record, rowIndex) => {
    return {
      onClick: event => {this.goToMatch(record.MatchId)}, // clicking a row takes the user to a detailed view of the match in the /matches page using the MatchId parameter  
    };
  }} dataSource={this.state.matchesResults} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}>
            <ColumnGroup title="Teams">
              {/* TASK 4: correct the title for the 'Home' column and add a similar column for 'Away' team in this ColumnGroup */}
              <Column title="Home" dataIndex="Home" key="Home" sorter= {(a, b) => a.Home.localeCompare(b.Home)}/>
              <Column title="Away" dataIndex="Away" key="Away" sorter= {(a, b) => a.Away.localeCompare(b.Away)}/>
            </ColumnGroup>
            <ColumnGroup title="Goals">
              {/* TASK 5: add columns for home and away goals in this ColumnGroup, with the ability to sort values in these columns numerically */}
              <Column title="HomeGoals" dataIndex="HomeGoals" key="HomeGoals" sorter= {(a, b) => a.HomeGoals-b.HomeGoals}/>
              <Column title="AwayGoals" dataIndex="AwayGoals" key="AwayGoals" sorter= {(a, b) => a.AwayGoals-b.AwayGoals}/>
            </ColumnGroup>
             {/* TASK 6: create two columns (independent - not in a column group) for the date and time. Do not add a sorting functionality */}
             <Column title="Date" dataIndex="Date" key="Date"/>
             <Column title="Time" dataIndex="Time" key="Time"/>
          </Table>

        </div>


      </div>
    )
  }

}

export default HomePage

