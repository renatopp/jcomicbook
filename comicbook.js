(function($) {
    $.fn.comicbook = function() {
        var comic_view, page_x, page_y, page_index, screen_height, screen_width,
            page1, page2, canvas, context, image_original_width, 
            image_original_height, change_wrap, sources;
        
        sources = [
            "hellblazer/Hellblazer_001-01.jpg",
            "hellblazer/Hellblazer_001-02.jpg",
            "hellblazer/Hellblazer_001-03.jpg"
        ];

        comic_view = this;
        page_x = 0;
        page_y = 0;
        page_index = 0;
        screen_height = $(window).height();
        screen_width = $(window).width();
        display_mode = 'single';
        zoom_mode = 'origin';
        zoom_factor = 1;
        change_wrap = false;

        canvas = document.getElementById(this.attr('id'));
        context = canvas.getContext('2d');

        function init() {
            $(document).bind('keydown', __keyboard_event_dispatch);
            //comic_view.bind('scroll', __scroll_event_dispatch);
            window.addEventListener('DOMMouseScroll', __scroll_event_dispatch, false);
            window.onmousewheel = __scroll_event_dispatch;

            page1 = __getPage(0);
            __update();
            page_x = __get_center_x(page1);
            __draw();
        }

        function __keyboard_event_dispatch(event) { 
            //alert(event.type + ': ' + event.which);
            if (event.which == 38) { rollUp(250); } // <UP>
            else if (event.which == 40) { rollDown(250); } // <DOWN>
            else if (event.which == 32) { moveToBottom(); }
            else if (event.which == 36) { firstPage(); } // HOME
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

        function __scroll_event_dispatch(event) {
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
            screen_height = $(window).height();
            screen_width = $(window).width();
            context.canvas.width = screen_width-17;
            context.canvas.height = screen_height-5;
        }

        function __draw() {
            context.drawImage(page1, page_x, page_y);
        }
        
        function __resize() {}

        function __get_center_x(page) {
            return (screen_width/2) - (page.width/2);
        }
        
        function __getPage(index) {
            var page = new Image();
            page.src = sources[index]
            page.onload = function() { __draw(); };

            image_original_width = page.width;
            image_original_height = page.height;

            return page;
        }

        function isTop() {
            return page_y == 0;
        }

        function isBottom() {
            return page_y == (screen_height-page1.height)
        }

        function moveToTop() {
            if (isTop()) {
                previousPage();
            } else {
                page_y = 0;
            }
        }

        function moveToBottom() {
            if (isBottom()) {
                nextPage();
            } else {
                page_y = (screen_height-page1.height);
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
                if (page_y+page1.height < screen_height) {
                    page_y = (screen_height-page1.height);
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
            } else if (mode == 'vertical') { 
                zoom_mode = 'vertical';
            } else if (mode == 'manual') { 
                zoom_mode = 'manual';
            } else if (mode == 'origin') { 
                zoom_mode = 'origin';
            }
        }

        function zoomIn() { alert('zoom in'); }
        function zoomOut() { alert('zoom out'); }


        init();
    };
}) (jQuery)


