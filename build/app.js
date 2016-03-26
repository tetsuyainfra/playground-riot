/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {__webpack_require__(3);
	
	__webpack_require__(7);
	
	console.log("test output");
	
	riot.mount("*");
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Riot v2.3.17, @license MIT */
	
	;(function(window, undefined) {
	  'use strict';
	var riot = { version: 'v2.3.17', settings: {} },
	  // be aware, internal usage
	  // ATTENTION: prefix the global dynamic variables with `__`
	
	  // counter to give a unique id to all the Tag instances
	  __uid = 0,
	  // tags instances cache
	  __virtualDom = [],
	  // tags implementation cache
	  __tagImpl = {},
	
	  /**
	   * Const
	   */
	  GLOBAL_MIXIN = '__global_mixin',
	
	  // riot specific prefixes
	  RIOT_PREFIX = 'riot-',
	  RIOT_TAG = RIOT_PREFIX + 'tag',
	  RIOT_TAG_IS = 'data-is',
	
	  // for typeof == '' comparisons
	  T_STRING = 'string',
	  T_OBJECT = 'object',
	  T_UNDEF  = 'undefined',
	  T_BOOL   = 'boolean',
	  T_FUNCTION = 'function',
	  // special native tags that cannot be treated like the others
	  SPECIAL_TAGS_REGEX = /^(?:t(?:body|head|foot|[rhd])|caption|col(?:group)?|opt(?:ion|group))$/,
	  RESERVED_WORDS_BLACKLIST = ['_item', '_id', '_parent', 'update', 'root', 'mount', 'unmount', 'mixin', 'isMounted', 'isLoop', 'tags', 'parent', 'opts', 'trigger', 'on', 'off', 'one'],
	
	  // version# for IE 8-11, 0 for others
	  IE_VERSION = (window && window.document || {}).documentMode | 0
	/* istanbul ignore next */
	riot.observable = function(el) {
	
	  /**
	   * Extend the original object or create a new empty one
	   * @type { Object }
	   */
	
	  el = el || {}
	
	  /**
	   * Private variables and methods
	   */
	  var callbacks = {},
	    slice = Array.prototype.slice,
	    onEachEvent = function(e, fn) { e.replace(/\S+/g, fn) }
	
	  // extend the object adding the observable methods
	  Object.defineProperties(el, {
	    /**
	     * Listen to the given space separated list of `events` and execute the `callback` each time an event is triggered.
	     * @param  { String } events - events ids
	     * @param  { Function } fn - callback function
	     * @returns { Object } el
	     */
	    on: {
	      value: function(events, fn) {
	        if (typeof fn != 'function')  return el
	
	        onEachEvent(events, function(name, pos) {
	          (callbacks[name] = callbacks[name] || []).push(fn)
	          fn.typed = pos > 0
	        })
	
	        return el
	      },
	      enumerable: false,
	      writable: false,
	      configurable: false
	    },
	
	    /**
	     * Removes the given space separated list of `events` listeners
	     * @param   { String } events - events ids
	     * @param   { Function } fn - callback function
	     * @returns { Object } el
	     */
	    off: {
	      value: function(events, fn) {
	        if (events == '*' && !fn) callbacks = {}
	        else {
	          onEachEvent(events, function(name) {
	            if (fn) {
	              var arr = callbacks[name]
	              for (var i = 0, cb; cb = arr && arr[i]; ++i) {
	                if (cb == fn) arr.splice(i--, 1)
	              }
	            } else delete callbacks[name]
	          })
	        }
	        return el
	      },
	      enumerable: false,
	      writable: false,
	      configurable: false
	    },
	
	    /**
	     * Listen to the given space separated list of `events` and execute the `callback` at most once
	     * @param   { String } events - events ids
	     * @param   { Function } fn - callback function
	     * @returns { Object } el
	     */
	    one: {
	      value: function(events, fn) {
	        function on() {
	          el.off(events, on)
	          fn.apply(el, arguments)
	        }
	        return el.on(events, on)
	      },
	      enumerable: false,
	      writable: false,
	      configurable: false
	    },
	
	    /**
	     * Execute all callback functions that listen to the given space separated list of `events`
	     * @param   { String } events - events ids
	     * @returns { Object } el
	     */
	    trigger: {
	      value: function(events) {
	
	        // getting the arguments
	        var arglen = arguments.length - 1,
	          args = new Array(arglen),
	          fns
	
	        for (var i = 0; i < arglen; i++) {
	          args[i] = arguments[i + 1] // skip first argument
	        }
	
	        onEachEvent(events, function(name) {
	
	          fns = slice.call(callbacks[name] || [], 0)
	
	          for (var i = 0, fn; fn = fns[i]; ++i) {
	            if (fn.busy) return
	            fn.busy = 1
	            fn.apply(el, fn.typed ? [name].concat(args) : args)
	            if (fns[i] !== fn) { i-- }
	            fn.busy = 0
	          }
	
	          if (callbacks['*'] && name != '*')
	            el.trigger.apply(el, ['*', name].concat(args))
	
	        })
	
	        return el
	      },
	      enumerable: false,
	      writable: false,
	      configurable: false
	    }
	  })
	
	  return el
	
	}
	/* istanbul ignore next */
	;(function(riot) {
	
	/**
	 * Simple client-side router
	 * @module riot-route
	 */
	
	
	var RE_ORIGIN = /^.+?\/+[^\/]+/,
	  EVENT_LISTENER = 'EventListener',
	  REMOVE_EVENT_LISTENER = 'remove' + EVENT_LISTENER,
	  ADD_EVENT_LISTENER = 'add' + EVENT_LISTENER,
	  HAS_ATTRIBUTE = 'hasAttribute',
	  REPLACE = 'replace',
	  POPSTATE = 'popstate',
	  HASHCHANGE = 'hashchange',
	  TRIGGER = 'trigger',
	  MAX_EMIT_STACK_LEVEL = 3,
	  win = typeof window != 'undefined' && window,
	  doc = typeof document != 'undefined' && document,
	  hist = win && history,
	  loc = win && (hist.location || win.location), // see html5-history-api
	  prot = Router.prototype, // to minify more
	  clickEvent = doc && doc.ontouchstart ? 'touchstart' : 'click',
	  started = false,
	  central = riot.observable(),
	  routeFound = false,
	  debouncedEmit,
	  base, current, parser, secondParser, emitStack = [], emitStackLevel = 0
	
	/**
	 * Default parser. You can replace it via router.parser method.
	 * @param {string} path - current path (normalized)
	 * @returns {array} array
	 */
	function DEFAULT_PARSER(path) {
	  return path.split(/[/?#]/)
	}
	
	/**
	 * Default parser (second). You can replace it via router.parser method.
	 * @param {string} path - current path (normalized)
	 * @param {string} filter - filter string (normalized)
	 * @returns {array} array
	 */
	function DEFAULT_SECOND_PARSER(path, filter) {
	  var re = new RegExp('^' + filter[REPLACE](/\*/g, '([^/?#]+?)')[REPLACE](/\.\./, '.*') + '$'),
	    args = path.match(re)
	
	  if (args) return args.slice(1)
	}
	
	/**
	 * Simple/cheap debounce implementation
	 * @param   {function} fn - callback
	 * @param   {number} delay - delay in seconds
	 * @returns {function} debounced function
	 */
	function debounce(fn, delay) {
	  var t
	  return function () {
	    clearTimeout(t)
	    t = setTimeout(fn, delay)
	  }
	}
	
	/**
	 * Set the window listeners to trigger the routes
	 * @param {boolean} autoExec - see route.start
	 */
	function start(autoExec) {
	  debouncedEmit = debounce(emit, 1)
	  win[ADD_EVENT_LISTENER](POPSTATE, debouncedEmit)
	  win[ADD_EVENT_LISTENER](HASHCHANGE, debouncedEmit)
	  doc[ADD_EVENT_LISTENER](clickEvent, click)
	  if (autoExec) emit(true)
	}
	
	/**
	 * Router class
	 */
	function Router() {
	  this.$ = []
	  riot.observable(this) // make it observable
	  central.on('stop', this.s.bind(this))
	  central.on('emit', this.e.bind(this))
	}
	
	function normalize(path) {
	  return path[REPLACE](/^\/|\/$/, '')
	}
	
	function isString(str) {
	  return typeof str == 'string'
	}
	
	/**
	 * Get the part after domain name
	 * @param {string} href - fullpath
	 * @returns {string} path from root
	 */
	function getPathFromRoot(href) {
	  return (href || loc.href || '')[REPLACE](RE_ORIGIN, '')
	}
	
	/**
	 * Get the part after base
	 * @param {string} href - fullpath
	 * @returns {string} path from base
	 */
	function getPathFromBase(href) {
	  return base[0] == '#'
	    ? (href || loc.href || '').split(base)[1] || ''
	    : getPathFromRoot(href)[REPLACE](base, '')
	}
	
	function emit(force) {
	  // the stack is needed for redirections
	  var isRoot = emitStackLevel == 0
	  if (MAX_EMIT_STACK_LEVEL <= emitStackLevel) return
	
	  emitStackLevel++
	  emitStack.push(function() {
	    var path = getPathFromBase()
	    if (force || path != current) {
	      central[TRIGGER]('emit', path)
	      current = path
	    }
	  })
	  if (isRoot) {
	    while (emitStack.length) {
	      emitStack[0]()
	      emitStack.shift()
	    }
	    emitStackLevel = 0
	  }
	}
	
	function click(e) {
	  if (
	    e.which != 1 // not left click
	    || e.metaKey || e.ctrlKey || e.shiftKey // or meta keys
	    || e.defaultPrevented // or default prevented
	  ) return
	
	  var el = e.target
	  while (el && el.nodeName != 'A') el = el.parentNode
	  if (
	    !el || el.nodeName != 'A' // not A tag
	    || el[HAS_ATTRIBUTE]('download') // has download attr
	    || !el[HAS_ATTRIBUTE]('href') // has no href attr
	    || el.target && el.target != '_self' // another window or frame
	    || el.href.indexOf(loc.href.match(RE_ORIGIN)[0]) == -1 // cross origin
	  ) return
	
	  if (el.href != loc.href) {
	    if (
	      el.href.split('#')[0] == loc.href.split('#')[0] // internal jump
	      || base != '#' && getPathFromRoot(el.href).indexOf(base) !== 0 // outside of base
	      || !go(getPathFromBase(el.href), el.title || doc.title) // route not found
	    ) return
	  }
	
	  e.preventDefault()
	}
	
	/**
	 * Go to the path
	 * @param {string} path - destination path
	 * @param {string} title - page title
	 * @param {boolean} shouldReplace - use replaceState or pushState
	 * @returns {boolean} - route not found flag
	 */
	function go(path, title, shouldReplace) {
	  if (hist) { // if a browser
	    path = base + normalize(path)
	    title = title || doc.title
	    // browsers ignores the second parameter `title`
	    shouldReplace
	      ? hist.replaceState(null, title, path)
	      : hist.pushState(null, title, path)
	    // so we need to set it manually
	    doc.title = title
	    routeFound = false
	    emit()
	    return routeFound
	  }
	
	  // Server-side usage: directly execute handlers for the path
	  return central[TRIGGER]('emit', getPathFromBase(path))
	}
	
	/**
	 * Go to path or set action
	 * a single string:                go there
	 * two strings:                    go there with setting a title
	 * two strings and boolean:        replace history with setting a title
	 * a single function:              set an action on the default route
	 * a string/RegExp and a function: set an action on the route
	 * @param {(string|function)} first - path / action / filter
	 * @param {(string|RegExp|function)} second - title / action
	 * @param {boolean} third - replace flag
	 */
	prot.m = function(first, second, third) {
	  if (isString(first) && (!second || isString(second))) go(first, second, third || false)
	  else if (second) this.r(first, second)
	  else this.r('@', first)
	}
	
	/**
	 * Stop routing
	 */
	prot.s = function() {
	  this.off('*')
	  this.$ = []
	}
	
	/**
	 * Emit
	 * @param {string} path - path
	 */
	prot.e = function(path) {
	  this.$.concat('@').some(function(filter) {
	    var args = (filter == '@' ? parser : secondParser)(normalize(path), normalize(filter))
	    if (typeof args != 'undefined') {
	      this[TRIGGER].apply(null, [filter].concat(args))
	      return routeFound = true // exit from loop
	    }
	  }, this)
	}
	
	/**
	 * Register route
	 * @param {string} filter - filter for matching to url
	 * @param {function} action - action to register
	 */
	prot.r = function(filter, action) {
	  if (filter != '@') {
	    filter = '/' + normalize(filter)
	    this.$.push(filter)
	  }
	  this.on(filter, action)
	}
	
	var mainRouter = new Router()
	var route = mainRouter.m.bind(mainRouter)
	
	/**
	 * Create a sub router
	 * @returns {function} the method of a new Router object
	 */
	route.create = function() {
	  var newSubRouter = new Router()
	  // stop only this sub-router
	  newSubRouter.m.stop = newSubRouter.s.bind(newSubRouter)
	  // return sub-router's main method
	  return newSubRouter.m.bind(newSubRouter)
	}
	
	/**
	 * Set the base of url
	 * @param {(str|RegExp)} arg - a new base or '#' or '#!'
	 */
	route.base = function(arg) {
	  base = arg || '#'
	  current = getPathFromBase() // recalculate current path
	}
	
	/** Exec routing right now **/
	route.exec = function() {
	  emit(true)
	}
	
	/**
	 * Replace the default router to yours
	 * @param {function} fn - your parser function
	 * @param {function} fn2 - your secondParser function
	 */
	route.parser = function(fn, fn2) {
	  if (!fn && !fn2) {
	    // reset parser for testing...
	    parser = DEFAULT_PARSER
	    secondParser = DEFAULT_SECOND_PARSER
	  }
	  if (fn) parser = fn
	  if (fn2) secondParser = fn2
	}
	
	/**
	 * Helper function to get url query as an object
	 * @returns {object} parsed query
	 */
	route.query = function() {
	  var q = {}
	  var href = loc.href || current
	  href[REPLACE](/[?&](.+?)=([^&]*)/g, function(_, k, v) { q[k] = v })
	  return q
	}
	
	/** Stop routing **/
	route.stop = function () {
	  if (started) {
	    if (win) {
	      win[REMOVE_EVENT_LISTENER](POPSTATE, debouncedEmit)
	      win[REMOVE_EVENT_LISTENER](HASHCHANGE, debouncedEmit)
	      doc[REMOVE_EVENT_LISTENER](clickEvent, click)
	    }
	    central[TRIGGER]('stop')
	    started = false
	  }
	}
	
	/**
	 * Start routing
	 * @param {boolean} autoExec - automatically exec after starting if true
	 */
	route.start = function (autoExec) {
	  if (!started) {
	    if (win) {
	      if (document.readyState == 'complete') start(autoExec)
	      // the timeout is needed to solve
	      // a weird safari bug https://github.com/riot/route/issues/33
	      else win[ADD_EVENT_LISTENER]('load', function() {
	        setTimeout(function() { start(autoExec) }, 1)
	      })
	    }
	    started = true
	  }
	}
	
	/** Prepare the router **/
	route.base()
	route.parser()
	
	riot.route = route
	})(riot)
	/* istanbul ignore next */
	
	/**
	 * The riot template engine
	 * @version v2.3.21
	 */
	
	/**
	 * riot.util.brackets
	 *
	 * - `brackets    ` - Returns a string or regex based on its parameter
	 * - `brackets.set` - Change the current riot brackets
	 *
	 * @module
	 */
	
	var brackets = (function (UNDEF) {
	
	  var
	    REGLOB = 'g',
	
	    R_MLCOMMS = /\/\*[^*]*\*+(?:[^*\/][^*]*\*+)*\//g,
	
	    R_STRINGS = /"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'/g,
	
	    S_QBLOCKS = R_STRINGS.source + '|' +
	      /(?:\breturn\s+|(?:[$\w\)\]]|\+\+|--)\s*(\/)(?![*\/]))/.source + '|' +
	      /\/(?=[^*\/])[^[\/\\]*(?:(?:\[(?:\\.|[^\]\\]*)*\]|\\.)[^[\/\\]*)*?(\/)[gim]*/.source,
	
	    FINDBRACES = {
	      '(': RegExp('([()])|'   + S_QBLOCKS, REGLOB),
	      '[': RegExp('([[\\]])|' + S_QBLOCKS, REGLOB),
	      '{': RegExp('([{}])|'   + S_QBLOCKS, REGLOB)
	    },
	
	    DEFAULT = '{ }'
	
	  var _pairs = [
	    '{', '}',
	    '{', '}',
	    /{[^}]*}/,
	    /\\([{}])/g,
	    /\\({)|{/g,
	    RegExp('\\\\(})|([[({])|(})|' + S_QBLOCKS, REGLOB),
	    DEFAULT,
	    /^\s*{\^?\s*([$\w]+)(?:\s*,\s*(\S+))?\s+in\s+(\S.*)\s*}/,
	    /(^|[^\\]){=[\S\s]*?}/
	  ]
	
	  var
	    cachedBrackets = UNDEF,
	    _regex,
	    _cache = [],
	    _settings
	
	  function _loopback (re) { return re }
	
	  function _rewrite (re, bp) {
	    if (!bp) bp = _cache
	    return new RegExp(
	      re.source.replace(/{/g, bp[2]).replace(/}/g, bp[3]), re.global ? REGLOB : ''
	    )
	  }
	
	  function _create (pair) {
	    if (pair === DEFAULT) return _pairs
	
	    var arr = pair.split(' ')
	
	    if (arr.length !== 2 || /[\x00-\x1F<>a-zA-Z0-9'",;\\]/.test(pair)) {
	      throw new Error('Unsupported brackets "' + pair + '"')
	    }
	    arr = arr.concat(pair.replace(/(?=[[\]()*+?.^$|])/g, '\\').split(' '))
	
	    arr[4] = _rewrite(arr[1].length > 1 ? /{[\S\s]*?}/ : _pairs[4], arr)
	    arr[5] = _rewrite(pair.length > 3 ? /\\({|})/g : _pairs[5], arr)
	    arr[6] = _rewrite(_pairs[6], arr)
	    arr[7] = RegExp('\\\\(' + arr[3] + ')|([[({])|(' + arr[3] + ')|' + S_QBLOCKS, REGLOB)
	    arr[8] = pair
	    return arr
	  }
	
	  function _brackets (reOrIdx) {
	    return reOrIdx instanceof RegExp ? _regex(reOrIdx) : _cache[reOrIdx]
	  }
	
	  _brackets.split = function split (str, tmpl, _bp) {
	    // istanbul ignore next: _bp is for the compiler
	    if (!_bp) _bp = _cache
	
	    var
	      parts = [],
	      match,
	      isexpr,
	      start,
	      pos,
	      re = _bp[6]
	
	    isexpr = start = re.lastIndex = 0
	
	    while (match = re.exec(str)) {
	
	      pos = match.index
	
	      if (isexpr) {
	
	        if (match[2]) {
	          re.lastIndex = skipBraces(str, match[2], re.lastIndex)
	          continue
	        }
	        if (!match[3])
	          continue
	      }
	
	      if (!match[1]) {
	        unescapeStr(str.slice(start, pos))
	        start = re.lastIndex
	        re = _bp[6 + (isexpr ^= 1)]
	        re.lastIndex = start
	      }
	    }
	
	    if (str && start < str.length) {
	      unescapeStr(str.slice(start))
	    }
	
	    return parts
	
	    function unescapeStr (s) {
	      if (tmpl || isexpr)
	        parts.push(s && s.replace(_bp[5], '$1'))
	      else
	        parts.push(s)
	    }
	
	    function skipBraces (s, ch, ix) {
	      var
	        match,
	        recch = FINDBRACES[ch]
	
	      recch.lastIndex = ix
	      ix = 1
	      while (match = recch.exec(s)) {
	        if (match[1] &&
	          !(match[1] === ch ? ++ix : --ix)) break
	      }
	      return ix ? s.length : recch.lastIndex
	    }
	  }
	
	  _brackets.hasExpr = function hasExpr (str) {
	    return _cache[4].test(str)
	  }
	
	  _brackets.loopKeys = function loopKeys (expr) {
	    var m = expr.match(_cache[9])
	    return m
	      ? { key: m[1], pos: m[2], val: _cache[0] + m[3].trim() + _cache[1] }
	      : { val: expr.trim() }
	  }
	
	  _brackets.hasRaw = function (src) {
	    return _cache[10].test(src)
	  }
	
	  _brackets.array = function array (pair) {
	    return pair ? _create(pair) : _cache
	  }
	
	  function _reset (pair) {
	    if ((pair || (pair = DEFAULT)) !== _cache[8]) {
	      _cache = _create(pair)
	      _regex = pair === DEFAULT ? _loopback : _rewrite
	      _cache[9] = _regex(_pairs[9])
	      _cache[10] = _regex(_pairs[10])
	    }
	    cachedBrackets = pair
	  }
	
	  function _setSettings (o) {
	    var b
	    o = o || {}
	    b = o.brackets
	    Object.defineProperty(o, 'brackets', {
	      set: _reset,
	      get: function () { return cachedBrackets },
	      enumerable: true
	    })
	    _settings = o
	    _reset(b)
	  }
	
	  Object.defineProperty(_brackets, 'settings', {
	    set: _setSettings,
	    get: function () { return _settings }
	  })
	
	  /* istanbul ignore next: in the browser riot is always in the scope */
	  _brackets.settings = typeof riot !== 'undefined' && riot.settings || {}
	  _brackets.set = _reset
	
	  _brackets.R_STRINGS = R_STRINGS
	  _brackets.R_MLCOMMS = R_MLCOMMS
	  _brackets.S_QBLOCKS = S_QBLOCKS
	
	  return _brackets
	
	})()
	
	/**
	 * @module tmpl
	 *
	 * tmpl          - Root function, returns the template value, render with data
	 * tmpl.hasExpr  - Test the existence of a expression inside a string
	 * tmpl.loopKeys - Get the keys for an 'each' loop (used by `_each`)
	 */
	
	var tmpl = (function () {
	
	  var _cache = {}
	
	  function _tmpl (str, data) {
	    if (!str) return str
	
	    return (_cache[str] || (_cache[str] = _create(str))).call(data, _logErr)
	  }
	
	  _tmpl.haveRaw = brackets.hasRaw
	
	  _tmpl.hasExpr = brackets.hasExpr
	
	  _tmpl.loopKeys = brackets.loopKeys
	
	  _tmpl.errorHandler = null
	
	  function _logErr (err, ctx) {
	
	    if (_tmpl.errorHandler) {
	
	      err.riotData = {
	        tagName: ctx && ctx.root && ctx.root.tagName,
	        _riot_id: ctx && ctx._riot_id  //eslint-disable-line camelcase
	      }
	      _tmpl.errorHandler(err)
	    }
	  }
	
	  function _create (str) {
	
	    var expr = _getTmpl(str)
	    if (expr.slice(0, 11) !== 'try{return ') expr = 'return ' + expr
	
	    return new Function('E', expr + ';')
	  }
	
	  var
	    RE_QBLOCK = RegExp(brackets.S_QBLOCKS, 'g'),
	    RE_QBMARK = /\x01(\d+)~/g
	
	  function _getTmpl (str) {
	    var
	      qstr = [],
	      expr,
	      parts = brackets.split(str.replace(/\u2057/g, '"'), 1)
	
	    if (parts.length > 2 || parts[0]) {
	      var i, j, list = []
	
	      for (i = j = 0; i < parts.length; ++i) {
	
	        expr = parts[i]
	
	        if (expr && (expr = i & 1 ?
	
	              _parseExpr(expr, 1, qstr) :
	
	              '"' + expr
	                .replace(/\\/g, '\\\\')
	                .replace(/\r\n?|\n/g, '\\n')
	                .replace(/"/g, '\\"') +
	              '"'
	
	          )) list[j++] = expr
	
	      }
	
	      expr = j < 2 ? list[0] :
	             '[' + list.join(',') + '].join("")'
	
	    } else {
	
	      expr = _parseExpr(parts[1], 0, qstr)
	    }
	
	    if (qstr[0])
	      expr = expr.replace(RE_QBMARK, function (_, pos) {
	        return qstr[pos]
	          .replace(/\r/g, '\\r')
	          .replace(/\n/g, '\\n')
	      })
	
	    return expr
	  }
	
	  var
	    RE_BREND = {
	      '(': /[()]/g,
	      '[': /[[\]]/g,
	      '{': /[{}]/g
	    },
	    CS_IDENT = /^(?:(-?[_A-Za-z\xA0-\xFF][-\w\xA0-\xFF]*)|\x01(\d+)~):/
	
	  function _parseExpr (expr, asText, qstr) {
	
	    if (expr[0] === '=') expr = expr.slice(1)
	
	    expr = expr
	          .replace(RE_QBLOCK, function (s, div) {
	            return s.length > 2 && !div ? '\x01' + (qstr.push(s) - 1) + '~' : s
	          })
	          .replace(/\s+/g, ' ').trim()
	          .replace(/\ ?([[\({},?\.:])\ ?/g, '$1')
	
	    if (expr) {
	      var
	        list = [],
	        cnt = 0,
	        match
	
	      while (expr &&
	            (match = expr.match(CS_IDENT)) &&
	            !match.index
	        ) {
	        var
	          key,
	          jsb,
	          re = /,|([[{(])|$/g
	
	        expr = RegExp.rightContext
	        key  = match[2] ? qstr[match[2]].slice(1, -1).trim().replace(/\s+/g, ' ') : match[1]
	
	        while (jsb = (match = re.exec(expr))[1]) skipBraces(jsb, re)
	
	        jsb  = expr.slice(0, match.index)
	        expr = RegExp.rightContext
	
	        list[cnt++] = _wrapExpr(jsb, 1, key)
	      }
	
	      expr = !cnt ? _wrapExpr(expr, asText) :
	          cnt > 1 ? '[' + list.join(',') + '].join(" ").trim()' : list[0]
	    }
	    return expr
	
	    function skipBraces (ch, re) {
	      var
	        mm,
	        lv = 1,
	        ir = RE_BREND[ch]
	
	      ir.lastIndex = re.lastIndex
	      while (mm = ir.exec(expr)) {
	        if (mm[0] === ch) ++lv
	        else if (!--lv) break
	      }
	      re.lastIndex = lv ? expr.length : ir.lastIndex
	    }
	  }
	
	  // istanbul ignore next: not both
	  var
	    JS_CONTEXT = '"in this?this:' + (typeof window !== 'object' ? 'global' : 'window') + ').',
	    JS_VARNAME = /[,{][$\w]+:|(^ *|[^$\w\.])(?!(?:typeof|true|false|null|undefined|in|instanceof|is(?:Finite|NaN)|void|NaN|new|Date|RegExp|Math)(?![$\w]))([$_A-Za-z][$\w]*)/g,
	    JS_NOPROPS = /^(?=(\.[$\w]+))\1(?:[^.[(]|$)/
	
	  function _wrapExpr (expr, asText, key) {
	    var tb
	
	    expr = expr.replace(JS_VARNAME, function (match, p, mvar, pos, s) {
	      if (mvar) {
	        pos = tb ? 0 : pos + match.length
	
	        if (mvar !== 'this' && mvar !== 'global' && mvar !== 'window') {
	          match = p + '("' + mvar + JS_CONTEXT + mvar
	          if (pos) tb = (s = s[pos]) === '.' || s === '(' || s === '['
	        } else if (pos) {
	          tb = !JS_NOPROPS.test(s.slice(pos))
	        }
	      }
	      return match
	    })
	
	    if (tb) {
	      expr = 'try{return ' + expr + '}catch(e){E(e,this)}'
	    }
	
	    if (key) {
	
	      expr = (tb ?
	          'function(){' + expr + '}.call(this)' : '(' + expr + ')'
	        ) + '?"' + key + '":""'
	
	    } else if (asText) {
	
	      expr = 'function(v){' + (tb ?
	          expr.replace('return ', 'v=') : 'v=(' + expr + ')'
	        ) + ';return v||v===0?v:""}.call(this)'
	    }
	
	    return expr
	  }
	
	  // istanbul ignore next: compatibility fix for beta versions
	  _tmpl.parse = function (s) { return s }
	
	  _tmpl.version = brackets.version = 'v2.3.21'
	
	  return _tmpl
	
	})()
	
	/*
	  lib/browser/tag/mkdom.js
	
	  Includes hacks needed for the Internet Explorer version 9 and below
	  See: http://kangax.github.io/compat-table/es5/#ie8
	       http://codeplanet.io/dropping-ie8/
	*/
	var mkdom = (function _mkdom() {
	  var
	    reHasYield  = /<yield\b/i,
	    reYieldAll  = /<yield\s*(?:\/>|>([\S\s]*?)<\/yield\s*>)/ig,
	    reYieldSrc  = /<yield\s+to=['"]([^'">]*)['"]\s*>([\S\s]*?)<\/yield\s*>/ig,
	    reYieldDest = /<yield\s+from=['"]?([-\w]+)['"]?\s*(?:\/>|>([\S\s]*?)<\/yield\s*>)/ig
	  var
	    rootEls = { tr: 'tbody', th: 'tr', td: 'tr', col: 'colgroup' },
	    tblTags = IE_VERSION && IE_VERSION < 10
	      ? SPECIAL_TAGS_REGEX : /^(?:t(?:body|head|foot|[rhd])|caption|col(?:group)?)$/
	
	  /**
	   * Creates a DOM element to wrap the given content. Normally an `DIV`, but can be
	   * also a `TABLE`, `SELECT`, `TBODY`, `TR`, or `COLGROUP` element.
	   *
	   * @param   {string} templ  - The template coming from the custom tag definition
	   * @param   {string} [html] - HTML content that comes from the DOM element where you
	   *           will mount the tag, mostly the original tag in the page
	   * @returns {HTMLElement} DOM element with _templ_ merged through `YIELD` with the _html_.
	   */
	  function _mkdom(templ, html) {
	    var
	      match   = templ && templ.match(/^\s*<([-\w]+)/),
	      tagName = match && match[1].toLowerCase(),
	      el = mkEl('div')
	
	    // replace all the yield tags with the tag inner html
	    templ = replaceYield(templ, html)
	
	    /* istanbul ignore next */
	    if (tblTags.test(tagName))
	      el = specialTags(el, templ, tagName)
	    else
	      el.innerHTML = templ
	
	    el.stub = true
	
	    return el
	  }
	
	  /*
	    Creates the root element for table or select child elements:
	    tr/th/td/thead/tfoot/tbody/caption/col/colgroup/option/optgroup
	  */
	  function specialTags(el, templ, tagName) {
	    var
	      select = tagName[0] === 'o',
	      parent = select ? 'select>' : 'table>'
	
	    // trim() is important here, this ensures we don't have artifacts,
	    // so we can check if we have only one element inside the parent
	    el.innerHTML = '<' + parent + templ.trim() + '</' + parent
	    parent = el.firstChild
	
	    // returns the immediate parent if tr/th/td/col is the only element, if not
	    // returns the whole tree, as this can include additional elements
	    if (select) {
	      parent.selectedIndex = -1  // for IE9, compatible w/current riot behavior
	    } else {
	      // avoids insertion of cointainer inside container (ex: tbody inside tbody)
	      var tname = rootEls[tagName]
	      if (tname && parent.childElementCount === 1) parent = $(tname, parent)
	    }
	    return parent
	  }
	
	  /*
	    Replace the yield tag from any tag template with the innerHTML of the
	    original tag in the page
	  */
	  function replaceYield(templ, html) {
	    // do nothing if no yield
	    if (!reHasYield.test(templ)) return templ
	
	    // be careful with #1343 - string on the source having `$1`
	    var src = {}
	
	    html = html && html.replace(reYieldSrc, function (_, ref, text) {
	      src[ref] = src[ref] || text   // preserve first definition
	      return ''
	    }).trim()
	
	    return templ
	      .replace(reYieldDest, function (_, ref, def) {  // yield with from - to attrs
	        return src[ref] || def || ''
	      })
	      .replace(reYieldAll, function (_, def) {        // yield without any "from"
	        return html || def || ''
	      })
	  }
	
	  return _mkdom
	
	})()
	
	/**
	 * Convert the item looped into an object used to extend the child tag properties
	 * @param   { Object } expr - object containing the keys used to extend the children tags
	 * @param   { * } key - value to assign to the new object returned
	 * @param   { * } val - value containing the position of the item in the array
	 * @returns { Object } - new object containing the values of the original item
	 *
	 * The variables 'key' and 'val' are arbitrary.
	 * They depend on the collection type looped (Array, Object)
	 * and on the expression used on the each tag
	 *
	 */
	function mkitem(expr, key, val) {
	  var item = {}
	  item[expr.key] = key
	  if (expr.pos) item[expr.pos] = val
	  return item
	}
	
	/**
	 * Unmount the redundant tags
	 * @param   { Array } items - array containing the current items to loop
	 * @param   { Array } tags - array containing all the children tags
	 */
	function unmountRedundant(items, tags) {
	
	  var i = tags.length,
	    j = items.length,
	    t
	
	  while (i > j) {
	    t = tags[--i]
	    tags.splice(i, 1)
	    t.unmount()
	  }
	}
	
	/**
	 * Move the nested custom tags in non custom loop tags
	 * @param   { Object } child - non custom loop tag
	 * @param   { Number } i - current position of the loop tag
	 */
	function moveNestedTags(child, i) {
	  Object.keys(child.tags).forEach(function(tagName) {
	    var tag = child.tags[tagName]
	    if (isArray(tag))
	      each(tag, function (t) {
	        moveChildTag(t, tagName, i)
	      })
	    else
	      moveChildTag(tag, tagName, i)
	  })
	}
	
	/**
	 * Adds the elements for a virtual tag
	 * @param { Tag } tag - the tag whose root's children will be inserted or appended
	 * @param { Node } src - the node that will do the inserting or appending
	 * @param { Tag } target - only if inserting, insert before this tag's first child
	 */
	function addVirtual(tag, src, target) {
	  var el = tag._root, sib
	  tag._virts = []
	  while (el) {
	    sib = el.nextSibling
	    if (target)
	      src.insertBefore(el, target._root)
	    else
	      src.appendChild(el)
	
	    tag._virts.push(el) // hold for unmounting
	    el = sib
	  }
	}
	
	/**
	 * Move virtual tag and all child nodes
	 * @param { Tag } tag - first child reference used to start move
	 * @param { Node } src  - the node that will do the inserting
	 * @param { Tag } target - insert before this tag's first child
	 * @param { Number } len - how many child nodes to move
	 */
	function moveVirtual(tag, src, target, len) {
	  var el = tag._root, sib, i = 0
	  for (; i < len; i++) {
	    sib = el.nextSibling
	    src.insertBefore(el, target._root)
	    el = sib
	  }
	}
	
	
	/**
	 * Manage tags having the 'each'
	 * @param   { Object } dom - DOM node we need to loop
	 * @param   { Tag } parent - parent tag instance where the dom node is contained
	 * @param   { String } expr - string contained in the 'each' attribute
	 */
	function _each(dom, parent, expr) {
	
	  // remove the each property from the original tag
	  remAttr(dom, 'each')
	
	  var mustReorder = typeof getAttr(dom, 'no-reorder') !== T_STRING || remAttr(dom, 'no-reorder'),
	    tagName = getTagName(dom),
	    impl = __tagImpl[tagName] || { tmpl: dom.outerHTML },
	    useRoot = SPECIAL_TAGS_REGEX.test(tagName),
	    root = dom.parentNode,
	    ref = document.createTextNode(''),
	    child = getTag(dom),
	    isOption = tagName.toLowerCase() === 'option', // the option tags must be treated differently
	    tags = [],
	    oldItems = [],
	    hasKeys,
	    isVirtual = dom.tagName == 'VIRTUAL'
	
	  // parse the each expression
	  expr = tmpl.loopKeys(expr)
	
	  // insert a marked where the loop tags will be injected
	  root.insertBefore(ref, dom)
	
	  // clean template code
	  parent.one('before-mount', function () {
	
	    // remove the original DOM node
	    dom.parentNode.removeChild(dom)
	    if (root.stub) root = parent.root
	
	  }).on('update', function () {
	    // get the new items collection
	    var items = tmpl(expr.val, parent),
	      // create a fragment to hold the new DOM nodes to inject in the parent tag
	      frag = document.createDocumentFragment()
	
	    // object loop. any changes cause full redraw
	    if (!isArray(items)) {
	      hasKeys = items || false
	      items = hasKeys ?
	        Object.keys(items).map(function (key) {
	          return mkitem(expr, key, items[key])
	        }) : []
	    }
	
	    // loop all the new items
	    var i = 0,
	      itemsLength = items.length
	
	    for (; i < itemsLength; i++) {
	      // reorder only if the items are objects
	      var
	        item = items[i],
	        _mustReorder = mustReorder && item instanceof Object && !hasKeys,
	        oldPos = oldItems.indexOf(item),
	        pos = ~oldPos && _mustReorder ? oldPos : i,
	        // does a tag exist in this position?
	        tag = tags[pos]
	
	      item = !hasKeys && expr.key ? mkitem(expr, item, i) : item
	
	      // new tag
	      if (
	        !_mustReorder && !tag // with no-reorder we just update the old tags
	        ||
	        _mustReorder && !~oldPos || !tag // by default we always try to reorder the DOM elements
	      ) {
	
	        tag = new Tag(impl, {
	          parent: parent,
	          isLoop: true,
	          hasImpl: !!__tagImpl[tagName],
	          root: useRoot ? root : dom.cloneNode(),
	          item: item
	        }, dom.innerHTML)
	
	        tag.mount()
	
	        if (isVirtual) tag._root = tag.root.firstChild // save reference for further moves or inserts
	        // this tag must be appended
	        if (i == tags.length || !tags[i]) { // fix 1581
	          if (isVirtual)
	            addVirtual(tag, frag)
	          else frag.appendChild(tag.root)
	        }
	        // this tag must be insert
	        else {
	          if (isVirtual)
	            addVirtual(tag, root, tags[i])
	          else root.insertBefore(tag.root, tags[i].root) // #1374 some browsers reset selected here
	          oldItems.splice(i, 0, item)
	        }
	
	        tags.splice(i, 0, tag)
	        pos = i // handled here so no move
	      } else tag.update(item, true)
	
	      // reorder the tag if it's not located in its previous position
	      if (
	        pos !== i && _mustReorder &&
	        tags[i] // fix 1581 unable to reproduce it in a test!
	      ) {
	        // update the DOM
	        if (isVirtual)
	          moveVirtual(tag, root, tags[i], dom.childNodes.length)
	        else root.insertBefore(tag.root, tags[i].root)
	        // update the position attribute if it exists
	        if (expr.pos)
	          tag[expr.pos] = i
	        // move the old tag instance
	        tags.splice(i, 0, tags.splice(pos, 1)[0])
	        // move the old item
	        oldItems.splice(i, 0, oldItems.splice(pos, 1)[0])
	        // if the loop tags are not custom
	        // we need to move all their custom tags into the right position
	        if (!child && tag.tags) moveNestedTags(tag, i)
	      }
	
	      // cache the original item to use it in the events bound to this node
	      // and its children
	      tag._item = item
	      // cache the real parent tag internally
	      defineProperty(tag, '_parent', parent)
	    }
	
	    // remove the redundant tags
	    unmountRedundant(items, tags)
	
	    // insert the new nodes
	    if (isOption) {
	      root.appendChild(frag)
	
	      // #1374 <select> <option selected={true}> </select>
	      if (root.length) {
	        var si, op = root.options
	
	        root.selectedIndex = si = -1
	        for (i = 0; i < op.length; i++) {
	          if (op[i].selected = op[i].__selected) {
	            if (si < 0) root.selectedIndex = si = i
	          }
	        }
	      }
	    }
	    else root.insertBefore(frag, ref)
	
	    // set the 'tags' property of the parent tag
	    // if child is 'undefined' it means that we don't need to set this property
	    // for example:
	    // we don't need store the `myTag.tags['div']` property if we are looping a div tag
	    // but we need to track the `myTag.tags['child']` property looping a custom child node named `child`
	    if (child) parent.tags[tagName] = tags
	
	    // clone the items array
	    oldItems = items.slice()
	
	  })
	
	}
	/**
	 * Object that will be used to inject and manage the css of every tag instance
	 */
	var styleManager = (function(_riot) {
	
	  if (!window) return { // skip injection on the server
	    add: function () {},
	    inject: function () {}
	  }
	
	  var styleNode = (function () {
	    // create a new style element with the correct type
	    var newNode = mkEl('style')
	    setAttr(newNode, 'type', 'text/css')
	
	    // replace any user node or insert the new one into the head
	    var userNode = $('style[type=riot]')
	    if (userNode) {
	      if (userNode.id) newNode.id = userNode.id
	      userNode.parentNode.replaceChild(newNode, userNode)
	    }
	    else document.getElementsByTagName('head')[0].appendChild(newNode)
	
	    return newNode
	  })()
	
	  // Create cache and shortcut to the correct property
	  var cssTextProp = styleNode.styleSheet,
	    stylesToInject = ''
	
	  // Expose the style node in a non-modificable property
	  Object.defineProperty(_riot, 'styleNode', {
	    value: styleNode,
	    writable: true
	  })
	
	  /**
	   * Public api
	   */
	  return {
	    /**
	     * Save a tag style to be later injected into DOM
	     * @param   { String } css [description]
	     */
	    add: function(css) {
	      stylesToInject += css
	    },
	    /**
	     * Inject all previously saved tag styles into DOM
	     * innerHTML seems slow: http://jsperf.com/riot-insert-style
	     */
	    inject: function() {
	      if (stylesToInject) {
	        if (cssTextProp) cssTextProp.cssText += stylesToInject
	        else styleNode.innerHTML += stylesToInject
	        stylesToInject = ''
	      }
	    }
	  }
	
	})(riot)
	
	
	function parseNamedElements(root, tag, childTags, forceParsingNamed) {
	
	  walk(root, function(dom) {
	    if (dom.nodeType == 1) {
	      dom.isLoop = dom.isLoop ||
	                  (dom.parentNode && dom.parentNode.isLoop || getAttr(dom, 'each'))
	                    ? 1 : 0
	
	      // custom child tag
	      if (childTags) {
	        var child = getTag(dom)
	
	        if (child && !dom.isLoop)
	          childTags.push(initChildTag(child, {root: dom, parent: tag}, dom.innerHTML, tag))
	      }
	
	      if (!dom.isLoop || forceParsingNamed)
	        setNamed(dom, tag, [])
	    }
	
	  })
	
	}
	
	function parseExpressions(root, tag, expressions) {
	
	  function addExpr(dom, val, extra) {
	    if (tmpl.hasExpr(val)) {
	      expressions.push(extend({ dom: dom, expr: val }, extra))
	    }
	  }
	
	  walk(root, function(dom) {
	    var type = dom.nodeType,
	      attr
	
	    // text node
	    if (type == 3 && dom.parentNode.tagName != 'STYLE') addExpr(dom, dom.nodeValue)
	    if (type != 1) return
	
	    /* element */
	
	    // loop
	    attr = getAttr(dom, 'each')
	
	    if (attr) { _each(dom, tag, attr); return false }
	
	    // attribute expressions
	    each(dom.attributes, function(attr) {
	      var name = attr.name,
	        bool = name.split('__')[1]
	
	      addExpr(dom, attr.value, { attr: bool || name, bool: bool })
	      if (bool) { remAttr(dom, name); return false }
	
	    })
	
	    // skip custom tags
	    if (getTag(dom)) return false
	
	  })
	
	}
	function Tag(impl, conf, innerHTML) {
	
	  var self = riot.observable(this),
	    opts = inherit(conf.opts) || {},
	    parent = conf.parent,
	    isLoop = conf.isLoop,
	    hasImpl = conf.hasImpl,
	    item = cleanUpData(conf.item),
	    expressions = [],
	    childTags = [],
	    root = conf.root,
	    tagName = root.tagName.toLowerCase(),
	    attr = {},
	    implAttr = {},
	    propsInSyncWithParent = [],
	    dom
	
	  // only call unmount if we have a valid __tagImpl (has name property)
	  if (impl.name && root._tag) root._tag.unmount(true)
	
	  // not yet mounted
	  this.isMounted = false
	  root.isLoop = isLoop
	
	  // keep a reference to the tag just created
	  // so we will be able to mount this tag multiple times
	  root._tag = this
	
	  // create a unique id to this tag
	  // it could be handy to use it also to improve the virtual dom rendering speed
	  defineProperty(this, '_riot_id', ++__uid) // base 1 allows test !t._riot_id
	
	  extend(this, { parent: parent, root: root, opts: opts, tags: {} }, item)
	
	  // grab attributes
	  each(root.attributes, function(el) {
	    var val = el.value
	    // remember attributes with expressions only
	    if (tmpl.hasExpr(val)) attr[el.name] = val
	  })
	
	  dom = mkdom(impl.tmpl, innerHTML)
	
	  // options
	  function updateOpts() {
	    var ctx = hasImpl && isLoop ? self : parent || self
	
	    // update opts from current DOM attributes
	    each(root.attributes, function(el) {
	      var val = el.value
	      opts[toCamel(el.name)] = tmpl.hasExpr(val) ? tmpl(val, ctx) : val
	    })
	    // recover those with expressions
	    each(Object.keys(attr), function(name) {
	      opts[toCamel(name)] = tmpl(attr[name], ctx)
	    })
	  }
	
	  function normalizeData(data) {
	    for (var key in item) {
	      if (typeof self[key] !== T_UNDEF && isWritable(self, key))
	        self[key] = data[key]
	    }
	  }
	
	  function inheritFromParent () {
	    if (!self.parent || !isLoop) return
	    each(Object.keys(self.parent), function(k) {
	      // some properties must be always in sync with the parent tag
	      var mustSync = !contains(RESERVED_WORDS_BLACKLIST, k) && contains(propsInSyncWithParent, k)
	      if (typeof self[k] === T_UNDEF || mustSync) {
	        // track the property to keep in sync
	        // so we can keep it updated
	        if (!mustSync) propsInSyncWithParent.push(k)
	        self[k] = self.parent[k]
	      }
	    })
	  }
	
	  /**
	   * Update the tag expressions and options
	   * @param   { * }  data - data we want to use to extend the tag properties
	   * @param   { Boolean } isInherited - is this update coming from a parent tag?
	   * @returns { self }
	   */
	  defineProperty(this, 'update', function(data, isInherited) {
	
	    // make sure the data passed will not override
	    // the component core methods
	    data = cleanUpData(data)
	    // inherit properties from the parent
	    inheritFromParent()
	    // normalize the tag properties in case an item object was initially passed
	    if (data && isObject(item)) {
	      normalizeData(data)
	      item = data
	    }
	    extend(self, data)
	    updateOpts()
	    self.trigger('update', data)
	    update(expressions, self)
	
	    // the updated event will be triggered
	    // once the DOM will be ready and all the re-flows are completed
	    // this is useful if you want to get the "real" root properties
	    // 4 ex: root.offsetWidth ...
	    if (isInherited && self.parent)
	      // closes #1599
	      self.parent.one('updated', function() { self.trigger('updated') })
	    else rAF(function() { self.trigger('updated') })
	
	    return this
	  })
	
	  defineProperty(this, 'mixin', function() {
	    each(arguments, function(mix) {
	      var instance
	
	      mix = typeof mix === T_STRING ? riot.mixin(mix) : mix
	
	      // check if the mixin is a function
	      if (isFunction(mix)) {
	        // create the new mixin instance
	        instance = new mix()
	        // save the prototype to loop it afterwards
	        mix = mix.prototype
	      } else instance = mix
	
	      // loop the keys in the function prototype or the all object keys
	      each(Object.getOwnPropertyNames(mix), function(key) {
	        // bind methods to self
	        if (key != 'init')
	          self[key] = isFunction(instance[key]) ?
	                        instance[key].bind(self) :
	                        instance[key]
	      })
	
	      // init method will be called automatically
	      if (instance.init) instance.init.bind(self)()
	    })
	    return this
	  })
	
	  defineProperty(this, 'mount', function() {
	
	    updateOpts()
	
	    // add global mixin
	    var globalMixin = riot.mixin(GLOBAL_MIXIN)
	    if (globalMixin) self.mixin(globalMixin)
	
	    // initialiation
	    if (impl.fn) impl.fn.call(self, opts)
	
	    // parse layout after init. fn may calculate args for nested custom tags
	    parseExpressions(dom, self, expressions)
	
	    // mount the child tags
	    toggle(true)
	
	    // update the root adding custom attributes coming from the compiler
	    // it fixes also #1087
	    if (impl.attrs)
	      walkAttributes(impl.attrs, function (k, v) { setAttr(root, k, v) })
	    if (impl.attrs || hasImpl)
	      parseExpressions(self.root, self, expressions)
	
	    if (!self.parent || isLoop) self.update(item)
	
	    // internal use only, fixes #403
	    self.trigger('before-mount')
	
	    if (isLoop && !hasImpl) {
	      // update the root attribute for the looped elements
	      root = dom.firstChild
	    } else {
	      while (dom.firstChild) root.appendChild(dom.firstChild)
	      if (root.stub) root = parent.root
	    }
	
	    defineProperty(self, 'root', root)
	
	    // parse the named dom nodes in the looped child
	    // adding them to the parent as well
	    if (isLoop)
	      parseNamedElements(self.root, self.parent, null, true)
	
	    // if it's not a child tag we can trigger its mount event
	    if (!self.parent || self.parent.isMounted) {
	      self.isMounted = true
	      self.trigger('mount')
	    }
	    // otherwise we need to wait that the parent event gets triggered
	    else self.parent.one('mount', function() {
	      // avoid to trigger the `mount` event for the tags
	      // not visible included in an if statement
	      if (!isInStub(self.root)) {
	        self.parent.isMounted = self.isMounted = true
	        self.trigger('mount')
	      }
	    })
	  })
	
	
	  defineProperty(this, 'unmount', function(keepRootTag) {
	    var el = root,
	      p = el.parentNode,
	      ptag,
	      tagIndex = __virtualDom.indexOf(self)
	
	    self.trigger('before-unmount')
	
	    // remove this tag instance from the global virtualDom variable
	    if (~tagIndex)
	      __virtualDom.splice(tagIndex, 1)
	
	    if (this._virts) {
	      each(this._virts, function(v) {
	        if (v.parentNode) v.parentNode.removeChild(v)
	      })
	    }
	
	    if (p) {
	
	      if (parent) {
	        ptag = getImmediateCustomParentTag(parent)
	        // remove this tag from the parent tags object
	        // if there are multiple nested tags with same name..
	        // remove this element form the array
	        if (isArray(ptag.tags[tagName]))
	          each(ptag.tags[tagName], function(tag, i) {
	            if (tag._riot_id == self._riot_id)
	              ptag.tags[tagName].splice(i, 1)
	          })
	        else
	          // otherwise just delete the tag instance
	          ptag.tags[tagName] = undefined
	      }
	
	      else
	        while (el.firstChild) el.removeChild(el.firstChild)
	
	      if (!keepRootTag)
	        p.removeChild(el)
	      else
	        // the riot-tag attribute isn't needed anymore, remove it
	        remAttr(p, 'riot-tag')
	    }
	
	
	    self.trigger('unmount')
	    toggle()
	    self.off('*')
	    self.isMounted = false
	    delete root._tag
	
	  })
	
	  // proxy function to bind updates
	  // dispatched from a parent tag
	  function onChildUpdate(data) { self.update(data, true) }
	
	  function toggle(isMount) {
	
	    // mount/unmount children
	    each(childTags, function(child) { child[isMount ? 'mount' : 'unmount']() })
	
	    // listen/unlisten parent (events flow one way from parent to children)
	    if (!parent) return
	    var evt = isMount ? 'on' : 'off'
	
	    // the loop tags will be always in sync with the parent automatically
	    if (isLoop)
	      parent[evt]('unmount', self.unmount)
	    else {
	      parent[evt]('update', onChildUpdate)[evt]('unmount', self.unmount)
	    }
	  }
	
	
	  // named elements available for fn
	  parseNamedElements(dom, this, childTags)
	
	}
	/**
	 * Attach an event to a DOM node
	 * @param { String } name - event name
	 * @param { Function } handler - event callback
	 * @param { Object } dom - dom node
	 * @param { Tag } tag - tag instance
	 */
	function setEventHandler(name, handler, dom, tag) {
	
	  dom[name] = function(e) {
	
	    var ptag = tag._parent,
	      item = tag._item,
	      el
	
	    if (!item)
	      while (ptag && !item) {
	        item = ptag._item
	        ptag = ptag._parent
	      }
	
	    // cross browser event fix
	    e = e || window.event
	
	    // override the event properties
	    if (isWritable(e, 'currentTarget')) e.currentTarget = dom
	    if (isWritable(e, 'target')) e.target = e.srcElement
	    if (isWritable(e, 'which')) e.which = e.charCode || e.keyCode
	
	    e.item = item
	
	    // prevent default behaviour (by default)
	    if (handler.call(tag, e) !== true && !/radio|check/.test(dom.type)) {
	      if (e.preventDefault) e.preventDefault()
	      e.returnValue = false
	    }
	
	    if (!e.preventUpdate) {
	      el = item ? getImmediateCustomParentTag(ptag) : tag
	      el.update()
	    }
	
	  }
	
	}
	
	
	/**
	 * Insert a DOM node replacing another one (used by if- attribute)
	 * @param   { Object } root - parent node
	 * @param   { Object } node - node replaced
	 * @param   { Object } before - node added
	 */
	function insertTo(root, node, before) {
	  if (!root) return
	  root.insertBefore(before, node)
	  root.removeChild(node)
	}
	
	/**
	 * Update the expressions in a Tag instance
	 * @param   { Array } expressions - expression that must be re evaluated
	 * @param   { Tag } tag - tag instance
	 */
	function update(expressions, tag) {
	
	  each(expressions, function(expr, i) {
	
	    var dom = expr.dom,
	      attrName = expr.attr,
	      value = tmpl(expr.expr, tag),
	      parent = expr.dom.parentNode
	
	    if (expr.bool) {
	      value = !!value
	      if (attrName === 'selected') dom.__selected = value   // #1374
	    }
	    else if (value == null)
	      value = ''
	
	    // #1638: regression of #1612, update the dom only if the value of the
	    // expression was changed
	    if (expr.value === value) {
	      return
	    }
	    expr.value = value
	
	    // textarea and text nodes has no attribute name
	    if (!attrName) {
	      // about #815 w/o replace: the browser converts the value to a string,
	      // the comparison by "==" does too, but not in the server
	      value += ''
	      // test for parent avoids error with invalid assignment to nodeValue
	      if (parent) {
	        if (parent.tagName === 'TEXTAREA') {
	          parent.value = value                    // #1113
	          if (!IE_VERSION) dom.nodeValue = value  // #1625 IE throws here, nodeValue
	        }                                         // will be available on 'updated'
	        else dom.nodeValue = value
	      }
	      return
	    }
	
	    // ~~#1612: look for changes in dom.value when updating the value~~
	    if (attrName === 'value') {
	      dom.value = value
	      return
	    }
	
	    // remove original attribute
	    remAttr(dom, attrName)
	
	    // event handler
	    if (isFunction(value)) {
	      setEventHandler(attrName, value, dom, tag)
	
	    // if- conditional
	    } else if (attrName == 'if') {
	      var stub = expr.stub,
	        add = function() { insertTo(stub.parentNode, stub, dom) },
	        remove = function() { insertTo(dom.parentNode, dom, stub) }
	
	      // add to DOM
	      if (value) {
	        if (stub) {
	          add()
	          dom.inStub = false
	          // avoid to trigger the mount event if the tags is not visible yet
	          // maybe we can optimize this avoiding to mount the tag at all
	          if (!isInStub(dom)) {
	            walk(dom, function(el) {
	              if (el._tag && !el._tag.isMounted)
	                el._tag.isMounted = !!el._tag.trigger('mount')
	            })
	          }
	        }
	      // remove from DOM
	      } else {
	        stub = expr.stub = stub || document.createTextNode('')
	        // if the parentNode is defined we can easily replace the tag
	        if (dom.parentNode)
	          remove()
	        // otherwise we need to wait the updated event
	        else (tag.parent || tag).one('updated', remove)
	
	        dom.inStub = true
	      }
	    // show / hide
	    } else if (attrName === 'show') {
	      dom.style.display = value ? '' : 'none'
	
	    } else if (attrName === 'hide') {
	      dom.style.display = value ? 'none' : ''
	
	    } else if (expr.bool) {
	      dom[attrName] = value
	      if (value) setAttr(dom, attrName, attrName)
	
	    } else if (value === 0 || value && typeof value !== T_OBJECT) {
	      // <img src="{ expr }">
	      if (startsWith(attrName, RIOT_PREFIX) && attrName != RIOT_TAG) {
	        attrName = attrName.slice(RIOT_PREFIX.length)
	      }
	      setAttr(dom, attrName, value)
	    }
	
	  })
	
	}
	/**
	 * Specialized function for looping an array-like collection with `each={}`
	 * @param   { Array } els - collection of items
	 * @param   {Function} fn - callback function
	 * @returns { Array } the array looped
	 */
	function each(els, fn) {
	  var len = els ? els.length : 0
	
	  for (var i = 0, el; i < len; i++) {
	    el = els[i]
	    // return false -> current item was removed by fn during the loop
	    if (el != null && fn(el, i) === false) i--
	  }
	  return els
	}
	
	/**
	 * Detect if the argument passed is a function
	 * @param   { * } v - whatever you want to pass to this function
	 * @returns { Boolean } -
	 */
	function isFunction(v) {
	  return typeof v === T_FUNCTION || false   // avoid IE problems
	}
	
	/**
	 * Detect if the argument passed is an object, exclude null.
	 * NOTE: Use isObject(x) && !isArray(x) to excludes arrays.
	 * @param   { * } v - whatever you want to pass to this function
	 * @returns { Boolean } -
	 */
	function isObject(v) {
	  return v && typeof v === T_OBJECT         // typeof null is 'object'
	}
	
	/**
	 * Remove any DOM attribute from a node
	 * @param   { Object } dom - DOM node we want to update
	 * @param   { String } name - name of the property we want to remove
	 */
	function remAttr(dom, name) {
	  dom.removeAttribute(name)
	}
	
	/**
	 * Convert a string containing dashes to camel case
	 * @param   { String } string - input string
	 * @returns { String } my-string -> myString
	 */
	function toCamel(string) {
	  return string.replace(/-(\w)/g, function(_, c) {
	    return c.toUpperCase()
	  })
	}
	
	/**
	 * Get the value of any DOM attribute on a node
	 * @param   { Object } dom - DOM node we want to parse
	 * @param   { String } name - name of the attribute we want to get
	 * @returns { String | undefined } name of the node attribute whether it exists
	 */
	function getAttr(dom, name) {
	  return dom.getAttribute(name)
	}
	
	/**
	 * Set any DOM attribute
	 * @param { Object } dom - DOM node we want to update
	 * @param { String } name - name of the property we want to set
	 * @param { String } val - value of the property we want to set
	 */
	function setAttr(dom, name, val) {
	  dom.setAttribute(name, val)
	}
	
	/**
	 * Detect the tag implementation by a DOM node
	 * @param   { Object } dom - DOM node we need to parse to get its tag implementation
	 * @returns { Object } it returns an object containing the implementation of a custom tag (template and boot function)
	 */
	function getTag(dom) {
	  return dom.tagName && __tagImpl[getAttr(dom, RIOT_TAG_IS) ||
	    getAttr(dom, RIOT_TAG) || dom.tagName.toLowerCase()]
	}
	/**
	 * Add a child tag to its parent into the `tags` object
	 * @param   { Object } tag - child tag instance
	 * @param   { String } tagName - key where the new tag will be stored
	 * @param   { Object } parent - tag instance where the new child tag will be included
	 */
	function addChildTag(tag, tagName, parent) {
	  var cachedTag = parent.tags[tagName]
	
	  // if there are multiple children tags having the same name
	  if (cachedTag) {
	    // if the parent tags property is not yet an array
	    // create it adding the first cached tag
	    if (!isArray(cachedTag))
	      // don't add the same tag twice
	      if (cachedTag !== tag)
	        parent.tags[tagName] = [cachedTag]
	    // add the new nested tag to the array
	    if (!contains(parent.tags[tagName], tag))
	      parent.tags[tagName].push(tag)
	  } else {
	    parent.tags[tagName] = tag
	  }
	}
	
	/**
	 * Move the position of a custom tag in its parent tag
	 * @param   { Object } tag - child tag instance
	 * @param   { String } tagName - key where the tag was stored
	 * @param   { Number } newPos - index where the new tag will be stored
	 */
	function moveChildTag(tag, tagName, newPos) {
	  var parent = tag.parent,
	    tags
	  // no parent no move
	  if (!parent) return
	
	  tags = parent.tags[tagName]
	
	  if (isArray(tags))
	    tags.splice(newPos, 0, tags.splice(tags.indexOf(tag), 1)[0])
	  else addChildTag(tag, tagName, parent)
	}
	
	/**
	 * Create a new child tag including it correctly into its parent
	 * @param   { Object } child - child tag implementation
	 * @param   { Object } opts - tag options containing the DOM node where the tag will be mounted
	 * @param   { String } innerHTML - inner html of the child node
	 * @param   { Object } parent - instance of the parent tag including the child custom tag
	 * @returns { Object } instance of the new child tag just created
	 */
	function initChildTag(child, opts, innerHTML, parent) {
	  var tag = new Tag(child, opts, innerHTML),
	    tagName = getTagName(opts.root),
	    ptag = getImmediateCustomParentTag(parent)
	  // fix for the parent attribute in the looped elements
	  tag.parent = ptag
	  // store the real parent tag
	  // in some cases this could be different from the custom parent tag
	  // for example in nested loops
	  tag._parent = parent
	
	  // add this tag to the custom parent tag
	  addChildTag(tag, tagName, ptag)
	  // and also to the real parent tag
	  if (ptag !== parent)
	    addChildTag(tag, tagName, parent)
	  // empty the child node once we got its template
	  // to avoid that its children get compiled multiple times
	  opts.root.innerHTML = ''
	
	  return tag
	}
	
	/**
	 * Loop backward all the parents tree to detect the first custom parent tag
	 * @param   { Object } tag - a Tag instance
	 * @returns { Object } the instance of the first custom parent tag found
	 */
	function getImmediateCustomParentTag(tag) {
	  var ptag = tag
	  while (!getTag(ptag.root)) {
	    if (!ptag.parent) break
	    ptag = ptag.parent
	  }
	  return ptag
	}
	
	/**
	 * Helper function to set an immutable property
	 * @param   { Object } el - object where the new property will be set
	 * @param   { String } key - object key where the new property will be stored
	 * @param   { * } value - value of the new property
	* @param   { Object } options - set the propery overriding the default options
	 * @returns { Object } - the initial object
	 */
	function defineProperty(el, key, value, options) {
	  Object.defineProperty(el, key, extend({
	    value: value,
	    enumerable: false,
	    writable: false,
	    configurable: false
	  }, options))
	  return el
	}
	
	/**
	 * Get the tag name of any DOM node
	 * @param   { Object } dom - DOM node we want to parse
	 * @returns { String } name to identify this dom node in riot
	 */
	function getTagName(dom) {
	  var child = getTag(dom),
	    namedTag = getAttr(dom, 'name'),
	    tagName = namedTag && !tmpl.hasExpr(namedTag) ?
	                namedTag :
	              child ? child.name : dom.tagName.toLowerCase()
	
	  return tagName
	}
	
	/**
	 * Extend any object with other properties
	 * @param   { Object } src - source object
	 * @returns { Object } the resulting extended object
	 *
	 * var obj = { foo: 'baz' }
	 * extend(obj, {bar: 'bar', foo: 'bar'})
	 * console.log(obj) => {bar: 'bar', foo: 'bar'}
	 *
	 */
	function extend(src) {
	  var obj, args = arguments
	  for (var i = 1; i < args.length; ++i) {
	    if (obj = args[i]) {
	      for (var key in obj) {
	        // check if this property of the source object could be overridden
	        if (isWritable(src, key))
	          src[key] = obj[key]
	      }
	    }
	  }
	  return src
	}
	
	/**
	 * Check whether an array contains an item
	 * @param   { Array } arr - target array
	 * @param   { * } item - item to test
	 * @returns { Boolean } Does 'arr' contain 'item'?
	 */
	function contains(arr, item) {
	  return ~arr.indexOf(item)
	}
	
	/**
	 * Check whether an object is a kind of array
	 * @param   { * } a - anything
	 * @returns {Boolean} is 'a' an array?
	 */
	function isArray(a) { return Array.isArray(a) || a instanceof Array }
	
	/**
	 * Detect whether a property of an object could be overridden
	 * @param   { Object }  obj - source object
	 * @param   { String }  key - object property
	 * @returns { Boolean } is this property writable?
	 */
	function isWritable(obj, key) {
	  var props = Object.getOwnPropertyDescriptor(obj, key)
	  return typeof obj[key] === T_UNDEF || props && props.writable
	}
	
	
	/**
	 * With this function we avoid that the internal Tag methods get overridden
	 * @param   { Object } data - options we want to use to extend the tag instance
	 * @returns { Object } clean object without containing the riot internal reserved words
	 */
	function cleanUpData(data) {
	  if (!(data instanceof Tag) && !(data && typeof data.trigger == T_FUNCTION))
	    return data
	
	  var o = {}
	  for (var key in data) {
	    if (!contains(RESERVED_WORDS_BLACKLIST, key))
	      o[key] = data[key]
	  }
	  return o
	}
	
	/**
	 * Walk down recursively all the children tags starting dom node
	 * @param   { Object }   dom - starting node where we will start the recursion
	 * @param   { Function } fn - callback to transform the child node just found
	 */
	function walk(dom, fn) {
	  if (dom) {
	    // stop the recursion
	    if (fn(dom) === false) return
	    else {
	      dom = dom.firstChild
	
	      while (dom) {
	        walk(dom, fn)
	        dom = dom.nextSibling
	      }
	    }
	  }
	}
	
	/**
	 * Minimize risk: only zero or one _space_ between attr & value
	 * @param   { String }   html - html string we want to parse
	 * @param   { Function } fn - callback function to apply on any attribute found
	 */
	function walkAttributes(html, fn) {
	  var m,
	    re = /([-\w]+) ?= ?(?:"([^"]*)|'([^']*)|({[^}]*}))/g
	
	  while (m = re.exec(html)) {
	    fn(m[1].toLowerCase(), m[2] || m[3] || m[4])
	  }
	}
	
	/**
	 * Check whether a DOM node is in stub mode, useful for the riot 'if' directive
	 * @param   { Object }  dom - DOM node we want to parse
	 * @returns { Boolean } -
	 */
	function isInStub(dom) {
	  while (dom) {
	    if (dom.inStub) return true
	    dom = dom.parentNode
	  }
	  return false
	}
	
	/**
	 * Create a generic DOM node
	 * @param   { String } name - name of the DOM node we want to create
	 * @returns { Object } DOM node just created
	 */
	function mkEl(name) {
	  return document.createElement(name)
	}
	
	/**
	 * Shorter and fast way to select multiple nodes in the DOM
	 * @param   { String } selector - DOM selector
	 * @param   { Object } ctx - DOM node where the targets of our search will is located
	 * @returns { Object } dom nodes found
	 */
	function $$(selector, ctx) {
	  return (ctx || document).querySelectorAll(selector)
	}
	
	/**
	 * Shorter and fast way to select a single node in the DOM
	 * @param   { String } selector - unique dom selector
	 * @param   { Object } ctx - DOM node where the target of our search will is located
	 * @returns { Object } dom node found
	 */
	function $(selector, ctx) {
	  return (ctx || document).querySelector(selector)
	}
	
	/**
	 * Simple object prototypal inheritance
	 * @param   { Object } parent - parent object
	 * @returns { Object } child instance
	 */
	function inherit(parent) {
	  function Child() {}
	  Child.prototype = parent
	  return new Child()
	}
	
	/**
	 * Get the name property needed to identify a DOM node in riot
	 * @param   { Object } dom - DOM node we need to parse
	 * @returns { String | undefined } give us back a string to identify this dom node
	 */
	function getNamedKey(dom) {
	  return getAttr(dom, 'id') || getAttr(dom, 'name')
	}
	
	/**
	 * Set the named properties of a tag element
	 * @param { Object } dom - DOM node we need to parse
	 * @param { Object } parent - tag instance where the named dom element will be eventually added
	 * @param { Array } keys - list of all the tag instance properties
	 */
	function setNamed(dom, parent, keys) {
	  // get the key value we want to add to the tag instance
	  var key = getNamedKey(dom),
	    isArr,
	    // add the node detected to a tag instance using the named property
	    add = function(value) {
	      // avoid to override the tag properties already set
	      if (contains(keys, key)) return
	      // check whether this value is an array
	      isArr = isArray(value)
	      // if the key was never set
	      if (!value)
	        // set it once on the tag instance
	        parent[key] = dom
	      // if it was an array and not yet set
	      else if (!isArr || isArr && !contains(value, dom)) {
	        // add the dom node into the array
	        if (isArr)
	          value.push(dom)
	        else
	          parent[key] = [value, dom]
	      }
	    }
	
	  // skip the elements with no named properties
	  if (!key) return
	
	  // check whether this key has been already evaluated
	  if (tmpl.hasExpr(key))
	    // wait the first updated event only once
	    parent.one('mount', function() {
	      key = getNamedKey(dom)
	      add(parent[key])
	    })
	  else
	    add(parent[key])
	
	}
	
	/**
	 * Faster String startsWith alternative
	 * @param   { String } src - source string
	 * @param   { String } str - test string
	 * @returns { Boolean } -
	 */
	function startsWith(src, str) {
	  return src.slice(0, str.length) === str
	}
	
	/**
	 * requestAnimationFrame function
	 * Adapted from https://gist.github.com/paulirish/1579671, license MIT
	 */
	var rAF = (function (w) {
	  var raf = w.requestAnimationFrame    ||
	            w.mozRequestAnimationFrame || w.webkitRequestAnimationFrame
	
	  if (!raf || /iP(ad|hone|od).*OS 6/.test(w.navigator.userAgent)) {  // buggy iOS6
	    var lastTime = 0
	
	    raf = function (cb) {
	      var nowtime = Date.now(), timeout = Math.max(16 - (nowtime - lastTime), 0)
	      setTimeout(function () { cb(lastTime = nowtime + timeout) }, timeout)
	    }
	  }
	  return raf
	
	})(window || {})
	
	/**
	 * Mount a tag creating new Tag instance
	 * @param   { Object } root - dom node where the tag will be mounted
	 * @param   { String } tagName - name of the riot tag we want to mount
	 * @param   { Object } opts - options to pass to the Tag instance
	 * @returns { Tag } a new Tag instance
	 */
	function mountTo(root, tagName, opts) {
	  var tag = __tagImpl[tagName],
	    // cache the inner HTML to fix #855
	    innerHTML = root._innerHTML = root._innerHTML || root.innerHTML
	
	  // clear the inner html
	  root.innerHTML = ''
	
	  if (tag && root) tag = new Tag(tag, { root: root, opts: opts }, innerHTML)
	
	  if (tag && tag.mount) {
	    tag.mount()
	    // add this tag to the virtualDom variable
	    if (!contains(__virtualDom, tag)) __virtualDom.push(tag)
	  }
	
	  return tag
	}
	/**
	 * Riot public api
	 */
	
	// share methods for other riot parts, e.g. compiler
	riot.util = { brackets: brackets, tmpl: tmpl }
	
	/**
	 * Create a mixin that could be globally shared across all the tags
	 */
	riot.mixin = (function() {
	  var mixins = {}
	
	  /**
	   * Create/Return a mixin by its name
	   * @param   { String } name - mixin name (global mixin if missing)
	   * @param   { Object } mixin - mixin logic
	   * @returns { Object } the mixin logic
	   */
	  return function(name, mixin) {
	    if (isObject(name)) {
	      mixin = name
	      mixins[GLOBAL_MIXIN] = extend(mixins[GLOBAL_MIXIN] || {}, mixin)
	      return
	    }
	
	    if (!mixin) return mixins[name]
	    mixins[name] = mixin
	  }
	
	})()
	
	/**
	 * Create a new riot tag implementation
	 * @param   { String }   name - name/id of the new riot tag
	 * @param   { String }   html - tag template
	 * @param   { String }   css - custom tag css
	 * @param   { String }   attrs - root tag attributes
	 * @param   { Function } fn - user function
	 * @returns { String } name/id of the tag just created
	 */
	riot.tag = function(name, html, css, attrs, fn) {
	  if (isFunction(attrs)) {
	    fn = attrs
	    if (/^[\w\-]+\s?=/.test(css)) {
	      attrs = css
	      css = ''
	    } else attrs = ''
	  }
	  if (css) {
	    if (isFunction(css)) fn = css
	    else styleManager.add(css)
	  }
	  name = name.toLowerCase()
	  __tagImpl[name] = { name: name, tmpl: html, attrs: attrs, fn: fn }
	  return name
	}
	
	/**
	 * Create a new riot tag implementation (for use by the compiler)
	 * @param   { String }   name - name/id of the new riot tag
	 * @param   { String }   html - tag template
	 * @param   { String }   css - custom tag css
	 * @param   { String }   attrs - root tag attributes
	 * @param   { Function } fn - user function
	 * @returns { String } name/id of the tag just created
	 */
	riot.tag2 = function(name, html, css, attrs, fn) {
	  if (css) styleManager.add(css)
	  //if (bpair) riot.settings.brackets = bpair
	  __tagImpl[name] = { name: name, tmpl: html, attrs: attrs, fn: fn }
	  return name
	}
	
	/**
	 * Mount a tag using a specific tag implementation
	 * @param   { String } selector - tag DOM selector
	 * @param   { String } tagName - tag implementation name
	 * @param   { Object } opts - tag logic
	 * @returns { Array } new tags instances
	 */
	riot.mount = function(selector, tagName, opts) {
	
	  var els,
	    allTags,
	    tags = []
	
	  // helper functions
	
	  function addRiotTags(arr) {
	    var list = ''
	    each(arr, function (e) {
	      if (!/[^-\w]/.test(e)) {
	        e = e.trim().toLowerCase()
	        list += ',[' + RIOT_TAG_IS + '="' + e + '"],[' + RIOT_TAG + '="' + e + '"]'
	      }
	    })
	    return list
	  }
	
	  function selectAllTags() {
	    var keys = Object.keys(__tagImpl)
	    return keys + addRiotTags(keys)
	  }
	
	  function pushTags(root) {
	    if (root.tagName) {
	      var riotTag = getAttr(root, RIOT_TAG_IS) || getAttr(root, RIOT_TAG)
	
	      // have tagName? force riot-tag to be the same
	      if (tagName && riotTag !== tagName) {
	        riotTag = tagName
	        setAttr(root, RIOT_TAG_IS, tagName)
	      }
	      var tag = mountTo(root, riotTag || root.tagName.toLowerCase(), opts)
	
	      if (tag) tags.push(tag)
	    } else if (root.length) {
	      each(root, pushTags)   // assume nodeList
	    }
	  }
	
	  // ----- mount code -----
	
	  // inject styles into DOM
	  styleManager.inject()
	
	  if (isObject(tagName)) {
	    opts = tagName
	    tagName = 0
	  }
	
	  // crawl the DOM to find the tag
	  if (typeof selector === T_STRING) {
	    if (selector === '*')
	      // select all the tags registered
	      // and also the tags found with the riot-tag attribute set
	      selector = allTags = selectAllTags()
	    else
	      // or just the ones named like the selector
	      selector += addRiotTags(selector.split(/, */))
	
	    // make sure to pass always a selector
	    // to the querySelectorAll function
	    els = selector ? $$(selector) : []
	  }
	  else
	    // probably you have passed already a tag or a NodeList
	    els = selector
	
	  // select all the registered and mount them inside their root elements
	  if (tagName === '*') {
	    // get all custom tags
	    tagName = allTags || selectAllTags()
	    // if the root els it's just a single tag
	    if (els.tagName)
	      els = $$(tagName, els)
	    else {
	      // select all the children for all the different root elements
	      var nodeList = []
	      each(els, function (_el) {
	        nodeList.push($$(tagName, _el))
	      })
	      els = nodeList
	    }
	    // get rid of the tagName
	    tagName = 0
	  }
	
	  pushTags(els)
	
	  return tags
	}
	
	/**
	 * Update all the tags instances created
	 * @returns { Array } all the tags instances
	 */
	riot.update = function() {
	  return each(__virtualDom, function(tag) {
	    tag.update()
	  })
	}
	
	/**
	 * Export the Tag constructor
	 */
	riot.Tag = Tag
	  // support CommonJS, AMD & browser
	  /* istanbul ignore next */
	  if (typeof exports === T_OBJECT)
	    module.exports = riot
	  else if ("function" === T_FUNCTION && typeof __webpack_require__(2) !== T_UNDEF)
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return riot }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
	  else
	    window.riot = riot
	
	})(typeof window != 'undefined' ? window : void 0);


/***/ },
/* 2 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;
	
	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(4);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./mui.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./mui.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports
	
	
	// module
	exports.push([module.id, "/*! normalize.css v3.0.3 | MIT License | github.com/necolas/normalize.css */\n/**\n * 1. Set default font family to sans-serif.\n * 2. Prevent iOS and IE text size adjust after device orientation change,\n *    without disabling user zoom.\n */\nhtml {\n  font-family: sans-serif;\n  /* 1 */\n  -ms-text-size-adjust: 100%;\n  /* 2 */\n  -webkit-text-size-adjust: 100%;\n  /* 2 */ }\n\n/**\n * Remove default margin.\n */\nbody {\n  margin: 0; }\n\n/* HTML5 display definitions\n   ========================================================================== */\n/**\n * Correct `block` display not defined for any HTML5 element in IE 8/9.\n * Correct `block` display not defined for `details` or `summary` in IE 10/11\n * and Firefox.\n * Correct `block` display not defined for `main` in IE 11.\n */\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nmain,\nmenu,\nnav,\nsection,\nsummary {\n  display: block; }\n\n/**\n * 1. Correct `inline-block` display not defined in IE 8/9.\n * 2. Normalize vertical alignment of `progress` in Chrome, Firefox, and Opera.\n */\naudio,\ncanvas,\nprogress,\nvideo {\n  display: inline-block;\n  /* 1 */\n  vertical-align: baseline;\n  /* 2 */ }\n\n/**\n * Prevent modern browsers from displaying `audio` without controls.\n * Remove excess height in iOS 5 devices.\n */\naudio:not([controls]) {\n  display: none;\n  height: 0; }\n\n/**\n * Address `[hidden]` styling not present in IE 8/9/10.\n * Hide the `template` element in IE 8/9/10/11, Safari, and Firefox < 22.\n */\n[hidden],\ntemplate {\n  display: none; }\n\n/* Links\n   ========================================================================== */\n/**\n * Remove the gray background color from active links in IE 10.\n */\na {\n  background-color: transparent; }\n\n/**\n * Improve readability of focused elements when they are also in an\n * active/hover state.\n */\na:active,\na:hover {\n  outline: 0; }\n\n/* Text-level semantics\n   ========================================================================== */\n/**\n * Address styling not present in IE 8/9/10/11, Safari, and Chrome.\n */\nabbr[title] {\n  border-bottom: 1px dotted; }\n\n/**\n * Address style set to `bolder` in Firefox 4+, Safari, and Chrome.\n */\nb,\nstrong {\n  font-weight: bold; }\n\n/**\n * Address styling not present in Safari and Chrome.\n */\ndfn {\n  font-style: italic; }\n\n/**\n * Address variable `h1` font-size and margin within `section` and `article`\n * contexts in Firefox 4+, Safari, and Chrome.\n */\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0; }\n\n/**\n * Address styling not present in IE 8/9.\n */\nmark {\n  background: #ff0;\n  color: #000; }\n\n/**\n * Address inconsistent and variable font size in all browsers.\n */\nsmall {\n  font-size: 80%; }\n\n/**\n * Prevent `sub` and `sup` affecting `line-height` in all browsers.\n */\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline; }\n\nsup {\n  top: -0.5em; }\n\nsub {\n  bottom: -0.25em; }\n\n/* Embedded content\n   ========================================================================== */\n/**\n * Remove border when inside `a` element in IE 8/9/10.\n */\nimg {\n  border: 0; }\n\n/**\n * Correct overflow not hidden in IE 9/10/11.\n */\nsvg:not(:root) {\n  overflow: hidden; }\n\n/* Grouping content\n   ========================================================================== */\n/**\n * Address margin not present in IE 8/9 and Safari.\n */\nfigure {\n  margin: 1em 40px; }\n\n/**\n * Address differences between Firefox and other browsers.\n */\nhr {\n  box-sizing: content-box;\n  height: 0; }\n\n/**\n * Contain overflow in all browsers.\n */\npre {\n  overflow: auto; }\n\n/**\n * Address odd `em`-unit font size rendering in all browsers.\n */\ncode,\nkbd,\npre,\nsamp {\n  font-family: monospace, monospace;\n  font-size: 1em; }\n\n/* Forms\n   ========================================================================== */\n/**\n * Known limitation: by default, Chrome and Safari on OS X allow very limited\n * styling of `select`, unless a `border` property is set.\n */\n/**\n * 1. Correct color not being inherited.\n *    Known issue: affects color of disabled elements.\n * 2. Correct font properties not being inherited.\n * 3. Address margins set differently in Firefox 4+, Safari, and Chrome.\n */\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  color: inherit;\n  /* 1 */\n  font: inherit;\n  /* 2 */\n  margin: 0;\n  /* 3 */ }\n\n/**\n * Address `overflow` set to `hidden` in IE 8/9/10/11.\n */\nbutton {\n  overflow: visible; }\n\n/**\n * Address inconsistent `text-transform` inheritance for `button` and `select`.\n * All other form control elements do not inherit `text-transform` values.\n * Correct `button` style inheritance in Firefox, IE 8/9/10/11, and Opera.\n * Correct `select` style inheritance in Firefox.\n */\nbutton,\nselect {\n  text-transform: none; }\n\n/**\n * 1. Avoid the WebKit bug in Android 4.0.* where (2) destroys native `audio`\n *    and `video` controls.\n * 2. Correct inability to style clickable `input` types in iOS.\n * 3. Improve usability and consistency of cursor style between image-type\n *    `input` and others.\n */\nbutton,\nhtml input[type=\"button\"],\ninput[type=\"reset\"],\ninput[type=\"submit\"] {\n  -webkit-appearance: button;\n  /* 2 */\n  cursor: pointer;\n  /* 3 */ }\n\n/**\n * Re-set default cursor for disabled elements.\n */\nbutton[disabled],\nhtml input[disabled] {\n  cursor: default; }\n\n/**\n * Remove inner padding and border in Firefox 4+.\n */\nbutton::-moz-focus-inner,\ninput::-moz-focus-inner {\n  border: 0;\n  padding: 0; }\n\n/**\n * Address Firefox 4+ setting `line-height` on `input` using `!important` in\n * the UA stylesheet.\n */\ninput {\n  line-height: normal; }\n\n/**\n * It's recommended that you don't attempt to style these elements.\n * Firefox's implementation doesn't respect box-sizing, padding, or width.\n *\n * 1. Address box sizing set to `content-box` in IE 8/9/10.\n * 2. Remove excess padding in IE 8/9/10.\n */\ninput[type=\"checkbox\"],\ninput[type=\"radio\"] {\n  box-sizing: border-box;\n  /* 1 */\n  padding: 0;\n  /* 2 */ }\n\n/**\n * Fix the cursor style for Chrome's increment/decrement buttons. For certain\n * `font-size` values of the `input`, it causes the cursor style of the\n * decrement button to change from `default` to `text`.\n */\ninput[type=\"number\"]::-webkit-inner-spin-button,\ninput[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto; }\n\n/**\n * 1. Address `appearance` set to `searchfield` in Safari and Chrome.\n * 2. Address `box-sizing` set to `border-box` in Safari and Chrome.\n */\ninput[type=\"search\"] {\n  -webkit-appearance: textfield;\n  /* 1 */\n  box-sizing: content-box;\n  /* 2 */ }\n\n/**\n * Remove inner padding and search cancel button in Safari and Chrome on OS X.\n * Safari (but not Chrome) clips the cancel button when the search input has\n * padding (and `textfield` appearance).\n */\ninput[type=\"search\"]::-webkit-search-cancel-button,\ninput[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none; }\n\n/**\n * Define consistent border, margin, and padding.\n */\nfieldset {\n  border: 1px solid #c0c0c0;\n  margin: 0 2px;\n  padding: 0.35em 0.625em 0.75em; }\n\n/**\n * 1. Correct `color` not being inherited in IE 8/9/10/11.\n * 2. Remove padding so people aren't caught out if they zero out fieldsets.\n */\nlegend {\n  border: 0;\n  /* 1 */\n  padding: 0;\n  /* 2 */ }\n\n/**\n * Remove default vertical scrollbar in IE 8/9/10/11.\n */\ntextarea {\n  overflow: auto; }\n\n/**\n * Don't inherit the `font-weight` (applied by a rule above).\n * NOTE: the default cannot safely be changed in Chrome and Safari on OS X.\n */\noptgroup {\n  font-weight: bold; }\n\n/* Tables\n   ========================================================================== */\n/**\n * Remove most spacing between table cells.\n */\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n\ntd,\nth {\n  padding: 0; }\n\n/**\n * MUI Colors module\n */\n/**\n * MUI Reboot\n */\n* {\n  box-sizing: border-box; }\n\n*:before,\n*:after {\n  box-sizing: border-box; }\n\nhtml {\n  font-size: 10px;\n  -webkit-tap-highlight-color: transparent; }\n\nbody {\n  font-family: Arial, Verdana, Tahoma;\n  font-size: 14px;\n  font-weight: 400;\n  line-height: 1.429;\n  color: rgba(0, 0, 0, 0.87);\n  background-color: #FFF; }\n\ninput,\nbutton,\nselect,\ntextarea {\n  font-family: inherit;\n  font-size: inherit;\n  line-height: inherit; }\n\na {\n  color: #2196F3;\n  text-decoration: none; }\n  a:hover, a:focus {\n    color: #1976D2;\n    text-decoration: underline; }\n  a:focus {\n    outline: thin dotted;\n    outline: 5px auto -webkit-focus-ring-color;\n    outline-offset: -2px; }\n\np {\n  margin: 0 0 10px; }\n\nul,\nol {\n  margin-top: 0;\n  margin-bottom: 10px; }\n\nfigure {\n  margin: 0; }\n\nimg {\n  vertical-align: middle; }\n\nhr {\n  margin-top: 20px;\n  margin-bottom: 20px;\n  border: 0;\n  height: 1px;\n  background-color: rgba(0, 0, 0, 0.12); }\n\nlegend {\n  display: block;\n  width: 100%;\n  padding: 0;\n  margin-bottom: 10px;\n  font-size: 21px;\n  color: rgba(0, 0, 0, 0.87);\n  line-height: inherit;\n  border: 0; }\n\ninput[type=\"search\"] {\n  box-sizing: border-box;\n  -webkit-appearance: none; }\n\ninput[type=\"file\"]:focus,\ninput[type=\"radio\"]:focus,\ninput[type=\"checkbox\"]:focus {\n  outline: thin dotted;\n  outline: 5px auto -webkit-focus-ring-color;\n  outline-offset: -2px; }\n\ninput[type=\"radio\"]:disabled,\ninput[type=\"checkbox\"]:disabled {\n  cursor: not-allowed; }\n\nstrong {\n  font-weight: 700; }\n\nabbr[title] {\n  cursor: help;\n  border-bottom: 1px dotted #2196F3; }\n\nh1, h2, h3 {\n  margin-top: 20px;\n  margin-bottom: 10px; }\n\nh4, h5, h6 {\n  margin-top: 10px;\n  margin-bottom: 10px; }\n\n/**\n * MUI Appbar\n */\n.mui--appbar-height {\n  height: 56px; }\n\n.mui--appbar-min-height, .mui-appbar {\n  min-height: 56px; }\n\n.mui--appbar-line-height {\n  line-height: 56px; }\n\n.mui--appbar-top {\n  top: 56px; }\n\n@media (orientation: landscape) and (max-height: 480px) {\n  .mui--appbar-height {\n    height: 48px; }\n  .mui--appbar-min-height, .mui-appbar {\n    min-height: 48px; }\n  .mui--appbar-line-height {\n    line-height: 48px; }\n  .mui--appbar-top {\n    top: 48px; } }\n\n@media (min-width: 480px) {\n  .mui--appbar-height {\n    height: 64px; }\n  .mui--appbar-min-height, .mui-appbar {\n    min-height: 64px; }\n  .mui--appbar-line-height {\n    line-height: 64px; }\n  .mui--appbar-top {\n    top: 64px; } }\n\n.mui-appbar {\n  background-color: #2196F3;\n  color: #FFF; }\n\n/**\n * MUI Buttons\n */\n.mui-btn {\n  animation-duration: 0.0001s;\n  animation-name: mui-node-inserted;\n  font-weight: 500;\n  font-size: 14px;\n  line-height: 18px;\n  text-transform: uppercase;\n  color: rgba(0, 0, 0, 0.87);\n  background-color: #FFF;\n  transition: all 0.2s ease-in-out;\n  display: inline-block;\n  height: 36px;\n  padding: 0 26px;\n  margin-top: 6px;\n  margin-bottom: 6px;\n  border: none;\n  border-radius: 2px;\n  cursor: pointer;\n  touch-action: manipulation;\n  background-image: none;\n  text-align: center;\n  line-height: 36px;\n  vertical-align: middle;\n  white-space: nowrap;\n  user-select: none;\n  font-size: 14px;\n  letter-spacing: 0.03em;\n  position: relative;\n  overflow: hidden; }\n  .mui-btn:hover, .mui-btn:focus, .mui-btn:active {\n    color: rgba(0, 0, 0, 0.87);\n    background-color: white; }\n  .mui-btn[disabled]:hover, .mui-btn[disabled]:focus, .mui-btn[disabled]:active {\n    color: rgba(0, 0, 0, 0.87);\n    background-color: #FFF; }\n  .mui-btn.mui-btn--flat {\n    color: rgba(0, 0, 0, 0.87);\n    background-color: transparent; }\n    .mui-btn.mui-btn--flat:hover, .mui-btn.mui-btn--flat:focus, .mui-btn.mui-btn--flat:active {\n      color: rgba(0, 0, 0, 0.87);\n      background-color: #f2f2f2; }\n    .mui-btn.mui-btn--flat[disabled]:hover, .mui-btn.mui-btn--flat[disabled]:focus, .mui-btn.mui-btn--flat[disabled]:active {\n      color: rgba(0, 0, 0, 0.87);\n      background-color: transparent; }\n  .mui-btn:hover, .mui-btn:focus, .mui-btn:active {\n    outline: 0;\n    text-decoration: none;\n    color: rgba(0, 0, 0, 0.87); }\n  .mui-btn:hover, .mui-btn:focus {\n    box-shadow: 0 0px 2px rgba(0, 0, 0, 0.12), 0 2px 2px rgba(0, 0, 0, 0.2); }\n    @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {\n      .mui-btn:hover, .mui-btn:focus {\n        box-shadow: 0 -1px 2px rgba(0, 0, 0, 0.12), -1px 0px 2px rgba(0, 0, 0, 0.12), 0 0px 2px rgba(0, 0, 0, 0.12), 0 2px 2px rgba(0, 0, 0, 0.2); } }\n  .mui-btn:active {\n    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23); }\n    @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {\n      .mui-btn:active {\n        box-shadow: 0 -1px 2px rgba(0, 0, 0, 0.12), -1px 0px 2px rgba(0, 0, 0, 0.12), 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23); } }\n  .mui-btn:disabled, .mui-btn.mui--is-disabled {\n    cursor: not-allowed;\n    pointer-events: none;\n    opacity: 0.60;\n    box-shadow: none; }\n\n.mui-btn + .mui-btn {\n  margin-left: 8px; }\n\n.mui-btn--flat {\n  background-color: transparent; }\n  .mui-btn--flat:hover, .mui-btn--flat:focus, .mui-btn--flat:active {\n    box-shadow: none;\n    background-color: #f2f2f2; }\n\n.mui-btn--raised, .mui-btn--fab {\n  box-shadow: 0 0px 2px rgba(0, 0, 0, 0.12), 0 2px 2px rgba(0, 0, 0, 0.2); }\n  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {\n    .mui-btn--raised, .mui-btn--fab {\n      box-shadow: 0 -1px 2px rgba(0, 0, 0, 0.12), -1px 0px 2px rgba(0, 0, 0, 0.12), 0 0px 2px rgba(0, 0, 0, 0.12), 0 2px 2px rgba(0, 0, 0, 0.2); } }\n  .mui-btn--raised:active, .mui-btn--fab:active {\n    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23); }\n    @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {\n      .mui-btn--raised:active, .mui-btn--fab:active {\n        box-shadow: 0 -1px 2px rgba(0, 0, 0, 0.12), -1px 0px 2px rgba(0, 0, 0, 0.12), 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23); } }\n\n.mui-btn--fab {\n  position: relative;\n  padding: 0;\n  width: 55px;\n  height: 55px;\n  line-height: 55px;\n  border-radius: 50%;\n  z-index: 1; }\n\n.mui-btn--primary {\n  color: #FFF;\n  background-color: #2196F3; }\n  .mui-btn--primary:hover, .mui-btn--primary:focus, .mui-btn--primary:active {\n    color: #FFF;\n    background-color: #39a1f4; }\n  .mui-btn--primary[disabled]:hover, .mui-btn--primary[disabled]:focus, .mui-btn--primary[disabled]:active {\n    color: #FFF;\n    background-color: #2196F3; }\n  .mui-btn--primary.mui-btn--flat {\n    color: #2196F3;\n    background-color: transparent; }\n    .mui-btn--primary.mui-btn--flat:hover, .mui-btn--primary.mui-btn--flat:focus, .mui-btn--primary.mui-btn--flat:active {\n      color: #2196F3;\n      background-color: #f2f2f2; }\n    .mui-btn--primary.mui-btn--flat[disabled]:hover, .mui-btn--primary.mui-btn--flat[disabled]:focus, .mui-btn--primary.mui-btn--flat[disabled]:active {\n      color: #2196F3;\n      background-color: transparent; }\n\n.mui-btn--dark {\n  color: #FFF;\n  background-color: #424242; }\n  .mui-btn--dark:hover, .mui-btn--dark:focus, .mui-btn--dark:active {\n    color: #FFF;\n    background-color: #4f4f4f; }\n  .mui-btn--dark[disabled]:hover, .mui-btn--dark[disabled]:focus, .mui-btn--dark[disabled]:active {\n    color: #FFF;\n    background-color: #424242; }\n  .mui-btn--dark.mui-btn--flat {\n    color: #424242;\n    background-color: transparent; }\n    .mui-btn--dark.mui-btn--flat:hover, .mui-btn--dark.mui-btn--flat:focus, .mui-btn--dark.mui-btn--flat:active {\n      color: #424242;\n      background-color: #f2f2f2; }\n    .mui-btn--dark.mui-btn--flat[disabled]:hover, .mui-btn--dark.mui-btn--flat[disabled]:focus, .mui-btn--dark.mui-btn--flat[disabled]:active {\n      color: #424242;\n      background-color: transparent; }\n\n.mui-btn--danger {\n  color: #FFF;\n  background-color: #F44336; }\n  .mui-btn--danger:hover, .mui-btn--danger:focus, .mui-btn--danger:active {\n    color: #FFF;\n    background-color: #f55a4e; }\n  .mui-btn--danger[disabled]:hover, .mui-btn--danger[disabled]:focus, .mui-btn--danger[disabled]:active {\n    color: #FFF;\n    background-color: #F44336; }\n  .mui-btn--danger.mui-btn--flat {\n    color: #F44336;\n    background-color: transparent; }\n    .mui-btn--danger.mui-btn--flat:hover, .mui-btn--danger.mui-btn--flat:focus, .mui-btn--danger.mui-btn--flat:active {\n      color: #F44336;\n      background-color: #f2f2f2; }\n    .mui-btn--danger.mui-btn--flat[disabled]:hover, .mui-btn--danger.mui-btn--flat[disabled]:focus, .mui-btn--danger.mui-btn--flat[disabled]:active {\n      color: #F44336;\n      background-color: transparent; }\n\n.mui-btn--accent {\n  color: #FFF;\n  background-color: #FF4081; }\n  .mui-btn--accent:hover, .mui-btn--accent:focus, .mui-btn--accent:active {\n    color: #FFF;\n    background-color: #ff5a92; }\n  .mui-btn--accent[disabled]:hover, .mui-btn--accent[disabled]:focus, .mui-btn--accent[disabled]:active {\n    color: #FFF;\n    background-color: #FF4081; }\n  .mui-btn--accent.mui-btn--flat {\n    color: #FF4081;\n    background-color: transparent; }\n    .mui-btn--accent.mui-btn--flat:hover, .mui-btn--accent.mui-btn--flat:focus, .mui-btn--accent.mui-btn--flat:active {\n      color: #FF4081;\n      background-color: #f2f2f2; }\n    .mui-btn--accent.mui-btn--flat[disabled]:hover, .mui-btn--accent.mui-btn--flat[disabled]:focus, .mui-btn--accent.mui-btn--flat[disabled]:active {\n      color: #FF4081;\n      background-color: transparent; }\n\n.mui-btn--small {\n  height: 30.6px;\n  line-height: 30.6px;\n  padding: 0 16px;\n  font-size: 13px; }\n\n.mui-btn--large {\n  height: 54px;\n  line-height: 54px;\n  padding: 0 26px;\n  font-size: 14px; }\n\n.mui-btn--fab.mui-btn--small {\n  width: 44px;\n  height: 44px;\n  line-height: 44px; }\n\n.mui-btn--fab.mui-btn--large {\n  width: 75px;\n  height: 75px;\n  line-height: 75px; }\n\n/**\n * MUI Checkboxe and Radio Components\n */\n.mui-radio,\n.mui-checkbox {\n  position: relative;\n  display: block;\n  margin-top: 10px;\n  margin-bottom: 10px; }\n  .mui-radio > label,\n  .mui-checkbox > label {\n    min-height: 20px;\n    padding-left: 20px;\n    margin-bottom: 0;\n    font-weight: normal;\n    cursor: pointer; }\n\n.mui-radio > label > input[type=\"radio\"],\n.mui-radio--inline > label > input[type=\"radio\"],\n.mui-checkbox > label > input[type=\"checkbox\"],\n.mui-checkbox--inline > label > input[type=\"checkbox\"] {\n  position: absolute;\n  margin-left: -20px;\n  margin-top: 4px; }\n\n.mui-radio + .mui-radio,\n.mui-checkbox + .mui-checkbox {\n  margin-top: -5px; }\n\n.mui-radio--inline,\n.mui-checkbox--inline {\n  display: inline-block;\n  padding-left: 20px;\n  margin-bottom: 0;\n  vertical-align: middle;\n  font-weight: normal;\n  cursor: pointer; }\n  .mui-radio--inline > input[type=\"radio\"],\n  .mui-radio--inline > input[type=\"checkbox\"],\n  .mui-radio--inline > label > input[type=\"radio\"],\n  .mui-radio--inline > label > input[type=\"checkbox\"],\n  .mui-checkbox--inline > input[type=\"radio\"],\n  .mui-checkbox--inline > input[type=\"checkbox\"],\n  .mui-checkbox--inline > label > input[type=\"radio\"],\n  .mui-checkbox--inline > label > input[type=\"checkbox\"] {\n    margin: 4px 0 0;\n    line-height: normal; }\n\n.mui-radio--inline + .mui-radio--inline,\n.mui-checkbox--inline + .mui-checkbox--inline {\n  margin-top: 0;\n  margin-left: 10px; }\n\n/**\n * MUI Container module\n */\n.mui-container {\n  margin-right: auto;\n  margin-left: auto;\n  padding-left: 15px;\n  padding-right: 15px; }\n  .mui-container:before, .mui-container:after {\n    content: \" \";\n    display: table; }\n  .mui-container:after {\n    clear: both; }\n  @media (min-width: 544px) {\n    .mui-container {\n      max-width: 570px; } }\n  @media (min-width: 768px) {\n    .mui-container {\n      max-width: 740px; } }\n  @media (min-width: 992px) {\n    .mui-container {\n      max-width: 960px; } }\n  @media (min-width: 1200px) {\n    .mui-container {\n      max-width: 1170px; } }\n\n.mui-container-fluid {\n  margin-right: auto;\n  margin-left: auto;\n  padding-left: 15px;\n  padding-right: 15px; }\n  .mui-container-fluid:before, .mui-container-fluid:after {\n    content: \" \";\n    display: table; }\n  .mui-container-fluid:after {\n    clear: both; }\n\n/**\n * MUI Divider Component and CSS Helpers\n */\n.mui-divider {\n  display: block;\n  height: 1px;\n  background-color: rgba(0, 0, 0, 0.12); }\n\n.mui--divider-top {\n  border-top: 1px solid rgba(0, 0, 0, 0.12); }\n\n.mui--divider-bottom {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.12); }\n\n.mui--divider-left {\n  border-left: 1px solid rgba(0, 0, 0, 0.12); }\n\n.mui--divider-right {\n  border-right: 1px solid rgba(0, 0, 0, 0.12); }\n\n/**\n * MUI Dropdown module\n */\n.mui-dropdown {\n  display: inline-block;\n  position: relative; }\n\n[data-mui-toggle=\"dropdown\"] {\n  animation-duration: 0.0001s;\n  animation-name: mui-node-inserted;\n  outline: 0; }\n\n.mui-dropdown__menu {\n  position: absolute;\n  top: 100%;\n  left: 0;\n  display: none;\n  min-width: 160px;\n  padding: 5px 0;\n  margin: 2px 0 0;\n  list-style: none;\n  font-size: 14px;\n  text-align: left;\n  background-color: #FFF;\n  border-radius: 2px;\n  z-index: 1;\n  background-clip: padding-box; }\n  .mui-dropdown__menu.mui--is-open {\n    display: block; }\n  .mui-dropdown__menu > li > a {\n    display: block;\n    padding: 3px 20px;\n    clear: both;\n    font-weight: normal;\n    line-height: 1.429;\n    color: rgba(0, 0, 0, 0.87);\n    white-space: nowrap; }\n    .mui-dropdown__menu > li > a:hover, .mui-dropdown__menu > li > a:focus {\n      text-decoration: none;\n      color: rgba(0, 0, 0, 0.87);\n      background-color: #EEEEEE; }\n  .mui-dropdown__menu > .mui--is-disabled > a, .mui-dropdown__menu > .mui--is-disabled > a:hover, .mui-dropdown__menu > .mui--is-disabled > a:focus {\n    color: #EEEEEE; }\n  .mui-dropdown__menu > .mui--is-disabled > a:hover, .mui-dropdown__menu > .mui--is-disabled > a:focus {\n    text-decoration: none;\n    background-color: transparent;\n    background-image: none;\n    cursor: not-allowed; }\n\n.mui-dropdown__menu--right {\n  left: auto;\n  right: 0; }\n\n/**\n * MUI Form Component\n */\n@media (min-width: 544px) {\n  .mui-form--inline > .mui-textfield {\n    display: inline-block;\n    margin-bottom: 0; }\n  .mui-form--inline > .mui-radio,\n  .mui-form--inline > .mui-checkbox {\n    display: inline-block;\n    margin-top: 0;\n    margin-bottom: 0;\n    vertical-align: middle; }\n    .mui-form--inline > .mui-radio > label,\n    .mui-form--inline > .mui-checkbox > label {\n      padding-left: 0; }\n  .mui-form--inline > .mui-radio > label > input[type=\"radio\"],\n  .mui-form--inline > .mui-checkbox > label > input[type=\"checkbox\"] {\n    position: relative;\n    margin-left: 0; }\n  .mui-form--inline > .mui-select {\n    display: inline-block; }\n  .mui-form--inline > .mui-btn {\n    margin-bottom: 0;\n    margin-top: 0;\n    vertical-align: bottom; } }\n\n/**\n * MUI Grid module\n */\n.mui-row {\n  margin-left: -15px;\n  margin-right: -15px; }\n  .mui-row:before, .mui-row:after {\n    content: \" \";\n    display: table; }\n  .mui-row:after {\n    clear: both; }\n\n.mui-col-xs-1, .mui-col-sm-1, .mui-col-md-1, .mui-col-lg-1, .mui-col-xs-2, .mui-col-sm-2, .mui-col-md-2, .mui-col-lg-2, .mui-col-xs-3, .mui-col-sm-3, .mui-col-md-3, .mui-col-lg-3, .mui-col-xs-4, .mui-col-sm-4, .mui-col-md-4, .mui-col-lg-4, .mui-col-xs-5, .mui-col-sm-5, .mui-col-md-5, .mui-col-lg-5, .mui-col-xs-6, .mui-col-sm-6, .mui-col-md-6, .mui-col-lg-6, .mui-col-xs-7, .mui-col-sm-7, .mui-col-md-7, .mui-col-lg-7, .mui-col-xs-8, .mui-col-sm-8, .mui-col-md-8, .mui-col-lg-8, .mui-col-xs-9, .mui-col-sm-9, .mui-col-md-9, .mui-col-lg-9, .mui-col-xs-10, .mui-col-sm-10, .mui-col-md-10, .mui-col-lg-10, .mui-col-xs-11, .mui-col-sm-11, .mui-col-md-11, .mui-col-lg-11, .mui-col-xs-12, .mui-col-sm-12, .mui-col-md-12, .mui-col-lg-12 {\n  min-height: 1px;\n  padding-left: 15px;\n  padding-right: 15px; }\n\n.mui-col-xs-1, .mui-col-xs-2, .mui-col-xs-3, .mui-col-xs-4, .mui-col-xs-5, .mui-col-xs-6, .mui-col-xs-7, .mui-col-xs-8, .mui-col-xs-9, .mui-col-xs-10, .mui-col-xs-11, .mui-col-xs-12 {\n  float: left; }\n\n.mui-col-xs-1 {\n  width: 8.33333%; }\n\n.mui-col-xs-2 {\n  width: 16.66667%; }\n\n.mui-col-xs-3 {\n  width: 25%; }\n\n.mui-col-xs-4 {\n  width: 33.33333%; }\n\n.mui-col-xs-5 {\n  width: 41.66667%; }\n\n.mui-col-xs-6 {\n  width: 50%; }\n\n.mui-col-xs-7 {\n  width: 58.33333%; }\n\n.mui-col-xs-8 {\n  width: 66.66667%; }\n\n.mui-col-xs-9 {\n  width: 75%; }\n\n.mui-col-xs-10 {\n  width: 83.33333%; }\n\n.mui-col-xs-11 {\n  width: 91.66667%; }\n\n.mui-col-xs-12 {\n  width: 100%; }\n\n.mui-col-xs-offset-0 {\n  margin-left: 0%; }\n\n.mui-col-xs-offset-1 {\n  margin-left: 8.33333%; }\n\n.mui-col-xs-offset-2 {\n  margin-left: 16.66667%; }\n\n.mui-col-xs-offset-3 {\n  margin-left: 25%; }\n\n.mui-col-xs-offset-4 {\n  margin-left: 33.33333%; }\n\n.mui-col-xs-offset-5 {\n  margin-left: 41.66667%; }\n\n.mui-col-xs-offset-6 {\n  margin-left: 50%; }\n\n.mui-col-xs-offset-7 {\n  margin-left: 58.33333%; }\n\n.mui-col-xs-offset-8 {\n  margin-left: 66.66667%; }\n\n.mui-col-xs-offset-9 {\n  margin-left: 75%; }\n\n.mui-col-xs-offset-10 {\n  margin-left: 83.33333%; }\n\n.mui-col-xs-offset-11 {\n  margin-left: 91.66667%; }\n\n.mui-col-xs-offset-12 {\n  margin-left: 100%; }\n\n@media (min-width: 544px) {\n  .mui-col-sm-1, .mui-col-sm-2, .mui-col-sm-3, .mui-col-sm-4, .mui-col-sm-5, .mui-col-sm-6, .mui-col-sm-7, .mui-col-sm-8, .mui-col-sm-9, .mui-col-sm-10, .mui-col-sm-11, .mui-col-sm-12 {\n    float: left; }\n  .mui-col-sm-1 {\n    width: 8.33333%; }\n  .mui-col-sm-2 {\n    width: 16.66667%; }\n  .mui-col-sm-3 {\n    width: 25%; }\n  .mui-col-sm-4 {\n    width: 33.33333%; }\n  .mui-col-sm-5 {\n    width: 41.66667%; }\n  .mui-col-sm-6 {\n    width: 50%; }\n  .mui-col-sm-7 {\n    width: 58.33333%; }\n  .mui-col-sm-8 {\n    width: 66.66667%; }\n  .mui-col-sm-9 {\n    width: 75%; }\n  .mui-col-sm-10 {\n    width: 83.33333%; }\n  .mui-col-sm-11 {\n    width: 91.66667%; }\n  .mui-col-sm-12 {\n    width: 100%; }\n  .mui-col-sm-offset-0 {\n    margin-left: 0%; }\n  .mui-col-sm-offset-1 {\n    margin-left: 8.33333%; }\n  .mui-col-sm-offset-2 {\n    margin-left: 16.66667%; }\n  .mui-col-sm-offset-3 {\n    margin-left: 25%; }\n  .mui-col-sm-offset-4 {\n    margin-left: 33.33333%; }\n  .mui-col-sm-offset-5 {\n    margin-left: 41.66667%; }\n  .mui-col-sm-offset-6 {\n    margin-left: 50%; }\n  .mui-col-sm-offset-7 {\n    margin-left: 58.33333%; }\n  .mui-col-sm-offset-8 {\n    margin-left: 66.66667%; }\n  .mui-col-sm-offset-9 {\n    margin-left: 75%; }\n  .mui-col-sm-offset-10 {\n    margin-left: 83.33333%; }\n  .mui-col-sm-offset-11 {\n    margin-left: 91.66667%; }\n  .mui-col-sm-offset-12 {\n    margin-left: 100%; } }\n\n@media (min-width: 768px) {\n  .mui-col-md-1, .mui-col-md-2, .mui-col-md-3, .mui-col-md-4, .mui-col-md-5, .mui-col-md-6, .mui-col-md-7, .mui-col-md-8, .mui-col-md-9, .mui-col-md-10, .mui-col-md-11, .mui-col-md-12 {\n    float: left; }\n  .mui-col-md-1 {\n    width: 8.33333%; }\n  .mui-col-md-2 {\n    width: 16.66667%; }\n  .mui-col-md-3 {\n    width: 25%; }\n  .mui-col-md-4 {\n    width: 33.33333%; }\n  .mui-col-md-5 {\n    width: 41.66667%; }\n  .mui-col-md-6 {\n    width: 50%; }\n  .mui-col-md-7 {\n    width: 58.33333%; }\n  .mui-col-md-8 {\n    width: 66.66667%; }\n  .mui-col-md-9 {\n    width: 75%; }\n  .mui-col-md-10 {\n    width: 83.33333%; }\n  .mui-col-md-11 {\n    width: 91.66667%; }\n  .mui-col-md-12 {\n    width: 100%; }\n  .mui-col-md-offset-0 {\n    margin-left: 0%; }\n  .mui-col-md-offset-1 {\n    margin-left: 8.33333%; }\n  .mui-col-md-offset-2 {\n    margin-left: 16.66667%; }\n  .mui-col-md-offset-3 {\n    margin-left: 25%; }\n  .mui-col-md-offset-4 {\n    margin-left: 33.33333%; }\n  .mui-col-md-offset-5 {\n    margin-left: 41.66667%; }\n  .mui-col-md-offset-6 {\n    margin-left: 50%; }\n  .mui-col-md-offset-7 {\n    margin-left: 58.33333%; }\n  .mui-col-md-offset-8 {\n    margin-left: 66.66667%; }\n  .mui-col-md-offset-9 {\n    margin-left: 75%; }\n  .mui-col-md-offset-10 {\n    margin-left: 83.33333%; }\n  .mui-col-md-offset-11 {\n    margin-left: 91.66667%; }\n  .mui-col-md-offset-12 {\n    margin-left: 100%; } }\n\n@media (min-width: 992px) {\n  .mui-col-lg-1, .mui-col-lg-2, .mui-col-lg-3, .mui-col-lg-4, .mui-col-lg-5, .mui-col-lg-6, .mui-col-lg-7, .mui-col-lg-8, .mui-col-lg-9, .mui-col-lg-10, .mui-col-lg-11, .mui-col-lg-12 {\n    float: left; }\n  .mui-col-lg-1 {\n    width: 8.33333%; }\n  .mui-col-lg-2 {\n    width: 16.66667%; }\n  .mui-col-lg-3 {\n    width: 25%; }\n  .mui-col-lg-4 {\n    width: 33.33333%; }\n  .mui-col-lg-5 {\n    width: 41.66667%; }\n  .mui-col-lg-6 {\n    width: 50%; }\n  .mui-col-lg-7 {\n    width: 58.33333%; }\n  .mui-col-lg-8 {\n    width: 66.66667%; }\n  .mui-col-lg-9 {\n    width: 75%; }\n  .mui-col-lg-10 {\n    width: 83.33333%; }\n  .mui-col-lg-11 {\n    width: 91.66667%; }\n  .mui-col-lg-12 {\n    width: 100%; }\n  .mui-col-lg-offset-0 {\n    margin-left: 0%; }\n  .mui-col-lg-offset-1 {\n    margin-left: 8.33333%; }\n  .mui-col-lg-offset-2 {\n    margin-left: 16.66667%; }\n  .mui-col-lg-offset-3 {\n    margin-left: 25%; }\n  .mui-col-lg-offset-4 {\n    margin-left: 33.33333%; }\n  .mui-col-lg-offset-5 {\n    margin-left: 41.66667%; }\n  .mui-col-lg-offset-6 {\n    margin-left: 50%; }\n  .mui-col-lg-offset-7 {\n    margin-left: 58.33333%; }\n  .mui-col-lg-offset-8 {\n    margin-left: 66.66667%; }\n  .mui-col-lg-offset-9 {\n    margin-left: 75%; }\n  .mui-col-lg-offset-10 {\n    margin-left: 83.33333%; }\n  .mui-col-lg-offset-11 {\n    margin-left: 91.66667%; }\n  .mui-col-lg-offset-12 {\n    margin-left: 100%; } }\n\n@media (min-width: 1200px) {\n  .mui-col-xl-1, .mui-col-xl-2, .mui-col-xl-3, .mui-col-xl-4, .mui-col-xl-5, .mui-col-xl-6, .mui-col-xl-7, .mui-col-xl-8, .mui-col-xl-9, .mui-col-xl-10, .mui-col-xl-11, .mui-col-xl-12 {\n    float: left; }\n  .mui-col-xl-1 {\n    width: 8.33333%; }\n  .mui-col-xl-2 {\n    width: 16.66667%; }\n  .mui-col-xl-3 {\n    width: 25%; }\n  .mui-col-xl-4 {\n    width: 33.33333%; }\n  .mui-col-xl-5 {\n    width: 41.66667%; }\n  .mui-col-xl-6 {\n    width: 50%; }\n  .mui-col-xl-7 {\n    width: 58.33333%; }\n  .mui-col-xl-8 {\n    width: 66.66667%; }\n  .mui-col-xl-9 {\n    width: 75%; }\n  .mui-col-xl-10 {\n    width: 83.33333%; }\n  .mui-col-xl-11 {\n    width: 91.66667%; }\n  .mui-col-xl-12 {\n    width: 100%; }\n  .mui-col-xl-offset-0 {\n    margin-left: 0%; }\n  .mui-col-xl-offset-1 {\n    margin-left: 8.33333%; }\n  .mui-col-xl-offset-2 {\n    margin-left: 16.66667%; }\n  .mui-col-xl-offset-3 {\n    margin-left: 25%; }\n  .mui-col-xl-offset-4 {\n    margin-left: 33.33333%; }\n  .mui-col-xl-offset-5 {\n    margin-left: 41.66667%; }\n  .mui-col-xl-offset-6 {\n    margin-left: 50%; }\n  .mui-col-xl-offset-7 {\n    margin-left: 58.33333%; }\n  .mui-col-xl-offset-8 {\n    margin-left: 66.66667%; }\n  .mui-col-xl-offset-9 {\n    margin-left: 75%; }\n  .mui-col-xl-offset-10 {\n    margin-left: 83.33333%; }\n  .mui-col-xl-offset-11 {\n    margin-left: 91.66667%; }\n  .mui-col-xl-offset-12 {\n    margin-left: 100%; } }\n\n/**\n * MUI Panel module\n */\n.mui-panel {\n  padding: 15px;\n  margin-bottom: 20px;\n  border-radius: 0;\n  background-color: #FFF;\n  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.16), 0 0px 2px 0 rgba(0, 0, 0, 0.12); }\n  .mui-panel:before, .mui-panel:after {\n    content: \" \";\n    display: table; }\n  .mui-panel:after {\n    clear: both; }\n  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {\n    .mui-panel {\n      box-shadow: 0 -1px 2px 0 rgba(0, 0, 0, 0.12), -1px 0px 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.16), 0 0px 2px 0 rgba(0, 0, 0, 0.12); } }\n\n/**\n * MUI Select Component\n */\n.mui-select {\n  display: block;\n  padding-top: 15px;\n  margin-bottom: 20px;\n  position: relative; }\n  .mui-select:focus {\n    outline: 0; }\n    .mui-select:focus > select {\n      height: 33px;\n      margin-bottom: -1px;\n      border-color: #2196F3;\n      border-width: 2px; }\n  .mui-select > select {\n    animation-duration: 0.0001s;\n    animation-name: mui-node-inserted;\n    display: block;\n    height: 32px;\n    width: 100%;\n    appearance: none;\n    -webkit-appearance: none;\n    -moz-appearance: none;\n    outline: none;\n    border: none;\n    border-bottom: 1px solid rgba(0, 0, 0, 0.26);\n    border-radius: 0px;\n    box-shadow: none;\n    background-color: transparent;\n    background-image: url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iNiIgd2lkdGg9IjEwIj48cG9seWdvbiBwb2ludHM9IjAsMCAxMCwwIDUsNiIgc3R5bGU9ImZpbGw6cmdiYSgwLDAsMCwuMjQpOyIvPjwvc3ZnPg==\");\n    background-repeat: no-repeat;\n    background-position: right center;\n    cursor: pointer;\n    color: rgba(0, 0, 0, 0.87);\n    font-size: 16px;\n    padding: 0 25px 0 0; }\n    .mui-select > select::-ms-expand {\n      display: none; }\n    .mui-select > select:focus {\n      outline: 0;\n      height: 33px;\n      margin-bottom: -1px;\n      border-color: #2196F3;\n      border-width: 2px; }\n    .mui-select > select:disabled {\n      color: rgba(0, 0, 0, 0.38);\n      cursor: not-allowed;\n      background-color: transparent;\n      opacity: 1; }\n\n.mui-select__menu {\n  position: absolute;\n  z-index: 1;\n  min-width: 100%;\n  overflow-y: auto;\n  padding: 8px 0;\n  background-color: #FFF;\n  font-size: 16px; }\n  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {\n    .mui-select__menu {\n      border-left: 1px solid rgba(0, 0, 0, 0.12);\n      border-top: 1px solid rgba(0, 0, 0, 0.12); } }\n  .mui-select__menu > div {\n    padding: 0 22px;\n    height: 42px;\n    line-height: 42px;\n    cursor: pointer;\n    white-space: nowrap; }\n    .mui-select__menu > div:hover {\n      background-color: #E0E0E0; }\n    .mui-select__menu > div.mui--is-selected {\n      background-color: #EEEEEE; }\n\n/**\n * MUI Table Component\n */\nth {\n  text-align: left; }\n\n.mui-table {\n  width: 100%;\n  max-width: 100%;\n  margin-bottom: 20px; }\n  .mui-table > thead > tr > th,\n  .mui-table > thead > tr > td,\n  .mui-table > tbody > tr > th,\n  .mui-table > tbody > tr > td,\n  .mui-table > tfoot > tr > th,\n  .mui-table > tfoot > tr > td {\n    padding: 10px;\n    line-height: 1.429; }\n  .mui-table > thead > tr > th {\n    border-bottom: 2px solid rgba(0, 0, 0, 0.12);\n    font-weight: 700; }\n  .mui-table > tbody + tbody {\n    border-top: 2px solid rgba(0, 0, 0, 0.12); }\n  .mui-table.mui-table--bordered > tbody > tr > td {\n    border-bottom: 1px solid rgba(0, 0, 0, 0.12); }\n\n/**\n * MUI Tabs module\n */\n.mui-tabs__bar {\n  list-style: none;\n  padding-left: 0;\n  margin-bottom: 0;\n  background-color: transparent;\n  white-space: nowrap;\n  overflow-x: auto; }\n  .mui-tabs__bar > li {\n    display: inline-block; }\n    .mui-tabs__bar > li > a {\n      display: block;\n      white-space: nowrap;\n      text-transform: uppercase;\n      font-weight: 500;\n      font-size: 14px;\n      color: rgba(0, 0, 0, 0.87);\n      cursor: default;\n      height: 48px;\n      line-height: 48px;\n      padding-left: 24px;\n      padding-right: 24px;\n      user-select: none; }\n      .mui-tabs__bar > li > a:hover {\n        text-decoration: none; }\n    .mui-tabs__bar > li.mui--is-active {\n      border-bottom: 2px solid #2196F3; }\n      .mui-tabs__bar > li.mui--is-active > a {\n        color: #2196F3; }\n  .mui-tabs__bar.mui-tabs__bar--justified {\n    display: table;\n    width: 100%;\n    table-layout: fixed; }\n    .mui-tabs__bar.mui-tabs__bar--justified > li {\n      display: table-cell; }\n      .mui-tabs__bar.mui-tabs__bar--justified > li > a {\n        text-align: center;\n        padding-left: 0px;\n        padding-right: 0px; }\n\n.mui-tabs__pane {\n  display: none; }\n  .mui-tabs__pane.mui--is-active {\n    display: block; }\n\n[data-mui-toggle=\"tab\"] {\n  animation-duration: 0.0001s;\n  animation-name: mui-node-inserted; }\n\n/**\n * MUI Textfield Component\n */\n.mui-textfield {\n  display: block;\n  padding-top: 15px;\n  margin-bottom: 20px;\n  position: relative; }\n  .mui-textfield > label {\n    position: absolute;\n    top: 0;\n    display: block;\n    width: 100%;\n    color: rgba(0, 0, 0, 0.54);\n    font-size: 12px;\n    font-weight: 400;\n    line-height: 15px;\n    overflow-x: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap; }\n  .mui-textfield > textarea {\n    padding-top: 5px; }\n  .mui-textfield > input,\n  .mui-textfield > textarea {\n    display: block; }\n    .mui-textfield > input:focus ~ label,\n    .mui-textfield > textarea:focus ~ label {\n      color: #2196F3; }\n\n.mui-textfield--float-label > label {\n  position: absolute;\n  transform: translate(0px, 15px);\n  font-size: 16px;\n  line-height: 32px;\n  color: rgba(0, 0, 0, 0.26);\n  text-overflow: clip;\n  cursor: text;\n  pointer-events: none; }\n\n.mui-textfield--float-label > input:focus ~ label,\n.mui-textfield--float-label > textarea:focus ~ label {\n  transform: translate(0px, 0px);\n  font-size: 12px;\n  line-height: 15px;\n  text-overflow: ellipsis; }\n\n.mui-textfield--float-label > input:not(:focus).mui--is-not-empty ~ label, .mui-textfield--float-label > input:not(:focus)[value]:not([value=\"\"]):not(.mui--is-empty):not(.mui--is-not-empty) ~ label, .mui-textfield--float-label > input:not(:focus):not(:empty):not(.mui--is-empty):not(.mui--is-not-empty) ~ label,\n.mui-textfield--float-label > textarea:not(:focus).mui--is-not-empty ~ label,\n.mui-textfield--float-label > textarea:not(:focus)[value]:not([value=\"\"]):not(.mui--is-empty):not(.mui--is-not-empty) ~ label,\n.mui-textfield--float-label > textarea:not(:focus):not(:empty):not(.mui--is-empty):not(.mui--is-not-empty) ~ label {\n  color: rgba(0, 0, 0, 0.54);\n  font-size: 12px;\n  line-height: 15px;\n  transform: translate(0px, 0px);\n  text-overflow: ellipsis; }\n\n.mui-textfield--wrap-label {\n  display: table;\n  width: 100%;\n  padding-top: 0px; }\n  .mui-textfield--wrap-label:not(.mui-textfield--float-label) > label {\n    display: table-header-group;\n    position: static;\n    white-space: normal;\n    overflow-x: visible; }\n\n.mui-textfield > input,\n.mui-textfield > textarea {\n  animation-duration: 0.0001s;\n  animation-name: mui-node-inserted;\n  display: block;\n  background-color: transparent;\n  color: rgba(0, 0, 0, 0.87);\n  border: none;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.26);\n  outline: none;\n  width: 100%;\n  font-size: 16px;\n  padding: 0;\n  box-shadow: none;\n  border-radius: 0px;\n  background-image: none; }\n  .mui-textfield > input:focus,\n  .mui-textfield > textarea:focus {\n    border-color: #2196F3;\n    border-width: 2px; }\n  .mui-textfield > input:disabled, .mui-textfield > input:read-only,\n  .mui-textfield > textarea:disabled,\n  .mui-textfield > textarea:read-only {\n    cursor: not-allowed;\n    background-color: transparent;\n    opacity: 1; }\n  .mui-textfield > input::placeholder,\n  .mui-textfield > textarea::placeholder {\n    color: rgba(0, 0, 0, 0.26);\n    opacity: 1; }\n\n.mui-textfield > input {\n  height: 32px; }\n  .mui-textfield > input:focus {\n    height: 33px;\n    margin-bottom: -1px; }\n\n.mui-textfield > textarea {\n  min-height: 64px; }\n  .mui-textfield > textarea[rows]:not([rows=\"2\"]):focus {\n    margin-bottom: -1px; }\n\n.mui-textfield > input:focus {\n  height: 33px;\n  margin-bottom: -1px; }\n\n.mui-textfield > input:invalid:not(:focus):not(:required), .mui-textfield > input:invalid:not(:focus):required.mui--is-not-empty, .mui-textfield > input:invalid:not(:focus):required.mui--is-empty.mui--is-dirty, .mui-textfield > input:invalid:not(:focus):required[value]:not([value=\"\"]):not(.mui--is-empty):not(.mui--is-not-empty), .mui-textfield > input:invalid:not(:focus):required:not(:empty):not(.mui--is-empty):not(.mui--is-not-empty),\n.mui-textfield > textarea:invalid:not(:focus):not(:required),\n.mui-textfield > textarea:invalid:not(:focus):required.mui--is-not-empty,\n.mui-textfield > textarea:invalid:not(:focus):required.mui--is-empty.mui--is-dirty,\n.mui-textfield > textarea:invalid:not(:focus):required[value]:not([value=\"\"]):not(.mui--is-empty):not(.mui--is-not-empty),\n.mui-textfield > textarea:invalid:not(:focus):required:not(:empty):not(.mui--is-empty):not(.mui--is-not-empty),\n.mui-textfield > input:not(:focus).mui--is-invalid:not(:required),\n.mui-textfield > input:not(:focus).mui--is-invalid:required.mui--is-not-empty,\n.mui-textfield > input:not(:focus).mui--is-invalid:required.mui--is-empty.mui--is-dirty,\n.mui-textfield > input:not(:focus).mui--is-invalid:required[value]:not([value=\"\"]):not(.mui--is-empty):not(.mui--is-not-empty),\n.mui-textfield > input:not(:focus).mui--is-invalid:required:not(:empty):not(.mui--is-empty):not(.mui--is-not-empty),\n.mui-textfield > textarea:not(:focus).mui--is-invalid:not(:required),\n.mui-textfield > textarea:not(:focus).mui--is-invalid:required.mui--is-not-empty,\n.mui-textfield > textarea:not(:focus).mui--is-invalid:required.mui--is-empty.mui--is-dirty,\n.mui-textfield > textarea:not(:focus).mui--is-invalid:required[value]:not([value=\"\"]):not(.mui--is-empty):not(.mui--is-not-empty),\n.mui-textfield > textarea:not(:focus).mui--is-invalid:required:not(:empty):not(.mui--is-empty):not(.mui--is-not-empty) {\n  border-color: #F44336;\n  border-width: 2px; }\n\n.mui-textfield > input:invalid:not(:focus):not(:required), .mui-textfield > input:invalid:not(:focus):required.mui--is-not-empty, .mui-textfield > input:invalid:not(:focus):required.mui--is-empty.mui--is-dirty, .mui-textfield > input:invalid:not(:focus):required[value]:not([value=\"\"]):not(.mui--is-empty):not(.mui--is-not-empty), .mui-textfield > input:invalid:not(:focus):required:not(:empty):not(.mui--is-empty):not(.mui--is-not-empty),\n.mui-textfield > input:not(:focus).mui--is-invalid:not(:required),\n.mui-textfield > input:not(:focus).mui--is-invalid:required.mui--is-not-empty,\n.mui-textfield > input:not(:focus).mui--is-invalid:required.mui--is-empty.mui--is-dirty,\n.mui-textfield > input:not(:focus).mui--is-invalid:required[value]:not([value=\"\"]):not(.mui--is-empty):not(.mui--is-not-empty),\n.mui-textfield > input:not(:focus).mui--is-invalid:required:not(:empty):not(.mui--is-empty):not(.mui--is-not-empty) {\n  height: 33px;\n  margin-bottom: -1px; }\n\n.mui-textfield > input:invalid:not(:focus):not(:required) ~ label, .mui-textfield > input:invalid:not(:focus):required.mui--is-not-empty ~ label, .mui-textfield > input:invalid:not(:focus):required[value]:not([value=\"\"]):not(.mui--is-empty):not(.mui--is-not-empty) ~ label, .mui-textfield > input:invalid:not(:focus):required:not(:empty):not(.mui--is-empty):not(.mui--is-not-empty) ~ label,\n.mui-textfield > textarea:invalid:not(:focus):not(:required) ~ label,\n.mui-textfield > textarea:invalid:not(:focus):required.mui--is-not-empty ~ label,\n.mui-textfield > textarea:invalid:not(:focus):required[value]:not([value=\"\"]):not(.mui--is-empty):not(.mui--is-not-empty) ~ label,\n.mui-textfield > textarea:invalid:not(:focus):required:not(:empty):not(.mui--is-empty):not(.mui--is-not-empty) ~ label,\n.mui-textfield > input:not(:focus).mui--is-invalid:not(:required) ~ label,\n.mui-textfield > input:not(:focus).mui--is-invalid:required.mui--is-not-empty ~ label,\n.mui-textfield > input:not(:focus).mui--is-invalid:required[value]:not([value=\"\"]):not(.mui--is-empty):not(.mui--is-not-empty) ~ label,\n.mui-textfield > input:not(:focus).mui--is-invalid:required:not(:empty):not(.mui--is-empty):not(.mui--is-not-empty) ~ label,\n.mui-textfield > textarea:not(:focus).mui--is-invalid:not(:required) ~ label,\n.mui-textfield > textarea:not(:focus).mui--is-invalid:required.mui--is-not-empty ~ label,\n.mui-textfield > textarea:not(:focus).mui--is-invalid:required[value]:not([value=\"\"]):not(.mui--is-empty):not(.mui--is-not-empty) ~ label,\n.mui-textfield > textarea:not(:focus).mui--is-invalid:required:not(:empty):not(.mui--is-empty):not(.mui--is-not-empty) ~ label {\n  color: #F44336; }\n\n.mui-textfield:not(.mui-textfield--float-label) > input:invalid:not(:focus):required.mui--is-empty.mui--is-dirty ~ label,\n.mui-textfield:not(.mui-textfield--float-label) > textarea:invalid:not(:focus):required.mui--is-empty.mui--is-dirty ~ label,\n.mui-textfield:not(.mui-textfield--float-label) > input:not(:focus).mui--is-invalid:required.mui--is-empty.mui--is-dirty ~ label,\n.mui-textfield:not(.mui-textfield--float-label) > textarea:not(:focus).mui--is-invalid:required.mui--is-empty.mui--is-dirty ~ label {\n  color: #F44336; }\n\n/**\n * MUI Helpers module\n */\n@keyframes mui-node-inserted {\n  from {\n    opacity: 0.99; }\n  to {\n    opacity: 1; } }\n\n.mui--no-transition {\n  transition: none !important; }\n\n.mui--no-user-select {\n  user-select: none; }\n\n.mui-caret {\n  display: inline-block;\n  width: 0;\n  height: 0;\n  margin-left: 2px;\n  vertical-align: middle;\n  border-top: 4px solid;\n  border-right: 4px solid transparent;\n  border-left: 4px solid transparent; }\n\n.mui--text-left {\n  text-align: left !important; }\n\n.mui--text-right {\n  text-align: right !important; }\n\n.mui--text-center {\n  text-align: center !important; }\n\n.mui--text-justify {\n  text-align: justify !important; }\n\n.mui--text-nowrap {\n  white-space: nowrap !important; }\n\n.mui--align-baseline {\n  vertical-align: baseline !important; }\n\n.mui--align-top {\n  vertical-align: top !important; }\n\n.mui--align-middle {\n  vertical-align: middle !important; }\n\n.mui--align-bottom {\n  vertical-align: bottom !important; }\n\n.mui--text-dark {\n  color: rgba(0, 0, 0, 0.87); }\n\n.mui--text-dark-secondary {\n  color: rgba(0, 0, 0, 0.54); }\n\n.mui--text-dark-hint {\n  color: rgba(0, 0, 0, 0.38); }\n\n.mui--text-light {\n  color: #FFF; }\n\n.mui--text-light-secondary {\n  color: rgba(255, 255, 255, 0.7); }\n\n.mui--text-light-hint {\n  color: rgba(255, 255, 255, 0.3); }\n\n.mui--text-accent {\n  color: rgba(255, 64, 129, 0.87); }\n\n.mui--text-accent-secondary {\n  color: rgba(255, 64, 129, 0.54); }\n\n.mui--text-accent-hint {\n  color: rgba(255, 64, 129, 0.38); }\n\n.mui--text-black {\n  color: #000; }\n\n.mui--text-white {\n  color: #FFF; }\n\n.mui--text-danger {\n  color: #F44336; }\n\n.mui-list--unstyled {\n  padding-left: 0;\n  list-style: none; }\n\n.mui-list--inline {\n  padding-left: 0;\n  list-style: none;\n  margin-left: -5px; }\n  .mui-list--inline > li {\n    display: inline-block;\n    padding-left: 5px;\n    padding-right: 5px; }\n\n.mui--z1, .mui-dropdown__menu, .mui-select__menu {\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24); }\n\n.mui--z2 {\n  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23); }\n\n.mui--z3 {\n  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23); }\n\n.mui--z4 {\n  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22); }\n\n.mui--z5 {\n  box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22); }\n\n.mui--clearfix:before, .mui--clearfix:after {\n  content: \" \";\n  display: table; }\n\n.mui--clearfix:after {\n  clear: both; }\n\n.mui--pull-right {\n  float: right !important; }\n\n.mui--pull-left {\n  float: left !important; }\n\n.mui--hide {\n  display: none !important; }\n\n.mui--show {\n  display: block !important; }\n\n.mui--invisible {\n  visibility: hidden; }\n\n.mui--overflow-hidden {\n  overflow: hidden !important; }\n\n.mui--overflow-hidden-x {\n  overflow-x: hidden !important; }\n\n.mui--overflow-hidden-y {\n  overflow-y: hidden !important; }\n\n.mui--visible-xs-block,\n.mui--visible-xs-inline,\n.mui--visible-xs-inline-block,\n.mui--visible-sm-block,\n.mui--visible-sm-inline,\n.mui--visible-sm-inline-block,\n.mui--visible-md-block,\n.mui--visible-md-inline,\n.mui--visible-md-inline-block,\n.mui--visible-lg-block,\n.mui--visible-lg-inline,\n.mui--visible-lg-inline-block,\n.mui--visible-xl-block,\n.mui--visible-xl-inline,\n.mui--visible-xl-inline-block {\n  display: none !important; }\n\n@media (max-width: 543px) {\n  .mui-visible-xs {\n    display: block !important; }\n  table.mui-visible-xs {\n    display: table; }\n  tr.mui-visible-xs {\n    display: table-row !important; }\n  th.mui-visible-xs,\n  td.mui-visible-xs {\n    display: table-cell !important; }\n  .mui--visible-xs-block {\n    display: block !important; }\n  .mui--visible-xs-inline {\n    display: inline !important; }\n  .mui--visible-xs-inline-block {\n    display: inline-block !important; } }\n\n@media (min-width: 544px) and (max-width: 767px) {\n  .mui-visible-sm {\n    display: block !important; }\n  table.mui-visible-sm {\n    display: table; }\n  tr.mui-visible-sm {\n    display: table-row !important; }\n  th.mui-visible-sm,\n  td.mui-visible-sm {\n    display: table-cell !important; }\n  .mui--visible-sm-block {\n    display: block !important; }\n  .mui--visible-sm-inline {\n    display: inline !important; }\n  .mui--visible-sm-inline-block {\n    display: inline-block !important; } }\n\n@media (min-width: 768px) and (max-width: 991px) {\n  .mui-visible-md {\n    display: block !important; }\n  table.mui-visible-md {\n    display: table; }\n  tr.mui-visible-md {\n    display: table-row !important; }\n  th.mui-visible-md,\n  td.mui-visible-md {\n    display: table-cell !important; }\n  .mui--visible-md-block {\n    display: block !important; }\n  .mui--visible-md-inline {\n    display: inline !important; }\n  .mui--visible-md-inline-block {\n    display: inline-block !important; } }\n\n@media (min-width: 992px) and (max-width: 1199px) {\n  .mui-visible-lg {\n    display: block !important; }\n  table.mui-visible-lg {\n    display: table; }\n  tr.mui-visible-lg {\n    display: table-row !important; }\n  th.mui-visible-lg,\n  td.mui-visible-lg {\n    display: table-cell !important; }\n  .mui--visible-lg-block {\n    display: block !important; }\n  .mui--visible-lg-inline {\n    display: inline !important; }\n  .mui--visible-lg-inline-block {\n    display: inline-block !important; } }\n\n@media (min-width: 1200px) {\n  .mui-visible-xl {\n    display: block !important; }\n  table.mui-visible-xl {\n    display: table; }\n  tr.mui-visible-xl {\n    display: table-row !important; }\n  th.mui-visible-xl,\n  td.mui-visible-xl {\n    display: table-cell !important; }\n  .mui--visible-xl-block {\n    display: block !important; }\n  .mui--visible-xl-inline {\n    display: inline !important; }\n  .mui--visible-xl-inline-block {\n    display: inline-block !important; } }\n\n@media (max-width: 543px) {\n  .mui--hidden-xs {\n    display: none !important; } }\n\n@media (min-width: 544px) and (max-width: 767px) {\n  .mui--hidden-sm {\n    display: none !important; } }\n\n@media (min-width: 768px) and (max-width: 991px) {\n  .mui--hidden-md {\n    display: none !important; } }\n\n@media (min-width: 992px) and (max-width: 1199px) {\n  .mui--hidden-lg {\n    display: none !important; } }\n\n@media (min-width: 1200px) {\n  .mui--hidden-xl {\n    display: none !important; } }\n\nbody.mui-body--scroll-lock {\n  overflow: hidden !important; }\n\n/**\n * MUI Overlay module\n */\n#mui-overlay {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 99999999;\n  background-color: rgba(0, 0, 0, 0.2);\n  overflow: auto; }\n\n/**\n * MUI Ripple module\n */\n.mui-ripple-effect {\n  position: absolute;\n  border-radius: 50%;\n  pointer-events: none;\n  opacity: 0;\n  animation: mui-ripple-animation 2s; }\n\n@keyframes mui-ripple-animation {\n  from {\n    transform: scale(1);\n    opacity: 0.4; }\n  to {\n    transform: scale(100);\n    opacity: 0; } }\n\n.mui-btn > .mui-ripple-effect {\n  background-color: #a6a6a6; }\n\n.mui-btn--primary > .mui-ripple-effect {\n  background-color: #FFF; }\n\n.mui-btn--dark > .mui-ripple-effect {\n  background-color: #FFF; }\n\n.mui-btn--danger > .mui-ripple-effect {\n  background-color: #FFF; }\n\n.mui-btn--accent > .mui-ripple-effect {\n  background-color: #FFF; }\n\n.mui-btn--flat > .mui-ripple-effect {\n  background-color: #a6a6a6; }\n\n/**\n * MUI Typography module\n */\n.mui--text-display4 {\n  font-weight: 300;\n  font-size: 112px;\n  line-height: 112px; }\n\n.mui--text-display3 {\n  font-weight: 400;\n  font-size: 56px;\n  line-height: 56px; }\n\n.mui--text-display2 {\n  font-weight: 400;\n  font-size: 45px;\n  line-height: 48px; }\n\n.mui--text-display1, h1 {\n  font-weight: 400;\n  font-size: 34px;\n  line-height: 40px; }\n\n.mui--text-headline, h2 {\n  font-weight: 400;\n  font-size: 24px;\n  line-height: 32px; }\n\n.mui--text-title, h3 {\n  font-weight: 400;\n  font-size: 20px;\n  line-height: 28px; }\n\n.mui--text-subhead, h4 {\n  font-weight: 400;\n  font-size: 16px;\n  line-height: 24px; }\n\n.mui--text-body2, h5 {\n  font-weight: 500;\n  font-size: 14px;\n  line-height: 24px; }\n\n.mui--text-body1 {\n  font-weight: 400;\n  font-size: 14px;\n  line-height: 20px; }\n\n.mui--text-caption {\n  font-weight: 400;\n  font-size: 12px;\n  line-height: 16px; }\n\n.mui--text-menu {\n  font-weight: 500;\n  font-size: 13px;\n  line-height: 17px; }\n\n.mui--text-button {\n  font-weight: 500;\n  font-size: 14px;\n  line-height: 18px;\n  text-transform: uppercase; }\n", ""]);
	
	// exports


/***/ },
/* 5 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(true) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {__webpack_require__(8);
	riot.tag2('app', '<name first="Hello" last="World"></name> <name first="Ola" last="Mundo"></name>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {
	riot.tag2('name', '<h1 onclick="{_onClick}">{opts.last}</h1> <button class="mui-btn mui-btn--primary">{opts.first}</button>', '', '', function (opts) {
	  var _tmp;
	
	  console.log('test in name.tag');
	
	  console.log('@', this);
	
	  _tmp = this;
	
	  this._onClick = function (e) {
	    console.log('titleclicked', e);
	    return console.log(_tmp._riot_id);
	  };
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }
/******/ ]);
//# sourceMappingURL=app.js.map