window.onload = function() {
    input = document.getElementById('image_input');
    input.addEventListener('change', load_image);
};

function load_image(e) {
    var target = e.target;
    var files = target.files;
    var canvas = document.getElementById('image_canvas');
    var context = canvas.getContext('2d');

    // FileReader support
    if (files && files.length) {
        var fileReader = new FileReader();
        fileReader.onload = function() {
            image = new Image();
            image.src = fileReader.result;
            image.onload = function(e) {
                context.drawImage(image, 0, 0);
            };
        };
        fileReader.readAsDataURL(files[0]);
    }
}
