// let's go!
import React from 'react';
import { render } from 'react-dom';
import './css/style.css';
import App from './components/App';
import StorePicker from './components/StorePicker';
import NotFound from './components/NotFound';
import { BrowserRouter, Match, Miss } from 'react-router';

const Root = () => {
	return(
		<BrowserRouter>
			<div>
				<Match exactly pattern="/" component={StorePicker} />
				<Match pattern="/store/:storeId" component={App} />
				<Miss component={NotFound} />
			</div>
		</BrowserRouter>
	)
}

// render(<App/>, document.querySelector('#main'));
render(<Root/>, document.querySelector('#main'));