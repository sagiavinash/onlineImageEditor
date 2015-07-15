/** @jsx React.DOM */

var DimensionInput = require("../DimensionInput/DimensionInput");

var ResizeImageWidget = React.createClass({
    "DimValueChanged" : function(datapoint, value) {
        var inputs = {};
        inputs[datapoint] = value;
        inputs.category = "imageResize";
        this.props.onUserInput(inputs);
    },
    "aspectRatioChanged" : function() {
        var values = this.props.state.values,
            inputs = {};

        inputs.isRatioFixed = this.refs.aspectRatioInput.getDOMNode().checked;
        if (inputs.isRatioFixed) {
            inputs.width = values.width;
        }
        inputs.category = "imageResize";
        // console.log("isRatioFixedChanged", change);
        this.props.onUserInput(inputs);
    },
    "render" : function() {
        var dimensions = this.props.dimensions,
            isRatioFixed = this.props.isRatioFixed;
        return (
            <section className="tool-panel-widget">
                <div className="tool-panel-header">
                    <p className="tool-panel-title">Resize Image</p>
                </div>
                <div className="tool-panel-body">
                    <div id="dimensions" className="cf">
                        <DimensionInput datapoint="width" onUserInput={this.DimValueChanged} value={dimensions.width} />
                        <span className="input-seperator">,</span>
                        <DimensionInput datapoint="height" onUserInput={this.DimValueChanged} value={dimensions.height} />
                    </div>
                    <div id="set-aspect-ratio-wrap">
                        <input ref="aspectRatioInput" id="set-aspect-ratio" onChange={this.aspectRatioChanged} type="checkbox" checked={isRatioFixed} />
                        <label htmlFor="set-aspect-ratio">Fix Aspect Ratio</label>
                    </div>
                </div>
            </section>
        );
    }
});

module.exports = ResizeImageWidget;