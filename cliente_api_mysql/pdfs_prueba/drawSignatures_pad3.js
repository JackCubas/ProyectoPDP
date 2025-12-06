document.addEventListener('DOMContentLoaded', function () {
    var canvas = document.getElementById('signature-pad');
    var signaturePad = new SignaturePad(canvas);
    var undoStack = [];
    var redoStack = [];
    function saveState() {
        undoStack.push(deepCopy(signaturePad.toData()));
        redoStack = [];
    }
    function undo() {
        if (undoStack.length > 0) {
            redoStack.push(deepCopy(signaturePad.toData()));
            undoStack.pop();
            signaturePad.clear();
            if (undoStack.length) {
                var lastStroke = undoStack[undoStack.length - 1];
                signaturePad.fromData(lastStroke, { clear: false });
            }
        }
    }
    function redo() {
        if (redoStack.length > 0) {
            undoStack.push(deepCopy(signaturePad.toData()));
            var nextState = redoStack.pop();
            signaturePad.clear();
            if (nextState.length) {
                signaturePad.fromData(nextState);
            }
        }
    }
    document.getElementById('undo').addEventListener('click', undo);
    document.getElementById('redo').addEventListener('click', redo);
    document.getElementById('clear').addEventListener('click', function () {
        signaturePad.clear();
        undoStack = [];
        redoStack = [];
    });
    document.getElementById('save-png').addEventListener('click', function () {
        if (!signaturePad.isEmpty()) {
            var dataURL = signaturePad.toDataURL('image/png');
            var link = document.createElement('a');
            link.href = dataURL;
            link.download = 'signature.png';
            link.click();
        }
    });
    document.getElementById('save-jpeg').addEventListener('click', function () {
        if (!signaturePad.isEmpty()) {
            var dataURL = signaturePad.toDataURL('image/jpeg');
            var link = document.createElement('a');
            link.href = dataURL;
            link.download = 'signature.jpeg';
            link.click();
        }
    });
    // Save state on drawing end
    signaturePad.addEventListener("endStroke", () => {
        console.log("Signature end");
        saveState();
      });
    // Initial canvas setup
    function resizeCanvas() {
        var ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext('2d').scale(ratio, ratio);
        signaturePad.clear(); // otherwise isEmpty() might return incorrect value
        if (undoStack.length > 0) {
            signaturePad.fromData(undoStack[undoStack.length - 1]);
        }
    }
    function deepCopy(data) {
        return JSON.parse(JSON.stringify(data));
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
});