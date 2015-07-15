(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/** @jsx React.DOM */

var ImageEditor = require("./modules/ImageEditor/ImageEditor");

var reactComponent = React.render(
    // titleMessage is a prop
    React.createElement(ImageEditor, null),
    document.getElementById("app")
);
},{"./modules/ImageEditor/ImageEditor":5}],2:[function(require,module,exports){
/** @jsx React.DOM */

var AddImageOffsetsWidget = React.createClass({displayName: "AddImageOffsetsWidget",
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
            React.createElement("section", {id: "edit-canvas-widget", className: "tool-panel-widget"}, 
                React.createElement("div", {className: "tool-panel-header"}, 
                    React.createElement("p", {className: "tool-panel-title"}, "Cropping / Padding")
                ), 
                React.createElement("div", {className: "tool-panel-body"}, 
                    React.createElement("form", {className: "cf", onBlur: this.handleInput}, 
                        React.createElement("div", {className: "canvas-layout border-box"}, 
                            React.createElement("div", {className: "editing border-box"}, 
                                React.createElement("input", {type: "text", ref: "top", className: "top", onChange: this.handleChange, onKeyDown: this.handleInput, value: this.state.top}), 
                                React.createElement("br", null), 
                                React.createElement("input", {type: "text", ref: "left", className: "left", onChange: this.handleChange, onKeyDown: this.handleInput, value: this.state.left}), 
                                React.createElement("div", {className: "content border-box"}), 
                                React.createElement("input", {type: "text", ref: "right", className: "right", onChange: this.handleChange, onKeyDown: this.handleInput, value: this.state.right}), 
                                React.createElement("br", null), 
                                React.createElement("input", {type: "text", ref: "bottom", className: "bottom", onChange: this.handleChange, onKeyDown: this.handleInput, value: this.state.bottom})
                            )
                        )
                    )
                )
            )
        );
    }
});

module.exports = AddImageOffsetsWidget;
},{}],3:[function(require,module,exports){
/** @jsx React.DOM */

var DimensionInput = React.createClass({displayName: "DimensionInput",
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
            React.createElement("div", {className: "input-wrap cf"}, 
                React.createElement("span", {className: "input-label"}, label), 
                React.createElement("input", {id: inputId, ref: "input", onChange: this.handleChange, className: "input-value", type: "text", value: value}), 
                React.createElement("span", {className: "input-unit"}, "px")
            )
        );
    }
});

module.exports = DimensionInput;
},{}],4:[function(require,module,exports){
/** @jsx React.DOM */

var OriginalDimensionsWidget = require("../OriginalDimensionsWidget/OriginalDimensionsWidget"),
    ResizeImageWidget = require("../ResizeImageWidget/ResizeImageWidget"),
    AddImageOffsetsWidget = require("../AddImageOffsetsWidget/AddImageOffsetsWidget");

var FiltersSidebar = React.createClass({displayName: "FiltersSidebar",
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
            React.createElement("section", {id: "tool-panel"}, 
                React.createElement(OriginalDimensionsWidget, {original: original}), 
                React.createElement(ResizeImageWidget, {dimensions: dimensions, isRatioFixed: isRatioFixed, onUserInput: this.props.onFilterApply}), 
                React.createElement(AddImageOffsetsWidget, {offsets: offsets, onUserInput: this.props.onFilterApply})
            )
        );
    }
});

module.exports = FiltersSidebar;
},{"../AddImageOffsetsWidget/AddImageOffsetsWidget":2,"../OriginalDimensionsWidget/OriginalDimensionsWidget":8,"../ResizeImageWidget/ResizeImageWidget":9}],5:[function(require,module,exports){
/** @jsx React.DOM */

var IE = require("../services"),
    ImageUploader = require("../ImageUploader/ImageUploader"),
    ImagePreview = require("../ImagePreview/ImagePreview"),
    FiltersSidebar = require("../FiltersSidebar/FiltersSidebar");

var ImageEditor = React.createClass({displayName: "ImageEditor",
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
            React.createElement("div", null, 
                React.createElement(ImageUploader, {display: showUploader, onUpload: this.uploadImage}), 
                React.createElement(ImagePreview, {imgSrc: imgDataURI}), 
                React.createElement(FiltersSidebar, {onFilterApply: this.applyFilterChanges, state: state})
            )
        );
    }
});

