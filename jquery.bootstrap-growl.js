/* global jQuery */

/*
 * bootstrap-growl
 * https://github.com/softwarespot/bootstrap-growl
 * Author: softwarespot
 * Licensed under the MIT license
 * Version: 1.2.2
 */
; (function ($, undefined) {

    // Plugin Logic

    $.bootstrapGrowl = function (message, options) {
        // Set our options from the defaults, overriding with the
        // parameter we pass into this function
        options = $.extend({}, $.bootstrapGrowl.options, options);

        // Create a temporary div element
        var $alert = $('<div/>')
            // Add the 'alert' and 'bootstrap-growl' classes for distinguishing
            // other Bootstrap alerts
            .addClass('bootstrap-growl alert')
            .attr('role', 'alert');

        // If the 'type' is set, then add the relevant alert-* class name
        if (isString(options.type) && /^DANGER|INFO|SUCCESS|WARNING$/i.test(options.type)) {
            $alert.addClass('alert-' + options.type.toLowerCase());
        }

        // If the 'allow dismissal' is a boolean datatype and set to true, then add the relevant class and append a button element
        if (isBoolean(options.allow_dismiss) && options.allow_dismiss) {
            // Close button
            var $button = $('<button/>')
                .attr('type', 'button')
                .addClass('close')
                .attr('data-dismiss', 'alert')
                .attr('aria-label', 'Close');

            // The small 'x'
            var $cross = $('<span/>')
                .attr('aria-hidden', 'true')
                .html('&times;');

            // Append the cross to the button element
            $button.append($cross);

            // Append the close button to the alert and add the class
            // that it's dimissible
            $alert.append($button)
                .addClass('alert-dismissible');
        }

        // Append the message to the alert. This could be HTML as well instead of a TEXT node
        if (message) {
            $alert.append(message);
        }

        // If the 'top offset' is set, then create an offset object literal. This is for backwards compatibility only
        if (options.top_offset) {
            options.offset = {
                from: '',
                amount: options.top_offset
            };
        }

        // Check if the options.offset is correctly formatted
        options.offset.amount = $.isNumeric(options.offset.amount) ? options.offset.amount : 20;
        options.offset.from = isString(options.offset.from) && /^TOP|BOTTOM$/i.test(options.offset.from) ? options.offset.from : 'top';

        // Cache the jQuery selector
        var $this = null;

        // Store the offset amount
        var offsetAmount = options.offset.amount;

        // If 'stack spacing' is not numeric, then set the default to 10
        if (!$.isNumeric(options.stackup_spacing)) {
            options.stackup_spacing = 10;
        }

        // For each element with the class name of '.bootstrap-growl', calculate the offset
        $('.bootstrap-growl').each(function () {
            $this = $(this);
            offsetAmount = Math.max(offsetAmount, parseInt($this.css(options.offset.from)) + $this.outerHeight() + options.stackup_spacing);
        });

        // Workaround for changing ele to element
        if (isString(options.ele)) {
            options.element = options.ele;
        }

        // Set the default 'element' to 'body', if it's an invalid string
        if (!isString(options.element)) {
            options.element = 'body';
        }

        // Create a css object literal
        var css = {
            display: 'none',
            margin: 0,
            position: (options.element === 'body' ? 'fixed' : 'absolute'),
            width: 'auto',
            'z-index': '9999'
        };

        css[options.offset.from] = offsetAmount + 'px';

        if (options.width !== 'auto' && $.isNumeric(options.width)) {
            css.width = options.width + 'px';
        }

        // Apply the css styles from above
        $alert.css(css);

        // Get the parent jQuery selector
        var $parent = $(options.element);

        // Append the alert to the parent element
        $parent.append($alert);

        // Convert to uppercase for case-insensitive matching
        if (isString(options.align)) {
            options.align = options.align.toUpperCase();
        }

        // Apply the css styles with regards to alignment in the parent element
        switch (options.align) {
            case 'CENTER':
                $alert.css({
                    'left': '50%',
                    'margin-left': '-' + ($alert.outerWidth() / 2) + 'px'
                });
                break;

            case 'LEFT':
                $alert.css('left', '20px');
                break;

            default:
                $alert.css('right', '20px');
        }

        // Display the alert
        $alert.fadeIn('fast');

        // Create a delay on fade out if greater than zero,
        // otherwise the alert will stay there indefinitely
        if ($.isNumeric(options.delay) && options.delay > 0) {
            $alert.delay(options.delay)
                .fadeOut('slow', function () {
                    return $(this).alert('close');
                });
        }

        // If 'draggable' is boolean and has been set to true
        if (isBoolean(options.draggable) && options.draggable) {
            // Add moving cursor to signify they can be moved
            $alert.css('cursor', 'move');

            // Object to store the mouse co-ordinates
            var mouse = {
                x: 0,
                y: 0,
                update: function (event) {
                    this.x = event.pageX;
                    this.y = event.pageY;
                }
            };

            // Create a function expression to reference at a later stage
            var mouseDown = function (event) {
                event.preventDefault();

                // If not absolute, fixed or relative, then set the position to relative by default
                if (!/^(absolute|fixed|relative)$/i.test($alert.css('position'))) {
                    $alert.css('position', 'relative');
                }

                // Update the mouse coordinates
                mouse.update(event);

                // Create a function expression to reference at a later stage
                var mouseMove = function (event) {
                    event.preventDefault();

                    // Get the offset object relative to the document
                    var offset = $alert.offset();

                    // Set the offset of the alert element
                    $alert.offset({
                        left: (offset.left + (event.pageX - mouse.x)),
                        top: (offset.top + (event.pageY - mouse.y))
                    });

                    // Update the mouse coordinates
                    mouse.update(event);
                };

                // Register an event for 'MOUSE_MOVE' on the parent element
                $parent.on(Events.MOUSE_MOVE, mouseMove);

                // Tidy up registered events (good housekeeping)

                // Register an event for 'MOUSE_UP' on the parent element
                $parent.one(Events.MOUSE_UP, function () {
                    // 'MOUSE_UP' will automatically be unregistered, due to using .one()

                    // Unregister the 'MOUSE_MOVE' event
                    $parent.off(Events.MOUSE_MOVE, mouseMove);
                });
            };

            // Register an event for 'MOUSE_DOWN' on the alert
            $alert.on(Events.MOUSE_DOWN, mouseDown);

            // Tidy up registered events (good housekeeping)

            // When the alert is closed, unregister the 'ALERT_CLOSED' event
            $alert.one(Events.ALERT_CLOSED, function () {
                // 'ALERT_CLOSED' will automatically be unregistered, due to using .one()

                // Unregister the 'MOUSE_DOWN' event applied to the parent element
                $alert.off(Events.MOUSE_DOWN, mouseDown);
            });

        }

        // Return the alert selector
        return $alert;
    };

    // Constants

    var Events = {
        // Fired by Bootstrap when the alert has finally closed
        ALERT_CLOSED: 'closed.bs.alert',

        // When the primary mouse button is pushed down on the alert
        MOUSE_DOWN: 'mousedown.bootstrap.growl',

        // When the mouse is moved whilst the primary mouse button is down. This is only created 'MOUSE_DOWN' is invoked
        MOUSE_MOVE: 'mousemove.bootstrap.growl',

        // When the primary mouse button is released. This is only called once using .one()
        MOUSE_UP: 'mouseup.bootstrap.growl'
    };

    // Fields

    // Methods (Private)

    // Check if value is a boolean datatype
    function isBoolean(value) {

        return $.type(value) === 'boolean';

    }

    // Check if a value is a string datatype with a length greater than zero when whitespace is stripped
    function isString(value) {

        return $.type(value) === 'string' && value.trim().length > 0;

    }

    // Defaults

    $.bootstrapGrowl.options = {
        // Default parent element to append to
        element: 'body',

        // Type of alert
        type: 'info', // (null|'default', 'info', 'danger', 'success')

        // Alert offset
        offset: {
            amount: 20, // (number)
            from: 'top' // ('top', 'bottom')
        },

        // Alignment relative to the parent element
        align: 'right', // ('left', 'right', 'center')

        width: 250, // (number, 'auto')

        // If true then a cross will be displayed in the alert
        allow_dismiss: true, // (true, false)

        // Delay for on fade out in milliseconds
        delay: 5000, // (number)

        // Whether the alert should be draggable
        draggable: true, // (true, false)

        // Spacing between each new alert created
        stackup_spacing: 10 // (number)
    };

})(jQuery);
