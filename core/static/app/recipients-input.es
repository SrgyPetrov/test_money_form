import React from 'react';


export default class RecipientsInput extends React.Component {

	constructor(props) {
		super(props)
		this.addValue = this.addValue.bind(this);
		this.removeValue = this.removeValue.bind(this);
	}

	addValue() {
		let items = this.props.items
		if (!(items.includes(this.props.value))) {
			items.push(this.props.value)
			this.props.onChange(items)
			this.props.onChangeValue("")
		}
	}

	removeValue(item, e) {
		let items = this.props.items
		let index = items.indexOf(item)
		if (index !== -1) {
			items.splice(index, 1);
		}
		this.props.onChange(items)
	}

	render() {
		return (
			<div className={this.props.error ? "form-group has-error" : "form-group"}>
				<label>ИНН пользователей, на счета которых будут переведены деньги</label>
				<div className="input-group">
					<input type="number" className="form-control" value={this.props.value} onChange={(e) => this.props.onChangeValue(e.target.value)} />
					<span className="input-group-btn">
						<button className="btn btn-default" type="button" onClick={this.addValue}>+</button>
					</span>
				</div>
				{this.props.error ? (
					<span className="help-block">{this.props.error}</span>
				) : (
					this.props.items.length > 0 && <span className="help-block">Нажмите на ИНН чтобы удалить его</span>
				)}
				<div className='added-items'>
					{this.props.items.map((item, index) => (
						<span key={index} onClick={this.removeValue.bind(this, item)} className="label label-default" style={{marginRight: "3px", cursor:"pointer"}}>{item}</span>
					))}
				</div>
			</div>
		)
	}
}
