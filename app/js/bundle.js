(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){


//canvasへの参上を変数に取得する
'use strict';

var c = document.getElementById('canvas');

//WebGLコンテキストをcanvasから取得する
var gl = c.getContext('webgl') || c.getContext('experimental-webgl');

//WebGLコンテキストの取得ができたかどうか
if (gl) {
  console.log('supports webgl');
} else {
  console.log('webgl not supported');
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYjA3MDk3L3dvcmtzcGFjZS92ZXJ5dGlyZWQvcmF3LXdlYmdsL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0FDR0EsSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7O0FBRzFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDOzs7QUFHckUsSUFBRyxFQUFFLEVBQUM7QUFDSixTQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7Q0FDL0IsTUFBSTtBQUNILFNBQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQztDQUNwQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcblxuLy9jYW52YXPjgbjjga7lj4LkuIrjgpLlpInmlbDjgavlj5blvpfjgZnjgotcbmxldCBjID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpO1xuXG4vL1dlYkdM44Kz44Oz44OG44Kt44K544OI44KSY2FudmFz44GL44KJ5Y+W5b6X44GZ44KLXG5sZXQgZ2wgPSBjLmdldENvbnRleHQoJ3dlYmdsJykgfHwgYy5nZXRDb250ZXh0KCdleHBlcmltZW50YWwtd2ViZ2wnKTtcblxuLy9XZWJHTOOCs+ODs+ODhuOCreOCueODiOOBruWPluW+l+OBjOOBp+OBjeOBn+OBi+OBqeOBhuOBi1xuaWYoZ2wpe1xuICBjb25zb2xlLmxvZygnc3VwcG9ydHMgd2ViZ2wnKTtcbn1lbHNle1xuICBjb25zb2xlLmxvZygnd2ViZ2wgbm90IHN1cHBvcnRlZCcpO1xufSJdfQ==
