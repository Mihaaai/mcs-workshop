window.onload = function() {
    input = document.getElementById('image_input');
    input.addEventListener('change', load_image);

    button = document.getElementById('draw');
    button.addEventListener('click', function(e) {
        drawRect([20, 20, 200, 200], true);
    });
};

function load_image(e) {
    var target = e.target;
    var files = target.files;
    var canvas = document.getElementById('image_canvas');
    var ctx = canvas.getContext('2d');

    // FileReader support
    if (files && files.length) {
        var fileReader = new FileReader();
        fileReader.onload = function() {
            image = new Image();
            image.src = fileReader.result;
            image.onload = function(e) {
                ctx.drawImage(image, 0, 0);
            };
        };
        fileReader.readAsDataURL(files[0]);
    }
}

function drawRect(coords, fill = true) {
    canvas = document.getElementById('image_canvas');
    ctx = canvas.getContext('2d');
    //ctx.rect(Object.values(coords));
    ctx.rect(...coords);
    if (fill) {
        ctx.fillStyle = 'red';
        ctx.fillRect(...coords);
    }
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 3;
    ctx.stroke();
}
