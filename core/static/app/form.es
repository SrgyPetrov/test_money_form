import $ from 'jquery';
import React from 'react';

import UserAutocompleteInput from './user-autocomplete-input'
import AmountInput from './amount-input'
import RecipientsInput from './recipients-input'


export default class UsersForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.createInitialState()
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	createInitialState() {
		return {
			user: '',
			user_val: '',
			amount: 0,
			recipients: [],
			errors: {
				user: null,
				recipients: null,
				amount: null
			},
			success: false
		}
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
					this.setState(this.createInitialState())
					this.displaySuccessMessage()

				}
			}
		});
	}

	displaySuccessMessage() {
		this.setState({success:true})
		setTimeout(() => {this.setState({success:false})}, 7000)
	}

	render() {
		return (
			<div className="col-md-6">
				<div className="page-header text-center">
					<h2>Форма для перевода денег</h2>
				</div>
				{this.state.success &&
					<div className="alert alert-success">Перевод успешно завершен</div>
				}
				<form onSubmit={this.handleSubmit}>
					<UserAutocompleteInput onChange={(item) => this.setState({user:item.pk, user_val:item.value})} error={this.state.errors.user} value={this.state.user_val} />
					<RecipientsInput onChange={(value) => this.setState({recipients:value})} error={this.state.errors.recipients} items={this.state.recipients} />
					<AmountInput onChange={(value) => this.setState({amount:value})} value={this.state.amount} error={this.state.errors.amount} />
					<button type="submit" className="btn btn-default">Сделать перевод</button>
				</form>
			</div>
		);
	}
}

