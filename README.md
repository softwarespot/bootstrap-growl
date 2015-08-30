#bootstrap-growl

## This `fork` has now been published as its own plugin, aptly called [bootstrapPurr](https://github.com/softwarespot/jquery-bootstrap-purr). It includes multiple fixes that are outside the scope of this plugin.

A simple jQuery plugin that turns standard Bootstrap alerts into hovering "Growl-like" notifications.

## Demo

A demonstration is available over at [JSFiddle](http://jsfiddle.net/ifightcrime/Us6WX/1008/) as well as an example in main repository.

## Features

* Uses standard [Bootstrap alerts](http://getbootstrap.com/components/#alerts) which provides the 'info', 'danger', and 'success' styles.
* Multiple growls called consecutively are stacked up one after another in a list.
* Automatically fades growls away after a default of 5 seconds.

## Dependencies

1. Latest version of jQuery
2. [Bootstrap v3](http://getbootstrap.coml)

## Usage

Include the dependencies and `jquery.bootstrap-growl.min.js` onto your page and call the following:

```javascript
    $.bootstrapGrowl('A simple message alert');
```

## Available Options

By default, growls use the standard 'alert' Bootstrap style, which are 250px wide, right aligned, and are positioned 20px from the top right of the page.

```javascript
    $.bootstrapGrowl('Diplay a short but simple message here', {
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
    });
```

Note: Previous ```top_offset``` is not broken by this latest change.

## Contribution

## Additional Contributors

* Jose Martinez https://github.com/callado4
* Lloyd Watkin https://github.com/lloydwatkin
* TruongSinh Tran-Nguyen https://github.com/tran-nguyen
