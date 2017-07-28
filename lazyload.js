
/*!
 * Plugin for lazy loading images
 * 
 * @link https://github.com/nechehin/lazyload
 */

(function($, window) {
    
    "use strict";
    
    var $window = $(window);

    $.fn.lazyload = function(options) {
        
        var elements = this,
            $container,
            settings = {
            threshold       : 0,
            failure_limit   : 0,
            event           : 'scroll',
            effect          : 'show',
            container       : window,
            data_attribute  : 'original',
            skip_invisible  : false,
            appear          : null,
            load            : null,
            allowIntersectionMode: true,
            placeholder     : "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
            pageXOffset: false,
            pageYOffset: false
        };        
        
        
        if (options) {
            /* Maintain BC for a couple of versions. */
            if (undefined !== options.failurelimit) {
                options.failure_limit = options.failurelimit;
                delete options.failurelimit;
            }
            if (undefined !== options.effectspeed) {
                options.effect_speed = options.effectspeed;
                delete options.effectspeed;
            }

            $.extend(settings, options);
        }

        
        var intersectionMode = settings.allowIntersectionMode 
                && 'IntersectionObserver' in window
                && settings.event.indexOf('scroll') === 0;


        if (intersectionMode) {
            
            var ioSetting = {};
            
            if (settings.container !== window) {
                ioSetting['root'] = typeof settings.container[0] === 'undefined' ? settings.container : settings.container[0];
            }
            
            var io = new IntersectionObserver(function(entries){
                
                [].forEach.call(entries, function(entry){
                    
                    if (typeof entry.isIntersecting !== 'undefined' && entry.isIntersecting === false) {
                        return;
                    }
                    
                    var self = entry.target;
                    var tImg = new Image();
                    var src = self.getAttribute('data-' + settings.data_attribute);

                    tImg.onload = function() {
                        self.src = src;
                        self.loaded = true;
                    };

                    tImg.src = src;
                    
                    io.unobserve(self);
                });
                
            }, ioSetting);
            
            if (typeof console.info === 'function') {
                console.info('lazyload: intersection mode');
            }
           
        } else {
            
            /* Cache container as jQuery object. */
            $container = (settings.container === undefined ||
                      settings.container === window) ? $window : $(settings.container);
        }
        
        
        function update() {
               
            settings.pageYOffset = window.pageYOffset;
            settings.pageXOffset = window.pageXOffset;

            var counter = 0;                

            elements.each(function() {

                var $this = $(this);

                if (settings.skip_invisible && !$this.is(":visible")) {
                    return;
                }

                if ($.abovethetop(this, settings) ||
                    $.leftofbegin(this, settings)) {
                        /* Nothing. */
                } else if (!$.belowthefold(this, settings) &&
                    !$.rightoffold(this, settings)) {
                        $this.trigger('appear');
                        /* if we found an image we'll load, reset the counter */
                        counter = 0;
                } else {
                    if (++counter > settings.failure_limit) {
                        return false;
                    }
                }
            });
                
        }
        

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        if (0 === settings.event.indexOf('scroll') && !intersectionMode) {
            $container.on(settings.event, function() {
                return update();
            });
        }
        

        this.each(function() {
            
            var self = this;

            self.loaded = false;

            /* If no src attribute given use data:uri. */
            if (self.getAttribute('src') === null && self.tagName === 'IMG') {
                self.src = settings.placeholder;
            }

            /* When appear is triggered load original image. */
            if (!intersectionMode) {
                
                var $self = $(self);
                
                $self.one('appear', function() {

                    if (!this.loaded) {

                        if (settings.appear) {
                            var elements_left = elements.length;
                            settings.appear.call(self, elements_left, settings);
                        }

                        var tImg = new Image();

                        tImg.onload = function() {

                            var original = self.getAttribute('data-' + settings.data_attribute);

                            if (self.tagName === 'IMG') {
                                self.src = original;
                            } else {
                                self.style.backgroundImage = 'url(' + original + ')';
                            }

                            self.loaded = true;

                            /* Remove image from array so it is not looped next time. */
                            var temp = $.grep(elements, function(element) {
                                return !element.loaded;
                            });

                            elements = $(temp);

                            if (settings.load) {
                                var elements_left = elements.length;
                                settings.load.call(self, elements_left, settings);
                            }
                        };

                        tImg.src = self.getAttribute('data-' + settings.data_attribute);
                    }
                });
                
                /* When wanted event is triggered load original image */
                /* by triggering appear.                              */
                if (settings.event.indexOf('scroll') !== 0) {
                    self.addEventListener(settings.event, function() {
                        if (!self.loaded) {
                            $self.trigger("appear");
                        }
                    });
                }
                
            } else {
                
                io.observe(self);
                
            }            
            
        });


        if (!intersectionMode) {
            
            /* Check if something appears when window is resized. */
            window.addEventListener('resize', function() {
                update();
            });
            
            /* With IOS5 force loading images when navigating with back button. */
            /* Non optimal workaround. */
            if ((/(?:iphone|ipod|ipad).*os 5/gi).test(navigator.appVersion)) {
                $window.on('pageshow', function(event) {
                    if (event.originalEvent && event.originalEvent.persisted) {
                        elements.each(function() {
                            $(this).trigger("appear");
                        });
                    }
                });
            }
            
            /* Force initial check if images should appear. */
            $(function() {
                update();
            });
        }

        return this;
    };


    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

    $.belowthefold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = Tochka.winHeight() + settings.pageYOffset;
        } else {
            fold = $(settings.container).offset().top + $(settings.container).height();
        }

        return fold <= $(element).offset().top - settings.threshold;
    };

    $.rightoffold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = Tochka.winWidth() + settings.pageXOffset;
        } else {
            fold = $(settings.container).offset().left + $(settings.container).width();
        }

        return fold <= $(element).offset().left - settings.threshold;
    };

    $.abovethetop = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = settings.pageYOffset;//(settings.pageYOffset || window.pageYOffset);
        } else {
            fold = $(settings.container).offset().top;
        }
        return fold >= $(element).offset().top + settings.threshold  + element.clientHeight;
    };

    $.leftofbegin = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = settings.pageXOffset;
        } else {
            fold = $(settings.container).offset().left;
        }

        return fold >= $(element).offset().left + settings.threshold + element.clientWidth;
    };


})(jQuery, window);