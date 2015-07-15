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