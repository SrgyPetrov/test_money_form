import React from 'react';

import UserAutocompleteInput from './user-autocomplete-input'
import WriteOffInput from './write-off-input'
import RecipientsInput from './recipients-input'


export default class UsersForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user_id: '',
			write_off: 0,
			recipients: []
		}
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(event) {
		alert('User id: ' + this.state.user_id);
		alert('Write off: ' + this.state.write_off);
		alert('Recipients: ' + this.state.recipients);
		event.preventDefault();
	}

	render() {
		return (
			<div className="col-md-6">
				<div className="page-header text-center">
					<h2>Форма для перевода денег</h2>
				</div>
				<form onSubmit={this.handleSubmit}>
					<UserAutocompleteInput onSelect={(value) => this.setState({user_id:value})} />
					<RecipientsInput onChange={(value) => this.setState({recipients:value})} />
					<WriteOffInput onChange={(value) => this.setState({write_off:value})} value={this.state.write_off}/>
					<button type="submit" className="btn btn-default">Совершить перевод</button>
				</form>
			</div>
		);
	}
}

