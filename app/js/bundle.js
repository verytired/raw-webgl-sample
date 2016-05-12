(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

//imports/ConsoleWrapper.js
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ConsoleWrapper = (function () {
    function ConsoleWrapper() {
        var debug = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

        _classCallCheck(this, ConsoleWrapper);

        this.name = 'Console wrapper!';
    }

    _createClass(ConsoleWrapper, [{
        key: "speak",
        value: function speak(str) {
            debugger;
            console.log("Hello, I am ", str); //this == the object instance.
        }
    }]);

    return ConsoleWrapper;
})();

module.exports = ConsoleWrapper; //set what can be imported from this file

},{}],2:[function(require,module,exports){
"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _ConsoleWrapper = require("./ConsoleWrapper");

var _ConsoleWrapper2 = _interopRequireDefault(_ConsoleWrapper);

var x = new _ConsoleWrapper2["default"]();
x.speak('raw-webgl');

},{"./ConsoleWrapper":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYjA3MDk3L3dvcmtzcGFjZS92ZXJ5dGlyZWQvcmF3LXdlYmdsL3NyYy9Db25zb2xlV3JhcHBlci5qcyIsIi9Vc2Vycy9iMDcwOTcvd29ya3NwYWNlL3Zlcnl0aXJlZC9yYXctd2ViZ2wvc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7SUNFTSxjQUFjO0FBQ0wsYUFEVCxjQUFjLEdBQ1U7WUFBZCxLQUFLLHlEQUFHLEtBQUs7OzhCQUR2QixjQUFjOztBQUVaLFlBQUksQ0FBQyxJQUFJLEdBQUcsa0JBQWtCLENBQUM7S0FDbEM7O2lCQUhDLGNBQWM7O2VBSVgsZUFBQyxHQUFHLEVBQUM7QUFDTixxQkFBUztBQUNULG1CQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxHQUFHLENBQUMsQ0FBQztTQUNwQzs7O1dBUEMsY0FBYzs7O0FBVXBCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsY0FBYyxDQUFDOzs7Ozs7OzhCQ1pMLGtCQUFrQjs7OztBQUU3QyxJQUFJLENBQUMsR0FBRyxpQ0FBb0IsQ0FBQztBQUM3QixDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuLy9pbXBvcnRzL0NvbnNvbGVXcmFwcGVyLmpzXG5jbGFzcyBDb25zb2xlV3JhcHBlcntcbiAgICBjb25zdHJ1Y3RvcihkZWJ1ZyA9IGZhbHNlKXtcbiAgICAgICAgdGhpcy5uYW1lID0gJ0NvbnNvbGUgd3JhcHBlciEnO1xuICAgIH1cbiAgICBzcGVhayhzdHIpe1xuICAgICAgICBkZWJ1Z2dlcjtcbiAgICAgICAgY29uc29sZS5sb2coXCJIZWxsbywgSSBhbSBcIiwgc3RyKTsgLy90aGlzID09IHRoZSBvYmplY3QgaW5zdGFuY2UuXG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbnNvbGVXcmFwcGVyOyAvL3NldCB3aGF0IGNhbiBiZSBpbXBvcnRlZCBmcm9tIHRoaXMgZmlsZVxuIiwiaW1wb3J0IENvbnNvbGVXcmFwcGVyIGZyb20gXCIuL0NvbnNvbGVXcmFwcGVyXCI7XG5cbnZhciB4ID0gbmV3IENvbnNvbGVXcmFwcGVyKCk7XG54LnNwZWFrKCdyYXctd2ViZ2wnKTtcbiJdfQ==
