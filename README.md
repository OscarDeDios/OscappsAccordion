# Oscapps Accordion plugin

Awesome accordion plugin

Demo page: https://oscardedios.github.io/

## Plugin installation

#### Usage with Webpack, Browserify, & Other Bundlers

Install dependency:

`npm install oscapps-accordion`

Or with yarn

`yarn add oscapps-accordion`

You can then import into your bundle:

```javascript
import OscappsAccordion from 'oscapps-accordion'
```

#### Including the js and css (old style)

Download js and css or use de npm CDN (current version example)

```html
<link href="https://unpkg.com/oscapps-accordion@1.0.8/dist/OscappsAccordion.min.css" rel="stylesheet">

<script type="text/javascript" src="https://unpkg.com/oscapps-accordion@1.0.8/dist/OscappsAccordion.min.js"></script>

```

## Basic Usage

For a basic usage, simply add OscappsAccordion class to a [definition list (dl)](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl)

```html
<dl class="OscappsAccordion">
  <dt>Section 1</dt>
  <dd>
    <p>Content section 1.</p>
  </dd>
  <dt>Section 2</dt>
  <dd>
    <p>Content section 1.</p>
  </dd>
  <dt>Section 3</dt>
  <dd>
    <p>Content section 1.</p>
  </dd>
</dl>`
```

## Usage with DIV and name classes

The plugin is mainly designed to use with dl's but you can use div's to specifying the header and content section with **OscappsAccordion-header** and **OscappsAccordion-section** classes.

```html
<div class="OscappsAccordion">
  <div class="OscappsAccordion-header">
    Section 1
  </div>
  <div class="OscappsAccordion-section">
    Content Section 1
  </div>
  <div class="OscappsAccordion-header">
    Section 2
  </div>
  <div class="OscappsAccordion-section">
    Content Section 2
  </div>
</div>
```
## Multiple Selection and open section by default

<p>Add <b><i>is-multiple-selection</i></b> class to have the possibility to open more than one section at the same time.<br>
Add <b><i>is-active</i></b> class to create the accordion opening a section by default.</p>

```html
      <dl class="OscappsAccordion is-multiple-selection">
        <dt class="is-active">Section 1</dt>
          <dd>
            <p>Open this section by default</p>
          </dd>
          <dt>Section 2</dt>
          <dd>
            <p>Content Section 2</p>
          </dd>
          <dt>Section 3</dt>
          <dd>
            <p>Content Section 3</p>
          </dd>
        </dl>
```

## Initialize with instantion class

<p>In order to have more control possibilities is possible to create the accordion instantiating the Object. In this case add the class
<b><i>is-instanced</i></b>.</p>

```html
<dl id="accordion-id" class="OscappsAccordion is-instance">
  <dt class="is-active">Section 1</dt>
    <dd>...

```


Import the plugin and instance the class passing the DOM element of the dl

```javascript
import OscappsAccordion from 'oscapps-accordion'

const dlElement = document.getElementById('accordion-id')

const instance = new OscappsAccordion(dlElement, options)
```

## Options

Oscapps Accordion provides several options to customize its behaviour (default value in brackets):

#### multipleSelection (false)

Used to set the multiple selection, already explained above.

```javascript
const instance = new OscappsAccordion(dlElement, { multipleSelection: true })
```

#### arrowIcon (true)

Used to remove the default arrow icon that is used to indicate if the section is open.

```javascript
const instance = new OscappsAccordion(dlElement, { arrowIcon: false })
```

#### animationTime (600)

Used to set the animation time in miliseconds. The sections are hide and showed with a slide animation, this animation will
take <i>animationTime</i> to finish.

```javascript
const instance = new OscappsAccordion(dlElement, { animationTime: 1200 })
```

#### onOpen (false)

Callback to execute when a section is opened.

```javascript
const callback = () => {
  alert('Testing awesome plugin')
}

const instance = new OscappsAccordion(dlElement, { onOpen: callback})
```

#### ajaxContent (false)

It's possible to assing ajax content to one or more sections. The parameter is an array of objects.<br><br>
The object has two fields:
<ul>
  <li><b>indexSection</b>: section to fill with the html content placed in the url. The index starts at zero, (the
    first section is 0, second 1...). If there is some content in the section will be replaced with the ajax content.</li>
  <li><b>url</b>: url of the content</li>
</ul>

```javascript
const instance = new OscappsAccordion(dlElement, {
  ajaxContent: [{
    indexSection: 1,
    url: './assets/ajaxContent1.html'
  }, {
    indexSection: 3,
    url: './assets/ajaxContent2.html'
  }]
})
```


## Methods

#### open (indexSection, allowMultiple)

Open the section specified in the parameter (first section is 0). It's possible to force the opening of the section without close other active section's even the accordion was not created as multiple selection. To do this pass true as second parameter (by default is false).

```javascript
instance.open(2, true)
```

#### openAll

 Open all the sections even the accordion was not created with multiple-selection option.

```javascript
instance.openAll()
```

#### close

Close the section specified in the parameter (first section is 0).

```javascript
instance.close(2)
```

#### closeAll

Close all the sections.

```javascript
instance.closeAll()
```

#### toggle (indexSection, allowMultiple)

Open the section specified in the parameter if it's closed, or closes it if it's open. It's possible to force the opening of the section without close other active section's even the accordion was not created as multiple selection. To do this pass true as second parameter (by default is false).

```javascript
instance.toggle(2)
```

#### isOpen (indexSection)

Return if the section specified in the parameter is open.

```javascript
if (isOpen(2)) { ... }
```

#### Chaining methods

Return if the section specified in the parameter is open.

```javascript
instance.open(2)
        .open(1)
        .close(2)
```



## Browser compatibility

* Newest two browser versions of Chrome, Firefox, Safari and Edge
* IE 11


## License

_OscappsAccordion_ is available under MIT.


