/** @jsx React.DOM */

var AddImageOffsetsWidget = React.createClass({
    "handleChange" : function() {
        var inputs = {
            "top" : parseInt(this.refs.top.getDOMNode().value || 0, 10),
            "left" : parseInt(this.refs.left.getDOMNode().value || 0, 10),
            "right" : parseInt(this.refs.right.getDOMNode().value || 0, 10),
            "bottom" : parseInt(this.refs.bottom.getDOMNode().value || 0, 10),
        };

        this.setState(inputs);
    },
    "handleInput" : function(e) {
        var inputs = {
            "top" : parseInt(this.refs.top.getDOMNode().value || 0, 10),
            "left" : parseInt(this.refs.left.getDOMNode().value || 0, 10),
            "right" : parseInt(this.refs.right.getDOMNode().value || 0, 10),
            "bottom" : parseInt(this.refs.bottom.getDOMNode().value || 0, 10),
        };
           
        if (e.key === 'Enter') {
            inputs.category = "addOffsets";
            this.props.onUserInput(inputs);
            this.setState({
                "top" : 0,
                "left" : 0,
                "right" : 0,
                "bottom" : 0
            });
        }
    },
    "getInitialState" : function() {
        return {
            "top" : 0,
            "left" : 0,
            "right" : 0,
            "bottom" : 0
        };
    },
    "render" : function() {
        var offsets = this.props.offsets;
        return (
            <section className="tool-panel__widget offsets-widget">
                <div className="tool-panel__header">
                    <p className="tool-panel__title">Cropping / Padding</p>
                </div>
                <div className="tool-panel__body">
                    <form className="cf">
                        <div className="offsets-widget__layout border-box">
                            <div className="offsets-widget__layout-inner border-box">
                                <input type="text" ref="top" className="offsets-widget__layout-input offsets-widget__layout-input--top" onChange={this.handleChange} onKeyDown={this.handleInput} value={this.state.top}/>
                                <br />
                                <input type="text" ref="left" className="offsets-widget__layout-input offsets-widget__layout-input--left" onChange={this.handleChange} onKeyDown={this.handleInput} value={this.state.left}/>
                                <div className="offsets-widget__layout-content border-box"></div>
                                <input type="text" ref="right" className="offsets-widget__layout-input offsets-widget__layout-input--right" onChange={this.handleChange} onKeyDown={this.handleInput} value={this.state.right}/>
                                <br />
                                <input type="text" ref="bottom" className="offsets-widget__layout-input offsets-widget__layout-input--bottom" onChange={this.handleChange} onKeyDown={this.handleInput} value={this.state.bottom}/>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        );
    }
});

module.exports = AddImageOffsetsWidget;