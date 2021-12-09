import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Route,
	Routes 
} from 'react-router-dom';

import Home from './pages/Home';
import Players from './pages/Players';
// import Games from './pages/Games';
// import Facts from './pages/Facts';

import 'rsuite/dist/rsuite.min.css';


ReactDOM.render(
	<div>
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />

				{/* <Route exact
					path="/"
					render={() => (
						<Home />
					)} /> */}
				{/* <Route exact
					path="/players"
					render={() => (
						<Players />
					)} />
				<Route exact
					path="/games"
					render={() => (
						<Games />
					)} />
				<Route exact
					path="/facts"
					render={() => (
						<Facts />
					)} /> */}
			</Routes>
		</Router>
	</div>,
	document.getElementById('root')
);