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
        isOpen: false,

        // Elements
        $overlay: null,
        $wrap: null,
        $container: null,
        $header: null,
        $headerContent: null,
        $closeElem: null,
        $body: null,
        $content: null,

        // Static methods
        // --------------

        setDefaults: function (options) {
            SM.defaults = $.extend({}, SM.defaults, options)
        },

        open: function (data, options) {
            // exit early if we didn't get a jQuery object
            if (!(data instanceof $)) return;

            // clone so we don't modifiy the original
            data = data.clone();

            // break early if there's no element to work with
            if (data.length === 0) return SM;

            // set the modal content to the first element of the jQuery object
            // and clone it so we don't modifiy the original
            SM.$content = data.first();

            // set or update the user defined options
            SM._setOptions(options);

            // create the base modal elements and bind the events, unless this
            // has already been done, in which case, just clear the body and
            // header
            if (SM.isOpen) {
                SM.$headerContent.empty();
                SM.$body.empty();
            } else {
                SM._create();
                SM.bindEvents();
            }

            // add the header content
            SM.$headerContent.html(SM.options.headerContent);

            // append the content to the modal body
            SM.$content.appendTo(SM.$body).show();

            // set classes on the overlay, container, and header
            SM.$overlay.attr('class', SM.options.overlayClass);
            SM.$container.attr('class', SM.options.containerClass);
            SM.$header.attr('class', SM.options.headerClass);

            // set the initial max height for the modal body
            SM._setModalBodyMaxHeight();

            // run onReady callback if one was supplied
            if ($.isFunction(SM.options.onReady)) {
                SM.options.onReady.apply(SM, [SM.$container, SM.$overlay]);
            }

            // show the overlay and container, if they aren't already open
            if (!SM.isOpen) {
                SM.$overlay.fadeIn(200);
                SM.$container.css({display: 'none', visibility: 'visible'}).fadeIn(200);
            }

            SM.isOpen = true;

            return SM; // allow chaining
        },

        close: function () {
            if (!SM.isOpen) return;

            SM.isOpen = false;

            SM.unbindEvents();

            SM.$container.fadeOut(200, function () {
                SM.$wrap.remove();
            });
            SM.$overlay.fadeOut(200, function () {
                SM.$overlay.remove();
            });
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
            W.on('resize.snapmodal orientationchange.snapmodal', SM._setModalBodyMaxHeight);
        },

        _bindCloseClass: function () {
            // bind the close event to any element with the closeClass class
            D.on('click.snapmodal', '.' + SM.options.closeClass, function (e) {
                e.preventDefault();
                SM.close();
            });
        },

        _setModalBodyMaxHeight: function () {
            // set a max height on the modal body, taking into account the extra vertical
            // space occupied by the modal container's padding, border, margin, and the
            // modal's header to keep the modal within the vertical bounds of the window
            var modalFrameHeight = SM.$container.outerHeight(true) - SM.$container.height() + SM.$header.outerHeight(true);
            SM.$body.css({
                maxHeight: W.height() - modalFrameHeight
            });
        },

        unbindEvents: function () {
            SM.$overlay.off('.snapmodal');
            D.off('.snapmodal');
            W.off('.snapmodal');
        },

        _create: function () {
            var $wrapInner = null;

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
                    // using visibility:hidden instead of display:none so that
                    // we can run accurate calculations on the modal dimensions
                    // before it is shown
                    visibility: 'hidden'
                })
                .appendTo($wrapInner);

            // create the modal header and header content container
            SM.$header = $('<div></div>')
                .addClass(SM.options.headerClass)
                .css({overflow: 'hidden'})
                .appendTo(SM.$container);

            SM.$headerContent = $('<div></div>').appendTo(SM.$header);

            // create the close element, if HTML was provided for it
            // and prepend it to the modal header
            if (SM.options.closeHtml) {
                SM.$closeElem = $(SM.options.closeHtml).addClass(SM.options.closeClass).prependTo(SM.$header);
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
        },

        _setOptions: function (options) {
            var oldOpt = SM.options,
                newOpt = SM.options = $.extend({}, SM.defaults, options);

            if (!oldOpt) return;

            // if the closeClass option has changed, we need to update those bindings
            if (oldOpt.closeClose !== newOpt.closeClass) {

                // remove binding for the old class
                D.off('click.snapmodal');

                // change the class on the provided close element, if it exists
                if (SM.$closeElem !== null) {
                    SM.$closeElem.removeClass(oldOpt.closeClass).addClass(newOpt.closeClass);
                }

                // redo the bindings using the new close class
                SM._bindCloseClass();
            }
        }

    });

    $.fn.snapmodal = function (options) {
        return SM.open(this, options);
    }

})(jQuery, window, document);