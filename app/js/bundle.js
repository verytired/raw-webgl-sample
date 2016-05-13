(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
* Sample 1
* 生WebGLを記述して三角形を表示させる
*/

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Sample1 = (function () {
  function Sample1() {
    _classCallCheck(this, Sample1);
  }

  _createClass(Sample1, [{
    key: 'run',

    /*
     * run
     * サンプルコード実行
     */
    value: function run() {

      //canvasへの参上を変数に取得する
      var c = document.getElementById('canvas');

      // size指定
      c.width = 512;
      c.height = 512;

      //WebGLコンテキストをcanvasから取得する
      var gl = c.getContext('webgl') || c.getContext('experimental-webgl');

      //WebGLコンテキストの取得ができたかどうか
      if (gl) {
        console.log('supports webgl');
      } else {
        console.log('webgl not supported');
        return;
      }

      // クリアする色を指定
      gl.clearColor(0.0, 0.0, 0.0, 1.0);

      // エレメントをクリア
      gl.clear(gl.COLOR_BUFFER_BIT);

      // 三角形を形成する頂点のデータを受け取る
      var triangleData = this.genTriangle();

      // 頂点データからバッファを生成
      var vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleData.p), gl.STATIC_DRAW);

      // シェーダとプログラムオブジェクト
      var vertexSource = document.getElementById('vs').textContent;
      var fragmentSource = document.getElementById('fs').textContent;
      var vertexShader = gl.createShader(gl.VERTEX_SHADER);
      var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
      var programs = gl.createProgram();

      gl.shaderSource(vertexShader, vertexSource);
      gl.compileShader(vertexShader);
      gl.attachShader(programs, vertexShader);
      gl.shaderSource(fragmentShader, fragmentSource);
      gl.compileShader(fragmentShader);
      gl.attachShader(programs, fragmentShader);
      gl.linkProgram(programs);
      gl.useProgram(programs);

      // プログラムオブジェクトに三角形の頂点データを登録
      var attLocation = gl.getAttribLocation(programs, 'position');
      gl.enableVertexAttribArray(attLocation);
      gl.vertexAttribPointer(attLocation, 3, gl.FLOAT, false, 0, 0);

      // 描画
      gl.drawArrays(gl.TRIANGLES, 0, triangleData.p.length / 3);
      gl.flush();
    }

    /*
     * genTriangle
     * 三角形の頂点情報を返却する
     */
  }, {
    key: 'genTriangle',
    value: function genTriangle() {
      var obj = {};
      obj.p = [
      // ひとつ目の三角形
      0.0, 0.5, 0.0, 0.5, -0.5, 0.0, -0.5, -0.5, 0.0,

      // ふたつ目の三角形
      0.0, -0.5, 0.0, 0.5, 0.5, 0.0, -0.5, 0.5, 0.0];
      return obj;
    }
  }]);

  return Sample1;
})();

