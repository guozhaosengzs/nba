import React from "react";

import { Pagination, CustomProvider } from "rsuite";
import { Table, Column, ColumnGroup, HeaderCell, Cell } from "rsuite-table";

import TopNav from "../components/TopNav";
import ColumnSort from "../components/ColumnSort";
import { getAllPlayersAvg, getAllGames } from "../fetcher";

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gamesResults: [],
      gamesPageNumber: 1,
      gamesPageSize: 10,
      playersResults: [],
      pagination: null,
      playerPage: 1,
      playerLimit: 10,
      playerLoad: true,
      playerSortType: null,
      playerSortColumn: null,
      gamePage: 1,
      gameLimit: 10,
      gameLoad: true,
      gameSortType: null,
      gameSortColumn: null
    };

    this.goToGame = this.goToGame.bind(this);
  }

  goToGame(Game_ID) {
    window.location = `/game?id=${Game_ID}`;
  }

  componentDidMount() {
    getAllPlayersAvg().then(res => {
      this.setState({ playersResults: res.results });
      this.setState({ playerLoad: false });
    });

    getAllGames().then(res => {
      this.setState({ gamesResults: res.results });
      this.setState({ gameLoad: false });
    });
  }

  render() {
    return (
      <CustomProvider theme={"dark"}>
        <div>
          <TopNav />
          <div style={{ width: "70vw", margin: "0 auto", marginTop: "5vh" }}>
            <h2>Welcome to the NBA Database</h2>
            <h4>
              Here you can look for information about players, teams, and
              matches throughout the history of NBA - good luck exploring!{" "}
            </h4>
          </div>

          <div style={{ width: "70vw", margin: "0 auto", marginTop: "5vh" }}>
            <h3>Player Stats (Average per Season)</h3>
            <br></br>
            <Table
              bordered
              cellBordered
              height={460}
              headerHeight={40}
              data={this.state.playersResults.filter(
                (_, i) =>
                  i >= this.state.playerLimit * (this.state.playerPage - 1) &&
                  i < this.state.playerLimit * this.state.playerPage
              )}
              loading={this.state.playerLoad}
              sortColumn={this.state.playerSortColumn}
              sortType={this.state.playerSortType}
              onSortColumn={(sortColumn, sortType) => {
                this.setState({ playerLoad: true });

                this.state.playersResults.sort((a, b) => {
                  let x = a[sortColumn];
                  let y = b[sortColumn];

                  return ColumnSort(x, y, sortType);
                });

                setTimeout(() => {
                  this.setState({ playerSortType: sortType });
                  this.setState({ playerSortColumn: sortColumn });
                  this.setState({ playerLoad: false });
                }, 500);
              }}
            >
              <Column width={100} align="center" fixed flexGrow={1} sortable>
                <HeaderCell>Name</HeaderCell>
                <Cell dataKey="Player" />
              </Column>

              <Column width={100} flexGrow={1} sortable>
                <HeaderCell>Position</HeaderCell>
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
                limit={this.state.playerLimit}
                limitOptions={[10, 25, 50]}
                total={this.state.playersResults.length}
                activePage={this.state.playerPage}
                onChangePage={p => this.setState({ playerPage: p })}
                onChangeLimit={dataKey => {
                  this.setState({ playerPage: 1 });
                  this.setState({ playerLimit: dataKey });
                }}
              />
            </div>
          </div>

          <div style={{ width: "70vw", margin: "0 auto", marginTop: "5vh" }}>
            <h3>Games (2017 Season)</h3>
            <br></br>
            <Table
              bordered
              cellBordered
              height={420}
              headerHeight={80}
              data={this.state.gamesResults.filter(
                (_, i) =>
                  i >= this.state.gameLimit * (this.state.gamePage - 1) &&
                  i < this.state.gameLimit * this.state.gamePage
              )}
              loading={this.state.gameLoad}
              sortColumn={this.state.gameSortColumn}
              sortType={this.state.gameSortType}
              onSortColumn={(sortColumn, sortType) => {
                this.setState({ gameLoad: true });

                this.state.gamesResults.sort((a, b) => {
                  let x = a[sortColumn];
                  let y = b[sortColumn];

                  return ColumnSort(x, y, sortType);
                });

                setTimeout(() => {
                  this.setState({ gameSortType: sortType });
                  this.setState({ gameSortColumn: sortColumn });
                  this.setState({ gameLoad: false });
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
                limit={this.state.gameLimit}
                limitOptions={[10, 25, 50]}
                total={this.state.gamesResults.length}
                activePage={this.state.gamePage}
                onChangePage={p => this.setState({ gamePage: p })}
                onChangeLimit={dataKey => {
                  this.setState({ gamePage: 1 });
                  this.setState({ gameLimit: dataKey });
                }}
              />
            </div>
          </div>
        </div>
        <div style={{ padding: 50 }}>
        </div>
      </CustomProvider>
    );
  }
}
export default Home;
