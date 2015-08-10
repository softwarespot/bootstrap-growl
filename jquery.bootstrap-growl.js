/* global jQuery */

; (function ($, undefined) {

    // Plugin Logic

    $.bootstrapGrowl = function (message, options) {
        // Set our options from the defaults, overriding with the
        // parameter we pass into this function
        options = $.extend({}, $.bootstrapGrowl.options, options);

        // Create a div element
        var $alert = $('<div/>');

        // Add the following classes
        $alert.addClass('bootstrap-growl alert');

        // If the 'type' if set, then add the alert-* class name
        if (options.type) {
            $alert.addClass('alert-' + options.type);
        }

        // If the 'allow dismissal' is set, then add the relevant class and append a button element
        if (options.allow_dismiss) {
            $alert.addClass('alert-dismissible');
            $alert.append('<button  class="close" data-dismiss="alert" type="button"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>');
        }

        // Append the message to the alert
        $alert.append(message);

        // If the 'top offset' is set, then create an offset object literal
        if (options.top_offset) {
            options.offset = {
                from: 'top',
                amount: options.top_offset
            };
        }

        // Cache the jQuery object selector
        var $this = null,

            // Store the offset amount
            offsetAmount = options.offset.amount;

        // For each element with the class name of '.bootstrap-growl', calculate the offset
        $('.bootstrap-growl').each(function () {
            $this = $(this);
            offsetAmount = Math.max(offsetAmount, parseInt($this.css(options.offset.from)) + $this.outerHeight() + options.stackup_spacing);
        });

        // Create a css object literal
        var css = {
            'position': (options.element === 'body' ? 'fixed' : 'absolute'),
            'margin': 0,
            'z-index': '9999',
            'display': 'none'
        };

        css[options.offset.from] = offsetAmount + 'px';

        if (options.width !== 'auto') {
           css['width'] = options.width + 'px';
        }

        // Apply the css styles from above
        $alert.css(css);

        // Append the alert to the parent element
        $(options.element).append($alert);

        // Apply the css styles with alignment
        switch (options.align) {
            case 'center':
                $alert.css({
                    'left': '50%',
                    'margin-left': '-' + ($alert.outerWidth() / 2) + 'px'
                });
                break;

            case 'left':
                $alert.css('left', '20px');
                break;

            default:
                $alert.css('right', '20px');
        }

        // Display the alert by fading in
        $alert.fadeIn();

        // Create a delay on fade out
        if (options.delay > 0) {
            $alert.delay(options.delay).fadeOut(function () {
                return $(this).alert('close');
            });
        }

        return $alert;
    };

    // Methods (Private)

    // Defaults
    $.bootstrapGrowl.options = {
        element: 'body',
        type: 'info',
        offset: {
            from: 'top',
            amount: 20
        },
        align: 'right',
        width: 250,
        delay: 4000,
        allow_dismiss: true,
        stackup_spacing: 10
    };

})(jQuery);
