
(function ($) {
    "use strict";

    var $window = $(window);
    var $document = $(document);
    var winWidthSm = 991;


    // ---------------------------------------------------------------------------------------------------------------------------->
    // Navigation Menu ||----------------------
    // ---------------------------------------------------------------------------------------------------------------------------->
    $(function () {

        /* Dropdon Center align */
        $(function () {
            var dropDown_center = $('.nav-dropdown');
            $window.resize(function resize() {
                dropDown_center.each(function (indx) {
                    if ($(this).hasClass("center")) {

                        var dropdownWidth = $(this).outerWidth();
                        var navItemWidth = $(this).parents(".nav-menu-item").outerWidth();
                        var dropdown_halfWidth = dropdownWidth / 2;
                        var navItem_halfWidth = navItemWidth / 2;
                        var totlePosition = dropdown_halfWidth - navItem_halfWidth;
                        if ($window.width() > winWidthSm) {
                            $(this).css("left", "-" + totlePosition + "px");
                        } else {
                            $(this).css("left", "0");
                        };
                    }
                });
            }).trigger('resize');
        });

        /* Downdown Desktop Device Hidden and Mobile Device Show */
        $(function () {
            $window.resize(function resize() {
                if ($window.width() > winWidthSm) {
                    $(".nav-dropdown-sub, .nav-dropdown").hide();
                };

                if ($window.width() <= winWidthSm) {
                    $(".nav-dropdown-sub").show();
                };
            }).trigger('resize');
        });

        /*Sub Dropdown*/
        $(function () {
            $window.resize(function resize() {
                if ($window.width() > winWidthSm) {
                    $('.nav-menu-item').hover(function () {
                        if ($(this).length > 0) {
                            $(this).children(".nav-dropdown-sub").stop(true, true).fadeIn("fast");
                        }
                    }, function () {
                        if ($(this).length > 0) {
                            $(this).children(".nav-dropdown-sub").stop(true, true).delay(100).fadeOut("fast");
                        }
                    });
                };
            }).trigger('resize');
        });

        /*Dropdown*/
        $('.nav-menu > ul > li:has( > .nav-dropdown)').prepend("<span class='menu-dropdown-icon'></span>");
        $('.nav-dropdown > ul > li:has( > .nav-dropdown-sub)').addClass('sub-dropdown-icon');
        $(function () {
            var navMenuLink = $(".nav-menu > ul > li");
            var navMenuIcon = $(".menu-dropdown-icon");

            //If width is more than 991px Dropdowns are displayed on hover
            $window.resize(function resize() {
                if ($window.width() > winWidthSm) {
                    navMenuLink.hover(function () {
                        if ($(this).length > 0) {
                            $(this).find(".nav-dropdown:first").stop(true, true).fadeIn("fast");
                        }
                    }, function () {
                        if ($(this).length > 0) {
                            $(this).find(".nav-dropdown:first").stop(true, true).delay(100).fadeOut("fast");
                        }
                    });
                };

                //If width is less or equal to 991px dropdowns are displayed on click
                if ($window.width() <= winWidthSm) {
                    navMenuIcon.click(function () {
                        if ($(this).length > 0) {
                            $(this).siblings(".nav-dropdown").stop(true, true).slideToggle("fast");
                        }
                    });
                };

            }).trigger('resize');
        });

        //when clicked on mobile-menu, normal menu is shown as a list, classic rwd menu story
        var navMobileBtn = $(".menu-mobile-btn span");
        navMobileBtn.on('click', function (e) {
            $(".nav-menu").toggleClass('show-on-mobile');
            $(this).toggleClass("active");
            e.preventDefault();
        });

    });

    // ---------------------------------------------------------------------------------------------------------------------------->
    // Sticky Header Function  ||-----------
    // ---------------------------------------------------------------------------------------------------------------------------->
    var stickyOffset = $('#sticky_element').offset().top;
    $(window).scroll(function () {
        var sticky = $('#sticky_element'),
            scroll = $(window).scrollTop();

        if (scroll >= stickyOffset) sticky.addClass('fixed');
        else sticky.removeClass('fixed');
    });


    // "Header height" Desktop Device Enable ---- small Device auto
    $(function () {
        var $header = $('.header'),
            headerInnerHeight = $(".header").innerHeight();
        $window.resize(function resize() {
            if ($window.width() > winWidthSm) {
                return $header.css("height", headerInnerHeight);
            }
            $header.css("height", "auto");
        }).trigger('resize');
    });

    // "Sticky" Desktop Device Enable ---- small Device Disable
    $(function () {
        var $stickyEle = $('#sticky_element');

        $window.resize(function resize() {
            if ($window.width() > winWidthSm) {
                return $stickyEle.removeClass('no-stick');
            }
            $stickyEle.addClass('no-stick');
        }).trigger('resize');
    });

    // ---------------------------------------------------------------------------------------------------------------------------->
    // Elements  ||-----------
    // ---------------------------------------------------------------------------------------------------------------------------->
    $(function () {

        // (1). Sidebar Menu Function (Cart Menu) =======================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
        var $menuSidebar = $('.sidebar-right');
        var $menusidebarNav = $('#sidebar_toggle_btn');
        var $menuSidebarclose = $('#sidebar_close_icon');
        var $menuSidebarOverlay = $('.sidebar_overlay');
        var $menuSidebarOverlayActive = $('.sidebar_overlay_active');

        /*sidebar menu navigation icon toggle*/
        $menusidebarNav.on('click', function () {
            $(this).toggleClass('active');
            $menuSidebar.toggleClass('sidebar-open');
            $menuSidebarOverlay.toggleClass('sidebar_overlay_active');

        });

        /*sidebar menu close icon*/
        $menuSidebarclose.on('click', function () {
            $menusidebarNav.removeClass('active');
            $menuSidebar.removeClass('sidebar-open');
            $menuSidebarOverlay.removeClass('sidebar_overlay_active');
        });

        /*Overlay Active*/
        $document.on('click touchstart', '.sidebar_overlay_active', function () {
            $menusidebarNav.toggleClass('active');
            $menuSidebar.toggleClass('sidebar-open');
            $menuSidebarOverlay.toggleClass('sidebar_overlay_active');
        });



        // (2). Search Overlay Menu =======================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
        $(function () {
            var searchOverlayMenuBtn = $('#search-overlay-menu-btn'),
                searchMenuClose = $('.search-overlay-menu, .search-overlay-menu .search-overlay-close');

            searchOverlayMenuBtn.on('click', function (event) {
                $('.search-overlay-menu').addClass('open');
                $('.search-overlay-menu > form > input[type="search"]').focus();
            });
            searchMenuClose.on('click keyup', function (event) {
                if (event.target == this || event.target.className == 'search-overlay-close' || event.keyCode == 27) {
                    $(this).removeClass('open');
                }
            });
        });


        // (3) Price Range Slider ======================================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
        $(function () {
            var min_price = $('#price_range_min').attr('data-min'),
                max_price = $('#price_range_max').attr('data-max');

            $(".price-range-slider").slider({
                range: true,
                min: 0,
                max: 1500,
                values: [min_price, max_price],
                step: 10,
                slide: function (event, ui) {
                    $("#price-range-from-to").html("Price : <span class='from'>$" + ui.values[0] + "</span> &mdash; <span class='to'>$" + ui.values[1]);
                    $("#price_range_min").val(ui.values[0]);
                    $("#price_range_max").val(ui.values[1]);
                }
            });

            $("#price-range-from-to").html("Price : <span class='from'>$" + $(".price-range-slider").slider("values", 0) + "</span> &mdash; <span class='to'>$" + $(".price-range-slider").slider("values", 1) + "</span>");
            $("#price_range_min").val($(".price-range-slider").slider("values", 0));
            $("#price_range_max").val($(".price-range-slider").slider("values", 1));
        });


        // (4). Tooltip =======================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
        $('[rel=tooltip]').tooltip()

        // (5). Tabs (Tabs With OwlCarousel) =======================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            $($(e.target).attr('href'))
                .find('.owl-carousel')
                .owlCarousel('invalidate', 'width')
                .owlCarousel('update')
        })

        // (6) Accordian ======================================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

        /* Accordian Arrow Added*/
        $('ul.jq-accordian > li:has( > ul ) > a').append("<span class='jq-accordionIcon'></span>");
        /* Clickeble Link */
        $('ul.jq-accordian > li:has( > ul ) > a').attr('href', 'javascript:void(0)');
        /* Accordian Sub Childern "ul" Hide */
        $('ul.jq-accordian li ul').hide();

        var accordianClick = $('ul.jq-accordian li a');
        var accordionHeader = $('ul.jq-accordian > li > a');

        /* Accordian */
        accordianClick.on('click', function (e) {
            accordianClick.each(function (i) {
                if ($(this).next().is("ul") && $(this).next().is(":visible")) {
                    $(this).next().slideUp();
                }
            });

            var e = $(e.target);
            if (e.next().is("ul") && e.next().is(":visible")) {
                e.next().slideUp();

            } else {
                e.next().slideDown();

            }
        });

        /* Accordian Icon */
        accordianClick.on('click', function (e) {
            if ($(this).hasClass('is-active')) {
                $(this).removeClass('is-active');
            }
            else {
                /* close other content */
                accordionHeader.not(this).removeClass('is-active');
                $(this).addClass('is-active');
            }
        });


        // (7) Select Box ======================================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
        $(function () {
            $('.nice-select-box').niceSelect();
        });


        // (8) Grid/List View =======================================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        var productListBtn = $('.product-list-switcher');
        var productGridBtn = $('.product-grid-switcher');
        var productItemsWrap = $('.product-list-item');

        productListBtn.on('click', function (event) {
            event.preventDefault();
            productItemsWrap.addClass('product-list-view');
            productListBtn.addClass('product-view-icon-active')
            productGridBtn.removeClass('product-view-icon-active')
        });
        productGridBtn.on('click', function (event) {
            event.preventDefault();
            productItemsWrap.removeClass('product-list-view');
            productListBtn.removeClass('product-view-icon-active')
            productGridBtn.addClass('product-view-icon-active')
        });

        // (9) product page - selecting color, selecting size, Grid/List View ==============================================================================
        /*Select Color*/
        $('.color-selector .entry').on('click', function () {
            $(this).parent().find('.active').removeClass('active');
            $(this).addClass('active');
        });

        /*Select Size*/
        $('.size-selector .entry').on('click', function () {
            $(this).parent().find('.active').removeClass('active');
            $(this).addClass('active');
        });

        // (9) Product Quantity '+', '-' ======================================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
        $(function () {
            var qty_min = $('.quantity').attr("min");
            var qty_max = $('.quantity').attr("max");

            $(".quantityPlus").on('click', function () {
                var currentVal = parseInt($(this).next(".quantity").val(), 10);
                var str = $("p:first").text();
                if (currentVal != qty_max) {
                    $(this).next(".quantity").val(currentVal + 1);
                }
            });

            $(".quantityMinus").on('click', function () {
                var currentVal = parseInt($(this).prev(".quantity").val(), 10);
                if (currentVal != qty_min) {
                    $(this).prev(".quantity").val(currentVal - 1);
                }
            });
        });

        // (10) Toggle  ======================================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
        /*Slide Toggle*/
        $('.slide-toggle-btn').on('click', function (e) {
            $('#' + $(this).data('toggleTarget')).slideToggle(300);
        });

        //fade Toggle
        $('.fade-toggle-btn').on('click', function (e) {
            $('#' + $(this).data('toggleTarget')).fadeToggle(300);
        });

        // (11) Backgrounds Image (Slider, Section, etc..) ===========>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
        var pageSection = $('.slide-bg-image, .bg-image');
        pageSection.each(function (indx) {
            if ($(this).attr("data-background-img")) {
                $(this).css("background-image", "url(" + $(this).data("background-img") + ")");
            }
            if ($(this).attr("data-bg-position-x")) {
                $(this).css("background-position", $(this).data("bg-position-x"));
            }
        });


    });


    // ---------------------------------------------------------------------------------------------------------------------------->
    // OWL Carousel ||-----------
    // ---------------------------------------------------------------------------------------------------------------------------->
    $(function () {

        //Item 4
        $('.product-item-4').owlCarousel({
            loop: false,
            margin: 0,
            nav: true,
            dots: false,
            autoplayHoverPause: true,
            autoplay: false,
            singleItem: true,
            navText: [
                '<i class="fa fa-angle-left" aria-hidden="true"></i>',
                '<i class="fa fa-angle-right" aria-hidden="true"></i>'
            ],
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 2
                },
                991: {
                    items: 3
                },
                1170: {
                    items: 4
                }
            }

        });

        //Item 3
        $('.product-item-3').owlCarousel({
            loop: false,
            margin: 0,
            nav: true,
            dots: false,
            autoplayHoverPause: true,
            autoplay: false,
            singleItem: true,
            navText: [
                '<i class="fa fa-angle-left" aria-hidden="true"></i>',
                '<i class="fa fa-angle-right" aria-hidden="true"></i>'
            ],
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 2
                },
                991: {
                    items: 3
                },
                1170: {
                    items: 3
                }
            }

        });

        //Item 1
        $('.product-item-1').owlCarousel({
            loop: true,
            items: 1,
            margin: 0,
            nav: true,
            dots: false,
            autoplayHoverPause: true,
            autoplay: true,
            singleItem: true,
            navText: [
                '<i class="fa fa-angle-left" aria-hidden="true"></i>',
                '<i class="fa fa-angle-right" aria-hidden="true"></i>'
            ]

        });

        // Team Carousel
        $('.team-carousel').owlCarousel({
            loop: false,
            margin: 30,
            nav: true,
            dots: false,
            autoplayHoverPause: true,
            autoplay: false,
            singleItem: true,
            navText: [
                '<i class="fa fa-angle-left" aria-hidden="true"></i>',
                '<i class="fa fa-angle-right" aria-hidden="true"></i>'
            ],
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 2
                },
                991: {
                    items: 3
                },
                1170: {
                    items: 3
                }
            }

        });

        //Blog Carousel
        $('.blog-slider').owlCarousel({
            loop: false,
            margin: 30,
            nav: true,
            dots: false,
            autoplayHoverPause: true,
            autoplay: false,
            singleItem: true,
            navText: [
                '<i class="fa fa-angle-left" aria-hidden="true"></i>',
                '<i class="fa fa-angle-right" aria-hidden="true"></i>'
            ],
            responsive: {
                0: {
                    items: 1
                },
                400: {
                    items: 1
                },
                600: {
                    items: 2
                },
                991: {
                    items: 3
                },
                1170: {
                    items: 3
                }
            }

        });

        //Brand Logo Carousel
        $('.brand-logo-carousel').owlCarousel({
            items: 6,
            loop: true,
            margin: 0,
            autoplay: true,
            autoplayHoverPause: true,
            singleItem: true,
            dots: false,
            nav: false,
            transitionStyle: true,
            responsive: {
                0: { items: 1 },
                250: { items: 1 },
                320: { items: 2 },
                480: { items: 3 },
                775: { items: 4 },
                991: { items: 6 },
                1170: { items: 6 }
            }
        });


        //Product page image slider with thumb (Slick Slider)
        var $sync1 = $(".product-image-slider"),
            $sync2 = $(".product-image-slider-thumbnails");

        $sync1.slick({
            dots: false,
            fade: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            adaptiveHeight: true,
            asNavFor: $sync2,
            infinite: false
        });
        $sync2.slick({
            slidesToShow: 4,
            slidesToScroll: 1,
            asNavFor: $sync1,
            dots: false,
            centerMode: false,
            focusOnSelect: true,
            infinite: false
        });

        var thumbPadding = $('.product-image-slider-thumbnails').find('button').hasClass('slick-arrow');
        if (thumbPadding) {
            $('.product-image-slider-thumbnails').css('padding-left', '30px');
            $('.product-image-slider-thumbnails').css('padding-right', '30px');
        } else {

            $('.product-image-slider-thumbnails').css('margin-left', '-7px');
            $('.product-image-slider-thumbnails').css('margin-right', '-7px');
        };


    });


    // ---------------------------------------------------------------------------------------------------------------------------->
    // Hero Slider ( Revolution Slider )  ||-----------
    // ---------------------------------------------------------------------------------------------------------------------------->
    revHeroSlider();
    function revHeroSlider() {

        var tpj = jQuery;
        var revapi1078;
        tpj(document).ready(function () {
            if (tpj("#rev_slider_1078_1").revolution == undefined) {
                revslider_showDoubleJqueryError("#rev_slider_1078_1");
            } else {
                revapi1078 = tpj("#rev_slider_1078_1").show().revolution({
                    sliderType: "standard",
                    jsFileLocation: "../plugins/rev_slider/js/",
                    sliderLayout: "fullwidth",
                    dottedOverlay: "none",
                    delay: 5000,
                    touchenabled: "on",

                    swipe_velocity: 0.7,
                    swipe_min_touches: 1,
                    swipe_max_touches: 1,
                    drag_block_vertical: false,
                    keyboardNavigation: 'on',

                    fullWidth: 'on',
                    fullScreen: 'off',

                    navigation: {
                        keyboardNavigation: "off",
                        keyboard_direction: "horizontal",
                        mouseScrollNavigation: "off",
                        mouseScrollReverse: "default",
                        onHoverStop: "off",
                        arrows: {
                            style: "zeus",
                            enable: true,
                            hide_onmobile: true,
                            hide_under: 1025,
                            hide_onleave: false,
                            tmp: '',
                            left: {
                                h_align: "left",
                                v_align: "center",
                                h_offset: 20,
                                v_offset: 0
                            },
                            right: {
                                h_align: "right",
                                v_align: "center",
                                h_offset: 20,
                                v_offset: 0
                            }
                        }
                    ,
                        bullets: {
                            enable: true,
                            hide_onmobile: false,
                            hide_over: 1025,
                            style: "metis",
                            hide_onleave: false,
                            direction: "horizontal",
                            h_align: "center",
                            v_align: "bottom",
                            h_offset: 0,
                            v_offset: 20,
                            space: 10,
                            tmp: ''
                        }
                    },
                    viewPort: {
                        enable: true,
                        outof: "pause",
                        visible_area: "80%",
                        presize: false
                    },
                    hideTimerBar: 'on',
                    responsiveLevels: [1240, 1024, 778, 480],
                    visibilityLevels: [1240, 1024, 778, 480],
                    gridwidth: [1240, 1024, 778, 480],
                    gridheight: [500, 500, 500, 400],
                    lazyType: "smart",
                    shadow: 0,
                    stopLoop: "off",
                    stopAfterLoops: -1,
                    stopAtSlide: -1,
                    shuffle: "off",
                    autoHeight: "off",
                    hideThumbsOnMobile: "off",
                    hideBulletsOnMobile: 'off',
                    hideArrowsOnMobile: 'off',

                    hideSliderAtLimit: 0,
                    hideCaptionAtLimit: 0,
                    hideAllCaptionAtLilmit: 0,
                    debugMode: false,
                    fallbacks: {
                        simplifyAll: "off",
                        nextSlideOnWindowFocus: "off",
                        disableFocusListener: false,
                    }
                });
            }
        });

    };

})(jQuery);