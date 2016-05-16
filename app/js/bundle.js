(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
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

    /**
     * run
     * サンプルコード実行
     */
    value: function run() {

      // canvasへの参上を変数に取得する
      var c = document.getElementById('canvas');

      // size指定
      c.width = 512;
      c.height = 512;

      // WebGLコンテキストをcanvasから取得する
      var gl = c.getContext('webgl') || c.getContext('experimental-webgl');

      // WebGLコンテキストの取得ができたかどうか
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

  return Sample1;
})();

module.exports = Sample1;

},{}],2:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _minMatrix = require("./minMatrix");

/*
 * Sample 2
 */

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
    this.canvas = c;

    //WebGLコンテキストをcanvasから取得する
    this.gl = c.getContext('webgl') || c.getContext('experimental-webgl');

    // 行列計算
    this.mat = null;
    // レンダリング用カウンタ
    this.count = 0;
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
      this.triangleData = this.genTriangle();

      // 頂点データからバッファを生成
      var vertexBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.triangleData.p), this.gl.STATIC_DRAW);

      // シェーダとプログラムオブジェクト
      var vertexSource = document.getElementById('vs').textContent;
      var fragmentSource = document.getElementById('fs').textContent;

      // ユーザー定義のプログラムオブジェクト生成関数
      this.programs = this.createShaderProgram(vertexSource, fragmentSource);

      // プログラムオブジェクトに三角形の頂点データを登録
      var attLocation = this.gl.getAttribLocation(this.programs, 'position');
      this.gl.enableVertexAttribArray(attLocation);
      this.gl.vertexAttribPointer(attLocation, 3, this.gl.FLOAT, false, 0, 0);

      // 行列の初期化
      this.mat = new _minMatrix.matIV();
      this.mMatrix = this.mat.identity(this.mat.create());
      this.vMatrix = this.mat.identity(this.mat.create());
      this.pMatrix = this.mat.identity(this.mat.create());
      this.vpMatrix = this.mat.identity(this.mat.create());
      this.mvpMatrix = this.mat.identity(this.mat.create());

      // ビュー座標変換行列
      var cameraPosition = [0.0, 0.0, 3.0]; // カメラの位置
      var centerPoint = [0.0, 0.0, 0.0]; // 注視点
      var cameraUp = [0.0, 1.0, 0.0]; // カメラの上方向
      this.mat.lookAt(cameraPosition, centerPoint, cameraUp, this.vMatrix);

      // プロジェクションのための情報を揃える
      var fovy = 45; // 視野角
      var aspect = this.canvas.width / this.canvas.height; // アスペクト比
      var near = 0.1; // 空間の最前面
      var far = 10.0; // 空間の奥行き終端
      this.mat.perspective(fovy, aspect, near, far, this.pMatrix);

      // 行列を掛け合わせてVPマトリックスを生成しておく
      this.mat.multiply(this.pMatrix, this.vMatrix, this.vpMatrix); // pにvを掛ける

      // rendering開始
      this.render();
    }

    /**
     * レンダリング関数の定義
     */
  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      // Canvasエレメントをクリアする
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);

      // モデル座標変換行列を一度初期化してリセットする
      this.mat.identity(this.mMatrix);

      // カウンタをインクリメントする
      this.count++;

      // モデル座標変換行列
      // 移動
      var move = [0.5, 0.5, 0.0]; // 移動量はXYそれぞれ0.5
      this.mat.translate(this.mMatrix, move, this.mMatrix);

      // 回転
      var radians = this.count % 360 * Math.PI / 180;
      var axis = [0.0, 0.0, 1.0];
      this.mat.rotate(this.mMatrix, radians, axis, this.mMatrix);

      // 行列を掛け合わせてMVPマトリックスを生成
      this.mat.multiply(this.pMatrix, this.vMatrix, this.vpMatrix); // pにvを掛ける
      this.mat.multiply(this.vpMatrix, this.mMatrix, this.mvpMatrix); // さらにmを掛ける

      // シェーダに行列を送信する
      var uniLocation = this.gl.getUniformLocation(this.programs, 'mvpMatrix');
      this.gl.uniformMatrix4fv(uniLocation, false, this.mvpMatrix);

      // VPマトリックスにモデル座標変換行列を掛ける
      this.mat.multiply(this.vpMatrix, this.mMatrix, this.mvpMatrix);

      // 描画
      this.gl.drawArrays(this.gl.TRIANGLES, 0, this.triangleData.p.length / 3);
      this.gl.flush();

      // 再帰呼び出し
      requestAnimationFrame(function () {
        _this.render();
      });
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

      // プログラムオブジェクトのエラー判定処理
      if (this.gl.getProgramParameter(programs, this.gl.LINK_STATUS)) {
        this.gl.useProgram(programs);
      } else {
        console.log('Failed Link Program', this.gl.getProgramInfoLog(programs));
      }

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

},{"./minMatrix":5}],3:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _minMatrix = require("./minMatrix");

/*
 * Sample 2
 */

var Sample3 = (function () {
  /**
   * constructor
   * コンストラクタ
   */

  function Sample3() {
    _classCallCheck(this, Sample3);

    console.log('Start Sample3');

    //canvasへの参上を変数に取得する
    var c = document.getElementById('canvas');
    // size指定
    c.width = 512;
    c.height = 512;
    this.canvas = c;

    //WebGLコンテキストをcanvasから取得する
    this.gl = c.getContext('webgl') || c.getContext('experimental-webgl');

    // 行列計算
    this.mat = null;
    // レンダリング用カウンタ
    this.count = 0;
  }

  /**
   * run
   * サンプルコード実行
   */

  _createClass(Sample3, [{
    key: 'run',
    value: function run() {

      // WebGLコンテキストの取得ができたかどうか
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

      // シェーダとプログラムオブジェクト
      var vertexSource = document.getElementById('vs').textContent;
      var fragmentSource = document.getElementById('fs').textContent;

      // ユーザー定義のプログラムオブジェクト生成関数
      this.programs = this.createShaderProgram(vertexSource, fragmentSource);

      // 球体を形成する頂点のデータを受け取る
      this.sphereData = (0, _minMatrix.sphere)(16, 16, 1.0);

      // 頂点データからバッファを生成
      /*
      let vertexBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.sphereData.p), this.gl.STATIC_DRAW);
        // プログラムオブジェクトに頂点データを登録
       let attLocation = this.gl.getAttribLocation(this.programs, 'position');
       this.gl.enableVertexAttribArray(attLocation);
       this.gl.vertexAttribPointer(attLocation, 3, this.gl.FLOAT, false, 0, 0);
        */
      // 頂点データからバッファを生成して登録する（頂点座標）
      var vPositionBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vPositionBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.sphereData.p), this.gl.STATIC_DRAW);
      var attLocPosition = this.gl.getAttribLocation(this.programs, 'position');
      this.gl.enableVertexAttribArray(attLocPosition);
      this.gl.vertexAttribPointer(attLocPosition, 3, this.gl.FLOAT, false, 0, 0);

      // 頂点データからバッファを生成して登録する（頂点色）
      var vColorBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vColorBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.sphereData.c), this.gl.STATIC_DRAW);
      var attLocColor = this.gl.getAttribLocation(this.programs, 'color');
      this.gl.enableVertexAttribArray(attLocColor);
      this.gl.vertexAttribPointer(attLocColor, 4, this.gl.FLOAT, false, 0, 0);

      // インデックスバッファの生成
      var indexBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Int16Array(this.sphereData.i), this.gl.STATIC_DRAW);

      // 行列の初期化
      this.mat = new _minMatrix.matIV();
      this.mMatrix = this.mat.identity(this.mat.create());
      this.vMatrix = this.mat.identity(this.mat.create());
      this.pMatrix = this.mat.identity(this.mat.create());
      this.vpMatrix = this.mat.identity(this.mat.create());
      this.mvpMatrix = this.mat.identity(this.mat.create());

      // ビュー座標変換行列
      var cameraPosition = [0.0, 0.0, 3.0]; // カメラの位置
      var centerPoint = [0.0, 0.0, 0.0]; // 注視点
      var cameraUp = [0.0, 1.0, 0.0]; // カメラの上方向
      this.mat.lookAt(cameraPosition, centerPoint, cameraUp, this.vMatrix);

      // プロジェクションのための情報を揃える
      var fovy = 45; // 視野角
      var aspect = this.canvas.width / this.canvas.height; // アスペクト比
      var near = 0.1; // 空間の最前面
      var far = 10.0; // 空間の奥行き終端
      this.mat.perspective(fovy, aspect, near, far, this.pMatrix);

      // 行列を掛け合わせてVPマトリックスを生成しておく
      this.mat.multiply(this.pMatrix, this.vMatrix, this.vpMatrix); // pにvを掛ける

      // rendering開始
      this.render();
    }

    /**
     * レンダリング関数の定義
     */
  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      // Canvasエレメントをクリアする
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);

      // モデル座標変換行列を一度初期化してリセットする
      this.mat.identity(this.mMatrix);

      // カウンタをインクリメントする
      this.count++;

      // モデル座標変換行列
      // 移動
      var move = [0.0, 0.0, 0.0];
      this.mat.translate(this.mMatrix, move, this.mMatrix);

      // 回転
      /*
      let radians = (this.count % 360) * Math.PI / 180;
      let axis = [0.0, 0.0, 1.0];
      this.mat.rotate(this.mMatrix, radians, axis, this.mMatrix);
      */

      // Canvasエレメントをクリアする
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      var radians = this.count % 360 * Math.PI / 180;

      // モデル座標変換行列を一度初期化してリセットする
      this.mat.identity(mMatrix);
      // モデル座標変換行列
      var axis = [0.0, 1.0, 1.0];
      this.mat.rotate(this.mMatrix, radians, axis, this.mMatrix);

      // 行列を掛け合わせてMVPマトリックスを生成
      this.mat.multiply(this.pMatrix, this.vMatrix, this.vpMatrix); // pにvを掛ける
      this.mat.multiply(this.vpMatrix, this.mMatrix, this.mvpMatrix); // さらにmを掛ける

      // シェーダに行列を送信する
      var uniLocation = this.gl.getUniformLocation(this.programs, 'mvpMatrix');
      this.gl.uniformMatrix4fv(uniLocation, false, this.mvpMatrix);

      // VPマトリックスにモデル座標変換行列を掛ける
      this.mat.multiply(this.vpMatrix, this.mMatrix, this.mvpMatrix);

      // 描画
      // this.gl.drawArrays(this.gl.TRIANGLES, 0, this.sphereData.p.length / 3);
      // インデックスバッファによる描画
      this.gl.drawElements(this.gl.TRIANGLES, this.sphereData.i.length, this.gl.UNSIGNED_SHORT, 0);
      this.gl.flush();

      // 再帰呼び出し
      requestAnimationFrame(function () {
        _this.render();
      });
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

      // プログラムオブジェクトのエラー判定処理
      if (this.gl.getProgramParameter(programs, this.gl.LINK_STATUS)) {
        this.gl.useProgram(programs);
      } else {
        console.log('Failed Link Program', this.gl.getProgramInfoLog(programs));
      }

      // 生成したプログラムオブジェクトを戻り値として返す
      return programs;
    }
  }]);

  return Sample3;
})();

