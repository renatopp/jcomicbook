(function($) {
    $.fn.comicbook = function() {
        var comic_view, page_x, page_y, page_index, screen_height, screen_width,
            page1, page2, canvas, context, image_original_width, 
            image_original_height, change_wrap, sources, image_width, image_height;
        
        sources = [
            "hellblazer/Hellblazer_001-01.jpg",
            "hellblazer/Hellblazer_001-02.jpg",
            "hellblazer/Hellblazer_001-03.jpg"
        ];

        comic_view = this;
        page_x = 0;
        page_y = 0;
        page_index = 0;
        screen_height = $(window).height()-5;
        screen_width = $(window).width()-5;
        display_mode = 'single';
        zoom_mode = 'origin';
        zoom_factor = 1;
        change_wrap = false;

        canvas = document.getElementById(this.attr('id'));
        context = canvas.getContext('2d');

        function init() {
            //comic_view.bind('scroll', __scrollEventDispatch);
            $(document).bind('keydown', __keyboardEventDispatch);
            window.addEventListener('DOMMouseScroll', __scrollEventDispatch, false);
            window.onmousewheel = __scrollEventDispatch;

            page1 = __getPage(0);
            __update();
            __draw();
        }

        function __keyboardEventDispatch(event) { 
            //alert(event.type + ': ' + event.which);
            if (event.which == 38) { rollUp(250); } // <UP>
            else if (event.which == 40) { rollDown(250); } // <DOWN>
            else if (event.which == 32) { moveToBottom(true); }
            else if (event.which == 36) { firstPage(true); } // HOME
            else if (event.which == 35) { lastPage(); } // END
            else if (event.which == 33) { previousPage(); } // PG UP
            else if (event.which == 34) { nextPage(); } // PG DOWN
            else if (event.which == 107) { zoomIn(); } // +
            else if (event.which == 109) { zoomOut(); } // -
            else if (event.which == 49 || event.which == 97) { setZoomMode('horizontal'); } // 1
            else if (event.which == 50 || event.which == 98) { setZoomMode('vertical'); } // 2
            else if (event.which == 51 || event.which == 99) { setZoomMode('manual'); } // 3
            else if (event.which == 52 || event.which == 100) { setZoomMode('origin'); } // 4

            __update();
            __draw();
        }

        function __scrollEventDispatch(event) {
            if (!event)
                event = window.event;

            var delta = 0;
            if (event.wheelDelta) {
                delta = event.wheelDelta/120;
            } else if (event.detail) {
                delta = -event.detail/3;
            }

            if (delta < 0) { rollDown(250); } 
            else if (delta > 0) { rollUp(250); }

            __update();
            __draw();
        }
        
        function __update() {
            screen_height = $(window).height()-5;
            screen_width = $(window).width()-5;
            context.canvas.width = screen_width;
            context.canvas.height = screen_height;
        }

        function __draw() {
            context.drawImage(page1, page_x, page_y, image_width, image_height);
        }

        function __drawFirst(page) {
            image_original_width = page.width;
            image_original_height = page.height;

            if (zoom_mode == 'horizontal')
                __resizeByWidth(screen_width);
            else if (zoom_mode == 'vertical')
                __resizeByHeight(screen_height);
            //else if (zoom_mode == 'manual')
            else if (zoom_mode == 'origin')
                // image_width = width;
                // image_height = height;
                __resize(image_original_width, image_original_height);

            __draw();
        }
        
        function __resizeByWidth(width) {
            factor = width/image_original_width;
            height = image_original_height*factor;
            image_width = width;
            image_height = height;
            page_x = __getCenterX();
            //page_y = __getCenterY();
        }

        function __resizeByHeight(height) {
            factor = height/image_original_height;
            width = image_original_width*factor;
            image_width = width;
            image_height = height;
            page_x = __getCenterX();
            page_y = __getCenterY();
        }

        function __resizeByFactor(factor) {
            image_width *= factor;
            image_height *= factor;
        }

        function __resize(width, height) {
            image_width = width;
            image_height = height;
            page_x = __getCenterX();
            //page_y = __getCenterY();
        }

        function __getCenterX() {
            return (screen_width/2) - (image_width/2);
        }

        function __getCenterY() {
            return (screen_height/2) - (image_height/2);
        }
        
        function __getPage(index) {
            var page = new Image();
            page.src = sources[index]
            page.onload = function() { __drawFirst(page); };
            return page;
        }

        function isTop() {
            return page_y == 0;
        }

        function isBottom() {
            return page_y == (screen_height-image_height)
        }

        function moveToTop(change_page) {
            if (change_page && isTop()) {
                previousPage();
            } else {
                page_y = 0;
            }
        }

        function moveToBottom(change_page) {
            if (change_page && isBottom()) {
                nextPage();
            } else {
                page_y = (screen_height-image_height);
            }
        }
        
        function rollUp(delta) {
            if (isTop()) {
                if (!change_wrap) {
                    change_wrap = true;
                } else {
                    previousPage();
                }
            } else {
                change_wrap = false;

                page_y += delta;

                if (page_y > 0) {
                    page_y = 0;
                }
            }
        }

        function rollDown(delta) {
            if (isBottom()) {
                if (!change_wrap) {
                    change_wrap = true;
                } else {
                    nextPage();
                }
            } else {
                change_wrap = false;

                page_y -= delta;
                if (page_y+image_height < screen_height) {
                    page_y = (screen_height-image_height);
                }
            }
        }

        function nextPage() {
            if (page_index < sources.length-1) {
                page_index += 1;
                page1 = __getPage(page_index);
                moveToTop();
            }
        }

        function previousPage() {
            if (page_index > 0) {
                page_index -= 1;
                page1 = __getPage(page_index);
                moveToBottom();
            }
        }
        function firstPage() { 
            page_index = 0;
            page1 = __getPage(page_index);
            moveToTop();
        }

        function lastPage() {
            page_index = sources.length-1;
            page1 = __getPage(page_index);
            moveToBottom();
        }
        
        function setDisplayMode(mode) {
            if (mode == 'single') { alert('single'); }
            else if (mode == 'double') { alert('double'); }
        }

        function setZoomMode(mode) {    
            if (mode == 'horizontal') { 
                zoom_mode = 'horizontal';
                zoom_factor = 1;
                __resizeByWidth(screen_width);
                moveToTop();
            } else if (mode == 'vertical') { 
                zoom_mode = 'vertical';
                zoom_factor = 1;
                __resizeByHeight(screen_height);
                moveToTop();
            } else if (mode == 'manual') { 
                zoom_mode = 'manual';
            } else if (mode == 'origin') { 
                zoom_mode = 'origin';
                zoom_factor = 1;
                __resize(image_original_width, image_original_height);
                moveToTop();
            }
        }

        function zoomIn() { 
            zoom_factor += 0.1;
            setZoomMode('manual');
            __resizeByFactor(zoom_factor);
        }

        function zoomOut() {
            zoom_factor -= 0.1;
            setZoomMode('manual');
            __resizeByFactor(zoom_factor);
        }


        init();
    };
}) (jQuery)


