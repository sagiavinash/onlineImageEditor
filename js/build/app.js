/** @jsx React.DOM */

var IE = {
    "services" : {
        "readImageData" : function(e) {
            var dfd = $.Deferred(),
                reader = new FileReader(),
                imageFile = e.target.files[0],
                imageData = {};

            if (!imageFile.type.match('image.*')) return;
            
            reader.onload = function(e) {
                var imgObj = new Image();
                $.extend(imageData, {
                    "dataURI" : e.target.result,
                    "title" : imageFile.name
                });
                imgObj.src = e.target.result;
                imgObj.onload = function() {
                    $.extend(imageData, {
                        "width" : parseInt(imgObj.width, 10),
                        "height" : parseInt(imgObj.height,10),
                        "aspectRatio" : (imgObj.width/imgObj.height)
                    });
                    dfd.resolve(imageData);
                };
            };
            reader.readAsDataURL(imageFile);
            return dfd.promise();
        }
    }
};

var ImageEditor = React.createClass({
	// change state on uploading image 
	"uploadImage" : function(e) {
		var IE_component = this,
            newState = $.extend({}, this.state);

        IE.services.readImageData(e).done(function(imageData) {
            IE_component.setState({
                "UI" : {
                    "showUploader" : false
                },
                "history" : {
                    "imageDataChanges" : [0],
                    "changes" : [{
                        "width" : imageData.width,
                        "height" : imageData.height,
                        "aspectRatio" : imageData.aspectRatio
                    }]
                },
                "changes" : {
                    "width" : imageData.width,
                    "height" : imageData.height,
                    "aspectRatio" : imageData.aspectRatio,
                },
                "values" : {
                    "width" : imageData.width,
                    "height" : imageData.height,
                    "dataURI" : imageData.dataURI,
                    "image" : {
                        "natural" : {
                            "width" : imageData.width,
                            "height" : imageData.height,
                            "aspectRatio" : imageData.aspectRatio,
                            "dataURI" : imageData.dataURI,
                            "title" : imageData.title
                        },
                        "current" : {
                            "width" : imageData.width,
                            "height" : imageData.height,
                            "dataURI" : imageData.dataURI,
                            "aspectRatio" : imageData.aspectRatio,
                        }
                    }
                }
            });
        });
	},
    "imageResize" : function(dataURI, width, height) {
        var resize_canvas = document.createElement('canvas'),
            resize_image = new Image(),
            newDataURI;
        resize_image.src = dataURI;
        resize_canvas.width = width;
        resize_canvas.height = height;

        resize_canvas.getContext('2d').drawImage(resize_image, 0, 0, width, height);

        return resize_canvas.toDataURL();
    },
    "imageCrop" : function(dataURI, sourceX, sourceY, sourceWidth, sourceHeight) {
        var canvas = document.createElement('canvas'),
            context = canvas.getContext('2d'),
            imageObj = new Image();
        //  var sourceX = 150,
        //  sourceY = 0,
        //  sourceWidth = 150,
        //  sourceHeight = 150;
        var destWidth = sourceWidth,
            destHeight = sourceHeight,
            destX = canvas.width / 2 - destWidth / 2,
            destY = canvas.height / 2 - destHeight / 2;
        context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
        return canvas.toDataURL();
    },
    "applyFilterChanges" : function(inputs) {
        var IE = this,
            IE_values = this.state.values,
            changes = {},
            newState = $.extend({}, this.state);

        (function getStateChangesFromInputs() {
            if (inputs.category === "imageResize") {
                if ("isRatioFixed" in inputs) {
                    if (inputs.isRatioFixed) {
                        changes.width = parseInt(IE_values.width, 10);
                        changes.height = (changes.width/IE_values.image.current.aspectRatio);
                    }
                    changes.isRatioFixed = inputs.isRatioFixed;
                } else if (IE_values.isRatioFixed) {
                    if (inputs.width) {
                        changes.width = parseInt(inputs.width, 10);
                        changes.height = (changes.width/IE_values.image.current.aspectRatio);
                    } else if (inputs.height) {
                        changes.height = parseInt(inputs.height, 10);
                        changes.width = (changes.height * IE_values.image.current.aspectRatio);
                    }
                } else {
                    if (inputs.width) changes.width = parseInt(inputs.width, 10);
                    if (inputs.height) changes.height = parseInt(inputs.height, 10);
                }
                
                changes.dataURI = IE.imageResize(IE_values.image.current.dataURI, changes.width || IE_values.width, changes.height || IE_values.height);
            } else if (inputs.category === "imageCrop") {

            }
            // console.log("changes", changes);
        })();
        
        $.extend(newState.values, changes);
        newState.changes = changes;
        newState.history.changes.push(changes);

        this.setState(newState);
    },
	getInitialState : function() {
		return {
            "UI" : {
                "showUploader" : true
            },
            "values" : {
                "isRatioFixed" : true,
                "image" : {
                    "natural" : {
                        "dataURI" : "#",
                        "width" : 0,
                        "height" : 0,
                    },
                    "current" : {
                        "dataURI" : "#",
                        "width" : 0,
                        "height" : 0,
                    }
                }
            }
		};
	},
	"render" : function() {
        var state = this.state,
            showUploader = this.state.UI.showUploader,
            imgDataURI = this.state.values.dataURI;
		return (
			<div>
				<ImageUploader display={showUploader} onUpload={this.uploadImage} />
				<ImagePreview imgSrc={imgDataURI} />
				<FiltersSidebar onFilterApply={this.applyFilterChanges} state={state} />
			</div>
		);
	}
});

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

var FiltersSidebar = React.createClass({
    "DimValueChanged" : function(datapoint, value) {
        var inputs = {};
        inputs[datapoint] = value;
        inputs.category = "imageResize";
        this.props.onFilterApply(inputs);
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
        this.props.onFilterApply(inputs);
    },
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
            isRatioFixed = values.isRatioFixed;
        return (
            <section id="filters-sidebar">
                <section id="dimensions-wrap">
                    <p id="dimensions-original">Original Size - <br/>W: <span>{original.width}</span>px,  H: <span>{original.height}</span>px</p>
                    <div id="dimensions" className="cf">
                        <DimensionInput datapoint="width" onUserInput={this.DimValueChanged} value={dimensions.width} />
                        <DimensionInput datapoint="height" onUserInput={this.DimValueChanged} value={dimensions.height} />
                    </div>
                    <input type="checkbox" ref="aspectRatioInput" name="aspect-ratio" onChange={this.aspectRatioChanged} id="set-aspect-ratio" checked={isRatioFixed} />
                    <label id="img-height" htmlFor="set-aspect-ratio">Aspect Ratio</label>
                </section>
            </section>
        );
    }
});

var DimensionInput = React.createClass({
    "handleChange" : function() {
        var datapoint = this.props.datapoint,
            value = this.refs.input.getDOMNode().value;
        this.props.onUserInput(datapoint, value);
    },
    "render" : function() {
        var label = this.props.datapoint.charAt(0).toUpperCase() + this.props.datapoint.slice(1),
            inputId = "set-" + this.props.datapoint,
            value = this.props.value;
        return (
            <div className="input-wrap cf">
                <span className="input-label">{label}</span>
                <input ref="input" id={inputId} onChange={this.handleChange} className="input-value" type="text" value={value}/>
                <span className="input-unit">px</span>
            </div>
        );
    }
});
var reactComponent = React.render(
    // titleMessage is a prop
    <ImageEditor />,
    document.getElementById("app")
);