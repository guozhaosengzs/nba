import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';

import Home from './pages/HomePage';
// import Players from './pages/PlayersPage';
// import Matches from './pages/MatchesPage';
// import Facts from './pages/facts';

import '~rsuite/dist/rsuite.min.css';


ReactDOM.render(
  <div>
    <Router>
      <Switch>
        <Route exact
							path="/"
							render={() => (
								<HomePage />
							)}/>
        {/* <Route exact
							path="/players"
							render={() => (
								<PlayersPage />
							)}/>
        <Route exact
							path="/matches"
							render={() => (
								<MatchesPage />
							)}/> */}
      </Switch>
    </Router>
  </div>,
  document.getElementById('root')
);