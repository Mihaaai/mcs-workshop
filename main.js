window.onload = function() {
    input = document.getElementById('image_input');
    input.addEventListener('change', load_image);

    button = document.getElementById('draw');
    button.addEventListener('click', function(e) {
        drawRect([20, 200, 200, 200], 'Mihai', false);
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
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(image, 0, 0);
            };
        };
        fileReader.readAsDataURL(files[0]);
    }
}

function drawRect(coords, name = 'Mihai', fill = true) {
    canvas = document.getElementById('image_canvas');
    ctx = canvas.getContext('2d');

    if (fill) {
        ctx.fillStyle = 'red';
        ctx.fillRect(...coords);
    } else {
        ctx.rect(...coords);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.font = '20px Arial';
        ctx.fillStyle = 'red';
        ctx.fillText(name, coords[0] + coords[2] / 3, coords[1] - 5);
    }
}
