# HTMLViews

Show and hide different content and views using simple data-attributes. No JS coding necessary. 

```html
<!-- simple music library UI -->
<nav>
	<div data-view-setview="songs">Songs</div>
	<div data-view-setview="artists">Artists</div>
	<div data-view-setview="albums">Albums</div>
</nav>

<div data-view-on="songs">(List of songs)</div>
<div data-view-on="artists">(List of artists)</div>
<div data-view-on="albums">(List of albums)</div>
```
<a name="firstGIF">![](https://raw.githubusercontent.com/averynortonsmith/HTMLViews/master/images/variableViews.gif)</a>

#### How to use:

To use the library, just include a link to `HTMLViews.js`:

```html
	...
	<script src="HTMLViews.js" ></script>
</body>
```

## Documentation:

#### Contents:

[Variable Views](#vars)

[Boolean Views](#bools)

[Relative Views](#rels)

[Other Features](#other)

[Developement](#dev)

### <a name="vars">Variable Views:</a>

A variable view can only have one state at a time. The music UI example above uses variable views; setting the view to a certain value, like `'songs'`, automatically deselects the other views: `'artists'`, and `'albums'`.

Variable views are set using the `data-view-setview` attribute. When an element with this attribute is clicked, it will set the view to the specified value:

```html 
<div data-view-setview="songs">Songs</div>
```

What if I need multiple variable views? You can accomplish this using named variable views. When no named variable is specified for a variable view, the variable name defaults to `mainView`:

```html
<!-- these are eqiuvalent -->
<div data-view-setview="songs">Songs</div>
<div data-view-setview="mainView=songs">Songs</div>
```

You can set as many named variable views as you like using the syntax `data-view-setview="name=value"`

```html 
<div data-view-setview="message=hello">Show Hello World</div>
<div data-view-setview="message=bye">Show Goodbye</div>

<div data-view-on="message=hello">Hello World!</div>
<div data-view-on="message=bye">So long, farewell.</div>
```
![](https://raw.githubusercontent.com/averynortonsmith/HTMLViews/master/images/hello.gif)

### <a name="bools">Boolean Views:</a>

Boolean views, unlike variable views, can only have two values: _enabled_, and _disabled_. Toggling a boolean view on or off doesn't affect the other views on a page. This makes boolean views helpful for creating dynamic sub-elements within other views.

Boolean views must state with a `':'`, for example `data-view-setview=":dropdown"`. In addition to `data-view-setview`, boolean views can also use the following data-arrtibutes:

`data-view-toggleview` clicking toggles a boolean view on / off

`data-view-hoverview` hovering enables a boolean view

`data-view-removeview` clicking disables a boolean view 

```html 
<!-- dropdown menu using boolean views -->
<div data-view-hoverview=":dropdown">
	<div>Pages</div>

	<div data-view-on=":dropdown">
		<a href="#home">Home</a>
		<a href="#about">About</a>
		<a href="#work">Work</a>
		<a href="#contact">Contact</a>
	</div>
</div>
```
![](https://raw.githubusercontent.com/averynortonsmith/HTMLViews/master/images/dropdown.gif)

### <a name="rels">Relative Views:</a>

What if we want to make multiple dropdown menus, as in the previous example? We can't just copy and paste the code for the first dropdown, since hovering over one dropdown will enable the `:dropdown` view, and all of the menus will show at once.

![](https://raw.githubusercontent.com/averynortonsmith/HTMLViews/master/images/overlap.gif)
^ this is bad

Views aren't global; when we set a view, we really set a view for a specific DOM element. By default, views are set and read from the `<body>` element. `data-view-setview="message=hello"` really sets the message view of the `<body>` element to `'hello'`, and an element with `data-view-on="message=hello"` will be displayed when the message view of the `<body>` element equals `'hello'`. We can set views for elements other than `<body>` using the following:

#### this

`data-view-setview="this|variable=value"` or `data-view-setview="this:variable"`
Sets the view for an element itself.

#### parent

`data-view-setview="parent|variable=value"` or `data-view-setview="parent:variable"`
Sets the view of an element's parent.

#### parent[n]

`data-view-setview="parent[n]|variable=value"` or `data-view-setview="parent[n]:variable"`
Sets the view of an element's ancestor, where n is degrees of separation. `parent[1]` is the parent, `parent[2]` the grandparent, etc.

Using relative views, we can re-engineer our dropdown menus so that they don't interfere with the other views in a page:
```html 
<!-- dropdown menu using boolean views -->
<div data-view-hoverview="this:dropdown">
	<div>Pages</div>

	<div data-view-on="parent:dropdown">
		<a href="#home">Home</a>
		<a href="#about">About</a>
		<a href="#work">Work</a>
		<a href="#contact">Contact</a>
	</div>
</div>
```

![](https://raw.githubusercontent.com/averynortonsmith/HTMLViews/master/images/relative.gif)
(Dropdown menus now operate separately)

### <a name="other">Other Features:</a>

#### Class `viewActive`:

Whenever a view is set, any view-setting elements which correspond to the view are added to the `viewActive` CSS class. The `viewActive` class can be used to hilight which states are active. An example of this is the [music library UI](#firstGIF) example, where the button corresponding to the active view appears blue. 

#### `data-view-fade`:

By default, elements are shown / hidden instantaneously. The show / hide duration can be controlled using the `data-view-fade` attribute (in milliseconds). For example, the dropdown menus in the above gif use a `data-view-fade=200`.

#### `data-view-default`:

Used to specify default views for a page. View-setting elements with the `data-view-default` attribute will display automatically when the page loads:

```html
<div data-view-toggleview=":hello" data-view-default>Say Hello</div>

<!-- visible when page loads -->
<div data-view-on=":hello">Hello World!</div>
```

### <a name="dev">Developement:</a>

Developement notes: there are three JS files relevant to this project: `initialize.js`, `jquery.min.js`, and `main.js`. These all live in the `/src` directory. `initialize.js` is just a few lines of code to prevent a flash of unstyled content before jQuery loads. `main.js` is where all of the core JS for the project is. 

To include these files in a site:

```html
	...
	<script src="src/initialize.js" ></script>
	<script src="src/jquery.min.js" ></script>
	<script src="src/main.js" ></script>
</body>
```

`build.py` simply takes these three scripts, concatenates them in the correct order, and saves the bundled result as `HTMLViews.js`. You can run it with `python build.py`, using python 2 or 3. 

`images/` contains GIFs for the README.
