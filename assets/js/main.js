// ------------------------------------------------------------------------------ //
//
// Template name : Bootsnav - Multi Purpose Header
// Categorie : Bootstrap Menu in CSS
// Author : adamnurdin01
// Version : v.1.2
// Created : 2016-06-02
// Last update : 2016-10-19
//
// ------------------------------------------------------------------------------ //

(function ($) {
	"use strict";
    
    var bootsnav = {
        initialize: function() {
            this.event();
            this.hoverDropdown();
            this.navbarSticky();
            this.navbarScrollspy();
        },
        event : function(){
            
            // ------------------------------------------------------------------------------ //
            // Variable
            // ------------------------------------------------------------------------------ //
            var getNav = $("nav.navbar.bootsnav");
            
            // ------------------------------------------------------------------------------ //
            // Navbar Sticky 
            // ------------------------------------------------------------------------------ //
            var navSticky = getNav.hasClass("navbar-sticky");
            if( navSticky ){
                // Wraped navigation
                getNav.wrap("<div class='wrap-sticky'></div>");
            }   
            
            // ------------------------------------------------------------------------------ //
            // Navbar Center 
            // ------------------------------------------------------------------------------ //
            if( getNav.hasClass("brand-center")){                
                var postsArr = new Array(),
                    index = $("nav.brand-center"),
                    $postsList = index.find('ul.navbar-nav');
				
				index.prepend("<span class='storage-name' style='display:none;'></span>");
                
                //Create array of all posts in lists
                index.find('ul.navbar-nav > li').each(function(){
					if( $(this).hasClass("active") ){
						var getElement = $("a", this).eq(0).text();
						$(".storage-name").html(getElement);
					}
                    postsArr.push($(this).html());
                });
                
                //Split the array at this point. The original array is altered.
                var firstList = postsArr.splice(0, Math.round(postsArr.length / 2)),
                    secondList = postsArr,
                    ListHTML = '';
                
                var createHTML = function(list){
                    ListHTML = '';
                    for (var i = 0; i < list.length; i++) {
                        ListHTML += '<li>' + list[i] + '</li>'
                    }
                }
                
                //Generate HTML for first list
                createHTML(firstList);
                $postsList.html(ListHTML);
                index.find("ul.nav").first().addClass("navbar-left");
                
                //Generate HTML for second list
                createHTML(secondList);
                //Create new list after original one
                $postsList.after('<ul class="nav navbar-nav"></ul>').next().html(ListHTML);
                index.find("ul.nav").last().addClass("navbar-right");
                
                //Wrap navigation menu
                index.find("ul.nav.navbar-left").wrap("<div class='col-half left'></div>");
                index.find("ul.nav.navbar-right").wrap("<div class='col-half right'></div>");
                
                //Selection Class
                index.find('ul.navbar-nav > li').each(function(){ 
                    var dropDown = $("ul.dropdown-menu", this),
                        megaMenu = $("ul.megamenu-content", this);
                    dropDown.closest("li").addClass("dropdown");
                    megaMenu.closest("li").addClass("megamenu-fw");
                });
				
				var getName = $(".storage-name").html();
				if( !getName == ""  ){
					$( "ul.navbar-nav > li:contains('" + getName + "')" ).addClass("active");
				}		
            } 
            
            
            // ------------------------------------------------------------------------------ //
            // Navbar Sidebar 
            // ------------------------------------------------------------------------------ //
            if( getNav.hasClass("navbar-sidebar")){
                // Add Class to body
                $("body").addClass("wrap-nav-sidebar");
                getNav.wrapInner("<div class='scroller'></div>");
            }else{
                $(".bootsnav").addClass("on");
            }
            
            // ------------------------------------------------------------------------------ //
            // Menu Center 
            // ------------------------------------------------------------------------------ //
            if( getNav.find("ul.nav").hasClass("navbar-center")){
                getNav.addClass("menu-center");
            }
            
            // ------------------------------------------------------------------------------ //
            // Navbar Full
            // ------------------------------------------------------------------------------ //
            if( getNav.hasClass("navbar-full")){
                // Add Class to body
                $("nav.navbar.bootsnav").find("ul.nav").wrap("<div class='wrap-full-menu'></div>");
                $(".wrap-full-menu").wrap("<div class='nav-full'></div>");
                $("ul.nav.navbar-nav").prepend("<li class='close-full-menu'><a href='#'><i class='fa fa-times'></i></a></li>");
            }else if( getNav.hasClass("navbar-mobile")){
                getNav.removeClass("no-full");
            }else{
                getNav.addClass("no-full");
            }
                
            // ------------------------------------------------------------------------------ //
            // Navbar Mobile
            // ------------------------------------------------------------------------------ //
            if( getNav.hasClass("navbar-mobile")){
                // Add Class to body
                $('.navbar-collapse').on('shown.bs.collapse', function() {
                    $("body").addClass("side-right");
                });
                $('.navbar-collapse').on('hide.bs.collapse', function() {
                    $("body").removeClass("side-right");
                });
                
                $(window).on("resize", function(){
                    $("body").removeClass("side-right");
                });
            }
            
            // ------------------------------------------------------------------------------ //
            // Navbar Fixed
            // ------------------------------------------------------------------------------ //
            if( getNav.hasClass("no-background")){
                $(window).on("scroll", function(){
                    var scrollTop = $(window).scrollTop();
                    if(scrollTop >34){
                        $(".navbar-fixed").removeClass("no-background");
                    }else {
                        $(".navbar-fixed").addClass("no-background");
                    }
                });
            }
            
            // ------------------------------------------------------------------------------ //
            // Navbar Fixed
            // ------------------------------------------------------------------------------ //
            if( getNav.hasClass("navbar-transparent")){
                $(window).on("scroll", function(){
                    var scrollTop = $(window).scrollTop();
                    if(scrollTop >34){
                        $(".navbar-fixed").removeClass("navbar-transparent");
                    }else {
                        $(".navbar-fixed").addClass("navbar-transparent");
                    }
                });
            }
            
            // ------------------------------------------------------------------------------ //
            // Button Cart
            // ------------------------------------------------------------------------------ //
            $(".btn-cart").on("click", function(e){
                e.stopPropagation();
            });
            
            // ------------------------------------------------------------------------------ //
            // Toggle Search
            // ------------------------------------------------------------------------------ //
            $("nav.navbar.bootsnav .attr-nav").each(function(){  
                $("li.search > a", this).on("click", function(e){
                    e.preventDefault();
                    $(".top-search").slideToggle();
                });
            });
            $(".input-group-addon.close-search").on("click", function(){
                $(".top-search").slideUp();
            });
            
            // ------------------------------------------------------------------------------ //
            // Toggle Side Menu
            // ------------------------------------------------------------------------------ //
            $("nav.navbar.bootsnav .attr-nav").each(function(){  
                $("li.side-menu > a", this).on("click", function(e){
                    e.preventDefault();
                    $("nav.navbar.bootsnav > .side").toggleClass("on");
                    $("body").toggleClass("on-side");
                });
            });
            $(".side .close-side").on("click", function(e){
                e.preventDefault();
                $("nav.navbar.bootsnav > .side").removeClass("on");
                $("body").removeClass("on-side");
            });  
            
            
            
            // ------------------------------------------------------------------------------ //
            // Wrapper
            // ------------------------------------------------------------------------------ //
            $("body").wrapInner( "<div class='wrapper'></div>");
        }, 
        

        // ------------------------------------------------------------------------------ //
        // Change dropdown to hover on dekstop
        // ------------------------------------------------------------------------------ //
        hoverDropdown : function(){
            var getNav = $("nav.navbar.bootsnav"),
                getWindow = $(window).width(),
                getHeight = $(window).height(),
                getIn = getNav.find("ul.nav").data("in"),
                getOut = getNav.find("ul.nav").data("out");
            
            if( getWindow < 991 ){
                
                // Height of scroll navigation sidebar
                $(".scroller").css("height", "auto");
                
                // Disable mouseenter event
                $("nav.navbar.bootsnav ul.nav").find("li.dropdown").off("mouseenter");
                $("nav.navbar.bootsnav ul.nav").find("li.dropdown").off("mouseleave");
                $("nav.navbar.bootsnav ul.nav").find(".title").off("mouseenter"); 
                $("nav.navbar.bootsnav ul.nav").off("mouseleave");    
                $(".navbar-collapse").removeClass("animated");
                
                // Enable click event
                $("nav.navbar.bootsnav ul.nav").each(function(){
                    $(".dropdown-menu", this).addClass("animated");
                    $(".dropdown-menu", this).removeClass(getOut);
                    
                    // Dropdown Fade Toggle
                    $("a.dropdown-toggle", this).off('click');
                    $("a.dropdown-toggle", this).on('click', function (e) {
                        e.stopPropagation();
                        $(this).closest("li.dropdown").find(".dropdown-menu").first().stop().fadeToggle().toggleClass(getIn);
                        $(this).closest("li.dropdown").first().toggleClass("on");                        
                        return false;
                    });   
                    
                    // Hidden dropdown action
                    $('li.dropdown', this).each(function () {
                        $(this).find(".dropdown-menu").stop().fadeOut();
                        $(this).on('hidden.bs.dropdown', function () {
                            $(this).find(".dropdown-menu").stop().fadeOut();
                        });
                        return false;
                    });

                    // Megamenu style
                    $(".megamenu-fw", this).each(function(){
                        $(".col-menu", this).each(function(){
                            $(".content", this).addClass("animated");
                            $(".content", this).stop().fadeOut();
                            $(".title", this).off("click");
                            $(".title", this).on("click", function(){
                                $(this).closest(".col-menu").find(".content").stop().fadeToggle().addClass(getIn);
                                $(this).closest(".col-menu").toggleClass("on");
                                return false;
                            });

                            $(".content", this).on("click", function(e){
                                e.stopPropagation();
                            });
                        });
                    });  
                }); 
                
                // Hidden dropdown
                var cleanOpen = function(){
                    $('li.dropdown', this).removeClass("on");
                    $(".dropdown-menu", this).stop().fadeOut();
                    $(".dropdown-menu", this).removeClass(getIn);
                    $(".col-menu", this).removeClass("on");
                    $(".col-menu .content", this).stop().fadeOut();
                    $(".col-menu .content", this).removeClass(getIn);
                }
                
                // Hidden om mouse leave
                $("nav.navbar.bootsnav").on("mouseleave", function(){
                    cleanOpen();
                });
                
                // Enable click atribute navigation
                $("nav.navbar.bootsnav .attr-nav").each(function(){  
                    $(".dropdown-menu", this).removeClass("animated");
                    $("li.dropdown", this).off("mouseenter");
                    $("li.dropdown", this).off("mouseleave");                    
                    $("a.dropdown-toggle", this).off('click');
                    $("a.dropdown-toggle", this).on('click', function (e) {
                        e.stopPropagation();
                        $(this).closest("li.dropdown").find(".dropdown-menu").first().stop().fadeToggle();
                        $(".navbar-toggle").each(function(){
                            $(".fa", this).removeClass("fa-times");
                            $(".fa", this).addClass("fa-bars");
                            $(".navbar-collapse").removeClass("in");
                            $(".navbar-collapse").removeClass("on");
                        });
                    });
                    
                    $(this).on("mouseleave", function(){
                        $(".dropdown-menu", this).stop().fadeOut();
                        $("li.dropdown", this).removeClass("on");
                        return false;
                    });
                });
                
                // Toggle Bars
                $(".navbar-toggle").each(function(){
                    $(this).off("click");
                    $(this).on("click", function(){
                        $(".fa", this).toggleClass("fa-bars");
                        $(".fa", this).toggleClass("fa-times");
                        cleanOpen();
                    });
                });

            }else if( getWindow > 991 ){
                // Height of scroll navigation sidebar
                $(".scroller").css("height", getHeight + "px");
                
                // Navbar Sidebar
                if( getNav.hasClass("navbar-sidebar")){
                    // Hover effect Sidebar Menu
                    $("nav.navbar.bootsnav ul.nav").each(function(){  
                        $("a.dropdown-toggle", this).off('click');
                        $("a.dropdown-toggle", this).on('click', function (e) {
                            e.stopPropagation();
                        }); 

                        $(".dropdown-menu", this).addClass("animated");
                        $("li.dropdown", this).on("mouseenter", function(){
                            $(".dropdown-menu", this).eq(0).removeClass(getOut);
                            $(".dropdown-menu", this).eq(0).stop().fadeIn().addClass(getIn);
                            $(this).addClass("on");
                            return false;
                        });
                        
                        $(".col-menu").each(function(){
                            $(".content", this).addClass("animated");
                            $(".title", this).on("mouseenter", function(){
                                $(this).closest(".col-menu").find(".content").stop().fadeIn().addClass(getIn);
                                $(this).closest(".col-menu").addClass("on");
                                return false;
                            });
                        });
                        
                        $(this).on("mouseleave", function(){
                            $(".dropdown-menu", this).stop().removeClass(getIn);
                            $(".dropdown-menu", this).stop().addClass(getOut).fadeOut();
                            $(".col-menu", this).find(".content").stop().fadeOut().removeClass(getIn);
                            $(".col-menu", this).removeClass("on");
                            $("li.dropdown", this).removeClass("on");
                            return false;
                        });
                    }); 
                }else{
                    // Hover effect Default Menu
                    $("nav.navbar.bootsnav ul.nav").each(function(){  
                        $("a.dropdown-toggle", this).off('click');
                        $("a.dropdown-toggle", this).on('click', function (e) {
                            e.stopPropagation();
                        }); 

                        $(".megamenu-fw", this).each(function(){
                            $(".title", this).off("click");
                            $("a.dropdown-toggle", this).off("click");
                            $(".content").removeClass("animated");
                        });

                        $(".dropdown-menu", this).addClass("animated");
                        $("li.dropdown", this).on("mouseenter", function(){
                            $(".dropdown-menu", this).eq(0).removeClass(getOut);
                            $(".dropdown-menu", this).eq(0).stop().fadeIn().addClass(getIn);
                            $(this).addClass("on");
                            return false;
                        });

                        $("li.dropdown", this).on("mouseleave", function(){
                            $(".dropdown-menu", this).eq(0).removeClass(getIn);
                            $(".dropdown-menu", this).eq(0).stop().fadeOut().addClass(getOut);
                            $(this).removeClass("on");
                        });

                        $(this).on("mouseleave", function(){
                            $(".dropdown-menu", this).removeClass(getIn);
                            $(".dropdown-menu", this).eq(0).stop().fadeOut().addClass(getOut);
                            $("li.dropdown", this).removeClass("on");
                            return false;
                        });
                    });
                }
                
                // ------------------------------------------------------------------------------ //
                // Hover effect Atribute Navigation
                // ------------------------------------------------------------------------------ //
                $("nav.navbar.bootsnav .attr-nav").each(function(){                      
                    $("a.dropdown-toggle", this).off('click');
                    $("a.dropdown-toggle", this).on('click', function (e) {
                        e.stopPropagation();
                    }); 
                    
                    $(".dropdown-menu", this).addClass("animated");
                    $("li.dropdown", this).on("mouseenter", function(){
                        $(".dropdown-menu", this).eq(0).removeClass(getOut);
                        $(".dropdown-menu", this).eq(0).stop().fadeIn().addClass(getIn);
                        $(this).addClass("on");
                        return false;
                    });

                    $("li.dropdown", this).on("mouseleave", function(){
                        $(".dropdown-menu", this).eq(0).removeClass(getIn);
                        $(".dropdown-menu", this).eq(0).stop().fadeOut().addClass(getOut);
                        $(this).removeClass("on");
                    });

                    $(this).on("mouseleave", function(){
                        $(".dropdown-menu", this).removeClass(getIn);
                        $(".dropdown-menu", this).eq(0).stop().fadeOut().addClass(getOut);
                        $("li.dropdown", this).removeClass("on");
                        return false;
                    });
                });
            }
            
            // ------------------------------------------------------------------------------ //
            // Menu Fullscreen
            // ------------------------------------------------------------------------------ //
            if( getNav.hasClass("navbar-full")){
                var windowHeight = $(window).height(),
                    windowWidth =  $(window).width();

                $(".nav-full").css("height", windowHeight + "px");
                $(".wrap-full-menu").css("height", windowHeight + "px");
                $(".wrap-full-menu").css("width", windowWidth + "px");
                
                $(".navbar-collapse").addClass("animated");
                $(".navbar-toggle").each(function(){
                    var getId = $(this).data("target");
                    $(this).off("click");
                    $(this).on("click", function(e){
                        e.preventDefault();
                        $(getId).removeClass(getOut);
                        $(getId).addClass("in");
                        $(getId).addClass(getIn);
                        return false;
                    });
                    
                    $("li.close-full-menu").on("click", function(e){
                        e.preventDefault();
                        $(getId).addClass(getOut);
                        setTimeout(function(){
                            $(getId).removeClass("in");
                            $(getId).removeClass(getIn);
                        }, 500);
                        return false;
                    });
                });
            }
        },
        
        // ------------------------------------------------------------------------------ //
        // Navbar Sticky
        // ------------------------------------------------------------------------------ //
        navbarSticky : function(){  
            var getNav = $("nav.navbar.bootsnav"),
                navSticky = getNav.hasClass("navbar-sticky");
            
            if( navSticky ){
                
                // Set Height Navigation
                var getHeight = getNav.height();             
                $(".wrap-sticky").height(getHeight);
                
                // Windown on scroll
                var getOffset = $(".wrap-sticky").offset().top;
                $(window).on("scroll", function(){  
                    var scrollTop = $(window).scrollTop();
                    if(scrollTop > getOffset){
                        getNav.addClass("sticked");
                    }else {
                        getNav.removeClass("sticked");
                    }
                });
            }   
        },
        
        // ------------------------------------------------------------------------------ //
        // Navbar Scrollspy
        // ------------------------------------------------------------------------------ //
        navbarScrollspy : function(){ 
            var navScrollSpy = $(".navbar-scrollspy"),
                $body   = $('body'), 
                getNav = $('nav.navbar.bootsnav'),
                offset  = getNav.outerHeight();
            
            if( navScrollSpy.length ){
                $body.scrollspy({target: '.navbar', offset: offset });
                
                // Animation Scrollspy
                $('.scroll').on('click', function(event) {
                    event.preventDefault();

                    // Active link
                    $('.scroll').removeClass("active");
                    $(this).addClass("active");

                    // Remove navbar collapse
                    $(".navbar-collapse").removeClass("in");

                    // Toggle Bars
                    $(".navbar-toggle").each(function(){
                        $(".fa", this).removeClass("fa-times");
                        $(".fa", this).addClass("fa-bars");
                    });

                    // Scroll
                    var scrollTop = $(window).scrollTop(),
                        $anchor = $(this).find('a'),
                        $section = $($anchor.attr('href')).offset().top,
                        $window = $(window).width(),
                        $minusDesktop = getNav.data("minus-value-desktop"),
                        $minusMobile = getNav.data("minus-value-mobile"),
                        $speed = getNav.data("speed");
                    
                    if( $window > 992 ){
                        var $position = $section - $minusDesktop;
                    }else{
                        var $position = $section - $minusMobile;
                    }             
                        
                    $('html, body').stop().animate({
                        scrollTop: $position
                    }, $speed);
                });
                
                // Activate Navigation
                var fixSpy = function() {
                    var data = $body.data('bs.scrollspy');
                    if (data) {
                        offset = getNav.outerHeight();
                        data.options.offset = offset;
                        $body.data('bs.scrollspy', data);
                        $body.scrollspy('refresh');
                    }
                }
                
                // Activate Navigation on resize
                var resizeTimer;
                $(window).on('resize', function() {
                    clearTimeout(resizeTimer);
                    var resizeTimer = setTimeout(fixSpy, 200);
                });
            }
        }
    };
    
    // Initialize
    $(document).ready(function(){
        bootsnav.initialize();
    });
    
    // Reset on resize
    $(window).on("resize", function(){   
        bootsnav.hoverDropdown();
        setTimeout(function(){
            bootsnav.navbarSticky();
        }, 500);
        
        // Toggle Bars
        $(".navbar-toggle").each(function(){
            $(".fa", this).removeClass("fa-times");
            $(".fa", this).addClass("fa-bars");
            $(this).removeClass("fixed");
        });        
        $(".navbar-collapse").removeClass("in");
        $(".navbar-collapse").removeClass("on");
        $(".navbar-collapse").removeClass("bounceIn");      
    });
    
}(jQuery));


