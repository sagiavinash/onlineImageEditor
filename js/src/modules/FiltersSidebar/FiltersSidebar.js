/** @jsx React.DOM */

var OriginalDimensionsWidget = require("../OriginalDimensionsWidget/OriginalDimensionsWidget"),
    ResizeImageWidget = require("../ResizeImageWidget/ResizeImageWidget"),
    AddImageOffsetsWidget = require("../AddImageOffsetsWidget/AddImageOffsetsWidget");

var FiltersSidebar = React.createClass({
    "render" : function() {
        var values = this.props.state.values,
            original = {
                "width" : values.image.natural.width,
                "height" : values.image.natural.height
            },
            dimensions = {
                "width" : values.width || 0,
                "height" : values.height || 0
            },
            isRatioFixed = values.isRatioFixed,
            offsets = {
                "top" : 0,
                "right" : 0,
                "bottom" : 0,
                "left" : 0
            };
        return (
            <section id="tool-panel">
                <OriginalDimensionsWidget original={original} />
                <ResizeImageWidget dimensions={dimensions} isRatioFixed={isRatioFixed} onUserInput={this.props.onFilterApply}/>
                <AddImageOffsetsWidget offsets={offsets} onUserInput={this.props.onFilterApply}/>
            </section>
        );
    }
});

module.exports = FiltersSidebar;