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

      // 球体を形成する頂点のデータを受け取る
      this.sphereData = (0, _minMatrix.sphere)(16, 16, 1.0);

      // 頂点データからバッファを生成
      var vertexBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.sphereData.p), this.gl.STATIC_DRAW);

      // シェーダとプログラムオブジェクト
      var vertexSource = document.getElementById('vs').textContent;
      var fragmentSource = document.getElementById('fs').textContent;

      // ユーザー定義のプログラムオブジェクト生成関数
      this.programs = this.createShaderProgram(vertexSource, fragmentSource);

      // プログラムオブジェクトに頂点データを登録
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
      var move = [0.0, 0.0, 0.0];
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
      this.gl.drawArrays(this.gl.TRIANGLES, 0, this.sphereData.p.length / 3);
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYjA3MDk3L3dvcmtzcGFjZS92ZXJ5dGlyZWQvcmF3LXdlYmdsLXNhbXBsZS9zcmMvU2FtcGxlMS5qcyIsIi9Vc2Vycy9iMDcwOTcvd29ya3NwYWNlL3Zlcnl0aXJlZC9yYXctd2ViZ2wtc2FtcGxlL3NyYy9TYW1wbGUyLmpzIiwiL1VzZXJzL2IwNzA5Ny93b3Jrc3BhY2UvdmVyeXRpcmVkL3Jhdy13ZWJnbC1zYW1wbGUvc3JjL1NhbXBsZTMuanMiLCIvVXNlcnMvYjA3MDk3L3dvcmtzcGFjZS92ZXJ5dGlyZWQvcmF3LXdlYmdsLXNhbXBsZS9zcmMvaW5kZXguanMiLCIvVXNlcnMvYjA3MDk3L3dvcmtzcGFjZS92ZXJ5dGlyZWQvcmF3LXdlYmdsLXNhbXBsZS9zcmMvbWluTWF0cml4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7SUNLTSxPQUFPO1dBQVAsT0FBTzswQkFBUCxPQUFPOzs7ZUFBUCxPQUFPOzs7Ozs7O1dBTVIsZUFBRzs7O0FBR0osVUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7O0FBRzFDLE9BQUMsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO0FBQ2QsT0FBQyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7OztBQUdmLFVBQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDOzs7QUFHdkUsVUFBSSxFQUFFLEVBQUU7QUFDTixlQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7T0FDL0IsTUFBTTtBQUNMLGVBQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUNuQyxlQUFNO09BQ1A7OztBQUdELFFBQUUsQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLEdB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QUFJLENBQUMsQ0FBQyxDQUFDO2dCQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNsRCxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztnQkFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztnQkFDcEQsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7Z0JBQ3RELENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNsRCxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDbEQsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7Z0JBQ3BELENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO2dCQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO2dCQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO2dCQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDM0QsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3hDLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN4QyxnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDeEMsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3hDLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN4QyxnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDeEMsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3hDLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN4QyxnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDeEMsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3hDLGdCQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN6QyxnQkFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDekMsZ0JBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3pDLGdCQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN6QyxnQkFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDekMsZ0JBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3pDLG1CQUFPLElBQUksQ0FBQztTQUNmOzs7ZUFDSyxlQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFO0FBQ25CLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQixnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUIsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFCLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQixnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUIsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFCLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQixnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUIsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFCLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQixnQkFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUIsZ0JBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzVCLGdCQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ25CLGdCQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ25CLGdCQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ25CLGdCQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ25CLG1CQUFPLElBQUksQ0FBQztTQUNmOzs7ZUFDUyxtQkFBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRTtBQUN2QixnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqQixnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqQixnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqQixnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqQixnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqQixnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqQixnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqQixnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqQixnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqQixnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqQixnQkFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNuQixnQkFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNuQixnQkFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN6RSxnQkFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN6RSxnQkFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUMxRSxnQkFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUMxRSxtQkFBTyxJQUFJLENBQUM7U0FDZjs7O2VBQ00sZ0JBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFO0FBQzVCLGdCQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUUsZ0JBQUksQ0FBQyxFQUFFLEVBQUU7QUFDTCx1QkFBTyxJQUFJLENBQUM7YUFDZjtBQUNELGdCQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUMsZ0JBQUksRUFBRSxJQUFJLENBQUMsRUFBRTtBQUNULGtCQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNaLGlCQUFDLElBQUksRUFBRSxDQUFDO0FBQ1IsaUJBQUMsSUFBSSxFQUFFLENBQUM7QUFDUixpQkFBQyxJQUFJLEVBQUUsQ0FBQzthQUNYO0FBQ0QsZ0JBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO2dCQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztnQkFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7Z0JBQ25ELENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUM5QyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDOUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUM7Z0JBQ2hELENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO2dCQUNqQixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7Z0JBQ3JCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztnQkFDckIsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO2dCQUNyQixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztnQkFDakIsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO2dCQUNyQixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7Z0JBQ3JCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztnQkFDckIsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN0QixnQkFBSSxLQUFLLEVBQUU7QUFDUCxvQkFBSSxHQUFHLElBQUksSUFBSSxFQUFFO0FBQ2Isd0JBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDbkIsd0JBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDbkIsd0JBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDbkIsd0JBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7aUJBQ3RCO2FBQ0osTUFBTTtBQUNILG9CQUFJLEdBQUcsR0FBRyxDQUFDO2FBQ2Q7QUFDRCxnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2hDLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDaEMsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNoQyxnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2hDLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDaEMsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNoQyxnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2hDLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDaEMsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNoQyxnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2hDLGdCQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDakMsZ0JBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNqQyxtQkFBTyxJQUFJLENBQUM7U0FDZjs7O2VBQ00sZ0JBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFO0FBQzNCLGdCQUFJLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUFFLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUFFLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUMzQyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFBRSxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFBRSxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDckMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQUUsT0FBTyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQUUsT0FBTyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsRSxnQkFBSSxJQUFJLElBQUksT0FBTyxJQUFJLElBQUksSUFBSSxPQUFPLElBQUksSUFBSSxJQUFJLE9BQU8sRUFBRTtBQUN2RCx1QkFBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzlCO0FBQ0QsZ0JBQUksRUFBRSxZQUFBO2dCQUFFLEVBQUUsWUFBQTtnQkFBRSxFQUFFLFlBQUE7Z0JBQUUsRUFBRSxZQUFBO2dCQUFFLEVBQUUsWUFBQTtnQkFBRSxFQUFFLFlBQUE7Z0JBQUUsRUFBRSxZQUFBO2dCQUFFLEVBQUUsWUFBQTtnQkFBRSxFQUFFLFlBQUE7Z0JBQUUsQ0FBQyxZQUFBLENBQUM7QUFDMUMsY0FBRSxHQUFHLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEIsY0FBRSxHQUFHLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEIsY0FBRSxHQUFHLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEIsYUFBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDL0MsY0FBRSxJQUFJLENBQUMsQ0FBQztBQUNSLGNBQUUsSUFBSSxDQUFDLENBQUM7QUFDUixjQUFFLElBQUksQ0FBQyxDQUFDO0FBQ1IsY0FBRSxHQUFHLEdBQUcsR0FBRyxFQUFFLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUN6QixjQUFFLEdBQUcsR0FBRyxHQUFHLEVBQUUsR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ3pCLGNBQUUsR0FBRyxHQUFHLEdBQUcsRUFBRSxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFDekIsYUFBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUMzQyxnQkFBSSxDQUFDLENBQUMsRUFBRTtBQUNKLGtCQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ1Asa0JBQUUsR0FBRyxDQUFDLENBQUM7QUFDUCxrQkFBRSxHQUFHLENBQUMsQ0FBQzthQUNWLE1BQU07QUFDSCxpQkFBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDVixrQkFBRSxJQUFJLENBQUMsQ0FBQztBQUNSLGtCQUFFLElBQUksQ0FBQyxDQUFDO0FBQ1Isa0JBQUUsSUFBSSxDQUFDLENBQUM7YUFDWDtBQUNELGNBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDdkIsY0FBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUN2QixjQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLGFBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDM0MsZ0JBQUksQ0FBQyxDQUFDLEVBQUU7QUFDSixrQkFBRSxHQUFHLENBQUMsQ0FBQztBQUNQLGtCQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ1Asa0JBQUUsR0FBRyxDQUFDLENBQUM7YUFDVixNQUFNO0FBQ0gsaUJBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ1Ysa0JBQUUsSUFBSSxDQUFDLENBQUM7QUFDUixrQkFBRSxJQUFJLENBQUMsQ0FBQztBQUNSLGtCQUFFLElBQUksQ0FBQyxDQUFDO2FBQ1g7QUFDRCxnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNiLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ2IsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDYixnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNaLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ2IsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDYixnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNiLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ1osZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDYixnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNiLGdCQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ2QsZ0JBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDYixnQkFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxHQUFHLElBQUksR0FBRyxFQUFFLEdBQUcsSUFBSSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUEsQUFBQyxDQUFDO0FBQ2hELGdCQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLEdBQUcsSUFBSSxHQUFHLEVBQUUsR0FBRyxJQUFJLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7QUFDaEQsZ0JBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsR0FBRyxJQUFJLEdBQUcsRUFBRSxHQUFHLElBQUksR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFBLEFBQUMsQ0FBQztBQUNoRCxnQkFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNiLG1C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Q0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqQixnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqQixnQkFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNuQixnQkFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNuQixnQkFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQixnQkFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQixnQkFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNuQixnQkFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNuQixtQkFBTyxJQUFJLENBQUM7U0FDZjs7O2VBQ08saUJBQUMsR0FBRyxFQUFFLElBQUksRUFBRTtBQUNoQixnQkFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDOUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQzlDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDO2dCQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDO2dCQUNoRCxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQztnQkFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQztnQkFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQztnQkFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQztnQkFDbEQsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7Z0JBQ3BDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO2dCQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO2dCQUNwQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztnQkFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztnQkFDcEMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7Z0JBQ3BDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO2dCQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO2dCQUNwQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztnQkFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztnQkFDcEMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLENBQUM7QUFDOUQsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksR0FBRyxDQUFDO0FBQ3pDLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksR0FBRyxDQUFDO0FBQ3pDLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQSxHQUFJLEdBQUcsQ0FBQztBQUN6QyxnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQSxHQUFJLEdBQUcsQ0FBQztBQUN6QyxnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQSxHQUFJLEdBQUcsQ0FBQztBQUN6QyxnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUEsR0FBSSxHQUFHLENBQUM7QUFDekMsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUEsR0FBSSxHQUFHLENBQUM7QUFDekMsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksR0FBRyxDQUFDO0FBQ3pDLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQSxHQUFJLEdBQUcsQ0FBQztBQUN6QyxnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQSxHQUFJLEdBQUcsQ0FBQztBQUN6QyxnQkFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUEsR0FBSSxHQUFHLENBQUM7QUFDMUMsZ0JBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUEsR0FBSSxHQUFHLENBQUM7QUFDMUMsZ0JBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUEsR0FBSSxHQUFHLENBQUM7QUFDMUMsZ0JBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksR0FBRyxDQUFDO0FBQzFDLGdCQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksR0FBRyxDQUFDO0FBQzFDLGdCQUFJLENBQUMsRUFBRSxDQUFD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QUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEFBQUMsQ0FBQztBQUMxQyx3QkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQUFBQyxDQUFDO0FBQzFDLHdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxBQUFDLENBQUM7aUJBQzdDLE1BQU07QUFDSCx3QkFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN2Qix3QkFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQztBQUNuQix3QkFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ2hDLHdCQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMzQix3QkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUN0Qyx3QkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUN0Qyx3QkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUN0Qyx3QkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxH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QUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN0QixhQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN6QixhQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFBLEdBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN6QixlQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDbkMsZUFBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDbkQ7S0FDSjtBQUNELFdBQU8sRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUMsQ0FBQztDQUNsRDs7Ozs7Ozs7Ozs7QUFVTSxTQUFTLE1BQU0sQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUU7QUFDNUMsUUFBSSxDQUFDLFlBQUE7UUFBRSxDQUFDLFlBQUE7UUFBRSxFQUFFLFlBQUEsQ0FBQztBQUNiLFFBQUksR0FBRyxHQUFHLElBQUksS0FBSyxFQUFFO1FBQUUsR0FBRyxHQUFHLElBQUksS0FBSyxFQUFFO1FBQ3BDLEdBQUcsR0FBRyxJQUFJLEtBQUssRUFBRTtRQUFFLEVBQUUsR0FBRyxJQUFJLEtBQUssRUFBRTtRQUFFLEdBQUcsR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO0FBQzNELFNBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3ZCLFlBQUksR0FBQyxH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QixRQUFJLEdBQUcsR0FBRyxDQUNOLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQ2xELENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFDdEQsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFDbEQsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUN0RCxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUNsRCxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQ3pELENBQUM7QUFDRixRQUFJLEdBQUcsR0FBRyxDQUNOLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQzlELENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFDbEUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFDOUQsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUNsRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUM5RCxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQ3JFLENBQUM7QUFDRixRQUFJLEdBQUcsR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO0FBQ3RCLFNBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNyQyxZQUFJLEtBQUssRUFBRTtBQUNQLGNBQUUsR0FBRyxLQUFLLENBQUM7U0FDZCxNQUFNO0FBQ0gsY0FBRSxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDaEQ7QUFDRCxXQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3hDO0FBQ0QsUUFBSSxFQUFFLEdBQUcsQ0FDTCxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUN0QyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUN0QyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUN0QyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUN0QyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUN0QyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUN6QyxDQUFDO0FBQ0YsUUFBSSxHQUFHLEdBQUcsQ0FDTixDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDaEIsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQ2hCLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUNuQixFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFDdEIsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQ3RCLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUN6QixDQUFDO0FBQ0YsV0FBTyxFQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBQyxDQUFDO0NBQ2xEOztBQUVNLFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUM3QixRQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQ3pCLGVBQU87S0FDVjtBQUNELFFBQUksRUFBRSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDakIsUUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDNUIsUUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDcEIsUUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxDQUFDO0FBQ3BCLFFBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLENBQUM7QUFDeEIsUUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLENBQUEsQUFBQyxDQUFDO0FBQzlCLFFBQUksS0FBSyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7QUFDeEIsUUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQ2xCLGFBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDMUIsTUFBTTtBQUNILFlBQUksR0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDcEMsWUFBSSxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNwQyxZQUFJLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3BDLGFBQUssQ0FBQyxJQUFJLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDbkM7QUFDRCxXQUFPLEtBQUssQ0FBQztDQUNoQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiogU2FtcGxlIDFcbiog55SfV2ViR0zjgpLoqJjov7DjgZfjgabkuInop5LlvaLjgpLooajnpLrjgZXjgZvjgotcbiovXG5cbmNsYXNzIFNhbXBsZTEge1xuXG4gIC8qKlxuICAgKiBydW5cbiAgICog44K144Oz44OX44Or44Kz44O844OJ5a6f6KGMXG4gICAqL1xuICBydW4oKSB7XG5cbiAgICAvLyBjYW52YXPjgbjjga7lj4LkuIrjgpLlpInmlbDjgavlj5blvpfjgZnjgotcbiAgICBsZXQgYyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKTtcblxuICAgIC8vIHNpemXmjIflrppcbiAgICBjLndpZHRoID0gNTEyO1xuICAgIGMuaGVpZ2h0ID0gNTEyO1xuXG4gICAgLy8gV2ViR0zjgrPjg7Pjg4bjgq3jgrnjg4jjgpJjYW52YXPjgYvjgonlj5blvpfjgZnjgotcbiAgICBjb25zdCBnbCA9IGMuZ2V0Q29udGV4dCgnd2ViZ2wnKSB8fCBjLmdldENvbnRleHQoJ2V4cGVyaW1lbnRhbC13ZWJnbCcpO1xuXG4gICAgLy8gV2ViR0zjgrPjg7Pjg4bjgq3jgrnjg4jjga7lj5blvpfjgYzjgafjgY3jgZ/jgYvjganjgYbjgYtcbiAgICBpZiAoZ2wpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdzdXBwb3J0cyB3ZWJnbCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygnd2ViZ2wgbm90IHN1cHBvcnRlZCcpO1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8g44Kv44Oq44Ki44GZ44KL6Imy44KS5oyH5a6aXG4gICAgZ2wuY2xlYXJDb2xvcigwLjAsIDAuMCwgMC4wLCAxLjApO1xuXG4gICAgLy8g44Ko44Os44Oh44Oz44OI44KS44Kv44Oq44KiXG4gICAgZ2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVCk7XG5cbiAgICAvLyDkuInop5LlvaLjgpLlvaLmiJDjgZnjgovpoILngrnjga7jg4fjg7zjgr/jgpLlj5fjgZHlj5bjgotcbiAgICBsZXQgdHJpYW5nbGVEYXRhID0gdGhpcy5nZW5UcmlhbmdsZSgpO1xuXG4gICAgLy8g6aCC54K544OH44O844K/44GL44KJ44OQ44OD44OV44Kh44KS55Sf5oiQXG4gICAgbGV0IHZlcnRleEJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB2ZXJ0ZXhCdWZmZXIpO1xuICAgIGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBuZXcgRmxvYXQzMkFycmF5KHRyaWFuZ2xlRGF0YS5wKSwgZ2wuU1RBVElDX0RSQVcpO1xuXG4gICAgLy8g44K344Kn44O844OA44Go44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OIXG4gICAgbGV0IHZlcnRleFNvdXJjZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2cycpLnRleHRDb250ZW50O1xuICAgIGxldCBmcmFnbWVudFNvdXJjZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmcycpLnRleHRDb250ZW50O1xuICAgIGxldCB2ZXJ0ZXhTaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIoZ2wuVkVSVEVYX1NIQURFUik7XG4gICAgbGV0IGZyYWdtZW50U2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKGdsLkZSQUdNRU5UX1NIQURFUik7XG4gICAgbGV0IHByb2dyYW1zID0gZ2wuY3JlYXRlUHJvZ3JhbSgpO1xuXG4gICAgZ2wuc2hhZGVyU291cmNlKHZlcnRleFNoYWRlciwgdmVydGV4U291cmNlKTtcbiAgICBnbC5jb21waWxlU2hhZGVyKHZlcnRleFNoYWRlcik7XG4gICAgZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW1zLCB2ZXJ0ZXhTaGFkZXIpO1xuICAgIGdsLnNoYWRlclNvdXJjZShmcmFnbWVudFNoYWRlciwgZnJhZ21lbnRTb3VyY2UpO1xuICAgIGdsLmNvbXBpbGVTaGFkZXIoZnJhZ21lbnRTaGFkZXIpO1xuICAgIGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtcywgZnJhZ21lbnRTaGFkZXIpO1xuICAgIGdsLmxpbmtQcm9ncmFtKHByb2dyYW1zKTtcbiAgICBnbC51c2VQcm9ncmFtKHByb2dyYW1zKTtcblxuICAgIC8vIOODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiOOBq+S4ieinkuW9ouOBrumggueCueODh+ODvOOCv+OCkueZu+mMslxuICAgIGxldCBhdHRMb2NhdGlvbiA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKHByb2dyYW1zLCAncG9zaXRpb24nKTtcbiAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShhdHRMb2NhdGlvbik7XG4gICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcihhdHRMb2NhdGlvbiwgMywgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcblxuICAgIC8vIOaPj+eUu1xuICAgIGdsLmRyYXdBcnJheXMoZ2wuVFJJQU5HTEVTLCAwLCB0cmlhbmdsZURhdGEucC5sZW5ndGggLyAzKTtcbiAgICBnbC5mbHVzaCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIGdlblRyaWFuZ2xlXG4gICAqIOS4ieinkuW9ouOBrumggueCueaDheWgseOCkui/lOWNtOOBmeOCi1xuICAgKi9cbiAgZ2VuVHJpYW5nbGUoKSB7XG4gICAgbGV0IG9iaiA9IHt9O1xuICAgIG9iai5wID0gW1xuICAgICAgLy8g44Gy44Go44Gk55uu44Gu5LiJ6KeS5b2iXG4gICAgICAwLjAsIDAuNSwgMC4wLFxuICAgICAgMC41LCAtMC41LCAwLjAsXG4gICAgICAtMC41LCAtMC41LCAwLjAsXG5cbiAgICAgIC8vIOOBteOBn+OBpOebruOBruS4ieinkuW9olxuICAgICAgMC4wLCAtMC41LCAwLjAsXG4gICAgICAwLjUsIDAuNSwgMC4wLFxuICAgICAgLTAuNSwgMC41LCAwLjBcbiAgICBdO1xuICAgIHJldHVybiBvYmo7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTYW1wbGUxO1xuIiwiaW1wb3J0IHttYXRJViwgcXRuSVYsIHRvcnVzLCBjdWJlLCBoc3ZhICxzcGhlcmV9IGZyb20gXCIuL21pbk1hdHJpeFwiO1xuLypcbiAqIFNhbXBsZSAyXG4gKi9cblxuY2xhc3MgU2FtcGxlMiB7XG4gIC8qKlxuICAgKiBjb25zdHJ1Y3RvclxuICAgKiDjgrPjg7Pjgrnjg4jjg6njgq/jgr9cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgLy9jYW52YXPjgbjjga7lj4LkuIrjgpLlpInmlbDjgavlj5blvpfjgZnjgotcbiAgICBsZXQgYyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKTtcbiAgICAvLyBzaXpl5oyH5a6aXG4gICAgYy53aWR0aCA9IDUxMjtcbiAgICBjLmhlaWdodCA9IDUxMjtcbiAgICB0aGlzLmNhbnZhcyA9IGM7XG5cbiAgICAvL1dlYkdM44Kz44Oz44OG44Kt44K544OI44KSY2FudmFz44GL44KJ5Y+W5b6X44GZ44KLXG4gICAgdGhpcy5nbCA9IGMuZ2V0Q29udGV4dCgnd2ViZ2wnKSB8fCBjLmdldENvbnRleHQoJ2V4cGVyaW1lbnRhbC13ZWJnbCcpO1xuXG4gICAgLy8g6KGM5YiX6KiI566XXG4gICAgdGhpcy5tYXQgPSBudWxsO1xuICAgIC8vIOODrOODs+ODgOODquODs+OCsOeUqOOCq+OCpuODs+OCv1xuICAgIHRoaXMuY291bnQgPSAwO1xuICB9XG5cbiAgLyoqXG4gICAqIHJ1blxuICAgKiDjgrXjg7Pjg5fjg6vjgrPjg7zjg4nlrp/ooYxcbiAgICovXG4gIHJ1bigpIHtcblxuICAgIC8vV2ViR0zjgrPjg7Pjg4bjgq3jgrnjg4jjga7lj5blvpfjgYzjgafjgY3jgZ/jgYvjganjgYbjgYtcbiAgICBpZiAodGhpcy5nbCkge1xuICAgICAgY29uc29sZS5sb2coJ3N1cHBvcnRzIHdlYmdsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCd3ZWJnbCBub3Qgc3VwcG9ydGVkJyk7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyDjgq/jg6rjgqLjgZnjgovoibLjgpLmjIflrppcbiAgICB0aGlzLmdsLmNsZWFyQ29sb3IoMC4wLCAwLjAsIDAuMCwgMS4wKTtcblxuICAgIC8vIOOCqOODrOODoeODs+ODiOOCkuOCr+ODquOColxuICAgIHRoaXMuZ2wuY2xlYXIodGhpcy5nbC5DT0xPUl9CVUZGRVJfQklUKTtcblxuICAgIC8vIOS4ieinkuW9ouOCkuW9ouaIkOOBmeOCi+mggueCueOBruODh+ODvOOCv+OCkuWPl+OBkeWPluOCi1xuICAgIHRoaXMudHJpYW5nbGVEYXRhID0gdGhpcy5nZW5UcmlhbmdsZSgpO1xuXG4gICAgLy8g6aCC54K544OH44O844K/44GL44KJ44OQ44OD44OV44Kh44KS55Sf5oiQXG4gICAgbGV0IHZlcnRleEJ1ZmZlciA9IHRoaXMuZ2wuY3JlYXRlQnVmZmVyKCk7XG4gICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCB2ZXJ0ZXhCdWZmZXIpO1xuICAgIHRoaXMuZ2wuYnVmZmVyRGF0YSh0aGlzLmdsLkFSUkFZX0JVRkZFUiwgbmV3IEZsb2F0MzJBcnJheSh0aGlzLnRyaWFuZ2xlRGF0YS5wKSwgdGhpcy5nbC5TVEFUSUNfRFJBVyk7XG5cbiAgICAvLyDjgrfjgqfjg7zjg4Djgajjg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4hcbiAgICBjb25zdCB2ZXJ0ZXhTb3VyY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndnMnKS50ZXh0Q29udGVudDtcbiAgICBjb25zdCBmcmFnbWVudFNvdXJjZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmcycpLnRleHRDb250ZW50O1xuXG4gICAgLy8g44Om44O844K244O85a6a576p44Gu44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OI55Sf5oiQ6Zai5pWwXG4gICAgdGhpcy5wcm9ncmFtcyA9IHRoaXMuY3JlYXRlU2hhZGVyUHJvZ3JhbSh2ZXJ0ZXhTb3VyY2UsIGZyYWdtZW50U291cmNlKTtcblxuICAgIC8vIOODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiOOBq+S4ieinkuW9ouOBrumggueCueODh+ODvOOCv+OCkueZu+mMslxuICAgIGxldCBhdHRMb2NhdGlvbiA9IHRoaXMuZ2wuZ2V0QXR0cmliTG9jYXRpb24odGhpcy5wcm9ncmFtcywgJ3Bvc2l0aW9uJyk7XG4gICAgdGhpcy5nbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShhdHRMb2NhdGlvbik7XG4gICAgdGhpcy5nbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dExvY2F0aW9uLCAzLCB0aGlzLmdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XG5cbiAgICAvLyDooYzliJfjga7liJ3mnJ/ljJZcbiAgICB0aGlzLm1hdCA9IG5ldyBtYXRJVigpO1xuICAgIHRoaXMubU1hdHJpeCA9IHRoaXMubWF0LmlkZW50aXR5KHRoaXMubWF0LmNyZWF0ZSgpKTtcbiAgICB0aGlzLnZNYXRyaXggPSB0aGlzLm1hdC5pZGVudGl0eSh0aGlzLm1hdC5jcmVhdGUoKSk7XG4gICAgdGhpcy5wTWF0cml4ID0gdGhpcy5tYXQuaWRlbnRpdHkodGhpcy5tYXQuY3JlYXRlKCkpO1xuICAgIHRoaXMudnBNYXRyaXggPSB0aGlzLm1hdC5pZGVudGl0eSh0aGlzLm1hdC5jcmVhdGUoKSk7XG4gICAgdGhpcy5tdnBNYXRyaXggPSB0aGlzLm1hdC5pZGVudGl0eSh0aGlzLm1hdC5jcmVhdGUoKSk7XG5cbiAgICAvLyDjg5Pjg6Xjg7zluqfmqJnlpInmj5vooYzliJdcbiAgICBsZXQgY2FtZXJhUG9zaXRpb24gPSBbMC4wLCAwLjAsIDMuMF07IC8vIOOCq+ODoeODqeOBruS9jee9rlxuICAgIGxldCBjZW50ZXJQb2ludCA9IFswLjAsIDAuMCwgMC4wXTsgICAgLy8g5rOo6KaW54K5XG4gICAgbGV0IGNhbWVyYVVwID0gWzAuMCwgMS4wLCAwLjBdOyAgICAgICAvLyDjgqvjg6Hjg6njga7kuIrmlrnlkJFcbiAgICB0aGlzLm1hdC5sb29rQXQoY2FtZXJhUG9zaXRpb24sIGNlbnRlclBvaW50LCBjYW1lcmFVcCwgdGhpcy52TWF0cml4KTtcblxuICAgIC8vIOODl+ODreOCuOOCp+OCr+OCt+ODp+ODs+OBruOBn+OCgeOBruaDheWgseOCkuaPg+OBiOOCi1xuICAgIGxldCBmb3Z5ID0gNDU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDoppbph47op5JcbiAgICBsZXQgYXNwZWN0ID0gdGhpcy5jYW52YXMud2lkdGggLyB0aGlzLmNhbnZhcy5oZWlnaHQ7IC8vIOOCouOCueODmuOCr+ODiOavlFxuICAgIGxldCBuZWFyID0gMC4xOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDnqbrplpPjga7mnIDliY3pnaJcbiAgICBsZXQgZmFyID0gMTAuMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g56m66ZaT44Gu5aWl6KGM44GN57WC56uvXG4gICAgdGhpcy5tYXQucGVyc3BlY3RpdmUoZm92eSwgYXNwZWN0LCBuZWFyLCBmYXIsIHRoaXMucE1hdHJpeCk7XG5cbiAgICAvLyDooYzliJfjgpLmjpvjgZHlkIjjgo/jgZvjgaZWUOODnuODiOODquODg+OCr+OCueOCkueUn+aIkOOBl+OBpuOBiuOBj1xuICAgIHRoaXMubWF0Lm11bHRpcGx5KHRoaXMucE1hdHJpeCwgdGhpcy52TWF0cml4LCB0aGlzLnZwTWF0cml4KTsgICAvLyBw44GrduOCkuaOm+OBkeOCi1xuXG4gICAgLy8gcmVuZGVyaW5n6ZaL5aeLXG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDjg6zjg7Pjg4Djg6rjg7PjgrDplqLmlbDjga7lrprnvqlcbiAgICovXG4gIHJlbmRlcigpIHtcblxuICAgIC8vIENhbnZhc+OCqOODrOODoeODs+ODiOOCkuOCr+ODquOCouOBmeOCi1xuICAgIHRoaXMuZ2wuY2xlYXIodGhpcy5nbC5DT0xPUl9CVUZGRVJfQklUKTtcblxuICAgIC8vIOODouODh+ODq+W6p+aomeWkieaPm+ihjOWIl+OCkuS4gOW6puWIneacn+WMluOBl+OBpuODquOCu+ODg+ODiOOBmeOCi1xuICAgIHRoaXMubWF0LmlkZW50aXR5KHRoaXMubU1hdHJpeCk7XG5cbiAgICAvLyDjgqvjgqbjg7Pjgr/jgpLjgqTjg7Pjgq/jg6rjg6Hjg7Pjg4jjgZnjgotcbiAgICB0aGlzLmNvdW50Kys7XG5cbiAgICAvLyDjg6Ljg4fjg6vluqfmqJnlpInmj5vooYzliJdcbiAgICAvLyDnp7vli5VcbiAgICBsZXQgbW92ZSA9IFswLjUsIDAuNSwgMC4wXTsgICAgICAgICAgIC8vIOenu+WLlemHj+OBr1hZ44Gd44KM44Ge44KMMC41XG4gICAgdGhpcy5tYXQudHJhbnNsYXRlKHRoaXMubU1hdHJpeCwgbW92ZSwgdGhpcy5tTWF0cml4KTtcblxuICAgIC8vIOWbnui7olxuICAgIGxldCByYWRpYW5zID0gKHRoaXMuY291bnQgJSAzNjApICogTWF0aC5QSSAvIDE4MDtcbiAgICBsZXQgYXhpcyA9IFswLjAsIDAuMCwgMS4wXTtcbiAgICB0aGlzLm1hdC5yb3RhdGUodGhpcy5tTWF0cml4LCByYWRpYW5zLCBheGlzLCB0aGlzLm1NYXRyaXgpO1xuXG5cbiAgICAvLyDooYzliJfjgpLmjpvjgZHlkIjjgo/jgZvjgaZNVlDjg57jg4jjg6rjg4Pjgq/jgrnjgpLnlJ/miJBcbiAgICB0aGlzLm1hdC5tdWx0aXBseSh0aGlzLnBNYXRyaXgsIHRoaXMudk1hdHJpeCwgdGhpcy52cE1hdHJpeCk7ICAgLy8gcOOBq3bjgpLmjpvjgZHjgotcbiAgICB0aGlzLm1hdC5tdWx0aXBseSh0aGlzLnZwTWF0cml4LCB0aGlzLm1NYXRyaXgsIHRoaXMubXZwTWF0cml4KTsgLy8g44GV44KJ44GrbeOCkuaOm+OBkeOCi1xuXG4gICAgLy8g44K344Kn44O844OA44Gr6KGM5YiX44KS6YCB5L+h44GZ44KLXG4gICAgbGV0IHVuaUxvY2F0aW9uID0gdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5wcm9ncmFtcywgJ212cE1hdHJpeCcpO1xuICAgIHRoaXMuZ2wudW5pZm9ybU1hdHJpeDRmdih1bmlMb2NhdGlvbiwgZmFsc2UsIHRoaXMubXZwTWF0cml4KTtcblxuICAgIC8vIFZQ44Oe44OI44Oq44OD44Kv44K544Gr44Oi44OH44Or5bqn5qiZ5aSJ5o+b6KGM5YiX44KS5o6b44GR44KLXG4gICAgdGhpcy5tYXQubXVsdGlwbHkodGhpcy52cE1hdHJpeCwgdGhpcy5tTWF0cml4LCB0aGlzLm12cE1hdHJpeCk7XG5cbiAgICAvLyDmj4/nlLtcbiAgICB0aGlzLmdsLmRyYXdBcnJheXModGhpcy5nbC5UUklBTkdMRVMsIDAsIHRoaXMudHJpYW5nbGVEYXRhLnAubGVuZ3RoIC8gMyk7XG4gICAgdGhpcy5nbC5mbHVzaCgpO1xuXG4gICAgLy8g5YaN5biw5ZG844Gz5Ye644GXXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpPT4ge1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjcmVhdGVTaGFkZXJQcm9ncmFtXG4gICAqIOODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiOeUn+aIkOmWouaVsFxuICAgKi9cbiAgY3JlYXRlU2hhZGVyUHJvZ3JhbSh2ZXJ0ZXhTb3VyY2UsIGZyYWdtZW50U291cmNlKSB7XG5cbiAgICAvLyDjgrfjgqfjg7zjg4Djgqrjg5bjgrjjgqfjgq/jg4jjga7nlJ/miJBcbiAgICBsZXQgdmVydGV4U2hhZGVyID0gdGhpcy5nbC5jcmVhdGVTaGFkZXIodGhpcy5nbC5WRVJURVhfU0hBREVSKTtcbiAgICBsZXQgZnJhZ21lbnRTaGFkZXIgPSB0aGlzLmdsLmNyZWF0ZVNoYWRlcih0aGlzLmdsLkZSQUdNRU5UX1NIQURFUik7XG5cbiAgICAvLyDjgrfjgqfjg7zjg4Djgavjgr3jg7zjgrnjgpLlibLjgorlvZPjgabjgabjgrPjg7Pjg5HjgqTjg6tcbiAgICB0aGlzLmdsLnNoYWRlclNvdXJjZSh2ZXJ0ZXhTaGFkZXIsIHZlcnRleFNvdXJjZSk7XG4gICAgdGhpcy5nbC5jb21waWxlU2hhZGVyKHZlcnRleFNoYWRlcik7XG4gICAgdGhpcy5nbC5zaGFkZXJTb3VyY2UoZnJhZ21lbnRTaGFkZXIsIGZyYWdtZW50U291cmNlKTtcbiAgICB0aGlzLmdsLmNvbXBpbGVTaGFkZXIoZnJhZ21lbnRTaGFkZXIpO1xuXG4gICAgLy8g44K344Kn44O844OA44O844Kz44Oz44OR44Kk44Or44Gu44Ko44Op44O85Yik5a6aXG4gICAgaWYgKHRoaXMuZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHZlcnRleFNoYWRlciwgdGhpcy5nbC5DT01QSUxFX1NUQVRVUylcbiAgICAgICYmIHRoaXMuZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKGZyYWdtZW50U2hhZGVyLCB0aGlzLmdsLkNPTVBJTEVfU1RBVFVTKSkge1xuICAgICAgY29uc29sZS5sb2coJ1N1Y2Nlc3MgU2hhZGVyIENvbXBpbGUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ0ZhaWxkIFNoYWRlciBDb21waWxlJyk7XG4gICAgICBjb25zb2xlLmxvZygndmVydGV4U2hhZGVyJywgdGhpcy5nbC5nZXRTaGFkZXJJbmZvTG9nKHZlcnRleFNoYWRlcikpO1xuICAgICAgY29uc29sZS5sb2coJ2ZyYWdtZW50U2hhZGVyJywgdGhpcy5nbC5nZXRTaGFkZXJJbmZvTG9nKGZyYWdtZW50U2hhZGVyKSk7XG4gICAgfVxuXG4gICAgLy8g44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OI44Gu55Sf5oiQ44GL44KJ6YG45oqe44G+44GnXG4gICAgY29uc3QgcHJvZ3JhbXMgPSB0aGlzLmdsLmNyZWF0ZVByb2dyYW0oKTtcblxuICAgIHRoaXMuZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW1zLCB2ZXJ0ZXhTaGFkZXIpO1xuICAgIHRoaXMuZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW1zLCBmcmFnbWVudFNoYWRlcik7XG4gICAgdGhpcy5nbC5saW5rUHJvZ3JhbShwcm9ncmFtcyk7XG5cbiAgICAvLyDjg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4jjga7jgqjjg6njg7zliKTlrprlh6bnkIZcbiAgICBpZiAodGhpcy5nbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHByb2dyYW1zLCB0aGlzLmdsLkxJTktfU1RBVFVTKSkge1xuICAgICAgdGhpcy5nbC51c2VQcm9ncmFtKHByb2dyYW1zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCBMaW5rIFByb2dyYW0nLCB0aGlzLmdsLmdldFByb2dyYW1JbmZvTG9nKHByb2dyYW1zKSk7XG4gICAgfVxuXG4gICAgLy8g55Sf5oiQ44GX44Gf44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OI44KS5oi744KK5YCk44Go44GX44Gm6L+U44GZXG4gICAgcmV0dXJuIHByb2dyYW1zO1xuICB9XG5cbiAgLyoqXG4gICAqIGdlblRyaWFuZ2xlXG4gICAqIOS4ieinkuW9ouOBrumggueCueaDheWgseOCkui/lOWNtOOBmeOCi1xuICAgKi9cbiAgZ2VuVHJpYW5nbGUoKSB7XG4gICAgbGV0IG9iaiA9IHt9O1xuICAgIG9iai5wID0gW1xuICAgICAgLy8g44Gy44Go44Gk55uu44Gu5LiJ6KeS5b2iXG4gICAgICAwLjAsIDAuNSwgMC4wLFxuICAgICAgMC41LCAtMC41LCAwLjAsXG4gICAgICAtMC41LCAtMC41LCAwLjAsXG5cbiAgICAgIC8vIOOBteOBn+OBpOebruOBruS4ieinkuW9olxuICAgICAgMC4wLCAtMC41LCAwLjAsXG4gICAgICAwLjUsIDAuNSwgMC4wLFxuICAgICAgLTAuNSwgMC41LCAwLjBcbiAgICBdO1xuICAgIHJldHVybiBvYmo7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTYW1wbGUyO1xuXG4iLCJpbXBvcnQge21hdElWLCBxdG5JViwgdG9ydXMsIGN1YmUsIGhzdmEgLHNwaGVyZX0gZnJvbSBcIi4vbWluTWF0cml4XCI7XG4vKlxuICogU2FtcGxlIDJcbiAqL1xuXG5jbGFzcyBTYW1wbGUzIHtcbiAgLyoqXG4gICAqIGNvbnN0cnVjdG9yXG4gICAqIOOCs+ODs+OCueODiOODqeOCr+OCv1xuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG5cbiAgICBjb25zb2xlLmxvZygnU3RhcnQgU2FtcGxlMycpO1xuXG4gICAgLy9jYW52YXPjgbjjga7lj4LkuIrjgpLlpInmlbDjgavlj5blvpfjgZnjgotcbiAgICBsZXQgYyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKTtcbiAgICAvLyBzaXpl5oyH5a6aXG4gICAgYy53aWR0aCA9IDUxMjtcbiAgICBjLmhlaWdodCA9IDUxMjtcbiAgICB0aGlzLmNhbnZhcyA9IGM7XG5cbiAgICAvL1dlYkdM44Kz44Oz44OG44Kt44K544OI44KSY2FudmFz44GL44KJ5Y+W5b6X44GZ44KLXG4gICAgdGhpcy5nbCA9IGMuZ2V0Q29udGV4dCgnd2ViZ2wnKSB8fCBjLmdldENvbnRleHQoJ2V4cGVyaW1lbnRhbC13ZWJnbCcpO1xuXG4gICAgLy8g6KGM5YiX6KiI566XXG4gICAgdGhpcy5tYXQgPSBudWxsO1xuICAgIC8vIOODrOODs+ODgOODquODs+OCsOeUqOOCq+OCpuODs+OCv1xuICAgIHRoaXMuY291bnQgPSAwO1xuICB9XG5cbiAgLyoqXG4gICAqIHJ1blxuICAgKiDjgrXjg7Pjg5fjg6vjgrPjg7zjg4nlrp/ooYxcbiAgICovXG4gIHJ1bigpIHtcblxuICAgIC8vIFdlYkdM44Kz44Oz44OG44Kt44K544OI44Gu5Y+W5b6X44GM44Gn44GN44Gf44GL44Gp44GG44GLXG4gICAgaWYgKHRoaXMuZ2wpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdzdXBwb3J0cyB3ZWJnbCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygnd2ViZ2wgbm90IHN1cHBvcnRlZCcpO1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8g44Kv44Oq44Ki44GZ44KL6Imy44KS5oyH5a6aXG4gICAgdGhpcy5nbC5jbGVhckNvbG9yKDAuMCwgMC4wLCAwLjAsIDEuMCk7XG5cbiAgICAvLyDjgqjjg6zjg6Hjg7Pjg4jjgpLjgq/jg6rjgqJcbiAgICB0aGlzLmdsLmNsZWFyKHRoaXMuZ2wuQ09MT1JfQlVGRkVSX0JJVCk7XG5cblxuICAgIC8vIOeQg+S9k+OCkuW9ouaIkOOBmeOCi+mggueCueOBruODh+ODvOOCv+OCkuWPl+OBkeWPluOCi1xuICAgIHRoaXMuc3BoZXJlRGF0YSA9IHNwaGVyZSgxNiwgMTYsIDEuMCk7XG5cbiAgICAvLyDpoILngrnjg4fjg7zjgr/jgYvjgonjg5Djg4Pjg5XjgqHjgpLnlJ/miJBcbiAgICBsZXQgdmVydGV4QnVmZmVyID0gdGhpcy5nbC5jcmVhdGVCdWZmZXIoKTtcbiAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIHZlcnRleEJ1ZmZlcik7XG4gICAgdGhpcy5nbC5idWZmZXJEYXRhKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCBuZXcgRmxvYXQzMkFycmF5KHRoaXMuc3BoZXJlRGF0YS5wKSwgdGhpcy5nbC5TVEFUSUNfRFJBVyk7XG5cbiAgICAvLyDjgrfjgqfjg7zjg4Djgajjg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4hcbiAgICBjb25zdCB2ZXJ0ZXhTb3VyY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndnMnKS50ZXh0Q29udGVudDtcbiAgICBjb25zdCBmcmFnbWVudFNvdXJjZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmcycpLnRleHRDb250ZW50O1xuXG4gICAgLy8g44Om44O844K244O85a6a576p44Gu44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OI55Sf5oiQ6Zai5pWwXG4gICAgdGhpcy5wcm9ncmFtcyA9IHRoaXMuY3JlYXRlU2hhZGVyUHJvZ3JhbSh2ZXJ0ZXhTb3VyY2UsIGZyYWdtZW50U291cmNlKTtcblxuICAgIC8vIOODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiOOBq+mggueCueODh+ODvOOCv+OCkueZu+mMslxuICAgIGxldCBhdHRMb2NhdGlvbiA9IHRoaXMuZ2wuZ2V0QXR0cmliTG9jYXRpb24odGhpcy5wcm9ncmFtcywgJ3Bvc2l0aW9uJyk7XG4gICAgdGhpcy5nbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShhdHRMb2NhdGlvbik7XG4gICAgdGhpcy5nbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dExvY2F0aW9uLCAzLCB0aGlzLmdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XG5cbiAgICAvLyDooYzliJfjga7liJ3mnJ/ljJZcbiAgICB0aGlzLm1hdCA9IG5ldyBtYXRJVigpO1xuICAgIHRoaXMubU1hdHJpeCA9IHRoaXMubWF0LmlkZW50aXR5KHRoaXMubWF0LmNyZWF0ZSgpKTtcbiAgICB0aGlzLnZNYXRyaXggPSB0aGlzLm1hdC5pZGVudGl0eSh0aGlzLm1hdC5jcmVhdGUoKSk7XG4gICAgdGhpcy5wTWF0cml4ID0gdGhpcy5tYXQuaWRlbnRpdHkodGhpcy5tYXQuY3JlYXRlKCkpO1xuICAgIHRoaXMudnBNYXRyaXggPSB0aGlzLm1hdC5pZGVudGl0eSh0aGlzLm1hdC5jcmVhdGUoKSk7XG4gICAgdGhpcy5tdnBNYXRyaXggPSB0aGlzLm1hdC5pZGVudGl0eSh0aGlzLm1hdC5jcmVhdGUoKSk7XG5cbiAgICAvLyDjg5Pjg6Xjg7zluqfmqJnlpInmj5vooYzliJdcbiAgICBsZXQgY2FtZXJhUG9zaXRpb24gPSBbMC4wLCAwLjAsIDMuMF07IC8vIOOCq+ODoeODqeOBruS9jee9rlxuICAgIGxldCBjZW50ZXJQb2ludCA9IFswLjAsIDAuMCwgMC4wXTsgICAgLy8g5rOo6KaW54K5XG4gICAgbGV0IGNhbWVyYVVwID0gWzAuMCwgMS4wLCAwLjBdOyAgICAgICAvLyDjgqvjg6Hjg6njga7kuIrmlrnlkJFcbiAgICB0aGlzLm1hdC5sb29rQXQoY2FtZXJhUG9zaXRpb24sIGNlbnRlclBvaW50LCBjYW1lcmFVcCwgdGhpcy52TWF0cml4KTtcblxuICAgIC8vIOODl+ODreOCuOOCp+OCr+OCt+ODp+ODs+OBruOBn+OCgeOBruaDheWgseOCkuaPg+OBiOOCi1xuICAgIGxldCBmb3Z5ID0gNDU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDoppbph47op5JcbiAgICBsZXQgYXNwZWN0ID0gdGhpcy5jYW52YXMud2lkdGggLyB0aGlzLmNhbnZhcy5oZWlnaHQ7IC8vIOOCouOCueODmuOCr+ODiOavlFxuICAgIGxldCBuZWFyID0gMC4xOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDnqbrplpPjga7mnIDliY3pnaJcbiAgICBsZXQgZmFyID0gMTAuMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g56m66ZaT44Gu5aWl6KGM44GN57WC56uvXG4gICAgdGhpcy5tYXQucGVyc3BlY3RpdmUoZm92eSwgYXNwZWN0LCBuZWFyLCBmYXIsIHRoaXMucE1hdHJpeCk7XG5cbiAgICAvLyDooYzliJfjgpLmjpvjgZHlkIjjgo/jgZvjgaZWUOODnuODiOODquODg+OCr+OCueOCkueUn+aIkOOBl+OBpuOBiuOBj1xuICAgIHRoaXMubWF0Lm11bHRpcGx5KHRoaXMucE1hdHJpeCwgdGhpcy52TWF0cml4LCB0aGlzLnZwTWF0cml4KTsgICAvLyBw44GrduOCkuaOm+OBkeOCi1xuXG4gICAgLy8gcmVuZGVyaW5n6ZaL5aeLXG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDjg6zjg7Pjg4Djg6rjg7PjgrDplqLmlbDjga7lrprnvqlcbiAgICovXG4gIHJlbmRlcigpIHtcblxuICAgIC8vIENhbnZhc+OCqOODrOODoeODs+ODiOOCkuOCr+ODquOCouOBmeOCi1xuICAgIHRoaXMuZ2wuY2xlYXIodGhpcy5nbC5DT0xPUl9CVUZGRVJfQklUKTtcblxuICAgIC8vIOODouODh+ODq+W6p+aomeWkieaPm+ihjOWIl+OCkuS4gOW6puWIneacn+WMluOBl+OBpuODquOCu+ODg+ODiOOBmeOCi1xuICAgIHRoaXMubWF0LmlkZW50aXR5KHRoaXMubU1hdHJpeCk7XG5cbiAgICAvLyDjgqvjgqbjg7Pjgr/jgpLjgqTjg7Pjgq/jg6rjg6Hjg7Pjg4jjgZnjgotcbiAgICB0aGlzLmNvdW50Kys7XG5cbiAgICAvLyDjg6Ljg4fjg6vluqfmqJnlpInmj5vooYzliJdcbiAgICAvLyDnp7vli5VcbiAgICBsZXQgbW92ZSA9IFswLjAsIDAuMCwgMC4wXTtcbiAgICB0aGlzLm1hdC50cmFuc2xhdGUodGhpcy5tTWF0cml4LCBtb3ZlLCB0aGlzLm1NYXRyaXgpO1xuXG4gICAgLy8g5Zue6LuiXG4gICAgbGV0IHJhZGlhbnMgPSAodGhpcy5jb3VudCAlIDM2MCkgKiBNYXRoLlBJIC8gMTgwO1xuICAgIGxldCBheGlzID0gWzAuMCwgMC4wLCAxLjBdO1xuICAgIHRoaXMubWF0LnJvdGF0ZSh0aGlzLm1NYXRyaXgsIHJhZGlhbnMsIGF4aXMsIHRoaXMubU1hdHJpeCk7XG5cblxuICAgIC8vIOihjOWIl+OCkuaOm+OBkeWQiOOCj+OBm+OBpk1WUOODnuODiOODquODg+OCr+OCueOCkueUn+aIkFxuICAgIHRoaXMubWF0Lm11bHRpcGx5KHRoaXMucE1hdHJpeCwgdGhpcy52TWF0cml4LCB0aGlzLnZwTWF0cml4KTsgICAvLyBw44GrduOCkuaOm+OBkeOCi1xuICAgIHRoaXMubWF0Lm11bHRpcGx5KHRoaXMudnBNYXRyaXgsIHRoaXMubU1hdHJpeCwgdGhpcy5tdnBNYXRyaXgpOyAvLyDjgZXjgonjgatt44KS5o6b44GR44KLXG5cbiAgICAvLyDjgrfjgqfjg7zjg4DjgavooYzliJfjgpLpgIHkv6HjgZnjgotcbiAgICBsZXQgdW5pTG9jYXRpb24gPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLnByb2dyYW1zLCAnbXZwTWF0cml4Jyk7XG4gICAgdGhpcy5nbC51bmlmb3JtTWF0cml4NGZ2KHVuaUxvY2F0aW9uLCBmYWxzZSwgdGhpcy5tdnBNYXRyaXgpO1xuXG4gICAgLy8gVlDjg57jg4jjg6rjg4Pjgq/jgrnjgavjg6Ljg4fjg6vluqfmqJnlpInmj5vooYzliJfjgpLmjpvjgZHjgotcbiAgICB0aGlzLm1hdC5tdWx0aXBseSh0aGlzLnZwTWF0cml4LCB0aGlzLm1NYXRyaXgsIHRoaXMubXZwTWF0cml4KTtcblxuICAgIC8vIOaPj+eUu1xuICAgIHRoaXMuZ2wuZHJhd0FycmF5cyh0aGlzLmdsLlRSSUFOR0xFUywgMCwgdGhpcy5zcGhlcmVEYXRhLnAubGVuZ3RoIC8gMyk7XG4gICAgdGhpcy5nbC5mbHVzaCgpO1xuXG4gICAgLy8g5YaN5biw5ZG844Gz5Ye644GXXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpPT4ge1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjcmVhdGVTaGFkZXJQcm9ncmFtXG4gICAqIOODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiOeUn+aIkOmWouaVsFxuICAgKi9cbiAgY3JlYXRlU2hhZGVyUHJvZ3JhbSh2ZXJ0ZXhTb3VyY2UsIGZyYWdtZW50U291cmNlKSB7XG5cbiAgICAvLyDjgrfjgqfjg7zjg4Djgqrjg5bjgrjjgqfjgq/jg4jjga7nlJ/miJBcbiAgICBsZXQgdmVydGV4U2hhZGVyID0gdGhpcy5nbC5jcmVhdGVTaGFkZXIodGhpcy5nbC5WRVJURVhfU0hBREVSKTtcbiAgICBsZXQgZnJhZ21lbnRTaGFkZXIgPSB0aGlzLmdsLmNyZWF0ZVNoYWRlcih0aGlzLmdsLkZSQUdNRU5UX1NIQURFUik7XG5cbiAgICAvLyDjgrfjgqfjg7zjg4Djgavjgr3jg7zjgrnjgpLlibLjgorlvZPjgabjgabjgrPjg7Pjg5HjgqTjg6tcbiAgICB0aGlzLmdsLnNoYWRlclNvdXJjZSh2ZXJ0ZXhTaGFkZXIsIHZlcnRleFNvdXJjZSk7XG4gICAgdGhpcy5nbC5jb21waWxlU2hhZGVyKHZlcnRleFNoYWRlcik7XG4gICAgdGhpcy5nbC5zaGFkZXJTb3VyY2UoZnJhZ21lbnRTaGFkZXIsIGZyYWdtZW50U291cmNlKTtcbiAgICB0aGlzLmdsLmNvbXBpbGVTaGFkZXIoZnJhZ21lbnRTaGFkZXIpO1xuXG4gICAgLy8g44K344Kn44O844OA44O844Kz44Oz44OR44Kk44Or44Gu44Ko44Op44O85Yik5a6aXG4gICAgaWYgKHRoaXMuZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHZlcnRleFNoYWRlciwgdGhpcy5nbC5DT01QSUxFX1NUQVRVUylcbiAgICAgICYmIHRoaXMuZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKGZyYWdtZW50U2hhZGVyLCB0aGlzLmdsLkNPTVBJTEVfU1RBVFVTKSkge1xuICAgICAgY29uc29sZS5sb2coJ1N1Y2Nlc3MgU2hhZGVyIENvbXBpbGUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ0ZhaWxkIFNoYWRlciBDb21waWxlJyk7XG4gICAgICBjb25zb2xlLmxvZygndmVydGV4U2hhZGVyJywgdGhpcy5nbC5nZXRTaGFkZXJJbmZvTG9nKHZlcnRleFNoYWRlcikpO1xuICAgICAgY29uc29sZS5sb2coJ2ZyYWdtZW50U2hhZGVyJywgdGhpcy5nbC5nZXRTaGFkZXJJbmZvTG9nKGZyYWdtZW50U2hhZGVyKSk7XG4gICAgfVxuXG4gICAgLy8g44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OI44Gu55Sf5oiQ44GL44KJ6YG45oqe44G+44GnXG4gICAgY29uc3QgcHJvZ3JhbXMgPSB0aGlzLmdsLmNyZWF0ZVByb2dyYW0oKTtcblxuICAgIHRoaXMuZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW1zLCB2ZXJ0ZXhTaGFkZXIpO1xuICAgIHRoaXMuZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW1zLCBmcmFnbWVudFNoYWRlcik7XG4gICAgdGhpcy5nbC5saW5rUHJvZ3JhbShwcm9ncmFtcyk7XG5cbiAgICAvLyDjg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4jjga7jgqjjg6njg7zliKTlrprlh6bnkIZcbiAgICBpZiAodGhpcy5nbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHByb2dyYW1zLCB0aGlzLmdsLkxJTktfU1RBVFVTKSkge1xuICAgICAgdGhpcy5nbC51c2VQcm9ncmFtKHByb2dyYW1zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCBMaW5rIFByb2dyYW0nLCB0aGlzLmdsLmdldFByb2dyYW1JbmZvTG9nKHByb2dyYW1zKSk7XG4gICAgfVxuXG4gICAgLy8g55Sf5oiQ44GX44Gf44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OI44KS5oi744KK5YCk44Go44GX44Gm6L+U44GZXG4gICAgcmV0dXJuIHByb2dyYW1zO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2FtcGxlMztcbiIsImltcG9ydCBTYW1wbGUxIGZyb20gXCIuL1NhbXBsZTFcIjtcbmltcG9ydCBTYW1wbGUyIGZyb20gXCIuL1NhbXBsZTJcIjtcbmltcG9ydCBTYW1wbGUzIGZyb20gXCIuL1NhbXBsZTNcIjtcblxud2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcblxuICBjb25zdCBzYW1wbGUzID0gbmV3IFNhbXBsZTMoKTtcbiAgc2FtcGxlMy5ydW4oKTtcblxufTtcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gbWluTWF0cml4LmpzXG4vLyB2ZXJzaW9uIDAuMC4zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZXhwb3J0IGNsYXNzIG1hdElWIHtcbiAgICBjcmVhdGUgKCkge1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheSgxNik7XG4gICAgfTtcbiAgICBpZGVudGl0eSAoZGVzdCkge1xuICAgICAgICBkZXN0WzBdID0gMTtcbiAgICAgICAgZGVzdFsxXSA9IDA7XG4gICAgICAgIGRlc3RbMl0gPSAwO1xuICAgICAgICBkZXN0WzNdID0gMDtcbiAgICAgICAgZGVzdFs0XSA9IDA7XG4gICAgICAgIGRlc3RbNV0gPSAxO1xuICAgICAgICBkZXN0WzZdID0gMDtcbiAgICAgICAgZGVzdFs3XSA9IDA7XG4gICAgICAgIGRlc3RbOF0gPSAwO1xuICAgICAgICBkZXN0WzldID0gMDtcbiAgICAgICAgZGVzdFsxMF0gPSAxO1xuICAgICAgICBkZXN0WzExXSA9IDA7XG4gICAgICAgIGRlc3RbMTJdID0gMDtcbiAgICAgICAgZGVzdFsxM10gPSAwO1xuICAgICAgICBkZXN0WzE0XSA9IDA7XG4gICAgICAgIGRlc3RbMTVdID0gMTtcbiAgICAgICAgcmV0dXJuIGRlc3Q7XG4gICAgfTtcbiAgICBtdWx0aXBseSAobWF0MSwgbWF0MiwgZGVzdCkge1xuICAgICAgICBsZXQgYSA9IG1hdDFbMF0sIGIgPSBtYXQxWzFdLCBjID0gbWF0MVsyXSwgZCA9IG1hdDFbM10sXG4gICAgICAgICAgICBlID0gbWF0MVs0XSwgZiA9IG1hdDFbNV0sIGcgPSBtYXQxWzZdLCBoID0gbWF0MVs3XSxcbiAgICAgICAgICAgIGkgPSBtYXQxWzhdLCBqID0gbWF0MVs5XSwgayA9IG1hdDFbMTBdLCBsID0gbWF0MVsxMV0sXG4gICAgICAgICAgICBtID0gbWF0MVsxMl0sIG4gPSBtYXQxWzEzXSwgbyA9IG1hdDFbMTRdLCBwID0gbWF0MVsxNV0sXG4gICAgICAgICAgICBBID0gbWF0MlswXSwgQiA9IG1hdDJbMV0sIEMgPSBtYXQyWzJdLCBEID0gbWF0MlszXSxcbiAgICAgICAgICAgIEUgPSBtYXQyWzRdLCBGID0gbWF0Mls1XSwgRyA9IG1hdDJbNl0sIEggPSBtYXQyWzddLFxuICAgICAgICAgICAgSSA9IG1hdDJbOF0sIEogPSBtYXQyWzldLCBLID0gbWF0MlsxMF0sIEwgPSBtYXQyWzExXSxcbiAgICAgICAgICAgIE0gPSBtYXQyWzEyXSwgTiA9IG1hdDJbMTNdLCBPID0gbWF0MlsxNF0sIFAgPSBtYXQyWzE1XTtcbiAgICAgICAgZGVzdFswXSA9IEEgKiBhICsgQiAqIGUgKyBDICogaSArIEQgKiBtO1xuICAgICAgICBkZXN0WzFdID0gQSAqIGIgKyBCICogZiArIEMgKiBqICsgRCAqIG47XG4gICAgICAgIGRlc3RbMl0gPSBBICogYyArIEIgKiBnICsgQyAqIGsgKyBEICogbztcbiAgICAgICAgZGVzdFszXSA9IEEgKiBkICsgQiAqIGggKyBDICogbCArIEQgKiBwO1xuICAgICAgICBkZXN0WzRdID0gRSAqIGEgKyBGICogZSArIEcgKiBpICsgSCAqIG07XG4gICAgICAgIGRlc3RbNV0gPSBFICogYiArIEYgKiBmICsgRyAqIGogKyBIICogbjtcbiAgICAgICAgZGVzdFs2XSA9IEUgKiBjICsgRiAqIGcgKyBHICogayArIEggKiBvO1xuICAgICAgICBkZXN0WzddID0gRSAqIGQgKyBGICogaCArIEcgKiBsICsgSCAqIHA7XG4gICAgICAgIGRlc3RbOF0gPSBJICogYSArIEogKiBlICsgSyAqIGkgKyBMICogbTtcbiAgICAgICAgZGVzdFs5XSA9IEkgKiBiICsgSiAqIGYgKyBLICogaiArIEwgKiBuO1xuICAgICAgICBkZXN0WzEwXSA9IEkgKiBjICsgSiAqIGcgKyBLICogayArIEwgKiBvO1xuICAgICAgICBkZXN0WzExXSA9IEkgKiBkICsgSiAqIGggKyBLICogbCArIEwgKiBwO1xuICAgICAgICBkZXN0WzEyXSA9IE0gKiBhICsgTiAqIGUgKyBPICogaSArIFAgKiBtO1xuICAgICAgICBkZXN0WzEzXSA9IE0gKiBiICsgTiAqIGYgKyBPICogaiArIFAgKiBuO1xuICAgICAgICBkZXN0WzE0XSA9IE0gKiBjICsgTiAqIGcgKyBPICogayArIFAgKiBvO1xuICAgICAgICBkZXN0WzE1XSA9IE0gKiBkICsgTiAqIGggKyBPICogbCArIFAgKiBwO1xuICAgICAgICByZXR1cm4gZGVzdDtcbiAgICB9O1xuICAgIHNjYWxlIChtYXQsIHZlYywgZGVzdCkge1xuICAgICAgICBkZXN0WzBdID0gbWF0WzBdICogdmVjWzBdO1xuICAgICAgICBkZXN0WzFdID0gbWF0WzFdICogdmVjWzBdO1xuICAgICAgICBkZXN0WzJdID0gbWF0WzJdICogdmVjWzBdO1xuICAgICAgICBkZXN0WzNdID0gbWF0WzNdICogdmVjWzBdO1xuICAgICAgICBkZXN0WzRdID0gbWF0WzRdICogdmVjWzFdO1xuICAgICAgICBkZXN0WzVdID0gbWF0WzVdICogdmVjWzFdO1xuICAgICAgICBkZXN0WzZdID0gbWF0WzZdICogdmVjWzFdO1xuICAgICAgICBkZXN0WzddID0gbWF0WzddICogdmVjWzFdO1xuICAgICAgICBkZXN0WzhdID0gbWF0WzhdICogdmVjWzJdO1xuICAgICAgICBkZXN0WzldID0gbWF0WzldICogdmVjWzJdO1xuICAgICAgICBkZXN0WzEwXSA9IG1hdFsxMF0gKiB2ZWNbMl07XG4gICAgICAgIGRlc3RbMTFdID0gbWF0WzExXSAqIHZlY1syXTtcbiAgICAgICAgZGVzdFsxMl0gPSBtYXRbMTJdO1xuICAgICAgICBkZXN0WzEzXSA9IG1hdFsxM107XG4gICAgICAgIGRlc3RbMTRdID0gbWF0WzE0XTtcbiAgICAgICAgZGVzdFsxNV0gPSBtYXRbMTVdO1xuICAgICAgICByZXR1cm4gZGVzdDtcbiAgICB9O1xuICAgIHRyYW5zbGF0ZSAobWF0LCB2ZWMsIGRlc3QpIHtcbiAgICAgICAgZGVzdFswXSA9IG1hdFswXTtcbiAgICAgICAgZGVzdFsxXSA9IG1hdFsxXTtcbiAgICAgICAgZGVzdFsyXSA9IG1hdFsyXTtcbiAgICAgICAgZGVzdFszXSA9IG1hdFszXTtcbiAgICAgICAgZGVzdFs0XSA9IG1hdFs0XTtcbiAgICAgICAgZGVzdFs1XSA9IG1hdFs1XTtcbiAgICAgICAgZGVzdFs2XSA9IG1hdFs2XTtcbiAgICAgICAgZGVzdFs3XSA9IG1hdFs3XTtcbiAgICAgICAgZGVzdFs4XSA9IG1hdFs4XTtcbiAgICAgICAgZGVzdFs5XSA9IG1hdFs5XTtcbiAgICAgICAgZGVzdFsxMF0gPSBtYXRbMTBdO1xuICAgICAgICBkZXN0WzExXSA9IG1hdFsxMV07XG4gICAgICAgIGRlc3RbMTJdID0gbWF0WzBdICogdmVjWzBdICsgbWF0WzRdICogdmVjWzFdICsgbWF0WzhdICogdmVjWzJdICsgbWF0WzEyXTtcbiAgICAgICAgZGVzdFsxM10gPSBtYXRbMV0gKiB2ZWNbMF0gKyBtYXRbNV0gKiB2ZWNbMV0gKyBtYXRbOV0gKiB2ZWNbMl0gKyBtYXRbMTNdO1xuICAgICAgICBkZXN0WzE0XSA9IG1hdFsyXSAqIHZlY1swXSArIG1hdFs2XSAqIHZlY1sxXSArIG1hdFsxMF0gKiB2ZWNbMl0gKyBtYXRbMTRdO1xuICAgICAgICBkZXN0WzE1XSA9IG1hdFszXSAqIHZlY1swXSArIG1hdFs3XSAqIHZlY1sxXSArIG1hdFsxMV0gKiB2ZWNbMl0gKyBtYXRbMTVdO1xuICAgICAgICByZXR1cm4gZGVzdDtcbiAgICB9O1xuICAgIHJvdGF0ZSAobWF0LCBhbmdsZSwgYXhpcywgZGVzdCkge1xuICAgICAgICBsZXQgc3EgPSBNYXRoLnNxcnQoYXhpc1swXSAqIGF4aXNbMF0gKyBheGlzWzFdICogYXhpc1sxXSArIGF4aXNbMl0gKiBheGlzWzJdKTtcbiAgICAgICAgaWYgKCFzcSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGEgPSBheGlzWzBdLCBiID0gYXhpc1sxXSwgYyA9IGF4aXNbMl07XG4gICAgICAgIGlmIChzcSAhPSAxKSB7XG4gICAgICAgICAgICBzcSA9IDEgLyBzcTtcbiAgICAgICAgICAgIGEgKj0gc3E7XG4gICAgICAgICAgICBiICo9IHNxO1xuICAgICAgICAgICAgYyAqPSBzcTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZCA9IE1hdGguc2luKGFuZ2xlKSwgZSA9IE1hdGguY29zKGFuZ2xlKSwgZiA9IDEgLSBlLFxuICAgICAgICAgICAgZyA9IG1hdFswXSwgaCA9IG1hdFsxXSwgaSA9IG1hdFsyXSwgaiA9IG1hdFszXSxcbiAgICAgICAgICAgIGsgPSBtYXRbNF0sIGwgPSBtYXRbNV0sIG0gPSBtYXRbNl0sIG4gPSBtYXRbN10sXG4gICAgICAgICAgICBvID0gbWF0WzhdLCBwID0gbWF0WzldLCBxID0gbWF0WzEwXSwgciA9IG1hdFsxMV0sXG4gICAgICAgICAgICBzID0gYSAqIGEgKiBmICsgZSxcbiAgICAgICAgICAgIHQgPSBiICogYSAqIGYgKyBjICogZCxcbiAgICAgICAgICAgIHUgPSBjICogYSAqIGYgLSBiICogZCxcbiAgICAgICAgICAgIHYgPSBhICogYiAqIGYgLSBjICogZCxcbiAgICAgICAgICAgIHcgPSBiICogYiAqIGYgKyBlLFxuICAgICAgICAgICAgeCA9IGMgKiBiICogZiArIGEgKiBkLFxuICAgICAgICAgICAgeSA9IGEgKiBjICogZiArIGIgKiBkLFxuICAgICAgICAgICAgeiA9IGIgKiBjICogZiAtIGEgKiBkLFxuICAgICAgICAgICAgQSA9IGMgKiBjICogZiArIGU7XG4gICAgICAgIGlmIChhbmdsZSkge1xuICAgICAgICAgICAgaWYgKG1hdCAhPSBkZXN0KSB7XG4gICAgICAgICAgICAgICAgZGVzdFsxMl0gPSBtYXRbMTJdO1xuICAgICAgICAgICAgICAgIGRlc3RbMTNdID0gbWF0WzEzXTtcbiAgICAgICAgICAgICAgICBkZXN0WzE0XSA9IG1hdFsxNF07XG4gICAgICAgICAgICAgICAgZGVzdFsxNV0gPSBtYXRbMTVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGVzdCA9IG1hdDtcbiAgICAgICAgfVxuICAgICAgICBkZXN0WzBdID0gZyAqIHMgKyBrICogdCArIG8gKiB1O1xuICAgICAgICBkZXN0WzFdID0gaCAqIHMgKyBsICogdCArIHAgKiB1O1xuICAgICAgICBkZXN0WzJdID0gaSAqIHMgKyBtICogdCArIHEgKiB1O1xuICAgICAgICBkZXN0WzNdID0gaiAqIHMgKyBuICogdCArIHIgKiB1O1xuICAgICAgICBkZXN0WzRdID0gZyAqIHYgKyBrICogdyArIG8gKiB4O1xuICAgICAgICBkZXN0WzVdID0gaCAqIHYgKyBsICogdyArIHAgKiB4O1xuICAgICAgICBkZXN0WzZdID0gaSAqIHYgKyBtICogdyArIHEgKiB4O1xuICAgICAgICBkZXN0WzddID0gaiAqIHYgKyBuICogdyArIHIgKiB4O1xuICAgICAgICBkZXN0WzhdID0gZyAqIHkgKyBrICogeiArIG8gKiBBO1xuICAgICAgICBkZXN0WzldID0gaCAqIHkgKyBsICogeiArIHAgKiBBO1xuICAgICAgICBkZXN0WzEwXSA9IGkgKiB5ICsgbSAqIHogKyBxICogQTtcbiAgICAgICAgZGVzdFsxMV0gPSBqICogeSArIG4gKiB6ICsgciAqIEE7XG4gICAgICAgIHJldHVybiBkZXN0O1xuICAgIH07XG4gICAgbG9va0F0IChleWUsIGNlbnRlciwgdXAsIGRlc3QpIHtcbiAgICAgICAgbGV0IGV5ZVggPSBleWVbMF0sIGV5ZVkgPSBleWVbMV0sIGV5ZVogPSBleWVbMl0sXG4gICAgICAgICAgICB1cFggPSB1cFswXSwgdXBZID0gdXBbMV0sIHVwWiA9IHVwWzJdLFxuICAgICAgICAgICAgY2VudGVyWCA9IGNlbnRlclswXSwgY2VudGVyWSA9IGNlbnRlclsxXSwgY2VudGVyWiA9IGNlbnRlclsyXTtcbiAgICAgICAgaWYgKGV5ZVggPT0gY2VudGVyWCAmJiBleWVZID09IGNlbnRlclkgJiYgZXllWiA9PSBjZW50ZXJaKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pZGVudGl0eShkZXN0KTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgeDAsIHgxLCB4MiwgeTAsIHkxLCB5MiwgejAsIHoxLCB6MiwgbDtcbiAgICAgICAgejAgPSBleWVYIC0gY2VudGVyWzBdO1xuICAgICAgICB6MSA9IGV5ZVkgLSBjZW50ZXJbMV07XG4gICAgICAgIHoyID0gZXllWiAtIGNlbnRlclsyXTtcbiAgICAgICAgbCA9IDEgLyBNYXRoLnNxcnQoejAgKiB6MCArIHoxICogejEgKyB6MiAqIHoyKTtcbiAgICAgICAgejAgKj0gbDtcbiAgICAgICAgejEgKj0gbDtcbiAgICAgICAgejIgKj0gbDtcbiAgICAgICAgeDAgPSB1cFkgKiB6MiAtIHVwWiAqIHoxO1xuICAgICAgICB4MSA9IHVwWiAqIHowIC0gdXBYICogejI7XG4gICAgICAgIHgyID0gdXBYICogejEgLSB1cFkgKiB6MDtcbiAgICAgICAgbCA9IE1hdGguc3FydCh4MCAqIHgwICsgeDEgKiB4MSArIHgyICogeDIpO1xuICAgICAgICBpZiAoIWwpIHtcbiAgICAgICAgICAgIHgwID0gMDtcbiAgICAgICAgICAgIHgxID0gMDtcbiAgICAgICAgICAgIHgyID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGwgPSAxIC8gbDtcbiAgICAgICAgICAgIHgwICo9IGw7XG4gICAgICAgICAgICB4MSAqPSBsO1xuICAgICAgICAgICAgeDIgKj0gbDtcbiAgICAgICAgfVxuICAgICAgICB5MCA9IHoxICogeDIgLSB6MiAqIHgxO1xuICAgICAgICB5MSA9IHoyICogeDAgLSB6MCAqIHgyO1xuICAgICAgICB5MiA9IHowICogeDEgLSB6MSAqIHgwO1xuICAgICAgICBsID0gTWF0aC5zcXJ0KHkwICogeTAgKyB5MSAqIHkxICsgeTIgKiB5Mik7XG4gICAgICAgIGlmICghbCkge1xuICAgICAgICAgICAgeTAgPSAwO1xuICAgICAgICAgICAgeTEgPSAwO1xuICAgICAgICAgICAgeTIgPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbCA9IDEgLyBsO1xuICAgICAgICAgICAgeTAgKj0gbDtcbiAgICAgICAgICAgIHkxICo9IGw7XG4gICAgICAgICAgICB5MiAqPSBsO1xuICAgICAgICB9XG4gICAgICAgIGRlc3RbMF0gPSB4MDtcbiAgICAgICAgZGVzdFsxXSA9IHkwO1xuICAgICAgICBkZXN0WzJdID0gejA7XG4gICAgICAgIGRlc3RbM10gPSAwO1xuICAgICAgICBkZXN0WzRdID0geDE7XG4gICAgICAgIGRlc3RbNV0gPSB5MTtcbiAgICAgICAgZGVzdFs2XSA9IHoxO1xuICAgICAgICBkZXN0WzddID0gMDtcbiAgICAgICAgZGVzdFs4XSA9IHgyO1xuICAgICAgICBkZXN0WzldID0geTI7XG4gICAgICAgIGRlc3RbMTBdID0gejI7XG4gICAgICAgIGRlc3RbMTFdID0gMDtcbiAgICAgICAgZGVzdFsxMl0gPSAtKHgwICogZXllWCArIHgxICogZXllWSArIHgyICogZXllWik7XG4gICAgICAgIGRlc3RbMTNdID0gLSh5MCAqIGV5ZVggKyB5MSAqIGV5ZVkgKyB5MiAqIGV5ZVopO1xuICAgICAgICBkZXN0WzE0XSA9IC0oejAgKiBleWVYICsgejEgKiBleWVZICsgejIgKiBleWVaKTtcbiAgICAgICAgZGVzdFsxNV0gPSAxO1xuICAgICAgICByZXR1cm4gZGVzdDtcbiAgICB9O1xuICAgIHBlcnNwZWN0aXZlIChmb3Z5LCBhc3BlY3QsIG5lYXIsIGZhciwgZGVzdCkge1xuICAgICAgICBsZXQgdCA9IG5lYXIgKiBNYXRoLnRhbihmb3Z5ICogTWF0aC5QSSAvIDM2MCk7XG4gICAgICAgIGxldCByID0gdCAqIGFzcGVjdDtcbiAgICAgICAgbGV0IGEgPSByICogMiwgYiA9IHQgKiAyLCBjID0gZmFyIC0gbmVhcjtcbiAgICAgICAgZGVzdFswXSA9IG5lYXIgKiAyIC8gYTtcbiAgICAgICAgZGVzdFsxXSA9IDA7XG4gICAgICAgIGRlc3RbMl0gPSAwO1xuICAgICAgICBkZXN0WzNdID0gMDtcbiAgICAgICAgZGVzdFs0XSA9IDA7XG4gICAgICAgIGRlc3RbNV0gPSBuZWFyICogMiAvIGI7XG4gICAgICAgIGRlc3RbNl0gPSAwO1xuICAgICAgICBkZXN0WzddID0gMDtcbiAgICAgICAgZGVzdFs4XSA9IDA7XG4gICAgICAgIGRlc3RbOV0gPSAwO1xuICAgICAgICBkZXN0WzEwXSA9IC0oZmFyICsgbmVhcikgLyBjO1xuICAgICAgICBkZXN0WzExXSA9IC0xO1xuICAgICAgICBkZXN0WzEyXSA9IDA7XG4gICAgICAgIGRlc3RbMTNdID0gMDtcbiAgICAgICAgZGVzdFsxNF0gPSAtKGZhciAqIG5lYXIgKiAyKSAvIGM7XG4gICAgICAgIGRlc3RbMTVdID0gMDtcbiAgICAgICAgcmV0dXJuIGRlc3Q7XG4gICAgfTtcbiAgICBvcnRobyAobGVmdCwgcmlnaHQsIHRvcCwgYm90dG9tLCBuZWFyLCBmYXIsIGRlc3QpIHtcbiAgICAgICAgbGV0IGggPSAocmlnaHQgLSBsZWZ0KTtcbiAgICAgICAgbGV0IHYgPSAodG9wIC0gYm90dG9tKTtcbiAgICAgICAgbGV0IGQgPSAoZmFyIC0gbmVhcik7XG4gICAgICAgIGRlc3RbMF0gPSAyIC8gaDtcbiAgICAgICAgZGVzdFsxXSA9IDA7XG4gICAgICAgIGRlc3RbMl0gPSAwO1xuICAgICAgICBkZXN0WzNdID0gMDtcbiAgICAgICAgZGVzdFs0XSA9IDA7XG4gICAgICAgIGRlc3RbNV0gPSAyIC8gdjtcbiAgICAgICAgZGVzdFs2XSA9IDA7XG4gICAgICAgIGRlc3RbN10gPSAwO1xuICAgICAgICBkZXN0WzhdID0gMDtcbiAgICAgICAgZGVzdFs5XSA9IDA7XG4gICAgICAgIGRlc3RbMTBdID0gLTIgLyBkO1xuICAgICAgICBkZXN0WzExXSA9IDA7XG4gICAgICAgIGRlc3RbMTJdID0gLShsZWZ0ICsgcmlnaHQpIC8gaDtcbiAgICAgICAgZGVzdFsxM10gPSAtKHRvcCArIGJvdHRvbSkgLyB2O1xuICAgICAgICBkZXN0WzE0XSA9IC0oZmFyICsgbmVhcikgLyBkO1xuICAgICAgICBkZXN0WzE1XSA9IDE7XG4gICAgICAgIHJldHVybiBkZXN0O1xuICAgIH07XG4gICAgdHJhbnNwb3NlIChtYXQsIGRlc3QpIHtcbiAgICAgICAgZGVzdFswXSA9IG1hdFswXTtcbiAgICAgICAgZGVzdFsxXSA9IG1hdFs0XTtcbiAgICAgICAgZGVzdFsyXSA9IG1hdFs4XTtcbiAgICAgICAgZGVzdFszXSA9IG1hdFsxMl07XG4gICAgICAgIGRlc3RbNF0gPSBtYXRbMV07XG4gICAgICAgIGRlc3RbNV0gPSBtYXRbNV07XG4gICAgICAgIGRlc3RbNl0gPSBtYXRbOV07XG4gICAgICAgIGRlc3RbN10gPSBtYXRbMTNdO1xuICAgICAgICBkZXN0WzhdID0gbWF0WzJdO1xuICAgICAgICBkZXN0WzldID0gbWF0WzZdO1xuICAgICAgICBkZXN0WzEwXSA9IG1hdFsxMF07XG4gICAgICAgIGRlc3RbMTFdID0gbWF0WzE0XTtcbiAgICAgICAgZGVzdFsxMl0gPSBtYXRbM107XG4gICAgICAgIGRlc3RbMTNdID0gbWF0WzddO1xuICAgICAgICBkZXN0WzE0XSA9IG1hdFsxMV07XG4gICAgICAgIGRlc3RbMTVdID0gbWF0WzE1XTtcbiAgICAgICAgcmV0dXJuIGRlc3Q7XG4gICAgfTtcbiAgICBpbnZlcnNlIChtYXQsIGRlc3QpIHtcbiAgICAgICAgbGV0IGEgPSBtYXRbMF0sIGIgPSBtYXRbMV0sIGMgPSBtYXRbMl0sIGQgPSBtYXRbM10sXG4gICAgICAgICAgICBlID0gbWF0WzRdLCBmID0gbWF0WzVdLCBnID0gbWF0WzZdLCBoID0gbWF0WzddLFxuICAgICAgICAgICAgaSA9IG1hdFs4XSwgaiA9IG1hdFs5XSwgayA9IG1hdFsxMF0sIGwgPSBtYXRbMTFdLFxuICAgICAgICAgICAgbSA9IG1hdFsxMl0sIG4gPSBtYXRbMTNdLCBvID0gbWF0WzE0XSwgcCA9IG1hdFsxNV0sXG4gICAgICAgICAgICBxID0gYSAqIGYgLSBiICogZSwgciA9IGEgKiBnIC0gYyAqIGUsXG4gICAgICAgICAgICBzID0gYSAqIGggLSBkICogZSwgdCA9IGIgKiBnIC0gYyAqIGYsXG4gICAgICAgICAgICB1ID0gYiAqIGggLSBkICogZiwgdiA9IGMgKiBoIC0gZCAqIGcsXG4gICAgICAgICAgICB3ID0gaSAqIG4gLSBqICogbSwgeCA9IGkgKiBvIC0gayAqIG0sXG4gICAgICAgICAgICB5ID0gaSAqIHAgLSBsICogbSwgeiA9IGogKiBvIC0gayAqIG4sXG4gICAgICAgICAgICBBID0gaiAqIHAgLSBsICogbiwgQiA9IGsgKiBwIC0gbCAqIG8sXG4gICAgICAgICAgICBpdmQgPSAxIC8gKHEgKiBCIC0gciAqIEEgKyBzICogeiArIHQgKiB5IC0gdSAqIHggKyB2ICogdyk7XG4gICAgICAgIGRlc3RbMF0gPSAoIGYgKiBCIC0gZyAqIEEgKyBoICogeikgKiBpdmQ7XG4gICAgICAgIGRlc3RbMV0gPSAoLWIgKiBCICsgYyAqIEEgLSBkICogeikgKiBpdmQ7XG4gICAgICAgIGRlc3RbMl0gPSAoIG4gKiB2IC0gbyAqIHUgKyBwICogdCkgKiBpdmQ7XG4gICAgICAgIGRlc3RbM10gPSAoLWogKiB2ICsgayAqIHUgLSBsICogdCkgKiBpdmQ7XG4gICAgICAgIGRlc3RbNF0gPSAoLWUgKiBCICsgZyAqIHkgLSBoICogeCkgKiBpdmQ7XG4gICAgICAgIGRlc3RbNV0gPSAoIGEgKiBCIC0gYyAqIHkgKyBkICogeCkgKiBpdmQ7XG4gICAgICAgIGRlc3RbNl0gPSAoLW0gKiB2ICsgbyAqIHMgLSBwICogcikgKiBpdmQ7XG4gICAgICAgIGRlc3RbN10gPSAoIGkgKiB2IC0gayAqIHMgKyBsICogcikgKiBpdmQ7XG4gICAgICAgIGRlc3RbOF0gPSAoIGUgKiBBIC0gZiAqIHkgKyBoICogdykgKiBpdmQ7XG4gICAgICAgIGRlc3RbOV0gPSAoLWEgKiBBICsgYiAqIHkgLSBkICogdykgKiBpdmQ7XG4gICAgICAgIGRlc3RbMTBdID0gKCBtICogdSAtIG4gKiBzICsgcCAqIHEpICogaXZkO1xuICAgICAgICBkZXN0WzExXSA9ICgtaSAqIHUgKyBqICogcyAtIGwgKiBxKSAqIGl2ZDtcbiAgICAgICAgZGVzdFsxMl0gPSAoLWUgKiB6ICsgZiAqIHggLSBnICogdykgKiBpdmQ7XG4gICAgICAgIGRlc3RbMTNdID0gKCBhICogeiAtIGIgKiB4ICsgYyAqIHcpICogaXZkO1xuICAgICAgICBkZXN0WzE0XSA9ICgtbSAqIHQgKyBuICogciAtIG8gKiBxKSAqIGl2ZDtcbiAgICAgICAgZGVzdFsxNV0gPSAoIGkgKiB0IC0gaiAqIHIgKyBrICogcSkgKiBpdmQ7XG4gICAgICAgIHJldHVybiBkZXN0O1xuICAgIH07XG59XG5cbmV4cG9ydCBjbGFzcyBxdG5JViB7XG4gICAgY3JlYXRlICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoNCk7XG4gICAgfTtcbiAgICBpZGVudGl0eSAoZGVzdCkge1xuICAgICAgICBkZXN0WzBdID0gMDtcbiAgICAgICAgZGVzdFsxXSA9IDA7XG4gICAgICAgIGRlc3RbMl0gPSAwO1xuICAgICAgICBkZXN0WzNdID0gMTtcbiAgICAgICAgcmV0dXJuIGRlc3Q7XG4gICAgfTtcbiAgICBpbnZlcnNlIChxdG4sIGRlc3QpIHtcbiAgICAgICAgZGVzdFswXSA9IC1xdG5bMF07XG4gICAgICAgIGRlc3RbMV0gPSAtcXRuWzFdO1xuICAgICAgICBkZXN0WzJdID0gLXF0blsyXTtcbiAgICAgICAgZGVzdFszXSA9IHF0blszXTtcbiAgICAgICAgcmV0dXJuIGRlc3Q7XG4gICAgfTtcbiAgICBub3JtYWxpemUgKGRlc3QpIHtcbiAgICAgICAgbGV0IHggPSBkZXN0WzBdLCB5ID0gZGVzdFsxXSwgeiA9IGRlc3RbMl0sIHcgPSBkZXN0WzNdO1xuICAgICAgICBsZXQgbCA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5ICsgeiAqIHogKyB3ICogdyk7XG4gICAgICAgIGlmIChsID09PSAwKSB7XG4gICAgICAgICAgICBkZXN0WzBdID0gMDtcbiAgICAgICAgICAgIGRlc3RbMV0gPSAwO1xuICAgICAgICAgICAgZGVzdFsyXSA9IDA7XG4gICAgICAgICAgICBkZXN0WzNdID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGwgPSAxIC8gbDtcbiAgICAgICAgICAgIGRlc3RbMF0gPSB4ICogbDtcbiAgICAgICAgICAgIGRlc3RbMV0gPSB5ICogbDtcbiAgICAgICAgICAgIGRlc3RbMl0gPSB6ICogbDtcbiAgICAgICAgICAgIGRlc3RbM10gPSB3ICogbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVzdDtcbiAgICB9O1xuICAgIG11bHRpcGx5IChxdG4xLCBxdG4yLCBkZXN0KSB7XG4gICAgICAgIGxldCBheCA9IHF0bjFbMF0sIGF5ID0gcXRuMVsxXSwgYXogPSBxdG4xWzJdLCBhdyA9IHF0bjFbM107XG4gICAgICAgIGxldCBieCA9IHF0bjJbMF0sIGJ5ID0gcXRuMlsxXSwgYnogPSBxdG4yWzJdLCBidyA9IHF0bjJbM107XG4gICAgICAgIGRlc3RbMF0gPSBheCAqIGJ3ICsgYXcgKiBieCArIGF5ICogYnogLSBheiAqIGJ5O1xuICAgICAgICBkZXN0WzFdID0gYXkgKiBidyArIGF3ICogYnkgKyBheiAqIGJ4IC0gYXggKiBiejtcbiAgICAgICAgZGVzdFsyXSA9IGF6ICogYncgKyBhdyAqIGJ6ICsgYXggKiBieSAtIGF5ICogYng7XG4gICAgICAgIGRlc3RbM10gPSBhdyAqIGJ3IC0gYXggKiBieCAtIGF5ICogYnkgLSBheiAqIGJ6O1xuICAgICAgICByZXR1cm4gZGVzdDtcbiAgICB9O1xuICAgIHJvdGF0ZSAoYW5nbGUsIGF4aXMsIGRlc3QpIHtcbiAgICAgICAgbGV0IHNxID0gTWF0aC5zcXJ0KGF4aXNbMF0gKiBheGlzWzBdICsgYXhpc1sxXSAqIGF4aXNbMV0gKyBheGlzWzJdICogYXhpc1syXSk7XG4gICAgICAgIGlmICghc3EpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGxldCBhID0gYXhpc1swXSwgYiA9IGF4aXNbMV0sIGMgPSBheGlzWzJdO1xuICAgICAgICBpZiAoc3EgIT0gMSkge1xuICAgICAgICAgICAgc3EgPSAxIC8gc3E7XG4gICAgICAgICAgICBhICo9IHNxO1xuICAgICAgICAgICAgYiAqPSBzcTtcbiAgICAgICAgICAgIGMgKj0gc3E7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHMgPSBNYXRoLnNpbihhbmdsZSAqIDAuNSk7XG4gICAgICAgIGRlc3RbMF0gPSBhICogcztcbiAgICAgICAgZGVzdFsxXSA9IGIgKiBzO1xuICAgICAgICBkZXN0WzJdID0gYyAqIHM7XG4gICAgICAgIGRlc3RbM10gPSBNYXRoLmNvcyhhbmdsZSAqIDAuNSk7XG4gICAgICAgIHJldHVybiBkZXN0O1xuICAgIH07XG4gICAgdG9WZWNJSUkgKHZlYywgcXRuLCBkZXN0KSB7XG4gICAgICAgIGxldCBxcCA9IHRoaXMuY3JlYXRlKCk7XG4gICAgICAgIGxldCBxcSA9IHRoaXMuY3JlYXRlKCk7XG4gICAgICAgIGxldCBxciA9IHRoaXMuY3JlYXRlKCk7XG4gICAgICAgIHRoaXMuaW52ZXJzZShxdG4sIHFyKTtcbiAgICAgICAgcXBbMF0gPSB2ZWNbMF07XG4gICAgICAgIHFwWzFdID0gdmVjWzFdO1xuICAgICAgICBxcFsyXSA9IHZlY1syXTtcbiAgICAgICAgdGhpcy5tdWx0aXBseShxciwgcXAsIHFxKTtcbiAgICAgICAgdGhpcy5tdWx0aXBseShxcSwgcXRuLCBxcik7XG4gICAgICAgIGRlc3RbMF0gPSBxclswXTtcbiAgICAgICAgZGVzdFsxXSA9IHFyWzFdO1xuICAgICAgICBkZXN0WzJdID0gcXJbMl07XG4gICAgICAgIHJldHVybiBkZXN0O1xuICAgIH07XG4gICAgdG9NYXRJViAocXRuLCBkZXN0KSB7XG4gICAgICAgIGxldCB4ID0gcXRuWzBdLCB5ID0gcXRuWzFdLCB6ID0gcXRuWzJdLCB3ID0gcXRuWzNdO1xuICAgICAgICBsZXQgeDIgPSB4ICsgeCwgeTIgPSB5ICsgeSwgejIgPSB6ICsgejtcbiAgICAgICAgbGV0IHh4ID0geCAqIHgyLCB4eSA9IHggKiB5MiwgeHogPSB4ICogejI7XG4gICAgICAgIGxldCB5eSA9IHkgKiB5MiwgeXogPSB5ICogejIsIHp6ID0geiAqIHoyO1xuICAgICAgICBsZXQgd3ggPSB3ICogeDIsIHd5ID0gdyAqIHkyLCB3eiA9IHcgKiB6MjtcbiAgICAgICAgZGVzdFswXSA9IDEgLSAoeXkgKyB6eik7XG4gICAgICAgIGRlc3RbMV0gPSB4eSAtIHd6O1xuICAgICAgICBkZXN0WzJdID0geHogKyB3eTtcbiAgICAgICAgZGVzdFszXSA9IDA7XG4gICAgICAgIGRlc3RbNF0gPSB4eSArIHd6O1xuICAgICAgICBkZXN0WzVdID0gMSAtICh4eCArIHp6KTtcbiAgICAgICAgZGVzdFs2XSA9IHl6IC0gd3g7XG4gICAgICAgIGRlc3RbN10gPSAwO1xuICAgICAgICBkZXN0WzhdID0geHogLSB3eTtcbiAgICAgICAgZGVzdFs5XSA9IHl6ICsgd3g7XG4gICAgICAgIGRlc3RbMTBdID0gMSAtICh4eCArIHl5KTtcbiAgICAgICAgZGVzdFsxMV0gPSAwO1xuICAgICAgICBkZXN0WzEyXSA9IDA7XG4gICAgICAgIGRlc3RbMTNdID0gMDtcbiAgICAgICAgZGVzdFsxNF0gPSAwO1xuICAgICAgICBkZXN0WzE1XSA9IDE7XG4gICAgICAgIHJldHVybiBkZXN0O1xuICAgIH07XG4gICAgc2xlcnAgKHF0bjEsIHF0bjIsIHRpbWUsIGRlc3QpIHtcbiAgICAgICAgbGV0IGh0ID0gcXRuMVswXSAqIHF0bjJbMF0gKyBxdG4xWzFdICogcXRuMlsxXSArIHF0bjFbMl0gKiBxdG4yWzJdICsgcXRuMVszXSAqIHF0bjJbM107XG4gICAgICAgIGxldCBocyA9IDEuMCAtIGh0ICogaHQ7XG4gICAgICAgIGlmIChocyA8PSAwLjApIHtcbiAgICAgICAgICAgIGRlc3RbMF0gPSBxdG4xWzBdO1xuICAgICAgICAgICAgZGVzdFsxXSA9IHF0bjFbMV07XG4gICAgICAgICAgICBkZXN0WzJdID0gcXRuMVsyXTtcbiAgICAgICAgICAgIGRlc3RbM10gPSBxdG4xWzNdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaHMgPSBNYXRoLnNxcnQoaHMpO1xuICAgICAgICAgICAgaWYgKE1hdGguYWJzKGhzKSA8IDAuMDAwMSkge1xuICAgICAgICAgICAgICAgIGRlc3RbMF0gPSAocXRuMVswXSAqIDAuNSArIHF0bjJbMF0gKiAwLjUpO1xuICAgICAgICAgICAgICAgIGRlc3RbMV0gPSAocXRuMVsxXSAqIDAuNSArIHF0bjJbMV0gKiAwLjUpO1xuICAgICAgICAgICAgICAgIGRlc3RbMl0gPSAocXRuMVsyXSAqIDAuNSArIHF0bjJbMl0gKiAwLjUpO1xuICAgICAgICAgICAgICAgIGRlc3RbM10gPSAocXRuMVszXSAqIDAuNSArIHF0bjJbM10gKiAwLjUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgcGggPSBNYXRoLmFjb3MoaHQpO1xuICAgICAgICAgICAgICAgIGxldCBwdCA9IHBoICogdGltZTtcbiAgICAgICAgICAgICAgICBsZXQgdDAgPSBNYXRoLnNpbihwaCAtIHB0KSAvIGhzO1xuICAgICAgICAgICAgICAgIGxldCB0MSA9IE1hdGguc2luKHB0KSAvIGhzO1xuICAgICAgICAgICAgICAgIGRlc3RbMF0gPSBxdG4xWzBdICogdDAgKyBxdG4yWzBdICogdDE7XG4gICAgICAgICAgICAgICAgZGVzdFsxXSA9IHF0bjFbMV0gKiB0MCArIHF0bjJbMV0gKiB0MTtcbiAgICAgICAgICAgICAgICBkZXN0WzJdID0gcXRuMVsyXSAqIHQwICsgcXRuMlsyXSAqIHQxO1xuICAgICAgICAgICAgICAgIGRlc3RbM10gPSBxdG4xWzNdICogdDAgKyBxdG4yWzNdICogdDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlc3Q7XG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvcnVzKHJvdywgY29sdW1uLCBpcmFkLCBvcmFkLCBjb2xvcikge1xuICAgIGxldCBpLCBqLCB0YztcbiAgICBsZXQgcG9zID0gbmV3IEFycmF5KCksIG5vciA9IG5ldyBBcnJheSgpLFxuICAgICAgICBjb2wgPSBuZXcgQXJyYXkoKSwgc3QgPSBuZXcgQXJyYXkoKSwgaWR4ID0gbmV3IEFycmF5KCk7XG4gICAgZm9yIChpID0gMDsgaSA8PSByb3c7IGkrKykge1xuICAgICAgICBsZXQgciA9IE1hdGguUEkgKiAyIC8gcm93ICogaTtcbiAgICAgICAgbGV0IHJyID0gTWF0aC5jb3Mocik7XG4gICAgICAgIGxldCByeSA9IE1hdGguc2luKHIpO1xuICAgICAgICBmb3IgKGogPSAwOyBqIDw9IGNvbHVtbjsgaisrKSB7XG4gICAgICAgICAgICBsZXQgdHIgPSBNYXRoLlBJICogMiAvIGNvbHVtbiAqIGo7XG4gICAgICAgICAgICBsZXQgdHggPSAocnIgKiBpcmFkICsgb3JhZCkgKiBNYXRoLmNvcyh0cik7XG4gICAgICAgICAgICBsZXQgdHkgPSByeSAqIGlyYWQ7XG4gICAgICAgICAgICBsZXQgdHogPSAocnIgKiBpcmFkICsgb3JhZCkgKiBNYXRoLnNpbih0cik7XG4gICAgICAgICAgICBsZXQgcnggPSByciAqIE1hdGguY29zKHRyKTtcbiAgICAgICAgICAgIGxldCByeiA9IHJyICogTWF0aC5zaW4odHIpO1xuICAgICAgICAgICAgaWYgKGNvbG9yKSB7XG4gICAgICAgICAgICAgICAgdGMgPSBjb2xvcjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGMgPSBoc3ZhKDM2MCAvIGNvbHVtbiAqIGosIDEsIDEsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHJzID0gMSAvIGNvbHVtbiAqIGo7XG4gICAgICAgICAgICBsZXQgcnQgPSAxIC8gcm93ICogaSArIDAuNTtcbiAgICAgICAgICAgIGlmIChydCA+IDEuMCkge1xuICAgICAgICAgICAgICAgIHJ0IC09IDEuMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJ0ID0gMS4wIC0gcnQ7XG4gICAgICAgICAgICBwb3MucHVzaCh0eCwgdHksIHR6KTtcbiAgICAgICAgICAgIG5vci5wdXNoKHJ4LCByeSwgcnopO1xuICAgICAgICAgICAgY29sLnB1c2godGNbMF0sIHRjWzFdLCB0Y1syXSwgdGNbM10pO1xuICAgICAgICAgICAgc3QucHVzaChycywgcnQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZvciAoaSA9IDA7IGkgPCByb3c7IGkrKykge1xuICAgICAgICBmb3IgKGogPSAwOyBqIDwgY29sdW1uOyBqKyspIHtcbiAgICAgICAgICAgIHIgPSAoY29sdW1uICsgMSkgKiBpICsgajtcbiAgICAgICAgICAgIGlkeC5wdXNoKHIsIHIgKyBjb2x1bW4gKyAxLCByICsgMSk7XG4gICAgICAgICAgICBpZHgucHVzaChyICsgY29sdW1uICsgMSwgciArIGNvbHVtbiArIDIsIHIgKyAxKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge3A6IHBvcywgbjogbm9yLCBjOiBjb2wsIHQ6IHN0LCBpOiBpZHh9O1xufVxuXG4vKipcbiAqIOeQg+S9k+OBrumggueCueODh+ODvOOCv+eUn+aIkFxuICogQHBhcmFtIHJvd1xuICogQHBhcmFtIGNvbHVtblxuICogQHBhcmFtIHJhZFxuICogQHBhcmFtIGNvbG9yXG4gKiBAcmV0dXJucyB7e3A6IEFycmF5LCBuOiBBcnJheSwgYzogQXJyYXksIHQ6IEFycmF5LCBpOiBBcnJheX19XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzcGhlcmUocm93LCBjb2x1bW4sIHJhZCwgY29sb3IpIHtcbiAgICBsZXQgaSwgaiwgdGM7XG4gICAgbGV0IHBvcyA9IG5ldyBBcnJheSgpLCBub3IgPSBuZXcgQXJyYXkoKSxcbiAgICAgICAgY29sID0gbmV3IEFycmF5KCksIHN0ID0gbmV3IEFycmF5KCksIGlkeCA9IG5ldyBBcnJheSgpO1xuICAgIGZvciAoaSA9IDA7IGkgPD0gcm93OyBpKyspIHtcbiAgICAgICAgbGV0IHIgPSBNYXRoLlBJIC8gcm93ICogaTtcbiAgICAgICAgbGV0IHJ5ID0gTWF0aC5jb3Mocik7XG4gICAgICAgIGxldCByciA9IE1hdGguc2luKHIpO1xuICAgICAgICBmb3IgKGogPSAwOyBqIDw9IGNvbHVtbjsgaisrKSB7XG4gICAgICAgICAgICBsZXQgdHIgPSBNYXRoLlBJICogMiAvIGNvbHVtbiAqIGo7XG4gICAgICAgICAgICBsZXQgdHggPSByciAqIHJhZCAqIE1hdGguY29zKHRyKTtcbiAgICAgICAgICAgIGxldCB0eSA9IHJ5ICogcmFkO1xuICAgICAgICAgICAgbGV0IHR6ID0gcnIgKiByYWQgKiBNYXRoLnNpbih0cik7XG4gICAgICAgICAgICBsZXQgcnggPSByciAqIE1hdGguY29zKHRyKTtcbiAgICAgICAgICAgIGxldCByeiA9IHJyICogTWF0aC5zaW4odHIpO1xuICAgICAgICAgICAgaWYgKGNvbG9yKSB7XG4gICAgICAgICAgICAgICAgdGMgPSBjb2xvcjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGMgPSBoc3ZhKDM2MCAvIHJvdyAqIGksIDEsIDEsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcG9zLnB1c2godHgsIHR5LCB0eik7XG4gICAgICAgICAgICBub3IucHVzaChyeCwgcnksIHJ6KTtcbiAgICAgICAgICAgIGNvbC5wdXNoKHRjWzBdLCB0Y1sxXSwgdGNbMl0sIHRjWzNdKTtcbiAgICAgICAgICAgIHN0LnB1c2goMSAtIDEgLyBjb2x1bW4gKiBqLCAxIC8gcm93ICogaSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbGV0IHIgPSAwO1xuICAgIGZvciAoaSA9IDA7IGkgPCByb3c7IGkrKykge1xuICAgICAgICBmb3IgKGogPSAwOyBqIDwgY29sdW1uOyBqKyspIHtcbiAgICAgICAgICAgIHIgPSAoY29sdW1uICsgMSkgKiBpICsgajtcbiAgICAgICAgICAgIGlkeC5wdXNoKHIsIHIgKyAxLCByICsgY29sdW1uICsgMik7XG4gICAgICAgICAgICBpZHgucHVzaChyLCByICsgY29sdW1uICsgMiwgciArIGNvbHVtbiArIDEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7cDogcG9zLCBuOiBub3IsIGM6IGNvbCwgdDogc3QsIGk6IGlkeH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjdWJlKHNpZGUsIGNvbG9yKSB7XG4gICAgbGV0IHRjLCBocyA9IHNpZGUgKiAwLjU7XG4gICAgbGV0IHBvcyA9IFtcbiAgICAgICAgLWhzLCAtaHMsIGhzLCBocywgLWhzLCBocywgaHMsIGhzLCBocywgLWhzLCBocywgaHMsXG4gICAgICAgIC1ocywgLWhzLCAtaHMsIC1ocywgaHMsIC1ocywgaHMsIGhzLCAtaHMsIGhzLCAtaHMsIC1ocyxcbiAgICAgICAgLWhzLCBocywgLWhzLCAtaHMsIGhzLCBocywgaHMsIGhzLCBocywgaHMsIGhzLCAtaHMsXG4gICAgICAgIC1ocywgLWhzLCAtaHMsIGhzLCAtaHMsIC1ocywgaHMsIC1ocywgaHMsIC1ocywgLWhzLCBocyxcbiAgICAgICAgaHMsIC1ocywgLWhzLCBocywgaHMsIC1ocywgaHMsIGhzLCBocywgaHMsIC1ocywgaHMsXG4gICAgICAgIC1ocywgLWhzLCAtaHMsIC1ocywgLWhzLCBocywgLWhzLCBocywgaHMsIC1ocywgaHMsIC1oc1xuICAgIF07XG4gICAgbGV0IG5vciA9IFtcbiAgICAgICAgLTEuMCwgLTEuMCwgMS4wLCAxLjAsIC0xLjAsIDEuMCwgMS4wLCAxLjAsIDEuMCwgLTEuMCwgMS4wLCAxLjAsXG4gICAgICAgIC0xLjAsIC0xLjAsIC0xLjAsIC0xLjAsIDEuMCwgLTEuMCwgMS4wLCAxLjAsIC0xLjAsIDEuMCwgLTEuMCwgLTEuMCxcbiAgICAgICAgLTEuMCwgMS4wLCAtMS4wLCAtMS4wLCAxLjAsIDEuMCwgMS4wLCAxLjAsIDEuMCwgMS4wLCAxLjAsIC0xLjAsXG4gICAgICAgIC0xLjAsIC0xLjAsIC0xLjAsIDEuMCwgLTEuMCwgLTEuMCwgMS4wLCAtMS4wLCAxLjAsIC0xLjAsIC0xLjAsIDEuMCxcbiAgICAgICAgMS4wLCAtMS4wLCAtMS4wLCAxLjAsIDEuMCwgLTEuMCwgMS4wLCAxLjAsIDEuMCwgMS4wLCAtMS4wLCAxLjAsXG4gICAgICAgIC0xLjAsIC0xLjAsIC0xLjAsIC0xLjAsIC0xLjAsIDEuMCwgLTEuMCwgMS4wLCAxLjAsIC0xLjAsIDEuMCwgLTEuMFxuICAgIF07XG4gICAgbGV0IGNvbCA9IG5ldyBBcnJheSgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9zLmxlbmd0aCAvIDM7IGkrKykge1xuICAgICAgICBpZiAoY29sb3IpIHtcbiAgICAgICAgICAgIHRjID0gY29sb3I7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0YyA9IGhzdmEoMzYwIC8gcG9zLmxlbmd0aCAvIDMgKiBpLCAxLCAxLCAxKTtcbiAgICAgICAgfVxuICAgICAgICBjb2wucHVzaCh0Y1swXSwgdGNbMV0sIHRjWzJdLCB0Y1szXSk7XG4gICAgfVxuICAgIGxldCBzdCA9IFtcbiAgICAgICAgMC4wLCAwLjAsIDEuMCwgMC4wLCAxLjAsIDEuMCwgMC4wLCAxLjAsXG4gICAgICAgIDAuMCwgMC4wLCAxLjAsIDAuMCwgMS4wLCAxLjAsIDAuMCwgMS4wLFxuICAgICAgICAwLjAsIDAuMCwgMS4wLCAwLjAsIDEuMCwgMS4wLCAwLjAsIDEuMCxcbiAgICAgICAgMC4wLCAwLjAsIDEuMCwgMC4wLCAxLjAsIDEuMCwgMC4wLCAxLjAsXG4gICAgICAgIDAuMCwgMC4wLCAxLjAsIDAuMCwgMS4wLCAxLjAsIDAuMCwgMS4wLFxuICAgICAgICAwLjAsIDAuMCwgMS4wLCAwLjAsIDEuMCwgMS4wLCAwLjAsIDEuMFxuICAgIF07XG4gICAgbGV0IGlkeCA9IFtcbiAgICAgICAgMCwgMSwgMiwgMCwgMiwgMyxcbiAgICAgICAgNCwgNSwgNiwgNCwgNiwgNyxcbiAgICAgICAgOCwgOSwgMTAsIDgsIDEwLCAxMSxcbiAgICAgICAgMTIsIDEzLCAxNCwgMTIsIDE0LCAxNSxcbiAgICAgICAgMTYsIDE3LCAxOCwgMTYsIDE4LCAxOSxcbiAgICAgICAgMjAsIDIxLCAyMiwgMjAsIDIyLCAyM1xuICAgIF07XG4gICAgcmV0dXJuIHtwOiBwb3MsIG46IG5vciwgYzogY29sLCB0OiBzdCwgaTogaWR4fTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhzdmEoaCwgcywgdiwgYSkge1xuICAgIGlmIChzID4gMSB8fCB2ID4gMSB8fCBhID4gMSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCB0aCA9IGggJSAzNjA7XG4gICAgbGV0IGkgPSBNYXRoLmZsb29yKHRoIC8gNjApO1xuICAgIGxldCBmID0gdGggLyA2MCAtIGk7XG4gICAgbGV0IG0gPSB2ICogKDEgLSBzKTtcbiAgICBsZXQgbiA9IHYgKiAoMSAtIHMgKiBmKTtcbiAgICBsZXQgayA9IHYgKiAoMSAtIHMgKiAoMSAtIGYpKTtcbiAgICBsZXQgY29sb3IgPSBuZXcgQXJyYXkoKTtcbiAgICBpZiAoIXMgPiAwICYmICFzIDwgMCkge1xuICAgICAgICBjb2xvci5wdXNoKHYsIHYsIHYsIGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCByID0gbmV3IEFycmF5KHYsIG4sIG0sIG0sIGssIHYpO1xuICAgICAgICBsZXQgZyA9IG5ldyBBcnJheShrLCB2LCB2LCBuLCBtLCBtKTtcbiAgICAgICAgbGV0IGIgPSBuZXcgQXJyYXkobSwgbSwgaywgdiwgdiwgbik7XG4gICAgICAgIGNvbG9yLnB1c2gocltpXSwgZ1tpXSwgYltpXSwgYSk7XG4gICAgfVxuICAgIHJldHVybiBjb2xvcjtcbn1cbiJdfQ==
