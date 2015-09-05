/** @jsx React.DOM */

var DimensionInput = React.createClass({
    "handleChange" : function() {
        var datapoint = this.props.datapoint,
            value = this.refs.input.getDOMNode().value;
        this.props.onUserInput(datapoint, value);
    },
    "render" : function() {
        var label = this.props.datapoint.charAt(0).toUpperCase() + this.props.datapoint.slice(1) + " :",
            inputId = "set-" + this.props.datapoint,
            value = this.props.value;
        return (
            <div className="input-widget cf">
                <span className="input-widget__label">{label}</span>
                <input id={inputId} ref="input" onChange={this.handleChange} className="input-widget__value" type="text" value={value} />
                <span className="input-widget__unit">px</span>
            </div>
        );
    }
});

module.exports = DimensionInput;