$(document).ready(function(){
	"use strict";
    
        /*==================================
* Author        : "ThemeSine"
* Template Name : Khanas HTML Template
* Version       : 1.0
==================================== */



/*=========== TABLE OF CONTENTS ===========
1. Scroll To Top 
2. Smooth Scroll spy
3. Progress-bar
4. owl carousel
5. welcome animation support
======================================*/

    // 1. Scroll To Top 
		$(window).on('scroll',function () {
			if ($(this).scrollTop() > 600) {
				$('.return-to-top').fadeIn();
			} else {
				$('.return-to-top').fadeOut();
			}
		});
		$('.return-to-top').on('click',function(){
				$('html, body').animate({
				scrollTop: 0
			}, 1500);
			return false;
		});
	
	
	
	// 2. Smooth Scroll spy
		
		$('.header-area').sticky({
           topSpacing:0
        });
		
		//=============

		$('li.smooth-menu a').bind("click", function(event) {
			event.preventDefault();
			var anchor = $(this);
			$('html, body').stop().animate({
				scrollTop: $(anchor.attr('href')).offset().top - 0
			}, 1200,'easeInOutExpo');
		});
		
		$('body').scrollspy({
			target:'.navbar-collapse',
			offset:0
		});

	// 3. Progress-bar
	
		var dataToggleTooTip = $('[data-toggle="tooltip"]');
		var progressBar = $(".progress-bar");
		if (progressBar.length) {
			progressBar.appear(function () {
				dataToggleTooTip.tooltip({
					trigger: 'manual'
				}).tooltip('show');
				progressBar.each(function () {
					var each_bar_width = $(this).attr('aria-valuenow');
					$(this).width(each_bar_width + '%');
				});
			});
		}
	
	// 4. owl carousel
	
		// i. client (carousel)
		
			$('#client').owlCarousel({
				items:7,
				loop:true,
				smartSpeed: 1000,
				autoplay:true,
				dots:false,
				autoplayHoverPause:true,
				responsive:{
						0:{
							items:2
						},
						415:{
							items:2
						},
						600:{
							items:4

						},
						1199:{
							items:4
						},
						1200:{
							items:7
						}
					}
				});
				
				
				$('.play').on('click',function(){
					owl.trigger('play.owl.autoplay',[1000])
				})
				$('.stop').on('click',function(){
					owl.trigger('stop.owl.autoplay')
				})


    // 5. welcome animation support

        $(window).load(function(){
        	$(".header-text h2,.header-text p").removeClass("animated fadeInUp").css({'opacity':'0'});
            $(".header-text a").removeClass("animated fadeInDown").css({'opacity':'0'});
        });

        $(window).load(function(){
        	$(".header-text h2,.header-text p").addClass("animated fadeInUp").css({'opacity':'0'});
            $(".header-text a").addClass("animated fadeInDown").css({'opacity':'0'});
        });

});	
	
