var imageEditor = {
	"controller" : {
		"init" : function () {
			var IE_model = imageEditor.model;
			
			imageEditor.controller.getDefaults();

			(function setLayout() {
				imageEditor.view.reLayout();
				$(window).resize(imageEditor.view.reLayout);
			}());

			(function fileReaderApi() {
				if (window.File && window.FileReader && window.FileList && window.Blob) {
					var getImageData = function (e) {
						var imageFile = e.target.files[0];
						if (!imageFile.type.match('image.*')) {
							return;
						}
						var reader = new FileReader();
						reader.onload = function (e) {
							var imgObj;
							
							IE_model.image = imageEditor.model.image,
							IE_model.image.dataURI = e.target.result;
							IE_model.image.title = imageFile.name;

							imgObj =  new Image();
							imgObj.src = e.target.result;
							imgObj.onload = function () {
								IE_model.image = $.extend(IE_model.image, {
									"width" : parseInt(imgObj.width, 10),
									"height" : parseInt(imgObj.height,10),
									"aspectRatio" : (imgObj.width/imgObj.height)
								});	
								IE_model.changes = $.extend(IE_model.changes, IE_model.image);
								IE_model.clipboard.firstRender = true;
								imageEditor.controller.updateModel();
							}
						};
						reader.readAsDataURL(imageFile);
					}
					$("#input-upload").on('change', getImageData);
				} else {
					alert('Web Image Editor not supported in this browser. Please use latest versions of modern browsers like Chrome, Firefox');
				}
			}());

			(function filterControls() {
				$("#set-width").on("change", function () {
					IE_model.changes.width = Math.round($(this).val());
					IE_model.changes.dataURI = imageEditor.image.resize();
					imageEditor.controller.updateModel();

				});

				$("#set-height").on("change", function () {
					IE_model.changes.height = Math.round($(this).val());
					IE_model.changes.dataURI = imageEditor.image.resize();
					imageEditor.controller.updateModel();
				});

				$("#set-aspect-ratio").on("change", function () {
					IE_model.changes.isRatioFixed = $(this).is(":checked");
					imageEditor.controller.updateModel();
				});
			}());
		},
		"getDefaults" : function () {
			var IE_model = imageEditor.model;
			IE_model.current.isRatioFixed = $("#set-aspect-ratio").is(":checked");
			IE_model.changes = $.extend(IE_model.changes, IE_model.current);
		},
		"updateModel" : function () {
			var IE_model = imageEditor.model;
			IE_model.current = imageEditor.model.current;
			IE_model.changes = imageEditor.model.changes;

			if(IE_model.changes.isRatioFixed) {
				IE_model.current.height = IE_model.current.width * IE_model.current.aspectRatio;
			}
			IE_model.current = $.extend(IE_model.current, IE_model.changes);
			imageEditor.view.filters.render();
			imageEditor.view.canvas.render();
		}
	},
	"model" : {
		"current" : {},
		"changes" : {},
		"image" : {
			"aspectRatio" : 1.5,
			"width" : "150",
			"height" : "100",
		},
		"clipboard" : {}
	},
	"view" : {
		"filters" : {
			"render" : function () {
				var IE_model = imageEditor.model;
				if ($.isEmptyObject(IE_model.current)) {

				}
				if ("width" in IE_model.changes) {
					if (IE_model.current.isRatioFixed) {
						IE_model.current.height = Math.round(IE_model.changes.width / IE_model.image.aspectRatio);
					}
					if (!IE_model.clipboard.firstRender) {
						IE_model.current.dataURI = imageEditor.image.resize();
					}
					$("#set-width").val(IE_model.current.width);
					$("#set-height").val(IE_model.current.height);
				}
				if ("height" in IE_model.changes) {
					if (IE_model.current.isRatioFixed) {
						IE_model.current.width = Math.round(IE_model.changes.height * IE_model.image.aspectRatio);
					}
					if (!IE_model.clipboard.firstRender) {
						IE_model.current.dataURI = imageEditor.image.resize();
					}
					$("#set-width").val(IE_model.current.width);
					$("#set-height").val(IE_model.current.height);
				}
				if ("isRatioFixed" in IE_model.changes) {
					if (IE_model.changes.isRatioFixed && IE_model.current.width) {
						$("#set-height").val(IE_model.current.height);
						if (!IE_model.clipboard.firstRender) {
							IE_model.current.dataURI = imageEditor.image.resize();
						}
					}
				}
			}
		},
		"canvas" : {
			"render" :  function () {
				var IE_model = imageEditor.model;

				if (IE_model.clipboard.firstRender) {
					$("#image-generated").removeClass("hidden").attr("title" , IE_model.changes.title);
					$("#image-upload").addClass("hidden");
					IE_model.clipboard.firstRender = false;
				}
				$("#image-generated").attr("src", IE_model.current.dataURI);
				IE_model.changes = {};
			}
		},
		"reLayout" : function () {
			var viewportWidth = window.innerWidth,
				viewportheight = window.innerHeight,
				filtersSidebarWidth = 320, imageCanvasWidth;
			imageCanvasWidth = viewportWidth - filtersSidebarWidth;
			$("#image-preview-wrap").outerWidth(imageCanvasWidth);
			$("#image-preview-wrap").outerHeight(viewportheight);
		}
	},
	"image" : {
		"resize" : function() {
			var IE_model = imageEditor.model,
				resize_canvas = document.createElement('canvas'),
				resize_image = new Image();
			resize_image.src = IE_model.image.dataURI;
			resize_canvas.width = IE_model.current.width;
			resize_canvas.height = IE_model.current.height;

			resize_canvas.getContext('2d').drawImage(resize_image, 0, 0, IE_model.current.width, IE_model.current.height);
			return resize_canvas.toDataURL();
		},
		"crop" : function(dataURI, sourceX, sourceY, sourceWidth, sourceHeight) {
			var canvas = document.createElement('canvas'),
				context = canvas.getContext('2d'),
				imageObj = new Image();
			//  var sourceX = 150,
			// 	sourceY = 0,
			// 	sourceWidth = 150,
			// 	sourceHeight = 150;
			var destWidth = sourceWidth,
				destHeight = sourceHeight,
				destX = canvas.width / 2 - destWidth / 2,
				destY = canvas.height / 2 - destHeight / 2;
			context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
			return canvas.toDataURL();
		}
	}
};

imageEditor.controller.init();