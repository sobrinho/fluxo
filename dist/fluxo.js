/*! fluxo-js v0.0.17 | (c) 2014, 2015 Samuel Simões | https://github.com/fluxo-js/fluxo */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Fluxo = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _fluxoObject_storeJs = require("./fluxo.object_store.js");

var _fluxoObject_storeJs2 = _interopRequireDefault(_fluxoObject_storeJs);

/** @namespace Fluxo */
/**
 * Fluxo.CollectionStore is a convenient wrapper to your literal objects arrays.
 */

var _default = (function (_ObjectStore) {
  _inherits(_default, _ObjectStore);

  /** @lends Fluxo.CollectionStore */

  function _default() {
    var stores = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
    var data = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, _default);

    _get(Object.getPrototypeOf(_default.prototype), "constructor", this).call(this, data);

    this.store = this.constructor.store || _fluxoObject_storeJs2["default"];

    this.stores = [];

    this.storesOnChangeCancelers = {};

    this.childrenDelegate = this.constructor.childrenDelegate || [];

    this.setStores(stores);

    this.createDelegateMethods();
  }

  /**
   * @returns {null}
   */

  _createClass(_default, [{
    key: "createDelegateMethods",
    value: function createDelegateMethods() {
      for (var i = 0, l = this.childrenDelegate.length; i < l; i++) {
        var methodName = this.childrenDelegate[i];
        this.createDelegateMethod(methodName);
      }
    }

    /**
     * @param {string} method to delegate to children
     * @returns {null}
     */
  }, {
    key: "createDelegateMethod",
    value: function createDelegateMethod(methodName) {
      this[methodName] = (function (method, id) {
        var child = this.find(id);

        for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          args[_key - 2] = arguments[_key];
        }

        child[method].apply(child, args);
      }).bind(this, methodName);
    }

    /**
     * @param {Object[]} stores data
     * @returns {null}
     */
  }, {
    key: "addStores",
    value: function addStores(stores) {
      for (var i = 0, l = stores.length; i < l; i++) {
        var store = stores[i];
        this.addStore(store);
      }
    }

    /**
     * @param {Object[]} stores data
     * @returns {null}
     */
  }, {
    key: "resetStores",
    value: function resetStores(stores) {
      this.removeAll();
      this.addStores(stores);
    }

    /**
     * @returns {null}
     * @instance
     */
  }, {
    key: "removeAll",
    value: function removeAll() {
      for (var i = this.stores.length - 1, l = 0; i >= l; i--) {
        var store = this.stores[i];
        this.removeListenersOn(store);
      }

      this.stores = [];

      this.triggerEvents(["remove", "change"]);
    }

    /**
     * This methods add the missing objects and updates the existing stores.
     *
     * @param {Object[]} stores data
     * @returns undefined
     * @instance
     */
  }, {
    key: "setStores",
    value: function setStores(data) {
      for (var i = 0, l = data.length; i < l; i++) {
        var storeData = data[i],
            alreadyAddedStore = this.find(storeData.id || storeData.cid);

        if (alreadyAddedStore) {
          alreadyAddedStore.set(storeData);
        } else {
          this.addStore(storeData);
        }
      }
    }

    /**
     * @param {Object} store data
     * @returns {Object}
     * @instance
     */
  }, {
    key: "addStore",
    value: function addStore(store) {
      if (!(store instanceof this.store)) {
        store = new this.store(store);
      }

      var alreadyAddedStore = this.find(store.data.id);

      if (alreadyAddedStore) {
        return alreadyAddedStore;
      }

      this.stores.push(store);

      var onStoreEvent = function onStoreEvent(eventName) {
        for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }

        this.triggerEvent.apply(this, ["stores:" + eventName].concat(args));
      };

      this.storesOnChangeCancelers[store.cid] = store.on(["*"], onStoreEvent.bind(this));

      if (this.sort) {
        this.stores.sort(this.sort);
      }

      this.triggerEvents(["add", "change"]);

      return store;
    }

    /**
     * @param {number} storeID
     * @returns {Object|undefined} - the found flux store or undefined
     * @instance
     */
  }, {
    key: "find",
    value: function find(storeID) {
      var foundStore;

      if (storeID) {
        foundStore = this.findWhere({ id: storeID });

        if (!foundStore) {
          this.stores.some(function (store) {
            if (store.cid === storeID) {
              foundStore = store;

              return true;
            }
          });
        }
      }

      return foundStore;
    }

    /**
     * @param {Object} criteria
     * @returns {Object|undefined} - the found flux store or undefined
     * @instance
     */
  }, {
    key: "findWhere",
    value: function findWhere(criteria) {
      return this.where(criteria, true)[0];
    }

    /**
     * @param {Object} criteria
     * @returns {Fluxo.ObjectStore[]} - the found flux stores or empty array
     * @instance
     */
  }, {
    key: "where",
    value: function where(criteria, stopOnFirstMatch) {
      var foundStores = [];

      if (!criteria) {
        return [];
      }

      for (var i = 0, l = this.stores.length; i < l; i++) {
        var comparedStore = this.stores[i],
            matchAllCriteria = true;

        for (var key in criteria) {
          if (comparedStore.data[key] !== criteria[key]) {
            matchAllCriteria = false;
            break;
          }
        }

        if (matchAllCriteria) {
          foundStores.push(comparedStore);

          if (stopOnFirstMatch) {
            break;
          }
        }
      }

      return foundStores;
    }

    /**
     * @returns {null}
     * @instance
     */
  }, {
    key: "removeListenersOn",
    value: function removeListenersOn(store) {
      this.storesOnChangeCancelers[store.cid].call();
      delete this.storesOnChangeCancelers[store.cid];
    }

    /**
     * @param {Fluxo.ObjectStore} store - the store to remove
     * @returns {null}
     * @instance
     */
  }, {
    key: "remove",
    value: function remove(store) {
      this.removeListenersOn(store);

      this.stores.splice(this.stores.indexOf(store), 1);

      this.triggerEvents(["remove", "change"]);
    }

    /**
     * It returns an array with the result of toJSON method invoked
     * on each stores.
     *
     * @returns {Object}
     *
     * @instance
     */
  }, {
    key: "storesToJSON",
    value: function storesToJSON() {
      var collectionData = [];

      for (var i = 0, l = this.stores.length; i < l; i++) {
        var store = this.stores[i];
        collectionData.push(store.toJSON());
      }

      return collectionData;
    }

    /**
     * It returns a JSON with two keys. The first, "data", is the
     * store attributes setted using the setAttribute method and the second key,
     * stores, is the result of storesToJSON method.
     *
     * e.g {
     *   data: { count: 20 },
     *   stores: [{ name: "Samuel }]
     * }
     *
     * @returns {Object}
     *
     * @instance
     */
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        data: _get(Object.getPrototypeOf(_default.prototype), "toJSON", this).call(this),
        stores: this.storesToJSON()
      };
    }
  }]);

  return _default;
})(_fluxoObject_storeJs2["default"]);

