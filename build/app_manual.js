/** @jsx React.DOM */

var IE = {
    "services" : {
        "image" : {
            "readData" : function(e) {
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
            },
            "resize" : function(dataURI, width, height) {
                var resize_canvas = document.createElement('canvas'),
                    resize_image = new Image(),
                    newDataURI;
                resize_image.src = dataURI;
                resize_canvas.width = width;
                resize_canvas.height = height;

                resize_canvas.getContext('2d').drawImage(resize_image, 0, 0, width, height);

                return resize_canvas.toDataURL();
            },
            "withOffsets" : function(dataURI, X, Y, width, height) {
                var edit_canvas = document.createElement('canvas'),
                    imageObj = new Image();
                edit_canvas.width = width;
                edit_canvas.height = height;
                imageObj.src = dataURI;
                edit_canvas.getContext('2d').drawImage(imageObj, X, Y, width, height, 0, 0, width, height);
                return edit_canvas.toDataURL();
            }
        }
    }
};

var ImageEditor = React.createClass({
	// change state on uploading image 
	"uploadImage" : function(e) {
		var IE_component = this,
            newState = $.extend({}, this.state);

        IE.services.image.readData(e).done(function(imageData) {
            IE_component.setState({
                "UI" : {
                    "showUploader" : false
                },
                "history" : {
                    "imageDataChanges" : [0],
                    "changes" : [{
                        "width" : imageData.width,
                        "height" : imageData.height,
                        "aspectRatio" : imageData.aspectRatio,
                        "category" : "upload"
                    }]
                },
                "changes" : {
                    "width" : imageData.width,
                    "height" : imageData.height,
                    "aspectRatio" : imageData.aspectRatio,
                    "category" : "upload"
                },
                "values" : {
                    "width" : imageData.width,
                    "height" : imageData.height,
                    "dataURI" : imageData.dataURI,
                    "offsets" : {
                        "top" : 0,
                        "right" : 0,
                        "bottom" : 0,
                        "left" : 0
                    },
                    "isRatioFixed" : true,
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
                            "offsets" : {
                                "top" : 0,
                                "right" : 0,
                                "bottom" : 0,
                                "left" : 0
                            }
                        }
                    }
                }
            });
        });
	},
    "applyFilterChanges" : function(inputs) {
        var IE_values = this.state.values,
            changes = {},
            newState = $.extend({}, this.state);

        (function getStateChangesFromInputs() {
            var params = {};
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

                changes.dataURI = IE.services.image.resize(IE_values.image.current.dataURI, changes.width || IE_values.width, changes.height || IE_values.height);
                
                $.extend(newState.values, changes);
                newState.changes = changes;
                newState.changes.category = inputs.category;
                newState.history.changes.push(changes);
            } else if (inputs.category === "addOffsets") {
                $.extend(params, {
                    "X" : -inputs.left,
                    "Y" : -inputs.top,
                    "width" : IE_values.image.current.width + (inputs.left + inputs.right),
                    "height" : IE_values.image.current.height + (inputs.top + inputs.bottom),
                    "dataURI" : IE_values.image.current.dataURI
                });
                $.extend(true, changes, {
                    "width" : params.width,
                    "height" : params.height,
                    "offsets" : {
                        "top" : inputs.top,
                        "left" : inputs.left,
                        "right" : inputs.right,
                        "bottom" : inputs.bottom,
                    },
                    "dataURI" : IE.services.image.withOffsets(params.dataURI, params.X, params.Y, params.width, params.height)
                });
                
                var shouldCurrentChange = (function() {
                    var imageDataChanges = newState.history.imageDataChanges,
                        lastChangeId = imageDataChanges[imageDataChanges.length - 1],
                        changesLength = newState.history.changes.length,
                        imageAlterCategories = ["upload", "addOffsets"],
                        result = false;
                    for (i = lastChangeId; i < changesLength; i++) {
                        if (newState.history.changes[i].category !== "addOffsets") {
                            result = true;
                        }
                    }
                    return result;
                })();

                if (shouldCurrentChange) {
                    $.extend(true, newState.values, changes, {
                        "image" : {
                            "current" : changes
                        }
                    });
    
                }
                
                newState.changes = $.extend({}, changes, {
                    "category" : inputs.category
                });
                newState.history.changes.push(changes);
                if (shouldCurrentChange) {
                    newState.history.imageDataChanges.push(newState.history.changes.length - 1);
                }
            }
        })();
        
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
                        "height" : 0
                    },
                    "current" : {
                        "dataURI" : "#",
                        "width" : 0,
                        "height" : 0,
                        "offsets" : {
                            "top" : 0,
                            "right" : 0,
                            "bottom" : 0,
                            "left" : 0
                        }
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

var DimensionInput = React.createClass({
    "handleChange" : function() {
        var datapoint = this.props.datapoint,
            value = this.refs.input.getDOMNode().value;
        this.props.onUserInput(datapoint, value);
    },
    "render" : function() {
        var label = this.props.datapoint.charAt(0).toUpperCase() + this.props.datapoint.slice(1) + " :",
            inputId = "set-" + this.props.datapoint,
            value = this.props.value;
        return (
            <div className="input-wrap cf">
                <span className="input-label">{label}</span>
                <input id={inputId} ref="input" onChange={this.handleChange} className="input-value" type="text" value={value} />
                <span className="input-unit">px</span>
            </div>
        );
    }
});

var AddImageOffsetsWidget = React.createClass({
    "handleChange" : function() {
        var inputs = {
            "top" : parseInt(this.refs.top.getDOMNode().value || 0, 10),
            "left" : parseInt(this.refs.left.getDOMNode().value || 0, 10),
            "right" : parseInt(this.refs.right.getDOMNode().value || 0, 10),
            "bottom" : parseInt(this.refs.bottom.getDOMNode().value || 0, 10),
        };

        this.setState(inputs);
    },
    "handleInput" : function(e) {
        var inputs = {
            "top" : parseInt(this.refs.top.getDOMNode().value || 0, 10),
            "left" : parseInt(this.refs.left.getDOMNode().value || 0, 10),
            "right" : parseInt(this.refs.right.getDOMNode().value || 0, 10),
            "bottom" : parseInt(this.refs.bottom.getDOMNode().value || 0, 10),
        };
           
        if (e.key === 'Enter') {
            inputs.category = "addOffsets";
            this.props.onUserInput(inputs);
            this.setState({
                "top" : 0,
                "left" : 0,
                "right" : 0,
                "bottom" : 0
            });
        }
    },
    "getInitialState" : function() {
        return {
            "top" : 0,
            "left" : 0,
            "right" : 0,
            "bottom" : 0
        };
    },
    "render" : function() {
        var offsets = this.props.offsets;
        return (
            <section id="edit-canvas-widget" className="tool-panel-widget">
                <div className="tool-panel-header">
                    <p className="tool-panel-title">Cropping / Padding</p>
                </div>
                <div className="tool-panel-body">
                    <form className="cf" onBlur={this.handleInput}>
                        <div className="canvas-layout border-box">
                            <div className="editing border-box">
                                <input type="text" ref="top" className="top" onChange={this.handleChange} onKeyDown={this.handleInput} value={this.state.top}/>
                                <br />
                                <input type="text" ref="left" className="left" onChange={this.handleChange} onKeyDown={this.handleInput} value={this.state.left}/>
                                <div className="content border-box"></div>
                                <input type="text" ref="right" className="right" onChange={this.handleChange} onKeyDown={this.handleInput} value={this.state.right}/>
                                <br />
                                <input type="text" ref="bottom" className="bottom" onChange={this.handleChange} onKeyDown={this.handleInput} value={this.state.bottom}/>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        );
    }
})

var reactComponent = React.render(
    // titleMessage is a prop
    <ImageEditor />,
    document.getElementById("app")
);