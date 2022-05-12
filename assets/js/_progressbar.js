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
