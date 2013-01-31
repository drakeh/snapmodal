# SnapModal

SnapModal is a lightweight jQuery plugin for creating multi-purpose [modal windows](http://en.wikipedia.org/wiki/Modal_window) that will always stay centered in the browser window, even when their content changes.

## Requirements

SnapModal requires jQuery version 1.7 or higher.

## Usage

SnapModal makes itself available as a chainable jQuery function. Simply call the `.snapmodal()` function on any jQuery object and a modal will be opened using the element(s) in the jQuery object. For example:

```javascript
$('#modal').snapmodal();
```

or

```javascript
$('<p>Modal Content</p>').snapmodal();
```
If you call the `.snapmodal()` function while a modal is already open, the contents of the existing modal will be replaced with your new content - only one modal can be open at a time.

_Note: The supplied jQuery object is cloned before being displayed in the modal, so any DOM changes made within the modal will not be reflected in the source element(s)._

The `.snapmodal()` function also accepts an options object. See the [Options & Callbacks](#options) section below for a full list of a the available options.

## Styling

The job of styling SnapModal is left entirely to you.

At minimum, you will probably want to give the modal container a sensible width, as it will span 100% of the window by default. While you can assign a fixed width to the modal container, this will break the centering if the browser window is narrower than the specified width. A better option is to use a combination of relative width and max-width, ensuring the modal can shrink with the browser window when necessary. Pick a nice background color for you modal too (it will be transparent by default).

```css
.snapmodal-container {
	width: 70%;
	max-width: 400px;
	background-color: #fff;
}
```

You will probably also want to style the page overlay (unless you don't want or need an overlay), as it is unstyled by default. A nice basic overlay style is a black background with 50% transparency.

```css
.snapmodal-overlay {
	background-color: rgba(0,0,0,0.5);
}
```

<a name="options"></a>
## Options & Callbacks

You can pass an options object to the `.snapmodal()` function with any of the following keys:

### Options

**overlayClass** (String)<br />
The CSS class assigned to the page overlay.<br />
default: `'snapmodal-overlay'`

**containerClass** (String)<br />
The CSS class assigned to the main modal container.<br />
default: `'snapmodal-container'`

**headerClass** (String)<br />
The CSS class assigned to the modal header.<br />
default: `'snapmodal-header'`

**closeClass** (String)<br />
The CSS class used to bind close elements. Any elements in the document with this class, at the time the modal opens, will have their click events bound to close the modal.<br />
default: `'snapmodal-close'`

**closeHtml** (String)<br />
The HTML template for your modal's close element. It will automatically be inserted into the modal's header, assigned the closeClass described above, and wired up to close the modal on click. If you don't want a close element, set this to null.<br />
default: `'<a href="#">Close</a>'`

**headerContent** (String)<br />
Optional content to be inserted into the modal's header, such as a title.<br />
default: `null`

**overlayClose** (Boolean)<br />
If set to true, clicking the page overlay will close the modal.<br />
default: `false`

**escClose** (Boolean)<br />
If set to true, pressing the esc key will close the modal.<br />
default: `false`

### Callbacks

**onReady**<br />_Function([jQuery](http://api.jquery.com/jQuery/) container, [jQuery](http://api.jquery.com/jQuery/) overlay)_<br />
This function is called once the modal has been constructed and added to the page, but before it opens (becomes visible). This is good place to run any initialization tasks that might be required of the content inside the modal, such as binding events, initializing other plugins, or firing ajax requests for lazy-loaded modal content. This callback is passed two arguments: jQuery objects wrapping the modal container element and page overlay element, respectively. Additionally, `this` is bound to the SnapModal object.

## Feedback & Support

Please use GitHub issues to report any bugs or suggest features or improvements. Thanks for using SnapModal!

## License

Released under the [MIT License](http://www.opensource.org/licenses/mit-license.php).