module.exports = Sample1;

},{}],2:[function(require,module,exports){
/*
 * Sample 2
 */

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Sample2 = (function () {

    /**
     * constructor
     * コンストラクタ
     */

    function Sample2() {
        _classCallCheck(this, Sample2);

        //canvasへの参上を変数に取得する
        var c = document.getElementById('canvas');

        // size指定
        c.width = 512;
        c.height = 512;

        //WebGLコンテキストをcanvasから取得する
        this.gl = c.getContext('webgl') || c.getContext('experimental-webgl');
    }

    /**
     * run
     * サンプルコード実行
     */

    _createClass(Sample2, [{
        key: 'run',
        value: function run() {

            //WebGLコンテキストの取得ができたかどうか
            if (this.gl) {
                console.log('supports webgl');
            } else {
                console.log('webgl not supported');
                return;
            }

            // クリアする色を指定
            this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

            // エレメントをクリア
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);

            // 三角形を形成する頂点のデータを受け取る
            var triangleData = this.genTriangle();

            // 頂点データからバッファを生成
            var vertexBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(triangleData.p), this.gl.STATIC_DRAW);

            // シェーダとプログラムオブジェクト
            var vertexSource = document.getElementById('vs').textContent;
            var fragmentSource = document.getElementById('fs').textContent;

            // ユーザー定義のプログラムオブジェクト生成関数
            var programs = this.createShaderProgram(vertexSource, fragmentSource);

            // プログラムオブジェクトに三角形の頂点データを登録
            var attLocation = this.gl.getAttribLocation(programs, 'position');
            this.gl.enableVertexAttribArray(attLocation);
            this.gl.vertexAttribPointer(attLocation, 3, this.gl.FLOAT, false, 0, 0);

            // 描画
            this.gl.drawArrays(this.gl.TRIANGLES, 0, triangleData.p.length / 3);
            this.gl.flush();
        }

        /**
         * createShaderProgram
         * プログラムオブジェクト生成関数
         */
    }, {
        key: 'createShaderProgram',
        value: function createShaderProgram(vertexSource, fragmentSource) {

            // シェーダオブジェクトの生成
            var vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
            var fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);

            // シェーダにソースを割り当ててコンパイル
            this.gl.shaderSource(vertexShader, vertexSource);
            this.gl.compileShader(vertexShader);
            this.gl.shaderSource(fragmentShader, fragmentSource);
            this.gl.compileShader(fragmentShader);

            // シェーダーコンパイルのエラー判定
            if (this.gl.getShaderParameter(vertexShader, this.gl.COMPILE_STATUS) && this.gl.getShaderParameter(fragmentShader, this.gl.COMPILE_STATUS)) {
                console.log('Success Shader Compile');
            } else {
                console.log('Faild Shader Compile');
                console.log('vertexShader', this.gl.getShaderInfoLog(vertexShader));
                console.log('fragmentShader', this.gl.getShaderInfoLog(fragmentShader));
            }

            // プログラムオブジェクトの生成から選択まで
            var programs = this.gl.createProgram();
            this.gl.attachShader(programs, vertexShader);
            this.gl.attachShader(programs, fragmentShader);
            this.gl.linkProgram(programs);
            this.gl.useProgram(programs);

            // 生成したプログラムオブジェクトを戻り値として返す
            return programs;
        }

        /**
         * genTriangle
         * 三角形の頂点情報を返却する
         */
    }, {
        key: 'genTriangle',
        value: function genTriangle() {
            var obj = {};
            obj.p = [
            // ひとつ目の三角形
            0.0, 0.5, 0.0, 0.5, -0.5, 0.0, -0.5, -0.5, 0.0,

            // ふたつ目の三角形
            0.0, -0.5, 0.0, 0.5, 0.5, 0.0, -0.5, 0.5, 0.0];
            return obj;
        }
    }]);

    return Sample2;
})();

