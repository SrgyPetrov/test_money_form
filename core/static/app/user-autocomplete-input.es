import $ from 'jquery';
import React from 'react';
import ReactAutocomplete from 'react-autocomplete';


export default class UserAutocompleteInput extends React.Component {

	constructor (props) {
		super(props)
		this.state = {
			// value: '',
			users: []
		}
	}

	componentDidMount() {
		this.fetchUsers()
	}

	fetchUsers(params) {
		$.get(
			'/users/',
			params,
			(data) => {
				this.setState({
					users: data
				})
			}
		)
	}

	render() {
		return (
			<div className={this.props.error ? "form-group has-error" : "form-group"}>
				<label>Пользователь со счета которого нужно перевести деньги</label>
				<ReactAutocomplete
					items={this.state.users}
					getItemValue={item => item.pk.toString()}
					renderItem={(item, highlighted) =>
						<li key={item.pk}>
							<a href="#" onClick={(e) => {e.preventDefault()}}>{item.username} - {item.inn}</a>
						</li>
					}
					value={this.props.value}
					onChange={(event, value) => {
						this.props.onChange({value, pk: ""})
						this.fetchUsers({query: value})
					}}
					onSelect={(value, item) => {
						this.props.onChange({pk:value, value:`${item.username} - ${item.inn}`})
					}}
					inputProps={{className: "form-control"}}
					wrapperStyle={null}
					renderMenu={(items, value, style) =>
						<div className="dropdown">
							<ul className="dropdown-menu" style={{display:'block'}} children={items} />
						</div>
					}
				/>
				{this.props.error ? (
					<span className="help-block">{this.props.error}</span>
				) : (
					<span className="help-block">Начните вводить имя пользователя или ИНН</span>
				)}
			</div>
		)
	}
}
