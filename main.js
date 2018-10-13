const FACES = {};
window.onload = function() {
    input = document.getElementById('image_input');
    input.addEventListener('change', load_image);
};

makeblob = function(dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
        var parts = dataURL.split(',');
        var contentType = parts[0].split(':')[1];
        var raw = decodeURIComponent(parts[1]);
        return new Blob([raw], { type: contentType });
    }
    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
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
            makeDetectRequest(fileReader.result);
            image = new Image();
            image.src = fileReader.result;

            image.onload = function(e) {
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(image, 0, 0);
            };
        };
        //fileReader.readAsBinaryString(files[0]);
        fileReader.readAsDataURL(files[0]);
    }
}

function drawRect(coords, name = 'Mihai', fill = false) {
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

function makeDetectRequest(imageData) {
    var arr = {
        url:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTB3sOp9I6lHGav-D69lOwDzVlbjZJDR0jDqwpfl8tbi3sb5VLZ'
    };
    $.ajax({
        type: 'POST',
        url: 'https://northeurope.api.cognitive.microsoft.com/face/v1.0/detect',
        contentType: 'application/octet-stream',
        processData: false,
        headers: {
            'Ocp-Apim-Subscription-Key': '512f1b0661904e25918896ee76b0f417'
        },
        data: makeblob(imageData),
        success: function(data) {
            faceIds = data.map(function(face) {
                return face['faceId'];
            }, data);

            for (var i = 0; i < data.length; i++) {
                coords = data[i]['faceRectangle'];
                FACES[data[i]['faceId']] = [
                    coords['left'],
                    coords['top'],
                    coords['width'],
                    coords['height']
                ];
            }
            makeIdentify(faceIds);
        },
        error: function(error) {
            alert(error);
        }
    });
}

function makeIdentify(faceIds) {
    bodyData = JSON.stringify({
        faceids: faceIds,
        personGroupId: 0
    });
    $.ajax({
        type: 'POST',
        url:
            'https://northeurope.api.cognitive.microsoft.com/face/v1.0/identify',
        contentType: 'application/json',
        processData: false,
        headers: {
            'Ocp-Apim-Subscription-Key': '512f1b0661904e25918896ee76b0f417'
        },
        data: bodyData,
        success: function(data) {
            console.log(data);
            for (var i = 0; i < data.length; i++) {
                coords = FACES[data[i]['faceId']];
                candidates = data[i]['candidates'];
                if (candidates.length) {
                    max_conf = 0;
                    personId = candidates[0]['personId'];

                    for (var j = 1; j < candidates.length; j++) {
                        if (candidates[j]['confidence'] > max_conf) {
                            max_conf = candidates[j]['confidences'];
                            max_cand = candidates[j]['personId'];
                        }
                    }
                    getPerson(data[i]['faceId'], personId);
                } else {
                    drawRect(coords, '', true);
                }
            }
        },
        error: function(error) {
            alert(error);
        }
    });
}

function getPerson(faceId, personId) {
    bodyData = JSON.stringify({
        faceids: faceIds,
        personGroupId: 0
    });
    $.ajax({
        type: 'GET',
        url:
            'https://northeurope.api.cognitive.microsoft.com/face/v1.0/persongroups/0/persons/' +
            personId,
        contentType: 'application/json',
        processData: false,
        headers: {
            'Ocp-Apim-Subscription-Key': '512f1b0661904e25918896ee76b0f417'
        },
        success: function(data) {
            coords = FACES[faceId];
            drawRect(coords, data['name']);
        },
        error: function(error) {
            alert(error);
        }
    });
}
