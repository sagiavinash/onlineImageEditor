/** @jsx React.DOM */

var ImageUploader = React.createClass({
    "handleUpload" : function(e) {
        this.props.onUpload(e);
    },
    "render" : function() {
        var showUploader = this.props.display;
        var displayStatus = showUploader ? "" : "hidden";
        return (
            <div id="image-upload" className={displayStatus}>
                <form>
                    <label className="btn-upload">
                        <input type='file' id="input-upload" onChange={this.handleUpload} />
                        <span>Upload Image</span>
                    </label>
                </form>
            </div>
        );
    }
});

module.exports = ImageUploader;