module.exports = ImageEditor;
},{"../FiltersSidebar/FiltersSidebar":4,"../ImagePreview/ImagePreview":6,"../ImageUploader/ImageUploader":7,"../services":10}],6:[function(require,module,exports){
/** @jsx React.DOM */

var ImagePreview = React.createClass({displayName: "ImagePreview",
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
            React.createElement("section", {id: "image-preview-wrap"}, 
              React.createElement("div", {id: "image-preview"}, 
                React.createElement("img", {id: "image-generated", className: displayClass, src: this.props.imgSrc, title: ""}), 
                React.createElement("canvas", {id: "image-generator", className: "hidden"})
              )
            )
        );
    }
});

module.exports = ImagePreview;
},{}],7:[function(require,module,exports){
/** @jsx React.DOM */

var ImageUploader = React.createClass({displayName: "ImageUploader",
    "handleUpload" : function(e) {
        this.props.onUpload(e);
    },
    "render" : function() {
        var showUploader = this.props.display;
        var displayStatus = showUploader ? "" : "hidden";
        return (
            React.createElement("div", {id: "image-upload", className: displayStatus}, 
                React.createElement("form", null, 
                    React.createElement("label", {className: "btn-upload"}, 
                        React.createElement("input", {type: "file", id: "input-upload", onChange: this.handleUpload}), 
                        React.createElement("span", null, "Upload Image")
                    )
                )
            )
        );
    }
});

module.exports = ImageUploader;
},{}],8:[function(require,module,exports){
/** @jsx React.DOM */

var OriginalDimensionsWidget = React.createClass({displayName: "OriginalDimensionsWidget",
    "render" : function() {
        var original = this.props.original;
        return (
            React.createElement("section", {className: "tool-panel-widget"}, 
                React.createElement("div", {className: "tool-panel-header"}, 
                  React.createElement("p", {className: "tool-panel-title"}, "Original Image Properties")
                ), 
                React.createElement("div", {className: "tool-panel-body"}, 
                  React.createElement("div", {id: "dimensions-original", className: "tool-panel-content cf"}, 
                    React.createElement("div", {className: "property-descriptor fl"}, 
                      React.createElement("span", {className: "property-label fl"}, "Width: "), 
                      React.createElement("span", {id: "orginal-width", className: "property-value fl"}, original.width), 
                      React.createElement("span", {className: "property-unit fl"}, "px")
                    ), 
                    React.createElement("span", {className: "property-seperator fl"}, ", "), 
                    React.createElement("div", {className: "property-descriptor fl"}, 
                      React.createElement("span", {className: "property-label fl"}, "Height: "), 
                      React.createElement("span", {id: "orginal-height", className: "property-value fl"}, original.height), 
                      React.createElement("span", {className: "property-unit fl"}, "px")
                    )
                  )
                )
            )
        );
    }
});

module.exports = OriginalDimensionsWidget;
},{}],9:[function(require,module,exports){
/** @jsx React.DOM */

var DimensionInput = require("../DimensionInput/DimensionInput");

var ResizeImageWidget = React.createClass({displayName: "ResizeImageWidget",
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
            React.createElement("section", {className: "tool-panel-widget"}, 
                React.createElement("div", {className: "tool-panel-header"}, 
                    React.createElement("p", {className: "tool-panel-title"}, "Resize Image")
                ), 
                React.createElement("div", {className: "tool-panel-body"}, 
                    React.createElement("div", {id: "dimensions", className: "cf"}, 
                        React.createElement(DimensionInput, {datapoint: "width", onUserInput: this.DimValueChanged, value: dimensions.width}), 
                        React.createElement("span", {className: "input-seperator"}, ","), 
                        React.createElement(DimensionInput, {datapoint: "height", onUserInput: this.DimValueChanged, value: dimensions.height})
                    ), 
                    React.createElement("div", {id: "set-aspect-ratio-wrap"}, 
                        React.createElement("input", {ref: "aspectRatioInput", id: "set-aspect-ratio", onChange: this.aspectRatioChanged, type: "checkbox", checked: isRatioFixed}), 
                        React.createElement("label", {htmlFor: "set-aspect-ratio"}, "Fix Aspect Ratio")
                    )
                )
            )
        );
    }
});

module.exports = ResizeImageWidget;
},{"../DimensionInput/DimensionInput":3}],10:[function(require,module,exports){
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

module.exports = IE;
},{}]},{},[1]);
