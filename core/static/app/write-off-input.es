import React from 'react';


export default class WriteOffInput extends React.Component {
	render() {
		return (
			<div className="form-group">
				<label>Сумма перевода</label>
				<input type="number" className="form-control" value={this.props.value} step="0.1" onChange={(e) => this.props.onChange(e.target.value)} />
			</div>
		)
	}
}
