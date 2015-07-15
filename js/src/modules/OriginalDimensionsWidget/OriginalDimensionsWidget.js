/** @jsx React.DOM */

var OriginalDimensionsWidget = React.createClass({
    "render" : function() {
        var original = this.props.original;
        return (
            <section className="tool-panel-widget">
                <div className="tool-panel-header">
                  <p className="tool-panel-title">Original Image Properties</p>
                </div>
                <div className="tool-panel-body">
                  <div id="dimensions-original" className="tool-panel-content cf">
                    <div className="property-descriptor fl">
                      <span className="property-label fl">Width: </span>
                      <span id="orginal-width" className="property-value fl">{original.width}</span>
                      <span className="property-unit fl">px</span>
                    </div>
                    <span className="property-seperator fl">,&nbsp;</span>
                    <div className="property-descriptor fl">
                      <span className="property-label fl">Height: </span>
                      <span id="orginal-height" className="property-value fl">{original.height}</span>
                      <span className="property-unit fl">px</span>
                    </div>
                  </div>
                </div>
            </section>
        );
    }
});

module.exports = OriginalDimensionsWidget;