# lazyload
Javascript plugin for lazyload images. Fork of https://github.com/tuupola/jquery_lazyload , but with IntersectionObserver mode support

## Install

### Load as script in your HTML
Copy source to yout public dir and connect script in HTML page. Example:

```html
<!-- Load jquery, if not yet loaded -->
<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
<!-- Load lazyload.js -->
<script src="/js/lazyload.min.js"></script>
```
### As NPM module

```sh
npm i @nechehin/lazyload
```
use:

```javascript
import 'jquery';
import '@nechehin/lazyload';

jQuery(function() {
    jQuery('.lazy').lazyload();
});
```


## How to use

```html
<img class="lazy" data-original="img/example.jpg" width="640" height="480">
```

then in your code do:

```js
$("img.lazy").lazyload();
```
