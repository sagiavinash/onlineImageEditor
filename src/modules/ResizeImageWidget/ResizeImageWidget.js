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
            <section className="tool-panel__widget">
                <div className="tool-panel__header">
                    <p className="tool-panel__title">Resize Image</p>
                </div>
                <div className="tool-panel__body">
                    <div className="dimensions" className="cf">
                        <DimensionInput datapoint="width" onUserInput={this.DimValueChanged} value={dimensions.width} />
                        <span className="dimensions__input-seperator">,</span>
                        <DimensionInput datapoint="height" onUserInput={this.DimValueChanged} value={dimensions.height} />
                    </div>
                    <div className="aspect-ratio">
                        <input ref="aspectRatioInput" id="aspect-ratio__input" onChange={this.aspectRatioChanged} type="checkbox" checked={isRatioFixed} />
                        <label htmlFor="aspect-ratio__input">Fix Aspect Ratio</label>
                    </div>
                </div>
            </section>
        );
    }
});

module.exports = ResizeImageWidget;