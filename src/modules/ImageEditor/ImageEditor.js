/** @jsx React.DOM */

var IE = require("../services"),
    ImageUploader = require("../ImageUploader/ImageUploader"),
    ImagePreview = require("../ImagePreview/ImagePreview"),
    FiltersSidebar = require("../FiltersSidebar/FiltersSidebar");

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

module.exports = ImageEditor;