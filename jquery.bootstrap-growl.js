/* global jQuery */

; (function ($, undefined) {

    // Plugin Logic

    $.bootstrapGrowl = function (message, options) {
        // Set our options from the defaults, overriding with the
        // parameter we pass into this function
        options = $.extend({}, $.bootstrapGrowl.options, options);

        // Create a temporary div element
        var $alert = $('<div/>');

        // Add the following classes
        $alert.addClass('bootstrap-growl alert');

        // Set the default 'element' to 'body', if it's an invalid string
        if (!isString(options.element)) {
            options.element = 'body';
        }

        // Set the default 'type' to null, if it's an invalid string
        if (options.type !== null || !isString(options.type) || !/^DANGER|INFO|SUCCESS$/i.test(options.type)) {
            options.type = null;
        }

        // If the 'type' is set, then add the relevant alert-* class name
        if (options.type) {
            $alert.addClass('alert-' + options.type.toLowerCase());
        }

        // If the 'allow dismissal' is a boolean datatype and is set to true, then add the relevant class and append a button element
        if (isBoolean(options.allow_dismiss) && options.allow_dismiss) {
            $alert.addClass('alert-dismissible');
            $alert.append('<button  class="close" data-dismiss="alert" type="button"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>');
        }

        // Append the message to the alert
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
        options.offset.from = isString(options.offset.from) && /^TOP|BOTTOM$/i.test(options.type) ? options.offset.from : 'top';

        // Cache the jQuery object selector
        var $this = null,

            // Store the offset amount
            offsetAmount = options.offset.amount;

        // If 'stack spacing' is not numeric, then set the default to 10
        if (!$.isNumeric(options.stackup_spacing)) {
            options.stackup_spacing = 10;
        }

        // For each element with the class name of '.bootstrap-growl', calculate the offset
        $('.bootstrap-growl').each(function () {
            $this = $(this);
            offsetAmount = Math.max(offsetAmount, parseInt($this.css(options.offset.from)) + $this.outerHeight() + options.stackup_spacing);
        });

        // Create a css object literal
        var css = {
            'display': 'none',
            'margin': 0,
            'position': (options.element === 'body' ? 'fixed' : 'absolute'),
            'z-index': '9999'
        };

        css[options.offset.from] = offsetAmount + 'px';

        if (options.width !== 'auto' && $.isNumeric(options.width)) {
           css.width = options.width + 'px';
        }

        // Apply the css styles from above
        $alert.css(css);

        // Append the alert to the parent element
        $(options.element).append($alert);

        // Convert to uppercase for case-insensitive matching
        if (isString(options.align)) {
            options.align = options.align.toUpperCase();
        }

        // Apply the css styles with regardless to alignment in the parent element
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

        // Display the alert by fading in
        $alert.fadeIn();

        // Create a delay on fade out if greater than zero
        if ($.isNumeric(options.delay) && options.delay > 0) {
            $alert.delay(options.delay)
                .fadeOut(function () {
                return $(this).alert('close');
            });
        }

        return $alert;
    };

    // Methods (Private)

    // Check if value is a boolean datatype
    var isBoolean = function (value) {

        return $.type(value) === 'boolean';

    };

    // Check if a value is a string datatype with a length greater than zero when whitespace is stripped
    var isString = function (value) {

        return $.type(value) === 'string' && value.trim().length > 0;

    };

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

        // Delay for the alert closing
        delay: 4000, // (number)

        // If true then a cross will be displayed in the alert
        allow_dismiss: true, // (true, false)

        // Spacing between each new alert
        stackup_spacing: 10 // (number)
    };

})(jQuery);
