# lazyload
Javascript plugin for lazyload images. Fork of https://github.com/tuupola/jquery_lazyload , but with IntersectionObserver mode support

## How to use

```html
<img class="lazy" data-original="img/example.jpg" width="640" height="480">
```

then in your code do:

```js
$("img.lazy").lazyload();
```
