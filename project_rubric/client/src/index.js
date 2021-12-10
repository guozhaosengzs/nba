import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Route,
	Routes 
} from 'react-router-dom';

import Home from './pages/Home';
// import Players from './pages/Players';
// import Games from './pages/Games';
import Facts from './pages/Facts';

import 'rsuite/dist/rsuite.min.css';


ReactDOM.render(
	<div>
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />

				<Route path="/facts" element={<Facts />} />
			</Routes>
		</Router>
	</div>,
	document.getElementById('root')
);