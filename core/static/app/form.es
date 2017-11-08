import React from 'react';

import UserAutocompleteInput from './user-autocomplete'


export default class UsersForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user_id: ''
		}

		// this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	// handleChange(event) {
	// this.setState({value: event.target.value});
	// }

	handleSubmit(event) {
		alert('User id: ' + this.state.user);
		event.preventDefault();
	}

	render() {
		return (
			<div className="col-md-6">
				<div className="page-header">
					<h2>Форма для перевода денег</h2>
				</div>
				<form onSubmit={this.handleSubmit}>
					<UserAutocompleteInput onSelect={(value) => this.setState({user:value})} />
					<button type="submit" className="btn btn-default">Совершить перевод</button>
				</form>
			</div>
		);
	}
}

