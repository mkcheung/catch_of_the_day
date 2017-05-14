import React from 'react';
import AddFishForm from './AddFishForm';
import base from '../base';
;
class Inventory extends React.Component{

	constructor(){
		super();
		this.authenticate = this.authenticate.bind(this);
		this.logout = this.logout.bind(this);
		this.authHandler = this.authHandler.bind(this);
		this.renderInventory = this.renderInventory.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.renderLogin = this.renderLogin.bind(this);
		this.state = {
			uid:null,
			owner:null
		}
	}

	componentDidMount(){
		base.onAuth((user) => {
			if(user) {
				this.authHandler(null, { user });
			}
		});
	}

	handleChange(event, key){
		const fish = this.props.fishes[key];
		const updated = {
			...fish,
			[event.target.name]: event.target.value
		};
		this.props.updateFish(key, updated);
	}

	authenticate(provider){
		base.authWithOAuthPopup(provider, this.authHandler);
	}

	logout(){
		base.unauth();
		this.setState({uid:null});
	}

	authHandler(err, authData){
		if(err){
			console.error(err);
			return;
		}
		
		//get store info
		const storeRef = base.database().ref(this.props.storeId);

		//query database once for store data
		storeRef.once('value', (snapshot) => {
			const data = snapshot.val() || {} ;

			if(!data.owner){
				storeRef.set({
					owner: authData.user.uid
				});
			}

			this.setState({
				uid: authData.user.uid,
				owner: data.owner || authData.user.uid
			});
		});

	}

	renderLogin(){
		return (
			<nav className="login">
				<h2>Inventory</h2>
				<p>Sign in to view your store's Inventory</p>
				<button className="facebook" onClick={()=>this.authenticate('facebook')}>Log In With Facebook</button>
			</nav>
		)
	}

	renderInventory(key){
		const fish = this.props.fishes[key];
		return (
			<div className="fish-edit" key={key}>
				<input type="text" name="name" value={fish.name} placeholder="Fish name" onChange={(event)=>this.handleChange(event,key)}/>
				<input type="text" name="price" value={fish.price} placeholder="Fish price" onChange={(event)=>this.handleChange(event,key)}/>
				<select type="text" name="status" value={fish.status} placeholder="Fish status" onChange={(event)=>this.handleChange(event,key)}>
					<option value="available">Fresh!</option>
					<option value="unavailable">Sold Out!</option>
				</select>
				<textarea type="text" name="desc" value={fish.desc} placeholder="Fish desc" onChange={(event)=>this.handleChange(event,key)}>
				</textarea>
				<input type="text" name="image" value={fish.image} placeholder="Fish image" onChange={(event)=>this.handleChange(event,key)}/>
				<button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
			</div>
		)
	
	}

	render(){
		const logout = <button onClick={this.logout}>Log Out!</button>;
		//check if they are not logged in at all.
		if(!this.state.uid) {
			return <div>{this.renderLogin()}</div>
		}

		if(this.state.uid !== this.state.owner){
			return (
				<div>
					<p>Sorry you aren't the owner of this store!</p>
					{logout}
				</div>
			)
		}

		return(
			<div>
				<h2>Inventory</h2>
				{logout}
				{Object.keys(this.props.fishes).map(this.renderInventory)}
				<AddFishForm addFish={this.props.addFish}/>
				<button onClick={this.props.loadSamples}>Load Sample Fishes</button>
			</div>
		)
	}
}

Inventory.propTypes = {
	fishes: React.PropTypes.object.isRequired,
	addFish: React.PropTypes.func.isRequired,
	updateFish: React.PropTypes.func.isRequired,
	removeFish: React.PropTypes.func.isRequired,
	loadSamples: React.PropTypes.func.isRequired,
	storeId: React.PropTypes.string.isRequired
}

export default Inventory;