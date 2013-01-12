SnapModal
=========

SnapModal is a lightweight jQuery plugin for creating multi-purpose modals that will always stay centered in the browser window, even when their content changes.

### Styling SnapModal

The job of styling SnapModal is left entirely to you.

At minimum, you will probably want to give the modal container a sensible width, as it will span 100% of the window by default. While you can assign a fixed width to the modal container, this will break the centering if the browser window is narrower than the specified width. A better option is to use a combination of relative width and max-width, ensuring the modal can shrink with the browser window when necessary. Pick a nice background color for you modal too (it will be transparent by default).

	.snapmodal-container {
		width: 70%;
		max-width: 400px;
		background-color: #fff;
	}

You will probably also want to style the page overlay (unless you don't want or need an overlay), at it is unstyled by default. A nice basic overlay style is a black background with 50% transparency.

	.snapmodal-overlay {
		background-color: rgba(0,0,0,0.5);
	}

