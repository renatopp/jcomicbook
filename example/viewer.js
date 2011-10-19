function trigger_keydown(id, key) {
    var e = jQuery.Event('keydown');
    e.which = key;
    $(id).trigger(e);
}

/*$(window).ready(function() {
    var canvas, context, tool, page1;
    var canvas_width = $(window).width()-17;
    var canvas_height = $(window).height()-5;

    function init () {

        canvas = document.getElementById('myCanvas');
        if (!canvas) {
            alert('Error: I cannot find the canvas element!');
            return;
        }

        if (!canvas.getContext) {
            alert('Error: no canvas.getContext!');
            return;
        }

        // Get the 2D canvas context.
        context = canvas.getContext('2d');
        if (!context) {
            alert('Error: failed to getContext!');
            return;
        }

        context.canvas.width  = $(window).width()-17;
        context.canvas.height = $(window).height()-5;
        
        

        // Pencil tool instance.
        tool = new tool_pencil();
        draw(0);

        // Attach the mousedown, mousemove and mouseup event listeners.
        canvas.addEventListener('mousedown', ev_canvas, false);
        canvas.addEventListener('mousemove', ev_canvas, false);
        canvas.addEventListener('mouseup',   ev_canvas, false);
        canvas.addEventListener('mousewhell',   ev_canvas, false);
    }

    function draw(y) {
        context.translate(0, 0);
        context.fillRect(0, 0, canvas_width, canvas_height);

        //context.save();
        page1 = new Image();
        page1.src = "Hellblazer_001-01.jpg";
        page1.onload = function() {
            context.drawImage(page1, 0, y);
        };
    }

    function tool_pencil () {
        var tool = this;
        this.started = false;
        this.y_actual = 0;
        this.y_start = 0;

        this.mousedown = function (ev) {
            tool.started = true;
            tool.y_start = ev._y;
        };

        this.mousemove = function (ev) {
            if (tool.started) {
                y = tool.y_actual-(tool.y_start-ev._y);
                draw(y);
            }
        };

        this.mouseup = function (ev) {
            if (tool.started) {
                tool.y_actual -= (tool.y_start-ev._y);
                if (tool.y_actual > 0) {
                    tool.y_actual = 0;
                } else if (tool.y_actual+page1.height < context.canvas.height) {
                    tool.y_actual = -(page1.height-context.canvas.height);
                }

                draw(tool.y_actual);
                tool.started = false;
            }
        };

        this.mousewhell = function(ev) {
            alert('oi');
        }
    }    


    function ev_canvas (ev) {
        if (ev.layerX || ev.layerX == 0) { // Firefox
            ev._x = ev.layerX;
            ev._y = ev.layerY;
        } else if (ev.offsetX || ev.offsetX == 0) { // Opera
            ev._x = ev.offsetX;
            ev._y = ev.offsetY;
        }

        // Call the event handler of the tool.
        var func = tool[ev.type];
        if (func) {
            func(ev);
        }
    }

    init();
});



/*
var $canvas = $('#TestCanvas');
$canvas.click(function(event) {
    alert('click!');
});
$canvas.bind('mousewheel', function(event) {
    alert('wheel!');
});
$canvas.bind('DOMMouseScroll', function(event) {
    alert('scroll!');
});

*/
