import React from 'react';
import { getFunName } from '../helpers';
import { render } from 'react-dom';

class StorePicker extends React.Component {
	constructor(){
		super();
		this.goToStore = this.goToStore.bind(this);
	}

	goToStore(event){
		event.preventDefault();

		console.log("you changed the url");
		// first grab the text from the box
		const storeId = this.storeInput.value;
		console.log(`Going to ${storeId}`);
		this.context.router.transitionTo(`store/${storeId}`);
		// second we're going to transition from / to /store/:storeId
	}

	render(){
		return (
			<form className="store-selector" onSubmit={this.goToStore}>
				{ /* Hello */ }
				<h2>Please Enter A Store</h2>
				<input type="text" required placeholder="Store Name" defaultValue={getFunName()} ref={(input) => { this.storeInput = input} }/>
				<button type="submit">Visit Store -></button>
			</form>
		)
	}
}

StorePicker.contextTypes = {
	router: React.PropTypes.object
}

export default StorePicker;