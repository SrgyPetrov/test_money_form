import React from 'react';


export default class AmountInput extends React.Component {
	render() {
		return (
			<div className={this.props.error ? "form-group has-error" : "form-group"}>
				<label>Сумма перевода</label>
				<input type="number" className="form-control" value={this.props.value} step="0.01" onChange={(e) => this.props.onChange(e.target.value)} />
				{this.props.error && <span className="help-block">{this.props.error}</span>}
			</div>
		)
	}
}
