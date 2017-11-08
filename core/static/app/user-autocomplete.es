import $ from 'jquery';
import React from 'react';
import ReactAutocomplete from 'react-autocomplete';


export default class UserAutocompleteInput extends React.Component {

	constructor (props) {
		super(props)
		this.state = {
			value: '',
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
			<div className="form-group">
				<label>Пользователь со счета которого нужно перевести деньги</label>
				<ReactAutocomplete
					items={this.state.users}
					getItemValue={item => item.pk.toString()}
					renderItem={(item, highlighted) =>
						<li key={item.pk}>
							<a href="#" onClick={(e) => {e.preventDefault()}}>{item.username} - {item.inn}</a>
						</li>
					}
					value={this.state.value}
					onChange={(event, value) => {
						this.setState({value})
						this.fetchUsers({query: value})
					}}
					onSelect={(value, item) => {
						this.setState({value: `${item.username} - ${item.inn}`})
						this.props.onSelect(value)
					}}
					inputProps={{className: "form-control"}}
					wrapperStyle={null}
					renderMenu={(items, value, style) =>
						<div className="dropdown">
							<ul className="dropdown-menu" style={{display:'block'}} children={items} />
						</div>
					}
				/>
			</div>
		)
	}
}
