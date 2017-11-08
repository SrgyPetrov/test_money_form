import React from 'react';


export default class RecipientsInput extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			value: '',
			items: []
		}
		this.addValue = this.addValue.bind(this);
		this.removeValue = this.removeValue.bind(this);
	}

	addValue() {
		let items = this.state.items
		items.push(this.state.value)
		this.updateItems(items)
	}

	removeValue(item, e) {
		let items = this.state.items
		let index = items.indexOf(item)
		if (index !== -1) {
			items.splice(index, 1);
		}
		this.updateItems(items)
	}

	updateItems(items) {
		this.setState({
			items: items,
			value: ''
		})
		this.props.onChange(items)
	}

	render() {
		return (
			<div className="form-group">
				<label>ИНН пользователей, на счета которых будут переведены деньги</label>
				<div className="input-group">
					<input type="number" className="form-control" value={this.state.value} onChange={(e) => this.setState({value: e.target.value})} />
					<span className="input-group-btn">
						<button className="btn btn-default" type="button" onClick={this.addValue}>+</button>
					</span>
				</div>
				{this.state.items.length > 0 &&
					<span className="help-block">Нажмите на ИНН чтобы удалить его</span>
				}
				<div className='added-items'>
					{this.state.items.map((item, index) => (
						<span key={index} onClick={this.removeValue.bind(this, item)} className="label label-default" style={{marginRight: "3px", cursor:"pointer"}}>{item}</span>
					))}
				</div>
			</div>
		)
	}
}