'use strict';
!function($, window, document, undefined) {
    /**
     * @param {?} element
     * @param {?} options
     * @return {undefined}
     */
    function Owl(element, options) {
        /** @type {null} */
        this.settings = null;
        this.options = $.extend({}, Owl.Defaults, options);
        this.$element = $(element);
        this._handlers = {};
        this._plugins = {};
        this._supress = {};
        /** @type {null} */
        this._current = null;
        /** @type {null} */
        this._speed = null;
        /** @type {!Array} */
        this._coordinates = [];
        /** @type {null} */
        this._breakpoint = null;
        /** @type {null} */
        this._width = null;
        /** @type {!Array} */
        this._items = [];
        /** @type {!Array} */
        this._clones = [];
        /** @type {!Array} */
        this._mergers = [];
        /** @type {!Array} */
        this._widths = [];
        this._invalidated = {};
        /** @type {!Array} */
        this._pipe = [];
        this._drag = {
            time : null,
            target : null,
            pointer : null,
            stage : {
                start : null,
                current : null
            },
            direction : null
        };
        this._states = {
            current : {},
            tags : {
                initializing : ["busy"],
                animating : ["busy"],
                dragging : ["interacting"]
            }
        };
        $.each(["onResize", "onThrottledResize"], $.proxy(function(b, handler) {
            this._handlers[handler] = $.proxy(this[handler], this);
        }, this));
        $.each(Owl.Plugins, $.proxy(function(a, plugin) {
            this._plugins[a.charAt(0).toLowerCase() + a.slice(1)] = new plugin(this);
        }, this));
        $.each(Owl.Workers, $.proxy(function(b, worker) {
            this._pipe.push({
                filter : worker.filter,
                run : $.proxy(worker.run, this)
            });
        }, this));
        this.setup();
        this.initialize();
    }
    Owl.Defaults = {
        items : 3,
        loop : false,
        center : false,
        rewind : false,
        mouseDrag : true,
        touchDrag : true,
        pullDrag : true,
        freeDrag : false,
        margin : 0,
        stagePadding : 0,
        merge : false,
        mergeFit : true,
        autoWidth : false,
        startPosition : 0,
        rtl : false,
        smartSpeed : 250,
        fluidSpeed : false,
        dragEndSpeed : false,
        responsive : {},
        responsiveRefreshRate : 200,
        responsiveBaseElement : window,
        fallbackEasing : "swing",
        info : false,
        nestedItemSelector : false,
        itemElement : "div",
        stageElement : "div",
        refreshClass : "owl-refresh",
        loadedClass : "owl-loaded",
        loadingClass : "owl-loading",
        rtlClass : "owl-rtl",
        responsiveClass : "owl-responsive",
        dragClass : "owl-drag",
        itemClass : "owl-item",
        stageClass : "owl-stage",
        stageOuterClass : "owl-stage-outer",
        grabClass : "owl-grab"
    };
    Owl.Width = {
        Default : "default",
        Inner : "inner",
        Outer : "outer"
    };
    Owl.Type = {
        Event : "event",
        State : "state"
    };
    Owl.Plugins = {};
    /** @type {!Array} */
    Owl.Workers = [{
        filter : ["width", "settings"],
        run : function() {
            this._width = this.$element.width();
        }
    }, {
        filter : ["width", "items", "settings"],
        run : function(cache) {
            cache.current = this._items && this._items[this.relative(this._current)];
        }
    }, {
        filter : ["items", "settings"],
        run : function() {
            this.$stage.children(".cloned").remove();
        }
    }, {
        filter : ["width", "items", "settings"],
        run : function(cache) {
            var margin = this.settings.margin || "";
            /** @type {boolean} */
            var c = !this.settings.autoWidth;
            var rtl = this.settings.rtl;
            var css = {
                width : "auto",
                "margin-left" : rtl ? margin : "",
                "margin-right" : rtl ? "" : margin
            };
            if (!c) {
                this.$stage.children().css(css);
            }
            cache.css = css;
        }
    }, {
        filter : ["width", "items", "settings"],
        run : function(cache) {
            /** @type {number} */
            var width = (this.width() / this.settings.items).toFixed(3) - this.settings.margin;
            /** @type {null} */
            var merge = null;
            var iterator = this._items.length;
            /** @type {boolean} */
            var x_axis = !this.settings.autoWidth;
            /** @type {!Array} */
            var widths = [];
            cache.items = {
                merge : false,
                width : width
            };
            for (; iterator--;) {
                merge = this._mergers[iterator];
                merge = this.settings.mergeFit && Math.min(merge, this.settings.items) || merge;
                /** @type {boolean} */
                cache.items.merge = merge > 1 || cache.items.merge;
                widths[iterator] = x_axis ? width * merge : this._items[iterator].width();
            }
            /** @type {!Array} */
            this._widths = widths;
        }
    }, {
        filter : ["items", "settings"],
        run : function() {
            /** @type {!Array} */
            var clones = [];
            var items = this._items;
            var settings = this.settings;
            /** @type {number} */
            var view = Math.max(2 * settings.items, 4);
            /** @type {number} */
            var size = 2 * Math.ceil(items.length / 2);
            /** @type {number} */
            var c = settings.loop && items.length ? settings.rewind ? view : Math.max(view, size) : 0;
            /** @type {string} */
            var append = "";
            /** @type {string} */
            var prepend = "";
            /** @type {number} */
            c = c / 2;
            for (; c--;) {
                clones.push(this.normalize(clones.length / 2, true));
                /** @type {string} */
                append = append + items[clones[clones.length - 1]][0].outerHTML;
                clones.push(this.normalize(items.length - 1 - (clones.length - 1) / 2, true));
                /** @type {string} */
                prepend = items[clones[clones.length - 1]][0].outerHTML + prepend;
            }
            /** @type {!Array} */
            this._clones = clones;
            $(append).addClass("cloned").appendTo(this.$stage);
            $(prepend).addClass("cloned").prependTo(this.$stage);
        }
    }, {
        filter : ["width", "items", "settings"],
        run : function() {
            /** @type {number} */
            var rtl = this.settings.rtl ? 1 : -1;
            var size = this._clones.length + this._items.length;
            /** @type {number} */
            var iterator = -1;
            /** @type {number} */
            var previous = 0;
            /** @type {number} */
            var current = 0;
            /** @type {!Array} */
            var coordinates = [];
            for (; ++iterator < size;) {
                previous = coordinates[iterator - 1] || 0;
                current = this._widths[this.relative(iterator)] + this.settings.margin;
                coordinates.push(previous + current * rtl);
            }
            /** @type {!Array} */
            this._coordinates = coordinates;
        }
    }, {
        filter : ["width", "items", "settings"],
        run : function() {
            var padding = this.settings.stagePadding;
            var coordinates = this._coordinates;
            var css = {
                width : Math.ceil(Math.abs(coordinates[coordinates.length - 1])) + 2 * padding,
                "padding-left" : padding || "",
                "padding-right" : padding || ""
            };
            this.$stage.css(css);
        }
    }, {
        filter : ["width", "items", "settings"],
        run : function(cache) {
            var iterator = this._coordinates.length;
            /** @type {boolean} */
            var meta = !this.settings.autoWidth;
            var items = this.$stage.children();
            if (meta && cache.items.merge) {
                for (; iterator--;) {
                    cache.css.width = this._widths[this.relative(iterator)];
                    items.eq(iterator).css(cache.css);
                }
            } else {
                if (meta) {
                    cache.css.width = cache.items.width;
                    items.css(cache.css);
                }
            }
        }
    }, {
        filter : ["items"],
        run : function() {
            if (this._coordinates.length < 1) {
                this.$stage.removeAttr("style");
            }
        }
    }, {
        filter : ["width", "items", "settings"],
        run : function(data) {
            data.current = data.current ? this.$stage.children().index(data.current) : 0;
            /** @type {number} */
            data.current = Math.max(this.minimum(), Math.min(this.maximum(), data.current));
            this.reset(data.current);
        }
    }, {
        filter : ["position"],
        run : function() {
            this.animate(this.coordinates(this._current));
        }
    }, {
        filter : ["width", "position", "items", "settings"],
        run : function() {
            var outer;
            var inner;
            var i;
            var n;
            /** @type {number} */
            var rtl = this.settings.rtl ? 1 : -1;
            /** @type {number} */
            var padding = 2 * this.settings.stagePadding;
            var begin = this.coordinates(this.current()) + padding;
            var end = begin + this.width() * rtl;
            /** @type {!Array} */
            var drilldownLevelLabels = [];
            /** @type {number} */
            i = 0;
            n = this._coordinates.length;
            for (; n > i; i++) {
                outer = this._coordinates[i - 1] || 0;
                /** @type {number} */
                inner = Math.abs(this._coordinates[i]) + padding * rtl;
                if (this.op(outer, "<=", begin) && this.op(outer, ">", end) || this.op(inner, "<", begin) && this.op(inner, ">", end)) {
                    drilldownLevelLabels.push(i);
                }
            }
            this.$stage.children(".active").removeClass("active");
            this.$stage.children(":eq(" + drilldownLevelLabels.join("), :eq(") + ")").addClass("active");
            if (this.settings.center) {
                this.$stage.children(".center").removeClass("center");
                this.$stage.children().eq(this.current()).addClass("center");
            }
        }
    }];
    /**
     * @return {undefined}
     */
    Owl.prototype.initialize = function() {
        if (this.enter("initializing"), this.trigger("initialize"), this.$element.toggleClass(this.settings.rtlClass, this.settings.rtl), this.settings.autoWidth && !this.is("pre-loading")) {
            var imgs;
            var nestedSelector;
            var maxAge;
            imgs = this.$element.find("img");
            nestedSelector = this.settings.nestedItemSelector ? "." + this.settings.nestedItemSelector : undefined;
            maxAge = this.$element.children(nestedSelector).width();
            if (imgs.length && 0 >= maxAge) {
                this.preloadAutoWidthImages(imgs);
            }
        }
        this.$element.addClass(this.options.loadingClass);
        this.$stage = $("<" + this.settings.stageElement + ' class="' + this.settings.stageClass + '"/>').wrap('<div class="' + this.settings.stageOuterClass + '"/>');
        this.$element.append(this.$stage.parent());
        this.replace(this.$element.children().not(this.$stage.parent()));
        if (this.$element.is(":visible")) {
            this.refresh();
        } else {
            this.invalidate("width");
        }
        this.$element.removeClass(this.options.loadingClass).addClass(this.options.loadedClass);
        this.registerEventHandlers();
        this.leave("initializing");
        this.trigger("initialized");
    };
    /**
     * @return {undefined}
     */
    Owl.prototype.setup = function() {
        var trackPos = this.viewport();
        var options = this.options.responsive;
        /** @type {number} */
        var to = -1;
        /** @type {null} */
        var settings = null;
        if (options) {
            $.each(options, function(from) {
                if (trackPos >= from && from > to) {
                    /** @type {number} */
                    to = Number(from);
                }
            });
            settings = $.extend({}, this.options, options[to]);
            if ("function" == typeof settings.stagePadding) {
                settings.stagePadding = settings.stagePadding();
            }
            delete settings.responsive;
            if (settings.responsiveClass) {
                this.$element.attr("class", this.$element.attr("class").replace(new RegExp("(" + this.options.responsiveClass + "-)\\S+\\s", "g"), "$1" + to));
            }
        } else {
            settings = $.extend({}, this.options);
        }
        this.trigger("change", {
            property : {
                name : "settings",
                value : settings
            }
        });
        this._breakpoint = to;
        /** @type {null} */
        this.settings = settings;
        this.invalidate("settings");
        this.trigger("changed", {
            property : {
                name : "settings",
                value : this.settings
            }
        });
    };
    /**
     * @return {undefined}
     */
    Owl.prototype.optionsLogic = function() {
        if (this.settings.autoWidth) {
            /** @type {boolean} */
            this.settings.stagePadding = false;
            /** @type {boolean} */
            this.settings.merge = false;
        }
    };
    /**
     * @param {string} data
     * @return {?}
     */
    Owl.prototype.prepare = function(data) {
        var event = this.trigger("prepare", {
            content : data
        });
        return event.data || (event.data = $("<" + this.settings.itemElement + "/>").addClass(this.options.itemClass).append(data)), this.trigger("prepared", {
            content : event.data
        }), event.data;
    };
    /**
     * @return {undefined}
     */
    Owl.prototype.update = function() {
        /** @type {number} */
        var i = 0;
        var n = this._pipe.length;
        var filter = $.proxy(function(ballNumber) {
            return this[ballNumber];
        }, this._invalidated);
        var cacheData = {};
        for (; n > i;) {
            if (this._invalidated.all || $.grep(this._pipe[i].filter, filter).length > 0) {
                this._pipe[i].run(cacheData);
            }
            i++;
        }
        this._invalidated = {};
        if (!this.is("valid")) {
            this.enter("valid");
        }
    };
    /**
     * @param {number} dimension
     * @return {?}
     */
    Owl.prototype.width = function(dimension) {
        switch(dimension = dimension || Owl.Width.Default) {
            case Owl.Width.Inner:
            case Owl.Width.Outer:
                return this._width;
            default:
                return this._width - 2 * this.settings.stagePadding + this.settings.margin;
        }
    };
    /**
     * @return {undefined}
     */
    Owl.prototype.refresh = function() {
        this.enter("refreshing");
        this.trigger("refresh");
        this.setup();
        this.optionsLogic();
        this.$element.addClass(this.options.refreshClass);
        this.update();
        this.$element.removeClass(this.options.refreshClass);
        this.leave("refreshing");
        this.trigger("refreshed");
    };
    /**
     * @return {undefined}
     */
    Owl.prototype.onThrottledResize = function() {
        window.clearTimeout(this.resizeTimer);
        this.resizeTimer = window.setTimeout(this._handlers.onResize, this.settings.responsiveRefreshRate);
    };
    /**
     * @return {?}
     */
    Owl.prototype.onResize = function() {
        return this._items.length ? this._width === this.$element.width() ? false : this.$element.is(":visible") ? (this.enter("resizing"), this.trigger("resize").isDefaultPrevented() ? (this.leave("resizing"), false) : (this.invalidate("width"), this.refresh(), this.leave("resizing"), void this.trigger("resized"))) : false : false;
    };
    /**
     * @return {undefined}
     */
    Owl.prototype.registerEventHandlers = function() {
        if ($.support.transition) {
            this.$stage.on($.support.transition.end + ".owl.core", $.proxy(this.onTransitionEnd, this));
        }
        if (this.settings.responsive !== false) {
            this.on(window, "resize", this._handlers.onThrottledResize);
        }
        if (this.settings.mouseDrag) {
            this.$element.addClass(this.options.dragClass);
            this.$stage.on("mousedown.owl.core", $.proxy(this.onDragStart, this));
            this.$stage.on("dragstart.owl.core selectstart.owl.core", function() {
                return false;
            });
        }
        if (this.settings.touchDrag) {
            this.$stage.on("touchstart.owl.core", $.proxy(this.onDragStart, this));
            this.$stage.on("touchcancel.owl.core", $.proxy(this.onDragEnd, this));
        }
    };
    /**
     * @param {!Object} event
     * @return {undefined}
     */
    Owl.prototype.onDragStart = function(event) {
        /** @type {null} */
        var stage = null;
        if (3 !== event.which) {
            if ($.support.transform) {
                stage = this.$stage.css("transform").replace(/.*\(|\)| /g, "").split(",");
                stage = {
                    x : stage[16 === stage.length ? 12 : 4],
                    y : stage[16 === stage.length ? 13 : 5]
                };
            } else {
                stage = this.$stage.position();
                stage = {
                    x : this.settings.rtl ? stage.left + this.$stage.width() - this.width() + this.settings.margin : stage.left,
                    y : stage.top
                };
            }
            if (this.is("animating")) {
                if ($.support.transform) {
                    this.animate(stage.x);
                } else {
                    this.$stage.stop();
                }
                this.invalidate("position");
            }
            this.$element.toggleClass(this.options.grabClass, "mousedown" === event.type);
            this.speed(0);
            /** @type {number} */
            this._drag.time = (new Date).getTime();
            this._drag.target = $(event.target);
            /** @type {null} */
            this._drag.stage.start = stage;
            /** @type {null} */
            this._drag.stage.current = stage;
            this._drag.pointer = this.pointer(event);
            $(document).on("mouseup.owl.core touchend.owl.core", $.proxy(this.onDragEnd, this));
            $(document).one("mousemove.owl.core touchmove.owl.core", $.proxy(function(event) {
                var delta = this.difference(this._drag.pointer, this.pointer(event));
                $(document).on("mousemove.owl.core touchmove.owl.core", $.proxy(this.onDragMove, this));
                if (!(Math.abs(delta.x) < Math.abs(delta.y) && this.is("valid"))) {
                    event.preventDefault();
                    this.enter("dragging");
                    this.trigger("drag");
                }
            }, this));
        }
    };
    /**
     * @param {!Object} event
     * @return {undefined}
     */
    Owl.prototype.onDragMove = function(event) {
        /** @type {null} */
        var minimum = null;
        /** @type {null} */
        var maximum = null;
        /** @type {null} */
        var pull = null;
        var delta = this.difference(this._drag.pointer, this.pointer(event));
        var stage = this.difference(this._drag.stage.start, delta);
        if (this.is("dragging")) {
            event.preventDefault();
            if (this.settings.loop) {
                minimum = this.coordinates(this.minimum());
                /** @type {number} */
                maximum = this.coordinates(this.maximum() + 1) - minimum;
                stage.x = ((stage.x - minimum) % maximum + maximum) % maximum + minimum;
            } else {
                minimum = this.settings.rtl ? this.coordinates(this.maximum()) : this.coordinates(this.minimum());
                maximum = this.settings.rtl ? this.coordinates(this.minimum()) : this.coordinates(this.maximum());
                /** @type {number} */
                pull = this.settings.pullDrag ? -1 * delta.x / 5 : 0;
                /** @type {number} */
                stage.x = Math.max(Math.min(stage.x, minimum + pull), maximum + pull);
            }
            this._drag.stage.current = stage;
            this.animate(stage.x);
        }
    };
    /**
     * @param {!Object} event
     * @return {undefined}
     */
    Owl.prototype.onDragEnd = function(event) {
        var delta = this.difference(this._drag.pointer, this.pointer(event));
        var stage = this._drag.stage.current;
        /** @type {string} */
        var direction = delta.x > 0 ^ this.settings.rtl ? "left" : "right";
        $(document).off(".owl.core");
        this.$element.removeClass(this.options.grabClass);
        if (0 !== delta.x && this.is("dragging") || !this.is("valid")) {
            this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed);
            this.current(this.closest(stage.x, 0 !== delta.x ? direction : this._drag.direction));
            this.invalidate("position");
            this.update();
            /** @type {string} */
            this._drag.direction = direction;
            if (Math.abs(delta.x) > 3 || (new Date).getTime() - this._drag.time > 300) {
                this._drag.target.one("click.owl.core", function() {
                    return false;
                });
            }
        }
        if (this.is("dragging")) {
            this.leave("dragging");
            this.trigger("dragged");
        }
    };
    /**
     * @param {string} coordinate
     * @param {string} left
     * @return {?}
     */
    Owl.prototype.closest = function(coordinate, left) {
        /** @type {number} */
        var position = -1;
        /** @type {number} */
        var pull = 30;
        var width = this.width();
        var coordinates = this.coordinates();
        return this.settings.freeDrag || $.each(coordinates, $.proxy(function(index, value) {
            return "left" === left && coordinate > value - pull && value + pull > coordinate ? position = index : "right" === left && coordinate > value - width - pull && value - width + pull > coordinate ? position = index + 1 : this.op(coordinate, "<", value) && this.op(coordinate, ">", coordinates[index + 1] || value - width) && (position = "left" === left ? index + 1 : index), -1 === position;
        }, this)), this.settings.loop || (this.op(coordinate, ">", coordinates[this.minimum()]) ? position = coordinate = this.minimum() : this.op(coordinate, "<", coordinates[this.maximum()]) && (position = coordinate = this.maximum())), position;
    };
    /**
     * @param {string} coordinate
     * @return {undefined}
     */
    Owl.prototype.animate = function(coordinate) {
        /** @type {boolean} */
        var c = this.speed() > 0;
        if (this.is("animating")) {
            this.onTransitionEnd();
        }
        if (c) {
            this.enter("animating");
            this.trigger("translate");
        }
        if ($.support.transform3d && $.support.transition) {
            this.$stage.css({
                transform : "translate3d(" + coordinate + "px,0px,0px)",
                transition : this.speed() / 1E3 + "s"
            });
        } else {
            if (c) {
                this.$stage.animate({
                    left : coordinate + "px"
                }, this.speed(), this.settings.fallbackEasing, $.proxy(this.onTransitionEnd, this));
            } else {
                this.$stage.css({
                    left : coordinate + "px"
                });
            }
        }
    };
    /**
     * @param {string} state
     * @return {?}
     */
    Owl.prototype.is = function(state) {
        return this._states.current[state] && this._states.current[state] > 0;
    };
    /**
     * @param {number} position
     * @return {?}
     */
    Owl.prototype.current = function(position) {
        if (position === undefined) {
            return this._current;
        }
        if (0 === this._items.length) {
            return undefined;
        }
        if (position = this.normalize(position), this._current !== position) {
            var event = this.trigger("change", {
                property : {
                    name : "position",
                    value : position
                }
            });
            if (event.data !== undefined) {
                position = this.normalize(event.data);
            }
            /** @type {number} */
            this._current = position;
            this.invalidate("position");
            this.trigger("changed", {
                property : {
                    name : "position",
                    value : this._current
                }
            });
        }
        return this._current;
    };
    /**
     * @param {string} part
     * @return {?}
     */
    Owl.prototype.invalidate = function(part) {
        return "string" === $.type(part) && (this._invalidated[part] = true, this.is("valid") && this.leave("valid")), $.map(this._invalidated, function(a, i) {
            return i;
        });
    };
    /**
     * @param {number} position
     * @return {undefined}
     */
    Owl.prototype.reset = function(position) {
        position = this.normalize(position);
        if (position !== undefined) {
            /** @type {number} */
            this._speed = 0;
            /** @type {number} */
            this._current = position;
            this.suppress(["translate", "translated"]);
            this.animate(this.coordinates(position));
            this.release(["translate", "translated"]);
        }
    };
    /**
     * @param {number} position
     * @param {boolean} relative
     * @return {?}
     */
    Owl.prototype.normalize = function(position, relative) {
        var n = this._items.length;
        var m = relative ? 0 : this._clones.length;
        return !this.isNumeric(position) || 1 > n ? position = undefined : (0 > position || position >= n + m) && (position = ((position - m / 2) % n + n) % n + m / 2), position;
    };
    /**
     * @param {number} e
     * @return {?}
     */
    Owl.prototype.relative = function(e) {
        return e = e - this._clones.length / 2, this.normalize(e, true);
    };
    /**
     * @param {boolean} events
     * @return {?}
     */
    Owl.prototype.maximum = function(events) {
        var iterator;
        var averageImageArea;
        var MinimumAverageImageArea;
        var settings = this.settings;
        var maximum = this._coordinates.length;
        if (settings.loop) {
            /** @type {number} */
            maximum = this._clones.length / 2 + this._items.length - 1;
        } else {
            if (settings.autoWidth || settings.merge) {
                iterator = this._items.length;
                averageImageArea = this._items[--iterator].width();
                MinimumAverageImageArea = this.$element.width();
                for (; iterator-- && (averageImageArea = averageImageArea + (this._items[iterator].width() + this.settings.margin), !(averageImageArea > MinimumAverageImageArea));) {
                }
                maximum = iterator + 1;
            } else {
                /** @type {number} */
                maximum = settings.center ? this._items.length - 1 : this._items.length - settings.items;
            }
        }
        return events && (maximum = maximum - this._clones.length / 2), Math.max(maximum, 0);
    };
    /**
     * @param {boolean} first
     * @return {?}
     */
    Owl.prototype.minimum = function(first) {
        return first ? 0 : this._clones.length / 2;
    };
    /**
     * @param {number} position
     * @return {?}
     */
    Owl.prototype.items = function(position) {
        return position === undefined ? this._items.slice() : (position = this.normalize(position, true), this._items[position]);
    };
    /**
     * @param {number} position
     * @return {?}
     */
    Owl.prototype.mergers = function(position) {
        return position === undefined ? this._mergers.slice() : (position = this.normalize(position, true), this._mergers[position]);
    };
    /**
     * @param {number} position
     * @return {?}
     */
    Owl.prototype.clones = function(position) {
        /** @type {number} */
        var odd = this._clones.length / 2;
        var even = odd + this._items.length;
        /**
         * @param {number} index
         * @return {?}
         */
        var map = function(index) {
            return index % 2 === 0 ? even + index / 2 : odd - (index + 1) / 2;
        };
        return position === undefined ? $.map(this._clones, function(a, b) {
            return map(b);
        }) : $.map(this._clones, function(v, i) {
            return v === position ? map(i) : null;
        });
    };
    /**
     * @param {number} speed
     * @return {?}
     */
    Owl.prototype.speed = function(speed) {
        return speed !== undefined && (this._speed = speed), this._speed;
    };
    /**
     * @param {number} position
     * @return {?}
     */
    Owl.prototype.coordinates = function(position) {
        var coordinate;
        /** @type {number} */
        var multiplier = 1;
        /** @type {number} */
        var newPosition = position - 1;
        return position === undefined ? $.map(this._coordinates, $.proxy(function(a, position) {
            return this.coordinates(position);
        }, this)) : (this.settings.center ? (this.settings.rtl && (multiplier = -1, newPosition = position + 1), coordinate = this._coordinates[position], coordinate = coordinate + (this.width() - coordinate + (this._coordinates[newPosition] || 0)) / 2 * multiplier) : coordinate = this._coordinates[newPosition] || 0, coordinate = Math.ceil(coordinate));
    };
    /**
     * @param {number} a
     * @param {number} b
     * @param {number} factor
     * @return {?}
     */
    Owl.prototype.duration = function(a, b, factor) {
        return 0 === factor ? 0 : Math.min(Math.max(Math.abs(b - a), 1), 6) * Math.abs(factor || this.settings.smartSpeed);
    };
    /**
     * @param {number} position
     * @param {boolean} speed
     * @return {undefined}
     */
    Owl.prototype.to = function(position, speed) {
        var current = this.current();
        /** @type {null} */
        var revert = null;
        /** @type {number} */
        var distance = position - this.relative(current);
        /** @type {number} */
        var f = (distance > 0) - (0 > distance);
        var items = this._items.length;
        var minimum = this.minimum();
        var maximum = this.maximum();
        if (this.settings.loop) {
            if (!this.settings.rewind && Math.abs(distance) > items / 2) {
                /** @type {number} */
                distance = distance + -1 * f * items;
            }
            position = current + distance;
            revert = ((position - minimum) % items + items) % items + minimum;
            if (revert !== position && maximum >= revert - distance && revert - distance > 0) {
                /** @type {number} */
                current = revert - distance;
                position = revert;
                this.reset(current);
            }
        } else {
            if (this.settings.rewind) {
                maximum = maximum + 1;
                /** @type {number} */
                position = (position % maximum + maximum) % maximum;
            } else {
                /** @type {number} */
                position = Math.max(minimum, Math.min(maximum, position));
            }
        }
        this.speed(this.duration(current, position, speed));
        this.current(position);
        if (this.$element.is(":visible")) {
            this.update();
        }
    };
    /**
     * @param {boolean} speed
     * @return {undefined}
     */
    Owl.prototype.next = function(speed) {
        speed = speed || false;
        this.to(this.relative(this.current()) + 1, speed);
    };
    /**
     * @param {boolean} speed
     * @return {undefined}
     */
    Owl.prototype.prev = function(speed) {
        speed = speed || false;
        this.to(this.relative(this.current()) - 1, speed);
    };
    /**
     * @param {!Event} event
     * @return {?}
     */
    Owl.prototype.onTransitionEnd = function(event) {
        return event !== undefined && (event.stopPropagation(), (event.target || event.srcElement || event.originalTarget) !== this.$stage.get(0)) ? false : (this.leave("animating"), void this.trigger("translated"));
    };
    /**
     * @return {?}
     */
    Owl.prototype.viewport = function() {
        var width;
        if (this.options.responsiveBaseElement !== window) {
            width = $(this.options.responsiveBaseElement).width();
        } else {
            if (window.innerWidth) {
                width = window.innerWidth;
            } else {
                if (!document.documentElement || !document.documentElement.clientWidth) {
                    throw "Can not detect viewport width.";
                }
                /** @type {number} */
                width = document.documentElement.clientWidth;
            }
        }
        return width;
    };
    /**
     * @param {!Object} content
     * @return {undefined}
     */
    Owl.prototype.replace = function(content) {
        this.$stage.empty();
        /** @type {!Array} */
        this._items = [];
        if (content) {
            content = content instanceof jQuery ? content : $(content);
        }
        if (this.settings.nestedItemSelector) {
            content = content.find("." + this.settings.nestedItemSelector);
        }
        content.filter(function() {
            return 1 === this.nodeType;
        }).each($.proxy(function(a, item) {
            item = this.prepare(item);
            this.$stage.append(item);
            this._items.push(item);
            this._mergers.push(1 * item.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1);
        }, this));
        this.reset(this.isNumeric(this.settings.startPosition) ? this.settings.startPosition : 0);
        this.invalidate("items");
    };
    /**
     * @param {string} content
     * @param {number} position
     * @return {undefined}
     */
    Owl.prototype.add = function(content, position) {
        var current = this.relative(this._current);
        position = position === undefined ? this._items.length : this.normalize(position, true);
        content = content instanceof jQuery ? content : $(content);
        this.trigger("add", {
            content : content,
            position : position
        });
        content = this.prepare(content);
        if (0 === this._items.length || position === this._items.length) {
            if (0 === this._items.length) {
                this.$stage.append(content);
            }
            if (0 !== this._items.length) {
                this._items[position - 1].after(content);
            }
            this._items.push(content);
            this._mergers.push(1 * content.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1);
        } else {
            this._items[position].before(content);
            this._items.splice(position, 0, content);
            this._mergers.splice(position, 0, 1 * content.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1);
        }
        if (this._items[current]) {
            this.reset(this._items[current].index());
        }
        this.invalidate("items");
        this.trigger("added", {
            content : content,
            position : position
        });
    };
    /**
     * @param {number} position
     * @return {undefined}
     */
    Owl.prototype.remove = function(position) {
        position = this.normalize(position, true);
        if (position !== undefined) {
            this.trigger("remove", {
                content : this._items[position],
                position : position
            });
            this._items[position].remove();
            this._items.splice(position, 1);
            this._mergers.splice(position, 1);
            this.invalidate("items");
            this.trigger("removed", {
                content : null,
                position : position
            });
        }
    };
    /**
     * @param {!Object} images
     * @return {undefined}
     */
    Owl.prototype.preloadAutoWidthImages = function(images) {
        images.each($.proxy(function(b, element) {
            this.enter("pre-loading");
            element = $(element);
            $(new Image).one("load", $.proxy(function(texture) {
                element.attr("src", texture.target.src);
                element.css("opacity", 1);
                this.leave("pre-loading");
                if (!this.is("pre-loading") && !this.is("initializing")) {
                    this.refresh();
                }
            }, this)).attr("src", element.attr("src") || element.attr("data-src") || element.attr("data-src-retina"));
        }, this));
    };
    /**
     * @return {undefined}
     */
    Owl.prototype.destroy = function() {
        this.$element.off(".owl.core");
        this.$stage.off(".owl.core");
        $(document).off(".owl.core");
        if (this.settings.responsive !== false) {
            window.clearTimeout(this.resizeTimer);
            this.off(window, "resize", this._handlers.onThrottledResize);
        }
        var i;
        for (i in this._plugins) {
            this._plugins[i].destroy();
        }
        this.$stage.children(".cloned").remove();
        this.$stage.unwrap();
        this.$stage.children().contents().unwrap();
        this.$stage.children().unwrap();
        this.$element.removeClass(this.options.refreshClass).removeClass(this.options.loadingClass).removeClass(this.options.loadedClass).removeClass(this.options.rtlClass).removeClass(this.options.dragClass).removeClass(this.options.grabClass).attr("class", this.$element.attr("class").replace(new RegExp(this.options.responsiveClass + "-\\S+\\s", "g"), "")).removeData("owl.carousel");
    };
    /**
     * @param {string} a
     * @param {string} i
     * @param {string} b
     * @return {?}
     */
    Owl.prototype.op = function(a, i, b) {
        var rtl = this.settings.rtl;
        switch(i) {
            case "<":
                return rtl ? a > b : b > a;
            case ">":
                return rtl ? b > a : a > b;
            case ">=":
                return rtl ? b >= a : a >= b;
            case "<=":
                return rtl ? a >= b : b >= a;
        }
    };
    /**
     * @param {!Object} el
     * @param {string} type
     * @param {?} fn
     * @param {?} capture
     * @return {undefined}
     */
    Owl.prototype.on = function(el, type, fn, capture) {
        if (el.addEventListener) {
            el.addEventListener(type, fn, capture);
        } else {
            if (el.attachEvent) {
                el.attachEvent("on" + type, fn);
            }
        }
    };
    /**
     * @param {!Object} target
     * @param {string} type
     * @param {?} callback
     * @param {?} useCapture
     * @return {undefined}
     */
    Owl.prototype.off = function(target, type, callback, useCapture) {
        if (target.removeEventListener) {
            target.removeEventListener(type, callback, useCapture);
        } else {
            if (target.detachEvent) {
                target.detachEvent("on" + type, callback);
            }
        }
    };
    /**
     * @param {string} name
     * @param {!Object} data
     * @param {string} namespace
     * @param {?} disX
     * @param {?} disY
     * @return {?}
     */
    Owl.prototype.trigger = function(name, data, namespace, disX, disY) {
        var status = {
            item : {
                count : this._items.length,
                index : this.current()
            }
        };
        var handler = $.camelCase($.grep(["on", name, namespace], function(match) {
            return match;
        }).join("-").toLowerCase());
        var event = $.Event([name, "owl", namespace || "carousel"].join(".").toLowerCase(), $.extend({
            relatedTarget : this
        }, status, data));
        return this._supress[name] || ($.each(this._plugins, function(a, options) {
            if (options.onTrigger) {
                options.onTrigger(event);
            }
        }), this.register({
            type : Owl.Type.Event,
            name : name
        }), this.$element.trigger(event), this.settings && "function" == typeof this.settings[handler] && this.settings[handler].call(this, event)), event;
    };
    /**
     * @param {string} name
     * @return {undefined}
     */
    Owl.prototype.enter = function(name) {
        $.each([name].concat(this._states.tags[name] || []), $.proxy(function(a, state) {
            if (this._states.current[state] === undefined) {
                /** @type {number} */
                this._states.current[state] = 0;
            }
            this._states.current[state]++;
        }, this));
    };
    /**
     * @param {string} name
     * @return {undefined}
     */
    Owl.prototype.leave = function(name) {
        $.each([name].concat(this._states.tags[name] || []), $.proxy(function(a, name) {
            this._states.current[name]--;
        }, this));
    };
    /**
     * @param {!Object} object
     * @return {undefined}
     */
    Owl.prototype.register = function(object) {
        if (object.type === Owl.Type.Event) {
            if ($.event.special[object.name] || ($.event.special[object.name] = {}), !$.event.special[object.name].owl) {
                var _default = $.event.special[object.name]._default;
                /**
                 * @param {!Object} data
                 * @return {?}
                 */
                $.event.special[object.name]._default = function(data) {
                    return !_default || !_default.apply || data.namespace && -1 !== data.namespace.indexOf("owl") ? data.namespace && data.namespace.indexOf("owl") > -1 : _default.apply(this, arguments);
                };
                /** @type {boolean} */
                $.event.special[object.name].owl = true;
            }
        } else {
            if (object.type === Owl.Type.State) {
                if (this._states.tags[object.name]) {
                    this._states.tags[object.name] = this._states.tags[object.name].concat(object.tags);
                } else {
                    this._states.tags[object.name] = object.tags;
                }
                this._states.tags[object.name] = $.grep(this._states.tags[object.name], $.proxy(function(mutationDetail, canCreateDiscussions) {
                    return $.inArray(mutationDetail, this._states.tags[object.name]) === canCreateDiscussions;
                }, this));
            }
        }
    };
    /**
     * @param {!Array} v
     * @return {undefined}
     */
    Owl.prototype.suppress = function(v) {
        $.each(v, $.proxy(function(a, name) {
            /** @type {boolean} */
            this._supress[name] = true;
        }, this));
    };
    /**
     * @param {!Array} line
     * @return {undefined}
     */
    Owl.prototype.release = function(line) {
        $.each(line, $.proxy(function(a, name) {
            delete this._supress[name];
        }, this));
    };
    /**
     * @param {!Object} event
     * @return {?}
     */
    Owl.prototype.pointer = function(event) {
        var pos = {
            x : null,
            y : null
        };
        return event = event.originalEvent || event || window.event, event = event.touches && event.touches.length ? event.touches[0] : event.changedTouches && event.changedTouches.length ? event.changedTouches[0] : event, event.pageX ? (pos.x = event.pageX, pos.y = event.pageY) : (pos.x = event.clientX, pos.y = event.clientY), pos;
    };
    /**
     * @param {number} value
     * @return {?}
     */
    Owl.prototype.isNumeric = function(value) {
        return !isNaN(parseFloat(value));
    };
    /**
     * @param {!Object} b
     * @param {!Object} a
     * @return {?}
     */
    Owl.prototype.difference = function(b, a) {
        return {
            x : b.x - a.x,
            y : b.y - a.y
        };
    };
    /**
     * @param {string} options
     * @return {?}
     */
    $.fn.owlCarousel = function(options) {
        /** @type {!Array<?>} */
        var cmd_args = Array.prototype.slice.call(arguments, 1);
        return this.each(function() {
            var d = $(this);
            var data = d.data("owl.carousel");
            if (!data) {
                data = new Owl(this, "object" == typeof options && options);
                d.data("owl.carousel", data);
                $.each(["next", "prev", "to", "destroy", "refresh", "replace", "add", "remove"], function(b, event) {
                    data.register({
                        type : Owl.Type.Event,
                        name : event
                    });
                    data.$element.on(event + ".owl.carousel.core", $.proxy(function(event) {
                        if (event.namespace && event.relatedTarget !== this) {
                            this.suppress([event]);
                            data[event].apply(this, [].slice.call(arguments, 1));
                            this.release([event]);
                        }
                    }, data));
                });
            }
            if ("string" == typeof options && "_" !== options.charAt(0)) {
                data[options].apply(data, cmd_args);
            }
        });
    };
    /** @type {function(?, ?): undefined} */
    $.fn.owlCarousel.Constructor = Owl;
}(window.Zepto || window.jQuery, window, document), function($, window, selector, canCreateDiscussions) {
    /**
     * @param {?} carousel
     * @return {undefined}
     */
    var AutoRefresh = function(carousel) {
        this._core = carousel;
        /** @type {null} */
        this._interval = null;
        /** @type {null} */
        this._visible = null;
        this._handlers = {
            "initialized.owl.carousel" : $.proxy(function(e) {
                if (e.namespace && this._core.settings.autoRefresh) {
                    this.watch();
                }
            }, this)
        };
        this._core.options = $.extend({}, AutoRefresh.Defaults, this._core.options);
        this._core.$element.on(this._handlers);
    };
    AutoRefresh.Defaults = {
        autoRefresh : true,
        autoRefreshInterval : 500
    };
    /**
     * @return {undefined}
     */
    AutoRefresh.prototype.watch = function() {
        if (!this._interval) {
            this._visible = this._core.$element.is(":visible");
            this._interval = window.setInterval($.proxy(this.refresh, this), this._core.settings.autoRefreshInterval);
        }
    };
    /**
     * @return {undefined}
     */
    AutoRefresh.prototype.refresh = function() {
        if (this._core.$element.is(":visible") !== this._visible) {
            /** @type {boolean} */
            this._visible = !this._visible;
            this._core.$element.toggleClass("owl-hidden", !this._visible);
            if (this._visible && this._core.invalidate("width")) {
                this._core.refresh();
            }
        }
    };
    /**
     * @return {undefined}
     */
    AutoRefresh.prototype.destroy = function() {
        var type;
        var indexLookupKey;
        window.clearInterval(this._interval);
        for (type in this._handlers) {
            this._core.$element.off(type, this._handlers[type]);
        }
        for (indexLookupKey in Object.getOwnPropertyNames(this)) {
            if ("function" != typeof this[indexLookupKey]) {
                /** @type {null} */
                this[indexLookupKey] = null;
            }
        }
    };
    /** @type {function(?): undefined} */
    $.fn.owlCarousel.Constructor.Plugins.AutoRefresh = AutoRefresh;
}(window.Zepto || window.jQuery, window, document), function($, windowRef, selector, undefined) {
    /**
     * @param {!Object} carousel
     * @return {undefined}
     */
    var Lazy = function(carousel) {
        /** @type {!Object} */
        this._core = carousel;
        /** @type {!Array} */
        this._loaded = [];
        this._handlers = {
            "initialized.owl.carousel change.owl.carousel resized.owl.carousel" : $.proxy(function(data) {
                if (data.namespace && this._core.settings && this._core.settings.lazyLoad && (data.property && "position" == data.property.name || "initialized" == data.type)) {
                    var settings = this._core.settings;
                    var wordCount = settings.center && Math.ceil(settings.items / 2) || settings.items;
                    var offset = settings.center && -1 * wordCount || 0;
                    var position = (data.property && data.property.value !== undefined ? data.property.value : this._core.current()) + offset;
                    var clones = this._core.clones().length;
                    var applyBuff = $.proxy(function(a, data) {
                        this.load(data);
                    }, this);
                    for (; offset++ < wordCount;) {
                        this.load(clones / 2 + this._core.relative(position));
                        if (clones) {
                            $.each(this._core.clones(this._core.relative(position)), applyBuff);
                        }
                        position++;
                    }
                }
            }, this)
        };
        this._core.options = $.extend({}, Lazy.Defaults, this._core.options);
        this._core.$element.on(this._handlers);
    };
    Lazy.Defaults = {
        lazyLoad : false
    };
    /**
     * @param {?} str
     * @return {undefined}
     */
    Lazy.prototype.load = function(str) {
        var d = this._core.$stage.children().eq(str);
        var val = d && d.find(".owl-lazy");
        if (!(!val || $.inArray(d.get(0), this._loaded) > -1)) {
            val.each($.proxy(function(canCreateDiscussions, d) {
                var img;
                var element = $(d);
                var thumbURL = windowRef.devicePixelRatio > 1 && element.attr("data-src-retina") || element.attr("data-src");
                this._core.trigger("load", {
                    element : element,
                    url : thumbURL
                }, "lazy");
                if (element.is("img")) {
                    element.one("load.owl.lazy", $.proxy(function() {
                        element.css("opacity", 1);
                        this._core.trigger("loaded", {
                            element : element,
                            url : thumbURL
                        }, "lazy");
                    }, this)).attr("src", thumbURL);
                } else {
                    /** @type {!Image} */
                    img = new Image;
                    img.onload = $.proxy(function() {
                        element.css({
                            "background-image" : "url(" + thumbURL + ")",
                            opacity : "1"
                        });
                        this._core.trigger("loaded", {
                            element : element,
                            url : thumbURL
                        }, "lazy");
                    }, this);
                    img.src = thumbURL;
                }
            }, this));
            this._loaded.push(d.get(0));
        }
    };
    /**
     * @return {undefined}
     */
    Lazy.prototype.destroy = function() {
        var i;
        var indexLookupKey;
        for (i in this.handlers) {
            this._core.$element.off(i, this.handlers[i]);
        }
        for (indexLookupKey in Object.getOwnPropertyNames(this)) {
            if ("function" != typeof this[indexLookupKey]) {
                /** @type {null} */
                this[indexLookupKey] = null;
            }
        }
    };
    /** @type {function(!Object): undefined} */
    $.fn.owlCarousel.Constructor.Plugins.Lazy = Lazy;
}(window.Zepto || window.jQuery, window, document), function($, metaWindow, selector, canCreateDiscussions) {
    /**
     * @param {?} carousel
     * @return {undefined}
     */
    var AutoHeight = function(carousel) {
        this._core = carousel;
        this._handlers = {
            "initialized.owl.carousel refreshed.owl.carousel" : $.proxy(function(e) {
                if (e.namespace && this._core.settings.autoHeight) {
                    this.update();
                }
            }, this),
            "changed.owl.carousel" : $.proxy(function(e) {
                if (e.namespace && this._core.settings.autoHeight && "position" == e.property.name) {
                    this.update();
                }
            }, this),
            "loaded.owl.lazy" : $.proxy(function(e) {
                if (e.namespace && this._core.settings.autoHeight && e.element.closest("." + this._core.settings.itemClass).index() === this._core.current()) {
                    this.update();
                }
            }, this)
        };
        this._core.options = $.extend({}, AutoHeight.Defaults, this._core.options);
        this._core.$element.on(this._handlers);
    };
    AutoHeight.Defaults = {
        autoHeight : false,
        autoHeightClass : "owl-height"
    };
    /**
     * @return {undefined}
     */
    AutoHeight.prototype.update = function() {
        var start = this._core._current;
        var end = start + this._core.settings.items;
        var ticks = this._core.$stage.children().toArray().slice(start, end);
        /** @type {!Array} */
        var heights = [];
        /** @type {number} */
        var maxheight = 0;
        $.each(ticks, function(b, renderedSnippet) {
            heights.push($(renderedSnippet).height());
        });
        /** @type {number} */
        maxheight = Math.max.apply(null, heights);
        this._core.$stage.parent().height(maxheight).addClass(this._core.settings.autoHeightClass);
    };
    /**
     * @return {undefined}
     */
    AutoHeight.prototype.destroy = function() {
        var type;
        var indexLookupKey;
        for (type in this._handlers) {
            this._core.$element.off(type, this._handlers[type]);
        }
        for (indexLookupKey in Object.getOwnPropertyNames(this)) {
            if ("function" != typeof this[indexLookupKey]) {
                /** @type {null} */
                this[indexLookupKey] = null;
            }
        }
    };
    /** @type {function(?): undefined} */
    $.fn.owlCarousel.Constructor.Plugins.AutoHeight = AutoHeight;
}(window.Zepto || window.jQuery, window, document), function($, metaWindow, document, canCreateDiscussions) {
    /**
     * @param {!Object} carousel
     * @return {undefined}
     */
    var Video = function(carousel) {
        /** @type {!Object} */
        this._core = carousel;
        this._videos = {};
        /** @type {null} */
        this._playing = null;
        this._handlers = {
            "initialized.owl.carousel" : $.proxy(function(ParsleyDefaults) {
                if (ParsleyDefaults.namespace) {
                    this._core.register({
                        type : "state",
                        name : "playing",
                        tags : ["interacting"]
                    });
                }
            }, this),
            "resize.owl.carousel" : $.proxy(function(e) {
                if (e.namespace && this._core.settings.video && this.isInFullScreen()) {
                    e.preventDefault();
                }
            }, this),
            "refreshed.owl.carousel" : $.proxy(function(e) {
                if (e.namespace && this._core.is("resizing")) {
                    this._core.$stage.find(".cloned .owl-video-frame").remove();
                }
            }, this),
            "changed.owl.carousel" : $.proxy(function(a) {
                if (a.namespace && "position" === a.property.name && this._playing) {
                    this.stop();
                }
            }, this),
            "prepared.owl.carousel" : $.proxy(function(b) {
                if (b.namespace) {
                    var $element = $(b.content).find(".owl-video");
                    if ($element.length) {
                        $element.css("display", "none");
                        this.fetch($element, $(b.content));
                    }
                }
            }, this)
        };
        this._core.options = $.extend({}, Video.Defaults, this._core.options);
        this._core.$element.on(this._handlers);
        this._core.$element.on("click.owl.video", ".owl-video-play-icon", $.proxy(function(t) {
            this.play(t);
        }, this));
    };
    Video.Defaults = {
        video : false,
        videoHeight : false,
        videoWidth : false
    };
    /**
     * @param {!Object} target
     * @param {!Object} item
     * @return {undefined}
     */
    Video.prototype.fetch = function(target, item) {
        var type = function() {
            return target.attr("data-vimeo-id") ? "vimeo" : target.attr("data-vzaar-id") ? "vzaar" : "youtube";
        }();
        var c = target.attr("data-vimeo-id") || target.attr("data-youtube-id") || target.attr("data-vzaar-id");
        var neededWidth = target.attr("data-width") || this._core.settings.videoWidth;
        var dxdydust = target.attr("data-height") || this._core.settings.videoHeight;
        var url = target.attr("href");
        if (!url) {
            throw new Error("Missing video URL.");
        }
        if (c = url.match(/(http:|https:|)\/\/(player.|www.|app.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com)|vzaar\.com)\/(video\/|videos\/|embed\/|channels\/.+\/|groups\/.+\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(&\S+)?/), c[3].indexOf("youtu") > -1) {
            /** @type {string} */
            type = "youtube";
        } else {
            if (c[3].indexOf("vimeo") > -1) {
                /** @type {string} */
                type = "vimeo";
            } else {
                if (!(c[3].indexOf("vzaar") > -1)) {
                    throw new Error("Video URL not supported.");
                }
                /** @type {string} */
                type = "vzaar";
            }
        }
        c = c[6];
        this._videos[url] = {
            type : type,
            id : c,
            width : neededWidth,
            height : dxdydust
        };
        item.attr("data-video", url);
        this.thumbnail(target, this._videos[url]);
    };
    /**
     * @param {!Object} opts
     * @param {!Object} file
     * @return {?}
     */
    Video.prototype.thumbnail = function(opts, file) {
        var d;
        var e;
        var path;
        /** @type {string} */
        var opt_by = file.width && file.height ? 'style="width:' + file.width + "px;height:" + file.height + 'px;"' : "";
        var customTn = opts.find("img");
        /** @type {string} */
        var srcType = "src";
        /** @type {string} */
        var lazyClass = "";
        var settings = this._core.settings;
        /**
         * @param {string} elementName
         * @return {undefined}
         */
        var create = function(elementName) {
            /** @type {string} */
            e = '<div class="owl-video-play-icon"></div>';
            /** @type {string} */
            d = settings.lazyLoad ? '<div class="owl-video-tn ' + lazyClass + '" ' + srcType + '="' + elementName + '"></div>' : '<div class="owl-video-tn" style="opacity:1;background-image:url(' + elementName + ')"></div>';
            opts.after(d);
            opts.after(e);
        };
        return opts.wrap('<div class="owl-video-wrapper"' + opt_by + "></div>"), this._core.settings.lazyLoad && (srcType = "data-src", lazyClass = "owl-lazy"), customTn.length ? (create(customTn.attr(srcType)), customTn.remove(), false) : void("youtube" === file.type ? (path = "//img.youtube.com/vi/" + file.id + "/hqdefault.jpg", create(path)) : "vimeo" === file.type ? $.ajax({
            type : "GET",
            url : "//vimeo.com/api/v2/video/" + file.id + ".json",
            jsonp : "callback",
            dataType : "jsonp",
            success : function(data) {
                path = data[0].thumbnail_large;
                create(path);
            }
        }) : "vzaar" === file.type && $.ajax({
            type : "GET",
            url : "//vzaar.com/api/videos/" + file.id + ".json",
            jsonp : "callback",
            dataType : "jsonp",
            success : function(data) {
                path = data.framegrab_url;
                create(path);
            }
        }));
    };
    /**
     * @return {undefined}
     */
    Video.prototype.stop = function() {
        this._core.trigger("stop", null, "video");
        this._playing.find(".owl-video-frame").remove();
        this._playing.removeClass("owl-video-playing");
        /** @type {null} */
        this._playing = null;
        this._core.leave("playing");
        this._core.trigger("stopped", null, "video");
    };
    /**
     * @param {!Event} target
     * @return {undefined}
     */
    Video.prototype.play = function(target) {
        var c;
        var jField = $(target.target);
        var item = jField.closest("." + this._core.settings.itemClass);
        var video = this._videos[item.attr("data-video")];
        var g = video.width || "100%";
        var h = video.height || this._core.$stage.height();
        if (!this._playing) {
            this._core.enter("playing");
            this._core.trigger("play", null, "video");
            item = this._core.items(this._core.relative(item.index()));
            this._core.reset(item.index());
            if ("youtube" === video.type) {
                /** @type {string} */
                c = '<iframe width="' + g + '" height="' + h + '" src="//www.youtube.com/embed/' + video.id + "?autoplay=1&v=" + video.id + '" frameborder="0" allowfullscreen></iframe>';
            } else {
                if ("vimeo" === video.type) {
                    /** @type {string} */
                    c = '<iframe src="//player.vimeo.com/video/' + video.id + '?autoplay=1" width="' + g + '" height="' + h + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
                } else {
                    if ("vzaar" === video.type) {
                        /** @type {string} */
                        c = '<iframe frameborder="0"height="' + h + '"width="' + g + '" allowfullscreen mozallowfullscreen webkitAllowFullScreen src="//view.vzaar.com/' + video.id + '/player?autoplay=true"></iframe>';
                    }
                }
            }
            $('<div class="owl-video-frame">' + c + "</div>").insertAfter(item.find(".owl-video"));
            this._playing = item.addClass("owl-video-playing");
        }
    };
    /**
     * @return {?}
     */
    Video.prototype.isInFullScreen = function() {
        /** @type {(Element|null)} */
        var element = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
        return element && $(element).parent().hasClass("owl-video-frame");
    };
    /**
     * @return {undefined}
     */
    Video.prototype.destroy = function() {
        var type;
        var indexLookupKey;
        this._core.$element.off("click.owl.video");
        for (type in this._handlers) {
            this._core.$element.off(type, this._handlers[type]);
        }
        for (indexLookupKey in Object.getOwnPropertyNames(this)) {
            if ("function" != typeof this[indexLookupKey]) {
                /** @type {null} */
                this[indexLookupKey] = null;
            }
        }
    };
    /** @type {function(!Object): undefined} */
    $.fn.owlCarousel.Constructor.Plugins.Video = Video;
}(window.Zepto || window.jQuery, window, document), function($, metaWindow, selector, undefined) {
    /**
     * @param {!Object} scope
     * @return {undefined}
     */
    var Animate = function(scope) {
        /** @type {!Object} */
        this.core = scope;
        this.core.options = $.extend({}, Animate.Defaults, this.core.options);
        /** @type {boolean} */
        this.swapping = true;
        /** @type {number} */
        this.previous = undefined;
        /** @type {number} */
        this.next = undefined;
        this.handlers = {
            "change.owl.carousel" : $.proxy(function(expr) {
                if (expr.namespace && "position" == expr.property.name) {
                    this.previous = this.core.current();
                    this.next = expr.property.value;
                }
            }, this),
            "drag.owl.carousel dragged.owl.carousel translated.owl.carousel" : $.proxy(function(handleObj) {
                if (handleObj.namespace) {
                    /** @type {boolean} */
                    this.swapping = "translated" == handleObj.type;
                }
            }, this),
            "translate.owl.carousel" : $.proxy(function(e) {
                if (e.namespace && this.swapping && (this.core.options.animateOut || this.core.options.animateIn)) {
                    this.swap();
                }
            }, this)
        };
        this.core.$element.on(this.handlers);
    };
    Animate.Defaults = {
        animateOut : false,
        animateIn : false
    };
    /**
     * @return {undefined}
     */
    Animate.prototype.swap = function() {
        if (1 === this.core.settings.items && $.support.animation && $.support.transition) {
            this.core.speed(0);
            var ffleft;
            var clear = $.proxy(this.clear, this);
            var previous = this.core.$stage.children().eq(this.previous);
            var next = this.core.$stage.children().eq(this.next);
            var incoming = this.core.settings.animateIn;
            var outgoing = this.core.settings.animateOut;
            if (this.core.current() !== this.previous) {
                if (outgoing) {
                    /** @type {number} */
                    ffleft = this.core.coordinates(this.previous) - this.core.coordinates(this.next);
                    previous.one($.support.animation.end, clear).css({
                        left : ffleft + "px"
                    }).addClass("animated owl-animated-out").addClass(outgoing);
                }
                if (incoming) {
                    next.one($.support.animation.end, clear).addClass("animated owl-animated-in").addClass(incoming);
                }
            }
        }
    };
    /**
     * @param {!Event} b
     * @return {undefined}
     */
    Animate.prototype.clear = function(b) {
        $(b.target).css({
            left : ""
        }).removeClass("animated owl-animated-out owl-animated-in").removeClass(this.core.settings.animateIn).removeClass(this.core.settings.animateOut);
        this.core.onTransitionEnd();
    };
    /**
     * @return {undefined}
     */
    Animate.prototype.destroy = function() {
        var i;
        var indexLookupKey;
        for (i in this.handlers) {
            this.core.$element.off(i, this.handlers[i]);
        }
        for (indexLookupKey in Object.getOwnPropertyNames(this)) {
            if ("function" != typeof this[indexLookupKey]) {
                /** @type {null} */
                this[indexLookupKey] = null;
            }
        }
    };
    /** @type {function(!Object): undefined} */
    $.fn.owlCarousel.Constructor.Plugins.Animate = Animate;
}(window.Zepto || window.jQuery, window, document), function($, window, video, canCreateDiscussions) {
    /**
     * @param {!Object} carousel
     * @return {undefined}
     */
    var Autoplay = function(carousel) {
        /** @type {!Object} */
        this._core = carousel;
        /** @type {null} */
        this._timeout = null;
        /** @type {boolean} */
        this._paused = false;
        this._handlers = {
            "changed.owl.carousel" : $.proxy(function(a) {
                if (a.namespace && "settings" === a.property.name) {
                    if (this._core.settings.autoplay) {
                        this.play();
                    } else {
                        this.stop();
                    }
                } else {
                    if (a.namespace && "position" === a.property.name && this._core.settings.autoplay) {
                        this._setAutoPlayInterval();
                    }
                }
            }, this),
            "initialized.owl.carousel" : $.proxy(function(cfg) {
                if (cfg.namespace && this._core.settings.autoplay) {
                    this.play();
                }
            }, this),
            "play.owl.autoplay" : $.proxy(function(ParsleyDefaults, t, s) {
                if (ParsleyDefaults.namespace) {
                    this.play(t, s);
                }
            }, this),
            "stop.owl.autoplay" : $.proxy(function(ParsleyDefaults) {
                if (ParsleyDefaults.namespace) {
                    this.stop();
                }
            }, this),
            "mouseover.owl.autoplay" : $.proxy(function() {
                if (this._core.settings.autoplayHoverPause && this._core.is("rotating")) {
                    this.pause();
                }
            }, this),
            "mouseleave.owl.autoplay" : $.proxy(function() {
                if (this._core.settings.autoplayHoverPause && this._core.is("rotating")) {
                    this.play();
                }
            }, this),
            "touchstart.owl.core" : $.proxy(function() {
                if (this._core.settings.autoplayHoverPause && this._core.is("rotating")) {
                    this.pause();
                }
            }, this),
            "touchend.owl.core" : $.proxy(function() {
                if (this._core.settings.autoplayHoverPause) {
                    this.play();
                }
            }, this)
        };
        this._core.$element.on(this._handlers);
        this._core.options = $.extend({}, Autoplay.Defaults, this._core.options);
    };
    Autoplay.Defaults = {
        autoplay : false,
        autoplayTimeout : 5e3,
        autoplayHoverPause : false,
        autoplaySpeed : false
    };
    /**
     * @param {!Event} a
     * @param {?} item
     * @return {undefined}
     */
    Autoplay.prototype.play = function(a, item) {
        /** @type {boolean} */
        this._paused = false;
        if (!this._core.is("rotating")) {
            this._core.enter("rotating");
            this._setAutoPlayInterval();
        }
    };
    /**
     * @param {number} timeout
     * @param {number} speed
     * @return {?}
     */
    Autoplay.prototype._getNextTimeout = function(timeout, speed) {
        return this._timeout && window.clearTimeout(this._timeout), window.setTimeout($.proxy(function() {
            if (!(this._paused || this._core.is("busy") || this._core.is("interacting") || video.hidden)) {
                this._core.next(speed || this._core.settings.autoplaySpeed);
            }
        }, this), timeout || this._core.settings.autoplayTimeout);
    };
    /**
     * @return {undefined}
     */
    Autoplay.prototype._setAutoPlayInterval = function() {
        this._timeout = this._getNextTimeout();
    };
    /**
     * @return {undefined}
     */
    Autoplay.prototype.stop = function() {
        if (this._core.is("rotating")) {
            window.clearTimeout(this._timeout);
            this._core.leave("rotating");
        }
    };
    /**
     * @return {undefined}
     */
    Autoplay.prototype.pause = function() {
        if (this._core.is("rotating")) {
            /** @type {boolean} */
            this._paused = true;
        }
    };
    /**
     * @return {undefined}
     */
    Autoplay.prototype.destroy = function() {
        var type;
        var indexLookupKey;
        this.stop();
        for (type in this._handlers) {
            this._core.$element.off(type, this._handlers[type]);
        }
        for (indexLookupKey in Object.getOwnPropertyNames(this)) {
            if ("function" != typeof this[indexLookupKey]) {
                /** @type {null} */
                this[indexLookupKey] = null;
            }
        }
    };
    /** @type {function(!Object): undefined} */
    $.fn.owlCarousel.Constructor.Plugins.autoplay = Autoplay;
}(window.Zepto || window.jQuery, window, document), function($, metaWindow, selector, canCreateDiscussions) {
    /**
     * @param {!Object} carousel
     * @return {undefined}
     */
    var Navigation = function(carousel) {
        /** @type {!Object} */
        this._core = carousel;
        /** @type {boolean} */
        this._initialized = false;
        /** @type {!Array} */
        this._pages = [];
        this._controls = {};
        /** @type {!Array} */
        this._templates = [];
        this.$element = this._core.$element;
        this._overrides = {
            next : this._core.next,
            prev : this._core.prev,
            to : this._core.to
        };
        this._handlers = {
            "prepared.owl.carousel" : $.proxy(function(e) {
                if (e.namespace && this._core.settings.dotsData) {
                    this._templates.push('<div class="' + this._core.settings.dotClass + '">' + $(e.content).find("[data-dot]").addBack("[data-dot]").attr("data-dot") + "</div>");
                }
            }, this),
            "added.owl.carousel" : $.proxy(function(e) {
                if (e.namespace && this._core.settings.dotsData) {
                    this._templates.splice(e.position, 0, this._templates.pop());
                }
            }, this),
            "remove.owl.carousel" : $.proxy(function(e) {
                if (e.namespace && this._core.settings.dotsData) {
                    this._templates.splice(e.position, 1);
                }
            }, this),
            "changed.owl.carousel" : $.proxy(function(a) {
                if (a.namespace && "position" == a.property.name) {
                    this.draw();
                }
            }, this),
            "initialized.owl.carousel" : $.proxy(function(e) {
                if (e.namespace && !this._initialized) {
                    this._core.trigger("initialize", null, "navigation");
                    this.initialize();
                    this.update();
                    this.draw();
                    /** @type {boolean} */
                    this._initialized = true;
                    this._core.trigger("initialized", null, "navigation");
                }
            }, this),
            "refreshed.owl.carousel" : $.proxy(function(e) {
                if (e.namespace && this._initialized) {
                    this._core.trigger("refresh", null, "navigation");
                    this.update();
                    this.draw();
                    this._core.trigger("refreshed", null, "navigation");
                }
            }, this)
        };
        this._core.options = $.extend({}, Navigation.Defaults, this._core.options);
        this.$element.on(this._handlers);
    };
    Navigation.Defaults = {
        nav : false,
        navText : ["prev", "next"],
        navSpeed : false,
        navElement : "div",
        navContainer : false,
        navContainerClass : "owl-nav",
        navClass : ["owl-prev", "owl-next"],
        slideBy : 1,
        dotClass : "owl-dot",
        dotsClass : "owl-dots",
        dots : true,
        dotsEach : false,
        dotsData : false,
        dotsSpeed : false,
        dotsContainer : false
    };
    /**
     * @return {undefined}
     */
    Navigation.prototype.initialize = function() {
        var override;
        var settings = this._core.settings;
        this._controls.$relative = (settings.navContainer ? $(settings.navContainer) : $("<div>").addClass(settings.navContainerClass).appendTo(this.$element)).addClass("disabled");
        this._controls.$previous = $("<" + settings.navElement + ">").addClass(settings.navClass[0]).html(settings.navText[0]).prependTo(this._controls.$relative).on("click", $.proxy(function(a) {
            this.prev(settings.navSpeed);
        }, this));
        this._controls.$next = $("<" + settings.navElement + ">").addClass(settings.navClass[1]).html(settings.navText[1]).appendTo(this._controls.$relative).on("click", $.proxy(function(a) {
            this.next(settings.navSpeed);
        }, this));
        if (!settings.dotsData) {
            /** @type {!Array} */
            this._templates = [$("<div>").addClass(settings.dotClass).append($("<span>")).prop("outerHTML")];
        }
        this._controls.$absolute = (settings.dotsContainer ? $(settings.dotsContainer) : $("<div>").addClass(settings.dotsClass).appendTo(this.$element)).addClass("disabled");
        this._controls.$absolute.on("click", "div", $.proxy(function(event) {
            var index = $(event.target).parent().is(this._controls.$absolute) ? $(event.target).index() : $(event.target).parent().index();
            event.preventDefault();
            this.to(index, settings.dotsSpeed);
        }, this));
        for (override in this._overrides) {
            this._core[override] = $.proxy(this[override], this);
        }
    };
    /**
     * @return {undefined}
     */
    Navigation.prototype.destroy = function() {
        var handler;
        var control;
        var indexLookupKey;
        var override;
        for (handler in this._handlers) {
            this.$element.off(handler, this._handlers[handler]);
        }
        for (control in this._controls) {
            this._controls[control].remove();
        }
        for (override in this.overides) {
            this._core[override] = this._overrides[override];
        }
        for (indexLookupKey in Object.getOwnPropertyNames(this)) {
            if ("function" != typeof this[indexLookupKey]) {
                /** @type {null} */
                this[indexLookupKey] = null;
            }
        }
    };
    /**
     * @return {undefined}
     */
    Navigation.prototype.update = function() {
        var i;
        var reconnectTryTimes;
        var c;
        /** @type {number} */
        var g = this._core.clones().length / 2;
        var e = g + this._core.items().length;
        var maximum = this._core.maximum(true);
        var settings = this._core.settings;
        var maxReconnectTryTimes = settings.center || settings.autoWidth || settings.dotsData ? 1 : settings.dotsEach || settings.items;
        if ("page" !== settings.slideBy && (settings.slideBy = Math.min(settings.slideBy, settings.items)), settings.dots || "page" == settings.slideBy) {
            /** @type {!Array} */
            this._pages = [];
            /** @type {number} */
            i = g;
            /** @type {number} */
            reconnectTryTimes = 0;
            /** @type {number} */
            c = 0;
            for (; e > i; i++) {
                if (reconnectTryTimes >= maxReconnectTryTimes || 0 === reconnectTryTimes) {
                    if (this._pages.push({
                        start : Math.min(maximum, i - g),
                        end : i - g + maxReconnectTryTimes - 1
                    }), Math.min(maximum, i - g) === maximum) {
                        break;
                    }
                    /** @type {number} */
                    reconnectTryTimes = 0;
                    ++c;
                }
                reconnectTryTimes = reconnectTryTimes + this._core.mergers(this._core.relative(i));
            }
        }
    };
    /**
     * @return {undefined}
     */
    Navigation.prototype.draw = function() {
        var difference;
        var settings = this._core.settings;
        /** @type {boolean} */
        var flat = this._core.items().length <= settings.items;
        var date = this._core.relative(this._core.current());
        var excludeTo = settings.loop || settings.rewind;
        this._controls.$relative.toggleClass("disabled", !settings.nav || flat);
        if (settings.nav) {
            this._controls.$previous.toggleClass("disabled", !excludeTo && date <= this._core.minimum(true));
            this._controls.$next.toggleClass("disabled", !excludeTo && date >= this._core.maximum(true));
        }
        this._controls.$absolute.toggleClass("disabled", !settings.dots || flat);
        if (settings.dots) {
            /** @type {number} */
            difference = this._pages.length - this._controls.$absolute.children().length;
            if (settings.dotsData && 0 !== difference) {
                this._controls.$absolute.html(this._templates.join(""));
            } else {
                if (difference > 0) {
                    this._controls.$absolute.append((new Array(difference + 1)).join(this._templates[0]));
                } else {
                    if (0 > difference) {
                        this._controls.$absolute.children().slice(difference).remove();
                    }
                }
            }
            this._controls.$absolute.find(".active").removeClass("active");
            this._controls.$absolute.children().eq($.inArray(this.current(), this._pages)).addClass("active");
        }
    };
    /**
     * @param {!Object} event
     * @return {undefined}
     */
    Navigation.prototype.onTrigger = function(event) {
        var settings = this._core.settings;
        event.page = {
            index : $.inArray(this.current(), this._pages),
            count : this._pages.length,
            size : settings && (settings.center || settings.autoWidth || settings.dotsData ? 1 : settings.dotsEach || settings.items)
        };
    };
    /**
     * @return {?}
     */
    Navigation.prototype.current = function() {
        var wordPos = this._core.relative(this._core.current());
        return $.grep(this._pages, $.proxy(function(nodeArg, canCreateDiscussions) {
            return nodeArg.start <= wordPos && nodeArg.end >= wordPos;
        }, this)).pop();
    };
    /**
     * @param {boolean} successor
     * @return {?}
     */
    Navigation.prototype.getPosition = function(successor) {
        var position;
        var length;
        var settings = this._core.settings;
        return "page" == settings.slideBy ? (position = $.inArray(this.current(), this._pages), length = this._pages.length, successor ? ++position : --position, position = this._pages[(position % length + length) % length].start) : (position = this._core.relative(this._core.current()), length = this._core.items().length, successor ? position = position + settings.slideBy : position = position - settings.slideBy), position;
    };
    /**
     * @param {?} speed
     * @return {undefined}
     */
    Navigation.prototype.next = function(speed) {
        $.proxy(this._overrides.to, this._core)(this.getPosition(true), speed);
    };
    /**
     * @param {?} speed
     * @return {undefined}
     */
    Navigation.prototype.prev = function(speed) {
        $.proxy(this._overrides.to, this._core)(this.getPosition(false), speed);
    };
    /**
     * @param {number} position
     * @param {boolean} speed
     * @param {boolean} standard
     * @return {undefined}
     */
    Navigation.prototype.to = function(position, speed, standard) {
        var length;
        if (!standard && this._pages.length) {
            length = this._pages.length;
            $.proxy(this._overrides.to, this._core)(this._pages[(position % length + length) % length].start, speed);
        } else {
            $.proxy(this._overrides.to, this._core)(position, speed);
        }
    };
    /** @type {function(!Object): undefined} */
    $.fn.owlCarousel.Constructor.Plugins.Navigation = Navigation;
}(window.Zepto || window.jQuery, window, document), function($, window, selector, relative) {
    /**
     * @param {!Object} carousel
     * @return {undefined}
     */
    var Hash = function(carousel) {
        /** @type {!Object} */
        this._core = carousel;
        this._hashes = {};
        this.$element = this._core.$element;
        this._handlers = {
            "initialized.owl.carousel" : $.proxy(function(ParsleyDefaults) {
                if (ParsleyDefaults.namespace && "URLHash" === this._core.settings.startPosition) {
                    $(window).trigger("hashchange.owl.navigation");
                }
            }, this),
            "prepared.owl.carousel" : $.proxy(function(e) {
                if (e.namespace) {
                    var hash = $(e.content).find("[data-hash]").addBack("[data-hash]").attr("data-hash");
                    if (!hash) {
                        return;
                    }
                    this._hashes[hash] = e.content;
                }
            }, this),
            "changed.owl.carousel" : $.proxy(function(expr) {
                if (expr.namespace && "position" === expr.property.name) {
                    var theUnsealer = this._core.items(this._core.relative(this._core.current()));
                    var category = $.map(this._hashes, function(unsealer, self) {
                        return unsealer === theUnsealer ? self : null;
                    }).join();
                    if (!category || window.location.hash.slice(1) === category) {
                        return;
                    }
                    window.location.hash = category;
                }
            }, this)
        };
        this._core.options = $.extend({}, Hash.Defaults, this._core.options);
        this.$element.on(this._handlers);
        $(window).on("hashchange.owl.navigation", $.proxy(function(a) {
            /** @type {string} */
            var hash = window.location.hash.substring(1);
            var items = this._core.$stage.children();
            var position = this._hashes[hash] && items.index(this._hashes[hash]);
            if (position !== relative && position !== this._core.current()) {
                this._core.to(this._core.relative(position), false, true);
            }
        }, this));
    };
    Hash.Defaults = {
        URLhashListener : false
    };
    /**
     * @return {undefined}
     */
    Hash.prototype.destroy = function() {
        var type;
        var indexLookupKey;
        $(window).off("hashchange.owl.navigation");
        for (type in this._handlers) {
            this._core.$element.off(type, this._handlers[type]);
        }
        for (indexLookupKey in Object.getOwnPropertyNames(this)) {
            if ("function" != typeof this[indexLookupKey]) {
                /** @type {null} */
                this[indexLookupKey] = null;
            }
        }
    };
    /** @type {function(!Object): undefined} */
    $.fn.owlCarousel.Constructor.Plugins.Hash = Hash;
}(window.Zepto || window.jQuery, window, document), function($, metaWindow, selector, a) {
    /**
     * @param {string} property
     * @param {boolean} dir
     * @return {?}
     */
    function test(property, dir) {
        /** @type {boolean} */
        var y = false;
        var ucProp = property.charAt(0).toUpperCase() + property.slice(1);
        return $.each((property + " " + cssomPrefixes.join(ucProp + " ") + ucProp).split(" "), function(a, b) {
            return sa[b] !== a ? (y = dir ? b : true, false) : void 0;
        }), y;
    }
    /**
     * @param {string} prop
     * @return {?}
     */
    function prefixed(prop) {
        return test(prop, true);
    }
    var sa = $("<support>").get(0).style;
    /** @type {!Array<string>} */
    var cssomPrefixes = "Webkit Moz O ms".split(" ");
    var events = {
        transition : {
            end : {
                WebkitTransition : "webkitTransitionEnd",
                MozTransition : "transitionend",
                OTransition : "oTransitionEnd",
                transition : "transitionend"
            }
        },
        animation : {
            end : {
                WebkitAnimation : "webkitAnimationEnd",
                MozAnimation : "animationend",
                OAnimation : "oAnimationEnd",
                animation : "animationend"
            }
        }
    };
    var tests = {
        csstransforms : function() {
            return !!test("transform");
        },
        csstransforms3d : function() {
            return !!test("perspective");
        },
        csstransitions : function() {
            return !!test("transition");
        },
        cssanimations : function() {
            return !!test("animation");
        }
    };
    if (tests.csstransitions()) {
        /** @type {!String} */
        $.support.transition = new String(prefixed("transition"));
        $.support.transition.end = events.transition.end[$.support.transition];
    }
    if (tests.cssanimations()) {
        /** @type {!String} */
        $.support.animation = new String(prefixed("animation"));
        $.support.animation.end = events.animation.end[$.support.animation];
    }
    if (tests.csstransforms()) {
        /** @type {!String} */
        $.support.transform = new String(prefixed("transform"));
        $.support.transform3d = tests.csstransforms3d();
    }
}(window.Zepto || window.jQuery, window, document);