module.exports = Sample3;

},{"./minMatrix":5}],4:[function(require,module,exports){
"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _Sample1 = require("./Sample1");

var _Sample12 = _interopRequireDefault(_Sample1);

var _Sample2 = require("./Sample2");

var _Sample22 = _interopRequireDefault(_Sample2);

var _Sample3 = require("./Sample3");

var _Sample32 = _interopRequireDefault(_Sample3);

window.onload = function () {

  var sample3 = new _Sample32["default"]();
  sample3.run();
};

},{"./Sample1":1,"./Sample2":2,"./Sample3":3}],5:[function(require,module,exports){
// ------------------------------------------------------------------------------------------------
// minMatrix.js
// version 0.0.3
// ------------------------------------------------------------------------------------------------

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.torus = torus;
exports.sphere = sphere;
exports.cube = cube;
exports.hsva = hsva;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var matIV = (function () {
    function matIV() {
        _classCallCheck(this, matIV);
    }

    _createClass(matIV, [{
        key: "create",
        value: function create() {
            return new Float32Array(16);
        }
    }, {
        key: "identity",
        value: function identity(dest) {
            dest[0] = 1;
            dest[1] = 0;
            dest[2] = 0;
            dest[3] = 0;
            dest[4] = 0;
            dest[5] = 1;
            dest[6] = 0;
            dest[7] = 0;
            dest[8] = 0;
            dest[9] = 0;
            dest[10] = 1;
            dest[11] = 0;
            dest[12] = 0;
            dest[13] = 0;
            dest[14] = 0;
            dest[15] = 1;
            return dest;
        }
    }, {
        key: "multiply",
        value: function multiply(mat1, mat2, dest) {
            var a = mat1[0],
                b = mat1[1],
                c = mat1[2],
                d = mat1[3],
                e = mat1[4],
                f = mat1[5],
                g = mat1[6],
                h = mat1[7],
                i = mat1[8],
                j = mat1[9],
                k = mat1[10],
                l = mat1[11],
                m = mat1[12],
                n = mat1[13],
                o = mat1[14],
                p = mat1[15],
                A = mat2[0],
                B = mat2[1],
                C = mat2[2],
                D = mat2[3],
                E = mat2[4],
                F = mat2[5],
                G = mat2[6],
                H = mat2[7],
                I = mat2[8],
                J = mat2[9],
                K = mat2[10],
                L = mat2[11],
                M = mat2[12],
                N = mat2[13],
                O = mat2[14],
                P = mat2[15];
            dest[0] = A * a + B * e + C * i + D * m;
            dest[1] = A * b + B * f + C * j + D * n;
            dest[2] = A * c + B * g + C * k + D * o;
            dest[3] = A * d + B * h + C * l + D * p;
            dest[4] = E * a + F * e + G * i + H * m;
            dest[5] = E * b + F * f + G * j + H * n;
            dest[6] = E * c + F * g + G * k + H * o;
            dest[7] = E * d + F * h + G * l + H * p;
            dest[8] = I * a + J * e + K * i + L * m;
            dest[9] = I * b + J * f + K * j + L * n;
            dest[10] = I * c + J * g + K * k + L * o;
            dest[11] = I * d + J * h + K * l + L * p;
            dest[12] = M * a + N * e + O * i + P * m;
            dest[13] = M * b + N * f + O * j + P * n;
            dest[14] = M * c + N * g + O * k + P * o;
            dest[15] = M * d + N * h + O * l + P * p;
            return dest;
        }
    }, {
        key: "scale",
        value: function scale(mat, vec, dest) {
            dest[0] = mat[0] * vec[0];
            dest[1] = mat[1] * vec[0];
            dest[2] = mat[2] * vec[0];
            dest[3] = mat[3] * vec[0];
            dest[4] = mat[4] * vec[1];
            dest[5] = mat[5] * vec[1];
            dest[6] = mat[6] * vec[1];
            dest[7] = mat[7] * vec[1];
            dest[8] = mat[8] * vec[2];
            dest[9] = mat[9] * vec[2];
            dest[10] = mat[10] * vec[2];
            dest[11] = mat[11] * vec[2];
            dest[12] = mat[12];
            dest[13] = mat[13];
            dest[14] = mat[14];
            dest[15] = mat[15];
            return dest;
        }
    }, {
        key: "translate",
        value: function translate(mat, vec, dest) {
            dest[0] = mat[0];
            dest[1] = mat[1];
            dest[2] = mat[2];
            dest[3] = mat[3];
            dest[4] = mat[4];
            dest[5] = mat[5];
            dest[6] = mat[6];
            dest[7] = mat[7];
            dest[8] = mat[8];
            dest[9] = mat[9];
            dest[10] = mat[10];
            dest[11] = mat[11];
            dest[12] = mat[0] * vec[0] + mat[4] * vec[1] + mat[8] * vec[2] + mat[12];
            dest[13] = mat[1] * vec[0] + mat[5] * vec[1] + mat[9] * vec[2] + mat[13];
            dest[14] = mat[2] * vec[0] + mat[6] * vec[1] + mat[10] * vec[2] + mat[14];
            dest[15] = mat[3] * vec[0] + mat[7] * vec[1] + mat[11] * vec[2] + mat[15];
            return dest;
        }
    }, {
        key: "rotate",
        value: function rotate(mat, angle, axis, dest) {
            var sq = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);
            if (!sq) {
                return null;
            }
            var a = axis[0],
                b = axis[1],
                c = axis[2];
            if (sq != 1) {
                sq = 1 / sq;
                a *= sq;
                b *= sq;
                c *= sq;
            }
            var d = Math.sin(angle),
                e = Math.cos(angle),
                f = 1 - e,
                g = mat[0],
                h = mat[1],
                i = mat[2],
                j = mat[3],
                k = mat[4],
                l = mat[5],
                m = mat[6],
                n = mat[7],
                o = mat[8],
                p = mat[9],
                q = mat[10],
                r = mat[11],
                s = a * a * f + e,
                t = b * a * f + c * d,
                u = c * a * f - b * d,
                v = a * b * f - c * d,
                w = b * b * f + e,
                x = c * b * f + a * d,
                y = a * c * f + b * d,
                z = b * c * f - a * d,
                A = c * c * f + e;
            if (angle) {
                if (mat != dest) {
                    dest[12] = mat[12];
                    dest[13] = mat[13];
                    dest[14] = mat[14];
                    dest[15] = mat[15];
                }
            } else {
                dest = mat;
            }
            dest[0] = g * s + k * t + o * u;
            dest[1] = h * s + l * t + p * u;
            dest[2] = i * s + m * t + q * u;
            dest[3] = j * s + n * t + r * u;
            dest[4] = g * v + k * w + o * x;
            dest[5] = h * v + l * w + p * x;
            dest[6] = i * v + m * w + q * x;
            dest[7] = j * v + n * w + r * x;
            dest[8] = g * y + k * z + o * A;
            dest[9] = h * y + l * z + p * A;
            dest[10] = i * y + m * z + q * A;
            dest[11] = j * y + n * z + r * A;
            return dest;
        }
    }, {
        key: "lookAt",
        value: function lookAt(eye, center, up, dest) {
            var eyeX = eye[0],
                eyeY = eye[1],
                eyeZ = eye[2],
                upX = up[0],
                upY = up[1],
                upZ = up[2],
                centerX = center[0],
                centerY = center[1],
                centerZ = center[2];
            if (eyeX == centerX && eyeY == centerY && eyeZ == centerZ) {
                return this.identity(dest);
            }
            var x0 = undefined,
                x1 = undefined,
                x2 = undefined,
                y0 = undefined,
                y1 = undefined,
                y2 = undefined,
                z0 = undefined,
                z1 = undefined,
                z2 = undefined,
                l = undefined;
            z0 = eyeX - center[0];
            z1 = eyeY - center[1];
            z2 = eyeZ - center[2];
            l = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
            z0 *= l;
            z1 *= l;
            z2 *= l;
            x0 = upY * z2 - upZ * z1;
            x1 = upZ * z0 - upX * z2;
            x2 = upX * z1 - upY * z0;
            l = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
            if (!l) {
                x0 = 0;
                x1 = 0;
                x2 = 0;
            } else {
                l = 1 / l;
                x0 *= l;
                x1 *= l;
                x2 *= l;
            }
            y0 = z1 * x2 - z2 * x1;
            y1 = z2 * x0 - z0 * x2;
            y2 = z0 * x1 - z1 * x0;
            l = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
            if (!l) {
                y0 = 0;
                y1 = 0;
                y2 = 0;
            } else {
                l = 1 / l;
                y0 *= l;
                y1 *= l;
                y2 *= l;
            }
            dest[0] = x0;
            dest[1] = y0;
            dest[2] = z0;
            dest[3] = 0;
            dest[4] = x1;
            dest[5] = y1;
            dest[6] = z1;
            dest[7] = 0;
            dest[8] = x2;
            dest[9] = y2;
            dest[10] = z2;
            dest[11] = 0;
            dest[12] = -(x0 * eyeX + x1 * eyeY + x2 * eyeZ);
            dest[13] = -(y0 * eyeX + y1 * eyeY + y2 * eyeZ);
            dest[14] = -(z0 * eyeX + z1 * eyeY + z2 * eyeZ);
            dest[15] = 1;
            return dest;
        }
    }, {
        key: "perspective",
        value: function perspective(fovy, aspect, near, far, dest) {
            var t = near * Math.tan(fovy * Math.PI / 360);
            var r = t * aspect;
            var a = r * 2,
                b = t * 2,
                c = far - near;
            dest[0] = near * 2 / a;
            dest[1] = 0;
            dest[2] = 0;
            dest[3] = 0;
            dest[4] = 0;
            dest[5] = near * 2 / b;
            dest[6] = 0;
            dest[7] = 0;
            dest[8] = 0;
            dest[9] = 0;
            dest[10] = -(far + near) / c;
            dest[11] = -1;
            dest[12] = 0;
            dest[13] = 0;
            dest[14] = -(far * near * 2) / c;
            dest[15] = 0;
            return dest;
        }
    }, {
        key: "ortho",
        value: function ortho(left, right, top, bottom, near, far, dest) {
            var h = right - left;
            var v = top - bottom;
            var d = far - near;
            dest[0] = 2 / h;
            dest[1] = 0;
            dest[2] = 0;
            dest[3] = 0;
            dest[4] = 0;
            dest[5] = 2 / v;
            dest[6] = 0;
            dest[7] = 0;
            dest[8] = 0;
            dest[9] = 0;
            dest[10] = -2 / d;
            dest[11] = 0;
            dest[12] = -(left + right) / h;
            dest[13] = -(top + bottom) / v;
            dest[14] = -(far + near) / d;
            dest[15] = 1;
            return dest;
        }
    }, {
        key: "transpose",
        value: function transpose(mat, dest) {
            dest[0] = mat[0];
            dest[1] = mat[4];
            dest[2] = mat[8];
            dest[3] = mat[12];
            dest[4] = mat[1];
            dest[5] = mat[5];
            dest[6] = mat[9];
            dest[7] = mat[13];
            dest[8] = mat[2];
            dest[9] = mat[6];
            dest[10] = mat[10];
            dest[11] = mat[14];
            dest[12] = mat[3];
            dest[13] = mat[7];
            dest[14] = mat[11];
            dest[15] = mat[15];
            return dest;
        }
    }, {
        key: "inverse",
        value: function inverse(mat, dest) {
            var a = mat[0],
                b = mat[1],
                c = mat[2],
                d = mat[3],
                e = mat[4],
                f = mat[5],
                g = mat[6],
                h = mat[7],
                i = mat[8],
                j = mat[9],
                k = mat[10],
                l = mat[11],
                m = mat[12],
                n = mat[13],
                o = mat[14],
                p = mat[15],
                q = a * f - b * e,
                r = a * g - c * e,
                s = a * h - d * e,
                t = b * g - c * f,
                u = b * h - d * f,
                v = c * h - d * g,
                w = i * n - j * m,
                x = i * o - k * m,
                y = i * p - l * m,
                z = j * o - k * n,
                A = j * p - l * n,
                B = k * p - l * o,
                ivd = 1 / (q * B - r * A + s * z + t * y - u * x + v * w);
            dest[0] = (f * B - g * A + h * z) * ivd;
            dest[1] = (-b * B + c * A - d * z) * ivd;
            dest[2] = (n * v - o * u + p * t) * ivd;
            dest[3] = (-j * v + k * u - l * t) * ivd;
            dest[4] = (-e * B + g * y - h * x) * ivd;
            dest[5] = (a * B - c * y + d * x) * ivd;
            dest[6] = (-m * v + o * s - p * r) * ivd;
            dest[7] = (i * v - k * s + l * r) * ivd;
            dest[8] = (e * A - f * y + h * w) * ivd;
            dest[9] = (-a * A + b * y - d * w) * ivd;
            dest[10] = (m * u - n * s + p * q) * ivd;
            dest[11] = (-i * u + j * s - l * q) * ivd;
            dest[12] = (-e * z + f * x - g * w) * ivd;
            dest[13] = (a * z - b * x + c * w) * ivd;
            dest[14] = (-m * t + n * r - o * q) * ivd;
            dest[15] = (i * t - j * r + k * q) * ivd;
            return dest;
        }
    }]);

    return matIV;
})();

exports.matIV = matIV;

var qtnIV = (function () {
    function qtnIV() {
        _classCallCheck(this, qtnIV);
    }

    _createClass(qtnIV, [{
        key: "create",
        value: function create() {
            return new Float32Array(4);
        }
    }, {
        key: "identity",
        value: function identity(dest) {
            dest[0] = 0;
            dest[1] = 0;
            dest[2] = 0;
            dest[3] = 1;
            return dest;
        }
    }, {
        key: "inverse",
        value: function inverse(qtn, dest) {
            dest[0] = -qtn[0];
            dest[1] = -qtn[1];
            dest[2] = -qtn[2];
            dest[3] = qtn[3];
            return dest;
        }
    }, {
        key: "normalize",
        value: function normalize(dest) {
            var x = dest[0],
                y = dest[1],
                z = dest[2],
                w = dest[3];
            var l = Math.sqrt(x * x + y * y + z * z + w * w);
            if (l === 0) {
                dest[0] = 0;
                dest[1] = 0;
                dest[2] = 0;
                dest[3] = 0;
            } else {
                l = 1 / l;
                dest[0] = x * l;
                dest[1] = y * l;
                dest[2] = z * l;
                dest[3] = w * l;
            }
            return dest;
        }
    }, {
        key: "multiply",
        value: function multiply(qtn1, qtn2, dest) {
            var ax = qtn1[0],
                ay = qtn1[1],
                az = qtn1[2],
                aw = qtn1[3];
            var bx = qtn2[0],
                by = qtn2[1],
                bz = qtn2[2],
                bw = qtn2[3];
            dest[0] = ax * bw + aw * bx + ay * bz - az * by;
            dest[1] = ay * bw + aw * by + az * bx - ax * bz;
            dest[2] = az * bw + aw * bz + ax * by - ay * bx;
            dest[3] = aw * bw - ax * bx - ay * by - az * bz;
            return dest;
        }
    }, {
        key: "rotate",
        value: function rotate(angle, axis, dest) {
            var sq = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);
            if (!sq) {
                return null;
            }
            var a = axis[0],
                b = axis[1],
                c = axis[2];
            if (sq != 1) {
                sq = 1 / sq;
                a *= sq;
                b *= sq;
                c *= sq;
            }
            var s = Math.sin(angle * 0.5);
            dest[0] = a * s;
            dest[1] = b * s;
            dest[2] = c * s;
            dest[3] = Math.cos(angle * 0.5);
            return dest;
        }
    }, {
        key: "toVecIII",
        value: function toVecIII(vec, qtn, dest) {
            var qp = this.create();
            var qq = this.create();
            var qr = this.create();
            this.inverse(qtn, qr);
            qp[0] = vec[0];
            qp[1] = vec[1];
            qp[2] = vec[2];
            this.multiply(qr, qp, qq);
            this.multiply(qq, qtn, qr);
            dest[0] = qr[0];
            dest[1] = qr[1];
            dest[2] = qr[2];
            return dest;
        }
    }, {
        key: "toMatIV",
        value: function toMatIV(qtn, dest) {
            var x = qtn[0],
                y = qtn[1],
                z = qtn[2],
                w = qtn[3];
            var x2 = x + x,
                y2 = y + y,
                z2 = z + z;
            var xx = x * x2,
                xy = x * y2,
                xz = x * z2;
            var yy = y * y2,
                yz = y * z2,
                zz = z * z2;
            var wx = w * x2,
                wy = w * y2,
                wz = w * z2;
            dest[0] = 1 - (yy + zz);
            dest[1] = xy - wz;
            dest[2] = xz + wy;
            dest[3] = 0;
            dest[4] = xy + wz;
            dest[5] = 1 - (xx + zz);
            dest[6] = yz - wx;
            dest[7] = 0;
            dest[8] = xz - wy;
            dest[9] = yz + wx;
            dest[10] = 1 - (xx + yy);
            dest[11] = 0;
            dest[12] = 0;
            dest[13] = 0;
            dest[14] = 0;
            dest[15] = 1;
            return dest;
        }
    }, {
        key: "slerp",
        value: function slerp(qtn1, qtn2, time, dest) {
            var ht = qtn1[0] * qtn2[0] + qtn1[1] * qtn2[1] + qtn1[2] * qtn2[2] + qtn1[3] * qtn2[3];
            var hs = 1.0 - ht * ht;
            if (hs <= 0.0) {
                dest[0] = qtn1[0];
                dest[1] = qtn1[1];
                dest[2] = qtn1[2];
                dest[3] = qtn1[3];
            } else {
                hs = Math.sqrt(hs);
                if (Math.abs(hs) < 0.0001) {
                    dest[0] = qtn1[0] * 0.5 + qtn2[0] * 0.5;
                    dest[1] = qtn1[1] * 0.5 + qtn2[1] * 0.5;
                    dest[2] = qtn1[2] * 0.5 + qtn2[2] * 0.5;
                    dest[3] = qtn1[3] * 0.5 + qtn2[3] * 0.5;
                } else {
                    var ph = Math.acos(ht);
                    var pt = ph * time;
                    var t0 = Math.sin(ph - pt) / hs;
                    var t1 = Math.sin(pt) / hs;
                    dest[0] = qtn1[0] * t0 + qtn2[0] * t1;
                    dest[1] = qtn1[1] * t0 + qtn2[1] * t1;
                    dest[2] = qtn1[2] * t0 + qtn2[2] * t1;
                    dest[3] = qtn1[3] * t0 + qtn2[3] * t1;
                }
            }
            return dest;
        }
    }]);

    return qtnIV;
})();

exports.qtnIV = qtnIV;

function torus(row, column, irad, orad, color) {
    var i = undefined,
        j = undefined,
        tc = undefined;
    var pos = new Array(),
        nor = new Array(),
        col = new Array(),
        st = new Array(),
        idx = new Array();
    for (i = 0; i <= row; i++) {
        var _r = Math.PI * 2 / row * i;
        var rr = Math.cos(_r);
        var ry = Math.sin(_r);
        for (j = 0; j <= column; j++) {
            var tr = Math.PI * 2 / column * j;
            var tx = (rr * irad + orad) * Math.cos(tr);
            var ty = ry * irad;
            var tz = (rr * irad + orad) * Math.sin(tr);
            var rx = rr * Math.cos(tr);
            var rz = rr * Math.sin(tr);
            if (color) {
                tc = color;
            } else {
                tc = hsva(360 / column * j, 1, 1, 1);
            }
            var rs = 1 / column * j;
            var rt = 1 / row * i + 0.5;
            if (rt > 1.0) {
                rt -= 1.0;
            }
            rt = 1.0 - rt;
            pos.push(tx, ty, tz);
            nor.push(rx, ry, rz);
            col.push(tc[0], tc[1], tc[2], tc[3]);
            st.push(rs, rt);
        }
    }
    for (i = 0; i < row; i++) {
        for (j = 0; j < column; j++) {
            r = (column + 1) * i + j;
            idx.push(r, r + column + 1, r + 1);
            idx.push(r + column + 1, r + column + 2, r + 1);
        }
    }
    return { p: pos, n: nor, c: col, t: st, i: idx };
}

/**
 * 球体の頂点データ生成
 * @param row
 * @param column
 * @param rad
 * @param color
 * @returns {{p: Array, n: Array, c: Array, t: Array, i: Array}}
 */

function sphere(row, column, rad, color) {
    var i = undefined,
        j = undefined,
        tc = undefined;
    var pos = new Array(),
        nor = new Array(),
        col = new Array(),
        st = new Array(),
        idx = new Array();
    for (i = 0; i <= row; i++) {
        var _r2 = Math.PI / row * i;
        var ry = Math.cos(_r2);
        var rr = Math.sin(_r2);
        for (j = 0; j <= column; j++) {
            var tr = Math.PI * 2 / column * j;
            var tx = rr * rad * Math.cos(tr);
            var ty = ry * rad;
            var tz = rr * rad * Math.sin(tr);
            var rx = rr * Math.cos(tr);
            var rz = rr * Math.sin(tr);
            if (color) {
                tc = color;
            } else {
                tc = hsva(360 / row * i, 1, 1, 1);
            }
            pos.push(tx, ty, tz);
            nor.push(rx, ry, rz);
            col.push(tc[0], tc[1], tc[2], tc[3]);
            st.push(1 - 1 / column * j, 1 / row * i);
        }
    }
    var r = 0;
    for (i = 0; i < row; i++) {
        for (j = 0; j < column; j++) {
            r = (column + 1) * i + j;
            idx.push(r, r + 1, r + column + 2);
            idx.push(r, r + column + 2, r + column + 1);
        }
    }
    return { p: pos, n: nor, c: col, t: st, i: idx };
}

function cube(side, color) {
    var tc = undefined,
        hs = side * 0.5;
    var pos = [-hs, -hs, hs, hs, -hs, hs, hs, hs, hs, -hs, hs, hs, -hs, -hs, -hs, -hs, hs, -hs, hs, hs, -hs, hs, -hs, -hs, -hs, hs, -hs, -hs, hs, hs, hs, hs, hs, hs, hs, -hs, -hs, -hs, -hs, hs, -hs, -hs, hs, -hs, hs, -hs, -hs, hs, hs, -hs, -hs, hs, hs, -hs, hs, hs, hs, hs, -hs, hs, -hs, -hs, -hs, -hs, -hs, hs, -hs, hs, hs, -hs, hs, -hs];
    var nor = [-1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0];
    var col = new Array();
    for (var i = 0; i < pos.length / 3; i++) {
        if (color) {
            tc = color;
        } else {
            tc = hsva(360 / pos.length / 3 * i, 1, 1, 1);
        }
        col.push(tc[0], tc[1], tc[2], tc[3]);
    }
    var st = [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0];
    var idx = [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23];
    return { p: pos, n: nor, c: col, t: st, i: idx };
}

