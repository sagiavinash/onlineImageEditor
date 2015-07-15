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
            <section id="edit-canvas-widget" className="tool-panel-widget">
                <div className="tool-panel-header">
                    <p className="tool-panel-title">Cropping / Padding</p>
                </div>
                <div className="tool-panel-body">
                    <form className="cf" onBlur={this.handleInput}>
                        <div className="canvas-layout border-box">
                            <div className="editing border-box">
                                <input type="text" ref="top" className="top" onChange={this.handleChange} onKeyDown={this.handleInput} value={this.state.top}/>
                                <br />
                                <input type="text" ref="left" className="left" onChange={this.handleChange} onKeyDown={this.handleInput} value={this.state.left}/>
                                <div className="content border-box"></div>
                                <input type="text" ref="right" className="right" onChange={this.handleChange} onKeyDown={this.handleInput} value={this.state.right}/>
                                <br />
                                <input type="text" ref="bottom" className="bottom" onChange={this.handleChange} onKeyDown={this.handleInput} value={this.state.bottom}/>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        );
    }
});

module.exports = AddImageOffsetsWidget;