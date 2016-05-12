(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

window.onload = function () {

    //canvasへの参上を変数に取得する
    var c = document.getElementById('canvas');

    //WebGLコンテキストをcanvasから取得する
    var gl = c.getContext('webgl') || c.getContext('experimental-webgl');

    //WebGLコンテキストの取得ができたかどうか
    if (gl) {
        console.log('supports webgl');
    } else {
        console.log('webgl not supported');
    }

    // クリアする色を指定
    gl.clearColor(0, 0, 0, 1.0);

    //　エレメントをクリア
    gl.clear(gl.COLOR_BUFFER_BIT);
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMveXV0YWthL3dvcmtzcGFjZS92ZXJ5dGlyZWQvcmF3LXdlYmdsLXNhbXBsZS9zcmMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0NBLE1BQU0sQ0FBQyxNQUFNLEdBQUcsWUFBWTs7O0FBR3hCLFFBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7OztBQUcxQyxRQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsQ0FBQzs7O0FBR3JFLFFBQUksRUFBRSxFQUFFO0FBQ0osZUFBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0tBQ2pDLE1BQU07QUFDSCxlQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUM7S0FDdEM7OztBQUdELE1BQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7OztBQUc1QixNQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0NBRWpDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG53aW5kb3cub25sb2FkID0gZnVuY3Rpb24gKCkge1xuXG4gICAgLy9jYW52YXPjgbjjga7lj4LkuIrjgpLlpInmlbDjgavlj5blvpfjgZnjgotcbiAgICBsZXQgYyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKTtcblxuICAgIC8vV2ViR0zjgrPjg7Pjg4bjgq3jgrnjg4jjgpJjYW52YXPjgYvjgonlj5blvpfjgZnjgotcbiAgICBsZXQgZ2wgPSBjLmdldENvbnRleHQoJ3dlYmdsJykgfHwgYy5nZXRDb250ZXh0KCdleHBlcmltZW50YWwtd2ViZ2wnKTtcblxuICAgIC8vV2ViR0zjgrPjg7Pjg4bjgq3jgrnjg4jjga7lj5blvpfjgYzjgafjgY3jgZ/jgYvjganjgYbjgYtcbiAgICBpZiAoZ2wpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3N1cHBvcnRzIHdlYmdsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3dlYmdsIG5vdCBzdXBwb3J0ZWQnKTtcbiAgICB9XG5cbiAgICAvLyDjgq/jg6rjgqLjgZnjgovoibLjgpLmjIflrppcbiAgICBnbC5jbGVhckNvbG9yKDAsIDAsIDAsIDEuMCk7XG5cbiAgICAvL+OAgOOCqOODrOODoeODs+ODiOOCkuOCr+ODquOColxuICAgIGdsLmNsZWFyKGdsLkNPTE9SX0JVRkZFUl9CSVQpO1xuXG59O1xuIl19