exports["default"] = _default;
module.exports = exports["default"];

},{"./fluxo.object_store.js":4}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function () {
  var toExtend = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  for (var _len = arguments.length, extensions = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    extensions[_key - 1] = arguments[_key];
  }

  for (var i = 0, l = extensions.length; i < l; i++) {
    var extension = extensions[i];

    for (var extensionProperty in extension) {
      toExtend[extensionProperty] = extension[extensionProperty];
    }
  }

  return toExtend;
};

;
module.exports = exports["default"];

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _fluxoObject_storeJs = require("./fluxo.object_store.js");

var _fluxoObject_storeJs2 = _interopRequireDefault(_fluxoObject_storeJs);

var _fluxoCollection_storeJs = require("./fluxo.collection_store.js");

var _fluxoCollection_storeJs2 = _interopRequireDefault(_fluxoCollection_storeJs);

var _fluxoExtendJs = require("./fluxo.extend.js");

var _fluxoExtendJs2 = _interopRequireDefault(_fluxoExtendJs);

var _fluxoRadioJs = require("./fluxo.radio.js");

var _fluxoRadioJs2 = _interopRequireDefault(_fluxoRadioJs);

exports["default"] = {
  ObjectStore: _fluxoObject_storeJs2["default"],
  CollectionStore: _fluxoCollection_storeJs2["default"],
  Extend: _fluxoExtendJs2["default"],
  Radio: _fluxoRadioJs2["default"]
};
module.exports = exports["default"];

},{"./fluxo.collection_store.js":1,"./fluxo.extend.js":2,"./fluxo.object_store.js":4,"./fluxo.radio.js":5}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _fluxoRadioJs = require("./fluxo.radio.js");

var _fluxoRadioJs2 = _interopRequireDefault(_fluxoRadioJs);

var _fluxoExtendJs = require("./fluxo.extend.js");

var _fluxoExtendJs2 = _interopRequireDefault(_fluxoExtendJs);

var storesUUID = 1;

