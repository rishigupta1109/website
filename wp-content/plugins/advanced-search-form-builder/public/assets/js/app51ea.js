(function($) {
    "use strict";



    /**
     * [isMobile description]
     * @type {Object}
     */
    window.isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    }
    window.isIE = /(MSIE|Trident\/|Edge\/)/i.test(navigator.userAgent);
    window.windowHeight = window.innerHeight;
    window.windowWidth = window.innerWidth;


    /**
     * Wil Carousel
     */
    $('.carousel__element').each(function() {
        var self = $(this),
            optData = eval('(' + self.attr('data-options') + ')'),
            optDefault = {
                items: 1,
                nav: true,
                dot: true,
                loop: true
            },
            options = $.extend(optDefault, optData);

        self.owlCarousel(options);
    });



    $.fn.wilMenu = function(opt) {
        return $(this).each(function() {
            var el = $(this),
                optsDefault = {
                    menuClass: 'wil-menu-list',
                    breakpoint: 1000,
                    toggleClass: 'active',
                    classButtonToggle: 'toggle-menu',
                    subMenu: {
                        class: 'sub-menu',
                        parentClass: 'menu-item-has-children',
                        toggleClass: 'active'
                    }
                },
                options = $.extend({}, optsDefault, opt);
            el.on('wilMenu', function() {
                $('.' + options.classButtonToggle, el).on('click', function(e) {
                    e.stopPropagation();
                    $('.' + options.menuClass, el).toggleClass(options.toggleClass);
                });
                $('.' + options.subMenu.parentClass, el).on('click', '> a', function(e) {
                    e.preventDefault();
                    var self = $(this);
                    self.next('.' + options.subMenu.class).slideToggle(400);
                    self.parent().toggleClass(options.subMenu.toggleClass);
                });
                $(document).on('click', function() {
                    $('.' + options.menuClass, el).removeClass(options.toggleClass);
                    $('.' + options.subMenu.parentClass, el).removeClass(options.subMenu.toggleClass);
                    $('.' + options.subMenu.class, el).hide();
                });
                $('.' + options.menuClass).on('click', function(e) {
                    e.stopPropagation();
                });
            });
            if (window.innerWidth <= options.breakpoint) {
                el.trigger('wilMenu');
            }
            $(window).resize(function() {
                if (window.innerWidth <= options.breakpoint) {
                    el.trigger('wilMenu');
                } else {
                    $('.' + options.classButtonToggle, el).off('click');
                    $('.' + options.subMenu.parentClass, el).off('click', '> a');
                    $('html, body').off('click');
                    $('.' + options.menuClass).off('click');
                }
            });
        });
    }


    /**
     * Wil Grid
     */
    $('.wil-grid').each(function() {
        var self = $(this),
            optData = self.data('options'),
            optDefault = {
                style: 'masonry',
                filterClass: '.wil-filter',
                container: '.wil-grid__inner',
                gridSize: '.grid-sizer',
                gridItem: '.grid-item',
                gridItemInner: '.grid-item__inner',
                isotopeTransition: {
                    hiddenStyle: '',
                    visibleStyle: '',
                    transitionDuration: ''
                },
                beforeSetItemElem: false,
                afterSetItemElem: false,
            },
            options = $.extend(optDefault, optData);

        self.WilokeIsotope(options);
    });


    /**
     * Wil grid scss
     */

    $.fn.reCalWidth = function() {
        var $self = $(this);
        $self.on('reCalWidth', function() {
            var _self = $(this);
            _self.css('width', '');
            var width = Math.floor(_self.width());
            _self.css('width', width + 'px');
            var height = Math.floor(_self.parent().children('.wide').width() / 2);
            _self.parent().children('.wide').css('height', height + 'px');
        });
        $(window).on('resize', function() {
            $self.trigger('reCalWidth');
        });
    }

    function work() {
        $('.wil-grid-scss').each(function() {
            var workWrapper = $(this),
                workContainer = $('.wil-grid__inner', workWrapper),
                filters = $('.wil-filter', workWrapper),
                filterCurrent = $('.current a', filters),
                filterLiCurrent = $('.current', filters),
                duration = 0.3;
            workContainer.imagesLoaded(function() {
                workContainer.isotope({
                    layoutMode: 'masonry',
                    itemSelector: '.grid-item',
                    transitionDuration: duration + 's',
                    masonry: {
                        columnWidth: '.grid-sizer'
                    },
                    // hiddenStyle: {},
                    // visibleStyle: {}
                });
            });
            filters.on('click', 'a', function(e) {
                e.preventDefault();
                var $el = $(this);
                var selector = $el.attr('data-filter');
                filters.find('.current').removeClass('current');
                $el.parent().addClass('current');
                workContainer.isotope({
                    filter: selector
                });
            });
            $('.grid-item', workWrapper).reCalWidth();
        });
    }
    work();


    var selectors = [
        'iframe[src*="player.vimeo.com"]',
        'iframe[src*="youtube.com"]',
        'iframe[src*="youtube-nocookie.com"]',
        'iframe[src*="kickstarter.com"][src*="video.html"]',
        'object',
        'embed'
    ];
    var $allVideos = $('body').find(selectors.join(','));
    $allVideos.each(function() {
        var vid = $(this),
            vidWidth = vid.outerWidth(),
            vidHeight = vid.outerHeight(),
            ratio = (vidHeight / vidWidth) * 100;
        $allVideos
            .addClass('embed-responsive-item');
        if (ratio == 75) {
            $allVideos
                .wrap('<div class="embed-responsive embed-responsive-4by3"></div>');
        } else {
            $allVideos
                .wrap('<div class="embed-responsive embed-responsive-16by9"></div>');
        }
    });


    /**
     * Menu
     */
    $('.navigation').wilMenu({
        menuClass: 'wil-menu-list',
        breakpoint: 1100,
        toggleClass: 'active',
        classButtonToggle: 'toggle-menu',
        subMenu: {
            class: 'sub-menu',
            parentClass: 'menu-item-has-children',
            toggleClass: 'active'
        }
    });



    /**
     * Form Search
     */

    $(function() {
        var availableTags = [
            "ActionScript",
            "AppleScript",
            "Asp",
            "BASIC",
            "C",
            "C++",
            "Clojure",
            "COBOL",
            "ColdFusion",
            "Erlang",
            "Fortran",
            "Groovy",
            "Haskell",
            "Java",
            "JavaScript",
            "Lisp",
            "Perl",
            "PHP",
            "Python",
            "Ruby",
            "Scala",
            "Scheme"
        ];

        $('[data-init="search"]').each(function() {

            var hehe = $(this).width();

            $('.ui-menu.ui-widget').css({
                'width': hehe
            });

            $(this).autocomplete({
                source: availableTags,

            });

        });
    });

    /**
     * Select
     */
    $(document).ready(function(){

        $(".js-select").each(function (index, el) {
            var dropdowncssclass  = '';
            if (typeof $(el).data('dropdowncssclass') != 'undefined') {
                dropdowncssclass  = $(el).data('dropdowncssclass');
            }

            $(el).select2({
                minimumResultsForSearch: Infinity,
                dropdownCssClass : dropdowncssclass
            });
        });


        /**
         * Select Slide
         */

        if ($('[data-init="slider-range"]').length) {
            $('[data-init="slider-range"]').each(function() {
                var self = $(this);
                var dataminvalue = self.data("min-value");
                var datamaxvalue = self.data("max-value");

                var datamin = self.data("min");
                var datamax = self.data("max");
                var datastep = self.data("step");
                var dataunit = self.data("unit") + ' ';

                var datatargetmin = self.data('targetmin');
                var datatargetmax = self.data('targetmax');

                self.slider({
                    range: true,
                    min: datamin,
                    max: datamax,
                    step: datastep,
                    values: [dataminvalue, datamaxvalue],

                    create: function(event, ui) {

                        var left3 = self.find('.ui-slider-handle').eq(0).attr('style');
                        var left4 = self.find('.ui-slider-handle').eq(1).attr('style');

                        var fixString3 = left3.replace('left:', '');
                        var fixString3 = fixString3.replace(';', '');

                        var fixString4 = left4.replace('left:', '');
                        var fixString4 = fixString4.replace(';', '');

                        self.find('.text1').css({
                            'left': fixString3
                        });

                        self.find('.text2').css({
                            'left': fixString4
                        });
                    },

                    slide: function(event, ui) {

                        self.find('.text1').text(dataunit + ui.values[0]);
                        self.find('.text2').text(dataunit + ui.values[1]);

                        var left1 = self.find('.ui-slider-handle').eq(0).attr('style');
                        var left2 = self.find('.ui-slider-handle').eq(1).attr('style');

                        var fixString1 = left1.replace('left:', '');
                        var fixString1 = fixString1.replace(';', '');

                        var fixString2 = left2.replace('left:', '');
                        var fixString2 = fixString2.replace(';', '');

                        self.find('.text1').css({
                            'left': fixString1
                        });

                        self.find('.text2').css({
                            'left': fixString2
                        });

                        $('#' + datatargetmin).val(ui.values[0]);
                        $('#' + datatargetmax).val(ui.values[1]);
                    }
                });

                self.find('.text1').text(dataunit + self.slider("values", 0));
                self.find('.text2').text(dataunit + self.slider("values", 1));
            });
        }
    });

    /**
     * Quality
     */

    $(".quality .btn-number").each(function() {
        var _this = $(this);

        _this.on("click", function() {


            var oldValue = _this.parent().find('#number-count').val();

            if (_this.hasClass('btn-plus')) {
                var newVal = parseFloat(oldValue) + 1;
            } else {
                if (oldValue > 1) {
                    var newVal = parseFloat(oldValue) - 1;
                } else {
                    newVal = 1;
                }
            }

            _this.parent().find('#number-count').val(newVal);

        });

    });



    // HTML5 Web Storages
    if (localStorage.getItem('scroll') != null) {
        $(window).scrollTop(localStorage.getItem('scroll'));
    }
    $(window).on('scroll', function() {
        localStorage.setItem('scroll', $(this).scrollTop());
    });

})(jQuery);

