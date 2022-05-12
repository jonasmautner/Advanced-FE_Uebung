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
