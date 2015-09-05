/** @jsx React.DOM */

var ImageUploader = React.createClass({
    "handleUpload" : function(e) {
        this.props.onUpload(e);
    },
    "render" : function() {
        var showUploader = this.props.display;
        var displayStatus = showUploader ? "" : "hidden";
        return (
            <div className={"image-upload " + displayStatus}>
                <form>
                    <label className="image-upload__button">
                        <input type='file' className="image-upload__input" onChange={this.handleUpload} />
                        <span>Upload Image</span>
                    </label>
                </form>
            </div>
        );
    }
});

module.exports = ImageUploader;