var _default = (function () {
  function _default() {
    var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, _default);

    this.cid = "FS:" + storesUUID++;

    this.data = {};

    this.computed = this.constructor.computed || {};

    this.attributeParsers = this.constructor.attributeParsers || {};

    this.set(_extends({}, this.constructor.defaults, data));

    this.registerComputed();
  }

  _createClass(_default, [{
    key: "on",
    value: function on(events, callback) {
      var cancelers = [];

      for (var i = 0, l = events.length; i < l; i++) {
        var eventName = events[i],
            changeEventToken = this.cid + ":" + eventName,
            canceler = _fluxoRadioJs2["default"].subscribe(changeEventToken, callback.bind(this));

        cancelers.push(canceler);
      }

      var aggregatedCanceler = function aggregatedCanceler() {
        for (var i = 0, l = cancelers.length; i < l; i++) {
          var canceler = cancelers[i];
          canceler.call();
        }
      };

      return aggregatedCanceler;
    }
  }, {
    key: "triggerEvents",
    value: function triggerEvents(eventsNames) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      for (var i = 0, l = eventsNames.length; i < l; i++) {
        var eventName = eventsNames[i];
        this.triggerEvent.apply(this, [eventName].concat(args));
      }
    }
  }, {
    key: "triggerEvent",
    value: function triggerEvent(eventName) {
      var changeChannel = this.cid + ":" + eventName;

      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      _fluxoRadioJs2["default"].publish.apply(_fluxoRadioJs2["default"], [changeChannel, this].concat(args));

      _fluxoRadioJs2["default"].publish.apply(_fluxoRadioJs2["default"], [this.cid + ":*", eventName, this].concat(args));
    }
  }, {
    key: "getComputed",
    value: function getComputed(attributeName) {
      if (!this[attributeName]) {
        throw new Error("Compute function to \"" + attributeName + "\" value is not defined.");
      }

      return this[attributeName].call(this);
    }
  }, {
    key: "computeValue",
    value: function computeValue(attributeName) {
      this.setAttribute(attributeName, this.getComputed(attributeName));
    }
  }, {
    key: "registerComputed",
    value: function registerComputed() {
      for (var attributeName in this.computed) {
        var toComputeEvents = this.computed[attributeName];

        this.on(toComputeEvents, this.computeValue.bind(this, attributeName));

        this.setAttribute(attributeName, this.getComputed(attributeName));
      }
    }
  }, {
    key: "setAttribute",
    value: function setAttribute(attribute, value, options) {
      options = options || {};

      if (this.data[attribute] === value) {
        return;
      }

      if (this.attributeParsers[attribute]) {
        value = this.attributeParsers[attribute](value);
      }

      this.data[attribute] = value;

      this.triggerEvent("change:" + attribute);

      if (options.silentGlobalChange) {
        return;
      }

      this.triggerEvent("change");
    }
  }, {
    key: "unsetAttribute",
    value: function unsetAttribute(attribute, options) {
      options = options || {};

      delete this.data[attribute];

      this.triggerEvent("change:" + attribute);

      if (options.silentGlobalChange) {
        return;
      }

      this.triggerEvent("change");
    }
  }, {
    key: "set",
    value: function set(data) {
      for (var key in data) {
        this.setAttribute(key, data[key], { silentGlobalChange: true });
      }

      this.triggerEvent("change");
    }
  }, {
    key: "reset",
    value: function reset(data) {
      data = data || {};

      for (var key in this.data) {
        if (data[key] === undefined) {
          this.unsetAttribute(key, { silentGlobalChange: true });
        }
      }

      for (var key in data) {
        this.setAttribute(key, data[key], { silentGlobalChange: true });
      }

      this.triggerEvent("change");
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      var data = JSON.parse(JSON.stringify(this.data));
      data.cid = this.cid;

      return data;
    }
  }]);

  return _default;
})();

exports["default"] = _default;
;
module.exports = exports["default"];

},{"./fluxo.extend.js":2,"./fluxo.radio.js":5}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = {
  callbackIds: 1,

  events: {},

  subscribe: function subscribe(eventName, callback) {
    var subscriptionId = this.callbackIds++;

    this.events[eventName] = this.events[eventName] || {};
    this.events[eventName][subscriptionId] = callback;

    return this.removeSubscription.bind(this, eventName, subscriptionId);
  },

  removeSubscription: function removeSubscription(eventName, subscriptionId) {
    this.events[eventName] = this.events[eventName] || {};
    delete this.events[eventName][subscriptionId];
  },

  publish: function publish(eventName) {
    var callbacks = this.events[eventName] || {};

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    for (var subscriptionId in callbacks) {
      callbacks[subscriptionId].apply(null, args);
    }
  }
};
module.exports = exports["default"];

},{}]},{},[3])(3)
});