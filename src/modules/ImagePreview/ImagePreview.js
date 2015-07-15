/** @jsx React.DOM */

var ImagePreview = React.createClass({
    "reLayout" : function() {
        var viewportWidth = window.innerWidth,
            viewportheight = window.innerHeight,
            filtersSidebarWidth = 320, imageCanvasWidth;
        imageCanvasWidth = viewportWidth - filtersSidebarWidth;
        $(".image-preview__wrapper").outerWidth(imageCanvasWidth);
        $(".image-preview__wrapper").outerHeight(viewportheight);
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
            <section className="image-preview__wrapper">
              <div className="image-preview">
                <img className={"image-preview__generated " + displayClass} src={this.props.imgSrc} title="" />
                <canvas className="image-preview__generator hidden"></canvas>
              </div>
            </section>
        );
    }
});

module.exports = ImagePreview;