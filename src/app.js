/** @jsx React.DOM */

var ImageEditor = require("./modules/ImageEditor/ImageEditor");

var reactComponent = React.render(
    // titleMessage is a prop
    <ImageEditor />,
    document.getElementById("app")
);