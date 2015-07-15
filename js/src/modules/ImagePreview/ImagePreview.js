/** @jsx React.DOM */

var ImagePreview = React.createClass({
    "reLayout" : function() {
        var viewportWidth = window.innerWidth,
            viewportheight = window.innerHeight,
            filtersSidebarWidth = 320, imageCanvasWidth;
        imageCanvasWidth = viewportWidth - filtersSidebarWidth;
        $("#image-preview-wrap").outerWidth(imageCanvasWidth);
        $("#image-preview-wrap").outerHeight(viewportheight);
    },
    "getInitialState" : function() {
        $(window).on("resize.marker", this.reLayout);
    
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            return null;    
        } else {
            return {
                "isNotSupported" : true
            };
        }
    },
    "componentDidMount" : function() {
        this.reLayout();
    },
    "render" : function() {
        var displayClass = (this.props.imgSrc === "#") ? "hidden" : "";
        return (
            <section id="image-preview-wrap">
              <div id="image-preview">
                <img id="image-generated" className={displayClass} src={this.props.imgSrc} title="" />
                <canvas id="image-generator" className="hidden"></canvas>
              </div>
            </section>
        );
    }
});

module.exports = ImagePreview;