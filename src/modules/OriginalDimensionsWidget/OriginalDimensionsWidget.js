/** @jsx React.DOM */

var OriginalDimensionsWidget = React.createClass({
    "render" : function() {
        var original = this.props.original;
        return (
            <section className="tool-panel__widget">
                <div className="tool-panel__header">
                  <p className="tool-panel__title">Original Image Properties</p>
                </div>
                <div className="tool-panel__body">
                  <div className="tool-panel__content cf">
                    <div className="property pull-left">
                      <span className="property__label pull-left">Width: </span>
                      <span className="property__value pull-left">{original.width}</span>
                      <span className="property__unit pull-left">px</span>
                    </div>
                    <span className="property__seperator pull-left">,&nbsp;</span>
                    <div className="property pull-left">
                      <span className="property__label pull-left">Height: </span>
                      <span className="property__value pull-left">{original.height}</span>
                      <span className="property__unit pull-left">px</span>
                    </div>
                  </div>
                </div>
            </section>
        );
    }
});

module.exports = OriginalDimensionsWidget;