function hsva(h, s, v, a) {
    if (s > 1 || v > 1 || a > 1) {
        return;
    }
    var th = h % 360;
    var i = Math.floor(th / 60);
    var f = th / 60 - i;
    var m = v * (1 - s);
    var n = v * (1 - s * f);
    var k = v * (1 - s * (1 - f));
    var color = new Array();
    if (!s > 0 && !s < 0) {
        color.push(v, v, v, a);
    } else {
        var _r3 = new Array(v, n, m, m, k, v);
        var g = new Array(k, v, v, n, m, m);
        var b = new Array(m, m, k, v, v, n);
        color.push(_r3[i], g[i], b[i], a);
    }
    return color;
}

},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYjA3MDk3L3dvcmtzcGFjZS92ZXJ5dGlyZWQvcmF3LXdlYmdsLXNhbXBsZS9zcmMvU2FtcGxlMS5qcyIsIi9Vc2Vycy9iMDcwOTcvd29ya3NwYWNlL3Zlcnl0aXJlZC9yYXctd2ViZ2wtc2FtcGxlL3NyYy9TYW1wbGUyLmpzIiwiL1VzZXJzL2IwNzA5Ny93b3Jrc3BhY2UvdmVyeXRpcmVkL3Jhdy13ZWJnbC1zYW1wbGUvc3JjL1NhbXBsZTMuanMiLCIvVXNlcnMvYjA3MDk3L3dvcmtzcGFjZS92ZXJ5dGlyZWQvcmF3LXdlYmdsLXNhbXBsZS9zcmMvaW5kZXguanMiLCIvVXNlcnMvYjA3MDk3L3dvcmtzcGFjZS92ZXJ5dGlyZWQvcmF3LXdlYmdsLXNhbXBsZS9zcmMvbWluTWF0cml4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7SUNLTSxPQUFPO1dBQVAsT0FBTzswQkFBUCxPQUFPOzs7ZUFBUCxPQUFPOzs7Ozs7O1dBTVIsZUFBRzs7O0FBR0osVUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7O0FBRzFDLE9BQUMsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO0FBQ2QsT0FBQyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7OztBQUdmLFVBQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDOzs7QUFHdkUsVUFBSSxFQUFFLEVBQUU7QUFDTixlQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7T0FDL0IsTUFBTTtBQUNMLGVBQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUNuQyxlQUFNO09BQ1A7OztBQUdELFFBQUUsQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7OztBQUdsQyxRQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOzs7QUFHOUIsVUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDOzs7QUFHdEMsVUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQ3JDLFFBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxZQUFZLENBQUMsQ0FBQztBQUM3QyxRQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsSUFBSSxZQUFZLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQzs7O0FBR2pGLFVBQUksWUFBWSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDO0FBQzdELFVBQUksY0FBYyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDO0FBQy9ELFVBQUksWUFBWSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3JELFVBQUksY0FBYyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pELFVBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQzs7QUFFbEMsUUFBRSxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDNUMsUUFBRSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUMvQixRQUFFLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQztBQUN4QyxRQUFFLENBQUMsWUFBWSxDQUFDLGNBQWMsRUFBRSxjQUFjLENBQUMsQ0FBQztBQUNoRCxRQUFFLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ2pDLFFBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0FBQzFDLFFBQUUsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDekIsUUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7O0FBR3hCLFVBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDN0QsUUFBRSxDQUFDLHVCQUF1QixDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3hDLFFBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7O0FBRzlELFFBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDMUQsUUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQ1o7Ozs7Ozs7O1dBTVUsdUJBQUc7QUFDWixVQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFDYixTQUFHLENBQUMsQ0FBQyxHQUFHOztBQUVOLFNBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUNiLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQ2QsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRzs7O0FBR2YsU0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFDZCxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFDYixDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUNmLENBQUM7QUFDRixhQUFPLEdBQUcsQ0FBQztLQUNaOzs7U0FwRkcsT0FBTzs7O0FBdUZiLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDOzs7Ozs7Ozs7eUJDNUY2QixhQUFhOzs7Ozs7SUFLN0QsT0FBTzs7Ozs7O0FBS0EsV0FMUCxPQUFPLEdBS0c7MEJBTFYsT0FBTzs7O0FBUVQsUUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFMUMsS0FBQyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDZCxLQUFDLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztBQUNmLFFBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDOzs7QUFHaEIsUUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsQ0FBQzs7O0FBR3RFLFFBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDOztBQUVoQixRQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztHQUNoQjs7Ozs7OztlQXJCRyxPQUFPOztXQTJCUixlQUFHOzs7QUFHSixVQUFJLElBQUksQ0FBQyxFQUFFLEVBQUU7QUFDWCxlQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7T0FDL0IsTUFBTTtBQUNMLGVBQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUNuQyxlQUFNO09BQ1A7OztBQUdELFVBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDOzs7QUFHdkMsVUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOzs7QUFHeEMsVUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7OztBQUd2QyxVQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQzFDLFVBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQ3ZELFVBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQzs7O0FBR3JHLFVBQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDO0FBQy9ELFVBQU0sY0FBYyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDOzs7QUFHakUsVUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsWUFBWSxFQUFFLGNBQWMsQ0FBQyxDQUFDOzs7QUFHdkUsVUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZFLFVBQUksQ0FBQyxFQUFFLENBQUMsdUJBQXVCLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDN0MsVUFBSSxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7OztBQUd4RSxVQUFJLENBQUMsR0FBRyxHQUFHLHNCQUFXLENBQUM7QUFDdkIsVUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDcEQsVUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDcEQsVUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDcEQsVUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDckQsVUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7OztBQUd0RCxVQUFJLGNBQWMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDckMsVUFBSSxXQUFXLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ2xDLFVBQUksUUFBUSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUMvQixVQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7OztBQUdyRSxVQUFJLElBQUksR0FBRyxFQUFFLENBQUM7QUFDZCxVQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUNwRCxVQUFJLElBQUksR0FBRyxHQUFHLENBQUM7QUFDZixVQUFJLEdBQUcsR0FBRyxJQUFJLENBQUM7QUFDZixVQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDOzs7QUFHNUQsVUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzs7O0FBRzdELFVBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUNmOzs7Ozs7O1dBS0ssa0JBQUc7Ozs7QUFHUCxVQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLENBQUM7OztBQUd4QyxVQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7OztBQUdoQyxVQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7Ozs7QUFJYixVQUFJLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDM0IsVUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDOzs7QUFHckQsVUFBSSxPQUFPLEdBQUcsQUFBQyxJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsR0FBSSxJQUFJLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQztBQUNqRCxVQUFJLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDM0IsVUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzs7O0FBSTNELFVBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDN0QsVUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzs7O0FBRy9ELFVBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUN6RSxVQUFJLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDOzs7QUFHN0QsVUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzs7O0FBRy9ELFVBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDekUsVUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQzs7O0FBR2hCLDJCQUFxQixDQUFDLFlBQUs7QUFDekIsY0FBSyxNQUFNLEVBQUUsQ0FBQztPQUNmLENBQUMsQ0FBQztLQUNKOzs7Ozs7OztXQU1rQiw2QkFBQyxZQUFZLEVBQUUsY0FBYyxFQUFFOzs7QUFHaEQsVUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUMvRCxVQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDOzs7QUFHbkUsVUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQ2pELFVBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3BDLFVBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLGNBQWMsRUFBRSxjQUFjLENBQUMsQ0FBQztBQUNyRCxVQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQzs7O0FBR3RDLFVBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsSUFDL0QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsRUFBRTtBQUN2RSxlQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7T0FDdkMsTUFBTTtBQUNMLGVBQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUNwQyxlQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7QUFDcEUsZUFBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7T0FDekU7OztBQUdELFVBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUM7O0FBRXpDLFVBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQztBQUM3QyxVQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFDL0MsVUFBSSxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7OztBQUc5QixVQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsbUJBQW1CLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUU7QUFDOUQsWUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7T0FDOUIsTUFBTTtBQUNMLGVBQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO09BQ3pFOzs7QUFHRCxhQUFPLFFBQVEsQ0FBQztLQUNqQjs7Ozs7Ozs7V0FNVSx1QkFBRztBQUNaLFVBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUNiLFNBQUcsQ0FBQyxDQUFDLEdBQUc7O0FBRU4sU0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQ2IsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFDZCxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHOzs7QUFHZixTQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUNkLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUNiLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQ2YsQ0FBQztBQUNGLGFBQU8sR0FBRyxDQUFDO0tBQ1o7OztTQXZNRyxPQUFPOzs7QUEwTWIsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7Ozs7Ozs7Ozt5QkMvTTZCLGFBQWE7Ozs7OztJQUs3RCxPQUFPOzs7Ozs7QUFLQSxXQUxQLE9BQU8sR0FLRzswQkFMVixPQUFPOztBQU9ULFdBQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7OztBQUc3QixRQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUUxQyxLQUFDLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztBQUNkLEtBQUMsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO0FBQ2YsUUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7OztBQUdoQixRQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDOzs7QUFHdEUsUUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7O0FBRWhCLFFBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0dBQ2hCOzs7Ozs7O2VBdkJHLE9BQU87O1dBNkJSLGVBQUc7OztBQUdKLFVBQUksSUFBSSxDQUFDLEVBQUUsRUFBRTtBQUNYLGVBQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztPQUMvQixNQUFNO0FBQ0wsZUFBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQ25DLGVBQU07T0FDUDs7O0FBR0QsVUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7OztBQUd2QyxVQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLENBQUM7OztBQUd4QyxVQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQztBQUMvRCxVQUFNLGNBQWMsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQzs7O0FBR2pFLFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFlBQVksRUFBRSxjQUFjLENBQUMsQ0FBQzs7O0FBR3ZFLFVBQUksQ0FBQyxVQUFVLEdBQUcsdUJBQU8sRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7OztBQWV0QyxVQUFJLGVBQWUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQzdDLFVBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBQzFELFVBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNuRyxVQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDMUUsVUFBSSxDQUFDLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNoRCxVQUFJLENBQUMsRUFBRSxDQUFDLG1CQUFtQixDQUFDLGNBQWMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7O0FBRzNFLFVBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDMUMsVUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDdkQsVUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ25HLFVBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNwRSxVQUFJLENBQUMsRUFBRSxDQUFDLHVCQUF1QixDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQzdDLFVBQUksQ0FBQyxFQUFFLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOzs7QUFHeEUsVUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUN6QyxVQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLG9CQUFvQixFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQzlELFVBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDOzs7QUFHekcsVUFBSSxDQUFDLEdBQUcsR0FBRyxzQkFBVyxDQUFDO0FBQ3ZCLFVBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQ3BELFVBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQ3BELFVBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQ3BELFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQ3JELFVBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDOzs7QUFHdEQsVUFBSSxjQUFjLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3JDLFVBQUksV0FBVyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNsQyxVQUFJLFFBQVEsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDL0IsVUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDOzs7QUFHckUsVUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ2QsVUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDcEQsVUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDO0FBQ2YsVUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDO0FBQ2YsVUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzs7O0FBRzVELFVBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7OztBQUc3RCxVQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDZjs7Ozs7OztXQUtLLGtCQUFHOzs7O0FBR1AsVUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOzs7QUFHeEMsVUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDOzs7QUFHaEMsVUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDOzs7O0FBSWIsVUFBSSxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzNCLFVBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzs7Ozs7Ozs7OztBQVVyRCxRQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7QUFFcEQsVUFBSSxPQUFPLEdBQUcsQUFBQyxJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsR0FBSSxJQUFJLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQzs7O0FBR2pELFVBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUUzQixVQUFJLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDM0IsVUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzs7O0FBRzNELFVBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDN0QsVUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzs7O0FBRy9ELFVBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUN6RSxVQUFJLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDOzs7QUFHN0QsVUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzs7Ozs7QUFLL0QsVUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzdGLFVBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7OztBQUdoQiwyQkFBcUIsQ0FBQyxZQUFLO0FBQ3pCLGNBQUssTUFBTSxFQUFFLENBQUM7T0FDZixDQUFDLENBQUM7S0FDSjs7Ozs7Ozs7V0FNa0IsNkJBQUMsWUFBWSxFQUFFLGNBQWMsRUFBRTs7O0FBR2hELFVBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDL0QsVUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQzs7O0FBR25FLFVBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxZQUFZLENBQUMsQ0FBQztBQUNqRCxVQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNwQyxVQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFDckQsVUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7OztBQUd0QyxVQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLElBQy9ELElBQUksQ0FBQyxFQUFFLENBQUMsa0JBQWtCLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLEVBQUU7QUFDdkUsZUFBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO09BQ3ZDLE1BQU07QUFDTCxlQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFDcEMsZUFBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0FBQ3BFLGVBQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO09BQ3pFOzs7QUFHRCxVQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDOztBQUV6QyxVQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDN0MsVUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0FBQy9DLFVBQUksQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDOzs7QUFHOUIsVUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFFO0FBQzlELFlBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO09BQzlCLE1BQU07QUFDTCxlQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztPQUN6RTs7O0FBR0QsYUFBTyxRQUFRLENBQUM7S0FDakI7OztTQTFORyxPQUFPOzs7QUE2TmIsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7Ozs7Ozs7dUJDbE9MLFdBQVc7Ozs7dUJBQ1gsV0FBVzs7Ozt1QkFDWCxXQUFXOzs7O0FBRS9CLE1BQU0sQ0FBQyxNQUFNLEdBQUcsWUFBWTs7QUFFMUIsTUFBTSxPQUFPLEdBQUcsMEJBQWEsQ0FBQztBQUM5QixTQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7Q0FFZixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQ0pXLEtBQUs7YUFBTCxLQUFLOzhCQUFMLEtBQUs7OztpQkFBTCxLQUFLOztlQUNQLGtCQUFHO0FBQ04sbUJBQU8sSUFBSSxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDL0I7OztlQUNRLGtCQUFDLElBQUksRUFBRTtBQUNaLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ1osZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDWixnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNaLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ1osZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDWixnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNaLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ1osZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDWixnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNaLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ1osZ0JBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDYixnQkFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNiLGdCQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2IsZ0JBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDYixnQkFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNiLGdCQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2IsbUJBQU8sSUFBSSxDQUFDO1NBQ2Y7OztlQUNRLGtCQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFO0FBQ3hCLGdCQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNsRCxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDbEQsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7Z0JBQ3BELENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO2dCQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO2dCQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO2dCQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO2dCQUN0RCxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDbEQsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ2xELENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO2dCQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO2dCQUNwRCxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztnQkFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztnQkFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztnQkFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzNELGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN4QyxnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDeEMsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3hDLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN4QyxnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDeEMsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3hDLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN4QyxnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDeEMsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3hDLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN4QyxnQkFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDekMsZ0JBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3pDLGdCQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN6QyxnQkFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDekMsZ0JBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3pDLGdCQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN6QyxtQkFBTyxJQUFJLENBQUM7U0FDZjs7O2VBQ0ssZUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRTtBQUNuQixnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUIsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFCLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQixnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUIsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFCLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQixnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUIsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFCLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQixnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUIsZ0JBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzVCLGdCQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1QixnQkFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNuQixnQkFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNuQixnQkFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNuQixnQkFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNuQixtQkFBTyxJQUFJLENBQUM7U0FDZjs7O2VBQ1MsbUJBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUU7QUFDdkIsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakIsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakIsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakIsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakIsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakIsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakIsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakIsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakIsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakIsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakIsZ0JBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDbkIsZ0JBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDbkIsZ0JBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDekUsZ0JBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDekUsZ0JBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMs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LENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakIsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDbEIsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakIsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakIsZ0JBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDbkIsZ0JBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDbkIsZ0JBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEIsZ0JBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEIsZ0JBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDbkIsZ0JBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDbkIsbUJBQU8sSUFBSSxDQUFDO1NBQ2Y7OztlQUNPLGlCQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUU7QUFDaEIsZ0JBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQzlDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUM5QyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQztnQkFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQztnQkFDaEQsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUM7Z0JBQ2xELENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO2dCQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO2dCQUNwQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztnQkFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztnQkFDcEMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7Z0JBQ3BDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO2dCQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO2dCQUNwQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztnQkFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztnQkFDcEMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7Z0JBQ3BDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxDQUFDO0FBQzlELGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQSxHQUFJLEdBQUcsQ0FBQztBQUN6QyxnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQSxHQUFJLEdBQUcsQ0FBQztBQUN6QyxnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUEsR0FBSSxHQUFHLENBQUM7QUFDekMsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUEsR0FBSSxHQUFHLENBQUM7QUFDekMsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUEsR0FBSSxHQUFHLENBQUM7QUFDekMsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksR0FBRyxDQUFDO0FBQ3pDLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksR0FBRyxDQUFDO0FBQ3pDLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQSxHQUFJLEdBQUcsQ0FBQztBQUN6QyxnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUEsR0FBSSxHQUFHLENBQUM7QUFDekMsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUEsR0FBSSxHQUFHLENBQUM7QUFDekMsZ0JBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksR0FBRyxDQUFDO0FBQzFDLGdCQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksR0FBRyxDQUFDO0FBQzFDLGdCQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksR0FBRyxDQUFDO0FBQzFDLGdCQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQSxHQUFJLEdBQUcsQ0FBQztBQUMxQyxnQkFBSSxDQUFDLEVBQUUsQ0FBQyxH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QyxDQUFDO2dCQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDM0QsZ0JBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzRCxnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDaEQsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ2hELGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNoRCxnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDaEQsbUJBQU8sSUFBSSxDQUFDO1NBQ2Y7OztlQUNNLGdCQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFO0FBQ3ZCLGdCQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENB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LEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQUFBQyxDQUFDO0FBQzFDLHdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxBQUFDLENBQUM7QUFDMUMsd0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEFBQUMsQ0FBQztBQUMxQyx3QkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQUFBQyxDQUFDO2lCQUM3QyxNQUFNO0FBQ0gsd0JBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDdkIsd0JBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUM7QUFDbkIsd0JBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNoQyx3QkFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDM0Isd0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDdEMsd0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDdEMsd0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FB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QUMsQ0FBQztDQUNsRDs7QUFFTSxTQUFTLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQzlCLFFBQUksRUFBRSxZQUFBO1FBQUUsRUFBRSxHQUFHLElBQUksR0FBRyxHQUFHLENBQUM7QUFDeEIsUUFBSSxHQUFHLEdBQUcsQ0FDTixDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUNsRCxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQ3RELENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQ2xELENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFDdEQsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFDbEQsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUN6RCxDQUFDO0FBQ0YsUUFBSSxHQUFHLEdBQUcsQ0FDTixDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUM5RCxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQ2xFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQzlELENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFDbEUsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFDOUQsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUNyRSxDQUFDO0FBQ0YsUUFBSSxHQUFHLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztBQUN0QixTQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDckMsWUFBSSxLQUFLLEVBQUU7QUFDUCxjQUFFLEdBQUcsS0FBSyxDQUFDO1NBQ2QsTUFBTTtBQUNILGNBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ2hEO0FBQ0QsV0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN4QztBQUNELFFBQUksRUFBRSxHQUFHLENBQ0wsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFDdEMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFDdEMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFDdEMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFDdEMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFDdEMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FDekMsQ0FBQztBQUNGLFFBQUksR0FBRyxHQUFHLENBQ04sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQ2hCLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUNoQixDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFDbkIsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQ3RCLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUN0QixFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FDekIsQ0FBQztBQUNGLFdBQU8sRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUMsQ0FBQztDQUNsRDs7QUFFTSxTQUFTLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDN0IsUUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUN6QixlQUFPO0tBQ1Y7QUFDRCxRQUFJLEVBQUUsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQ2pCLFFBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQzVCLFFBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3BCLFFBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsQ0FBQztBQUNwQixRQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxDQUFDO0FBQ3hCLFFBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxDQUFBLEFBQUMsQ0FBQztBQUM5QixRQUFJLEtBQUssR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO0FBQ3hCLFFBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUNsQixhQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQzFCLE1BQU07QUFDSCxZQUFJLEdBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3BDLFlBQUksQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDcEMsWUFBSSxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNwQyxhQUFLLENBQUMsSUFBSSxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ25DO0FBQ0QsV0FBTyxLQUFLLENBQUM7Q0FDaEIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4qIFNhbXBsZSAxXG4qIOeUn1dlYkdM44KS6KiY6L+w44GX44Gm5LiJ6KeS5b2i44KS6KGo56S644GV44Gb44KLXG4qL1xuXG5jbGFzcyBTYW1wbGUxIHtcblxuICAvKipcbiAgICogcnVuXG4gICAqIOOCteODs+ODl+ODq+OCs+ODvOODieWun+ihjFxuICAgKi9cbiAgcnVuKCkge1xuXG4gICAgLy8gY2FudmFz44G444Gu5Y+C5LiK44KS5aSJ5pWw44Gr5Y+W5b6X44GZ44KLXG4gICAgbGV0IGMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJyk7XG5cbiAgICAvLyBzaXpl5oyH5a6aXG4gICAgYy53aWR0aCA9IDUxMjtcbiAgICBjLmhlaWdodCA9IDUxMjtcblxuICAgIC8vIFdlYkdM44Kz44Oz44OG44Kt44K544OI44KSY2FudmFz44GL44KJ5Y+W5b6X44GZ44KLXG4gICAgY29uc3QgZ2wgPSBjLmdldENvbnRleHQoJ3dlYmdsJykgfHwgYy5nZXRDb250ZXh0KCdleHBlcmltZW50YWwtd2ViZ2wnKTtcblxuICAgIC8vIFdlYkdM44Kz44Oz44OG44Kt44K544OI44Gu5Y+W5b6X44GM44Gn44GN44Gf44GL44Gp44GG44GLXG4gICAgaWYgKGdsKSB7XG4gICAgICBjb25zb2xlLmxvZygnc3VwcG9ydHMgd2ViZ2wnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ3dlYmdsIG5vdCBzdXBwb3J0ZWQnKTtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIOOCr+ODquOCouOBmeOCi+iJsuOCkuaMh+WumlxuICAgIGdsLmNsZWFyQ29sb3IoMC4wLCAwLjAsIDAuMCwgMS4wKTtcblxuICAgIC8vIOOCqOODrOODoeODs+ODiOOCkuOCr+ODquOColxuICAgIGdsLmNsZWFyKGdsLkNPTE9SX0JVRkZFUl9CSVQpO1xuXG4gICAgLy8g5LiJ6KeS5b2i44KS5b2i5oiQ44GZ44KL6aCC54K544Gu44OH44O844K/44KS5Y+X44GR5Y+W44KLXG4gICAgbGV0IHRyaWFuZ2xlRGF0YSA9IHRoaXMuZ2VuVHJpYW5nbGUoKTtcblxuICAgIC8vIOmggueCueODh+ODvOOCv+OBi+OCieODkOODg+ODleOCoeOCkueUn+aIkFxuICAgIGxldCB2ZXJ0ZXhCdWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKTtcbiAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdmVydGV4QnVmZmVyKTtcbiAgICBnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgbmV3IEZsb2F0MzJBcnJheSh0cmlhbmdsZURhdGEucCksIGdsLlNUQVRJQ19EUkFXKTtcblxuICAgIC8vIOOCt+OCp+ODvOODgOOBqOODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiFxuICAgIGxldCB2ZXJ0ZXhTb3VyY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndnMnKS50ZXh0Q29udGVudDtcbiAgICBsZXQgZnJhZ21lbnRTb3VyY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZnMnKS50ZXh0Q29udGVudDtcbiAgICBsZXQgdmVydGV4U2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKGdsLlZFUlRFWF9TSEFERVIpO1xuICAgIGxldCBmcmFnbWVudFNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcihnbC5GUkFHTUVOVF9TSEFERVIpO1xuICAgIGxldCBwcm9ncmFtcyA9IGdsLmNyZWF0ZVByb2dyYW0oKTtcblxuICAgIGdsLnNoYWRlclNvdXJjZSh2ZXJ0ZXhTaGFkZXIsIHZlcnRleFNvdXJjZSk7XG4gICAgZ2wuY29tcGlsZVNoYWRlcih2ZXJ0ZXhTaGFkZXIpO1xuICAgIGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtcywgdmVydGV4U2hhZGVyKTtcbiAgICBnbC5zaGFkZXJTb3VyY2UoZnJhZ21lbnRTaGFkZXIsIGZyYWdtZW50U291cmNlKTtcbiAgICBnbC5jb21waWxlU2hhZGVyKGZyYWdtZW50U2hhZGVyKTtcbiAgICBnbC5hdHRhY2hTaGFkZXIocHJvZ3JhbXMsIGZyYWdtZW50U2hhZGVyKTtcbiAgICBnbC5saW5rUHJvZ3JhbShwcm9ncmFtcyk7XG4gICAgZ2wudXNlUHJvZ3JhbShwcm9ncmFtcyk7XG5cbiAgICAvLyDjg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4jjgavkuInop5LlvaLjga7poILngrnjg4fjg7zjgr/jgpLnmbvpjLJcbiAgICBsZXQgYXR0TG9jYXRpb24gPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihwcm9ncmFtcywgJ3Bvc2l0aW9uJyk7XG4gICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkoYXR0TG9jYXRpb24pO1xuICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYXR0TG9jYXRpb24sIDMsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XG5cbiAgICAvLyDmj4/nlLtcbiAgICBnbC5kcmF3QXJyYXlzKGdsLlRSSUFOR0xFUywgMCwgdHJpYW5nbGVEYXRhLnAubGVuZ3RoIC8gMyk7XG4gICAgZ2wuZmx1c2goKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBnZW5UcmlhbmdsZVxuICAgKiDkuInop5LlvaLjga7poILngrnmg4XloLHjgpLov5TljbTjgZnjgotcbiAgICovXG4gIGdlblRyaWFuZ2xlKCkge1xuICAgIGxldCBvYmogPSB7fTtcbiAgICBvYmoucCA9IFtcbiAgICAgIC8vIOOBsuOBqOOBpOebruOBruS4ieinkuW9olxuICAgICAgMC4wLCAwLjUsIDAuMCxcbiAgICAgIDAuNSwgLTAuNSwgMC4wLFxuICAgICAgLTAuNSwgLTAuNSwgMC4wLFxuXG4gICAgICAvLyDjgbXjgZ/jgaTnm67jga7kuInop5LlvaJcbiAgICAgIDAuMCwgLTAuNSwgMC4wLFxuICAgICAgMC41LCAwLjUsIDAuMCxcbiAgICAgIC0wLjUsIDAuNSwgMC4wXG4gICAgXTtcbiAgICByZXR1cm4gb2JqO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2FtcGxlMTtcbiIsImltcG9ydCB7bWF0SVYsIHF0bklWLCB0b3J1cywgY3ViZSwgaHN2YSAsc3BoZXJlfSBmcm9tIFwiLi9taW5NYXRyaXhcIjtcbi8qXG4gKiBTYW1wbGUgMlxuICovXG5cbmNsYXNzIFNhbXBsZTIge1xuICAvKipcbiAgICogY29uc3RydWN0b3JcbiAgICog44Kz44Oz44K544OI44Op44Kv44K/XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIC8vY2FudmFz44G444Gu5Y+C5LiK44KS5aSJ5pWw44Gr5Y+W5b6X44GZ44KLXG4gICAgbGV0IGMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJyk7XG4gICAgLy8gc2l6ZeaMh+WumlxuICAgIGMud2lkdGggPSA1MTI7XG4gICAgYy5oZWlnaHQgPSA1MTI7XG4gICAgdGhpcy5jYW52YXMgPSBjO1xuXG4gICAgLy9XZWJHTOOCs+ODs+ODhuOCreOCueODiOOCkmNhbnZhc+OBi+OCieWPluW+l+OBmeOCi1xuICAgIHRoaXMuZ2wgPSBjLmdldENvbnRleHQoJ3dlYmdsJykgfHwgYy5nZXRDb250ZXh0KCdleHBlcmltZW50YWwtd2ViZ2wnKTtcblxuICAgIC8vIOihjOWIl+ioiOeul1xuICAgIHRoaXMubWF0ID0gbnVsbDtcbiAgICAvLyDjg6zjg7Pjg4Djg6rjg7PjgrDnlKjjgqvjgqbjg7Pjgr9cbiAgICB0aGlzLmNvdW50ID0gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBydW5cbiAgICog44K144Oz44OX44Or44Kz44O844OJ5a6f6KGMXG4gICAqL1xuICBydW4oKSB7XG5cbiAgICAvL1dlYkdM44Kz44Oz44OG44Kt44K544OI44Gu5Y+W5b6X44GM44Gn44GN44Gf44GL44Gp44GG44GLXG4gICAgaWYgKHRoaXMuZ2wpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdzdXBwb3J0cyB3ZWJnbCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygnd2ViZ2wgbm90IHN1cHBvcnRlZCcpO1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8g44Kv44Oq44Ki44GZ44KL6Imy44KS5oyH5a6aXG4gICAgdGhpcy5nbC5jbGVhckNvbG9yKDAuMCwgMC4wLCAwLjAsIDEuMCk7XG5cbiAgICAvLyDjgqjjg6zjg6Hjg7Pjg4jjgpLjgq/jg6rjgqJcbiAgICB0aGlzLmdsLmNsZWFyKHRoaXMuZ2wuQ09MT1JfQlVGRkVSX0JJVCk7XG5cbiAgICAvLyDkuInop5LlvaLjgpLlvaLmiJDjgZnjgovpoILngrnjga7jg4fjg7zjgr/jgpLlj5fjgZHlj5bjgotcbiAgICB0aGlzLnRyaWFuZ2xlRGF0YSA9IHRoaXMuZ2VuVHJpYW5nbGUoKTtcblxuICAgIC8vIOmggueCueODh+ODvOOCv+OBi+OCieODkOODg+ODleOCoeOCkueUn+aIkFxuICAgIGxldCB2ZXJ0ZXhCdWZmZXIgPSB0aGlzLmdsLmNyZWF0ZUJ1ZmZlcigpO1xuICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkFSUkFZX0JVRkZFUiwgdmVydGV4QnVmZmVyKTtcbiAgICB0aGlzLmdsLmJ1ZmZlckRhdGEodGhpcy5nbC5BUlJBWV9CVUZGRVIsIG5ldyBGbG9hdDMyQXJyYXkodGhpcy50cmlhbmdsZURhdGEucCksIHRoaXMuZ2wuU1RBVElDX0RSQVcpO1xuXG4gICAgLy8g44K344Kn44O844OA44Go44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OIXG4gICAgY29uc3QgdmVydGV4U291cmNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZzJykudGV4dENvbnRlbnQ7XG4gICAgY29uc3QgZnJhZ21lbnRTb3VyY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZnMnKS50ZXh0Q29udGVudDtcblxuICAgIC8vIOODpuODvOOCtuODvOWumue+qeOBruODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiOeUn+aIkOmWouaVsFxuICAgIHRoaXMucHJvZ3JhbXMgPSB0aGlzLmNyZWF0ZVNoYWRlclByb2dyYW0odmVydGV4U291cmNlLCBmcmFnbWVudFNvdXJjZSk7XG5cbiAgICAvLyDjg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4jjgavkuInop5LlvaLjga7poILngrnjg4fjg7zjgr/jgpLnmbvpjLJcbiAgICBsZXQgYXR0TG9jYXRpb24gPSB0aGlzLmdsLmdldEF0dHJpYkxvY2F0aW9uKHRoaXMucHJvZ3JhbXMsICdwb3NpdGlvbicpO1xuICAgIHRoaXMuZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkoYXR0TG9jYXRpb24pO1xuICAgIHRoaXMuZ2wudmVydGV4QXR0cmliUG9pbnRlcihhdHRMb2NhdGlvbiwgMywgdGhpcy5nbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xuXG4gICAgLy8g6KGM5YiX44Gu5Yid5pyf5YyWXG4gICAgdGhpcy5tYXQgPSBuZXcgbWF0SVYoKTtcbiAgICB0aGlzLm1NYXRyaXggPSB0aGlzLm1hdC5pZGVudGl0eSh0aGlzLm1hdC5jcmVhdGUoKSk7XG4gICAgdGhpcy52TWF0cml4ID0gdGhpcy5tYXQuaWRlbnRpdHkodGhpcy5tYXQuY3JlYXRlKCkpO1xuICAgIHRoaXMucE1hdHJpeCA9IHRoaXMubWF0LmlkZW50aXR5KHRoaXMubWF0LmNyZWF0ZSgpKTtcbiAgICB0aGlzLnZwTWF0cml4ID0gdGhpcy5tYXQuaWRlbnRpdHkodGhpcy5tYXQuY3JlYXRlKCkpO1xuICAgIHRoaXMubXZwTWF0cml4ID0gdGhpcy5tYXQuaWRlbnRpdHkodGhpcy5tYXQuY3JlYXRlKCkpO1xuXG4gICAgLy8g44OT44Ol44O85bqn5qiZ5aSJ5o+b6KGM5YiXXG4gICAgbGV0IGNhbWVyYVBvc2l0aW9uID0gWzAuMCwgMC4wLCAzLjBdOyAvLyDjgqvjg6Hjg6njga7kvY3nva5cbiAgICBsZXQgY2VudGVyUG9pbnQgPSBbMC4wLCAwLjAsIDAuMF07ICAgIC8vIOazqOimlueCuVxuICAgIGxldCBjYW1lcmFVcCA9IFswLjAsIDEuMCwgMC4wXTsgICAgICAgLy8g44Kr44Oh44Op44Gu5LiK5pa55ZCRXG4gICAgdGhpcy5tYXQubG9va0F0KGNhbWVyYVBvc2l0aW9uLCBjZW50ZXJQb2ludCwgY2FtZXJhVXAsIHRoaXMudk1hdHJpeCk7XG5cbiAgICAvLyDjg5fjg63jgrjjgqfjgq/jgrfjg6fjg7Pjga7jgZ/jgoHjga7mg4XloLHjgpLmj4PjgYjjgotcbiAgICBsZXQgZm92eSA9IDQ1OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g6KaW6YeO6KeSXG4gICAgbGV0IGFzcGVjdCA9IHRoaXMuY2FudmFzLndpZHRoIC8gdGhpcy5jYW52YXMuaGVpZ2h0OyAvLyDjgqLjgrnjg5rjgq/jg4jmr5RcbiAgICBsZXQgbmVhciA9IDAuMTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g56m66ZaT44Gu5pyA5YmN6Z2iXG4gICAgbGV0IGZhciA9IDEwLjA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOepuumWk+OBruWlpeihjOOBjee1guerr1xuICAgIHRoaXMubWF0LnBlcnNwZWN0aXZlKGZvdnksIGFzcGVjdCwgbmVhciwgZmFyLCB0aGlzLnBNYXRyaXgpO1xuXG4gICAgLy8g6KGM5YiX44KS5o6b44GR5ZCI44KP44Gb44GmVlDjg57jg4jjg6rjg4Pjgq/jgrnjgpLnlJ/miJDjgZfjgabjgYrjgY9cbiAgICB0aGlzLm1hdC5tdWx0aXBseSh0aGlzLnBNYXRyaXgsIHRoaXMudk1hdHJpeCwgdGhpcy52cE1hdHJpeCk7ICAgLy8gcOOBq3bjgpLmjpvjgZHjgotcblxuICAgIC8vIHJlbmRlcmluZ+mWi+Wni1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICAvKipcbiAgICog44Os44Oz44OA44Oq44Oz44Kw6Zai5pWw44Gu5a6a576pXG4gICAqL1xuICByZW5kZXIoKSB7XG5cbiAgICAvLyBDYW52YXPjgqjjg6zjg6Hjg7Pjg4jjgpLjgq/jg6rjgqLjgZnjgotcbiAgICB0aGlzLmdsLmNsZWFyKHRoaXMuZ2wuQ09MT1JfQlVGRkVSX0JJVCk7XG5cbiAgICAvLyDjg6Ljg4fjg6vluqfmqJnlpInmj5vooYzliJfjgpLkuIDluqbliJ3mnJ/ljJbjgZfjgabjg6rjgrvjg4Pjg4jjgZnjgotcbiAgICB0aGlzLm1hdC5pZGVudGl0eSh0aGlzLm1NYXRyaXgpO1xuXG4gICAgLy8g44Kr44Km44Oz44K/44KS44Kk44Oz44Kv44Oq44Oh44Oz44OI44GZ44KLXG4gICAgdGhpcy5jb3VudCsrO1xuXG4gICAgLy8g44Oi44OH44Or5bqn5qiZ5aSJ5o+b6KGM5YiXXG4gICAgLy8g56e75YuVXG4gICAgbGV0IG1vdmUgPSBbMC41LCAwLjUsIDAuMF07ICAgICAgICAgICAvLyDnp7vli5Xph4/jga9YWeOBneOCjOOBnuOCjDAuNVxuICAgIHRoaXMubWF0LnRyYW5zbGF0ZSh0aGlzLm1NYXRyaXgsIG1vdmUsIHRoaXMubU1hdHJpeCk7XG5cbiAgICAvLyDlm57ou6JcbiAgICBsZXQgcmFkaWFucyA9ICh0aGlzLmNvdW50ICUgMzYwKSAqIE1hdGguUEkgLyAxODA7XG4gICAgbGV0IGF4aXMgPSBbMC4wLCAwLjAsIDEuMF07XG4gICAgdGhpcy5tYXQucm90YXRlKHRoaXMubU1hdHJpeCwgcmFkaWFucywgYXhpcywgdGhpcy5tTWF0cml4KTtcblxuXG4gICAgLy8g6KGM5YiX44KS5o6b44GR5ZCI44KP44Gb44GmTVZQ44Oe44OI44Oq44OD44Kv44K544KS55Sf5oiQXG4gICAgdGhpcy5tYXQubXVsdGlwbHkodGhpcy5wTWF0cml4LCB0aGlzLnZNYXRyaXgsIHRoaXMudnBNYXRyaXgpOyAgIC8vIHDjgat244KS5o6b44GR44KLXG4gICAgdGhpcy5tYXQubXVsdGlwbHkodGhpcy52cE1hdHJpeCwgdGhpcy5tTWF0cml4LCB0aGlzLm12cE1hdHJpeCk7IC8vIOOBleOCieOBq23jgpLmjpvjgZHjgotcblxuICAgIC8vIOOCt+OCp+ODvOODgOOBq+ihjOWIl+OCkumAgeS/oeOBmeOCi1xuICAgIGxldCB1bmlMb2NhdGlvbiA9IHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMucHJvZ3JhbXMsICdtdnBNYXRyaXgnKTtcbiAgICB0aGlzLmdsLnVuaWZvcm1NYXRyaXg0ZnYodW5pTG9jYXRpb24sIGZhbHNlLCB0aGlzLm12cE1hdHJpeCk7XG5cbiAgICAvLyBWUOODnuODiOODquODg+OCr+OCueOBq+ODouODh+ODq+W6p+aomeWkieaPm+ihjOWIl+OCkuaOm+OBkeOCi1xuICAgIHRoaXMubWF0Lm11bHRpcGx5KHRoaXMudnBNYXRyaXgsIHRoaXMubU1hdHJpeCwgdGhpcy5tdnBNYXRyaXgpO1xuXG4gICAgLy8g5o+P55S7XG4gICAgdGhpcy5nbC5kcmF3QXJyYXlzKHRoaXMuZ2wuVFJJQU5HTEVTLCAwLCB0aGlzLnRyaWFuZ2xlRGF0YS5wLmxlbmd0aCAvIDMpO1xuICAgIHRoaXMuZ2wuZmx1c2goKTtcblxuICAgIC8vIOWGjeW4sOWRvOOBs+WHuuOBl1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKT0+IHtcbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogY3JlYXRlU2hhZGVyUHJvZ3JhbVxuICAgKiDjg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4jnlJ/miJDplqLmlbBcbiAgICovXG4gIGNyZWF0ZVNoYWRlclByb2dyYW0odmVydGV4U291cmNlLCBmcmFnbWVudFNvdXJjZSkge1xuXG4gICAgLy8g44K344Kn44O844OA44Kq44OW44K444Kn44Kv44OI44Gu55Sf5oiQXG4gICAgbGV0IHZlcnRleFNoYWRlciA9IHRoaXMuZ2wuY3JlYXRlU2hhZGVyKHRoaXMuZ2wuVkVSVEVYX1NIQURFUik7XG4gICAgbGV0IGZyYWdtZW50U2hhZGVyID0gdGhpcy5nbC5jcmVhdGVTaGFkZXIodGhpcy5nbC5GUkFHTUVOVF9TSEFERVIpO1xuXG4gICAgLy8g44K344Kn44O844OA44Gr44K944O844K544KS5Ymy44KK5b2T44Gm44Gm44Kz44Oz44OR44Kk44OrXG4gICAgdGhpcy5nbC5zaGFkZXJTb3VyY2UodmVydGV4U2hhZGVyLCB2ZXJ0ZXhTb3VyY2UpO1xuICAgIHRoaXMuZ2wuY29tcGlsZVNoYWRlcih2ZXJ0ZXhTaGFkZXIpO1xuICAgIHRoaXMuZ2wuc2hhZGVyU291cmNlKGZyYWdtZW50U2hhZGVyLCBmcmFnbWVudFNvdXJjZSk7XG4gICAgdGhpcy5nbC5jb21waWxlU2hhZGVyKGZyYWdtZW50U2hhZGVyKTtcblxuICAgIC8vIOOCt+OCp+ODvOODgOODvOOCs+ODs+ODkeOCpOODq+OBruOCqOODqeODvOWIpOWumlxuICAgIGlmICh0aGlzLmdsLmdldFNoYWRlclBhcmFtZXRlcih2ZXJ0ZXhTaGFkZXIsIHRoaXMuZ2wuQ09NUElMRV9TVEFUVVMpXG4gICAgICAmJiB0aGlzLmdsLmdldFNoYWRlclBhcmFtZXRlcihmcmFnbWVudFNoYWRlciwgdGhpcy5nbC5DT01QSUxFX1NUQVRVUykpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdTdWNjZXNzIFNoYWRlciBDb21waWxlJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCdGYWlsZCBTaGFkZXIgQ29tcGlsZScpO1xuICAgICAgY29uc29sZS5sb2coJ3ZlcnRleFNoYWRlcicsIHRoaXMuZ2wuZ2V0U2hhZGVySW5mb0xvZyh2ZXJ0ZXhTaGFkZXIpKTtcbiAgICAgIGNvbnNvbGUubG9nKCdmcmFnbWVudFNoYWRlcicsIHRoaXMuZ2wuZ2V0U2hhZGVySW5mb0xvZyhmcmFnbWVudFNoYWRlcikpO1xuICAgIH1cblxuICAgIC8vIOODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiOOBrueUn+aIkOOBi+OCiemBuOaKnuOBvuOBp1xuICAgIGNvbnN0IHByb2dyYW1zID0gdGhpcy5nbC5jcmVhdGVQcm9ncmFtKCk7XG5cbiAgICB0aGlzLmdsLmF0dGFjaFNoYWRlcihwcm9ncmFtcywgdmVydGV4U2hhZGVyKTtcbiAgICB0aGlzLmdsLmF0dGFjaFNoYWRlcihwcm9ncmFtcywgZnJhZ21lbnRTaGFkZXIpO1xuICAgIHRoaXMuZ2wubGlua1Byb2dyYW0ocHJvZ3JhbXMpO1xuXG4gICAgLy8g44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OI44Gu44Ko44Op44O85Yik5a6a5Yem55CGXG4gICAgaWYgKHRoaXMuZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcihwcm9ncmFtcywgdGhpcy5nbC5MSU5LX1NUQVRVUykpIHtcbiAgICAgIHRoaXMuZ2wudXNlUHJvZ3JhbShwcm9ncmFtcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgTGluayBQcm9ncmFtJywgdGhpcy5nbC5nZXRQcm9ncmFtSW5mb0xvZyhwcm9ncmFtcykpO1xuICAgIH1cblxuICAgIC8vIOeUn+aIkOOBl+OBn+ODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiOOCkuaIu+OCiuWApOOBqOOBl+OBpui/lOOBmVxuICAgIHJldHVybiBwcm9ncmFtcztcbiAgfVxuXG4gIC8qKlxuICAgKiBnZW5UcmlhbmdsZVxuICAgKiDkuInop5LlvaLjga7poILngrnmg4XloLHjgpLov5TljbTjgZnjgotcbiAgICovXG4gIGdlblRyaWFuZ2xlKCkge1xuICAgIGxldCBvYmogPSB7fTtcbiAgICBvYmoucCA9IFtcbiAgICAgIC8vIOOBsuOBqOOBpOebruOBruS4ieinkuW9olxuICAgICAgMC4wLCAwLjUsIDAuMCxcbiAgICAgIDAuNSwgLTAuNSwgMC4wLFxuICAgICAgLTAuNSwgLTAuNSwgMC4wLFxuXG4gICAgICAvLyDjgbXjgZ/jgaTnm67jga7kuInop5LlvaJcbiAgICAgIDAuMCwgLTAuNSwgMC4wLFxuICAgICAgMC41LCAwLjUsIDAuMCxcbiAgICAgIC0wLjUsIDAuNSwgMC4wXG4gICAgXTtcbiAgICByZXR1cm4gb2JqO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2FtcGxlMjtcblxuIiwiaW1wb3J0IHttYXRJViwgcXRuSVYsIHRvcnVzLCBjdWJlLCBoc3ZhICxzcGhlcmV9IGZyb20gXCIuL21pbk1hdHJpeFwiO1xuLypcbiAqIFNhbXBsZSAyXG4gKi9cblxuY2xhc3MgU2FtcGxlMyB7XG4gIC8qKlxuICAgKiBjb25zdHJ1Y3RvclxuICAgKiDjgrPjg7Pjgrnjg4jjg6njgq/jgr9cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgY29uc29sZS5sb2coJ1N0YXJ0IFNhbXBsZTMnKTtcblxuICAgIC8vY2FudmFz44G444Gu5Y+C5LiK44KS5aSJ5pWw44Gr5Y+W5b6X44GZ44KLXG4gICAgbGV0IGMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJyk7XG4gICAgLy8gc2l6ZeaMh+WumlxuICAgIGMud2lkdGggPSA1MTI7XG4gICAgYy5oZWlnaHQgPSA1MTI7XG4gICAgdGhpcy5jYW52YXMgPSBjO1xuXG4gICAgLy9XZWJHTOOCs+ODs+ODhuOCreOCueODiOOCkmNhbnZhc+OBi+OCieWPluW+l+OBmeOCi1xuICAgIHRoaXMuZ2wgPSBjLmdldENvbnRleHQoJ3dlYmdsJykgfHwgYy5nZXRDb250ZXh0KCdleHBlcmltZW50YWwtd2ViZ2wnKTtcblxuICAgIC8vIOihjOWIl+ioiOeul1xuICAgIHRoaXMubWF0ID0gbnVsbDtcbiAgICAvLyDjg6zjg7Pjg4Djg6rjg7PjgrDnlKjjgqvjgqbjg7Pjgr9cbiAgICB0aGlzLmNvdW50ID0gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBydW5cbiAgICog44K144Oz44OX44Or44Kz44O844OJ5a6f6KGMXG4gICAqL1xuICBydW4oKSB7XG5cbiAgICAvLyBXZWJHTOOCs+ODs+ODhuOCreOCueODiOOBruWPluW+l+OBjOOBp+OBjeOBn+OBi+OBqeOBhuOBi1xuICAgIGlmICh0aGlzLmdsKSB7XG4gICAgICBjb25zb2xlLmxvZygnc3VwcG9ydHMgd2ViZ2wnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ3dlYmdsIG5vdCBzdXBwb3J0ZWQnKTtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIOOCr+ODquOCouOBmeOCi+iJsuOCkuaMh+WumlxuICAgIHRoaXMuZ2wuY2xlYXJDb2xvcigwLjAsIDAuMCwgMC4wLCAxLjApO1xuXG4gICAgLy8g44Ko44Os44Oh44Oz44OI44KS44Kv44Oq44KiXG4gICAgdGhpcy5nbC5jbGVhcih0aGlzLmdsLkNPTE9SX0JVRkZFUl9CSVQpO1xuXG4gICAgLy8g44K344Kn44O844OA44Go44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OIXG4gICAgY29uc3QgdmVydGV4U291cmNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZzJykudGV4dENvbnRlbnQ7XG4gICAgY29uc3QgZnJhZ21lbnRTb3VyY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZnMnKS50ZXh0Q29udGVudDtcblxuICAgIC8vIOODpuODvOOCtuODvOWumue+qeOBruODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiOeUn+aIkOmWouaVsFxuICAgIHRoaXMucHJvZ3JhbXMgPSB0aGlzLmNyZWF0ZVNoYWRlclByb2dyYW0odmVydGV4U291cmNlLCBmcmFnbWVudFNvdXJjZSk7XG5cbiAgICAvLyDnkIPkvZPjgpLlvaLmiJDjgZnjgovpoILngrnjga7jg4fjg7zjgr/jgpLlj5fjgZHlj5bjgotcbiAgICB0aGlzLnNwaGVyZURhdGEgPSBzcGhlcmUoMTYsIDE2LCAxLjApO1xuXG4gICAgLy8g6aCC54K544OH44O844K/44GL44KJ44OQ44OD44OV44Kh44KS55Sf5oiQXG4gICAgLypcbiAgICBsZXQgdmVydGV4QnVmZmVyID0gdGhpcy5nbC5jcmVhdGVCdWZmZXIoKTtcbiAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIHZlcnRleEJ1ZmZlcik7XG4gICAgdGhpcy5nbC5idWZmZXJEYXRhKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCBuZXcgRmxvYXQzMkFycmF5KHRoaXMuc3BoZXJlRGF0YS5wKSwgdGhpcy5nbC5TVEFUSUNfRFJBVyk7XG5cbiAgICAgLy8g44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OI44Gr6aCC54K544OH44O844K/44KS55m76YyyXG4gICAgIGxldCBhdHRMb2NhdGlvbiA9IHRoaXMuZ2wuZ2V0QXR0cmliTG9jYXRpb24odGhpcy5wcm9ncmFtcywgJ3Bvc2l0aW9uJyk7XG4gICAgIHRoaXMuZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkoYXR0TG9jYXRpb24pO1xuICAgICB0aGlzLmdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYXR0TG9jYXRpb24sIDMsIHRoaXMuZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcblxuICAgICAqL1xuICAgIC8vIOmggueCueODh+ODvOOCv+OBi+OCieODkOODg+ODleOCoeOCkueUn+aIkOOBl+OBpueZu+mMsuOBmeOCi++8iOmggueCueW6p+aome+8iVxuICAgIGxldCB2UG9zaXRpb25CdWZmZXIgPSB0aGlzLmdsLmNyZWF0ZUJ1ZmZlcigpO1xuICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkFSUkFZX0JVRkZFUiwgdlBvc2l0aW9uQnVmZmVyKTtcbiAgICB0aGlzLmdsLmJ1ZmZlckRhdGEodGhpcy5nbC5BUlJBWV9CVUZGRVIsIG5ldyBGbG9hdDMyQXJyYXkodGhpcy5zcGhlcmVEYXRhLnApLCB0aGlzLmdsLlNUQVRJQ19EUkFXKTtcbiAgICBsZXQgYXR0TG9jUG9zaXRpb24gPSB0aGlzLmdsLmdldEF0dHJpYkxvY2F0aW9uKHRoaXMucHJvZ3JhbXMsICdwb3NpdGlvbicpO1xuICAgIHRoaXMuZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkoYXR0TG9jUG9zaXRpb24pO1xuICAgIHRoaXMuZ2wudmVydGV4QXR0cmliUG9pbnRlcihhdHRMb2NQb3NpdGlvbiwgMywgdGhpcy5nbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xuXG4gICAgLy8g6aCC54K544OH44O844K/44GL44KJ44OQ44OD44OV44Kh44KS55Sf5oiQ44GX44Gm55m76Yyy44GZ44KL77yI6aCC54K56Imy77yJXG4gICAgbGV0IHZDb2xvckJ1ZmZlciA9IHRoaXMuZ2wuY3JlYXRlQnVmZmVyKCk7XG4gICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCB2Q29sb3JCdWZmZXIpO1xuICAgIHRoaXMuZ2wuYnVmZmVyRGF0YSh0aGlzLmdsLkFSUkFZX0JVRkZFUiwgbmV3IEZsb2F0MzJBcnJheSh0aGlzLnNwaGVyZURhdGEuYyksIHRoaXMuZ2wuU1RBVElDX0RSQVcpO1xuICAgIGxldCBhdHRMb2NDb2xvciA9IHRoaXMuZ2wuZ2V0QXR0cmliTG9jYXRpb24odGhpcy5wcm9ncmFtcywgJ2NvbG9yJyk7XG4gICAgdGhpcy5nbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShhdHRMb2NDb2xvcik7XG4gICAgdGhpcy5nbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dExvY0NvbG9yLCA0LCB0aGlzLmdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XG5cbiAgICAvLyDjgqTjg7Pjg4fjg4Pjgq/jgrnjg5Djg4Pjg5XjgqHjga7nlJ/miJBcbiAgICBsZXQgaW5kZXhCdWZmZXIgPSB0aGlzLmdsLmNyZWF0ZUJ1ZmZlcigpO1xuICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBpbmRleEJ1ZmZlcik7XG4gICAgdGhpcy5nbC5idWZmZXJEYXRhKHRoaXMuZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIG5ldyBJbnQxNkFycmF5KHRoaXMuc3BoZXJlRGF0YS5pKSwgdGhpcy5nbC5TVEFUSUNfRFJBVyk7XG5cbiAgICAvLyDooYzliJfjga7liJ3mnJ/ljJZcbiAgICB0aGlzLm1hdCA9IG5ldyBtYXRJVigpO1xuICAgIHRoaXMubU1hdHJpeCA9IHRoaXMubWF0LmlkZW50aXR5KHRoaXMubWF0LmNyZWF0ZSgpKTtcbiAgICB0aGlzLnZNYXRyaXggPSB0aGlzLm1hdC5pZGVudGl0eSh0aGlzLm1hdC5jcmVhdGUoKSk7XG4gICAgdGhpcy5wTWF0cml4ID0gdGhpcy5tYXQuaWRlbnRpdHkodGhpcy5tYXQuY3JlYXRlKCkpO1xuICAgIHRoaXMudnBNYXRyaXggPSB0aGlzLm1hdC5pZGVudGl0eSh0aGlzLm1hdC5jcmVhdGUoKSk7XG4gICAgdGhpcy5tdnBNYXRyaXggPSB0aGlzLm1hdC5pZGVudGl0eSh0aGlzLm1hdC5jcmVhdGUoKSk7XG5cbiAgICAvLyDjg5Pjg6Xjg7zluqfmqJnlpInmj5vooYzliJdcbiAgICBsZXQgY2FtZXJhUG9zaXRpb24gPSBbMC4wLCAwLjAsIDMuMF07IC8vIOOCq+ODoeODqeOBruS9jee9rlxuICAgIGxldCBjZW50ZXJQb2ludCA9IFswLjAsIDAuMCwgMC4wXTsgICAgLy8g5rOo6KaW54K5XG4gICAgbGV0IGNhbWVyYVVwID0gWzAuMCwgMS4wLCAwLjBdOyAgICAgICAvLyDjgqvjg6Hjg6njga7kuIrmlrnlkJFcbiAgICB0aGlzLm1hdC5sb29rQXQoY2FtZXJhUG9zaXRpb24sIGNlbnRlclBvaW50LCBjYW1lcmFVcCwgdGhpcy52TWF0cml4KTtcblxuICAgIC8vIOODl+ODreOCuOOCp+OCr+OCt+ODp+ODs+OBruOBn+OCgeOBruaDheWgseOCkuaPg+OBiOOCi1xuICAgIGxldCBmb3Z5ID0gNDU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDoppbph47op5JcbiAgICBsZXQgYXNwZWN0ID0gdGhpcy5jYW52YXMud2lkdGggLyB0aGlzLmNhbnZhcy5oZWlnaHQ7IC8vIOOCouOCueODmuOCr+ODiOavlFxuICAgIGxldCBuZWFyID0gMC4xOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDnqbrplpPjga7mnIDliY3pnaJcbiAgICBsZXQgZmFyID0gMTAuMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g56m66ZaT44Gu5aWl6KGM44GN57WC56uvXG4gICAgdGhpcy5tYXQucGVyc3BlY3RpdmUoZm92eSwgYXNwZWN0LCBuZWFyLCBmYXIsIHRoaXMucE1hdHJpeCk7XG5cbiAgICAvLyDooYzliJfjgpLmjpvjgZHlkIjjgo/jgZvjgaZWUOODnuODiOODquODg+OCr+OCueOCkueUn+aIkOOBl+OBpuOBiuOBj1xuICAgIHRoaXMubWF0Lm11bHRpcGx5KHRoaXMucE1hdHJpeCwgdGhpcy52TWF0cml4LCB0aGlzLnZwTWF0cml4KTsgICAvLyBw44GrduOCkuaOm+OBkeOCi1xuXG4gICAgLy8gcmVuZGVyaW5n6ZaL5aeLXG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDjg6zjg7Pjg4Djg6rjg7PjgrDplqLmlbDjga7lrprnvqlcbiAgICovXG4gIHJlbmRlcigpIHtcblxuICAgIC8vIENhbnZhc+OCqOODrOODoeODs+ODiOOCkuOCr+ODquOCouOBmeOCi1xuICAgIHRoaXMuZ2wuY2xlYXIodGhpcy5nbC5DT0xPUl9CVUZGRVJfQklUKTtcblxuICAgIC8vIOODouODh+ODq+W6p+aomeWkieaPm+ihjOWIl+OCkuS4gOW6puWIneacn+WMluOBl+OBpuODquOCu+ODg+ODiOOBmeOCi1xuICAgIHRoaXMubWF0LmlkZW50aXR5KHRoaXMubU1hdHJpeCk7XG5cbiAgICAvLyDjgqvjgqbjg7Pjgr/jgpLjgqTjg7Pjgq/jg6rjg6Hjg7Pjg4jjgZnjgotcbiAgICB0aGlzLmNvdW50Kys7XG5cbiAgICAvLyDjg6Ljg4fjg6vluqfmqJnlpInmj5vooYzliJdcbiAgICAvLyDnp7vli5VcbiAgICBsZXQgbW92ZSA9IFswLjAsIDAuMCwgMC4wXTtcbiAgICB0aGlzLm1hdC50cmFuc2xhdGUodGhpcy5tTWF0cml4LCBtb3ZlLCB0aGlzLm1NYXRyaXgpO1xuXG4gICAgLy8g5Zue6LuiXG4gICAgLypcbiAgICBsZXQgcmFkaWFucyA9ICh0aGlzLmNvdW50ICUgMzYwKSAqIE1hdGguUEkgLyAxODA7XG4gICAgbGV0IGF4aXMgPSBbMC4wLCAwLjAsIDEuMF07XG4gICAgdGhpcy5tYXQucm90YXRlKHRoaXMubU1hdHJpeCwgcmFkaWFucywgYXhpcywgdGhpcy5tTWF0cml4KTtcbiAgICAqL1xuXG4gICAgLy8gQ2FudmFz44Ko44Os44Oh44Oz44OI44KS44Kv44Oq44Ki44GZ44KLXG4gICAgZ2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVCB8IGdsLkRFUFRIX0JVRkZFUl9CSVQpO1xuXG4gICAgbGV0IHJhZGlhbnMgPSAodGhpcy5jb3VudCAlIDM2MCkgKiBNYXRoLlBJIC8gMTgwO1xuXG4gICAgLy8g44Oi44OH44Or5bqn5qiZ5aSJ5o+b6KGM5YiX44KS5LiA5bqm5Yid5pyf5YyW44GX44Gm44Oq44K744OD44OI44GZ44KLXG4gICAgdGhpcy5tYXQuaWRlbnRpdHkobU1hdHJpeCk7XG4gICAgLy8g44Oi44OH44Or5bqn5qiZ5aSJ5o+b6KGM5YiXXG4gICAgbGV0IGF4aXMgPSBbMC4wLCAxLjAsIDEuMF07XG4gICAgdGhpcy5tYXQucm90YXRlKHRoaXMubU1hdHJpeCwgcmFkaWFucywgYXhpcywgdGhpcy5tTWF0cml4KTtcblxuICAgIC8vIOihjOWIl+OCkuaOm+OBkeWQiOOCj+OBm+OBpk1WUOODnuODiOODquODg+OCr+OCueOCkueUn+aIkFxuICAgIHRoaXMubWF0Lm11bHRpcGx5KHRoaXMucE1hdHJpeCwgdGhpcy52TWF0cml4LCB0aGlzLnZwTWF0cml4KTsgICAvLyBw44GrduOCkuaOm+OBkeOCi1xuICAgIHRoaXMubWF0Lm11bHRpcGx5KHRoaXMudnBNYXRyaXgsIHRoaXMubU1hdHJpeCwgdGhpcy5tdnBNYXRyaXgpOyAvLyDjgZXjgonjgatt44KS5o6b44GR44KLXG5cbiAgICAvLyDjgrfjgqfjg7zjg4DjgavooYzliJfjgpLpgIHkv6HjgZnjgotcbiAgICBsZXQgdW5pTG9jYXRpb24gPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLnByb2dyYW1zLCAnbXZwTWF0cml4Jyk7XG4gICAgdGhpcy5nbC51bmlmb3JtTWF0cml4NGZ2KHVuaUxvY2F0aW9uLCBmYWxzZSwgdGhpcy5tdnBNYXRyaXgpO1xuXG4gICAgLy8gVlDjg57jg4jjg6rjg4Pjgq/jgrnjgavjg6Ljg4fjg6vluqfmqJnlpInmj5vooYzliJfjgpLmjpvjgZHjgotcbiAgICB0aGlzLm1hdC5tdWx0aXBseSh0aGlzLnZwTWF0cml4LCB0aGlzLm1NYXRyaXgsIHRoaXMubXZwTWF0cml4KTtcblxuICAgIC8vIOaPj+eUu1xuICAgIC8vIHRoaXMuZ2wuZHJhd0FycmF5cyh0aGlzLmdsLlRSSUFOR0xFUywgMCwgdGhpcy5zcGhlcmVEYXRhLnAubGVuZ3RoIC8gMyk7XG4gICAgLy8g44Kk44Oz44OH44OD44Kv44K544OQ44OD44OV44Kh44Gr44KI44KL5o+P55S7XG4gICAgdGhpcy5nbC5kcmF3RWxlbWVudHModGhpcy5nbC5UUklBTkdMRVMsIHRoaXMuc3BoZXJlRGF0YS5pLmxlbmd0aCwgdGhpcy5nbC5VTlNJR05FRF9TSE9SVCwgMCk7XG4gICAgdGhpcy5nbC5mbHVzaCgpO1xuXG4gICAgLy8g5YaN5biw5ZG844Gz5Ye644GXXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpPT4ge1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjcmVhdGVTaGFkZXJQcm9ncmFtXG4gICAqIOODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiOeUn+aIkOmWouaVsFxuICAgKi9cbiAgY3JlYXRlU2hhZGVyUHJvZ3JhbSh2ZXJ0ZXhTb3VyY2UsIGZyYWdtZW50U291cmNlKSB7XG5cbiAgICAvLyDjgrfjgqfjg7zjg4Djgqrjg5bjgrjjgqfjgq/jg4jjga7nlJ/miJBcbiAgICBsZXQgdmVydGV4U2hhZGVyID0gdGhpcy5nbC5jcmVhdGVTaGFkZXIodGhpcy5nbC5WRVJURVhfU0hBREVSKTtcbiAgICBsZXQgZnJhZ21lbnRTaGFkZXIgPSB0aGlzLmdsLmNyZWF0ZVNoYWRlcih0aGlzLmdsLkZSQUdNRU5UX1NIQURFUik7XG5cbiAgICAvLyDjgrfjgqfjg7zjg4Djgavjgr3jg7zjgrnjgpLlibLjgorlvZPjgabjgabjgrPjg7Pjg5HjgqTjg6tcbiAgICB0aGlzLmdsLnNoYWRlclNvdXJjZSh2ZXJ0ZXhTaGFkZXIsIHZlcnRleFNvdXJjZSk7XG4gICAgdGhpcy5nbC5jb21waWxlU2hhZGVyKHZlcnRleFNoYWRlcik7XG4gICAgdGhpcy5nbC5zaGFkZXJTb3VyY2UoZnJhZ21lbnRTaGFkZXIsIGZyYWdtZW50U291cmNlKTtcbiAgICB0aGlzLmdsLmNvbXBpbGVTaGFkZXIoZnJhZ21lbnRTaGFkZXIpO1xuXG4gICAgLy8g44K344Kn44O844OA44O844Kz44Oz44OR44Kk44Or44Gu44Ko44Op44O85Yik5a6aXG4gICAgaWYgKHRoaXMuZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHZlcnRleFNoYWRlciwgdGhpcy5nbC5DT01QSUxFX1NUQVRVUylcbiAgICAgICYmIHRoaXMuZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKGZyYWdtZW50U2hhZGVyLCB0aGlzLmdsLkNPTVBJTEVfU1RBVFVTKSkge1xuICAgICAgY29uc29sZS5sb2coJ1N1Y2Nlc3MgU2hhZGVyIENvbXBpbGUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ0ZhaWxkIFNoYWRlciBDb21waWxlJyk7XG4gICAgICBjb25zb2xlLmxvZygndmVydGV4U2hhZGVyJywgdGhpcy5nbC5nZXRTaGFkZXJJbmZvTG9nKHZlcnRleFNoYWRlcikpO1xuICAgICAgY29uc29sZS5sb2coJ2ZyYWdtZW50U2hhZGVyJywgdGhpcy5nbC5nZXRTaGFkZXJJbmZvTG9nKGZyYWdtZW50U2hhZGVyKSk7XG4gICAgfVxuXG4gICAgLy8g44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OI44Gu55Sf5oiQ44GL44KJ6YG45oqe44G+44GnXG4gICAgY29uc3QgcHJvZ3JhbXMgPSB0aGlzLmdsLmNyZWF0ZVByb2dyYW0oKTtcblxuICAgIHRoaXMuZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW1zLCB2ZXJ0ZXhTaGFkZXIpO1xuICAgIHRoaXMuZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW1zLCBmcmFnbWVudFNoYWRlcik7XG4gICAgdGhpcy5nbC5saW5rUHJvZ3JhbShwcm9ncmFtcyk7XG5cbiAgICAvLyDjg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4jjga7jgqjjg6njg7zliKTlrprlh6bnkIZcbiAgICBpZiAodGhpcy5nbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHByb2dyYW1zLCB0aGlzLmdsLkxJTktfU1RBVFVTKSkge1xuICAgICAgdGhpcy5nbC51c2VQcm9ncmFtKHByb2dyYW1zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCBMaW5rIFByb2dyYW0nLCB0aGlzLmdsLmdldFByb2dyYW1JbmZvTG9nKHByb2dyYW1zKSk7XG4gICAgfVxuXG4gICAgLy8g55Sf5oiQ44GX44Gf44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OI44KS5oi744KK5YCk44Go44GX44Gm6L+U44GZXG4gICAgcmV0dXJuIHByb2dyYW1zO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2FtcGxlMztcbiIsImltcG9ydCBTYW1wbGUxIGZyb20gXCIuL1NhbXBsZTFcIjtcbmltcG9ydCBTYW1wbGUyIGZyb20gXCIuL1NhbXBsZTJcIjtcbmltcG9ydCBTYW1wbGUzIGZyb20gXCIuL1NhbXBsZTNcIjtcblxud2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcblxuICBjb25zdCBzYW1wbGUzID0gbmV3IFNhbXBsZTMoKTtcbiAgc2FtcGxlMy5ydW4oKTtcblxufTtcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gbWluTWF0cml4LmpzXG4vLyB2ZXJzaW9uIDAuMC4zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZXhwb3J0IGNsYXNzIG1hdElWIHtcbiAgICBjcmVhdGUgKCkge1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheSgxNik7XG4gICAgfTtcbiAgICBpZGVudGl0eSAoZGVzdCkge1xuICAgICAgICBkZXN0WzBdID0gMTtcbiAgICAgICAgZGVzdFsxXSA9IDA7XG4gICAgICAgIGRlc3RbMl0gPSAwO1xuICAgICAgICBkZXN0WzNdID0gMDtcbiAgICAgICAgZGVzdFs0XSA9IDA7XG4gICAgICAgIGRlc3RbNV0gPSAxO1xuICAgICAgICBkZXN0WzZdID0gMDtcbiAgICAgICAgZGVzdFs3XSA9IDA7XG4gICAgICAgIGRlc3RbOF0gPSAwO1xuICAgICAgICBkZXN0WzldID0gMDtcbiAgICAgICAgZGVzdFsxMF0gPSAxO1xuICAgICAgICBkZXN0WzExXSA9IDA7XG4gICAgICAgIGRlc3RbMTJdID0gMDtcbiAgICAgICAgZGVzdFsxM10gPSAwO1xuICAgICAgICBkZXN0WzE0XSA9IDA7XG4gICAgICAgIGRlc3RbMTVdID0gMTtcbiAgICAgICAgcmV0dXJuIGRlc3Q7XG4gICAgfTtcbiAgICBtdWx0aXBseSAobWF0MSwgbWF0MiwgZGVzdCkge1xuICAgICAgICBsZXQgYSA9IG1hdDFbMF0sIGIgPSBtYXQxWzFdLCBjID0gbWF0MVsyXSwgZCA9IG1hdDFbM10sXG4gICAgICAgICAgICBlID0gbWF0MVs0XSwgZiA9IG1hdDFbNV0sIGcgPSBtYXQxWzZdLCBoID0gbWF0MVs3XSxcbiAgICAgICAgICAgIGkgPSBtYXQxWzhdLCBqID0gbWF0MVs5XSwgayA9IG1hdDFbMTBdLCBsID0gbWF0MVsxMV0sXG4gICAgICAgICAgICBtID0gbWF0MVsxMl0sIG4gPSBtYXQxWzEzXSwgbyA9IG1hdDFbMTRdLCBwID0gbWF0MVsxNV0sXG4gICAgICAgICAgICBBID0gbWF0MlswXSwgQiA9IG1hdDJbMV0sIEMgPSBtYXQyWzJdLCBEID0gbWF0MlszXSxcbiAgICAgICAgICAgIEUgPSBtYXQyWzRdLCBGID0gbWF0Mls1XSwgRyA9IG1hdDJbNl0sIEggPSBtYXQyWzddLFxuICAgICAgICAgICAgSSA9IG1hdDJbOF0sIEogPSBtYXQyWzldLCBLID0gbWF0MlsxMF0sIEwgPSBtYXQyWzExXSxcbiAgICAgICAgICAgIE0gPSBtYXQyWzEyXSwgTiA9IG1hdDJbMTNdLCBPID0gbWF0MlsxNF0sIFAgPSBtYXQyWzE1XTtcbiAgICAgICAgZGVzdFswXSA9IEEgKiBhICsgQiAqIGUgKyBDICogaSArIEQgKiBtO1xuICAgICAgICBkZXN0WzFdID0gQSAqIGIgKyBCICogZiArIEMgKiBqICsgRCAqIG47XG4gICAgICAgIGRlc3RbMl0gPSBBICogYyArIEIgKiBnICsgQyAqIGsgKyBEICogbztcbiAgICAgICAgZGVzdFszXSA9IEEgKiBkICsgQiAqIGggKyBDICogbCArIEQgKiBwO1xuICAgICAgICBkZXN0WzRdID0gRSAqIGEgKyBGICogZSArIEcgKiBpICsgSCAqIG07XG4gICAgICAgIGRlc3RbNV0gPSBFICogYiArIEYgKiBmICsgRyAqIGogKyBIICogbjtcbiAgICAgICAgZGVzdFs2XSA9IEUgKiBjICsgRiAqIGcgKyBHICogayArIEggKiBvO1xuICAgICAgICBkZXN0WzddID0gRSAqIGQgKyBGICogaCArIEcgKiBsICsgSCAqIHA7XG4gICAgICAgIGRlc3RbOF0gPSBJICogYSArIEogKiBlICsgSyAqIGkgKyBMICogbTtcbiAgICAgICAgZGVzdFs5XSA9IEkgKiBiICsgSiAqIGYgKyBLICogaiArIEwgKiBuO1xuICAgICAgICBkZXN0WzEwXSA9IEkgKiBjICsgSiAqIGcgKyBLICogayArIEwgKiBvO1xuICAgICAgICBkZXN0WzExXSA9IEkgKiBkICsgSiAqIGggKyBLICogbCArIEwgKiBwO1xuICAgICAgICBkZXN0WzEyXSA9IE0gKiBhICsgTiAqIGUgKyBPICogaSArIFAgKiBtO1xuICAgICAgICBkZXN0WzEzXSA9IE0gKiBiICsgTiAqIGYgKyBPICogaiArIFAgKiBuO1xuICAgICAgICBkZXN0WzE0XSA9IE0gKiBjICsgTiAqIGcgKyBPICogayArIFAgKiBvO1xuICAgICAgICBkZXN0WzE1XSA9IE0gKiBkICsgTiAqIGggKyBPICogbCArIFAgKiBwO1xuICAgICAgICByZXR1cm4gZGVzdDtcbiAgICB9O1xuICAgIHNjYWxlIChtYXQsIHZlYywgZGVzdCkge1xuICAgICAgICBkZXN0WzBdID0gbWF0WzBdICogdmVjWzBdO1xuICAgICAgICBkZXN0WzFdID0gbWF0WzFdICogdmVjWzBdO1xuICAgICAgICBkZXN0WzJdID0gbWF0WzJdICogdmVjWzBdO1xuICAgICAgICBkZXN0WzNdID0gbWF0WzNdICogdmVjWzBdO1xuICAgICAgICBkZXN0WzRdID0gbWF0WzRdICogdmVjWzFdO1xuICAgICAgICBkZXN0WzVdID0gbWF0WzVdICogdmVjWzFdO1xuICAgICAgICBkZXN0WzZdID0gbWF0WzZdICogdmVjWzFdO1xuICAgICAgICBkZXN0WzddID0gbWF0WzddICogdmVjWzFdO1xuICAgICAgICBkZXN0WzhdID0gbWF0WzhdICogdmVjWzJdO1xuICAgICAgICBkZXN0WzldID0gbWF0WzldICogdmVjWzJdO1xuICAgICAgICBkZXN0WzEwXSA9IG1hdFsxMF0gKiB2ZWNbMl07XG4gICAgICAgIGRlc3RbMTFdID0gbWF0WzExXSAqIHZlY1syXTtcbiAgICAgICAgZGVzdFsxMl0gPSBtYXRbMTJdO1xuICAgICAgICBkZXN0WzEzXSA9IG1hdFsxM107XG4gICAgICAgIGRlc3RbMTRdID0gbWF0WzE0XTtcbiAgICAgICAgZGVzdFsxNV0gPSBtYXRbMTVdO1xuICAgICAgICByZXR1cm4gZGVzdDtcbiAgICB9O1xuICAgIHRyYW5zbGF0ZSAobWF0LCB2ZWMsIGRlc3QpIHtcbiAgICAgICAgZGVzdFswXSA9IG1hdFswXTtcbiAgICAgICAgZGVzdFsxXSA9IG1hdFsxXTtcbiAgICAgICAgZGVzdFsyXSA9IG1hdFsyXTtcbiAgICAgICAgZGVzdFszXSA9IG1hdFszXTtcbiAgICAgICAgZGVzdFs0XSA9IG1hdFs0XTtcbiAgICAgICAgZGVzdFs1XSA9IG1hdFs1XTtcbiAgICAgICAgZGVzdFs2XSA9IG1hdFs2XTtcbiAgICAgICAgZGVzdFs3XSA9IG1hdFs3XTtcbiAgICAgICAgZGVzdFs4XSA9IG1hdFs4XTtcbiAgICAgICAgZGVzdFs5XSA9IG1hdFs5XTtcbiAgICAgICAgZGVzdFsxMF0gPSBtYXRbMTBdO1xuICAgICAgICBkZXN0WzExXSA9IG1hdFsxMV07XG4gICAgICAgIGRlc3RbMTJdID0gbWF0WzBdICogdmVjWzBdICsgbWF0WzRdICogdmVjWzFdICsgbWF0WzhdICogdmVjWzJdICsgbWF0WzEyXTtcbiAgICAgICAgZGVzdFsxM10gPSBtYXRbMV0gKiB2ZWNbMF0gKyBtYXRbNV0gKiB2ZWNbMV0gKyBtYXRbOV0gKiB2ZWNbMl0gKyBtYXRbMTNdO1xuICAgICAgICBkZXN0WzE0XSA9IG1hdFsyXSAqIHZlY1swXSArIG1hdFs2XSAqIHZlY1sxXSArIG1hdFsxMF0gKiB2ZWNbMl0gKyBtYXRbMTRdO1xuICAgICAgICBkZXN0WzE1XSA9IG1hdFszXSAqIHZlY1swXSArIG1hdFs3XSAqIHZlY1sxXSArIG1hdFsxMV0gKiB2ZWNbMl0gKyBtYXRbMTVdO1xuICAgICAgICByZXR1cm4gZGVzdDtcbiAgICB9O1xuICAgIHJvdGF0ZSAobWF0LCBhbmdsZSwgYXhpcywgZGVzdCkge1xuICAgICAgICBsZXQgc3EgPSBNYXRoLnNxcnQoYXhpc1swXSAqIGF4aXNbMF0gKyBheGlzWzFdICogYXhpc1sxXSArIGF4aXNbMl0gKiBheGlzWzJdKTtcbiAgICAgICAgaWYgKCFzcSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGEgPSBheGlzWzBdLCBiID0gYXhpc1sxXSwgYyA9IGF4aXNbMl07XG4gICAgICAgIGlmIChzcSAhPSAxKSB7XG4gICAgICAgICAgICBzcSA9IDEgLyBzcTtcbiAgICAgICAgICAgIGEgKj0gc3E7XG4gICAgICAgICAgICBiICo9IHNxO1xuICAgICAgICAgICAgYyAqPSBzcTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZCA9IE1hdGguc2luKGFuZ2xlKSwgZSA9IE1hdGguY29zKGFuZ2xlKSwgZiA9IDEgLSBlLFxuICAgICAgICAgICAgZyA9IG1hdFswXSwgaCA9IG1hdFsxXSwgaSA9IG1hdFsyXSwgaiA9IG1hdFszXSxcbiAgICAgICAgICAgIGsgPSBtYXRbNF0sIGwgPSBtYXRbNV0sIG0gPSBtYXRbNl0sIG4gPSBtYXRbN10sXG4gICAgICAgICAgICBvID0gbWF0WzhdLCBwID0gbWF0WzldLCBxID0gbWF0WzEwXSwgciA9IG1hdFsxMV0sXG4gICAgICAgICAgICBzID0gYSAqIGEgKiBmICsgZSxcbiAgICAgICAgICAgIHQgPSBiICogYSAqIGYgKyBjICogZCxcbiAgICAgICAgICAgIHUgPSBjICogYSAqIGYgLSBiICogZCxcbiAgICAgICAgICAgIHYgPSBhICogYiAqIGYgLSBjICogZCxcbiAgICAgICAgICAgIHcgPSBiICogYiAqIGYgKyBlLFxuICAgICAgICAgICAgeCA9IGMgKiBiICogZiArIGEgKiBkLFxuICAgICAgICAgICAgeSA9IGEgKiBjICogZiArIGIgKiBkLFxuICAgICAgICAgICAgeiA9IGIgKiBjICogZiAtIGEgKiBkLFxuICAgICAgICAgICAgQSA9IGMgKiBjICogZiArIGU7XG4gICAgICAgIGlmIChhbmdsZSkge1xuICAgICAgICAgICAgaWYgKG1hdCAhPSBkZXN0KSB7XG4gICAgICAgICAgICAgICAgZGVzdFsxMl0gPSBtYXRbMTJdO1xuICAgICAgICAgICAgICAgIGRlc3RbMTNdID0gbWF0WzEzXTtcbiAgICAgICAgICAgICAgICBkZXN0WzE0XSA9IG1hdFsxNF07XG4gICAgICAgICAgICAgICAgZGVzdFsxNV0gPSBtYXRbMTVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGVzdCA9IG1hdDtcbiAgICAgICAgfVxuICAgICAgICBkZXN0WzBdID0gZyAqIHMgKyBrICogdCArIG8gKiB1O1xuICAgICAgICBkZXN0WzFdID0gaCAqIHMgKyBsICogdCArIHAgKiB1O1xuICAgICAgICBkZXN0WzJdID0gaSAqIHMgKyBtICogdCArIHEgKiB1O1xuICAgICAgICBkZXN0WzNdID0gaiAqIHMgKyBuICogdCArIHIgKiB1O1xuICAgICAgICBkZXN0WzRdID0gZyAqIHYgKyBrICogdyArIG8gKiB4O1xuICAgICAgICBkZXN0WzVdID0gaCAqIHYgKyBsICogdyArIHAgKiB4O1xuICAgICAgICBkZXN0WzZdID0gaSAqIHYgKyBtICogdyArIHEgKiB4O1xuICAgICAgICBkZXN0WzddID0gaiAqIHYgKyBuICogdyArIHIgKiB4O1xuICAgICAgICBkZXN0WzhdID0gZyAqIHkgKyBrICogeiArIG8gKiBBO1xuICAgICAgICBkZXN0WzldID0gaCAqIHkgKyBsICogeiArIHAgKiBBO1xuICAgICAgICBkZXN0WzEwXSA9IGkgKiB5ICsgbSAqIHogKyBxICogQTtcbiAgICAgICAgZGVzdFsxMV0gPSBqICogeSArIG4gKiB6ICsgciAqIEE7XG4gICAgICAgIHJldHVybiBkZXN0O1xuICAgIH07XG4gICAgbG9va0F0IChleWUsIGNlbnRlciwgdXAsIGRlc3QpIHtcbiAgICAgICAgbGV0IGV5ZVggPSBleWVbMF0sIGV5ZVkgPSBleWVbMV0sIGV5ZVogPSBleWVbMl0sXG4gICAgICAgICAgICB1cFggPSB1cFswXSwgdXBZID0gdXBbMV0sIHVwWiA9IHVwWzJdLFxuICAgICAgICAgICAgY2VudGVyWCA9IGNlbnRlclswXSwgY2VudGVyWSA9IGNlbnRlclsxXSwgY2VudGVyWiA9IGNlbnRlclsyXTtcbiAgICAgICAgaWYgKGV5ZVggPT0gY2VudGVyWCAmJiBleWVZID09IGNlbnRlclkgJiYgZXllWiA9PSBjZW50ZXJaKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pZGVudGl0eShkZXN0KTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgeDAsIHgxLCB4MiwgeTAsIHkxLCB5MiwgejAsIHoxLCB6MiwgbDtcbiAgICAgICAgejAgPSBleWVYIC0gY2VudGVyWzBdO1xuICAgICAgICB6MSA9IGV5ZVkgLSBjZW50ZXJbMV07XG4gICAgICAgIHoyID0gZXllWiAtIGNlbnRlclsyXTtcbiAgICAgICAgbCA9IDEgLyBNYXRoLnNxcnQoejAgKiB6MCArIHoxICogejEgKyB6MiAqIHoyKTtcbiAgICAgICAgejAgKj0gbDtcbiAgICAgICAgejEgKj0gbDtcbiAgICAgICAgejIgKj0gbDtcbiAgICAgICAgeDAgPSB1cFkgKiB6MiAtIHVwWiAqIHoxO1xuICAgICAgICB4MSA9IHVwWiAqIHowIC0gdXBYICogejI7XG4gICAgICAgIHgyID0gdXBYICogejEgLSB1cFkgKiB6MDtcbiAgICAgICAgbCA9IE1hdGguc3FydCh4MCAqIHgwICsgeDEgKiB4MSArIHgyICogeDIpO1xuICAgICAgICBpZiAoIWwpIHtcbiAgICAgICAgICAgIHgwID0gMDtcbiAgICAgICAgICAgIHgxID0gMDtcbiAgICAgICAgICAgIHgyID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGwgPSAxIC8gbDtcbiAgICAgICAgICAgIHgwICo9IGw7XG4gICAgICAgICAgICB4MSAqPSBsO1xuICAgICAgICAgICAgeDIgKj0gbDtcbiAgICAgICAgfVxuICAgICAgICB5MCA9IHoxICogeDIgLSB6MiAqIHgxO1xuICAgICAgICB5MSA9IHoyICogeDAgLSB6MCAqIHgyO1xuICAgICAgICB5MiA9IHowICogeDEgLSB6MSAqIHgwO1xuICAgICAgICBsID0gTWF0aC5zcXJ0KHkwICogeTAgKyB5MSAqIHkxICsgeTIgKiB5Mik7XG4gICAgICAgIGlmICghbCkge1xuICAgICAgICAgICAgeTAgPSAwO1xuICAgICAgICAgICAgeTEgPSAwO1xuICAgICAgICAgICAgeTIgPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbCA9IDEgLyBsO1xuICAgICAgICAgICAgeTAgKj0gbDtcbiAgICAgICAgICAgIHkxICo9IGw7XG4gICAgICAgICAgICB5MiAqPSBsO1xuICAgICAgICB9XG4gICAgICAgIGRlc3RbMF0gPSB4MDtcbiAgICAgICAgZGVzdFsxXSA9IHkwO1xuICAgICAgICBkZXN0WzJdID0gejA7XG4gICAgICAgIGRlc3RbM10gPSAwO1xuICAgICAgICBkZXN0WzRdID0geDE7XG4gICAgICAgIGRlc3RbNV0gPSB5MTtcbiAgICAgICAgZGVzdFs2XSA9IHoxO1xuICAgICAgICBkZXN0WzddID0gMDtcbiAgICAgICAgZGVzdFs4XSA9IHgyO1xuICAgICAgICBkZXN0WzldID0geTI7XG4gICAgICAgIGRlc3RbMTBdID0gejI7XG4gICAgICAgIGRlc3RbMTFdID0gMDtcbiAgICAgICAgZGVzdFsxMl0gPSAtKHgwICogZXllWCArIHgxICogZXllWSArIHgyICogZXllWik7XG4gICAgICAgIGRlc3RbMTNdID0gLSh5MCAqIGV5ZVggKyB5MSAqIGV5ZVkgKyB5MiAqIGV5ZVopO1xuICAgICAgICBkZXN0WzE0XSA9IC0oejAgKiBleWVYICsgejEgKiBleWVZICsgejIgKiBleWVaKTtcbiAgICAgICAgZGVzdFsxNV0gPSAxO1xuICAgICAgICByZXR1cm4gZGVzdDtcbiAgICB9O1xuICAgIHBlcnNwZWN0aXZlIChmb3Z5LCBhc3BlY3QsIG5lYXIsIGZhciwgZGVzdCkge1xuICAgICAgICBsZXQgdCA9IG5lYXIgKiBNYXRoLnRhbihmb3Z5ICogTWF0aC5QSSAvIDM2MCk7XG4gICAgICAgIGxldCByID0gdCAqIGFzcGVjdDtcbiAgICAgICAgbGV0IGEgPSByICogMiwgYiA9IHQgKiAyLCBjID0gZmFyIC0gbmVhcjtcbiAgICAgICAgZGVzdFswXSA9IG5lYXIgKiAyIC8gYTtcbiAgICAgICAgZGVzdFsxXSA9IDA7XG4gICAgICAgIGRlc3RbMl0gPSAwO1xuICAgICAgICBkZXN0WzNdID0gMDtcbiAgICAgICAgZGVzdFs0XSA9IDA7XG4gICAgICAgIGRlc3RbNV0gPSBuZWFyICogMiAvIGI7XG4gICAgICAgIGRlc3RbNl0gPSAwO1xuICAgICAgICBkZXN0WzddID0gMDtcbiAgICAgICAgZGVzdFs4XSA9IDA7XG4gICAgICAgIGRlc3RbOV0gPSAwO1xuICAgICAgICBkZXN0WzEwXSA9IC0oZmFyICsgbmVhcikgLyBjO1xuICAgICAgICBkZXN0WzExXSA9IC0xO1xuICAgICAgICBkZXN0WzEyXSA9IDA7XG4gICAgICAgIGRlc3RbMTNdID0gMDtcbiAgICAgICAgZGVzdFsxNF0gPSAtKGZhciAqIG5lYXIgKiAyKSAvIGM7XG4gICAgICAgIGRlc3RbMTVdID0gMDtcbiAgICAgICAgcmV0dXJuIGRlc3Q7XG4gICAgfTtcbiAgICBvcnRobyAobGVmdCwgcmlnaHQsIHRvcCwgYm90dG9tLCBuZWFyLCBmYXIsIGRlc3QpIHtcbiAgICAgICAgbGV0IGggPSAocmlnaHQgLSBsZWZ0KTtcbiAgICAgICAgbGV0IHYgPSAodG9wIC0gYm90dG9tKTtcbiAgICAgICAgbGV0IGQgPSAoZmFyIC0gbmVhcik7XG4gICAgICAgIGRlc3RbMF0gPSAyIC8gaDtcbiAgICAgICAgZGVzdFsxXSA9IDA7XG4gICAgICAgIGRlc3RbMl0gPSAwO1xuICAgICAgICBkZXN0WzNdID0gMDtcbiAgICAgICAgZGVzdFs0XSA9IDA7XG4gICAgICAgIGRlc3RbNV0gPSAyIC8gdjtcbiAgICAgICAgZGVzdFs2XSA9IDA7XG4gICAgICAgIGRlc3RbN10gPSAwO1xuICAgICAgICBkZXN0WzhdID0gMDtcbiAgICAgICAgZGVzdFs5XSA9IDA7XG4gICAgICAgIGRlc3RbMTBdID0gLTIgLyBkO1xuICAgICAgICBkZXN0WzExXSA9IDA7XG4gICAgICAgIGRlc3RbMTJdID0gLShsZWZ0ICsgcmlnaHQpIC8gaDtcbiAgICAgICAgZGVzdFsxM10gPSAtKHRvcCArIGJvdHRvbSkgLyB2O1xuICAgICAgICBkZXN0WzE0XSA9IC0oZmFyICsgbmVhcikgLyBkO1xuICAgICAgICBkZXN0WzE1XSA9IDE7XG4gICAgICAgIHJldHVybiBkZXN0O1xuICAgIH07XG4gICAgdHJhbnNwb3NlIChtYXQsIGRlc3QpIHtcbiAgICAgICAgZGVzdFswXSA9IG1hdFswXTtcbiAgICAgICAgZGVzdFsxXSA9IG1hdFs0XTtcbiAgICAgICAgZGVzdFsyXSA9IG1hdFs4XTtcbiAgICAgICAgZGVzdFszXSA9IG1hdFsxMl07XG4gICAgICAgIGRlc3RbNF0gPSBtYXRbMV07XG4gICAgICAgIGRlc3RbNV0gPSBtYXRbNV07XG4gICAgICAgIGRlc3RbNl0gPSBtYXRbOV07XG4gICAgICAgIGRlc3RbN10gPSBtYXRbMTNdO1xuICAgICAgICBkZXN0WzhdID0gbWF0WzJdO1xuICAgICAgICBkZXN0WzldID0gbWF0WzZdO1xuICAgICAgICBkZXN0WzEwXSA9IG1hdFsxMF07XG4gICAgICAgIGRlc3RbMTFdID0gbWF0WzE0XTtcbiAgICAgICAgZGVzdFsxMl0gPSBtYXRbM107XG4gICAgICAgIGRlc3RbMTNdID0gbWF0WzddO1xuICAgICAgICBkZXN0WzE0XSA9IG1hdFsxMV07XG4gICAgICAgIGRlc3RbMTVdID0gbWF0WzE1XTtcbiAgICAgICAgcmV0dXJuIGRlc3Q7XG4gICAgfTtcbiAgICBpbnZlcnNlIChtYXQsIGRlc3QpIHtcbiAgICAgICAgbGV0IGEgPSBtYXRbMF0sIGIgPSBtYXRbMV0sIGMgPSBtYXRbMl0sIGQgPSBtYXRbM10sXG4gICAgICAgICAgICBlID0gbWF0WzRdLCBmID0gbWF0WzVdLCBnID0gbWF0WzZdLCBoID0gbWF0WzddLFxuICAgICAgICAgICAgaSA9IG1hdFs4XSwgaiA9IG1hdFs5XSwgayA9IG1hdFsxMF0sIGwgPSBtYXRbMTFdLFxuICAgICAgICAgICAgbSA9IG1hdFsxMl0sIG4gPSBtYXRbMTNdLCBvID0gbWF0WzE0XSwgcCA9IG1hdFsxNV0sXG4gICAgICAgICAgICBxID0gYSAqIGYgLSBiICogZSwgciA9IGEgKiBnIC0gYyAqIGUsXG4gICAgICAgICAgICBzID0gYSAqIGggLSBkICogZSwgdCA9IGIgKiBnIC0gYyAqIGYsXG4gICAgICAgICAgICB1ID0gYiAqIGggLSBkICogZiwgdiA9IGMgKiBoIC0gZCAqIGcsXG4gICAgICAgICAgICB3ID0gaSAqIG4gLSBqICogbSwgeCA9IGkgKiBvIC0gayAqIG0sXG4gICAgICAgICAgICB5ID0gaSAqIHAgLSBsICogbSwgeiA9IGogKiBvIC0gayAqIG4sXG4gICAgICAgICAgICBBID0gaiAqIHAgLSBsICogbiwgQiA9IGsgKiBwIC0gbCAqIG8sXG4gICAgICAgICAgICBpdmQgPSAxIC8gKHEgKiBCIC0gciAqIEEgKyBzICogeiArIHQgKiB5IC0gdSAqIHggKyB2ICogdyk7XG4gICAgICAgIGRlc3RbMF0gPSAoIGYgKiBCIC0gZyAqIEEgKyBoICogeikgKiBpdmQ7XG4gICAgICAgIGRlc3RbMV0gPSAoLWIgKiBCICsgYyAqIEEgLSBkICogeikgKiBpdmQ7XG4gICAgICAgIGRlc3RbMl0gPSAoIG4gKiB2IC0gbyAqIHUgKyBwICogdCkgKiBpdmQ7XG4gICAgICAgIGRlc3RbM10gPSAoLWogKiB2ICsgayAqIHUgLSBsICogdCkgKiBpdmQ7XG4gICAgICAgIGRlc3RbNF0gPSAoLWUgKiBCICsgZyAqIHkgLSBoICogeCkgKiBpdmQ7XG4gICAgICAgIGRlc3RbNV0gPSAoIGEgKiBCIC0gYyAqIHkgKyBkICogeCkgKiBpdmQ7XG4gICAgICAgIGRlc3RbNl0gPSAoLW0gKiB2ICsgbyAqIHMgLSBwICogcikgKiBpdmQ7XG4gICAgICAgIGRlc3RbN10gPSAoIGkgKiB2IC0gayAqIHMgKyBsICogcikgKiBpdmQ7XG4gICAgICAgIGRlc3RbOF0gPSAoIGUgKiBBIC0gZiAqIHkgKyBoICogdykgKiBpdmQ7XG4gICAgICAgIGRlc3RbOV0gPSAoLWEgKiBBICsgYiAqIHkgLSBkICogdykgKiBpdmQ7XG4gICAgICAgIGRlc3RbMTBdID0gKCBtICogdSAtIG4gKiBzICsgcCAqIHEpICogaXZkO1xuICAgICAgICBkZXN0WzExXSA9ICgtaSAqIHUgKyBqICogcyAtIGwgKiBxKSAqIGl2ZDtcbiAgICAgICAgZGVzdFsxMl0gPSAoLWUgKiB6ICsgZiAqIHggLSBnICogdykgKiBpdmQ7XG4gICAgICAgIGRlc3RbMTNdID0gKCBhICogeiAtIGIgKiB4ICsgYyAqIHcpICogaXZkO1xuICAgICAgICBkZXN0WzE0XSA9ICgtbSAqIHQgKyBuICogciAtIG8gKiBxKSAqIGl2ZDtcbiAgICAgICAgZGVzdFsxNV0gPSAoIGkgKiB0IC0gaiAqIHIgKyBrICogcSkgKiBpdmQ7XG4gICAgICAgIHJldHVybiBkZXN0O1xuICAgIH07XG59XG5cbmV4cG9ydCBjbGFzcyBxdG5JViB7XG4gICAgY3JlYXRlICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoNCk7XG4gICAgfTtcbiAgICBpZGVudGl0eSAoZGVzdCkge1xuICAgICAgICBkZXN0WzBdID0gMDtcbiAgICAgICAgZGVzdFsxXSA9IDA7XG4gICAgICAgIGRlc3RbMl0gPSAwO1xuICAgICAgICBkZXN0WzNdID0gMTtcbiAgICAgICAgcmV0dXJuIGRlc3Q7XG4gICAgfTtcbiAgICBpbnZlcnNlIChxdG4sIGRlc3QpIHtcbiAgICAgICAgZGVzdFswXSA9IC1xdG5bMF07XG4gICAgICAgIGRlc3RbMV0gPSAtcXRuWzFdO1xuICAgICAgICBkZXN0WzJdID0gLXF0blsyXTtcbiAgICAgICAgZGVzdFszXSA9IHF0blszXTtcbiAgICAgICAgcmV0dXJuIGRlc3Q7XG4gICAgfTtcbiAgICBub3JtYWxpemUgKGRlc3QpIHtcbiAgICAgICAgbGV0IHggPSBkZXN0WzBdLCB5ID0gZGVzdFsxXSwgeiA9IGRlc3RbMl0sIHcgPSBkZXN0WzNdO1xuICAgICAgICBsZXQgbCA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5ICsgeiAqIHogKyB3ICogdyk7XG4gICAgICAgIGlmIChsID09PSAwKSB7XG4gICAgICAgICAgICBkZXN0WzBdID0gMDtcbiAgICAgICAgICAgIGRlc3RbMV0gPSAwO1xuICAgICAgICAgICAgZGVzdFsyXSA9IDA7XG4gICAgICAgICAgICBkZXN0WzNdID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGwgPSAxIC8gbDtcbiAgICAgICAgICAgIGRlc3RbMF0gPSB4ICogbDtcbiAgICAgICAgICAgIGRlc3RbMV0gPSB5ICogbDtcbiAgICAgICAgICAgIGRlc3RbMl0gPSB6ICogbDtcbiAgICAgICAgICAgIGRlc3RbM10gPSB3ICogbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVzdDtcbiAgICB9O1xuICAgIG11bHRpcGx5IChxdG4xLCBxdG4yLCBkZXN0KSB7XG4gICAgICAgIGxldCBheCA9IHF0bjFbMF0sIGF5ID0gcXRuMVsxXSwgYXogPSBxdG4xWzJdLCBhdyA9IHF0bjFbM107XG4gICAgICAgIGxldCBieCA9IHF0bjJbMF0sIGJ5ID0gcXRuMlsxXSwgYnogPSBxdG4yWzJdLCBidyA9IHF0bjJbM107XG4gICAgICAgIGRlc3RbMF0gPSBheCAqIGJ3ICsgYXcgKiBieCArIGF5ICogYnogLSBheiAqIGJ5O1xuICAgICAgICBkZXN0WzFdID0gYXkgKiBidyArIGF3ICogYnkgKyBheiAqIGJ4IC0gYXggKiBiejtcbiAgICAgICAgZGVzdFsyXSA9IGF6ICogYncgKyBhdyAqIGJ6ICsgYXggKiBieSAtIGF5ICogYng7XG4gICAgICAgIGRlc3RbM10gPSBhdyAqIGJ3IC0gYXggKiBieCAtIGF5ICogYnkgLSBheiAqIGJ6O1xuICAgICAgICByZXR1cm4gZGVzdDtcbiAgICB9O1xuICAgIHJvdGF0ZSAoYW5nbGUsIGF4aXMsIGRlc3QpIHtcbiAgICAgICAgbGV0IHNxID0gTWF0aC5zcXJ0KGF4aXNbMF0gKiBheGlzWzBdICsgYXhpc1sxXSAqIGF4aXNbMV0gKyBheGlzWzJdICogYXhpc1syXSk7XG4gICAgICAgIGlmICghc3EpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGxldCBhID0gYXhpc1swXSwgYiA9IGF4aXNbMV0sIGMgPSBheGlzWzJdO1xuICAgICAgICBpZiAoc3EgIT0gMSkge1xuICAgICAgICAgICAgc3EgPSAxIC8gc3E7XG4gICAgICAgICAgICBhICo9IHNxO1xuICAgICAgICAgICAgYiAqPSBzcTtcbiAgICAgICAgICAgIGMgKj0gc3E7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHMgPSBNYXRoLnNpbihhbmdsZSAqIDAuNSk7XG4gICAgICAgIGRlc3RbMF0gPSBhICogcztcbiAgICAgICAgZGVzdFsxXSA9IGIgKiBzO1xuICAgICAgICBkZXN0WzJdID0gYyAqIHM7XG4gICAgICAgIGRlc3RbM10gPSBNYXRoLmNvcyhhbmdsZSAqIDAuNSk7XG4gICAgICAgIHJldHVybiBkZXN0O1xuICAgIH07XG4gICAgdG9WZWNJSUkgKHZlYywgcXRuLCBkZXN0KSB7XG4gICAgICAgIGxldCBxcCA9IHRoaXMuY3JlYXRlKCk7XG4gICAgICAgIGxldCBxcSA9IHRoaXMuY3JlYXRlKCk7XG4gICAgICAgIGxldCBxciA9IHRoaXMuY3JlYXRlKCk7XG4gICAgICAgIHRoaXMuaW52ZXJzZShxdG4sIHFyKTtcbiAgICAgICAgcXBbMF0gPSB2ZWNbMF07XG4gICAgICAgIHFwWzFdID0gdmVjWzFdO1xuICAgICAgICBxcFsyXSA9IHZlY1syXTtcbiAgICAgICAgdGhpcy5tdWx0aXBseShxciwgcXAsIHFxKTtcbiAgICAgICAgdGhpcy5tdWx0aXBseShxcSwgcXRuLCBxcik7XG4gICAgICAgIGRlc3RbMF0gPSBxclswXTtcbiAgICAgICAgZGVzdFsxXSA9IHFyWzFdO1xuICAgICAgICBkZXN0WzJdID0gcXJbMl07XG4gICAgICAgIHJldHVybiBkZXN0O1xuICAgIH07XG4gICAgdG9NYXRJViAocXRuLCBkZXN0KSB7XG4gICAgICAgIGxldCB4ID0gcXRuWzBdLCB5ID0gcXRuWzFdLCB6ID0gcXRuWzJdLCB3ID0gcXRuWzNdO1xuICAgICAgICBsZXQgeDIgPSB4ICsgeCwgeTIgPSB5ICsgeSwgejIgPSB6ICsgejtcbiAgICAgICAgbGV0IHh4ID0geCAqIHgyLCB4eSA9IHggKiB5MiwgeHogPSB4ICogejI7XG4gICAgICAgIGxldCB5eSA9IHkgKiB5MiwgeXogPSB5ICogejIsIHp6ID0geiAqIHoyO1xuICAgICAgICBsZXQgd3ggPSB3ICogeDIsIHd5ID0gdyAqIHkyLCB3eiA9IHcgKiB6MjtcbiAgICAgICAgZGVzdFswXSA9IDEgLSAoeXkgKyB6eik7XG4gICAgICAgIGRlc3RbMV0gPSB4eSAtIHd6O1xuICAgICAgICBkZXN0WzJdID0geHogKyB3eTtcbiAgICAgICAgZGVzdFszXSA9IDA7XG4gICAgICAgIGRlc3RbNF0gPSB4eSArIHd6O1xuICAgICAgICBkZXN0WzVdID0gMSAtICh4eCArIHp6KTtcbiAgICAgICAgZGVzdFs2XSA9IHl6IC0gd3g7XG4gICAgICAgIGRlc3RbN10gPSAwO1xuICAgICAgICBkZXN0WzhdID0geHogLSB3eTtcbiAgICAgICAgZGVzdFs5XSA9IHl6ICsgd3g7XG4gICAgICAgIGRlc3RbMTBdID0gMSAtICh4eCArIHl5KTtcbiAgICAgICAgZGVzdFsxMV0gPSAwO1xuICAgICAgICBkZXN0WzEyXSA9IDA7XG4gICAgICAgIGRlc3RbMTNdID0gMDtcbiAgICAgICAgZGVzdFsxNF0gPSAwO1xuICAgICAgICBkZXN0WzE1XSA9IDE7XG4gICAgICAgIHJldHVybiBkZXN0O1xuICAgIH07XG4gICAgc2xlcnAgKHF0bjEsIHF0bjIsIHRpbWUsIGRlc3QpIHtcbiAgICAgICAgbGV0IGh0ID0gcXRuMVswXSAqIHF0bjJbMF0gKyBxdG4xWzFdICogcXRuMlsxXSArIHF0bjFbMl0gKiBxdG4yWzJdICsgcXRuMVszXSAqIHF0bjJbM107XG4gICAgICAgIGxldCBocyA9IDEuMCAtIGh0ICogaHQ7XG4gICAgICAgIGlmIChocyA8PSAwLjApIHtcbiAgICAgICAgICAgIGRlc3RbMF0gPSBxdG4xWzBdO1xuICAgICAgICAgICAgZGVzdFsxXSA9IHF0bjFbMV07XG4gICAgICAgICAgICBkZXN0WzJdID0gcXRuMVsyXTtcbiAgICAgICAgICAgIGRlc3RbM10gPSBxdG4xWzNdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaHMgPSBNYXRoLnNxcnQoaHMpO1xuICAgICAgICAgICAgaWYgKE1hdGguYWJzKGhzKSA8IDAuMDAwMSkge1xuICAgICAgICAgICAgICAgIGRlc3RbMF0gPSAocXRuMVswXSAqIDAuNSArIHF0bjJbMF0gKiAwLjUpO1xuICAgICAgICAgICAgICAgIGRlc3RbMV0gPSAocXRuMVsxXSAqIDAuNSArIHF0bjJbMV0gKiAwLjUpO1xuICAgICAgICAgICAgICAgIGRlc3RbMl0gPSAocXRuMVsyXSAqIDAuNSArIHF0bjJbMl0gKiAwLjUpO1xuICAgICAgICAgICAgICAgIGRlc3RbM10gPSAocXRuMVszXSAqIDAuNSArIHF0bjJbM10gKiAwLjUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgcGggPSBNYXRoLmFjb3MoaHQpO1xuICAgICAgICAgICAgICAgIGxldCBwdCA9IHBoICogdGltZTtcbiAgICAgICAgICAgICAgICBsZXQgdDAgPSBNYXRoLnNpbihwaCAtIHB0KSAvIGhzO1xuICAgICAgICAgICAgICAgIGxldCB0MSA9IE1hdGguc2luKHB0KSAvIGhzO1xuICAgICAgICAgICAgICAgIGRlc3RbMF0gPSBxdG4xWzBdICogdDAgKyBxdG4yWzBdICogdDE7XG4gICAgICAgICAgICAgICAgZGVzdFsxXSA9IHF0bjFbMV0gKiB0MCArIHF0bjJbMV0gKiB0MTtcbiAgICAgICAgICAgICAgICBkZXN0WzJdID0gcXRuMVsyXSAqIHQwICsgcXRuMlsyXSAqIHQxO1xuICAgICAgICAgICAgICAgIGRlc3RbM10gPSBxdG4xWzNdICogdDAgKyBxdG4yWzNdICogdDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlc3Q7XG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvcnVzKHJvdywgY29sdW1uLCBpcmFkLCBvcmFkLCBjb2xvcikge1xuICAgIGxldCBpLCBqLCB0YztcbiAgICBsZXQgcG9zID0gbmV3IEFycmF5KCksIG5vciA9IG5ldyBBcnJheSgpLFxuICAgICAgICBjb2wgPSBuZXcgQXJyYXkoKSwgc3QgPSBuZXcgQXJyYXkoKSwgaWR4ID0gbmV3IEFycmF5KCk7XG4gICAgZm9yIChpID0gMDsgaSA8PSByb3c7IGkrKykge1xuICAgICAgICBsZXQgciA9IE1hdGguUEkgKiAyIC8gcm93ICogaTtcbiAgICAgICAgbGV0IHJyID0gTWF0aC5jb3Mocik7XG4gICAgICAgIGxldCByeSA9IE1hdGguc2luKHIpO1xuICAgICAgICBmb3IgKGogPSAwOyBqIDw9IGNvbHVtbjsgaisrKSB7XG4gICAgICAgICAgICBsZXQgdHIgPSBNYXRoLlBJICogMiAvIGNvbHVtbiAqIGo7XG4gICAgICAgICAgICBsZXQgdHggPSAocnIgKiBpcmFkICsgb3JhZCkgKiBNYXRoLmNvcyh0cik7XG4gICAgICAgICAgICBsZXQgdHkgPSByeSAqIGlyYWQ7XG4gICAgICAgICAgICBsZXQgdHogPSAocnIgKiBpcmFkICsgb3JhZCkgKiBNYXRoLnNpbih0cik7XG4gICAgICAgICAgICBsZXQgcnggPSByciAqIE1hdGguY29zKHRyKTtcbiAgICAgICAgICAgIGxldCByeiA9IHJyICogTWF0aC5zaW4odHIpO1xuICAgICAgICAgICAgaWYgKGNvbG9yKSB7XG4gICAgICAgICAgICAgICAgdGMgPSBjb2xvcjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGMgPSBoc3ZhKDM2MCAvIGNvbHVtbiAqIGosIDEsIDEsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHJzID0gMSAvIGNvbHVtbiAqIGo7XG4gICAgICAgICAgICBsZXQgcnQgPSAxIC8gcm93ICogaSArIDAuNTtcbiAgICAgICAgICAgIGlmIChydCA+IDEuMCkge1xuICAgICAgICAgICAgICAgIHJ0IC09IDEuMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJ0ID0gMS4wIC0gcnQ7XG4gICAgICAgICAgICBwb3MucHVzaCh0eCwgdHksIHR6KTtcbiAgICAgICAgICAgIG5vci5wdXNoKHJ4LCByeSwgcnopO1xuICAgICAgICAgICAgY29sLnB1c2godGNbMF0sIHRjWzFdLCB0Y1syXSwgdGNbM10pO1xuICAgICAgICAgICAgc3QucHVzaChycywgcnQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZvciAoaSA9IDA7IGkgPCByb3c7IGkrKykge1xuICAgICAgICBmb3IgKGogPSAwOyBqIDwgY29sdW1uOyBqKyspIHtcbiAgICAgICAgICAgIHIgPSAoY29sdW1uICsgMSkgKiBpICsgajtcbiAgICAgICAgICAgIGlkeC5wdXNoKHIsIHIgKyBjb2x1bW4gKyAxLCByICsgMSk7XG4gICAgICAgICAgICBpZHgucHVzaChyICsgY29sdW1uICsgMSwgciArIGNvbHVtbiArIDIsIHIgKyAxKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge3A6IHBvcywgbjogbm9yLCBjOiBjb2wsIHQ6IHN0LCBpOiBpZHh9O1xufVxuXG4vKipcbiAqIOeQg+S9k+OBrumggueCueODh+ODvOOCv+eUn+aIkFxuICogQHBhcmFtIHJvd1xuICogQHBhcmFtIGNvbHVtblxuICogQHBhcmFtIHJhZFxuICogQHBhcmFtIGNvbG9yXG4gKiBAcmV0dXJucyB7e3A6IEFycmF5LCBuOiBBcnJheSwgYzogQXJyYXksIHQ6IEFycmF5LCBpOiBBcnJheX19XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzcGhlcmUocm93LCBjb2x1bW4sIHJhZCwgY29sb3IpIHtcbiAgICBsZXQgaSwgaiwgdGM7XG4gICAgbGV0IHBvcyA9IG5ldyBBcnJheSgpLCBub3IgPSBuZXcgQXJyYXkoKSxcbiAgICAgICAgY29sID0gbmV3IEFycmF5KCksIHN0ID0gbmV3IEFycmF5KCksIGlkeCA9IG5ldyBBcnJheSgpO1xuICAgIGZvciAoaSA9IDA7IGkgPD0gcm93OyBpKyspIHtcbiAgICAgICAgbGV0IHIgPSBNYXRoLlBJIC8gcm93ICogaTtcbiAgICAgICAgbGV0IHJ5ID0gTWF0aC5jb3Mocik7XG4gICAgICAgIGxldCByciA9IE1hdGguc2luKHIpO1xuICAgICAgICBmb3IgKGogPSAwOyBqIDw9IGNvbHVtbjsgaisrKSB7XG4gICAgICAgICAgICBsZXQgdHIgPSBNYXRoLlBJICogMiAvIGNvbHVtbiAqIGo7XG4gICAgICAgICAgICBsZXQgdHggPSByciAqIHJhZCAqIE1hdGguY29zKHRyKTtcbiAgICAgICAgICAgIGxldCB0eSA9IHJ5ICogcmFkO1xuICAgICAgICAgICAgbGV0IHR6ID0gcnIgKiByYWQgKiBNYXRoLnNpbih0cik7XG4gICAgICAgICAgICBsZXQgcnggPSByciAqIE1hdGguY29zKHRyKTtcbiAgICAgICAgICAgIGxldCByeiA9IHJyICogTWF0aC5zaW4odHIpO1xuICAgICAgICAgICAgaWYgKGNvbG9yKSB7XG4gICAgICAgICAgICAgICAgdGMgPSBjb2xvcjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGMgPSBoc3ZhKDM2MCAvIHJvdyAqIGksIDEsIDEsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcG9zLnB1c2godHgsIHR5LCB0eik7XG4gICAgICAgICAgICBub3IucHVzaChyeCwgcnksIHJ6KTtcbiAgICAgICAgICAgIGNvbC5wdXNoKHRjWzBdLCB0Y1sxXSwgdGNbMl0sIHRjWzNdKTtcbiAgICAgICAgICAgIHN0LnB1c2goMSAtIDEgLyBjb2x1bW4gKiBqLCAxIC8gcm93ICogaSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbGV0IHIgPSAwO1xuICAgIGZvciAoaSA9IDA7IGkgPCByb3c7IGkrKykge1xuICAgICAgICBmb3IgKGogPSAwOyBqIDwgY29sdW1uOyBqKyspIHtcbiAgICAgICAgICAgIHIgPSAoY29sdW1uICsgMSkgKiBpICsgajtcbiAgICAgICAgICAgIGlkeC5wdXNoKHIsIHIgKyAxLCByICsgY29sdW1uICsgMik7XG4gICAgICAgICAgICBpZHgucHVzaChyLCByICsgY29sdW1uICsgMiwgciArIGNvbHVtbiArIDEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7cDogcG9zLCBuOiBub3IsIGM6IGNvbCwgdDogc3QsIGk6IGlkeH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjdWJlKHNpZGUsIGNvbG9yKSB7XG4gICAgbGV0IHRjLCBocyA9IHNpZGUgKiAwLjU7XG4gICAgbGV0IHBvcyA9IFtcbiAgICAgICAgLWhzLCAtaHMsIGhzLCBocywgLWhzLCBocywgaHMsIGhzLCBocywgLWhzLCBocywgaHMsXG4gICAgICAgIC1ocywgLWhzLCAtaHMsIC1ocywgaHMsIC1ocywgaHMsIGhzLCAtaHMsIGhzLCAtaHMsIC1ocyxcbiAgICAgICAgLWhzLCBocywgLWhzLCAtaHMsIGhzLCBocywgaHMsIGhzLCBocywgaHMsIGhzLCAtaHMsXG4gICAgICAgIC1ocywgLWhzLCAtaHMsIGhzLCAtaHMsIC1ocywgaHMsIC1ocywgaHMsIC1ocywgLWhzLCBocyxcbiAgICAgICAgaHMsIC1ocywgLWhzLCBocywgaHMsIC1ocywgaHMsIGhzLCBocywgaHMsIC1ocywgaHMsXG4gICAgICAgIC1ocywgLWhzLCAtaHMsIC1ocywgLWhzLCBocywgLWhzLCBocywgaHMsIC1ocywgaHMsIC1oc1xuICAgIF07XG4gICAgbGV0IG5vciA9IFtcbiAgICAgICAgLTEuMCwgLTEuMCwgMS4wLCAxLjAsIC0xLjAsIDEuMCwgMS4wLCAxLjAsIDEuMCwgLTEuMCwgMS4wLCAxLjAsXG4gICAgICAgIC0xLjAsIC0xLjAsIC0xLjAsIC0xLjAsIDEuMCwgLTEuMCwgMS4wLCAxLjAsIC0xLjAsIDEuMCwgLTEuMCwgLTEuMCxcbiAgICAgICAgLTEuMCwgMS4wLCAtMS4wLCAtMS4wLCAxLjAsIDEuMCwgMS4wLCAxLjAsIDEuMCwgMS4wLCAxLjAsIC0xLjAsXG4gICAgICAgIC0xLjAsIC0xLjAsIC0xLjAsIDEuMCwgLTEuMCwgLTEuMCwgMS4wLCAtMS4wLCAxLjAsIC0xLjAsIC0xLjAsIDEuMCxcbiAgICAgICAgMS4wLCAtMS4wLCAtMS4wLCAxLjAsIDEuMCwgLTEuMCwgMS4wLCAxLjAsIDEuMCwgMS4wLCAtMS4wLCAxLjAsXG4gICAgICAgIC0xLjAsIC0xLjAsIC0xLjAsIC0xLjAsIC0xLjAsIDEuMCwgLTEuMCwgMS4wLCAxLjAsIC0xLjAsIDEuMCwgLTEuMFxuICAgIF07XG4gICAgbGV0IGNvbCA9IG5ldyBBcnJheSgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9zLmxlbmd0aCAvIDM7IGkrKykge1xuICAgICAgICBpZiAoY29sb3IpIHtcbiAgICAgICAgICAgIHRjID0gY29sb3I7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0YyA9IGhzdmEoMzYwIC8gcG9zLmxlbmd0aCAvIDMgKiBpLCAxLCAxLCAxKTtcbiAgICAgICAgfVxuICAgICAgICBjb2wucHVzaCh0Y1swXSwgdGNbMV0sIHRjWzJdLCB0Y1szXSk7XG4gICAgfVxuICAgIGxldCBzdCA9IFtcbiAgICAgICAgMC4wLCAwLjAsIDEuMCwgMC4wLCAxLjAsIDEuMCwgMC4wLCAxLjAsXG4gICAgICAgIDAuMCwgMC4wLCAxLjAsIDAuMCwgMS4wLCAxLjAsIDAuMCwgMS4wLFxuICAgICAgICAwLjAsIDAuMCwgMS4wLCAwLjAsIDEuMCwgMS4wLCAwLjAsIDEuMCxcbiAgICAgICAgMC4wLCAwLjAsIDEuMCwgMC4wLCAxLjAsIDEuMCwgMC4wLCAxLjAsXG4gICAgICAgIDAuMCwgMC4wLCAxLjAsIDAuMCwgMS4wLCAxLjAsIDAuMCwgMS4wLFxuICAgICAgICAwLjAsIDAuMCwgMS4wLCAwLjAsIDEuMCwgMS4wLCAwLjAsIDEuMFxuICAgIF07XG4gICAgbGV0IGlkeCA9IFtcbiAgICAgICAgMCwgMSwgMiwgMCwgMiwgMyxcbiAgICAgICAgNCwgNSwgNiwgNCwgNiwgNyxcbiAgICAgICAgOCwgOSwgMTAsIDgsIDEwLCAxMSxcbiAgICAgICAgMTIsIDEzLCAxNCwgMTIsIDE0LCAxNSxcbiAgICAgICAgMTYsIDE3LCAxOCwgMTYsIDE4LCAxOSxcbiAgICAgICAgMjAsIDIxLCAyMiwgMjAsIDIyLCAyM1xuICAgIF07XG4gICAgcmV0dXJuIHtwOiBwb3MsIG46IG5vciwgYzogY29sLCB0OiBzdCwgaTogaWR4fTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhzdmEoaCwgcywgdiwgYSkge1xuICAgIGlmIChzID4gMSB8fCB2ID4gMSB8fCBhID4gMSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCB0aCA9IGggJSAzNjA7XG4gICAgbGV0IGkgPSBNYXRoLmZsb29yKHRoIC8gNjApO1xuICAgIGxldCBmID0gdGggLyA2MCAtIGk7XG4gICAgbGV0IG0gPSB2ICogKDEgLSBzKTtcbiAgICBsZXQgbiA9IHYgKiAoMSAtIHMgKiBmKTtcbiAgICBsZXQgayA9IHYgKiAoMSAtIHMgKiAoMSAtIGYpKTtcbiAgICBsZXQgY29sb3IgPSBuZXcgQXJyYXkoKTtcbiAgICBpZiAoIXMgPiAwICYmICFzIDwgMCkge1xuICAgICAgICBjb2xvci5wdXNoKHYsIHYsIHYsIGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCByID0gbmV3IEFycmF5KHYsIG4sIG0sIG0sIGssIHYpO1xuICAgICAgICBsZXQgZyA9IG5ldyBBcnJheShrLCB2LCB2LCBuLCBtLCBtKTtcbiAgICAgICAgbGV0IGIgPSBuZXcgQXJyYXkobSwgbSwgaywgdiwgdiwgbik7XG4gICAgICAgIGNvbG9yLnB1c2gocltpXSwgZ1tpXSwgYltpXSwgYSk7XG4gICAgfVxuICAgIHJldHVybiBjb2xvcjtcbn1cbiJdfQ==