'use strict';
!function(e) {
    if ("object" == typeof exports && "undefined" != typeof module) {
        module.exports = e();
    } else {
        if ("function" == typeof define && define.amd) {
            define([], e);
        } else {
            var f;
            f = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this;
            f.ProgressBar = e();
        }
    }
}(function() {
    var obj;
    return function e(t, n, r) {
        /**
         * @param {string} o
         * @param {?} s
         * @return {?}
         */
        function s(o, s) {
            if (!n[o]) {
                if (!t[o]) {
                    var i = "function" == typeof require && require;
                    if (!s && i) {
                        return i(o, true);
                    }
                    if (a) {
                        return a(o, true);
                    }
                    /** @type {!Error} */
                    var f = new Error("Cannot find module '" + o + "'");
                    throw f.code = "MODULE_NOT_FOUND", f;
                }
                var u = n[o] = {
                    exports : {}
                };
                t[o][0].call(u.exports, function(e) {
                    var n = t[o][1][e];
                    return s(n ? n : e);
                }, u, u.exports, e, t, n, r);
            }
            return n[o].exports;
        }
        var a = "function" == typeof require && require;
        /** @type {number} */
        var o = 0;
        for (; o < r.length; o++) {
            s(r[o]);
        }
        return s;
    }({
        1 : [function(b, module, val) {
            (function() {
                var root = this || Function("return this")();
                var Tweenable = function() {
                    /**
                     * @return {undefined}
                     */
                    function noop() {
                    }
                    /**
                     * @param {!Object} obj
                     * @param {!Function} func
                     * @return {undefined}
                     */
                    function each(obj, func) {
                        var i;
                        for (i in obj) {
                            if (Object.hasOwnProperty.call(obj, i)) {
                                func(i);
                            }
                        }
                    }
                    /**
                     * @param {?} x
                     * @param {!Array} a
                     * @return {?}
                     */
                    function shallowCopy(x, a) {
                        return each(a, function(k) {
                            x[k] = a[k];
                        }), x;
                    }
                    /**
                     * @param {string} a
                     * @param {!Object} b
                     * @return {undefined}
                     */
                    function defaults(a, b) {
                        each(b, function(key) {
                            if ("undefined" == typeof a[key]) {
                                a[key] = b[key];
                            }
                        });
                    }
                    /**
                     * @param {number} forPosition
                     * @param {(Object|string)} currentState
                     * @param {!Array} originalState
                     * @param {!Array} targetState
                     * @param {number} duration
                     * @param {number} timestamp
                     * @param {!Array} easing
                     * @return {?}
                     */
                    function tweenProps(forPosition, currentState, originalState, targetState, duration, timestamp, easing) {
                        var prop;
                        var fn;
                        var easingFn;
                        /** @type {number} */
                        var normalizedPosition = timestamp > forPosition ? 0 : (forPosition - timestamp) / duration;
                        for (prop in currentState) {
                            if (currentState.hasOwnProperty(prop)) {
                                fn = easing[prop];
                                easingFn = "function" == typeof fn ? fn : ease[fn];
                                currentState[prop] = tweenProp(originalState[prop], targetState[prop], easingFn, normalizedPosition);
                            }
                        }
                        return currentState;
                    }
                    /**
                     * @param {number} from
                     * @param {string} to
                     * @param {!Object} easingFunc
                     * @param {number} position
                     * @return {?}
                     */
                    function tweenProp(from, to, easingFunc, position) {
                        return from + (to - from) * easingFunc(position);
                    }
                    /**
                     * @param {!Object} tweenable
                     * @param {string} filterName
                     * @return {undefined}
                     */
                    function applyFilter(tweenable, filterName) {
                        var filters = Tweenable.prototype.filter;
                        var args = tweenable._filterArgs;
                        each(filters, function(name) {
                            if ("undefined" != typeof filters[name][filterName]) {
                                filters[name][filterName].apply(tweenable, args);
                            }
                        });
                    }
                    /**
                     * @param {!Object} tweenable
                     * @param {number} timestamp
                     * @param {number} delay
                     * @param {number} duration
                     * @param {(Object|string)} currentState
                     * @param {!Array} originalState
                     * @param {!Array} targetState
                     * @param {!Array} easing
                     * @param {?} step
                     * @param {?} schedule
                     * @param {?} opt_currentTimeOverride
                     * @return {undefined}
                     */
                    function timeoutHandler(tweenable, timestamp, delay, duration, currentState, originalState, targetState, easing, step, schedule, opt_currentTimeOverride) {
                        timeoutHandler_endTime = timestamp + delay + duration;
                        /** @type {number} */
                        timeoutHandler_currentTime = Math.min(opt_currentTimeOverride || now(), timeoutHandler_endTime);
                        /** @type {boolean} */
                        timeoutHandler_isEnded = timeoutHandler_currentTime >= timeoutHandler_endTime;
                        /** @type {number} */
                        timeoutHandler_offset = duration - (timeoutHandler_endTime - timeoutHandler_currentTime);
                        if (tweenable.isPlaying()) {
                            if (timeoutHandler_isEnded) {
                                step(targetState, tweenable._attachment, timeoutHandler_offset);
                                tweenable.stop(true);
                            } else {
                                tweenable._scheduleId = schedule(tweenable._timeoutHandler, UPDATE_TIME);
                                applyFilter(tweenable, "beforeTween");
                                if (timestamp + delay > timeoutHandler_currentTime) {
                                    tweenProps(1, currentState, originalState, targetState, 1, 1, easing);
                                } else {
                                    tweenProps(timeoutHandler_currentTime, currentState, originalState, targetState, duration, timestamp + delay, easing);
                                }
                                applyFilter(tweenable, "afterTween");
                                step(currentState, tweenable._attachment, timeoutHandler_offset);
                            }
                        }
                    }
                    /**
                     * @param {!Object} fromTweenParams
                     * @param {!NodeList} easing
                     * @return {?}
                     */
                    function composeEasingObject(fromTweenParams, easing) {
                        var composedEasing = {};
                        /** @type {string} */
                        var type = typeof easing;
                        return "string" === type || "function" === type ? each(fromTweenParams, function(prop) {
                            /** @type {!NodeList} */
                            composedEasing[prop] = easing;
                        }) : each(fromTweenParams, function(prop) {
                            if (!composedEasing[prop]) {
                                composedEasing[prop] = easing[prop] || DEFAULT_EASING;
                            }
                        }), composedEasing;
                    }
                    /**
                     * @param {!Object} opt_initialState
                     * @param {!Object} opt_config
                     * @return {undefined}
                     */
                    function Tweenable(opt_initialState, opt_config) {
                        this._currentState = opt_initialState || {};
                        /** @type {boolean} */
                        this._configured = false;
                        this._scheduleFunction = setTimer;
                        if ("undefined" != typeof opt_config) {
                            this.setConfig(opt_config);
                        }
                    }
                    var ease;
                    var setTimer;
                    /** @type {string} */
                    var DEFAULT_EASING = "linear";
                    /** @type {number} */
                    var DEFAULT_DURATION = 500;
                    /** @type {number} */
                    var UPDATE_TIME = 1e3 / 60;
                    /** @type {!Function} */
                    var _now = Date.now ? Date.now : function() {
                        return +new Date;
                    };
                    var now = "undefined" != typeof SHIFTY_DEBUG_NOW ? SHIFTY_DEBUG_NOW : _now;
                    setTimer = "undefined" != typeof window ? window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || window.mozCancelRequestAnimationFrame && window.mozRequestAnimationFrame || setTimeout : setTimeout;
                    var timeoutHandler_endTime;
                    var timeoutHandler_currentTime;
                    var timeoutHandler_isEnded;
                    var timeoutHandler_offset;
                    return Tweenable.prototype.tween = function(opt_config) {
                        return this._isTweening ? this : (void 0 === opt_config && this._configured || this.setConfig(opt_config), this._timestamp = now(), this._start(this.get(), this._attachment), this.resume());
                    }, Tweenable.prototype.setConfig = function(config) {
                        config = config || {};
                        /** @type {boolean} */
                        this._configured = true;
                        this._attachment = config.attachment;
                        /** @type {null} */
                        this._pausedAtTime = null;
                        /** @type {null} */
                        this._scheduleId = null;
                        this._delay = config.delay || 0;
                        this._start = config.start || noop;
                        this._step = config.step || noop;
                        this._finish = config.finish || noop;
                        this._duration = config.duration || DEFAULT_DURATION;
                        this._currentState = shallowCopy({}, config.from) || this.get();
                        this._originalState = this.get();
                        this._targetState = shallowCopy({}, config.to) || this.get();
                        var self = this;
                        /**
                         * @return {undefined}
                         */
                        this._timeoutHandler = function() {
                            timeoutHandler(self, self._timestamp, self._delay, self._duration, self._currentState, self._originalState, self._targetState, self._easing, self._step, self._scheduleFunction);
                        };
                        var currentState = this._currentState;
                        var targetState = this._targetState;
                        return defaults(targetState, currentState), this._easing = composeEasingObject(currentState, config.easing || DEFAULT_EASING), this._filterArgs = [currentState, this._originalState, targetState, this._easing], applyFilter(this, "tweenCreated"), this;
                    }, Tweenable.prototype.get = function() {
                        return shallowCopy({}, this._currentState);
                    }, Tweenable.prototype.set = function(state) {
                        /** @type {!Object} */
                        this._currentState = state;
                    }, Tweenable.prototype.pause = function() {
                        return this._pausedAtTime = now(), this._isPaused = true, this;
                    }, Tweenable.prototype.resume = function() {
                        return this._isPaused && (this._timestamp += now() - this._pausedAtTime), this._isPaused = false, this._isTweening = true, this._timeoutHandler(), this;
                    }, Tweenable.prototype.seek = function(millisecond) {
                        /** @type {number} */
                        millisecond = Math.max(millisecond, 0);
                        var currentTime = now();
                        return this._timestamp + millisecond === 0 ? this : (this._timestamp = currentTime - millisecond, this.isPlaying() || (this._isTweening = true, this._isPaused = false, timeoutHandler(this, this._timestamp, this._delay, this._duration, this._currentState, this._originalState, this._targetState, this._easing, this._step, this._scheduleFunction, currentTime), this.pause()), this);
                    }, Tweenable.prototype.stop = function(bAll) {
                        return this._isTweening = false, this._isPaused = false, this._timeoutHandler = noop, (root.cancelAnimationFrame || root.webkitCancelAnimationFrame || root.oCancelAnimationFrame || root.msCancelAnimationFrame || root.mozCancelRequestAnimationFrame || root.clearTimeout)(this._scheduleId), bAll && (applyFilter(this, "beforeTween"), tweenProps(1, this._currentState, this._originalState, this._targetState, 1, 0, this._easing), applyFilter(this, "afterTween"), applyFilter(this, "afterTweenEnd"),
                            this._finish.call(this, this._currentState, this._attachment)), this;
                    }, Tweenable.prototype.isPlaying = function() {
                        return this._isTweening && !this._isPaused;
                    }, Tweenable.prototype.setScheduleFunction = function(scheduleFunction) {
                        /** @type {string} */
                        this._scheduleFunction = scheduleFunction;
                    }, Tweenable.prototype.dispose = function() {
                        var cacheProp;
                        for (cacheProp in this) {
                            if (this.hasOwnProperty(cacheProp)) {
                                delete this[cacheProp];
                            }
                        }
                    }, Tweenable.prototype.filter = {}, Tweenable.prototype.formula = {
                        linear : function(p) {
                            return p;
                        }
                    }, ease = Tweenable.prototype.formula, shallowCopy(Tweenable, {
                        now : now,
                        each : each,
                        tweenProps : tweenProps,
                        tweenProp : tweenProp,
                        applyFilter : applyFilter,
                        shallowCopy : shallowCopy,
                        defaults : defaults,
                        composeEasingObject : composeEasingObject
                    }), "function" == typeof SHIFTY_DEBUG_NOW && (root.timeoutHandler = timeoutHandler), "object" == typeof val ? module.exports = Tweenable : "function" == typeof obj && obj.amd ? obj(function() {
                        return Tweenable;
                    }) : "undefined" == typeof root.Tweenable && (root.Tweenable = Tweenable), Tweenable;
                }();
                !function() {
                    Tweenable.shallowCopy(Tweenable.prototype.formula, {
                        easeInQuad : function(t) {
                            return Math.pow(t, 2);
                        },
                        easeOutQuad : function(b) {
                            return -(Math.pow(b - 1, 2) - 1);
                        },
                        easeInOutQuad : function(t) {
                            return (t = t / .5) < 1 ? .5 * Math.pow(t, 2) : -.5 * ((t = t - 2) * t - 2);
                        },
                        easeInCubic : function(t) {
                            return Math.pow(t, 3);
                        },
                        easeOutCubic : function(b) {
                            return Math.pow(b - 1, 3) + 1;
                        },
                        easeInOutCubic : function(pos) {
                            return (pos = pos / .5) < 1 ? .5 * Math.pow(pos, 3) : .5 * (Math.pow(pos - 2, 3) + 2);
                        },
                        easeInQuart : function(t) {
                            return Math.pow(t, 4);
                        },
                        easeOutQuart : function(b) {
                            return -(Math.pow(b - 1, 4) - 1);
                        },
                        easeInOutQuart : function(pos) {
                            return (pos = pos / .5) < 1 ? .5 * Math.pow(pos, 4) : -.5 * ((pos = pos - 2) * Math.pow(pos, 3) - 2);
                        },
                        easeInQuint : function(t) {
                            return Math.pow(t, 5);
                        },
                        easeOutQuint : function(b) {
                            return Math.pow(b - 1, 5) + 1;
                        },
                        easeInOutQuint : function(pos) {
                            return (pos = pos / .5) < 1 ? .5 * Math.pow(pos, 5) : .5 * (Math.pow(pos - 2, 5) + 2);
                        },
                        easeInSine : function(value) {
                            return -Math.cos(value * (Math.PI / 2)) + 1;
                        },
                        easeOutSine : function(value) {
                            return Math.sin(value * (Math.PI / 2));
                        },
                        easeInOutSine : function(t) {
                            return -.5 * (Math.cos(Math.PI * t) - 1);
                        },
                        easeInExpo : function(value) {
                            return 0 === value ? 0 : Math.pow(2, 10 * (value - 1));
                        },
                        easeOutExpo : function(t) {
                            return 1 === t ? 1 : -Math.pow(2, -10 * t) + 1;
                        },
                        easeInOutExpo : function(value) {
                            return 0 === value ? 0 : 1 === value ? 1 : (value = value / .5) < 1 ? .5 * Math.pow(2, 10 * (value - 1)) : .5 * (-Math.pow(2, -10 * --value) + 2);
                        },
                        easeInCirc : function(value) {
                            return -(Math.sqrt(1 - value * value) - 1);
                        },
                        easeOutCirc : function(b) {
                            return Math.sqrt(1 - Math.pow(b - 1, 2));
                        },
                        easeInOutCirc : function(t) {
                            return (t = t / .5) < 1 ? -.5 * (Math.sqrt(1 - t * t) - 1) : .5 * (Math.sqrt(1 - (t = t - 2) * t) + 1);
                        },
                        easeOutBounce : function(t) {
                            return 1 / 2.75 > t ? 7.5625 * t * t : 2 / 2.75 > t ? 7.5625 * (t = t - 1.5 / 2.75) * t + .75 : 2.5 / 2.75 > t ? 7.5625 * (t = t - 2.25 / 2.75) * t + .9375 : 7.5625 * (t = t - 2.625 / 2.75) * t + .984375;
                        },
                        easeInBack : function(t) {
                            /** @type {number} */
                            var s = 1.70158;
                            return t * t * ((s + 1) * t - s);
                        },
                        easeOutBack : function(t) {
                            /** @type {number} */
                            var s = 1.70158;
                            return (t = t - 1) * t * ((s + 1) * t + s) + 1;
                        },
                        easeInOutBack : function(t) {
                            /** @type {number} */
                            var s = 1.70158;
                            return (t = t / .5) < 1 ? .5 * (t * t * (((s = s * 1.525) + 1) * t - s)) : .5 * ((t = t - 2) * t * (((s = s * 1.525) + 1) * t + s) + 2);
                        },
                        elastic : function(p) {
                            return -1 * Math.pow(4, -8 * p) * Math.sin((6 * p - 1) * (2 * Math.PI) / 2) + 1;
                        },
                        swingFromTo : function(pos) {
                            /** @type {number} */
                            var s = 1.70158;
                            return (pos = pos / .5) < 1 ? .5 * (pos * pos * (((s = s * 1.525) + 1) * pos - s)) : .5 * ((pos = pos - 2) * pos * (((s = s * 1.525) + 1) * pos + s) + 2);
                        },
                        swingFrom : function(t) {
                            /** @type {number} */
                            var s = 1.70158;
                            return t * t * ((s + 1) * t - s);
                        },
                        swingTo : function(t) {
                            /** @type {number} */
                            var s = 1.70158;
                            return (t = t - 1) * t * ((s + 1) * t + s) + 1;
                        },
                        bounce : function(percent) {
                            return 1 / 2.75 > percent ? 7.5625 * percent * percent : 2 / 2.75 > percent ? 7.5625 * (percent = percent - 1.5 / 2.75) * percent + .75 : 2.5 / 2.75 > percent ? 7.5625 * (percent = percent - 2.25 / 2.75) * percent + .9375 : 7.5625 * (percent = percent - 2.625 / 2.75) * percent + .984375;
                        },
                        bouncePast : function(pos) {
                            return 1 / 2.75 > pos ? 7.5625 * pos * pos : 2 / 2.75 > pos ? 2 - (7.5625 * (pos = pos - 1.5 / 2.75) * pos + .75) : 2.5 / 2.75 > pos ? 2 - (7.5625 * (pos = pos - 2.25 / 2.75) * pos + .9375) : 2 - (7.5625 * (pos = pos - 2.625 / 2.75) * pos + .984375);
                        },
                        easeFromTo : function(pos) {
                            return (pos = pos / .5) < 1 ? .5 * Math.pow(pos, 4) : -.5 * ((pos = pos - 2) * Math.pow(pos, 3) - 2);
                        },
                        easeFrom : function(pos) {
                            return Math.pow(pos, 4);
                        },
                        easeTo : function(n) {
                            return Math.pow(n, .25);
                        }
                    });
                }();
                (function() {
                    /**
                     * @param {number} t
                     * @param {number} p2x
                     * @param {number} p2y
                     * @param {string} p3x
                     * @param {string} p3y
                     * @param {number} duration
                     * @return {?}
                     */
                    function cubicBezierAtTime(t, p2x, p2y, p3x, p3y, duration) {
                        /**
                         * @param {!Object} t
                         * @return {?}
                         */
                        function sampleCurveX(t) {
                            return ((a * t + b) * t + c) * t;
                        }
                        /**
                         * @param {?} t
                         * @return {?}
                         */
                        function sampleCurveY(t) {
                            return ((bx * t + cx) * t + by) * t;
                        }
                        /**
                         * @param {number} t
                         * @return {?}
                         */
                        function sampleCurveDerivativeX(t) {
                            return (3 * a * t + 2 * b) * t + c;
                        }
                        /**
                         * @param {number} duration
                         * @return {?}
                         */
                        function solveEpsilon(duration) {
                            return 1 / (200 * duration);
                        }
                        /**
                         * @param {number} x
                         * @param {?} epsilon
                         * @return {?}
                         */
                        function solve(x, epsilon) {
                            return sampleCurveY(solveCurveX(x, epsilon));
                        }
                        /**
                         * @param {number} n
                         * @return {?}
                         */
                        function fabs(n) {
                            return n >= 0 ? n : 0 - n;
                        }
                        /**
                         * @param {number} x
                         * @param {?} epsilon
                         * @return {?}
                         */
                        function solveCurveX(x, epsilon) {
                            var t1;
                            var t0;
                            var t2;
                            var x2;
                            var d2;
                            var j;
                            /** @type {number} */
                            t2 = x;
                            /** @type {number} */
                            j = 0;
                            for (; 8 > j; j++) {
                                if (x2 = sampleCurveX(t2) - x, fabs(x2) < epsilon) {
                                    return t2;
                                }
                                if (d2 = sampleCurveDerivativeX(t2), fabs(d2) < 1E-6) {
                                    break;
                                }
                                /** @type {number} */
                                t2 = t2 - x2 / d2;
                            }
                            if (t1 = 0, t0 = 1, t2 = x, t1 > t2) {
                                return t1;
                            }
                            if (t2 > t0) {
                                return t0;
                            }
                            for (; t0 > t1;) {
                                if (x2 = sampleCurveX(t2), fabs(x2 - x) < epsilon) {
                                    return t2;
                                }
                                if (x > x2) {
                                    t1 = t2;
                                } else {
                                    t0 = t2;
                                }
                                /** @type {number} */
                                t2 = .5 * (t0 - t1) + t1;
                            }
                            return t2;
                        }
                        /** @type {number} */
                        var a = 0;
                        /** @type {number} */
                        var b = 0;
                        /** @type {number} */
                        var c = 0;
                        /** @type {number} */
                        var bx = 0;
                        /** @type {number} */
                        var cx = 0;
                        /** @type {number} */
                        var by = 0;
                        return c = 3 * p2x, b = 3 * (p3x - p2x) - c, a = 1 - c - b, by = 3 * p2y, cx = 3 * (p3y - p2y) - by, bx = 1 - by - cx, solve(t, solveEpsilon(duration));
                    }
                    /**
                     * @param {number} x1
                     * @param {number} y1
                     * @param {!Function} x2
                     * @param {!Function} y2
                     * @return {?}
                     */
                    function getCubicBezierTransition(x1, y1, x2, y2) {
                        return function(t) {
                            return cubicBezierAtTime(t, x1, y1, x2, y2, 1);
                        };
                    }
                    /**
                     * @param {string} name
                     * @param {number} x1
                     * @param {number} y1
                     * @param {number} x2
                     * @param {number} y2
                     * @return {?}
                     */
                    Tweenable.setBezierFunction = function(name, x1, y1, x2, y2) {
                        var cubicBezierTransition = getCubicBezierTransition(x1, y1, x2, y2);
                        return cubicBezierTransition.displayName = name, cubicBezierTransition.x1 = x1, cubicBezierTransition.y1 = y1, cubicBezierTransition.x2 = x2, cubicBezierTransition.y2 = y2, Tweenable.prototype.formula[name] = cubicBezierTransition;
                    };
                    /**
                     * @param {?} name
                     * @return {undefined}
                     */
                    Tweenable.unsetBezierFunction = function(name) {
                        delete Tweenable.prototype.formula[name];
                    };
                })();
                (function() {
                    /**
                     * @param {!Array} from
                     * @param {(Object|string)} current
                     * @param {!Array} targetState
                     * @param {number} position
                     * @param {!Array} easing
                     * @param {undefined} delay
                     * @return {?}
                     */
                    function getInterpolatedValues(from, current, targetState, position, easing, delay) {
                        return Tweenable.tweenProps(position, current, from, targetState, 1, delay, easing);
                    }
                    var mockTweenable = new Tweenable;
                    /** @type {!Array} */
                    mockTweenable._filterArgs = [];
                    /**
                     * @param {!Array} from
                     * @param {!Array} targetState
                     * @param {number} position
                     * @param {string} easing
                     * @param {number} opt_delay
                     * @return {?}
                     */
                    Tweenable.interpolate = function(from, targetState, position, easing, opt_delay) {
                        var current = Tweenable.shallowCopy({}, from);
                        var delay = opt_delay || 0;
                        var easingObject = Tweenable.composeEasingObject(from, easing || "linear");
                        mockTweenable.set({});
                        var filterArgs = mockTweenable._filterArgs;
                        /** @type {number} */
                        filterArgs.length = 0;
                        filterArgs[0] = current;
                        /** @type {!Array} */
                        filterArgs[1] = from;
                        /** @type {!Array} */
                        filterArgs[2] = targetState;
                        filterArgs[3] = easingObject;
                        Tweenable.applyFilter(mockTweenable, "tweenCreated");
                        Tweenable.applyFilter(mockTweenable, "beforeTween");
                        var interpolatedValues = getInterpolatedValues(from, current, targetState, position, easingObject, delay);
                        return Tweenable.applyFilter(mockTweenable, "afterTween"), interpolatedValues;
                    };
                })();
                (function(Tweenable) {
                    /**
                     * @param {!NodeList} rawValues
                     * @param {string} prefix
                     * @return {?}
                     */
                    function getFormatChunksFrom(rawValues, prefix) {
                        var end;
                        /** @type {!Array} */
                        var new_js = [];
                        var rawValuesLength = rawValues.length;
                        /** @type {number} */
                        end = 0;
                        for (; rawValuesLength > end; end++) {
                            new_js.push("_" + prefix + "_" + end);
                        }
                        return new_js;
                    }
                    /**
                     * @param {string} formattedString
                     * @return {?}
                     */
                    function getFormatStringFrom(formattedString) {
                        var chunks = formattedString.match(R_FORMAT_CHUNKS);
                        return chunks ? (1 === chunks.length || formattedString[0].match(rDataName)) && chunks.unshift("") : chunks = ["", ""], chunks.join(VALUE_PLACEHOLDER);
                    }
                    /**
                     * @param {!Object} stateObject
                     * @return {undefined}
                     */
                    function sanitizeObjectForHexProps(stateObject) {
                        Tweenable.each(stateObject, function(prop) {
                            var currentProp = stateObject[prop];
                            if ("string" == typeof currentProp && currentProp.match(R_HEX)) {
                                stateObject[prop] = sanitizeHexChunksToRGB(currentProp);
                            }
                        });
                    }
                    /**
                     * @param {string} str
                     * @return {?}
                     */
                    function sanitizeHexChunksToRGB(str) {
                        return filterStringChunks(R_HEX, str, convertHexToRGB);
                    }
                    /**
                     * @param {string} d
                     * @return {?}
                     */
                    function convertHexToRGB(d) {
                        var q = g(d);
                        return "rgb(" + q[0] + "," + q[1] + "," + q[2] + ")";
                    }
                    /**
                     * @param {string} s
                     * @return {?}
                     */
                    function g(s) {
                        return s = s.replace(/#/, ""), 3 === s.length && (s = s.split(""), s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2]), SwissProt2colorDictionary[0] = p(s.substr(0, 2)), SwissProt2colorDictionary[1] = p(s.substr(2, 2)), SwissProt2colorDictionary[2] = p(s.substr(4, 2)), SwissProt2colorDictionary;
                    }
                    /**
                     * @param {?} s
                     * @return {?}
                     */
                    function p(s) {
                        return parseInt(s, 16);
                    }
                    /**
                     * @param {!RegExp} pattern
                     * @param {string} unfilteredString
                     * @param {!Function} filter
                     * @return {?}
                     */
                    function filterStringChunks(pattern, unfilteredString, filter) {
                        var r = unfilteredString.match(pattern);
                        var filteredString = unfilteredString.replace(pattern, VALUE_PLACEHOLDER);
                        if (r) {
                            var currentChunk;
                            var w = r.length;
                            /** @type {number} */
                            var fitWidth = 0;
                            for (; w > fitWidth; fitWidth++) {
                                currentChunk = r.shift();
                                filteredString = filteredString.replace(VALUE_PLACEHOLDER, filter(currentChunk));
                            }
                        }
                        return filteredString;
                    }
                    /**
                     * @param {string} formattedString
                     * @return {?}
                     */
                    function sanitizeRGBChunks(formattedString) {
                        return filterStringChunks(R_RGB, formattedString, sanitizeRGBChunk);
                    }
                    /**
                     * @param {string} p
                     * @return {?}
                     */
                    function sanitizeRGBChunk(p) {
                        var results = p.match(reg);
                        var count = results.length;
                        var replay = p.match(re_pba_css)[0];
                        /** @type {number} */
                        var index = 0;
                        for (; count > index; index++) {
                            /** @type {string} */
                            replay = replay + (parseInt(results[index], 10) + ",");
                        }
                        return replay = replay.slice(0, -1) + ")";
                    }
                    /**
                     * @param {!Object} stateObject
                     * @return {?}
                     */
                    function getFormatManifests(stateObject) {
                        var manifestAccumulator = {};
                        return Tweenable.each(stateObject, function(prop) {
                            var currentProp = stateObject[prop];
                            if ("string" == typeof currentProp) {
                                var rawValues = getValuesFrom(currentProp);
                                manifestAccumulator[prop] = {
                                    formatString : getFormatStringFrom(currentProp),
                                    chunkNames : getFormatChunksFrom(rawValues, prop)
                                };
                            }
                        }), manifestAccumulator;
                    }
                    /**
                     * @param {!Function} stateObject
                     * @param {!Object} formatManifests
                     * @return {undefined}
                     */
                    function expandFormattedProperties(stateObject, formatManifests) {
                        Tweenable.each(formatManifests, function(prop) {
                            var currentProp = stateObject[prop];
                            var rawValues = getValuesFrom(currentProp);
                            var len = rawValues.length;
                            /** @type {number} */
                            var i = 0;
                            for (; len > i; i++) {
                                /** @type {number} */
                                stateObject[formatManifests[prop].chunkNames[i]] = +rawValues[i];
                            }
                            delete stateObject[prop];
                        });
                    }
                    /**
                     * @param {!Array} stateObject
                     * @param {(Object|string)} formatManifests
                     * @return {undefined}
                     */
                    function collapseFormattedProperties(stateObject, formatManifests) {
                        Tweenable.each(formatManifests, function(prop) {
                            var currentProp = stateObject[prop];
                            var formatChunks = extractPropertyChunks(stateObject, formatManifests[prop].chunkNames);
                            var valuesList = getValuesList(formatChunks, formatManifests[prop].chunkNames);
                            currentProp = getFormattedValues(formatManifests[prop].formatString, valuesList);
                            stateObject[prop] = sanitizeRGBChunks(currentProp);
                        });
                    }
                    /**
                     * @param {!Array} stateObject
                     * @param {!NodeList} chunkNames
                     * @return {?}
                     */
                    function extractPropertyChunks(stateObject, chunkNames) {
                        var currentChunkName;
                        var extractedValues = {};
                        var countRep = chunkNames.length;
                        /** @type {number} */
                        var i = 0;
                        for (; countRep > i; i++) {
                            currentChunkName = chunkNames[i];
                            extractedValues[currentChunkName] = stateObject[currentChunkName];
                            delete stateObject[currentChunkName];
                        }
                        return extractedValues;
                    }
                    /**
                     * @param {?} stateObject
                     * @param {!NodeList} chunkNames
                     * @return {?}
                     */
                    function getValuesList(stateObject, chunkNames) {
                        /** @type {number} */
                        getValuesList_accumulator.length = 0;
                        var countRep = chunkNames.length;
                        /** @type {number} */
                        var i = 0;
                        for (; countRep > i; i++) {
                            getValuesList_accumulator.push(stateObject[chunkNames[i]]);
                        }
                        return getValuesList_accumulator;
                    }
                    /**
                     * @param {!Object} formatString
                     * @param {!NodeList} rawValues
                     * @return {?}
                     */
                    function getFormattedValues(formatString, rawValues) {
                        /** @type {!Object} */
                        var formattedValueString = formatString;
                        var len = rawValues.length;
                        /** @type {number} */
                        var i = 0;
                        for (; len > i; i++) {
                            formattedValueString = formattedValueString.replace(VALUE_PLACEHOLDER, +rawValues[i].toFixed(4));
                        }
                        return formattedValueString;
                    }
                    /**
                     * @param {string} formattedString
                     * @return {?}
                     */
                    function getValuesFrom(formattedString) {
                        return formattedString.match(reg);
                    }
                    /**
                     * @param {!Function} easingObject
                     * @param {!Object} tokenData
                     * @return {undefined}
                     */
                    function expandEasingObject(easingObject, tokenData) {
                        Tweenable.each(tokenData, function(prop) {
                            var i;
                            var currentProp = tokenData[prop];
                            var chunkNames = currentProp.chunkNames;
                            var chunkNamesLength = chunkNames.length;
                            var easing = easingObject[prop];
                            if ("string" == typeof easing) {
                                /** @type {!Array<string>} */
                                var easingChunks = easing.split(" ");
                                /** @type {string} */
                                var lastEasingChunk = easingChunks[easingChunks.length - 1];
                                /** @type {number} */
                                i = 0;
                                for (; chunkNamesLength > i; i++) {
                                    /** @type {string} */
                                    easingObject[chunkNames[i]] = easingChunks[i] || lastEasingChunk;
                                }
                            } else {
                                /** @type {number} */
                                i = 0;
                                for (; chunkNamesLength > i; i++) {
                                    easingObject[chunkNames[i]] = easing;
                                }
                            }
                            delete easingObject[prop];
                        });
                    }
                    /**
                     * @param {!Function} easingObject
                     * @param {!Object} tokenData
                     * @return {undefined}
                     */
                    function collapseEasingObject(easingObject, tokenData) {
                        Tweenable.each(tokenData, function(prop) {
                            var currentProp = tokenData[prop];
                            var chunkNames = currentProp.chunkNames;
                            var countRep = chunkNames.length;
                            var easing = easingObject[chunkNames[0]];
                            /** @type {string} */
                            var type = typeof easing;
                            if ("string" === type) {
                                /** @type {string} */
                                var postParam = "";
                                /** @type {number} */
                                var i = 0;
                                for (; countRep > i; i++) {
                                    /** @type {string} */
                                    postParam = postParam + (" " + easingObject[chunkNames[i]]);
                                    delete easingObject[chunkNames[i]];
                                }
                                /** @type {string} */
                                easingObject[prop] = postParam.substr(1);
                            } else {
                                easingObject[prop] = easing;
                            }
                        });
                    }
                    /** @type {!RegExp} */
                    var rDataName = /(\d|\-|\.)/;
                    /** @type {!RegExp} */
                    var R_FORMAT_CHUNKS = /([^\-0-9\.]+)/g;
                    /** @type {!RegExp} */
                    var reg = /[0-9.\-]+/g;
                    /** @type {!RegExp} */
                    var R_RGB = new RegExp("rgb\\(" + reg.source + /,\s*/.source + reg.source + /,\s*/.source + reg.source + "\\)", "g");
                    /** @type {!RegExp} */
                    var re_pba_css = /^.*\(/;
                    /** @type {!RegExp} */
                    var R_HEX = /#([0-9]|[a-f]){3,6}/gi;
                    /** @type {string} */
                    var VALUE_PLACEHOLDER = "VAL";
                    /** @type {!Array} */
                    var SwissProt2colorDictionary = [];
                    /** @type {!Array} */
                    var getValuesList_accumulator = [];
                    Tweenable.prototype.filter.token = {
                        tweenCreated : function(currentState, fromState, toState, easingObject) {
                            sanitizeObjectForHexProps(currentState);
                            sanitizeObjectForHexProps(fromState);
                            sanitizeObjectForHexProps(toState);
                            this._tokenData = getFormatManifests(currentState);
                        },
                        beforeTween : function(currentState, fromState, toState, easingObject) {
                            expandEasingObject(easingObject, this._tokenData);
                            expandFormattedProperties(currentState, this._tokenData);
                            expandFormattedProperties(fromState, this._tokenData);
                            expandFormattedProperties(toState, this._tokenData);
                        },
                        afterTween : function(currentState, fromState, toState, easingObject) {
                            collapseFormattedProperties(currentState, this._tokenData);
                            collapseFormattedProperties(fromState, this._tokenData);
                            collapseFormattedProperties(toState, this._tokenData);
                            collapseEasingObject(easingObject, this._tokenData);
                        }
                    };
                })(Tweenable);
            }).call(null);
        }, {}],
        2 : [function(require, module, canCreateDiscussions) {
            var Progress = require("./shape");
            var utils = require("./utils");
            /**
             * @param {?} maxRad
             * @param {?} theta
             * @return {undefined}
             */
            var Circle = function(maxRad, theta) {
                /** @type {string} */
                this._pathTemplate = "M 50,50 m 0,-{radius} a {radius},{radius} 0 1 1 0,{2radius} a {radius},{radius} 0 1 1 0,-{2radius}";
                /** @type {number} */
                this.containerAspectRatio = 1;
                Progress.apply(this, arguments);
            };
            Circle.prototype = new Progress;
            /** @type {function(?, ?): undefined} */
            Circle.prototype.constructor = Circle;
            /**
             * @param {!Object} opts
             * @return {?}
             */
            Circle.prototype._pathString = function(opts) {
                var width = opts.strokeWidth;
                if (opts.trailWidth && opts.trailWidth > opts.strokeWidth) {
                    width = opts.trailWidth;
                }
                /** @type {number} */
                var current_radius = 50 - width / 2;
                return utils.render(this._pathTemplate, {
                    radius : current_radius,
                    "2radius" : 2 * current_radius
                });
            };
            /**
             * @param {!Object} opts
             * @return {?}
             */
            Circle.prototype._trailString = function(opts) {
                return this._pathString(opts);
            };
            /** @type {function(?, ?): undefined} */
            module.exports = Circle;
        }, {
            "./shape" : 7,
            "./utils" : 8
        }],
        3 : [function(require, module, canCreateDiscussions) {
            var Progress = require("./shape");
            var utils = require("./utils");
            /**
             * @param {?} a
             * @param {?} b
             * @return {undefined}
             */
            var Line = function(a, b) {
                /** @type {string} */
                this._pathTemplate = "M 0,{center} L 100,{center}";
                Progress.apply(this, arguments);
            };
            Line.prototype = new Progress;
            /** @type {function(?, ?): undefined} */
            Line.prototype.constructor = Line;
            /**
             * @param {!Element} svg
             * @param {!Object} opts
             * @return {undefined}
             */
            Line.prototype._initializeSvg = function(svg, opts) {
                svg.setAttribute("viewBox", "0 0 100 " + opts.strokeWidth);
                svg.setAttribute("preserveAspectRatio", "none");
            };
            /**
             * @param {!Object} opts
             * @return {?}
             */
            Line.prototype._pathString = function(opts) {
                return utils.render(this._pathTemplate, {
                    center : opts.strokeWidth / 2
                });
            };
            /**
             * @param {!Object} opts
             * @return {?}
             */
            Line.prototype._trailString = function(opts) {
                return this._pathString(opts);
            };
            /** @type {function(?, ?): undefined} */
            module.exports = Line;
        }, {
            "./shape" : 7,
            "./utils" : 8
        }],
        4 : [function(require, module, canCreateDiscussions) {
            module.exports = {
                Line : require("./line"),
                Circle : require("./circle"),
                SemiCircle : require("./semicircle"),
                Path : require("./path"),
                Shape : require("./shape"),
                utils : require("./utils")
            };
        }, {
            "./circle" : 2,
            "./line" : 3,
            "./path" : 5,
            "./semicircle" : 6,
            "./shape" : 7,
            "./utils" : 8
        }],
        5 : [function(require, module, canCreateDiscussions) {
            var Tweenable = require("shifty");
            var utils = require("./utils");
            var EASING_ALIASES = {
                easeIn : "easeInCubic",
                easeOut : "easeOutCubic",
                easeInOut : "easeInOutCubic"
            };
            /**
             * @param {!Object} val
             * @param {!Object} options
             * @return {undefined}
             */
            var Path = function Path(val, options) {
                if (!(this instanceof Path)) {
                    throw new Error("Constructor was called without new keyword");
                }
                options = utils.extend({
                    duration : 800,
                    easing : "linear",
                    from : {},
                    to : {},
                    step : function() {
                    }
                }, options);
                var value;
                value = utils.isString(val) ? document.querySelector(val) : val;
                this.path = value;
                /** @type {!Object} */
                this._opts = options;
                /** @type {null} */
                this._tweenable = null;
                var length = this.path.getTotalLength();
                /** @type {string} */
                this.path.style.strokeDasharray = length + " " + length;
                this.set(0);
            };
            /**
             * @return {?}
             */
            Path.prototype.value = function() {
                var offset = this._getComputedDashOffset();
                var FLOOR_RES = this.path.getTotalLength();
                /** @type {number} */
                var e_total = 1 - offset / FLOOR_RES;
                return parseFloat(e_total.toFixed(6), 10);
            };
            /**
             * @param {?} progress
             * @return {undefined}
             */
            Path.prototype.set = function(progress) {
                this.stop();
                this.path.style.strokeDashoffset = this._progressToOffset(progress);
                var step = this._opts.step;
                if (utils.isFunction(step)) {
                    var easing = this._easing(this._opts.easing);
                    var values = this._calculateTo(progress, easing);
                    var get_repo_config = this._opts.shape || this;
                    step(values, get_repo_config, this._opts.attachment);
                }
            };
            /**
             * @return {undefined}
             */
            Path.prototype.stop = function() {
                this._stopTween();
                this.path.style.strokeDashoffset = this._getComputedDashOffset();
            };
            /**
             * @param {?} progress
             * @param {!Object} opts
             * @param {!Object} cb
             * @return {undefined}
             */
            Path.prototype.animate = function(progress, opts, cb) {
                opts = opts || {};
                if (utils.isFunction(opts)) {
                    /** @type {!Object} */
                    cb = opts;
                    opts = {};
                }
                var passedOpts = utils.extend({}, opts);
                var defaultOpts = utils.extend({}, this._opts);
                opts = utils.extend(defaultOpts, opts);
                var shiftyEasing = this._easing(opts.easing);
                var values = this._resolveFromAndTo(progress, shiftyEasing, passedOpts);
                this.stop();
                this.path.getBoundingClientRect();
                var offset = this._getComputedDashOffset();
                var newOffset = this._progressToOffset(progress);
                var self = this;
                this._tweenable = new Tweenable;
                this._tweenable.tween({
                    from : utils.extend({
                        offset : offset
                    }, values.from),
                    to : utils.extend({
                        offset : newOffset
                    }, values.to),
                    duration : opts.duration,
                    easing : shiftyEasing,
                    step : function(state) {
                        self.path.style.strokeDashoffset = state.offset;
                        var next = opts.shape || self;
                        opts.step(state, next, opts.attachment);
                    },
                    finish : function(state) {
                        if (utils.isFunction(cb)) {
                            cb();
                        }
                    }
                });
            };
            /**
             * @return {?}
             */
            Path.prototype._getComputedDashOffset = function() {
                var computedStyle = window.getComputedStyle(this.path, null);
                return parseFloat(computedStyle.getPropertyValue("stroke-dashoffset"), 10);
            };
            /**
             * @param {?} progress
             * @return {?}
             */
            Path.prototype._progressToOffset = function(progress) {
                var length = this.path.getTotalLength();
                return length - progress * length;
            };
            /**
             * @param {!Array} progress
             * @param {string} easing
             * @param {!Object} opts
             * @return {?}
             */
            Path.prototype._resolveFromAndTo = function(progress, easing, opts) {
                return opts.from && opts.to ? {
                    from : opts.from,
                    to : opts.to
                } : {
                    from : this._calculateFrom(easing),
                    to : this._calculateTo(progress, easing)
                };
            };
            /**
             * @param {string} easing
             * @return {?}
             */
            Path.prototype._calculateFrom = function(easing) {
                return Tweenable.interpolate(this._opts.from, this._opts.to, this.value(), easing);
            };
            /**
             * @param {!Array} progress
             * @param {string} easing
             * @return {?}
             */
            Path.prototype._calculateTo = function(progress, easing) {
                return Tweenable.interpolate(this._opts.from, this._opts.to, progress, easing);
            };
            /**
             * @return {undefined}
             */
            Path.prototype._stopTween = function() {
                if (null !== this._tweenable) {
                    this._tweenable.stop();
                    /** @type {null} */
                    this._tweenable = null;
                }
            };
            /**
             * @param {string} easing
             * @return {?}
             */
            Path.prototype._easing = function(easing) {
                return EASING_ALIASES.hasOwnProperty(easing) ? EASING_ALIASES[easing] : easing;
            };
            /** @type {function(!Object, !Object): undefined} */
            module.exports = Path;
        }, {
            "./utils" : 8,
            shifty : 1
        }],
        6 : [function(require, module, canCreateDiscussions) {
            var Shape = require("./shape");
            var Square = require("./circle");
            var utils = require("./utils");
            /**
             * @param {?} options
             * @param {?} container
             * @return {undefined}
             */
            var SemiCircle = function(options, container) {
                /** @type {string} */
                this._pathTemplate = "M 50,50 m -{radius},0 a {radius},{radius} 0 1 1 {2radius},0";
                /** @type {number} */
                this.containerAspectRatio = 2;
                Shape.apply(this, arguments);
            };
            SemiCircle.prototype = new Shape;
            /** @type {function(?, ?): undefined} */
            SemiCircle.prototype.constructor = SemiCircle;
            /**
             * @param {!Element} svg
             * @param {!Object} opts
             * @return {undefined}
             */
            SemiCircle.prototype._initializeSvg = function(svg, opts) {
                svg.setAttribute("viewBox", "0 0 100 50");
            };
            /**
             * @param {!Object} opts
             * @param {!Node} container
             * @param {!Element} textContainer
             * @return {undefined}
             */
            SemiCircle.prototype._initializeTextContainer = function(opts, container, textContainer) {
                if (opts.text.style) {
                    /** @type {string} */
                    textContainer.style.top = "auto";
                    /** @type {string} */
                    textContainer.style.bottom = "0";
                    if (opts.text.alignToBottom) {
                        utils.setStyle(textContainer, "transform", "translate(-50%, 0)");
                    } else {
                        utils.setStyle(textContainer, "transform", "translate(-50%, 50%)");
                    }
                }
            };
            SemiCircle.prototype._pathString = Square.prototype._pathString;
            SemiCircle.prototype._trailString = Square.prototype._trailString;
            /** @type {function(?, ?): undefined} */
            module.exports = SemiCircle;
        }, {
            "./circle" : 2,
            "./shape" : 7,
            "./utils" : 8
        }],
        7 : [function(require, module, canCreateDiscussions) {
            var Path = require("./path");
            var utils = require("./utils");
            /** @type {string} */
            var lastErrorOutput = "Object is destroyed";
            /**
             * @param {!Object} element
             * @param {!Object} opts
             * @return {undefined}
             */
            var Shape = function Shape(element, opts) {
                if (!(this instanceof Shape)) {
                    throw new Error("Constructor was called without new keyword");
                }
                if (0 !== arguments.length) {
                    this._opts = utils.extend({
                        color : "#555",
                        strokeWidth : 1,
                        trailColor : null,
                        trailWidth : null,
                        fill : null,
                        text : {
                            style : {
                                color : null,
                                position : "absolute",
                                left : "50%",
                                top : "50%",
                                padding : 0,
                                margin : 0,
                                transform : {
                                    prefix : true,
                                    value : "translate(-50%, -50%)"
                                }
                            },
                            autoStyleContainer : true,
                            alignToBottom : true,
                            value : null,
                            className : "progressbar-text"
                        },
                        svgStyle : {
                            display : "block",
                            width : "100%"
                        },
                        warnings : false
                    }, opts, true);
                    if (utils.isObject(opts) && void 0 !== opts.svgStyle) {
                        this._opts.svgStyle = opts.svgStyle;
                    }
                    if (utils.isObject(opts) && utils.isObject(opts.text) && void 0 !== opts.text.style) {
                        this._opts.text.style = opts.text.style;
                    }
                    var container;
                    var svgView = this._createSvgView(this._opts);
                    if (container = utils.isString(element) ? document.querySelector(element) : element, !container) {
                        throw new Error("Container does not exist: " + element);
                    }
                    this._container = container;
                    this._container.appendChild(svgView.svg);
                    if (this._opts.warnings) {
                        this._warnContainerAspectRatio(this._container);
                    }
                    if (this._opts.svgStyle) {
                        utils.setStyles(svgView.svg, this._opts.svgStyle);
                    }
                    this.svg = svgView.svg;
                    this.path = svgView.path;
                    this.trail = svgView.trail;
                    /** @type {null} */
                    this.text = null;
                    var newOpts = utils.extend({
                        attachment : void 0,
                        shape : this
                    }, this._opts);
                    this._progressPath = new Path(svgView.path, newOpts);
                    if (utils.isObject(this._opts.text) && null !== this._opts.text.value) {
                        this.setText(this._opts.text.value);
                    }
                }
            };
            /**
             * @param {?} progress
             * @param {!Object} opts
             * @param {!Object} cb
             * @return {undefined}
             */
            Shape.prototype.animate = function(progress, opts, cb) {
                if (null === this._progressPath) {
                    throw new Error(lastErrorOutput);
                }
                this._progressPath.animate(progress, opts, cb);
            };
            /**
             * @return {undefined}
             */
            Shape.prototype.stop = function() {
                if (null === this._progressPath) {
                    throw new Error(lastErrorOutput);
                }
                if (void 0 !== this._progressPath) {
                    this._progressPath.stop();
                }
            };
            /**
             * @return {undefined}
             */
            Shape.prototype.destroy = function() {
                if (null === this._progressPath) {
                    throw new Error(lastErrorOutput);
                }
                this.stop();
                this.svg.parentNode.removeChild(this.svg);
                /** @type {null} */
                this.svg = null;
                /** @type {null} */
                this.path = null;
                /** @type {null} */
                this.trail = null;
                /** @type {null} */
                this._progressPath = null;
                if (null !== this.text) {
                    this.text.parentNode.removeChild(this.text);
                    /** @type {null} */
                    this.text = null;
                }
            };
            /**
             * @param {?} progress
             * @return {undefined}
             */
            Shape.prototype.set = function(progress) {
                if (null === this._progressPath) {
                    throw new Error(lastErrorOutput);
                }
                this._progressPath.set(progress);
            };
            /**
             * @return {?}
             */
            Shape.prototype.value = function() {
                if (null === this._progressPath) {
                    throw new Error(lastErrorOutput);
                }
                return void 0 === this._progressPath ? 0 : this._progressPath.value();
            };
            /**
             * @param {string} label
             * @return {undefined}
             */
            Shape.prototype.setText = function(label) {
                if (null === this._progressPath) {
                    throw new Error(lastErrorOutput);
                }
                if (null === this.text) {
                    this.text = this._createTextContainer(this._opts, this._container);
                    this._container.appendChild(this.text);
                }
                if (utils.isObject(label)) {
                    utils.removeChildren(this.text);
                    this.text.appendChild(label);
                } else {
                    /** @type {string} */
                    this.text.innerHTML = label;
                }
            };
            /**
             * @param {!Object} opts
             * @return {?}
             */
            Shape.prototype._createSvgView = function(opts) {
                /** @type {!Element} */
                var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                this._initializeSvg(svg, opts);
                /** @type {null} */
                var trailPath = null;
                if (opts.trailColor || opts.trailWidth) {
                    trailPath = this._createTrail(opts);
                    svg.appendChild(trailPath);
                }
                var path = this._createPath(opts);
                return svg.appendChild(path), {
                    svg : svg,
                    path : path,
                    trail : trailPath
                };
            };
            /**
             * @param {!Element} svg
             * @param {!Object} opts
             * @return {undefined}
             */
            Shape.prototype._initializeSvg = function(svg, opts) {
                svg.setAttribute("viewBox", "0 0 100 100");
            };
            /**
             * @param {!Object} opts
             * @return {?}
             */
            Shape.prototype._createPath = function(opts) {
                var pathString = this._pathString(opts);
                return this._createPathElement(pathString, opts);
            };
            /**
             * @param {!Object} opts
             * @return {?}
             */
            Shape.prototype._createTrail = function(opts) {
                var pathString = this._trailString(opts);
                var newOpts = utils.extend({}, opts);
                return newOpts.trailColor || (newOpts.trailColor = "#eee"), newOpts.trailWidth || (newOpts.trailWidth = newOpts.strokeWidth), newOpts.color = newOpts.trailColor, newOpts.strokeWidth = newOpts.trailWidth, newOpts.fill = null, this._createPathElement(pathString, newOpts);
            };
            /**
             * @param {?} pathString
             * @param {!Object} opts
             * @return {?}
             */
            Shape.prototype._createPathElement = function(pathString, opts) {
                /** @type {!Element} */
                var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                return path.setAttribute("d", pathString), path.setAttribute("stroke", opts.color), path.setAttribute("stroke-width", opts.strokeWidth), opts.fill ? path.setAttribute("fill", opts.fill) : path.setAttribute("fill-opacity", "0"), path;
            };
            /**
             * @param {!Object} opts
             * @param {!Node} container
             * @return {?}
             */
            Shape.prototype._createTextContainer = function(opts, container) {
                /** @type {!Element} */
                var textContainer = document.createElement("div");
                textContainer.className = opts.text.className;
                var textStyle = opts.text.style;
                return textStyle && (opts.text.autoStyleContainer && (container.style.position = "relative"), utils.setStyles(textContainer, textStyle), textStyle.color || (textContainer.style.color = opts.color)), this._initializeTextContainer(opts, container, textContainer), textContainer;
            };
            /**
             * @param {!Object} container
             * @param {!Node} key
             * @param {(Node|Window)} element
             * @return {undefined}
             */
            Shape.prototype._initializeTextContainer = function(container, key, element) {
            };
            /**
             * @param {!Object} opts
             * @return {?}
             */
            Shape.prototype._pathString = function(opts) {
                throw new Error("Override this function for each progress bar");
            };
            /**
             * @param {!Object} opts
             * @return {?}
             */
            Shape.prototype._trailString = function(opts) {
                throw new Error("Override this function for each progress bar");
            };
            /**
             * @param {string} container
             * @return {undefined}
             */
            Shape.prototype._warnContainerAspectRatio = function(container) {
                if (this.containerAspectRatio) {
                    var containerStyles = window.getComputedStyle(container, null);
                    /** @type {number} */
                    var width = parseFloat(containerStyles.getPropertyValue("width"), 10);
                    /** @type {number} */
                    var height = parseFloat(containerStyles.getPropertyValue("height"), 10);
                    if (!utils.floatEquals(this.containerAspectRatio, width / height)) {
                        console.warn("Incorrect aspect ratio of container", "#" + container.id, "detected:", containerStyles.getPropertyValue("width") + "(width)", "/", containerStyles.getPropertyValue("height") + "(height)", "=", width / height);
                        console.warn("Aspect ratio of should be", this.containerAspectRatio);
                    }
                }
            };
            /** @type {function(!Object, !Object): undefined} */
            module.exports = Shape;
        }, {
            "./path" : 5,
            "./utils" : 8
        }],
        8 : [function(a, module, canCreateDiscussions) {
            /**
             * @param {!Object} target
             * @param {!Object} obj
             * @param {string} deep
             * @return {?}
             */
            function extend(target, obj, deep) {
                target = target || {};
                obj = obj || {};
                deep = deep || false;
                var key;
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        var value = target[key];
                        var val = obj[key];
                        if (deep && isObject(value) && isObject(val)) {
                            target[key] = extend(value, val, deep);
                        } else {
                            target[key] = val;
                        }
                    }
                }
                return target;
            }
            /**
             * @param {!Object} name
             * @param {!Object} item
             * @return {?}
             */
            function tag(name, item) {
                /** @type {!Object} */
                var result = name;
                var i;
                for (i in item) {
                    if (item.hasOwnProperty(i)) {
                        var word = item[i];
                        /** @type {string} */
                        var keyString = "\\{" + i + "\\}";
                        /** @type {!RegExp} */
                        var re = new RegExp(keyString, "g");
                        result = result.replace(re, word);
                    }
                }
                return result;
            }
            /**
             * @param {!Element} element
             * @param {string} name
             * @param {string} val
             * @return {undefined}
             */
            function setStyle(element, name, val) {
                var m = element.style;
                /** @type {number} */
                var i = 0;
                for (; i < treesDirsFiles.length; ++i) {
                    /** @type {string} */
                    var set = treesDirsFiles[i];
                    /** @type {string} */
                    m[set + capitalize(name)] = val;
                }
                /** @type {string} */
                m[name] = val;
            }
            /**
             * @param {!Element} element
             * @param {!Object} styles
             * @return {undefined}
             */
            function setStyles(element, styles) {
                forEachObject(styles, function(a, name) {
                    if (null !== a && void 0 !== a) {
                        if (isObject(a) && a.prefix === true) {
                            setStyle(element, name, a.value);
                        } else {
                            /** @type {!Object} */
                            element.style[name] = a;
                        }
                    }
                });
            }
            /**
             * @param {string} str
             * @return {?}
             */
            function capitalize(str) {
                return str.charAt(0).toUpperCase() + str.slice(1);
            }
            /**
             * @param {!Object} s
             * @return {?}
             */
            function _iss(s) {
                return "string" == typeof s || s instanceof String;
            }
            /**
             * @param {!Object} func
             * @return {?}
             */
            function isFunction(func) {
                return "function" == typeof func;
            }
            /**
             * @param {!Object} it
             * @return {?}
             */
            function isArray(it) {
                return "[object Array]" === Object.prototype.toString.call(it);
            }
            /**
             * @param {!Object} object
             * @return {?}
             */
            function isObject(object) {
                if (isArray(object)) {
                    return false;
                }
                /** @type {string} */
                var kind = typeof object;
                return "object" === kind && !!object;
            }
            /**
             * @param {!Object} obj
             * @param {!Function} callback
             * @return {undefined}
             */
            function forEachObject(obj, callback) {
                var i;
                for (i in obj) {
                    if (obj.hasOwnProperty(i)) {
                        var n = obj[i];
                        callback(n, i);
                    }
                }
            }
            /**
             * @param {string} a
             * @param {number} b
             * @return {?}
             */
            function floatEquals(a, b) {
                return Math.abs(a - b) < q;
            }
            /**
             * @param {!Node} rows
             * @return {undefined}
             */
            function removeChildren(rows) {
                for (; rows.firstChild;) {
                    rows.removeChild(rows.firstChild);
                }
            }
            /** @type {!Array<string>} */
            var treesDirsFiles = "Webkit Moz O ms".split(" ");
            /** @type {number} */
            var q = .001;
            module.exports = {
                extend : extend,
                render : tag,
                setStyle : setStyle,
                setStyles : setStyles,
                capitalize : capitalize,
                isString : _iss,
                isFunction : isFunction,
                isObject : isObject,
                forEachObject : forEachObject,
                floatEquals : floatEquals,
                removeChildren : removeChildren
            };
        }, {}]
    }, {}, [4])(4);
});
