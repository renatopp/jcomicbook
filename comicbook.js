(function($) {
    $.fn.comicbook = function(options) {
        var settings = {
            'page_index'       : 0,
            'display-mode'     : 'single',
            'zoom_mode'        : 'origin',
            'zoom_factor'      : 1,
            'background-color' : '#eaeaea',
            'roll_sensibility' : 250,
            'mouse_sensibility': 1,
            'sources'          : [
                //"hellblazer/dual.jpg",
                "hellblazer/Hellblazer_001-01.jpg",
                "hellblazer/Hellblazer_001-02.jpg",
                "hellblazer/Hellblazer_001-03.jpg",
                "hellblazer/Hellblazer_001-01.jpg",
                "hellblazer/Hellblazer_001-02.jpg",
                "hellblazer/Hellblazer_001-03.jpg",
                "hellblazer/Hellblazer_001-01.jpg",
                "hellblazer/Hellblazer_001-02.jpg",
                "hellblazer/Hellblazer_001-03.jpg",
                "hellblazer/Hellblazer_001-01.jpg",
                "hellblazer/Hellblazer_001-02.jpg",
                "hellblazer/Hellblazer_001-03.jpg",
                "hellblazer/Hellblazer_001-01.jpg",
                "hellblazer/Hellblazer_001-02.jpg",
                "hellblazer/Hellblazer_001-03.jpg",
                "hellblazer/Hellblazer_001-01.jpg",
                "hellblazer/Hellblazer_001-02.jpg",
                "hellblazer/Hellblazer_001-03.jpg",
                "hellblazer/Hellblazer_001-01.jpg",
                "hellblazer/Hellblazer_001-02.jpg",
                "hellblazer/Hellblazer_001-03.jpg",
                "hellblazer/Hellblazer_001-01.jpg",
                "hellblazer/Hellblazer_001-02.jpg",
                "hellblazer/Hellblazer_001-03.jpg",
                "hellblazer/Hellblazer_001-01.jpg",
                "hellblazer/Hellblazer_001-02.jpg",
                "hellblazer/Hellblazer_001-03.jpg"],
            'onPageChange'     : function(){},
        };

        $.extend(settings, options);

        //var data = $.extend({}, settings, options);
        var image_original_height, image_original_width, image_height, image_width;
        var screen_width, screen_height;
        var page_x, page_y, page;
        var comic_view, canvas, context;
        var mouse_status, mouse_x, mouse_y;

        comic_view = this;
        canvas = document.getElementById(this.attr('id'));
        context = canvas.getContext('2d');

        function init() {
            $(document).bind('keydown', keyboardEventDispatch);
            canvas.addEventListener('mousedown', mouseEventDispatch, false);
            canvas.addEventListener('mousemove', mouseEventDispatch, false);
            canvas.addEventListener('mouseup', mouseEventDispatch, false);
            window.addEventListener('DOMMouseScroll', scrollEventDispatch, false);
            window.onmousewheel = scrollEventDispatch;

            page_x = 0;
            page_y = 0;
            delay_flag = false;
            mouse_status = 'up';
            resizeWindow();
            setDisplayMode(settings['display_mode'])
            setZoomMode(settings['zoom_mode']);

            context.canvas.width = screen_width;
            context.canvas.height = screen_height;

            loadPage(settings['page_index']);
            
        }

        function resizeWindow() {
            screen_height = $(window).height()-5;
            screen_width = $(window).width()-5;
            context.canvas.width = screen_width;
            context.canvas.height = screen_height;
        }

        function scrollEventDispatch(event) {
            if (!event)
                event = window.event;

            var delta = 0;
            if (event.wheelDelta) {
                delta = event.wheelDelta/120;
            } else if (event.detail) {
                delta = -event.detail/3;
            }

            if (delta < 0) { (isBottom())?nextPage():rollDown(); } 
            else if (delta > 0) { (isTop())?previousPage():rollUp(); }

            draw();
        }

        function keyboardEventDispatch(event) {
            if (event.which == 38) { (isTop())?previousPage():rollUp(); } // <UP>
            else if (event.which == 40) { (isBottom())?nextPage():rollDown(); } // <DOWN>
            else if (event.which == 39) { (isRight())?nextPage():rollRight(); } // <RIGHT>
            else if (event.which == 37) { (isLeft())?previousPage():rollLeft(); } // <LEFT>
            else if (event.which == 32) { (isBottom())?nextPage():moveToBottom(); } // SPACE
            else if (event.which == 33) { previousPage(); } // PG UP
            else if (event.which == 34) { nextPage(); } // PG DOWN
            else if (event.which == 36) { firstPage(); } // HOME
            else if (event.which == 35) { lastPage(); } // END
            else if (event.which == 49 || event.which == 97) { setZoomMode('horizontal'); } // 1
            else if (event.which == 50 || event.which == 98) { setZoomMode('vertical'); } // 2
            else if (event.which == 51 || event.which == 99) { setZoomMode('origin'); } // 3
            else if (event.which == 107) { zoomIn(); } // +
            else if (event.which == 109) { zoomOut(); } // -

            draw();
        }

        function mouseEventDispatch(event) {
            if (event.layerX || event.layerX == 0) { // Firefox
                actual_mouse_x = event.layerX;
                actual_mouse_y = event.layerY;
            } else if (event.offsetX || event.offsetX == 0) { // Opera
                actual_mouse_x = event.offsetX;
                actual_mouse_y = event.offsetY;
            }

            if (event.type == 'mousedown') {
                mouse_status = 'down'
                mouse_x = actual_mouse_x;
                mouse_y = actual_mouse_y;
            } else if (event.type == 'mousemove') {
                if (mouse_status == 'down') {
                    delta_y = (actual_mouse_y-mouse_y)*settings['mouse_sensibility'];
                    delta_x = (actual_mouse_x-mouse_x)*settings['mouse_sensibility'];

                    if (image_height > screen_height) {
                        if (delta_y > 0 && !isTop()) {
                            page_y += delta_y;
                            if (isTop()) moveToTop();
                        } else if (delta_y < 0 && !isBottom()) {
                            page_y += delta_y;
                            if (isBottom()) moveToBottom();
                        }
                    }

                    if (image_width > screen_width) {
                        if (delta_x > 0 && !isLeft()) {
                            page_x += delta_x;
                            if (isLeft()) moveToLeft();
                        } else if (delta_x < 0 && !isRight()) {
                            page_x += delta_x;
                            if (isRight()) moveToRight();
                        }
                    }
                }
            } else if (event.type == 'mouseup') {
                mouse_status = 'up'
            }

            mouse_x = actual_mouse_x;
            mouse_y = actual_mouse_y;

            draw();
        }

        function draw() {
            resizeWindow();
            context.fillStyle = settings['background-color'];
            context.fillRect(0, 0, screen_width+5, screen_height+5);
            context.drawImage(page, page_x, page_y, image_width, image_height);
        }

        function loadPage(index) {
            resizeWindow();
            page = new Image();
            page.src = settings['sources'][index]
            page.onload = function() {
                image_original_height = page.height;
                image_original_width = page.width;
                setZoomMode();
                draw();
            };

            settings['onPageChange'](settings);
        }

        function getCenterX() {
            return (screen_width/2) - (image_width/2);
        }
        function getCenterY() {
            return (screen_height/2) - (image_height/2);
        }

        function isTop() { return page_y >= 0; }
        function isBottom() { return (page_y+image_height) <= screen_height; }
        function isLeft() { return page_x >= 0; }
        function isRight() { return (page_x+image_width) <= screen_width; }

        function moveToTop() {
            if (image_height > screen_height) {
                page_y = 0;
            }
        }
        function moveToBottom() {
            if (image_height > screen_height) {
                page_y = -(image_height-screen_height);
            }
        }
        function moveToLeft() { 
            if (image_width > screen_width) { 
                page_x = 0; 
            }
        }
        function moveToRight() { 
            if (image_width > screen_width) { 
                page_x = -(image_width-screen_width); 
            }
        }
        
        function rollUp() { 
            if (image_height > screen_height) {
                page_y += settings['roll_sensibility'];
                if (isTop()) {
                    moveToTop();
                }
            }
        }
        function rollDown() {
            if (image_height > screen_height) {
                page_y -= settings['roll_sensibility'];
                if (isBottom()) {
                    moveToBottom();
                }
            }
        }
        function rollRight() { 
            if (image_width > screen_width) { 
                page_x -= settings['roll_sensibility'];
                if (isRight()) {
                    moveToRight();
                }
            }
        }
        function rollLeft() { 
            if (image_width > screen_width) { 
                page_x += settings['roll_sensibility']; 
                if (isLeft()) {
                    moveToLeft();
                }
            }
        }

        function isFirstPage() { return settings['page_index'] == 0; }
        function isLastPage() { return settings['page_index'] == settings['sources'].length-1; }

        function previousPage() {
            if (!isFirstPage()) {
                settings['page_index'] -= 1;
                loadPage(settings['page_index']);
                moveToBottom();
            }
        }
        function nextPage() {
            if (!isLastPage()) {
                settings['page_index'] += 1;
                loadPage(settings['page_index']);
                moveToTop();
            }
        }
        function firstPage() {
            settings['page_index'] = 0;
            loadPage(settings['page_index']);
            moveToTop();
        }
        function lastPage() {
            settings['page_index'] = settings['sources'].length-1;
            loadPage(settings['page_index']);
            moveToBottom();
        }
        
        function setDisplayMode(mode) {}
        function setZoomMode(mode) {
            if (mode) settings['zoom_mode'] = mode;

            if (settings['zoom_mode'] != 'manual') {
                image_height = image_original_height;
                image_width = image_original_width;

                if (settings['zoom_mode'] == 'origin') {
                    image_width = image_original_width;
                    image_height = image_original_height;

                } else if (settings['zoom_mode'] == 'horizontal') {
                    factor = screen_width/image_original_width;
                    image_width = screen_width;
                    image_height = image_original_height*factor;

                } else if (settings['zoom_mode'] == 'vertical') {
                    factor = screen_height/image_original_height;
                    image_width = image_original_width*factor;
                    image_height = screen_height;
                }

                settings['zoom_factor'] = image_width/image_original_width;

                if (image_width > screen_width) {
                    page_x = 0;
                } else {
                    page_x = getCenterX();
                }

                if (image_height > screen_height) {
                    page_y = 0;
                } else {
                    page_y = getCenterY();
                }
            } else {
                image_width = image_original_width*settings['zoom_factor'];
                image_height = image_original_height*settings['zoom_factor'];

                if (image_width <= screen_width) {
                    page_x = getCenterX();
                } else {
                    if (isLeft()) moveToLeft();
                    else if (isRight()) moveToRight();
                }

                if (image_height <= screen_height) {
                    page_y = getCenterY();
                } else {
                    if (isTop()) moveToTop();
                    else if (isBottom()) moveToBottom();
                }
            }
        }

        function zoomIn() {
            settings['zoom_factor'] += 0.1;
            setZoomMode('manual');
        }

        function zoomOut() {
            settings['zoom_factor'] -= 0.1;
            setZoomMode('manual');   
        }

        init();
    };
}) (jQuery)