module.exports = Sample2;

},{}],3:[function(require,module,exports){
"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _Sample1 = require("./Sample1");

var _Sample12 = _interopRequireDefault(_Sample1);

var _Sample2 = require("./Sample2");

var _Sample22 = _interopRequireDefault(_Sample2);

window.onload = function () {

  var sample2 = new _Sample22["default"]();
  sample2.run();
};

},{"./Sample1":1,"./Sample2":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMveXV0YWthL3dvcmtzcGFjZS92ZXJ5dGlyZWQvcmF3LXdlYmdsLXNhbXBsZS9zcmMvU2FtcGxlMS5qcyIsIi9Vc2Vycy95dXRha2Evd29ya3NwYWNlL3Zlcnl0aXJlZC9yYXctd2ViZ2wtc2FtcGxlL3NyYy9TYW1wbGUyLmpzIiwiL1VzZXJzL3l1dGFrYS93b3Jrc3BhY2UvdmVyeXRpcmVkL3Jhdy13ZWJnbC1zYW1wbGUvc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7SUNLTSxPQUFPO1dBQVAsT0FBTzswQkFBUCxPQUFPOzs7ZUFBUCxPQUFPOzs7Ozs7O1dBTVIsZUFBRzs7O0FBR0osVUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7O0FBRzFDLE9BQUMsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO0FBQ2QsT0FBQyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7OztBQUdmLFVBQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDOzs7QUFHdkUsVUFBSSxFQUFFLEVBQUU7QUFDTixlQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7T0FDL0IsTUFBTTtBQUNMLGVBQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUNuQyxlQUFNO09BQ1A7OztBQUdELFFBQUUsQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7OztBQUdsQyxRQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOzs7QUFHOUIsVUFBSSxZQUFZLEdBQUcsSUFB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RUFBRSxDQUFDO0FBQ2IsZUFBRyxDQUFDLENBQUMsR0FBRzs7QUFFSixlQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFDYixHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUNkLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUc7OztBQUdmLGVBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQ2QsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQ2IsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FDakIsQ0FBQztBQUNGLG1CQUFPLEdBQUcsQ0FBQztTQUNkOzs7V0F2SEMsT0FBTzs7O0FBMEhiLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDOzs7Ozs7O3VCQzlITCxXQUFXOzs7O3VCQUNYLFdBQVc7Ozs7QUFFL0IsTUFBTSxDQUFDLE1BQU0sR0FBRyxZQUFZOztBQUUxQixNQUFNLE9BQU8sR0FBRywwQkFBYSxDQUFDO0FBQzlCLFNBQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztDQUVmLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypcbiogU2FtcGxlIDFcbiog55SfV2ViR0zjgpLoqJjov7DjgZfjgabkuInop5LlvaLjgpLooajnpLrjgZXjgZvjgotcbiovXG5cbmNsYXNzIFNhbXBsZTEge1xuXG4gIC8qXG4gICAqIHJ1blxuICAgKiDjgrXjg7Pjg5fjg6vjgrPjg7zjg4nlrp/ooYxcbiAgICovXG4gIHJ1bigpIHtcblxuICAgIC8vY2FudmFz44G444Gu5Y+C5LiK44KS5aSJ5pWw44Gr5Y+W5b6X44GZ44KLXG4gICAgbGV0IGMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJyk7XG5cbiAgICAvLyBzaXpl5oyH5a6aXG4gICAgYy53aWR0aCA9IDUxMjtcbiAgICBjLmhlaWdodCA9IDUxMjtcblxuICAgIC8vV2ViR0zjgrPjg7Pjg4bjgq3jgrnjg4jjgpJjYW52YXPjgYvjgonlj5blvpfjgZnjgotcbiAgICBjb25zdCBnbCA9IGMuZ2V0Q29udGV4dCgnd2ViZ2wnKSB8fCBjLmdldENvbnRleHQoJ2V4cGVyaW1lbnRhbC13ZWJnbCcpO1xuXG4gICAgLy9XZWJHTOOCs+ODs+ODhuOCreOCueODiOOBruWPluW+l+OBjOOBp+OBjeOBn+OBi+OBqeOBhuOBi1xuICAgIGlmIChnbCkge1xuICAgICAgY29uc29sZS5sb2coJ3N1cHBvcnRzIHdlYmdsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCd3ZWJnbCBub3Qgc3VwcG9ydGVkJyk7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyDjgq/jg6rjgqLjgZnjgovoibLjgpLmjIflrppcbiAgICBnbC5jbGVhckNvbG9yKDAuMCwgMC4wLCAwLjAsIDEuMCk7XG5cbiAgICAvLyDjgqjjg6zjg6Hjg7Pjg4jjgpLjgq/jg6rjgqJcbiAgICBnbC5jbGVhcihnbC5DT0xPUl9CVUZGRVJfQklUKTtcblxuICAgIC8vIOS4ieinkuW9ouOCkuW9ouaIkOOBmeOCi+mggueCueOBruODh+ODvOOCv+OCkuWPl+OBkeWPluOCi1xuICAgIGxldCB0cmlhbmdsZURhdGEgPSB0aGlzLmdlblRyaWFuZ2xlKCk7XG5cbiAgICAvLyDpoILngrnjg4fjg7zjgr/jgYvjgonjg5Djg4Pjg5XjgqHjgpLnlJ/miJBcbiAgICB2YXIgdmVydGV4QnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHZlcnRleEJ1ZmZlcik7XG4gICAgZ2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIG5ldyBGbG9hdDMyQXJyYXkodHJpYW5nbGVEYXRhLnApLCBnbC5TVEFUSUNfRFJBVyk7XG5cbiAgICAvLyDjgrfjgqfjg7zjg4Djgajjg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4hcbiAgICBsZXQgdmVydGV4U291cmNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZzJykudGV4dENvbnRlbnQ7XG4gICAgbGV0IGZyYWdtZW50U291cmNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZzJykudGV4dENvbnRlbnQ7XG4gICAgbGV0IHZlcnRleFNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcihnbC5WRVJURVhfU0hBREVSKTtcbiAgICBsZXQgZnJhZ21lbnRTaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIoZ2wuRlJBR01FTlRfU0hBREVSKTtcbiAgICBsZXQgcHJvZ3JhbXMgPSBnbC5jcmVhdGVQcm9ncmFtKCk7XG5cbiAgICBnbC5zaGFkZXJTb3VyY2UodmVydGV4U2hhZGVyLCB2ZXJ0ZXhTb3VyY2UpO1xuICAgIGdsLmNvbXBpbGVTaGFkZXIodmVydGV4U2hhZGVyKTtcbiAgICBnbC5hdHRhY2hTaGFkZXIocHJvZ3JhbXMsIHZlcnRleFNoYWRlcik7XG4gICAgZ2wuc2hhZGVyU291cmNlKGZyYWdtZW50U2hhZGVyLCBmcmFnbWVudFNvdXJjZSk7XG4gICAgZ2wuY29tcGlsZVNoYWRlcihmcmFnbWVudFNoYWRlcik7XG4gICAgZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW1zLCBmcmFnbWVudFNoYWRlcik7XG4gICAgZ2wubGlua1Byb2dyYW0ocHJvZ3JhbXMpO1xuICAgIGdsLnVzZVByb2dyYW0ocHJvZ3JhbXMpO1xuXG4gICAgLy8g44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OI44Gr5LiJ6KeS5b2i44Gu6aCC54K544OH44O844K/44KS55m76YyyXG4gICAgbGV0IGF0dExvY2F0aW9uID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24ocHJvZ3JhbXMsICdwb3NpdGlvbicpO1xuICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGF0dExvY2F0aW9uKTtcbiAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dExvY2F0aW9uLCAzLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xuXG4gICAgLy8g5o+P55S7XG4gICAgZ2wuZHJhd0FycmF5cyhnbC5UUklBTkdMRVMsIDAsIHRyaWFuZ2xlRGF0YS5wLmxlbmd0aCAvIDMpO1xuICAgIGdsLmZsdXNoKCk7XG4gIH1cblxuICAvKlxuICAgKiBnZW5UcmlhbmdsZVxuICAgKiDkuInop5LlvaLjga7poILngrnmg4XloLHjgpLov5TljbTjgZnjgotcbiAgICovXG4gIGdlblRyaWFuZ2xlKCkge1xuICAgIGxldCBvYmogPSB7fTtcbiAgICBvYmoucCA9IFtcbiAgICAgIC8vIOOBsuOBqOOBpOebruOBruS4ieinkuW9olxuICAgICAgMC4wLCAwLjUsIDAuMCxcbiAgICAgIDAuNSwgLTAuNSwgMC4wLFxuICAgICAgLTAuNSwgLTAuNSwgMC4wLFxuXG4gICAgICAvLyDjgbXjgZ/jgaTnm67jga7kuInop5LlvaJcbiAgICAgIDAuMCwgLTAuNSwgMC4wLFxuICAgICAgMC41LCAwLjUsIDAuMCxcbiAgICAgIC0wLjUsIDAuNSwgMC4wXG4gICAgXTtcbiAgICByZXR1cm4gb2JqO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2FtcGxlMTtcbiIsIi8qXG4gKiBTYW1wbGUgMlxuICovXG5cbmNsYXNzIFNhbXBsZTIge1xuXG4gICAgLyoqXG4gICAgICogY29uc3RydWN0b3JcbiAgICAgKiDjgrPjg7Pjgrnjg4jjg6njgq/jgr9cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICAvL2NhbnZhc+OBuOOBruWPguS4iuOCkuWkieaVsOOBq+WPluW+l+OBmeOCi1xuICAgICAgICBsZXQgYyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKTtcblxuICAgICAgICAvLyBzaXpl5oyH5a6aXG4gICAgICAgIGMud2lkdGggPSA1MTI7XG4gICAgICAgIGMuaGVpZ2h0ID0gNTEyO1xuXG4gICAgICAgIC8vV2ViR0zjgrPjg7Pjg4bjgq3jgrnjg4jjgpJjYW52YXPjgYvjgonlj5blvpfjgZnjgotcbiAgICAgICAgdGhpcy5nbCA9IGMuZ2V0Q29udGV4dCgnd2ViZ2wnKSB8fCBjLmdldENvbnRleHQoJ2V4cGVyaW1lbnRhbC13ZWJnbCcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJ1blxuICAgICAqIOOCteODs+ODl+ODq+OCs+ODvOODieWun+ihjFxuICAgICAqL1xuICAgIHJ1bigpIHtcblxuICAgICAgICAvL1dlYkdM44Kz44Oz44OG44Kt44K544OI44Gu5Y+W5b6X44GM44Gn44GN44Gf44GL44Gp44GG44GLXG4gICAgICAgIGlmICh0aGlzLmdsKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnc3VwcG9ydHMgd2ViZ2wnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd3ZWJnbCBub3Qgc3VwcG9ydGVkJyk7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOOCr+ODquOCouOBmeOCi+iJsuOCkuaMh+WumlxuICAgICAgICB0aGlzLmdsLmNsZWFyQ29sb3IoMC4wLCAwLjAsIDAuMCwgMS4wKTtcblxuICAgICAgICAvLyDjgqjjg6zjg6Hjg7Pjg4jjgpLjgq/jg6rjgqJcbiAgICAgICAgdGhpcy5nbC5jbGVhcih0aGlzLmdsLkNPTE9SX0JVRkZFUl9CSVQpO1xuXG4gICAgICAgIC8vIOS4ieinkuW9ouOCkuW9ouaIkOOBmeOCi+mggueCueOBruODh+ODvOOCv+OCkuWPl+OBkeWPluOCi1xuICAgICAgICBsZXQgdHJpYW5nbGVEYXRhID0gdGhpcy5nZW5UcmlhbmdsZSgpO1xuXG4gICAgICAgIC8vIOmggueCueODh+ODvOOCv+OBi+OCieODkOODg+ODleOCoeOCkueUn+aIkFxuICAgICAgICB2YXIgdmVydGV4QnVmZmVyID0gdGhpcy5nbC5jcmVhdGVCdWZmZXIoKTtcbiAgICAgICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCB2ZXJ0ZXhCdWZmZXIpO1xuICAgICAgICB0aGlzLmdsLmJ1ZmZlckRhdGEodGhpcy5nbC5BUlJBWV9CVUZGRVIsIG5ldyBGbG9hdDMyQXJyYXkodHJpYW5nbGVEYXRhLnApLCB0aGlzLmdsLlNUQVRJQ19EUkFXKTtcblxuICAgICAgICAvLyDjgrfjgqfjg7zjg4Djgajjg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4hcbiAgICAgICAgY29uc3QgdmVydGV4U291cmNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZzJykudGV4dENvbnRlbnQ7XG4gICAgICAgIGNvbnN0IGZyYWdtZW50U291cmNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZzJykudGV4dENvbnRlbnQ7XG5cbiAgICAgICAgLy8g44Om44O844K244O85a6a576p44Gu44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OI55Sf5oiQ6Zai5pWwXG4gICAgICAgIGxldCBwcm9ncmFtcyA9IHRoaXMuY3JlYXRlU2hhZGVyUHJvZ3JhbSh2ZXJ0ZXhTb3VyY2UsIGZyYWdtZW50U291cmNlKTtcblxuICAgICAgICAvLyDjg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4jjgavkuInop5LlvaLjga7poILngrnjg4fjg7zjgr/jgpLnmbvpjLJcbiAgICAgICAgbGV0IGF0dExvY2F0aW9uID0gdGhpcy5nbC5nZXRBdHRyaWJMb2NhdGlvbihwcm9ncmFtcywgJ3Bvc2l0aW9uJyk7XG4gICAgICAgIHRoaXMuZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkoYXR0TG9jYXRpb24pO1xuICAgICAgICB0aGlzLmdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYXR0TG9jYXRpb24sIDMsIHRoaXMuZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcblxuICAgICAgICAvLyDmj4/nlLtcbiAgICAgICAgdGhpcy5nbC5kcmF3QXJyYXlzKHRoaXMuZ2wuVFJJQU5HTEVTLCAwLCB0cmlhbmdsZURhdGEucC5sZW5ndGggLyAzKTtcbiAgICAgICAgdGhpcy5nbC5mbHVzaCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNyZWF0ZVNoYWRlclByb2dyYW1cbiAgICAgKiDjg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4jnlJ/miJDplqLmlbBcbiAgICAgKi9cbiAgICBjcmVhdGVTaGFkZXJQcm9ncmFtKHZlcnRleFNvdXJjZSwgZnJhZ21lbnRTb3VyY2UpIHtcblxuICAgICAgICAvLyDjgrfjgqfjg7zjg4Djgqrjg5bjgrjjgqfjgq/jg4jjga7nlJ/miJBcbiAgICAgICAgbGV0IHZlcnRleFNoYWRlciA9IHRoaXMuZ2wuY3JlYXRlU2hhZGVyKHRoaXMuZ2wuVkVSVEVYX1NIQURFUik7XG4gICAgICAgIGxldCBmcmFnbWVudFNoYWRlciA9IHRoaXMuZ2wuY3JlYXRlU2hhZGVyKHRoaXMuZ2wuRlJBR01FTlRfU0hBREVSKTtcblxuICAgICAgICAvLyDjgrfjgqfjg7zjg4Djgavjgr3jg7zjgrnjgpLlibLjgorlvZPjgabjgabjgrPjg7Pjg5HjgqTjg6tcbiAgICAgICAgdGhpcy5nbC5zaGFkZXJTb3VyY2UodmVydGV4U2hhZGVyLCB2ZXJ0ZXhTb3VyY2UpO1xuICAgICAgICB0aGlzLmdsLmNvbXBpbGVTaGFkZXIodmVydGV4U2hhZGVyKTtcbiAgICAgICAgdGhpcy5nbC5zaGFkZXJTb3VyY2UoZnJhZ21lbnRTaGFkZXIsIGZyYWdtZW50U291cmNlKTtcbiAgICAgICAgdGhpcy5nbC5jb21waWxlU2hhZGVyKGZyYWdtZW50U2hhZGVyKTtcblxuICAgICAgICAvLyDjgrfjgqfjg7zjg4Djg7zjgrPjg7Pjg5HjgqTjg6vjga7jgqjjg6njg7zliKTlrppcbiAgICAgICAgaWYgKHRoaXMuZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHZlcnRleFNoYWRlciwgdGhpcy5nbC5DT01QSUxFX1NUQVRVUylcbiAgICAgICAgICAgICYmIHRoaXMuZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKGZyYWdtZW50U2hhZGVyLCB0aGlzLmdsLkNPTVBJTEVfU1RBVFVTKSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1N1Y2Nlc3MgU2hhZGVyIENvbXBpbGUnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdGYWlsZCBTaGFkZXIgQ29tcGlsZScpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3ZlcnRleFNoYWRlcicsIHRoaXMuZ2wuZ2V0U2hhZGVySW5mb0xvZyh2ZXJ0ZXhTaGFkZXIpKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdmcmFnbWVudFNoYWRlcicsIHRoaXMuZ2wuZ2V0U2hhZGVySW5mb0xvZyhmcmFnbWVudFNoYWRlcikpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OI44Gu55Sf5oiQ44GL44KJ6YG45oqe44G+44GnXG4gICAgICAgIGxldCBwcm9ncmFtcyA9IHRoaXMuZ2wuY3JlYXRlUHJvZ3JhbSgpO1xuICAgICAgICB0aGlzLmdsLmF0dGFjaFNoYWRlcihwcm9ncmFtcywgdmVydGV4U2hhZGVyKTtcbiAgICAgICAgdGhpcy5nbC5hdHRhY2hTaGFkZXIocHJvZ3JhbXMsIGZyYWdtZW50U2hhZGVyKTtcbiAgICAgICAgdGhpcy5nbC5saW5rUHJvZ3JhbShwcm9ncmFtcyk7XG4gICAgICAgIHRoaXMuZ2wudXNlUHJvZ3JhbShwcm9ncmFtcyk7XG5cbiAgICAgICAgLy8g55Sf5oiQ44GX44Gf44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OI44KS5oi744KK5YCk44Go44GX44Gm6L+U44GZXG4gICAgICAgIHJldHVybiBwcm9ncmFtcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBnZW5UcmlhbmdsZVxuICAgICAqIOS4ieinkuW9ouOBrumggueCueaDheWgseOCkui/lOWNtOOBmeOCi1xuICAgICAqL1xuICAgIGdlblRyaWFuZ2xlKCkge1xuICAgICAgICBsZXQgb2JqID0ge307XG4gICAgICAgIG9iai5wID0gW1xuICAgICAgICAgICAgLy8g44Gy44Go44Gk55uu44Gu5LiJ6KeS5b2iXG4gICAgICAgICAgICAwLjAsIDAuNSwgMC4wLFxuICAgICAgICAgICAgMC41LCAtMC41LCAwLjAsXG4gICAgICAgICAgICAtMC41LCAtMC41LCAwLjAsXG5cbiAgICAgICAgICAgIC8vIOOBteOBn+OBpOebruOBruS4ieinkuW9olxuICAgICAgICAgICAgMC4wLCAtMC41LCAwLjAsXG4gICAgICAgICAgICAwLjUsIDAuNSwgMC4wLFxuICAgICAgICAgICAgLTAuNSwgMC41LCAwLjBcbiAgICAgICAgXTtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2FtcGxlMjtcblxuIiwiaW1wb3J0IFNhbXBsZTEgZnJvbSBcIi4vU2FtcGxlMVwiO1xuaW1wb3J0IFNhbXBsZTIgZnJvbSBcIi4vU2FtcGxlMlwiO1xuXG53aW5kb3cub25sb2FkID0gZnVuY3Rpb24gKCkge1xuXG4gIGNvbnN0IHNhbXBsZTIgPSBuZXcgU2FtcGxlMigpO1xuICBzYW1wbGUyLnJ1bigpO1xuXG59O1xuXG4iXX0=
