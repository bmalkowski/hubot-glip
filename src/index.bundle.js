module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ringcentralTs = __webpack_require__(1);

var _ringcentralTs2 = _interopRequireDefault(_ringcentralTs);

var _FileTokenStore = __webpack_require__(2);

var _FileTokenStore2 = _interopRequireDefault(_FileTokenStore);

var _package = __webpack_require__(3);

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var tokenStore = new _FileTokenStore2.default('./tokenStore.json');

var hubot = null;
try {
  hubot = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"hubot\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
} catch (_) {
  var prequire = __webpack_require__(4);
  hubot = prequire('hubot');
}

var _hubot = hubot,
    Adapter = _hubot.Adapter,
    TextMessage = _hubot.TextMessage,
    User = _hubot.User;

var GlipAdapter = function (_Adapter) {
  _inherits(GlipAdapter, _Adapter);

  function GlipAdapter(robot) {
    _classCallCheck(this, GlipAdapter);

    var _this = _possibleConstructorReturn(this, (GlipAdapter.__proto__ || Object.getPrototypeOf(GlipAdapter)).call(this, robot));

    _this.client = new _ringcentralTs2.default({
      tokenStore,
      server: process.env.HUBOT_GLIP_SERVER || _ringcentralTs.SERVER_PRODUCTION,
      appKey: process.env.HUBOT_GLIP_APP_KEY,
      appSecret: process.env.HUBOT_GLIP_APP_SECRET
    });
    _this.client.agents.push(`${_package2.default.name}/${_package2.default.version}`);

    _this.client.getToken().then(function () {
      _this.robot.logger.info('Token restored from file');
      _this._subscribe();
    }).catch(function (e) {
      _this.robot.logger.error('No saved token detected. You need to add the bot to Glip first.');
    });

    _this.robot.router.get('/oauth', function (req, res) {
      if (!req.query.code) {
        res.status(500);
        res.send({ 'Error': "Looks like we're not getting code." });
        _this.robot.logger.error('Looks like we are not getting code.');
        return;
      }
      _this.robot.logger.info(req.query.code);
      _this.client.oauth(req.query.code, `${process.env.HUBOT_GLIP_BOT_SERVER}/oauth`).then(function () {
        res.status(200);
        res.send('success');
        _this.robot.logger.info('oauth is successful');
        _this._subscribe();
      }).catch(function (e) {
        res.status(500);
        res.send(e.message);
        _this.robot.logger.error(e);
      });
    });
    return _this;
  }

  _createClass(GlipAdapter, [{
    key: '_subscribe',
    value: function _subscribe() {
      var _this2 = this;

      this.emit('connected');
      var subscription = this.client.createSubscription();
      subscription.onMessage(function (message) {
        _this2.robot.logger.info(JSON.stringify(message, null, 4));
        var post = message.body;
        if (post.eventType === 'PostAdded' && post.text && post.text !== '') {
          var user = new User(post.creatorId, {
            room: post.groupId,
            reply_to: post.groupId,
            name: `User ${post.creatorId} from Group ${post.groupId}`
          });
          var hubotMessage = new TextMessage(user, post.text, 'MSG-' + post.id);
          _this2.robot.receive(hubotMessage);
        }
      });
      subscription.subscribe(['/glip/posts']).then(function (subscription) {
        _this2.robot.logger.info('Subscription created');
      }, function (e) {
        _this2.robot.logger.error(e);
      });
    }
  }, {
    key: 'subscribe',
    value: function subscribe() {}
  }, {
    key: 'send',
    value: function send(envelope, string) {
      this.robot.logger.info('send ' + JSON.stringify(envelope, null, 4) + '\n\n' + string);
      this.client.glip().posts().post({ groupId: envelope.user.reply_to, text: string });
    }
  }, {
    key: 'reply',
    value: function reply(envelope, string) {
      this.robot.logger.info('reply ' + JSON.stringify(envelope, null, 4) + '\n\n' + string);
      this.client.glip().posts().post({ groupId: envelope.user.reply_to, text: string });
    }
  }, {
    key: 'run',
    value: function run() {
      this.robot.logger.info('Run');
    }
  }]);

  return GlipAdapter;
}(Adapter);

exports.use = function (robot) {
  return new GlipAdapter(robot);
};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("ringcentral-ts");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("ringcentral-ts/FileTokenStore");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = {"name":"hubot-glip","version":"2.1.4","description":"Hubot adapter to use with Glip","main":"src/index.bundle.js","scripts":{"upgrade":"yarn-upgrade-all","build":"node -r babel-register node_modules/.bin/webpack --progress --colors"},"dependencies":{"parent-require":"^1.0.0","ringcentral-ts":"^0.9.1"},"peerDependencies":{"hubot":"^2.19.0"},"devDependencies":{"babel-core":"^6.26.0","babel-loader":"^7.1.2","babel-preset-env":"^1.6.0","standard":"^10.0.3","webpack":"^3.7.1","webpack-node-externals":"^1.6.0","yarn-upgrade-all":"^0.2.0"},"repository":{"type":"git","url":"git+https://github.com/tylerlong/hubot-glip.git"},"keywords":["glip","hubot","adapter","RingCentral"],"author":"Tyler Long <tyler4long@gmail.com> (https://github.com/tylerlong)","license":"MIT","bugs":{"url":"https://github.com/tylerlong/hubot-glip/issues"},"homepage":"https://github.com/tylerlong/hubot-glip#readme"}

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("parent-require");

/***/ })
/******/ ]);