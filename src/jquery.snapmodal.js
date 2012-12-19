// SnapModal - jQuery plugin
// Copyright Drake Hampton - drakehamp@gmail.com
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

;(function ($, window, document, undefined) {
    "use strict";

    var W = $(window),
        D = $(document),
        SM = $.snapmodal = function (data, options) {
            return SM.open(data, options);
        };

    $.extend(SM, {

        defaults: {
            overlayClass: 'snapmodal-overlay',
            containerClass: 'snapmodal-container',
            headerClass: 'snapmodal-header',
            closeClass: 'snapmodal-close',
            closeHtml: '<a href="#">Close</a>',
            headerContent: null,
            escClose: true,
            overlayClose: false,

            // Callbacks
            onReady: $.noop
        },

        // Current state
        isCreated: false,
        isOpen: false,

        // Elements
        $overlay: null,
        $wrap: null,
        $container: null,
        $header: null,
        $body: null,
        $content: null,

        // Static methods
        // --------------

        setDefaults: function (options) {
            SM.defaults = $.extend({}, SM.defaults, options)
        },

        open: function (data, options) {

            // handle the supplied data based on its type
            if (typeof data === 'object') {
                data = data instanceof $ ? data : $(data); // convert DOM object to jQuery object
                data = data.clone(); // clone so we don't modifiy the original
            } else if (typeof data === 'string') {
                data = $('<div></div>').html(data);
            } else {
                throw new Error('SnapModal error: unsupported data type');
            }

            // break early if there's no element to work with
            if (data.length === 0) return SM;

            // set the modal content to the first element of the jQuery object
            // and clone it so we don't modifiy the original
            SM.$content = data.first();

            // set or update the user defined options
            SM._setOptions(options);

            // create the base modal elements and bind the events, unless this
            // has already been done, in which case, just clear the body
            if (SM.isCreated) {
                SM.$body.empty();
            } else {
                SM._create();
                SM.bindEvents();
            }

            // append the content to the modal body
            SM.$content.appendTo(SM.$body).show();

            // set classes on the overlay and container
            SM.$overlay.attr('class', SM.options.overlayClass);
            SM.$container.attr('class', SM.options.containerClass);

            // run onReady callback if one was supplied
            if ($.isFunction(SM.options.onReady)) {
                SM.options.onReady.apply(SM, [SM.$container, SM.$overlay]);
            }

            // show the overlay and container
            SM.$overlay.fadeIn(200);
            SM.$container.fadeIn(200);

            SM.isOpen = true;

            return SM; // allow chaining
        },

        close: function () {
            if (!SM.isOpen) return;

            SM.isOpen = false;
            SM.isCreated = false;

            SM.unbindEvents();

            SM.$container.fadeOut(200, function () {
                SM.$wrap.remove();
                SM.$wrap = null;
            });
            SM.$overlay.fadeOut(200, function () {
                SM.$overlay.remove();
                SM.$overlay = null;
            });
            
            SM.$container = null;
            SM.$body = null;
            SM.$content = null;
        },

        bindEvents: function () {

            SM._bindCloseClass();

            // bind the overlay click to the close function, if enabled
            SM.$overlay.on('click.snapmodal', function (e) {
                if(SM.options.overlayClose) {
                    e.preventDefault();
                    SM.close();
                }
            });

            // bind keydown events
            D.on('keydown.snapmodal', function (e) {
                if ((SM.options.escClose) && e.keyCode === 27) { // ESC
                    e.preventDefault();
                    SM.close();
                }
            });

            // window resize event
            W.on('resize.snapmodal orientationchange.snapmodal', function () {
                // set a max height on the modal body, taking into account the extra vertical
                // space occupied by the modal container's padding, border, margin, and the
                // modal's header to keep the modal within the vertical bounds of the window
                var modalFrameHeight = SM.$container.outerHeight(true) - SM.$container.height() + SM.$header.outerHeight(true);
                SM.$body.css({
                    maxHeight: W.height() - modalFrameHeight
                });
            });
        },

        _bindCloseClass: function () {
            // bind the close event to any element with the closeClass class
            D.on('click.snapmodal', '.' + SM.options.closeClass, function (e) {
                e.preventDefault();
                SM.close();
            });
        },

        unbindEvents: function () {
            SM.$overlay.off('.snapmodal');
            D.off('.snapmodal');
            W.off('.snapmodal');
        },

        _create: function () {
            var $wrapInner = null;

            if(SM.isCreated) return;

            // create the overlay and add it to the DOM
            SM.$overlay = $('<div></div>')
                .css({
                    height: '100%',
                    width: '100%',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    zIndex: 1000
                })
                .hide()
                .appendTo('body');

            // create the outer wrapper
            SM.$wrap = $('<div></div>')
                .css({
                    display: 'table',
                    position: 'fixed',
                    width: '100%',
                    height: '100%',
                    top: '0',
                    left: '-100%',
                    zIndex: 1001
                });

            // create the inner wrapper
            $wrapInner = $('<div></div>')
                .css({
                    display: 'table-cell',
                    verticalAlign: 'middle'
                })
                .appendTo(SM.$wrap);

            // create the modal container
            SM.$container = $('<div></div>')
                .attr('tabIndex', -1)
                .css({
                    position: 'relative',
                    left: '100%',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    outline: 'none',
                })
                .hide()
                .appendTo($wrapInner);

            // create the modal header
            SM.$header = $('<div></div>')
                .addClass(SM.options.headerClass)
                .css({overflow: 'hidden'})
                .html(SM.options.headerContent)
                .appendTo(SM.$container);

            // create the close element, if HTML was provided for it
            // and prepend it to the modal header
            if (SM.options.closeHtml) {
                $(SM.options.closeHtml)
                    .addClass(SM.options.closeClass)
                    .prependTo(SM.$header);
            }

            // create the modal body
            SM.$body = $('<div></div>')
                .css({
                    overflow: 'auto'
                })
                .appendTo(SM.$container);

            // Set height of all parent elements to 100%
            $('html, body').css({ height: '100%' });

            // add the modal wrap to the DOM
            SM.$wrap.appendTo('body');

            SM.isCreated = true;
        },

        _setOptions: function (options) {
            var oldOpt = SM.options,
                newOpt = SM.options = $.extend({}, SM.defaults, options);

            if (!oldOpt) return;

            if (oldOpt.closeClose !== newOpt.closeClass) {
                D.off('click.snapmodal');
                SM._bindCloseClass();
            }
        }

    });

    $.fn.snapmodal = function (options) {
        return SM.open(this, options);
    }

})(jQuery, window, document);