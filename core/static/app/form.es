import $ from 'jquery';
import React from 'react';

import UserAutocompleteInput from './user-autocomplete-input'
import AmountInput from './amount-input'
import RecipientsInput from './recipients-input'


export default class UsersForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user: '',
			amount: 0,
			recipients: [],
			errors: {
				user: null,
				recipients: null,
				amount: null
			}
		}
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(event) {
		event.preventDefault();
		$.ajax({
			type: 'POST',
			url: '/users/transfer/',
			data: JSON.stringify({
				user: this.state.user,
				amount: this.state.amount,
				recipients: this.state.recipients
			}),
			contentType: "application/json",
			dataType: 'json',
			success: (data) => {
				if (data.errors) {
					this.setState({errors: data.errors})
				} else {
					this.setState({errors: {
						user: null,
						recipients: null,
						amount: null
					}})
				}
				console.log(data)
			}
		});
	}

	render() {
		return (
			<div className="col-md-6">
				<div className="page-header text-center">
					<h2>Форма для перевода денег</h2>
				</div>
				<form onSubmit={this.handleSubmit}>
					<UserAutocompleteInput onSelect={(value) => this.setState({user:value})} error={this.state.errors.user}/>
					<RecipientsInput onChange={(value) => this.setState({recipients:value})} error={this.state.errors.recipients}/>
					<AmountInput onChange={(value) => this.setState({amount:value})} value={this.state.amount} error={this.state.errors.amount}/>
					<button type="submit" className="btn btn-default">Совершить перевод</button>
				</form>
			</div>
		);
	}
}

