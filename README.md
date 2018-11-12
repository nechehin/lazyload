# lazyload
Javascript plugin for lazyload images and iframes. Fork of https://github.com/tuupola/jquery_lazyload , but with IntersectionObserver mode support
. Support src, srcset attributes for image and src for iframe. Use it as data-src, data-srcset.
## Install

### Load as script in your HTML
Copy source to yout public dir and connect script in HTML page. Example:

```html
<img data-src="https://via.placeholder.com/640x480?text=Lazy+image" class="lazy">

<iframe data-src="https://www.youtube.com/embed/9UkYhRXf5cg" class="lazy" 
        width="560" height="315" frameborder="0" allowfullscreen></iframe>

<!-- Load jquery, if not yet loaded -->
<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
<!-- Load lazyload.js -->
<script src="/js/lazyload.min.js"></script>
<script>
    $('.lazy').lazyload();
</script>
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
<img class="lazy" data-src="img/example.jpg" width="640" height="480">

<iframe data-src="https://www.youtube.com/embed/9UkYhRXf5cg" class="lazy" 
        width="560" height="315" frameborder="0" allowfullscreen></iframe>
```

then in your code do:

```js
$("img.lazy").lazyload();
```
