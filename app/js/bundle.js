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
      console.log('Start Sample1');

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
/*
 * Sample 2
 * 行列計算によるtranslate/ rotation
 * requestAnimationFrameによるアニメーション
 */

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _minMatrix = require("./minMatrix");

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
      console.log('Start Sample2');

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

},{"./minMatrix":10}],3:[function(require,module,exports){
/*
 * Sample 3
 * 球体モデルの表示
 * index buffer
 * 頂点色で着色して描画
 * depth test
 */

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _minMatrix = require("./minMatrix");

var Sample3 = (function () {
  /**
   * constructor
   * コンストラクタ
   */

  function Sample3() {
    _classCallCheck(this, Sample3);

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
      console.log('Start Sample3');
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

      // 設定を有効化する
      this.gl.enable(this.gl.DEPTH_TEST);
      this.gl.depthFunc(this.gl.LEQUAL);

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
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

      var radians = this.count % 360 * Math.PI / 180;

      // モデル座標変換行列を一度初期化してリセットする
      this.mat.identity(this.mMatrix);
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

},{"./minMatrix":10}],4:[function(require,module,exports){
/*
* Sample 4
* 拡散光実装
*/

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _minMatrix = require("./minMatrix");

var Sample4 = (function () {
  /**
   * constructor
   * コンストラクタ
   */

  function Sample4() {
    _classCallCheck(this, Sample4);

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

  _createClass(Sample4, [{
    key: 'run',
    value: function run() {
      console.log('Start Sample4');

      // WebGLコンテキストの取得ができたかどうか
      if (this.gl) {
        console.log('supports webgl');
      } else {
        console.log('webgl not supported');
        return;
      }

      // クリアする色を指定
      this.gl.clearColor(0.3, 0.3, 0.3, 1.0);

      // エレメントをクリア
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);

      // シェーダとプログラムオブジェクト
      var vertexSource = document.getElementById('vs').textContent;
      var fragmentSource = document.getElementById('fs').textContent;

      // ユーザー定義のプログラムオブジェクト生成関数
      this.programs = this.createShaderProgram(vertexSource, fragmentSource);

      // uniformロケーションを取得しておく
      this.uniLocation = {};
      this.uniLocation.mvpMatrix = this.gl.getUniformLocation(this.programs, 'mvpMatrix');
      this.uniLocation.invMatrix = this.gl.getUniformLocation(this.programs, 'invMatrix');
      this.uniLocation.lightDirection = this.gl.getUniformLocation(this.programs, 'lightDirection');

      // 球体を形成する頂点のデータを受け取る
      this.sphereData = (0, _minMatrix.sphere)(16, 16, 1.0);

      // 頂点データからバッファを生成して登録する（頂点座標）
      var vPositionBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vPositionBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.sphereData.p), this.gl.STATIC_DRAW);
      var attLocPosition = this.gl.getAttribLocation(this.programs, 'position');
      this.gl.enableVertexAttribArray(attLocPosition);
      this.gl.vertexAttribPointer(attLocPosition, 3, this.gl.FLOAT, false, 0, 0);

      // 頂点データからバッファを生成して登録する（頂点法線）
      var vNormalBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vNormalBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.sphereData.n), this.gl.STATIC_DRAW);
      var attLocNormal = this.gl.getAttribLocation(this.programs, 'normal');
      this.gl.enableVertexAttribArray(attLocNormal);
      this.gl.vertexAttribPointer(attLocNormal, 3, this.gl.FLOAT, false, 0, 0);

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
      this.invMatrix = this.mat.identity(this.mat.create());

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

      // 設定を有効化する
      this.gl.enable(this.gl.DEPTH_TEST);
      this.gl.depthFunc(this.gl.LEQUAL);

      // 平行光源の向き
      this.lightDirection = [1.0, 1.0, 1.0];

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
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

      // モデル座標変換行列を一度初期化してリセットする
      this.mat.identity(this.mMatrix);

      // カウンタをインクリメントする
      this.count++;

      // モデル座標変換行列を一度初期化してリセットする
      this.mat.identity(this.mMatrix);

      // モデル座標変換行列
      var axis = [0.0, 1.0, 1.0];
      var radians = this.count % 360 * Math.PI / 180;
      this.mat.rotate(this.mMatrix, radians, axis, this.mMatrix);

      // 行列を掛け合わせてMVPマトリックスを生成
      this.mat.multiply(this.vpMatrix, this.mMatrix, this.mvpMatrix); // さらにmを掛ける

      // 逆行列を生成
      this.mat.inverse(this.mMatrix, this.invMatrix);

      // シェーダに汎用データを送信する
      this.gl.uniformMatrix4fv(this.uniLocation.mvpMatrix, false, this.mvpMatrix);
      this.gl.uniformMatrix4fv(this.uniLocation.invMatrix, false, this.invMatrix);
      this.gl.uniform3fv(this.uniLocation.lightDirection, this.lightDirection);

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

  return Sample4;
})();

module.exports = Sample4;

},{"./minMatrix":10}],5:[function(require,module,exports){
/*
* Sample 5
* 反射光実装
*/

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _minMatrix = require("./minMatrix");

var Sample5 = (function () {
  /**
   * constructor
   * コンストラクタ
   */

  function Sample5() {
    _classCallCheck(this, Sample5);

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

  _createClass(Sample5, [{
    key: 'run',
    value: function run() {
      console.log('Start Sample5');

      // WebGLコンテキストの取得ができたかどうか
      if (this.gl) {
        console.log('supports webgl');
      } else {
        console.log('webgl not supported');
        return;
      }

      // クリアする色を指定
      this.gl.clearColor(0.3, 0.3, 0.3, 1.0);

      this.gl.clearDepth(1.0);

      // エレメントをクリア
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);

      // シェーダとプログラムオブジェクト
      var vertexSource = document.getElementById('vs').textContent;
      var fragmentSource = document.getElementById('fs').textContent;

      // ユーザー定義のプログラムオブジェクト生成関数
      this.programs = this.createShaderProgram(vertexSource, fragmentSource);

      // uniformロケーションを取得しておく
      this.uniLocation = {};
      this.uniLocation.mvpMatrix = this.gl.getUniformLocation(this.programs, 'mvpMatrix');
      this.uniLocation.invMatrix = this.gl.getUniformLocation(this.programs, 'invMatrix');
      this.uniLocation.lightDirection = this.gl.getUniformLocation(this.programs, 'lightDirection');
      // 反射光用にカメラと注視点を追加
      this.uniLocation.eyePosition = this.gl.getUniformLocation(this.programs, 'eyePosition');
      this.uniLocation.centerPoint = this.gl.getUniformLocation(this.programs, 'centerPoint');

      // 球体を形成する頂点のデータを受け取る
      this.sphereData = (0, _minMatrix.sphere)(64, 64, 1.0);

      // 頂点データからバッファを生成して登録する（頂点座標）
      var vPositionBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vPositionBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.sphereData.p), this.gl.STATIC_DRAW);
      var attLocPosition = this.gl.getAttribLocation(this.programs, 'position');
      this.gl.enableVertexAttribArray(attLocPosition);
      this.gl.vertexAttribPointer(attLocPosition, 3, this.gl.FLOAT, false, 0, 0);

      // 頂点データからバッファを生成して登録する（頂点法線）
      var vNormalBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vNormalBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.sphereData.n), this.gl.STATIC_DRAW);
      var attLocNormal = this.gl.getAttribLocation(this.programs, 'normal');
      this.gl.enableVertexAttribArray(attLocNormal);
      this.gl.vertexAttribPointer(attLocNormal, 3, this.gl.FLOAT, false, 0, 0);

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
      this.invMatrix = this.mat.identity(this.mat.create());

      // ビュー座標変換行列
      var cameraPosition = [0.0, 0.0, 5.0]; // カメラの位置
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

      // 平行光源の向き
      this.lightDirection = [1.0, 1.0, 1.0];

      // 設定を有効化する
      this.gl.enable(this.gl.DEPTH_TEST);
      this.gl.depthFunc(this.gl.LEQUAL);

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
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

      // モデル座標変換行列を一度初期化してリセットする
      this.mat.identity(this.mMatrix);

      // カウンタをインクリメントする
      this.count++;

      // モデル座標変換行列を一度初期化してリセットする
      this.mat.identity(this.mMatrix);

      // モデル座標変換行列
      var axis = [0.0, 1.0, 0.0];
      var radians = this.count % 360 * Math.PI / 180;
      this.mat.rotate(this.mMatrix, radians, axis, this.mMatrix);

      // 行列を掛け合わせてMVPマトリックスを生成
      this.mat.multiply(this.vpMatrix, this.mMatrix, this.mvpMatrix); // さらにmを掛ける

      // 逆行列を生成
      this.mat.inverse(this.mMatrix, this.invMatrix);

      // シェーダに汎用データを送信する
      this.gl.uniformMatrix4fv(this.uniLocation.mvpMatrix, false, this.mvpMatrix);
      this.gl.uniformMatrix4fv(this.uniLocation.invMatrix, false, this.invMatrix);
      this.gl.uniform3fv(this.uniLocation.lightDirection, this.lightDirection);
      this.gl.uniform3fv(this.uniLocation.eyePosition, this.cameraPosition);
      this.gl.uniform3fv(this.uniLocation.centerPoint, this.centerPoint);

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

  return Sample5;
})();

module.exports = Sample5;

},{"./minMatrix":10}],6:[function(require,module,exports){
/*
* Sample 6
* 環境光実装
*/

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _minMatrix = require("./minMatrix");

var Sample6 = (function () {
  /**
   * constructor
   * コンストラクタ
   */

  function Sample6() {
    _classCallCheck(this, Sample6);

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

  _createClass(Sample6, [{
    key: 'run',
    value: function run() {
      console.log('Start Sample5');

      // WebGLコンテキストの取得ができたかどうか
      if (this.gl) {
        console.log('supports webgl');
      } else {
        console.log('webgl not supported');
        return;
      }

      // クリアする色を指定
      this.gl.clearColor(0.3, 0.3, 0.3, 1.0);

      this.gl.clearDepth(1.0);

      // エレメントをクリア
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);

      // シェーダとプログラムオブジェクト
      var vertexSource = document.getElementById('vs').textContent;
      var fragmentSource = document.getElementById('fs').textContent;

      // ユーザー定義のプログラムオブジェクト生成関数
      this.programs = this.createShaderProgram(vertexSource, fragmentSource);

      // uniformロケーションを取得しておく
      this.uniLocation = {};
      this.uniLocation.mvpMatrix = this.gl.getUniformLocation(this.programs, 'mvpMatrix');
      this.uniLocation.invMatrix = this.gl.getUniformLocation(this.programs, 'invMatrix');
      this.uniLocation.lightDirection = this.gl.getUniformLocation(this.programs, 'lightDirection');
      // 反射光用にカメラと注視点を追加
      this.uniLocation.eyePosition = this.gl.getUniformLocation(this.programs, 'eyePosition');
      this.uniLocation.centerPoint = this.gl.getUniformLocation(this.programs, 'centerPoint');
      // 環境光カラー
      this.uniLocation.ambientColor = this.gl.getUniformLocation(this.programs, 'ambientColor');

      // 球体を形成する頂点のデータを受け取る
      this.sphereData = (0, _minMatrix.sphere)(64, 64, 1.0);

      // 頂点データからバッファを生成して登録する（頂点座標）
      var vPositionBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vPositionBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.sphereData.p), this.gl.STATIC_DRAW);
      var attLocPosition = this.gl.getAttribLocation(this.programs, 'position');
      this.gl.enableVertexAttribArray(attLocPosition);
      this.gl.vertexAttribPointer(attLocPosition, 3, this.gl.FLOAT, false, 0, 0);

      // 頂点データからバッファを生成して登録する（頂点法線）
      var vNormalBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vNormalBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.sphereData.n), this.gl.STATIC_DRAW);
      var attLocNormal = this.gl.getAttribLocation(this.programs, 'normal');
      this.gl.enableVertexAttribArray(attLocNormal);
      this.gl.vertexAttribPointer(attLocNormal, 3, this.gl.FLOAT, false, 0, 0);

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
      this.invMatrix = this.mat.identity(this.mat.create());

      // ビュー座標変換行列
      this.cameraPosition = [0.0, 0.0, 5.0]; // カメラの位置
      this.centerPoint = [0.0, 0.0, 0.0]; // 注視点
      this.cameraUp = [0.0, 1.0, 0.0]; // カメラの上方向
      this.mat.lookAt(this.cameraPosition, this.centerPoint, this.cameraUp, this.vMatrix);

      // プロジェクションのための情報を揃える
      var fovy = 45; // 視野角
      var aspect = this.canvas.width / this.canvas.height; // アスペクト比
      var near = 0.1; // 空間の最前面
      var far = 10.0; // 空間の奥行き終端
      this.mat.perspective(fovy, aspect, near, far, this.pMatrix);

      // 行列を掛け合わせてVPマトリックスを生成しておく
      this.mat.multiply(this.pMatrix, this.vMatrix, this.vpMatrix); // pにvを掛ける

      // 平行光源の向き
      this.lightDirection = [1.0, 1.0, 1.0];

      // 環境光の色
      this.ambientColor = [0.5, 0.0, 0.0, 1.0];

      // 設定を有効化する
      this.gl.enable(this.gl.DEPTH_TEST);
      this.gl.depthFunc(this.gl.LEQUAL);

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
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

      // モデル座標変換行列を一度初期化してリセットする
      this.mat.identity(this.mMatrix);

      // カウンタをインクリメントする
      this.count++;

      // モデル座標変換行列を一度初期化してリセットする
      this.mat.identity(this.mMatrix);

      // モデル座標変換行列
      var axis = [0.0, 1.0, 0.0];
      var radians = this.count % 360 * Math.PI / 180;
      this.mat.rotate(this.mMatrix, radians, axis, this.mMatrix);

      // 行列を掛け合わせてMVPマトリックスを生成
      this.mat.multiply(this.vpMatrix, this.mMatrix, this.mvpMatrix); // さらにmを掛ける

      // 逆行列を生成
      this.mat.inverse(this.mMatrix, this.invMatrix);

      // シェーダに汎用データを送信する
      this.gl.uniformMatrix4fv(this.uniLocation.mvpMatrix, false, this.mvpMatrix);
      this.gl.uniformMatrix4fv(this.uniLocation.invMatrix, false, this.invMatrix);
      this.gl.uniform3fv(this.uniLocation.lightDirection, this.lightDirection);
      this.gl.uniform3fv(this.uniLocation.eyePosition, this.cameraPosition);
      this.gl.uniform3fv(this.uniLocation.centerPoint, this.centerPoint);
      this.gl.uniform4fv(this.uniLocation.ambientColor, this.ambientColor);
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

  return Sample6;
})();

module.exports = Sample6;

},{"./minMatrix":10}],7:[function(require,module,exports){
/*
 * Sample 7
 * todo: テクスチャ
 */

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _minMatrix = require("./minMatrix");

var Sample7 = (function () {
  /**
   * constructor
   * コンストラクタ
   */

  function Sample7() {
    _classCallCheck(this, Sample7);

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

  _createClass(Sample7, [{
    key: 'run',
    value: function run() {
      console.log('Start Sample5');

      // WebGLコンテキストの取得ができたかどうか
      if (this.gl) {
        console.log('supports webgl');
      } else {
        console.log('webgl not supported');
        return;
      }

      // クリアする色を指定
      this.gl.clearColor(0.3, 0.3, 0.3, 1.0);

      this.gl.clearDepth(1.0);

      // エレメントをクリア
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);

      // シェーダとプログラムオブジェクト
      var vertexSource = document.getElementById('vs').textContent;
      var fragmentSource = document.getElementById('fs').textContent;

      // ユーザー定義のプログラムオブジェクト生成関数
      this.programs = this.createShaderProgram(vertexSource, fragmentSource);

      // uniformロケーションを取得しておく
      this.uniLocation = {};
      this.uniLocation.mvpMatrix = this.gl.getUniformLocation(this.programs, 'mvpMatrix');
      this.uniLocation.texture = this.gl.getUniformLocation(this.programs, 'texture');

      // 球体を形成する頂点のデータを受け取る
      this.sphereData = (0, _minMatrix.sphere)(64, 64, 1.0);

      // 頂点データからバッファを生成して配列に格納しておく
      var vPositionBuffer = this.generateVBO(this.sphereData.p);
      var vTexCoordBuffer = this.generateVBO(this.sphereData.t);
      var vboList = [vPositionBuffer, vTexCoordBuffer];

      // attributeLocationを取得して配列に格納する
      var attLocation = [];
      attLocation[0] = this.gl.getAttribLocation(this.programs, 'position');
      attLocation[1] = this.gl.getAttribLocation(this.programs, 'texCoord');

      // attributeのストライドを配列に格納しておく
      var attStride = [];
      attStride[0] = 3;
      attStride[1] = 2;

      // インデックスバッファの生成
      var indexBuffer = this.generateIBO(this.sphereData.i);

      // VBOとIBOを登録しておく
      this.setAttribute(vboList, attLocation, attStride, indexBuffer);

      // 行列の初期化
      this.mat = new _minMatrix.matIV();
      this.mMatrix = this.mat.identity(this.mat.create());
      this.vMatrix = this.mat.identity(this.mat.create());
      this.pMatrix = this.mat.identity(this.mat.create());
      this.vpMatrix = this.mat.identity(this.mat.create());
      this.mvpMatrix = this.mat.identity(this.mat.create());
      this.invMatrix = this.mat.identity(this.mat.create());

      // ビュー座標変換行列
      this.cameraPosition = [0.0, 0.0, 5.0]; // カメラの位置
      this.centerPoint = [0.0, 0.0, 0.0]; // 注視点
      this.cameraUp = [0.0, 1.0, 0.0]; // カメラの上方向
      this.mat.lookAt(this.cameraPosition, this.centerPoint, this.cameraUp, this.vMatrix);

      // プロジェクションのための情報を揃える
      var fovy = 45; // 視野角
      var aspect = this.canvas.width / this.canvas.height; // アスペクト比
      var near = 0.1; // 空間の最前面
      var far = 10.0; // 空間の奥行き終端
      this.mat.perspective(fovy, aspect, near, far, this.pMatrix);

      // 行列を掛け合わせてVPマトリックスを生成しておく
      this.mat.multiply(this.pMatrix, this.vMatrix, this.vpMatrix); // pにvを掛ける

      // 平行光源の向き
      this.lightDirection = [1.0, 1.0, 1.0];

      // 環境光の色
      this.ambientColor = [0.5, 0.0, 0.0, 1.0];

      // 設定を有効化する
      this.gl.enable(this.gl.DEPTH_TEST);
      this.gl.depthFunc(this.gl.LEQUAL);

      // テクスチャ生成関数を呼び出す
      this.texture = null;
      this.generateTexture('../image/ssf.jpg');

      // ロード完了をチェックする関数を呼び出す
      this.loadCheck();
    }

    /**
     * レンダリング関数の定義
     */
  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      // カウンタをインクリメントする
      this.count++;

      // Canvasエレメントをクリアする
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

      // モデル座標変換行列を一度初期化してリセットする
      this.mat.identity(this.mMatrix);

      // モデル座標変換行列
      var axis = [0.0, 1.0, 0.0];
      var radians = this.count % 360 * Math.PI / 180;
      this.mat.rotate(this.mMatrix, radians, axis, this.mMatrix);

      // 行列を掛け合わせてMVPマトリックスを生成
      this.mat.multiply(this.vpMatrix, this.mMatrix, this.mvpMatrix); // さらにmを掛ける

      // 逆行列を生成
      this.mat.inverse(this.mMatrix, this.invMatrix);

      // シェーダに汎用データを送信する
      this.gl.uniformMatrix4fv(this.uniLocation.mvpMatrix, false, this.mvpMatrix);
      this.gl.uniform1i(this.uniLocation.texture, 0);

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

    // 頂点バッファ（VBO）を生成する関数
  }, {
    key: 'generateVBO',
    value: function generateVBO(data) {
      // バッファオブジェクトの生成
      var vbo = this.gl.createBuffer();

      // バッファをバインドする
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);

      // バッファにデータをセット
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);

      // バッファのバインドを無効化
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

      // 生成した VBO を返して終了
      return vbo;
    }

    // インデックスバッファ（IBO）を生成する関数
  }, {
    key: 'generateIBO',
    value: function generateIBO(data) {
      // バッファオブジェクトの生成
      var ibo = this.gl.createBuffer();

      // バッファをバインドする
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo);

      // バッファにデータをセット
      this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), this.gl.STATIC_DRAW);

      // バッファのバインドを無効化
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);

      // 生成したIBOを返して終了
      return ibo;
    }

    // VBOとIBOを登録する関数
  }, {
    key: 'setAttribute',
    value: function setAttribute(vbo, attL, attS, ibo) {
      // 引数として受け取った配列を処理する
      for (var i in vbo) {
        // バッファをバインドする
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo[i]);

        // attributeLocationを有効にする
        this.gl.enableVertexAttribArray(attL[i]);

        // attributeLocationを通知し登録する
        this.gl.vertexAttribPointer(attL[i], attS[i], this.gl.FLOAT, false, 0, 0);
      }

      // インデックスバッファをバインドする
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo);
    }

    // テクスチャオブジェクトを初期化する
  }, {
    key: 'generateTexture',
    value: function generateTexture(source) {
      var _this2 = this;

      // イメージオブジェクトの生成
      var img = new Image();

      // データのオンロードをトリガにする
      img.onload = function () {
        console.log(_this2.gl);

        // テクスチャオブジェクトの生成
        _this2.texture = _this2.gl.createTexture();

        // テクスチャをバインドする
        _this2.gl.bindTexture(_this2.gl.TEXTURE_2D, _this2.texture);

        // テクスチャへイメージを適用
        _this2.gl.texImage2D(_this2.gl.TEXTURE_2D, 0, _this2.gl.RGBA, _this2.gl.RGBA, _this2.gl.UNSIGNED_BYTE, img);

        // ミップマップを生成
        _this2.gl.generateMipmap(_this2.gl.TEXTURE_2D);

        // テクスチャのバインドを無効化
        _this2.gl.bindTexture(_this2.gl.TEXTURE_2D, null);
      };

      // イメージオブジェクトの読み込みを開始
      img.src = source;
    }

    // テクスチャ生成完了をチェックする関数
  }, {
    key: 'loadCheck',
    value: function loadCheck() {
      var _this3 = this;

      console.log('start render', this.texture);

      // テクスチャの生成をチェック
      if (this.texture != null) {

        // 生成されていたらテクスチャをバインドしなおす
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);

        // レンダリング関数を呼び出す
        this.render();

        // 再起を止めるためにreturnする
        return;
      }
      console.log('now loading');
      // 再帰呼び出し
      setTimeout(function () {
        _this3.loadCheck();
      }, 100);
    }
  }]);

  return Sample7;
})();

module.exports = Sample7;

},{"./minMatrix":10}],8:[function(require,module,exports){
/*
 * Sample 7
 * todo: テクスチャ
 */

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _minMatrix = require("./minMatrix");

var _objson = require("./objson");

var Sample8 = (function () {
  /**
   * constructor
   * コンストラクタ
   */

  function Sample8() {
    _classCallCheck(this, Sample8);

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

  _createClass(Sample8, [{
    key: "run",
    value: function run() {
      console.log('Start Sample5');

      // WebGLコンテキストの取得ができたかどうか
      if (this.gl) {
        console.log('supports webgl');
      } else {
        console.log('webgl not supported');
        return;
      }

      // クリアする色を指定
      this.gl.clearColor(0.3, 0.3, 0.3, 1.0);

      this.gl.clearDepth(1.0);

      // エレメントをクリア
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);

      // シェーダとプログラムオブジェクト
      var vertexSource = document.getElementById('vs').textContent;
      var fragmentSource = document.getElementById('fs').textContent;

      // ユーザー定義のプログラムオブジェクト生成関数
      this.programs = this.createShaderProgram(vertexSource, fragmentSource);

      // uniformロケーションを取得しておく
      this.uniLocation = {};
      this.uniLocation.mvpMatrix = this.gl.getUniformLocation(this.programs, 'mvpMatrix');
      this.uniLocation.texture = this.gl.getUniformLocation(this.programs, 'texture');

      // 球体を形成する頂点のデータを受け取る
      this.sphereData = (0, _minMatrix.sphere)(64, 64, 1.0);

      // 頂点データからバッファを生成して配列に格納しておく
      var vPositionBuffer = this.generateVBO(this.sphereData.p);
      var vTexCoordBuffer = this.generateVBO(this.sphereData.t);
      var vboList = [vPositionBuffer, vTexCoordBuffer];

      // attributeLocationを取得して配列に格納する
      var attLocation = [];
      attLocation[0] = this.gl.getAttribLocation(this.programs, 'position');
      attLocation[1] = this.gl.getAttribLocation(this.programs, 'texCoord');

      // attributeのストライドを配列に格納しておく
      var attStride = [];
      attStride[0] = 3;
      attStride[1] = 2;

      // インデックスバッファの生成
      var indexBuffer = this.generateIBO(this.sphereData.i);

      // VBOとIBOを登録しておく
      this.setAttribute(vboList, attLocation, attStride, indexBuffer);

      // 行列の初期化
      this.mat = new _minMatrix.matIV();
      this.mMatrix = this.mat.identity(this.mat.create());
      this.vMatrix = this.mat.identity(this.mat.create());
      this.pMatrix = this.mat.identity(this.mat.create());
      this.vpMatrix = this.mat.identity(this.mat.create());
      this.mvpMatrix = this.mat.identity(this.mat.create());
      this.invMatrix = this.mat.identity(this.mat.create());

      // ビュー座標変換行列
      this.cameraPosition = [0.0, 0.0, 5.0]; // カメラの位置
      this.centerPoint = [0.0, 0.0, 0.0]; // 注視点
      this.cameraUp = [0.0, 1.0, 0.0]; // カメラの上方向
      this.mat.lookAt(this.cameraPosition, this.centerPoint, this.cameraUp, this.vMatrix);

      // プロジェクションのための情報を揃える
      var fovy = 45; // 視野角
      var aspect = this.canvas.width / this.canvas.height; // アスペクト比
      var near = 0.1; // 空間の最前面
      var far = 10.0; // 空間の奥行き終端
      this.mat.perspective(fovy, aspect, near, far, this.pMatrix);

      // 行列を掛け合わせてVPマトリックスを生成しておく
      this.mat.multiply(this.pMatrix, this.vMatrix, this.vpMatrix); // pにvを掛ける

      // 平行光源の向き
      this.lightDirection = [1.0, 1.0, 1.0];

      // 環境光の色
      this.ambientColor = [0.5, 0.0, 0.0, 1.0];

      // 設定を有効化する
      this.gl.enable(this.gl.DEPTH_TEST);
      this.gl.depthFunc(this.gl.LEQUAL);

      // テクスチャ生成関数を呼び出す
      this.texture = null;
      this.generateTexture('../image/ssf.jpg');

      // ロード完了をチェックする関数を呼び出す
      this.loadCheck();
    }

    /**
     * レンダリング関数の定義
     */
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      // カウンタをインクリメントする
      this.count++;

      // Canvasエレメントをクリアする
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

      // モデル座標変換行列を一度初期化してリセットする
      this.mat.identity(this.mMatrix);

      // モデル座標変換行列
      var axis = [0.0, 1.0, 0.0];
      var radians = this.count % 360 * Math.PI / 180;
      this.mat.rotate(this.mMatrix, radians, axis, this.mMatrix);

      // 行列を掛け合わせてMVPマトリックスを生成
      this.mat.multiply(this.vpMatrix, this.mMatrix, this.mvpMatrix); // さらにmを掛ける

      // 逆行列を生成
      this.mat.inverse(this.mMatrix, this.invMatrix);

      // シェーダに汎用データを送信する
      this.gl.uniformMatrix4fv(this.uniLocation.mvpMatrix, false, this.mvpMatrix);
      this.gl.uniform1i(this.uniLocation.texture, 0);

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
    key: "createShaderProgram",
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

    // 頂点バッファ（VBO）を生成する関数
  }, {
    key: "generateVBO",
    value: function generateVBO(data) {
      // バッファオブジェクトの生成
      var vbo = this.gl.createBuffer();

      // バッファをバインドする
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);

      // バッファにデータをセット
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);

      // バッファのバインドを無効化
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

      // 生成した VBO を返して終了
      return vbo;
    }

    // インデックスバッファ（IBO）を生成する関数
  }, {
    key: "generateIBO",
    value: function generateIBO(data) {
      // バッファオブジェクトの生成
      var ibo = this.gl.createBuffer();

      // バッファをバインドする
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo);

      // バッファにデータをセット
      this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), this.gl.STATIC_DRAW);

      // バッファのバインドを無効化
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);

      // 生成したIBOを返して終了
      return ibo;
    }

    // VBOとIBOを登録する関数
  }, {
    key: "setAttribute",
    value: function setAttribute(vbo, attL, attS, ibo) {
      // 引数として受け取った配列を処理する
      for (var i in vbo) {
        // バッファをバインドする
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo[i]);

        // attributeLocationを有効にする
        this.gl.enableVertexAttribArray(attL[i]);

        // attributeLocationを通知し登録する
        this.gl.vertexAttribPointer(attL[i], attS[i], this.gl.FLOAT, false, 0, 0);
      }

      // インデックスバッファをバインドする
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo);
    }

    // テクスチャオブジェクトを初期化する
  }, {
    key: "generateTexture",
    value: function generateTexture(source) {
      var _this2 = this;

      // イメージオブジェクトの生成
      var img = new Image();

      // データのオンロードをトリガにする
      img.onload = function () {
        console.log(_this2.gl);

        // テクスチャオブジェクトの生成
        _this2.texture = _this2.gl.createTexture();

        // テクスチャをバインドする
        _this2.gl.bindTexture(_this2.gl.TEXTURE_2D, _this2.texture);

        // テクスチャへイメージを適用
        _this2.gl.texImage2D(_this2.gl.TEXTURE_2D, 0, _this2.gl.RGBA, _this2.gl.RGBA, _this2.gl.UNSIGNED_BYTE, img);

        // ミップマップを生成
        _this2.gl.generateMipmap(_this2.gl.TEXTURE_2D);

        // テクスチャのバインドを無効化
        _this2.gl.bindTexture(_this2.gl.TEXTURE_2D, null);
      };

      // イメージオブジェクトの読み込みを開始
      img.src = source;
    }

    // テクスチャ生成完了をチェックする関数
  }, {
    key: "loadCheck",
    value: function loadCheck() {
      var _this3 = this;

      console.log('start render', this.texture);

      // テクスチャの生成をチェック
      if (this.texture != null) {

        // 生成されていたらテクスチャをバインドしなおす
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);

        // レンダリング関数を呼び出す
        this.render();

        // 再起を止めるためにreturnする
        return;
      }
      console.log('now loading');
      // 再帰呼び出し
      setTimeout(function () {
        _this3.loadCheck();
      }, 100);
    }
  }]);

  return Sample8;
})();

module.exports = Sample8;

},{"./minMatrix":10,"./objson":11}],9:[function(require,module,exports){
"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _Sample1 = require("./Sample1");

var _Sample12 = _interopRequireDefault(_Sample1);

var _Sample2 = require("./Sample2");

var _Sample22 = _interopRequireDefault(_Sample2);

var _Sample3 = require("./Sample3");

var _Sample32 = _interopRequireDefault(_Sample3);

var _Sample4 = require("./Sample4");

var _Sample42 = _interopRequireDefault(_Sample4);

var _Sample5 = require("./Sample5");

var _Sample52 = _interopRequireDefault(_Sample5);

var _Sample6 = require("./Sample6");

var _Sample62 = _interopRequireDefault(_Sample6);

var _Sample7 = require("./Sample7");

var _Sample72 = _interopRequireDefault(_Sample7);

var _Sample8 = require("./Sample8");

var _Sample82 = _interopRequireDefault(_Sample8);

window.sample1 = new _Sample12["default"]();
window.sample2 = new _Sample22["default"]();
window.sample3 = new _Sample32["default"]();
window.sample4 = new _Sample42["default"]();
window.sample5 = new _Sample52["default"]();
window.sample6 = new _Sample62["default"]();
window.sample7 = new _Sample72["default"]();
window.sample8 = new _Sample82["default"]();

},{"./Sample1":1,"./Sample2":2,"./Sample3":3,"./Sample4":4,"./Sample5":5,"./Sample6":6,"./Sample7":7,"./Sample8":8}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
// ------------------------------------------------------------------------------------------------
// objson.js
// version 0.0.1
// Copyright (c) doxas
// ------------------------------------------------------------------------------------------------

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.objsonConvert = objsonConvert;
exports.objsonVertexData = objsonVertexData;
exports.vec3Normalize = vec3Normalize;
exports.faceNormal = faceNormal;

function objsonConvert(source) {
  source = source.replace(/^#[\x20-\x7e]+\s$/gm, '');
  source = source.replace(/^g[\x20-\x7e]+\s$/gm, '');
  source = source.replace(/^g\s$/gm, '');
  source = source.replace(/\x20{2,}/gm, '\x20');
  source = source.replace(/^\s/gm, '');
  var rows = source.match(/[\x20-\x7e]+\s/gm);
  var i, j, k, l;
  var a, b, c, d;
  var len, dest, fNormal;
  var pos = 0;
  var nor = 0;
  var tex = 0;
  var position = [];
  var normal = [];
  var texCoord = [];
  var vertex = [];
  var index = [];
  var indices = [];
  for (i = 0, len = rows.length; i < len; i++) {
    switch (rows[i].substr(0, 2)) {
      case 'v ':
        a = rows[i].match(/-?[\d\.]+(e(?=-)?|e(?=\+)?)?[-\+\d\.]*/g);
        if (vertex[pos] == null) {
          vertex[pos] = new objsonVertexData();
          vertex[pos].faceIndex = [];
        }
        vertex[pos].position = [a[0], a[1], a[2]];
        pos++;
        break;
      case 'vn':
        a = rows[i].match(/-?[\d\.]+(e(?=-)?|e(?=\+)?)?[-\+\d\.]*/g);
        if (vertex[nor] == null) {
          vertex[nor] = new objsonVertexData();
          vertex[nor].faceIndex = [];
        }
        vertex[nor].normal = [a[0], a[1], a[2]];
        nor++;
        break;
      case 'vt':
        a = rows[i].match(/-?[\d\.]+(e(?=-)?|e(?=\+)?)?[-\+\d\.]*/g);
        if (vertex[tex] == null) {
          vertex[tex] = new objsonVertexData();
          vertex[tex].faceIndex = [];
        }
        vertex[tex].texCoord = [a[0], a[1]];
        tex++;
        break;
      case 'f ':
        a = rows[i].match(/[\d\/]+/g);
        index.push(a[0], a[1], a[2]);
        if (a.length > 3) {
          index.push(a[2], a[3], a[0]);
        }
        break;
      default:
        break;
    }
  }
  if (nor === 0) {
    j = index.length / 3;
    fNormal = new Array(j);
    for (i = 0; i < j; i++) {
      a = index[i * 3].split(/\//);
      b = index[i * 3 + 1].split(/\//);
      c = index[i * 3 + 2].split(/\//);
      fNormal[i] = faceNormal(vertex[a[0] - 1].position, vertex[b[0] - 1].position, vertex[c[0] - 1].position);
      vertex[a[0] - 1].faceIndex.push(i);
      vertex[b[0] - 1].faceIndex.push(i);
      vertex[c[0] - 1].faceIndex.push(i);
    }
    for (i = 0; i < pos; i++) {
      a = [0.0, 0.0, 0.0];
      b = vertex[i].faceIndex;
      k = b.length;
      for (j = 0; j < k; j++) {
        a[0] += parseFloat(fNormal[b[j]][0]);
        a[1] += parseFloat(fNormal[b[j]][1]);
        a[2] += parseFloat(fNormal[b[j]][2]);
      }
      vertex[i].normal = vec3Normalize(a);
    }
  }
  for (i = 0, len = index.length; i < len; i++) {
    j = Math.floor(i / 3);
    a = index[i].split(/\//);
    k = a[0] - 1;
    if (indices[k] == null) {
      indices[k] = new objsonVertexData();
      indices[k].position = k;
    }
    if (a[2] != null) {
      if (a[2] !== '') {
        if (indices[k].normal == null) {
          indices[k].normal = a[2] - 1;
        } else {
          if (indices[k].normal !== a[2] - 1) {
            indices[pos] = new objsonVertexData();
            indices[pos].position = k;
            indices[pos].normal = a[2] - 1;
            k = pos;
            pos++;
          }
        }
      }
    }
    if (a[1] != null) {
      if (a[1] !== '') {
        if (indices[k].texCoord == null) {
          indices[k].texCoord = a[1] - 1;
        } else {
          if (indices[k].texCoord !== a[1] - 1) {
            indices[pos] = new objsonVertexData();
            indices[pos].position = a[0] - 1;
            if (a[2] != null) {
              if (a[2] !== '') {
                indices[pos].normal = a[2] - 1;
              }
            }
            indices[pos].texCoord = a[1] - 1;
            k = pos;
            pos++;
          }
        }
      }
    }
    index[i] = k;
  }
  for (i = 0, len = indices.length; i < len; i++) {
    a = indices[i];
    b = [];
    c = [];
    d = [];
    if (a != null) {
      k = a.position;
      b = vertex[k].position;
      position[i * 3] = b[0];
      position[i * 3 + 1] = b[1];
      position[i * 3 + 2] = b[2];
      if (nor > 0) {
        k = a.normal;
      }
      c = vertex[k].normal;
      normal[i * 3] = c[0];
      normal[i * 3 + 1] = c[1];
      normal[i * 3 + 2] = c[2];
      if (tex > 0) {
        k = a.texCoord;
        d = vertex[k].texCoord;
        texCoord[i * 2] = d[0];
        texCoord[i * 2 + 1] = d[1];
      }
    } else {
      b = vertex[i].position;
      position[i * 3] = b[0];
      position[i * 3 + 1] = b[1];
      position[i * 3 + 2] = b[2];
      c = vertex[i].normal;
      normal[i * 3] = c[0];
      normal[i * 3 + 1] = c[1];
      normal[i * 3 + 2] = c[2];
      if (tex > 0) {
        d = vertex[i].texCoord;
        texCoord[i * 2] = d[0];
        texCoord[i * 2 + 1] = d[1];
      }
    }
  }
  dest = '{';
  dest += '"vertex":' + indices.length;
  dest += ',"face":' + index.length / 3;
  dest += ',"position":[' + position.join(',') + ']';
  dest += ',"normal":[' + normal.join(',') + ']';
  if (tex > 0) {
    dest += ',"texCoord":[' + texCoord.join(',') + ']';
  }
  dest += ',"index":[' + index.join(',') + ']';
  dest += '}';
  return dest;
}

function objsonVertexData() {
  this.position = null;
  this.normal = null;
  this.texCoord = null;
  this.faceIndex = null;
}

function vec3Normalize(v, d) {
  var e, dig;
  var n = [0.0, 0.0, 0.0];
  var l = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  if (l > 0) {
    if (!d) {
      dig = 5;
    } else {
      dig = d;
    }
    e = 1.0 / l;
    n[0] = (v[0] * e).toFixed(dig);
    n[1] = (v[1] * e).toFixed(dig);
    n[2] = (v[2] * e).toFixed(dig);
  }
  return n;
}

function faceNormal(v0, v1, v2) {
  var n = [];
  var vec1 = [v1[0] - v0[0], v1[1] - v0[1], v1[2] - v0[2]];
  var vec2 = [v2[0] - v0[0], v2[1] - v0[1], v2[2] - v0[2]];
  n[0] = vec1[1] * vec2[2] - vec1[2] * vec2[1];
  n[1] = vec1[2] * vec2[0] - vec1[0] * vec2[2];
  n[2] = vec1[0] * vec2[1] - vec1[1] * vec2[0];
  return vec3Normalize(n);
}

},{}]},{},[9])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYjA3MDk3L3dvcmtzcGFjZS92ZXJ5dGlyZC9yYXctd2ViZ2wtc2FtcGxlL3NyYy9TYW1wbGUxLmpzIiwiL1VzZXJzL2IwNzA5Ny93b3Jrc3BhY2UvdmVyeXRpcmQvcmF3LXdlYmdsLXNhbXBsZS9zcmMvU2FtcGxlMi5qcyIsIi9Vc2Vycy9iMDcwOTcvd29ya3NwYWNlL3Zlcnl0aXJkL3Jhdy13ZWJnbC1zYW1wbGUvc3JjL1NhbXBsZTMuanMiLCIvVXNlcnMvYjA3MDk3L3dvcmtzcGFjZS92ZXJ5dGlyZC9yYXctd2ViZ2wtc2FtcGxlL3NyYy9TYW1wbGU0LmpzIiwiL1VzZXJzL2IwNzA5Ny93b3Jrc3BhY2UvdmVyeXRpcmQvcmF3LXdlYmdsLXNhbXBsZS9zcmMvU2FtcGxlNS5qcyIsIi9Vc2Vycy9iMDcwOTcvd29ya3NwYWNlL3Zlcnl0aXJkL3Jhdy13ZWJnbC1zYW1wbGUvc3JjL1NhbXBsZTYuanMiLCIvVXNlcnMvYjA3MDk3L3dvcmtzcGFjZS92ZXJ5dGlyZC9yYXctd2ViZ2wtc2FtcGxlL3NyYy9TYW1wbGU3LmpzIiwiL1VzZXJzL2IwNzA5Ny93b3Jrc3BhY2UvdmVyeXRpcmQvcmF3LXdlYmdsLXNhbXBsZS9zcmMvU2FtcGxlOC5qcyIsIi9Vc2Vycy9iMDcwOTcvd29ya3NwYWNlL3Zlcnl0aXJkL3Jhdy13ZWJnbC1zYW1wbGUvc3JjL2luZGV4LmpzIiwiL1VzZXJzL2IwNzA5Ny93b3Jrc3BhY2UvdmVyeXRpcmQvcmF3LXdlYmdsLXNhbXBsZS9zcmMvbWluTWF0cml4LmpzIiwiL1VzZXJzL2IwNzA5Ny93b3Jrc3BhY2UvdmVyeXRpcmQvcmF3LXdlYmdsLXNhbXBsZS9zcmMvb2Jqc29uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7SUNLTSxPQUFPO1dBQVAsT0FBTzswQkFBUCxPQUFPOzs7ZUFB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LFdBQVcsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQ3pDLFVBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDOUQsVUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUM7OztBQUd6RyxVQUFJLENBQUMsR0FBRyxHQUFHLHNCQUFXLENBQUM7QUFDdkIsVUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDcEQsVUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDcEQsVUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDcEQsVUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDckQsVUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDdEQsVUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7OztB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VSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUM7OztBQUd6RyxVQUFJLENBQUMsR0FBRyxHQUFHLHNCQUFXLENBQUM7QUFDdkIsVUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDcEQsVUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDcEQsVUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDcEQsVUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDckQsVUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDdEQsVUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7OztBQUd0RCxVQUFJLGNBQWMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDckMsVUFBSSxXQUFXLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ2xDLFVBQUksUUFBUSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUMvQixVQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVB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LElBQUksQ0FBQyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDOzs7QUFHekcsVUFBSSxDQUFDLEdBQUcsR0FBRyxzQkFBVyxDQUFDO0FBQ3ZCLFVBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQ3BELFVBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQ3BELFVBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQ3BELFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQ3JELFVBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQ3RELFVBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDOzs7QUFHdEQsVUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDdEMsVUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDbkMsVUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLEdB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Q0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDckQsVUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDdEQsVUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7OztBQUd0RCxVQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN0QyxVQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNuQyxVQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNoQyxVQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7OztBQUdwRixVQUFJLElBQUksR0FBRyxFQUFFLENBQUM7QUFDZCxVQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUNwRCxVQUFJLElBQUksR0FBRyxHQUFHLENBQUM7QUFDZixVQUFJLEdBQUcsR0FBRyxJQUFJLENBQUM7QUFDZixVQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDOzs7QUFHNUQsVUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMs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QUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNqQixlQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDOzs7QUFJakIsVUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7QUFHdEQsVUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQzs7O0FBR2hFLFVBQUksQ0FBQyxHQUFHLEdBQUcsc0JBQVcsQ0FBQztBQUN2QixVQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztBQUNwRCxVQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztBQUNwRCxVQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztBQUNwRCxVQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztBQUNyRCxVQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztBQUN0RCxVQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQzs7O0FBR3RELFVBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FB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SUFBSSxFQUFFLElBQUksRUFBRTtBQUN4QixnQkFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDbEQsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ2xELENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO2dCQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO2dCQUNwRCxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztnQkFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztnQkFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztnQkFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztnQkFDdEQsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ2xELENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNsRCxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztnQkFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztnQkFDcEQsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUMzRCxnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDeEMsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3hDLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN4QyxnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDeEMsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3hDLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN4QyxnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDeEMsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3hDLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN4QyxnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDeEMsZ0JBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3pDLGdCQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN6QyxnQkFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDekMsZ0JBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENB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QUFDO0FBQ2pCLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pCLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pCLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pCLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pCLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pCLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pCLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pCLGdCQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ25CLGdCQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ25CLGdCQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3pFLGdCQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3pFLGdCQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzFFLGdCQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzFFLG1CQUFPLElBQUksQ0FBQztTQUNmOzs7ZUFDTSxnQkFBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUU7QUFDNUIsZ0JBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5RSxnQkFBSSxDQUFDLEVBQUUsRUFBRTtBQUNMLHVCQUFPLElBQUksQ0FBQzthQUNmO0FBQ0QsZ0JBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQyxn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QUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2hDLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDaEMsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNoQyxnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2hDLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDaEMsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNoQyxnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2hDLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDaEMsZ0JBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNqQyxnQkFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2pDLG1CQUFPLElBQUksQ0FBQztTQUNmOzs7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LGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pCLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pCLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2xCLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pCLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pCLGdCQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ25CLGdCQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ25CLGdCQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xCLGdCQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xCLGdCQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ25CLGdCQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ25CLG1CQUFPLElBQUksQ0FBQztTQUNmOzs7ZUFDTyxpQkFBQyxHQUFHLEVBQUUsSUFBSSxFQUFFO0FBQ2hCLGdCQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUM5QyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDOUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUM7Z0JBQ2hELENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDO2dCQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDO2dCQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDO2dCQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDO2dCQUNsRCxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztnQkFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztnQkFDcEMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7Z0JBQ3BDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO2dCQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO2dCQUNwQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztnQkFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztnQkFDcEMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7Z0JBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7Z0JBQ3BDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO2dCQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO2dCQUNwQyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsQ0FBQztBQUM5RCxnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUEsR0FBSSxHQUFHLENBQUM7QUFDekMsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUEsR0FBSSxHQUFHLENBQUM7QUFDekMsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksR0FBRyxDQUFDO0FBQ3pDLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksR0FBRyxDQUFDO0FBQ3pDLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksR0FBRyxDQUFDO0FBQ3pDLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQSxHQUFJLEdBQUcsQ0FBQztBQUN6QyxnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQSxHQUFJLEdBQUcsQ0FBQztBQUN6QyxnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUEsR0FBSSxHQUFHLENBQUM7QUFDekMsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksR0FBRyxDQUFDO0FBQ3pDLGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksR0FBRyxDQUFDO0FBQ3pDLGdCQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQSxHQUFJLEdBQUcsQ0FBQztBQUMxQyxnQkFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQSxHQUFJLEdBQUcsQ0FBQztBQUMxQyxnQkFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQSxHQUFJLEdBQUcsQ0FBQztBQUMxQyxnQkFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcs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QUMsQ0FBQztnQkFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNELGdCQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDM0QsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ2hELGdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNoRCxnQkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDaEQsZ0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ2hELG1CQUFPLElBQUksQ0FBQztTQUNmOzs7ZUFDTSxnQkFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTtBQUN2QixnQkFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFD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RyxNQUFNLEVBQUU7QUFDdkIsd0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEFBQUMsQ0FBQztBQUMxQyx3QkFBSSxDQUFDLENBQUMsQ0FBQyxHQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQUFBQyxDQUFDO0FBQzFDLHdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxBQUFDLENBQUM7QUFDMUMsd0JBQUksQ0FBQyxDQUFDLENBQUMsR0FBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEFBQUMsQ0FBQztpQkFDN0MsTUFBTTtBQUNILHdCQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZCLHdCQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDO0FBQ25CLHdCQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDaEMsd0JBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzNCLHdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3RDLHdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3RDLHdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3RDLHdCQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO2lCQUN6QzthQUNKO0FBQ0QsbUJBQU8sSUFBSSxDQUFDO1NBQ2Y7OztXQWpJUSxLQUFLOzs7OztBQW9JWCxTQUFTLEtBQUssQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQ2xELFFBQUksQ0FBQyxZQUFBO1FBQUUsQ0FBQyxZQUFBO1FBQUUsRUFBRSxZQUFBLENBQUM7QUFDYixRQUFJLEdBQUcsR0FBRyxJQUFJLEtBQUssRUFBRTtRQUFFLEdBQUcsR0FBRyxJQUFJLEtBQUssRUFBRTtRQUNwQyxHQUFHLEdBQUcsSUFBSSxLQUFLLEVBQUU7UUFBRSxFQUFFLEdBQUcsSUFBSSxLQUFLLEVBQUU7UUFBRSxHQUFHLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztBQUMzRCxTQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN2QixZQUFJLEVBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQzlCLFlBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUFDLENBQUM7QUFDckIsWUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUMsQ0FBQztBQUNyQixhQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUMxQixnQkFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNsQyxnQkFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQSxHQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDM0MsZ0JBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUM7QUFDbkIsZ0JBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUEsR0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzNDLGdCQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUMzQixnQkFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDM0IsZ0JBQUksS0FBSyxFQUFFO0FBQ1Asa0JBQUUsR0FBRyxLQUFLLENBQUM7YUFDZCxNQUFNO0FBQ0gsa0JBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUN4QztBQUNELGdCQUFJLEVBQUUsR0FBRyxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUN4QixnQkFBSSxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQzNCLGdCQUFJLEVBQUUsR0FBRyxHQUFHLEVBQUU7QUFDVixrQkFBRSxJQUFJLEdBQUcsQ0FBQzthQUNiO0FBQ0QsY0FBRSxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFDZCxlQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDckIsZUFBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3JCLGVBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckMsY0FBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDbkI7S0FDSjtBQUNELFNBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3RCLGFBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3pCLGFBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUEsR0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3pCLGVBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNuQyxlQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUNuRDtLQUNKO0FBQ0QsV0FBTyxFQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBQyxDQUFDO0NBQ2xEOzs7Ozs7Ozs7OztBQVVNLFNBQVMsTUFBTSxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRTtBQUM1QyxRQUFJLENBQUMsWUFBQTtRQUFFLENBQUMsWUFBQTtRQUFFLEVBQUUsWUFBQSxDQUFDO0FBQ2IsUUFBSSxHQUFHLEdBQUcsSUFBSSxLQUFLLEVBQUU7UUFBRSxHQUFHLEdBQUcsSUFBSSxLQUFLLEVBQUU7UUFDcEMsR0FBRyxHQUFHLElBQUksS0FBSyxFQUFFO1FBQUUsRUFBRSxHQUFHLElBQUksS0FBSyxFQUFFO1FBQUUsR0FBRyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7QUFDM0QsU0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDdkIsWUFBSSxHQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQzFCLFlBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBQyxDQUFDLENBQUM7QUFDckIsWUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFDLENBQUMsQ0FBQztBQUNyQixhQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUMxQixnQkFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNsQyxnQkFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2pDLGdCQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsR0FBRyxDQUFDO0FBQ2xCLGdCQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDakMsZ0JBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzNCLGdCQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUMzQixnQkFBSSxLQUFLLEVBQUU7QUFDUCxrQkFBRSxHQUFHLEtBQUssQ0FBQzthQUNkLE1BQU07QUFDSCxrQkFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ3JDO0FBQ0QsZUFBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3JCLGVBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNyQixlQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JDLGNBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDNUM7S0FDSjtBQUNELFFBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNWLFNBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3RCLGFBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3pCLGFBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUEsR0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3pCLGVBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNuQyxlQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQy9DO0tBQ0o7QUFDRCxXQUFPLEVBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFDLENBQUM7Q0FDbEQ7O0FBRU0sU0FBUyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUM5QixRQUFJLEVBQUUsWUFBQTtRQUFFLEVBQUUsR0FBRyxJQUFJLEdBQUcsR0FBRyxDQUFDO0FBQ3hCLFFBQUksR0FBRyxHQUFHLENBQ04sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFDbEQsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUN0RCxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUNsRCxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQ3RELEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQ2xELENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FDekQsQ0FBQztBQUNGLFFBQUksR0FBRyxHQUFHLENBQ04sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFDOUQsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUNsRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUM5RCxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQ2xFLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQzlELENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FDckUsQ0FBQztBQUNGLFFBQUksR0FBRyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7QUFDdEIsU0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3JDLFlBQUksS0FBSyxFQUFFO0FBQ1AsY0FBRSxHQUFHLEtBQUssQ0FBQztTQUNkLE1BQU07QUFDSCxjQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNoRDtBQUNELFdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDeEM7QUFDRCxRQUFJLEVBQUUsR0FBRyxDQUNMLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQ3RDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQ3RDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQ3RDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQ3RDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQ3RDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQ3pDLENBQUM7QUFDRixRQUFJLEdBQUcsR0FBRyxDQUNOLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUNoQixDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDaEIsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQ25CLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUN0QixFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFDdEIsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQ3pCLENBQUM7QUFDRixXQUFPLEVBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFDLENBQUM7Q0FDbEQ7O0FBRU0sU0FBUyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQzdCLFFBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDekIsZUFBTztLQUNWO0FBQ0QsUUFBSSxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUNqQixRQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUM1QixRQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNwQixRQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLENBQUM7QUFDcEIsUUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsQ0FBQztBQUN4QixRQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsQ0FBQSxBQUFDLENBQUM7QUFDOUIsUUFBSSxLQUFLLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztBQUN4QixRQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDbEIsYUFBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUMxQixNQUFNO0FBQ0gsWUFBSSxHQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNwQyxZQUFJLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3BDLFlBQUksQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDcEMsYUFBSyxDQUFDLElBQUksQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUNuQztBQUNELFdBQU8sS0FBSyxDQUFDO0NBQ2hCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDamtCTSxTQUFTLGFBQWEsQ0FBQyxNQUFNLEVBQUU7QUFDcEMsUUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMscUJBQXFCLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDbkQsUUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMscUJBQXFCLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDbkQsUUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZDLFFBQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQztBQUM5QyxRQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDckMsTUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQzVDLE1BQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2YsTUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDZixNQUFJLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDO0FBQ3ZCLE1BQUksR0FBRyxHQUFHLENBQUMsQ0FBQztBQUNaLE1BQUksR0FBRyxHQUFHLENBQUMsQ0FBQztBQUNaLE1BQUksR0FBRyxHQUFHLENBQUMsQ0FBQztBQUNaLE1BQUksUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUNsQixNQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDaEIsTUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLE1BQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNoQixNQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDZixNQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDakIsT0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDM0MsWUFBUSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDMUIsV0FBSyxJQUFJO0FBQ1AsU0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMseUNBQXlDLENBQUMsQ0FBQztBQUM3RCxZQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLEVBQUU7QUFDdkIsZ0JBQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLGdCQUFnQixFQUFFLENBQUM7QUFDckMsZ0JBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1NBQzVCO0FBQ0QsY0FBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUMsV0FBRyxFQUFFLENBQUM7QUFDTixjQUFNO0FBQUEsQUFDUixXQUFLLElBQUk7QUFDUCxTQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO0FBQzdELFlBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksRUFBRTtBQUN2QixnQkFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztBQUNyQyxnQkFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7U0FDNUI7QUFDRCxjQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4QyxXQUFHLEVBQUUsQ0FBQztBQUNOLGNBQU07QUFBQSxBQUNSLFdBQUssSUFBSTtBQUNQLFNBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLHlDQUF5QyxDQUFDLENBQUM7QUFDN0QsWUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxFQUFFO0FBQ3ZCLGdCQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO0FBQ3JDLGdCQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztTQUM1QjtBQUNELGNBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEMsV0FBRyxFQUFFLENBQUM7QUFDTixjQUFNO0FBQUEsQUFDUixXQUFLLElBQUk7QUFDUCxTQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUM5QixhQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0IsWUFBSSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUNoQixlQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDOUI7QUFDRCxjQUFNO0FBQUEsQUFDUjtBQUNFLGNBQU07QUFBQSxLQUNUO0dBQ0Y7QUFDRCxNQUFJLEdBQUcsS0FBSyxDQUFDLEVBQUU7QUFDYixLQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDckIsV0FBTyxHQUFHLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLFNBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3RCLE9BQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM3QixPQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pDLE9BQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakMsYUFBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3pHLFlBQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuQyxZQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbkMsWUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3BDO0FBQ0QsU0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDeEIsT0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNwQixPQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztBQUN4QixPQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUNiLFdBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3RCLFNBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckMsU0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyQyxTQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO09BQ3RDO0FBQ0QsWUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDckM7R0FDRjtBQUNELE9BQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzVDLEtBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN0QixLQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixLQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNiLFFBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksRUFBRTtBQUN0QixhQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO0FBQ3BDLGFBQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO0tBQ3pCO0FBQ0QsUUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxFQUFFO0FBQ2hCLFVBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtBQUNmLFlBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxJQUFJLEVBQUU7QUFDN0IsaUJBQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUM5QixNQUFNO0FBQ0wsY0FBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDbEMsbUJBQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLGdCQUFnQixFQUFFLENBQUM7QUFDdEMsbUJBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO0FBQzFCLG1CQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDL0IsYUFBQyxHQUFHLEdBQUcsQ0FBQztBQUNSLGVBQUcsRUFBRSxDQUFDO1dBQ1A7U0FDRjtPQUNGO0tBQ0Y7QUFDRCxRQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLEVBQUU7QUFDaEIsVUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO0FBQ2YsWUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUFJLElBQUksRUFBRTtBQUMvQixpQkFBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2hDLE1BQU07QUFDTCxjQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUNwQyxtQkFBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztBQUN0QyxtQkFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2pDLGdCQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLEVBQUU7QUFDaEIsa0JBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtBQUNmLHVCQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7ZUFDaEM7YUFDRjtBQUNELG1CQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDakMsYUFBQyxHQUFHLEdBQUcsQ0FBQztBQUNSLGVBQUcsRUFBRSxDQUFDO1dBQ1A7U0FDRjtPQUNGO0tBQ0Y7QUFDRCxTQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0dBQ2Q7QUFDRCxPQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUM5QyxLQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2YsS0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNQLEtBQUMsR0FBRyxFQUFFLENBQUM7QUFDUCxLQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ1AsUUFBSSxDQUFDLElBQUksSUFBSSxFQUFFO0FBQ2IsT0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUM7QUFDZixPQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztBQUN2QixjQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2QixjQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDM0IsY0FBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNCLFVBQUksR0FBRyxHQUFHLENBQUMsRUFBRTtBQUNYLFNBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO09BQ2Q7QUFDRCxPQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUNyQixZQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyQixZQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekIsWUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pCLFVBQUksR0FBRyxHQUFHLENBQUMsRUFBRTtBQUNYLFNBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDO0FBQ2YsU0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7QUFDdkIsZ0JBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLGdCQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7T0FDNUI7S0FDRixNQUFNO0FBQ0wsT0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7QUFDdkIsY0FBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkIsY0FBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNCLGNBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzQixPQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUNyQixZQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyQixZQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekIsWUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pCLFVBQUksR0FBRyxHQUFHLENBQUMsRUFBRTtBQUNYLFNBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO0FBQ3ZCLGdCQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2QixnQkFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO09BQzVCO0tBQ0Y7R0FDRjtBQUNELE1BQUksR0FBRyxHQUFHLENBQUM7QUFDWCxNQUFJLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7QUFDckMsTUFBSSxJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUN0QyxNQUFJLElBQUksZUFBZSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQ25ELE1BQUksSUFBSSxhQUFhLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDL0MsTUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFO0FBQ1gsUUFBSSxJQUFJLGVBQWUsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztHQUNwRDtBQUNELE1BQUksSUFBSSxZQUFZLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDN0MsTUFBSSxJQUFJLEdBQUcsQ0FBQztBQUNaLFNBQU8sSUFBSSxDQUFDO0NBQ2I7O0FBRU0sU0FBUyxnQkFBZ0IsR0FBRztBQUNqQyxNQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztBQUNyQixNQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztBQUNuQixNQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztBQUNyQixNQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztDQUN2Qjs7QUFFTSxTQUFTLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ2xDLE1BQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQztBQUNYLE1BQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN4QixNQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDM0QsTUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQ1QsUUFBSSxDQUFDLENBQUMsRUFBRTtBQUNOLFNBQUcsR0FBRyxDQUFDLENBQUM7S0FDVCxNQUFNO0FBQ0wsU0FBRyxHQUFHLENBQUMsQ0FBQztLQUNUO0FBQ0QsS0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDWixLQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLENBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQy9CLEtBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsQ0FBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDL0IsS0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQSxDQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztHQUNoQztBQUNELFNBQU8sQ0FBQyxDQUFDO0NBQ1Y7O0FBRU0sU0FBUyxVQUFVLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7QUFDckMsTUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ1gsTUFBSSxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pELE1BQUksSUFBSSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN6RCxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzdDLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3QyxTQUFPLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUN6QiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiogU2FtcGxlIDFcbiog55SfV2ViR0zjgpLoqJjov7DjgZfjgabkuInop5LlvaLjgpLooajnpLrjgZXjgZvjgotcbiovXG5cbmNsYXNzIFNhbXBsZTEge1xuXG4gIC8qKlxuICAgKiBydW5cbiAgICog44K144Oz44OX44Or44Kz44O844OJ5a6f6KGMXG4gICAqL1xuICBydW4oKSB7XG4gICAgY29uc29sZS5sb2coJ1N0YXJ0IFNhbXBsZTEnKTtcblxuICAgIC8vIGNhbnZhc+OBuOOBruWPguS4iuOCkuWkieaVsOOBq+WPluW+l+OBmeOCi1xuICAgIGxldCBjID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpO1xuXG4gICAgLy8gc2l6ZeaMh+WumlxuICAgIGMud2lkdGggPSA1MTI7XG4gICAgYy5oZWlnaHQgPSA1MTI7XG5cbiAgICAvLyBXZWJHTOOCs+ODs+ODhuOCreOCueODiOOCkmNhbnZhc+OBi+OCieWPluW+l+OBmeOCi1xuICAgIGNvbnN0IGdsID0gYy5nZXRDb250ZXh0KCd3ZWJnbCcpIHx8IGMuZ2V0Q29udGV4dCgnZXhwZXJpbWVudGFsLXdlYmdsJyk7XG5cbiAgICAvLyBXZWJHTOOCs+ODs+ODhuOCreOCueODiOOBruWPluW+l+OBjOOBp+OBjeOBn+OBi+OBqeOBhuOBi1xuICAgIGlmIChnbCkge1xuICAgICAgY29uc29sZS5sb2coJ3N1cHBvcnRzIHdlYmdsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCd3ZWJnbCBub3Qgc3VwcG9ydGVkJyk7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyDjgq/jg6rjgqLjgZnjgovoibLjgpLmjIflrppcbiAgICBnbC5jbGVhckNvbG9yKDAuMCwgMC4wLCAwLjAsIDEuMCk7XG5cbiAgICAvLyDjgqjjg6zjg6Hjg7Pjg4jjgpLjgq/jg6rjgqJcbiAgICBnbC5jbGVhcihnbC5DT0xPUl9CVUZGRVJfQklUKTtcblxuICAgIC8vIOS4ieinkuW9ouOCkuW9ouaIkOOBmeOCi+mggueCueOBruODh+ODvOOCv+OCkuWPl+OBkeWPluOCi1xuICAgIGxldCB0cmlhbmdsZURhdGEgPSB0aGlzLmdlblRyaWFuZ2xlKCk7XG5cbiAgICAvLyDpoILngrnjg4fjg7zjgr/jgYvjgonjg5Djg4Pjg5XjgqHjgpLnlJ/miJBcbiAgICBsZXQgdmVydGV4QnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHZlcnRleEJ1ZmZlcik7XG4gICAgZ2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIG5ldyBGbG9hdDMyQXJyYXkodHJpYW5nbGVEYXRhLnApLCBnbC5TVEFUSUNfRFJBVyk7XG5cbiAgICAvLyDjgrfjgqfjg7zjg4Djgajjg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4hcbiAgICBsZXQgdmVydGV4U291cmNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZzJykudGV4dENvbnRlbnQ7XG4gICAgbGV0IGZyYWdtZW50U291cmNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZzJykudGV4dENvbnRlbnQ7XG4gICAgbGV0IHZlcnRleFNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcihnbC5WRVJURVhfU0hBREVSKTtcbiAgICBsZXQgZnJhZ21lbnRTaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIoZ2wuRlJBR01FTlRfU0hBREVSKTtcbiAgICBsZXQgcHJvZ3JhbXMgPSBnbC5jcmVhdGVQcm9ncmFtKCk7XG5cbiAgICBnbC5zaGFkZXJTb3VyY2UodmVydGV4U2hhZGVyLCB2ZXJ0ZXhTb3VyY2UpO1xuICAgIGdsLmNvbXBpbGVTaGFkZXIodmVydGV4U2hhZGVyKTtcbiAgICBnbC5hdHRhY2hTaGFkZXIocHJvZ3JhbXMsIHZlcnRleFNoYWRlcik7XG4gICAgZ2wuc2hhZGVyU291cmNlKGZyYWdtZW50U2hhZGVyLCBmcmFnbWVudFNvdXJjZSk7XG4gICAgZ2wuY29tcGlsZVNoYWRlcihmcmFnbWVudFNoYWRlcik7XG4gICAgZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW1zLCBmcmFnbWVudFNoYWRlcik7XG4gICAgZ2wubGlua1Byb2dyYW0ocHJvZ3JhbXMpO1xuICAgIGdsLnVzZVByb2dyYW0ocHJvZ3JhbXMpO1xuXG4gICAgLy8g44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OI44Gr5LiJ6KeS5b2i44Gu6aCC54K544OH44O844K/44KS55m76YyyXG4gICAgbGV0IGF0dExvY2F0aW9uID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24ocHJvZ3JhbXMsICdwb3NpdGlvbicpO1xuICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGF0dExvY2F0aW9uKTtcbiAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dExvY2F0aW9uLCAzLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xuXG4gICAgLy8g5o+P55S7XG4gICAgZ2wuZHJhd0FycmF5cyhnbC5UUklBTkdMRVMsIDAsIHRyaWFuZ2xlRGF0YS5wLmxlbmd0aCAvIDMpO1xuICAgIGdsLmZsdXNoKCk7XG4gIH1cblxuICAvKipcbiAgICogZ2VuVHJpYW5nbGVcbiAgICog5LiJ6KeS5b2i44Gu6aCC54K55oOF5aCx44KS6L+U5Y2044GZ44KLXG4gICAqL1xuICBnZW5UcmlhbmdsZSgpIHtcbiAgICBsZXQgb2JqID0ge307XG4gICAgb2JqLnAgPSBbXG4gICAgICAvLyDjgbLjgajjgaTnm67jga7kuInop5LlvaJcbiAgICAgIDAuMCwgMC41LCAwLjAsXG4gICAgICAwLjUsIC0wLjUsIDAuMCxcbiAgICAgIC0wLjUsIC0wLjUsIDAuMCxcblxuICAgICAgLy8g44G144Gf44Gk55uu44Gu5LiJ6KeS5b2iXG4gICAgICAwLjAsIC0wLjUsIDAuMCxcbiAgICAgIDAuNSwgMC41LCAwLjAsXG4gICAgICAtMC41LCAwLjUsIDAuMFxuICAgIF07XG4gICAgcmV0dXJuIG9iajtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNhbXBsZTE7XG4iLCIvKlxuICogU2FtcGxlIDJcbiAqIOihjOWIl+ioiOeul+OBq+OCiOOCi3RyYW5zbGF0ZS8gcm90YXRpb25cbiAqIHJlcXVlc3RBbmltYXRpb25GcmFtZeOBq+OCiOOCi+OCouODi+ODoeODvOOCt+ODp+ODs1xuICovXG5cbmltcG9ydCB7bWF0SVYsIHF0bklWLCB0b3J1cywgY3ViZSwgaHN2YSAsc3BoZXJlfSBmcm9tIFwiLi9taW5NYXRyaXhcIjtcblxuY2xhc3MgU2FtcGxlMiB7XG4gIC8qKlxuICAgKiBjb25zdHJ1Y3RvclxuICAgKiDjgrPjg7Pjgrnjg4jjg6njgq/jgr9cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgLy9jYW52YXPjgbjjga7lj4LkuIrjgpLlpInmlbDjgavlj5blvpfjgZnjgotcbiAgICBsZXQgYyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKTtcbiAgICAvLyBzaXpl5oyH5a6aXG4gICAgYy53aWR0aCA9IDUxMjtcbiAgICBjLmhlaWdodCA9IDUxMjtcbiAgICB0aGlzLmNhbnZhcyA9IGM7XG5cbiAgICAvL1dlYkdM44Kz44Oz44OG44Kt44K544OI44KSY2FudmFz44GL44KJ5Y+W5b6X44GZ44KLXG4gICAgdGhpcy5nbCA9IGMuZ2V0Q29udGV4dCgnd2ViZ2wnKSB8fCBjLmdldENvbnRleHQoJ2V4cGVyaW1lbnRhbC13ZWJnbCcpO1xuXG4gICAgLy8g6KGM5YiX6KiI566XXG4gICAgdGhpcy5tYXQgPSBudWxsO1xuICAgIC8vIOODrOODs+ODgOODquODs+OCsOeUqOOCq+OCpuODs+OCv1xuICAgIHRoaXMuY291bnQgPSAwO1xuICB9XG5cbiAgLyoqXG4gICAqIHJ1blxuICAgKiDjgrXjg7Pjg5fjg6vjgrPjg7zjg4nlrp/ooYxcbiAgICovXG4gIHJ1bigpIHtcbiAgICBjb25zb2xlLmxvZygnU3RhcnQgU2FtcGxlMicpO1xuXG4gICAgLy9XZWJHTOOCs+ODs+ODhuOCreOCueODiOOBruWPluW+l+OBjOOBp+OBjeOBn+OBi+OBqeOBhuOBi1xuICAgIGlmICh0aGlzLmdsKSB7XG4gICAgICBjb25zb2xlLmxvZygnc3VwcG9ydHMgd2ViZ2wnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ3dlYmdsIG5vdCBzdXBwb3J0ZWQnKTtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIOOCr+ODquOCouOBmeOCi+iJsuOCkuaMh+WumlxuICAgIHRoaXMuZ2wuY2xlYXJDb2xvcigwLjAsIDAuMCwgMC4wLCAxLjApO1xuXG4gICAgLy8g44Ko44Os44Oh44Oz44OI44KS44Kv44Oq44KiXG4gICAgdGhpcy5nbC5jbGVhcih0aGlzLmdsLkNPTE9SX0JVRkZFUl9CSVQpO1xuXG4gICAgLy8g5LiJ6KeS5b2i44KS5b2i5oiQ44GZ44KL6aCC54K544Gu44OH44O844K/44KS5Y+X44GR5Y+W44KLXG4gICAgdGhpcy50cmlhbmdsZURhdGEgPSB0aGlzLmdlblRyaWFuZ2xlKCk7XG5cbiAgICAvLyDpoILngrnjg4fjg7zjgr/jgYvjgonjg5Djg4Pjg5XjgqHjgpLnlJ/miJBcbiAgICBsZXQgdmVydGV4QnVmZmVyID0gdGhpcy5nbC5jcmVhdGVCdWZmZXIoKTtcbiAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIHZlcnRleEJ1ZmZlcik7XG4gICAgdGhpcy5nbC5idWZmZXJEYXRhKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCBuZXcgRmxvYXQzMkFycmF5KHRoaXMudHJpYW5nbGVEYXRhLnApLCB0aGlzLmdsLlNUQVRJQ19EUkFXKTtcblxuICAgIC8vIOOCt+OCp+ODvOODgOOBqOODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiFxuICAgIGNvbnN0IHZlcnRleFNvdXJjZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2cycpLnRleHRDb250ZW50O1xuICAgIGNvbnN0IGZyYWdtZW50U291cmNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZzJykudGV4dENvbnRlbnQ7XG5cbiAgICAvLyDjg6bjg7zjgrbjg7zlrprnvqnjga7jg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4jnlJ/miJDplqLmlbBcbiAgICB0aGlzLnByb2dyYW1zID0gdGhpcy5jcmVhdGVTaGFkZXJQcm9ncmFtKHZlcnRleFNvdXJjZSwgZnJhZ21lbnRTb3VyY2UpO1xuXG4gICAgLy8g44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OI44Gr5LiJ6KeS5b2i44Gu6aCC54K544OH44O844K/44KS55m76YyyXG4gICAgbGV0IGF0dExvY2F0aW9uID0gdGhpcy5nbC5nZXRBdHRyaWJMb2NhdGlvbih0aGlzLnByb2dyYW1zLCAncG9zaXRpb24nKTtcbiAgICB0aGlzLmdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGF0dExvY2F0aW9uKTtcbiAgICB0aGlzLmdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYXR0TG9jYXRpb24sIDMsIHRoaXMuZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcblxuICAgIC8vIOihjOWIl+OBruWIneacn+WMllxuICAgIHRoaXMubWF0ID0gbmV3IG1hdElWKCk7XG4gICAgdGhpcy5tTWF0cml4ID0gdGhpcy5tYXQuaWRlbnRpdHkodGhpcy5tYXQuY3JlYXRlKCkpO1xuICAgIHRoaXMudk1hdHJpeCA9IHRoaXMubWF0LmlkZW50aXR5KHRoaXMubWF0LmNyZWF0ZSgpKTtcbiAgICB0aGlzLnBNYXRyaXggPSB0aGlzLm1hdC5pZGVudGl0eSh0aGlzLm1hdC5jcmVhdGUoKSk7XG4gICAgdGhpcy52cE1hdHJpeCA9IHRoaXMubWF0LmlkZW50aXR5KHRoaXMubWF0LmNyZWF0ZSgpKTtcbiAgICB0aGlzLm12cE1hdHJpeCA9IHRoaXMubWF0LmlkZW50aXR5KHRoaXMubWF0LmNyZWF0ZSgpKTtcblxuICAgIC8vIOODk+ODpeODvOW6p+aomeWkieaPm+ihjOWIl1xuICAgIGxldCBjYW1lcmFQb3NpdGlvbiA9IFswLjAsIDAuMCwgMy4wXTsgLy8g44Kr44Oh44Op44Gu5L2N572uXG4gICAgbGV0IGNlbnRlclBvaW50ID0gWzAuMCwgMC4wLCAwLjBdOyAgICAvLyDms6joppbngrlcbiAgICBsZXQgY2FtZXJhVXAgPSBbMC4wLCAxLjAsIDAuMF07ICAgICAgIC8vIOOCq+ODoeODqeOBruS4iuaWueWQkVxuICAgIHRoaXMubWF0Lmxvb2tBdChjYW1lcmFQb3NpdGlvbiwgY2VudGVyUG9pbnQsIGNhbWVyYVVwLCB0aGlzLnZNYXRyaXgpO1xuXG4gICAgLy8g44OX44Ot44K444Kn44Kv44K344On44Oz44Gu44Gf44KB44Gu5oOF5aCx44KS5o+D44GI44KLXG4gICAgbGV0IGZvdnkgPSA0NTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOimlumHjuinklxuICAgIGxldCBhc3BlY3QgPSB0aGlzLmNhbnZhcy53aWR0aCAvIHRoaXMuY2FudmFzLmhlaWdodDsgLy8g44Ki44K544Oa44Kv44OI5q+UXG4gICAgbGV0IG5lYXIgPSAwLjE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOepuumWk+OBruacgOWJjemdolxuICAgIGxldCBmYXIgPSAxMC4wOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDnqbrplpPjga7lpaXooYzjgY3ntYLnq69cbiAgICB0aGlzLm1hdC5wZXJzcGVjdGl2ZShmb3Z5LCBhc3BlY3QsIG5lYXIsIGZhciwgdGhpcy5wTWF0cml4KTtcblxuICAgIC8vIOihjOWIl+OCkuaOm+OBkeWQiOOCj+OBm+OBplZQ44Oe44OI44Oq44OD44Kv44K544KS55Sf5oiQ44GX44Gm44GK44GPXG4gICAgdGhpcy5tYXQubXVsdGlwbHkodGhpcy5wTWF0cml4LCB0aGlzLnZNYXRyaXgsIHRoaXMudnBNYXRyaXgpOyAgIC8vIHDjgat244KS5o6b44GR44KLXG5cbiAgICAvLyByZW5kZXJpbmfplovlp4tcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIOODrOODs+ODgOODquODs+OCsOmWouaVsOOBruWumue+qVxuICAgKi9cbiAgcmVuZGVyKCkge1xuXG4gICAgLy8gQ2FudmFz44Ko44Os44Oh44Oz44OI44KS44Kv44Oq44Ki44GZ44KLXG4gICAgdGhpcy5nbC5jbGVhcih0aGlzLmdsLkNPTE9SX0JVRkZFUl9CSVQpO1xuXG4gICAgLy8g44Oi44OH44Or5bqn5qiZ5aSJ5o+b6KGM5YiX44KS5LiA5bqm5Yid5pyf5YyW44GX44Gm44Oq44K744OD44OI44GZ44KLXG4gICAgdGhpcy5tYXQuaWRlbnRpdHkodGhpcy5tTWF0cml4KTtcblxuICAgIC8vIOOCq+OCpuODs+OCv+OCkuOCpOODs+OCr+ODquODoeODs+ODiOOBmeOCi1xuICAgIHRoaXMuY291bnQrKztcblxuICAgIC8vIOODouODh+ODq+W6p+aomeWkieaPm+ihjOWIl1xuICAgIC8vIOenu+WLlVxuICAgIGxldCBtb3ZlID0gWzAuNSwgMC41LCAwLjBdOyAgICAgICAgICAgLy8g56e75YuV6YeP44GvWFnjgZ3jgozjgZ7jgowwLjVcbiAgICB0aGlzLm1hdC50cmFuc2xhdGUodGhpcy5tTWF0cml4LCBtb3ZlLCB0aGlzLm1NYXRyaXgpO1xuXG4gICAgLy8g5Zue6LuiXG4gICAgbGV0IHJhZGlhbnMgPSAodGhpcy5jb3VudCAlIDM2MCkgKiBNYXRoLlBJIC8gMTgwO1xuICAgIGxldCBheGlzID0gWzAuMCwgMC4wLCAxLjBdO1xuICAgIHRoaXMubWF0LnJvdGF0ZSh0aGlzLm1NYXRyaXgsIHJhZGlhbnMsIGF4aXMsIHRoaXMubU1hdHJpeCk7XG5cblxuICAgIC8vIOihjOWIl+OCkuaOm+OBkeWQiOOCj+OBm+OBpk1WUOODnuODiOODquODg+OCr+OCueOCkueUn+aIkFxuICAgIHRoaXMubWF0Lm11bHRpcGx5KHRoaXMucE1hdHJpeCwgdGhpcy52TWF0cml4LCB0aGlzLnZwTWF0cml4KTsgICAvLyBw44GrduOCkuaOm+OBkeOCi1xuICAgIHRoaXMubWF0Lm11bHRpcGx5KHRoaXMudnBNYXRyaXgsIHRoaXMubU1hdHJpeCwgdGhpcy5tdnBNYXRyaXgpOyAvLyDjgZXjgonjgatt44KS5o6b44GR44KLXG5cbiAgICAvLyDjgrfjgqfjg7zjg4DjgavooYzliJfjgpLpgIHkv6HjgZnjgotcbiAgICBsZXQgdW5pTG9jYXRpb24gPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLnByb2dyYW1zLCAnbXZwTWF0cml4Jyk7XG4gICAgdGhpcy5nbC51bmlmb3JtTWF0cml4NGZ2KHVuaUxvY2F0aW9uLCBmYWxzZSwgdGhpcy5tdnBNYXRyaXgpO1xuXG4gICAgLy8gVlDjg57jg4jjg6rjg4Pjgq/jgrnjgavjg6Ljg4fjg6vluqfmqJnlpInmj5vooYzliJfjgpLmjpvjgZHjgotcbiAgICB0aGlzLm1hdC5tdWx0aXBseSh0aGlzLnZwTWF0cml4LCB0aGlzLm1NYXRyaXgsIHRoaXMubXZwTWF0cml4KTtcblxuICAgIC8vIOaPj+eUu1xuICAgIHRoaXMuZ2wuZHJhd0FycmF5cyh0aGlzLmdsLlRSSUFOR0xFUywgMCwgdGhpcy50cmlhbmdsZURhdGEucC5sZW5ndGggLyAzKTtcbiAgICB0aGlzLmdsLmZsdXNoKCk7XG5cbiAgICAvLyDlho3luLDlkbzjgbPlh7rjgZdcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCk9PiB7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIGNyZWF0ZVNoYWRlclByb2dyYW1cbiAgICog44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OI55Sf5oiQ6Zai5pWwXG4gICAqL1xuICBjcmVhdGVTaGFkZXJQcm9ncmFtKHZlcnRleFNvdXJjZSwgZnJhZ21lbnRTb3VyY2UpIHtcblxuICAgIC8vIOOCt+OCp+ODvOODgOOCquODluOCuOOCp+OCr+ODiOOBrueUn+aIkFxuICAgIGxldCB2ZXJ0ZXhTaGFkZXIgPSB0aGlzLmdsLmNyZWF0ZVNoYWRlcih0aGlzLmdsLlZFUlRFWF9TSEFERVIpO1xuICAgIGxldCBmcmFnbWVudFNoYWRlciA9IHRoaXMuZ2wuY3JlYXRlU2hhZGVyKHRoaXMuZ2wuRlJBR01FTlRfU0hBREVSKTtcblxuICAgIC8vIOOCt+OCp+ODvOODgOOBq+OCveODvOOCueOCkuWJsuOCiuW9k+OBpuOBpuOCs+ODs+ODkeOCpOODq1xuICAgIHRoaXMuZ2wuc2hhZGVyU291cmNlKHZlcnRleFNoYWRlciwgdmVydGV4U291cmNlKTtcbiAgICB0aGlzLmdsLmNvbXBpbGVTaGFkZXIodmVydGV4U2hhZGVyKTtcbiAgICB0aGlzLmdsLnNoYWRlclNvdXJjZShmcmFnbWVudFNoYWRlciwgZnJhZ21lbnRTb3VyY2UpO1xuICAgIHRoaXMuZ2wuY29tcGlsZVNoYWRlcihmcmFnbWVudFNoYWRlcik7XG5cbiAgICAvLyDjgrfjgqfjg7zjg4Djg7zjgrPjg7Pjg5HjgqTjg6vjga7jgqjjg6njg7zliKTlrppcbiAgICBpZiAodGhpcy5nbC5nZXRTaGFkZXJQYXJhbWV0ZXIodmVydGV4U2hhZGVyLCB0aGlzLmdsLkNPTVBJTEVfU1RBVFVTKVxuICAgICAgJiYgdGhpcy5nbC5nZXRTaGFkZXJQYXJhbWV0ZXIoZnJhZ21lbnRTaGFkZXIsIHRoaXMuZ2wuQ09NUElMRV9TVEFUVVMpKSB7XG4gICAgICBjb25zb2xlLmxvZygnU3VjY2VzcyBTaGFkZXIgQ29tcGlsZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygnRmFpbGQgU2hhZGVyIENvbXBpbGUnKTtcbiAgICAgIGNvbnNvbGUubG9nKCd2ZXJ0ZXhTaGFkZXInLCB0aGlzLmdsLmdldFNoYWRlckluZm9Mb2codmVydGV4U2hhZGVyKSk7XG4gICAgICBjb25zb2xlLmxvZygnZnJhZ21lbnRTaGFkZXInLCB0aGlzLmdsLmdldFNoYWRlckluZm9Mb2coZnJhZ21lbnRTaGFkZXIpKTtcbiAgICB9XG5cbiAgICAvLyDjg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4jjga7nlJ/miJDjgYvjgonpgbjmip7jgb7jgadcbiAgICBjb25zdCBwcm9ncmFtcyA9IHRoaXMuZ2wuY3JlYXRlUHJvZ3JhbSgpO1xuXG4gICAgdGhpcy5nbC5hdHRhY2hTaGFkZXIocHJvZ3JhbXMsIHZlcnRleFNoYWRlcik7XG4gICAgdGhpcy5nbC5hdHRhY2hTaGFkZXIocHJvZ3JhbXMsIGZyYWdtZW50U2hhZGVyKTtcbiAgICB0aGlzLmdsLmxpbmtQcm9ncmFtKHByb2dyYW1zKTtcblxuICAgIC8vIOODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiOOBruOCqOODqeODvOWIpOWumuWHpueQhlxuICAgIGlmICh0aGlzLmdsLmdldFByb2dyYW1QYXJhbWV0ZXIocHJvZ3JhbXMsIHRoaXMuZ2wuTElOS19TVEFUVVMpKSB7XG4gICAgICB0aGlzLmdsLnVzZVByb2dyYW0ocHJvZ3JhbXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygnRmFpbGVkIExpbmsgUHJvZ3JhbScsIHRoaXMuZ2wuZ2V0UHJvZ3JhbUluZm9Mb2cocHJvZ3JhbXMpKTtcbiAgICB9XG5cbiAgICAvLyDnlJ/miJDjgZfjgZ/jg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4jjgpLmiLvjgorlgKTjgajjgZfjgabov5TjgZlcbiAgICByZXR1cm4gcHJvZ3JhbXM7XG4gIH1cblxuICAvKipcbiAgICogZ2VuVHJpYW5nbGVcbiAgICog5LiJ6KeS5b2i44Gu6aCC54K55oOF5aCx44KS6L+U5Y2044GZ44KLXG4gICAqL1xuICBnZW5UcmlhbmdsZSgpIHtcbiAgICBsZXQgb2JqID0ge307XG4gICAgb2JqLnAgPSBbXG4gICAgICAvLyDjgbLjgajjgaTnm67jga7kuInop5LlvaJcbiAgICAgIDAuMCwgMC41LCAwLjAsXG4gICAgICAwLjUsIC0wLjUsIDAuMCxcbiAgICAgIC0wLjUsIC0wLjUsIDAuMCxcblxuICAgICAgLy8g44G144Gf44Gk55uu44Gu5LiJ6KeS5b2iXG4gICAgICAwLjAsIC0wLjUsIDAuMCxcbiAgICAgIDAuNSwgMC41LCAwLjAsXG4gICAgICAtMC41LCAwLjUsIDAuMFxuICAgIF07XG4gICAgcmV0dXJuIG9iajtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNhbXBsZTI7XG5cbiIsIi8qXG4gKiBTYW1wbGUgM1xuICog55CD5L2T44Oi44OH44Or44Gu6KGo56S6XG4gKiBpbmRleCBidWZmZXJcbiAqIOmggueCueiJsuOBp+edgOiJsuOBl+OBpuaPj+eUu1xuICogZGVwdGggdGVzdFxuICovXG5cbmltcG9ydCB7bWF0SVYsIHF0bklWLCB0b3J1cywgY3ViZSwgaHN2YSAsc3BoZXJlfSBmcm9tIFwiLi9taW5NYXRyaXhcIjtcblxuY2xhc3MgU2FtcGxlMyB7XG4gIC8qKlxuICAgKiBjb25zdHJ1Y3RvclxuICAgKiDjgrPjg7Pjgrnjg4jjg6njgq/jgr9cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgLy9jYW52YXPjgbjjga7lj4LkuIrjgpLlpInmlbDjgavlj5blvpfjgZnjgotcbiAgICBsZXQgYyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKTtcbiAgICAvLyBzaXpl5oyH5a6aXG4gICAgYy53aWR0aCA9IDUxMjtcbiAgICBjLmhlaWdodCA9IDUxMjtcbiAgICB0aGlzLmNhbnZhcyA9IGM7XG5cbiAgICAvL1dlYkdM44Kz44Oz44OG44Kt44K544OI44KSY2FudmFz44GL44KJ5Y+W5b6X44GZ44KLXG4gICAgdGhpcy5nbCA9IGMuZ2V0Q29udGV4dCgnd2ViZ2wnKSB8fCBjLmdldENvbnRleHQoJ2V4cGVyaW1lbnRhbC13ZWJnbCcpO1xuXG4gICAgLy8g6KGM5YiX6KiI566XXG4gICAgdGhpcy5tYXQgPSBudWxsO1xuICAgIC8vIOODrOODs+ODgOODquODs+OCsOeUqOOCq+OCpuODs+OCv1xuICAgIHRoaXMuY291bnQgPSAwO1xuICB9XG5cbiAgLyoqXG4gICAqIHJ1blxuICAgKiDjgrXjg7Pjg5fjg6vjgrPjg7zjg4nlrp/ooYxcbiAgICovXG4gIHJ1bigpIHtcbiAgICBjb25zb2xlLmxvZygnU3RhcnQgU2FtcGxlMycpO1xuICAgIC8vIFdlYkdM44Kz44Oz44OG44Kt44K544OI44Gu5Y+W5b6X44GM44Gn44GN44Gf44GL44Gp44GG44GLXG4gICAgaWYgKHRoaXMuZ2wpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdzdXBwb3J0cyB3ZWJnbCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygnd2ViZ2wgbm90IHN1cHBvcnRlZCcpO1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8g44Kv44Oq44Ki44GZ44KL6Imy44KS5oyH5a6aXG4gICAgdGhpcy5nbC5jbGVhckNvbG9yKDAuMCwgMC4wLCAwLjAsIDEuMCk7XG5cbiAgICAvLyDjgqjjg6zjg6Hjg7Pjg4jjgpLjgq/jg6rjgqJcbiAgICB0aGlzLmdsLmNsZWFyKHRoaXMuZ2wuQ09MT1JfQlVGRkVSX0JJVCk7XG5cbiAgICAvLyDjgrfjgqfjg7zjg4Djgajjg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4hcbiAgICBjb25zdCB2ZXJ0ZXhTb3VyY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndnMnKS50ZXh0Q29udGVudDtcbiAgICBjb25zdCBmcmFnbWVudFNvdXJjZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmcycpLnRleHRDb250ZW50O1xuXG4gICAgLy8g44Om44O844K244O85a6a576p44Gu44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OI55Sf5oiQ6Zai5pWwXG4gICAgdGhpcy5wcm9ncmFtcyA9IHRoaXMuY3JlYXRlU2hhZGVyUHJvZ3JhbSh2ZXJ0ZXhTb3VyY2UsIGZyYWdtZW50U291cmNlKTtcblxuICAgIC8vIOeQg+S9k+OCkuW9ouaIkOOBmeOCi+mggueCueOBruODh+ODvOOCv+OCkuWPl+OBkeWPluOCi1xuICAgIHRoaXMuc3BoZXJlRGF0YSA9IHNwaGVyZSgxNiwgMTYsIDEuMCk7XG5cbiAgICAvLyDpoILngrnjg4fjg7zjgr/jgYvjgonjg5Djg4Pjg5XjgqHjgpLnlJ/miJBcbiAgICAvKlxuICAgIGxldCB2ZXJ0ZXhCdWZmZXIgPSB0aGlzLmdsLmNyZWF0ZUJ1ZmZlcigpO1xuICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkFSUkFZX0JVRkZFUiwgdmVydGV4QnVmZmVyKTtcbiAgICB0aGlzLmdsLmJ1ZmZlckRhdGEodGhpcy5nbC5BUlJBWV9CVUZGRVIsIG5ldyBGbG9hdDMyQXJyYXkodGhpcy5zcGhlcmVEYXRhLnApLCB0aGlzLmdsLlNUQVRJQ19EUkFXKTtcblxuICAgICAvLyDjg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4jjgavpoILngrnjg4fjg7zjgr/jgpLnmbvpjLJcbiAgICAgbGV0IGF0dExvY2F0aW9uID0gdGhpcy5nbC5nZXRBdHRyaWJMb2NhdGlvbih0aGlzLnByb2dyYW1zLCAncG9zaXRpb24nKTtcbiAgICAgdGhpcy5nbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShhdHRMb2NhdGlvbik7XG4gICAgIHRoaXMuZ2wudmVydGV4QXR0cmliUG9pbnRlcihhdHRMb2NhdGlvbiwgMywgdGhpcy5nbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xuXG4gICAgICovXG4gICAgLy8g6aCC54K544OH44O844K/44GL44KJ44OQ44OD44OV44Kh44KS55Sf5oiQ44GX44Gm55m76Yyy44GZ44KL77yI6aCC54K55bqn5qiZ77yJXG4gICAgbGV0IHZQb3NpdGlvbkJ1ZmZlciA9IHRoaXMuZ2wuY3JlYXRlQnVmZmVyKCk7XG4gICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCB2UG9zaXRpb25CdWZmZXIpO1xuICAgIHRoaXMuZ2wuYnVmZmVyRGF0YSh0aGlzLmdsLkFSUkFZX0JVRkZFUiwgbmV3IEZsb2F0MzJBcnJheSh0aGlzLnNwaGVyZURhdGEucCksIHRoaXMuZ2wuU1RBVElDX0RSQVcpO1xuICAgIGxldCBhdHRMb2NQb3NpdGlvbiA9IHRoaXMuZ2wuZ2V0QXR0cmliTG9jYXRpb24odGhpcy5wcm9ncmFtcywgJ3Bvc2l0aW9uJyk7XG4gICAgdGhpcy5nbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShhdHRMb2NQb3NpdGlvbik7XG4gICAgdGhpcy5nbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dExvY1Bvc2l0aW9uLCAzLCB0aGlzLmdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XG5cbiAgICAvLyDpoILngrnjg4fjg7zjgr/jgYvjgonjg5Djg4Pjg5XjgqHjgpLnlJ/miJDjgZfjgabnmbvpjLLjgZnjgovvvIjpoILngrnoibLvvIlcbiAgICBsZXQgdkNvbG9yQnVmZmVyID0gdGhpcy5nbC5jcmVhdGVCdWZmZXIoKTtcbiAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIHZDb2xvckJ1ZmZlcik7XG4gICAgdGhpcy5nbC5idWZmZXJEYXRhKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCBuZXcgRmxvYXQzMkFycmF5KHRoaXMuc3BoZXJlRGF0YS5jKSwgdGhpcy5nbC5TVEFUSUNfRFJBVyk7XG4gICAgbGV0IGF0dExvY0NvbG9yID0gdGhpcy5nbC5nZXRBdHRyaWJMb2NhdGlvbih0aGlzLnByb2dyYW1zLCAnY29sb3InKTtcbiAgICB0aGlzLmdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGF0dExvY0NvbG9yKTtcbiAgICB0aGlzLmdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYXR0TG9jQ29sb3IsIDQsIHRoaXMuZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcblxuICAgIC8vIOOCpOODs+ODh+ODg+OCr+OCueODkOODg+ODleOCoeOBrueUn+aIkFxuICAgIGxldCBpbmRleEJ1ZmZlciA9IHRoaXMuZ2wuY3JlYXRlQnVmZmVyKCk7XG4gICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIGluZGV4QnVmZmVyKTtcbiAgICB0aGlzLmdsLmJ1ZmZlckRhdGEodGhpcy5nbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgbmV3IEludDE2QXJyYXkodGhpcy5zcGhlcmVEYXRhLmkpLCB0aGlzLmdsLlNUQVRJQ19EUkFXKTtcblxuICAgIC8vIOihjOWIl+OBruWIneacn+WMllxuICAgIHRoaXMubWF0ID0gbmV3IG1hdElWKCk7XG4gICAgdGhpcy5tTWF0cml4ID0gdGhpcy5tYXQuaWRlbnRpdHkodGhpcy5tYXQuY3JlYXRlKCkpO1xuICAgIHRoaXMudk1hdHJpeCA9IHRoaXMubWF0LmlkZW50aXR5KHRoaXMubWF0LmNyZWF0ZSgpKTtcbiAgICB0aGlzLnBNYXRyaXggPSB0aGlzLm1hdC5pZGVudGl0eSh0aGlzLm1hdC5jcmVhdGUoKSk7XG4gICAgdGhpcy52cE1hdHJpeCA9IHRoaXMubWF0LmlkZW50aXR5KHRoaXMubWF0LmNyZWF0ZSgpKTtcbiAgICB0aGlzLm12cE1hdHJpeCA9IHRoaXMubWF0LmlkZW50aXR5KHRoaXMubWF0LmNyZWF0ZSgpKTtcblxuICAgIC8vIOODk+ODpeODvOW6p+aomeWkieaPm+ihjOWIl1xuICAgIGxldCBjYW1lcmFQb3NpdGlvbiA9IFswLjAsIDAuMCwgMy4wXTsgLy8g44Kr44Oh44Op44Gu5L2N572uXG4gICAgbGV0IGNlbnRlclBvaW50ID0gWzAuMCwgMC4wLCAwLjBdOyAgICAvLyDms6joppbngrlcbiAgICBsZXQgY2FtZXJhVXAgPSBbMC4wLCAxLjAsIDAuMF07ICAgICAgIC8vIOOCq+ODoeODqeOBruS4iuaWueWQkVxuICAgIHRoaXMubWF0Lmxvb2tBdChjYW1lcmFQb3NpdGlvbiwgY2VudGVyUG9pbnQsIGNhbWVyYVVwLCB0aGlzLnZNYXRyaXgpO1xuXG4gICAgLy8g44OX44Ot44K444Kn44Kv44K344On44Oz44Gu44Gf44KB44Gu5oOF5aCx44KS5o+D44GI44KLXG4gICAgbGV0IGZvdnkgPSA0NTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOimlumHjuinklxuICAgIGxldCBhc3BlY3QgPSB0aGlzLmNhbnZhcy53aWR0aCAvIHRoaXMuY2FudmFzLmhlaWdodDsgLy8g44Ki44K544Oa44Kv44OI5q+UXG4gICAgbGV0IG5lYXIgPSAwLjE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOepuumWk+OBruacgOWJjemdolxuICAgIGxldCBmYXIgPSAxMC4wOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDnqbrplpPjga7lpaXooYzjgY3ntYLnq69cbiAgICB0aGlzLm1hdC5wZXJzcGVjdGl2ZShmb3Z5LCBhc3BlY3QsIG5lYXIsIGZhciwgdGhpcy5wTWF0cml4KTtcblxuICAgIC8vIOihjOWIl+OCkuaOm+OBkeWQiOOCj+OBm+OBplZQ44Oe44OI44Oq44OD44Kv44K544KS55Sf5oiQ44GX44Gm44GK44GPXG4gICAgdGhpcy5tYXQubXVsdGlwbHkodGhpcy5wTWF0cml4LCB0aGlzLnZNYXRyaXgsIHRoaXMudnBNYXRyaXgpOyAgIC8vIHDjgat244KS5o6b44GR44KLXG5cbiAgICAvLyDoqK3lrprjgpLmnInlirnljJbjgZnjgotcbiAgICB0aGlzLmdsLmVuYWJsZSh0aGlzLmdsLkRFUFRIX1RFU1QpO1xuICAgIHRoaXMuZ2wuZGVwdGhGdW5jKHRoaXMuZ2wuTEVRVUFMKTtcblxuICAgIC8vIHJlbmRlcmluZ+mWi+Wni1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICAvKipcbiAgICog44Os44Oz44OA44Oq44Oz44Kw6Zai5pWw44Gu5a6a576pXG4gICAqL1xuICByZW5kZXIoKSB7XG5cbiAgICAvLyBDYW52YXPjgqjjg6zjg6Hjg7Pjg4jjgpLjgq/jg6rjgqLjgZnjgotcbiAgICB0aGlzLmdsLmNsZWFyKHRoaXMuZ2wuQ09MT1JfQlVGRkVSX0JJVCk7XG5cbiAgICAvLyDjg6Ljg4fjg6vluqfmqJnlpInmj5vooYzliJfjgpLkuIDluqbliJ3mnJ/ljJbjgZfjgabjg6rjgrvjg4Pjg4jjgZnjgotcbiAgICB0aGlzLm1hdC5pZGVudGl0eSh0aGlzLm1NYXRyaXgpO1xuXG4gICAgLy8g44Kr44Km44Oz44K/44KS44Kk44Oz44Kv44Oq44Oh44Oz44OI44GZ44KLXG4gICAgdGhpcy5jb3VudCsrO1xuXG4gICAgLy8g44Oi44OH44Or5bqn5qiZ5aSJ5o+b6KGM5YiXXG4gICAgLy8g56e75YuVXG4gICAgbGV0IG1vdmUgPSBbMC4wLCAwLjAsIDAuMF07XG4gICAgdGhpcy5tYXQudHJhbnNsYXRlKHRoaXMubU1hdHJpeCwgbW92ZSwgdGhpcy5tTWF0cml4KTtcblxuICAgIC8vIOWbnui7olxuICAgIC8qXG4gICAgbGV0IHJhZGlhbnMgPSAodGhpcy5jb3VudCAlIDM2MCkgKiBNYXRoLlBJIC8gMTgwO1xuICAgIGxldCBheGlzID0gWzAuMCwgMC4wLCAxLjBdO1xuICAgIHRoaXMubWF0LnJvdGF0ZSh0aGlzLm1NYXRyaXgsIHJhZGlhbnMsIGF4aXMsIHRoaXMubU1hdHJpeCk7XG4gICAgKi9cblxuICAgIC8vIENhbnZhc+OCqOODrOODoeODs+ODiOOCkuOCr+ODquOCouOBmeOCi1xuICAgIHRoaXMuZ2wuY2xlYXIodGhpcy5nbC5DT0xPUl9CVUZGRVJfQklUIHwgdGhpcy5nbC5ERVBUSF9CVUZGRVJfQklUKTtcblxuICAgIGxldCByYWRpYW5zID0gKHRoaXMuY291bnQgJSAzNjApICogTWF0aC5QSSAvIDE4MDtcblxuICAgIC8vIOODouODh+ODq+W6p+aomeWkieaPm+ihjOWIl+OCkuS4gOW6puWIneacn+WMluOBl+OBpuODquOCu+ODg+ODiOOBmeOCi1xuICAgIHRoaXMubWF0LmlkZW50aXR5KHRoaXMubU1hdHJpeCk7XG4gICAgLy8g44Oi44OH44Or5bqn5qiZ5aSJ5o+b6KGM5YiXXG4gICAgbGV0IGF4aXMgPSBbMC4wLCAxLjAsIDEuMF07XG4gICAgdGhpcy5tYXQucm90YXRlKHRoaXMubU1hdHJpeCwgcmFkaWFucywgYXhpcywgdGhpcy5tTWF0cml4KTtcblxuICAgIC8vIOihjOWIl+OCkuaOm+OBkeWQiOOCj+OBm+OBpk1WUOODnuODiOODquODg+OCr+OCueOCkueUn+aIkFxuICAgIHRoaXMubWF0Lm11bHRpcGx5KHRoaXMucE1hdHJpeCwgdGhpcy52TWF0cml4LCB0aGlzLnZwTWF0cml4KTsgICAvLyBw44GrduOCkuaOm+OBkeOCi1xuICAgIHRoaXMubWF0Lm11bHRpcGx5KHRoaXMudnBNYXRyaXgsIHRoaXMubU1hdHJpeCwgdGhpcy5tdnBNYXRyaXgpOyAvLyDjgZXjgonjgatt44KS5o6b44GR44KLXG5cbiAgICAvLyDjgrfjgqfjg7zjg4DjgavooYzliJfjgpLpgIHkv6HjgZnjgotcbiAgICBsZXQgdW5pTG9jYXRpb24gPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLnByb2dyYW1zLCAnbXZwTWF0cml4Jyk7XG4gICAgdGhpcy5nbC51bmlmb3JtTWF0cml4NGZ2KHVuaUxvY2F0aW9uLCBmYWxzZSwgdGhpcy5tdnBNYXRyaXgpO1xuXG4gICAgLy8gVlDjg57jg4jjg6rjg4Pjgq/jgrnjgavjg6Ljg4fjg6vluqfmqJnlpInmj5vooYzliJfjgpLmjpvjgZHjgotcbiAgICB0aGlzLm1hdC5tdWx0aXBseSh0aGlzLnZwTWF0cml4LCB0aGlzLm1NYXRyaXgsIHRoaXMubXZwTWF0cml4KTtcblxuICAgIC8vIOaPj+eUu1xuICAgIC8vIHRoaXMuZ2wuZHJhd0FycmF5cyh0aGlzLmdsLlRSSUFOR0xFUywgMCwgdGhpcy5zcGhlcmVEYXRhLnAubGVuZ3RoIC8gMyk7XG4gICAgLy8g44Kk44Oz44OH44OD44Kv44K544OQ44OD44OV44Kh44Gr44KI44KL5o+P55S7XG4gICAgdGhpcy5nbC5kcmF3RWxlbWVudHModGhpcy5nbC5UUklBTkdMRVMsIHRoaXMuc3BoZXJlRGF0YS5pLmxlbmd0aCwgdGhpcy5nbC5VTlNJR05FRF9TSE9SVCwgMCk7XG4gICAgdGhpcy5nbC5mbHVzaCgpO1xuXG4gICAgLy8g5YaN5biw5ZG844Gz5Ye644GXXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpPT4ge1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjcmVhdGVTaGFkZXJQcm9ncmFtXG4gICAqIOODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiOeUn+aIkOmWouaVsFxuICAgKi9cbiAgY3JlYXRlU2hhZGVyUHJvZ3JhbSh2ZXJ0ZXhTb3VyY2UsIGZyYWdtZW50U291cmNlKSB7XG5cbiAgICAvLyDjgrfjgqfjg7zjg4Djgqrjg5bjgrjjgqfjgq/jg4jjga7nlJ/miJBcbiAgICBsZXQgdmVydGV4U2hhZGVyID0gdGhpcy5nbC5jcmVhdGVTaGFkZXIodGhpcy5nbC5WRVJURVhfU0hBREVSKTtcbiAgICBsZXQgZnJhZ21lbnRTaGFkZXIgPSB0aGlzLmdsLmNyZWF0ZVNoYWRlcih0aGlzLmdsLkZSQUdNRU5UX1NIQURFUik7XG5cbiAgICAvLyDjgrfjgqfjg7zjg4Djgavjgr3jg7zjgrnjgpLlibLjgorlvZPjgabjgabjgrPjg7Pjg5HjgqTjg6tcbiAgICB0aGlzLmdsLnNoYWRlclNvdXJjZSh2ZXJ0ZXhTaGFkZXIsIHZlcnRleFNvdXJjZSk7XG4gICAgdGhpcy5nbC5jb21waWxlU2hhZGVyKHZlcnRleFNoYWRlcik7XG4gICAgdGhpcy5nbC5zaGFkZXJTb3VyY2UoZnJhZ21lbnRTaGFkZXIsIGZyYWdtZW50U291cmNlKTtcbiAgICB0aGlzLmdsLmNvbXBpbGVTaGFkZXIoZnJhZ21lbnRTaGFkZXIpO1xuXG4gICAgLy8g44K344Kn44O844OA44O844Kz44Oz44OR44Kk44Or44Gu44Ko44Op44O85Yik5a6aXG4gICAgaWYgKHRoaXMuZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHZlcnRleFNoYWRlciwgdGhpcy5nbC5DT01QSUxFX1NUQVRVUylcbiAgICAgICYmIHRoaXMuZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKGZyYWdtZW50U2hhZGVyLCB0aGlzLmdsLkNPTVBJTEVfU1RBVFVTKSkge1xuICAgICAgY29uc29sZS5sb2coJ1N1Y2Nlc3MgU2hhZGVyIENvbXBpbGUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ0ZhaWxkIFNoYWRlciBDb21waWxlJyk7XG4gICAgICBjb25zb2xlLmxvZygndmVydGV4U2hhZGVyJywgdGhpcy5nbC5nZXRTaGFkZXJJbmZvTG9nKHZlcnRleFNoYWRlcikpO1xuICAgICAgY29uc29sZS5sb2coJ2ZyYWdtZW50U2hhZGVyJywgdGhpcy5nbC5nZXRTaGFkZXJJbmZvTG9nKGZyYWdtZW50U2hhZGVyKSk7XG4gICAgfVxuXG4gICAgLy8g44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OI44Gu55Sf5oiQ44GL44KJ6YG45oqe44G+44GnXG4gICAgY29uc3QgcHJvZ3JhbXMgPSB0aGlzLmdsLmNyZWF0ZVByb2dyYW0oKTtcblxuICAgIHRoaXMuZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW1zLCB2ZXJ0ZXhTaGFkZXIpO1xuICAgIHRoaXMuZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW1zLCBmcmFnbWVudFNoYWRlcik7XG4gICAgdGhpcy5nbC5saW5rUHJvZ3JhbShwcm9ncmFtcyk7XG5cbiAgICAvLyDjg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4jjga7jgqjjg6njg7zliKTlrprlh6bnkIZcbiAgICBpZiAodGhpcy5nbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHByb2dyYW1zLCB0aGlzLmdsLkxJTktfU1RBVFVTKSkge1xuICAgICAgdGhpcy5nbC51c2VQcm9ncmFtKHByb2dyYW1zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCBMaW5rIFByb2dyYW0nLCB0aGlzLmdsLmdldFByb2dyYW1JbmZvTG9nKHByb2dyYW1zKSk7XG4gICAgfVxuXG4gICAgLy8g55Sf5oiQ44GX44Gf44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OI44KS5oi744KK5YCk44Go44GX44Gm6L+U44GZXG4gICAgcmV0dXJuIHByb2dyYW1zO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2FtcGxlMztcbiIsIiAgLypcbiAqIFNhbXBsZSA0XG4gKiDmi6HmlaPlhYnlrp/oo4VcbiAqL1xuXG5pbXBvcnQge21hdElWLCBxdG5JViwgdG9ydXMsIGN1YmUsIGhzdmEgLHNwaGVyZX0gZnJvbSBcIi4vbWluTWF0cml4XCI7XG5cbmNsYXNzIFNhbXBsZTQge1xuICAvKipcbiAgICogY29uc3RydWN0b3JcbiAgICog44Kz44Oz44K544OI44Op44Kv44K/XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICAvL2NhbnZhc+OBuOOBruWPguS4iuOCkuWkieaVsOOBq+WPluW+l+OBmeOCi1xuICAgIGxldCBjID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpO1xuICAgIC8vIHNpemXmjIflrppcbiAgICBjLndpZHRoID0gNTEyO1xuICAgIGMuaGVpZ2h0ID0gNTEyO1xuICAgIHRoaXMuY2FudmFzID0gYztcblxuICAgIC8vV2ViR0zjgrPjg7Pjg4bjgq3jgrnjg4jjgpJjYW52YXPjgYvjgonlj5blvpfjgZnjgotcbiAgICB0aGlzLmdsID0gYy5nZXRDb250ZXh0KCd3ZWJnbCcpIHx8IGMuZ2V0Q29udGV4dCgnZXhwZXJpbWVudGFsLXdlYmdsJyk7XG5cbiAgICAvLyDooYzliJfoqIjnrpdcbiAgICB0aGlzLm1hdCA9IG51bGw7XG4gICAgLy8g44Os44Oz44OA44Oq44Oz44Kw55So44Kr44Km44Oz44K/XG4gICAgdGhpcy5jb3VudCA9IDA7XG4gIH1cblxuICAvKipcbiAgICogcnVuXG4gICAqIOOCteODs+ODl+ODq+OCs+ODvOODieWun+ihjFxuICAgKi9cbiAgcnVuKCkge1xuICAgIGNvbnNvbGUubG9nKCdTdGFydCBTYW1wbGU0Jyk7XG5cbiAgICAvLyBXZWJHTOOCs+ODs+ODhuOCreOCueODiOOBruWPluW+l+OBjOOBp+OBjeOBn+OBi+OBqeOBhuOBi1xuICAgIGlmICh0aGlzLmdsKSB7XG4gICAgICBjb25zb2xlLmxvZygnc3VwcG9ydHMgd2ViZ2wnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ3dlYmdsIG5vdCBzdXBwb3J0ZWQnKTtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIOOCr+ODquOCouOBmeOCi+iJsuOCkuaMh+WumlxuICAgIHRoaXMuZ2wuY2xlYXJDb2xvcigwLjMsIDAuMywgMC4zLCAxLjApO1xuXG4gICAgLy8g44Ko44Os44Oh44Oz44OI44KS44Kv44Oq44KiXG4gICAgdGhpcy5nbC5jbGVhcih0aGlzLmdsLkNPTE9SX0JVRkZFUl9CSVQpO1xuXG4gICAgLy8g44K344Kn44O844OA44Go44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OIXG4gICAgY29uc3QgdmVydGV4U291cmNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZzJykudGV4dENvbnRlbnQ7XG4gICAgY29uc3QgZnJhZ21lbnRTb3VyY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZnMnKS50ZXh0Q29udGVudDtcblxuICAgIC8vIOODpuODvOOCtuODvOWumue+qeOBruODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiOeUn+aIkOmWouaVsFxuICAgIHRoaXMucHJvZ3JhbXMgPSB0aGlzLmNyZWF0ZVNoYWRlclByb2dyYW0odmVydGV4U291cmNlLCBmcmFnbWVudFNvdXJjZSk7XG5cbiAgICAvLyB1bmlmb3Jt44Ot44Kx44O844K344On44Oz44KS5Y+W5b6X44GX44Gm44GK44GPXG4gICAgdGhpcy51bmlMb2NhdGlvbiA9IHt9O1xuICAgIHRoaXMudW5pTG9jYXRpb24ubXZwTWF0cml4ID0gdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5wcm9ncmFtcywgJ212cE1hdHJpeCcpO1xuICAgIHRoaXMudW5pTG9jYXRpb24uaW52TWF0cml4ID0gdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5wcm9ncmFtcywgJ2ludk1hdHJpeCcpO1xuICAgIHRoaXMudW5pTG9jYXRpb24ubGlnaHREaXJlY3Rpb24gPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLnByb2dyYW1zLCAnbGlnaHREaXJlY3Rpb24nKTtcblxuICAgIC8vIOeQg+S9k+OCkuW9ouaIkOOBmeOCi+mggueCueOBruODh+ODvOOCv+OCkuWPl+OBkeWPluOCi1xuICAgIHRoaXMuc3BoZXJlRGF0YSA9IHNwaGVyZSgxNiwgMTYsIDEuMCk7XG5cbiAgICAvLyDpoILngrnjg4fjg7zjgr/jgYvjgonjg5Djg4Pjg5XjgqHjgpLnlJ/miJDjgZfjgabnmbvpjLLjgZnjgovvvIjpoILngrnluqfmqJnvvIlcbiAgICBsZXQgdlBvc2l0aW9uQnVmZmVyID0gdGhpcy5nbC5jcmVhdGVCdWZmZXIoKTtcbiAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIHZQb3NpdGlvbkJ1ZmZlcik7XG4gICAgdGhpcy5nbC5idWZmZXJEYXRhKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCBuZXcgRmxvYXQzMkFycmF5KHRoaXMuc3BoZXJlRGF0YS5wKSwgdGhpcy5nbC5TVEFUSUNfRFJBVyk7XG4gICAgbGV0IGF0dExvY1Bvc2l0aW9uID0gdGhpcy5nbC5nZXRBdHRyaWJMb2NhdGlvbih0aGlzLnByb2dyYW1zLCAncG9zaXRpb24nKTtcbiAgICB0aGlzLmdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGF0dExvY1Bvc2l0aW9uKTtcbiAgICB0aGlzLmdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYXR0TG9jUG9zaXRpb24sIDMsIHRoaXMuZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcblxuICAgIC8vIOmggueCueODh+ODvOOCv+OBi+OCieODkOODg+ODleOCoeOCkueUn+aIkOOBl+OBpueZu+mMsuOBmeOCi++8iOmggueCueazlee3mu+8iVxuICAgIGxldCB2Tm9ybWFsQnVmZmVyID0gdGhpcy5nbC5jcmVhdGVCdWZmZXIoKTtcbiAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIHZOb3JtYWxCdWZmZXIpO1xuICAgIHRoaXMuZ2wuYnVmZmVyRGF0YSh0aGlzLmdsLkFSUkFZX0JVRkZFUiwgbmV3IEZsb2F0MzJBcnJheSh0aGlzLnNwaGVyZURhdGEubiksIHRoaXMuZ2wuU1RBVElDX0RSQVcpO1xuICAgIGxldCBhdHRMb2NOb3JtYWwgPSB0aGlzLmdsLmdldEF0dHJpYkxvY2F0aW9uKHRoaXMucHJvZ3JhbXMsICdub3JtYWwnKTtcbiAgICB0aGlzLmdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGF0dExvY05vcm1hbCk7XG4gICAgdGhpcy5nbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dExvY05vcm1hbCwgMywgdGhpcy5nbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xuXG4gICAgLy8g6aCC54K544OH44O844K/44GL44KJ44OQ44OD44OV44Kh44KS55Sf5oiQ44GX44Gm55m76Yyy44GZ44KL77yI6aCC54K56Imy77yJXG4gICAgbGV0IHZDb2xvckJ1ZmZlciA9IHRoaXMuZ2wuY3JlYXRlQnVmZmVyKCk7XG4gICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCB2Q29sb3JCdWZmZXIpO1xuICAgIHRoaXMuZ2wuYnVmZmVyRGF0YSh0aGlzLmdsLkFSUkFZX0JVRkZFUiwgbmV3IEZsb2F0MzJBcnJheSh0aGlzLnNwaGVyZURhdGEuYyksIHRoaXMuZ2wuU1RBVElDX0RSQVcpO1xuICAgIGxldCBhdHRMb2NDb2xvciA9IHRoaXMuZ2wuZ2V0QXR0cmliTG9jYXRpb24odGhpcy5wcm9ncmFtcywgJ2NvbG9yJyk7XG4gICAgdGhpcy5nbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShhdHRMb2NDb2xvcik7XG4gICAgdGhpcy5nbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dExvY0NvbG9yLCA0LCB0aGlzLmdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XG5cbiAgICAvLyDjgqTjg7Pjg4fjg4Pjgq/jgrnjg5Djg4Pjg5XjgqHjga7nlJ/miJBcbiAgICBsZXQgaW5kZXhCdWZmZXIgPSB0aGlzLmdsLmNyZWF0ZUJ1ZmZlcigpO1xuICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBpbmRleEJ1ZmZlcik7XG4gICAgdGhpcy5nbC5idWZmZXJEYXRhKHRoaXMuZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIG5ldyBJbnQxNkFycmF5KHRoaXMuc3BoZXJlRGF0YS5pKSwgdGhpcy5nbC5TVEFUSUNfRFJBVyk7XG5cbiAgICAvLyDooYzliJfjga7liJ3mnJ/ljJZcbiAgICB0aGlzLm1hdCA9IG5ldyBtYXRJVigpO1xuICAgIHRoaXMubU1hdHJpeCA9IHRoaXMubWF0LmlkZW50aXR5KHRoaXMubWF0LmNyZWF0ZSgpKTtcbiAgICB0aGlzLnZNYXRyaXggPSB0aGlzLm1hdC5pZGVudGl0eSh0aGlzLm1hdC5jcmVhdGUoKSk7XG4gICAgdGhpcy5wTWF0cml4ID0gdGhpcy5tYXQuaWRlbnRpdHkodGhpcy5tYXQuY3JlYXRlKCkpO1xuICAgIHRoaXMudnBNYXRyaXggPSB0aGlzLm1hdC5pZGVudGl0eSh0aGlzLm1hdC5jcmVhdGUoKSk7XG4gICAgdGhpcy5tdnBNYXRyaXggPSB0aGlzLm1hdC5pZGVudGl0eSh0aGlzLm1hdC5jcmVhdGUoKSk7XG4gICAgdGhpcy5pbnZNYXRyaXggPSB0aGlzLm1hdC5pZGVudGl0eSh0aGlzLm1hdC5jcmVhdGUoKSk7XG5cbiAgICAvLyDjg5Pjg6Xjg7zluqfmqJnlpInmj5vooYzliJdcbiAgICBsZXQgY2FtZXJhUG9zaXRpb24gPSBbMC4wLCAwLjAsIDMuMF07IC8vIOOCq+ODoeODqeOBruS9jee9rlxuICAgIGxldCBjZW50ZXJQb2ludCA9IFswLjAsIDAuMCwgMC4wXTsgICAgLy8g5rOo6KaW54K5XG4gICAgbGV0IGNhbWVyYVVwID0gWzAuMCwgMS4wLCAwLjBdOyAgICAgICAvLyDjgqvjg6Hjg6njga7kuIrmlrnlkJFcbiAgICB0aGlzLm1hdC5sb29rQXQoY2FtZXJhUG9zaXRpb24sIGNlbnRlclBvaW50LCBjYW1lcmFVcCwgdGhpcy52TWF0cml4KTtcblxuICAgIC8vIOODl+ODreOCuOOCp+OCr+OCt+ODp+ODs+OBruOBn+OCgeOBruaDheWgseOCkuaPg+OBiOOCi1xuICAgIGxldCBmb3Z5ID0gNDU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDoppbph47op5JcbiAgICBsZXQgYXNwZWN0ID0gdGhpcy5jYW52YXMud2lkdGggLyB0aGlzLmNhbnZhcy5oZWlnaHQ7IC8vIOOCouOCueODmuOCr+ODiOavlFxuICAgIGxldCBuZWFyID0gMC4xOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDnqbrplpPjga7mnIDliY3pnaJcbiAgICBsZXQgZmFyID0gMTAuMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g56m66ZaT44Gu5aWl6KGM44GN57WC56uvXG4gICAgdGhpcy5tYXQucGVyc3BlY3RpdmUoZm92eSwgYXNwZWN0LCBuZWFyLCBmYXIsIHRoaXMucE1hdHJpeCk7XG5cbiAgICAvLyDooYzliJfjgpLmjpvjgZHlkIjjgo/jgZvjgaZWUOODnuODiOODquODg+OCr+OCueOCkueUn+aIkOOBl+OBpuOBiuOBj1xuICAgIHRoaXMubWF0Lm11bHRpcGx5KHRoaXMucE1hdHJpeCwgdGhpcy52TWF0cml4LCB0aGlzLnZwTWF0cml4KTsgICAvLyBw44GrduOCkuaOm+OBkeOCi1xuXG4gICAgLy8g6Kit5a6a44KS5pyJ5Yq55YyW44GZ44KLXG4gICAgdGhpcy5nbC5lbmFibGUodGhpcy5nbC5ERVBUSF9URVNUKTtcbiAgICB0aGlzLmdsLmRlcHRoRnVuYyh0aGlzLmdsLkxFUVVBTCk7XG5cbiAgICAvLyDlubPooYzlhYnmupDjga7lkJHjgY1cbiAgICB0aGlzLmxpZ2h0RGlyZWN0aW9uID0gWzEuMCwgMS4wLCAxLjBdO1xuXG4gICAgLy8gcmVuZGVyaW5n6ZaL5aeLXG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDjg6zjg7Pjg4Djg6rjg7PjgrDplqLmlbDjga7lrprnvqlcbiAgICovXG4gIHJlbmRlcigpIHtcblxuICAgIC8vIENhbnZhc+OCqOODrOODoeODs+ODiOOCkuOCr+ODquOCouOBmeOCi1xuICAgIHRoaXMuZ2wuY2xlYXIodGhpcy5nbC5DT0xPUl9CVUZGRVJfQklUIHwgdGhpcy5nbC5ERVBUSF9CVUZGRVJfQklUKTtcblxuICAgIC8vIOODouODh+ODq+W6p+aomeWkieaPm+ihjOWIl+OCkuS4gOW6puWIneacn+WMluOBl+OBpuODquOCu+ODg+ODiOOBmeOCi1xuICAgIHRoaXMubWF0LmlkZW50aXR5KHRoaXMubU1hdHJpeCk7XG5cbiAgICAvLyDjgqvjgqbjg7Pjgr/jgpLjgqTjg7Pjgq/jg6rjg6Hjg7Pjg4jjgZnjgotcbiAgICB0aGlzLmNvdW50Kys7XG5cbiAgICAvLyDjg6Ljg4fjg6vluqfmqJnlpInmj5vooYzliJfjgpLkuIDluqbliJ3mnJ/ljJbjgZfjgabjg6rjgrvjg4Pjg4jjgZnjgotcbiAgICB0aGlzLm1hdC5pZGVudGl0eSh0aGlzLm1NYXRyaXgpO1xuXG4gICAgLy8g44Oi44OH44Or5bqn5qiZ5aSJ5o+b6KGM5YiXXG4gICAgbGV0IGF4aXMgPSBbMC4wLCAxLjAsIDEuMF07XG4gICAgbGV0IHJhZGlhbnMgPSAodGhpcy5jb3VudCAlIDM2MCkgKiBNYXRoLlBJIC8gMTgwO1xuICAgIHRoaXMubWF0LnJvdGF0ZSh0aGlzLm1NYXRyaXgsIHJhZGlhbnMsIGF4aXMsIHRoaXMubU1hdHJpeCk7XG5cbiAgICAvLyDooYzliJfjgpLmjpvjgZHlkIjjgo/jgZvjgaZNVlDjg57jg4jjg6rjg4Pjgq/jgrnjgpLnlJ/miJBcbiAgICB0aGlzLm1hdC5tdWx0aXBseSh0aGlzLnZwTWF0cml4LCB0aGlzLm1NYXRyaXgsIHRoaXMubXZwTWF0cml4KTsgLy8g44GV44KJ44GrbeOCkuaOm+OBkeOCi1xuXG4gICAgLy8g6YCG6KGM5YiX44KS55Sf5oiQXG4gICAgdGhpcy5tYXQuaW52ZXJzZSh0aGlzLm1NYXRyaXgsIHRoaXMuaW52TWF0cml4KTtcblxuICAgIC8vIOOCt+OCp+ODvOODgOOBq+axjueUqOODh+ODvOOCv+OCkumAgeS/oeOBmeOCi1xuICAgIHRoaXMuZ2wudW5pZm9ybU1hdHJpeDRmdih0aGlzLnVuaUxvY2F0aW9uLm12cE1hdHJpeCwgZmFsc2UsIHRoaXMubXZwTWF0cml4KTtcbiAgICB0aGlzLmdsLnVuaWZvcm1NYXRyaXg0ZnYodGhpcy51bmlMb2NhdGlvbi5pbnZNYXRyaXgsIGZhbHNlLCB0aGlzLmludk1hdHJpeCk7XG4gICAgdGhpcy5nbC51bmlmb3JtM2Z2KHRoaXMudW5pTG9jYXRpb24ubGlnaHREaXJlY3Rpb24sIHRoaXMubGlnaHREaXJlY3Rpb24pO1xuXG4gICAgLy8g44Kk44Oz44OH44OD44Kv44K544OQ44OD44OV44Kh44Gr44KI44KL5o+P55S7XG4gICAgdGhpcy5nbC5kcmF3RWxlbWVudHModGhpcy5nbC5UUklBTkdMRVMsIHRoaXMuc3BoZXJlRGF0YS5pLmxlbmd0aCwgdGhpcy5nbC5VTlNJR05FRF9TSE9SVCwgMCk7XG4gICAgdGhpcy5nbC5mbHVzaCgpO1xuXG4gICAgLy8g5YaN5biw5ZG844Gz5Ye644GXXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpPT4ge1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjcmVhdGVTaGFkZXJQcm9ncmFtXG4gICAqIOODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiOeUn+aIkOmWouaVsFxuICAgKi9cbiAgY3JlYXRlU2hhZGVyUHJvZ3JhbSh2ZXJ0ZXhTb3VyY2UsIGZyYWdtZW50U291cmNlKSB7XG5cbiAgICAvLyDjgrfjgqfjg7zjg4Djgqrjg5bjgrjjgqfjgq/jg4jjga7nlJ/miJBcbiAgICBsZXQgdmVydGV4U2hhZGVyID0gdGhpcy5nbC5jcmVhdGVTaGFkZXIodGhpcy5nbC5WRVJURVhfU0hBREVSKTtcbiAgICBsZXQgZnJhZ21lbnRTaGFkZXIgPSB0aGlzLmdsLmNyZWF0ZVNoYWRlcih0aGlzLmdsLkZSQUdNRU5UX1NIQURFUik7XG5cbiAgICAvLyDjgrfjgqfjg7zjg4Djgavjgr3jg7zjgrnjgpLlibLjgorlvZPjgabjgabjgrPjg7Pjg5HjgqTjg6tcbiAgICB0aGlzLmdsLnNoYWRlclNvdXJjZSh2ZXJ0ZXhTaGFkZXIsIHZlcnRleFNvdXJjZSk7XG4gICAgdGhpcy5nbC5jb21waWxlU2hhZGVyKHZlcnRleFNoYWRlcik7XG4gICAgdGhpcy5nbC5zaGFkZXJTb3VyY2UoZnJhZ21lbnRTaGFkZXIsIGZyYWdtZW50U291cmNlKTtcbiAgICB0aGlzLmdsLmNvbXBpbGVTaGFkZXIoZnJhZ21lbnRTaGFkZXIpO1xuXG4gICAgLy8g44K344Kn44O844OA44O844Kz44Oz44OR44Kk44Or44Gu44Ko44Op44O85Yik5a6aXG4gICAgaWYgKHRoaXMuZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHZlcnRleFNoYWRlciwgdGhpcy5nbC5DT01QSUxFX1NUQVRVUylcbiAgICAgICYmIHRoaXMuZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKGZyYWdtZW50U2hhZGVyLCB0aGlzLmdsLkNPTVBJTEVfU1RBVFVTKSkge1xuICAgICAgY29uc29sZS5sb2coJ1N1Y2Nlc3MgU2hhZGVyIENvbXBpbGUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ0ZhaWxkIFNoYWRlciBDb21waWxlJyk7XG4gICAgICBjb25zb2xlLmxvZygndmVydGV4U2hhZGVyJywgdGhpcy5nbC5nZXRTaGFkZXJJbmZvTG9nKHZlcnRleFNoYWRlcikpO1xuICAgICAgY29uc29sZS5sb2coJ2ZyYWdtZW50U2hhZGVyJywgdGhpcy5nbC5nZXRTaGFkZXJJbmZvTG9nKGZyYWdtZW50U2hhZGVyKSk7XG4gICAgfVxuXG4gICAgLy8g44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OI44Gu55Sf5oiQ44GL44KJ6YG45oqe44G+44GnXG4gICAgY29uc3QgcHJvZ3JhbXMgPSB0aGlzLmdsLmNyZWF0ZVByb2dyYW0oKTtcblxuICAgIHRoaXMuZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW1zLCB2ZXJ0ZXhTaGFkZXIpO1xuICAgIHRoaXMuZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW1zLCBmcmFnbWVudFNoYWRlcik7XG4gICAgdGhpcy5nbC5saW5rUHJvZ3JhbShwcm9ncmFtcyk7XG5cbiAgICAvLyDjg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4jjga7jgqjjg6njg7zliKTlrprlh6bnkIZcbiAgICBpZiAodGhpcy5nbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHByb2dyYW1zLCB0aGlzLmdsLkxJTktfU1RBVFVTKSkge1xuICAgICAgdGhpcy5nbC51c2VQcm9ncmFtKHByb2dyYW1zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCBMaW5rIFByb2dyYW0nLCB0aGlzLmdsLmdldFByb2dyYW1JbmZvTG9nKHByb2dyYW1zKSk7XG4gICAgfVxuXG4gICAgLy8g55Sf5oiQ44GX44Gf44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OI44KS5oi744KK5YCk44Go44GX44Gm6L+U44GZXG4gICAgcmV0dXJuIHByb2dyYW1zO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2FtcGxlNDtcbiIsIiAgLypcbiAqIFNhbXBsZSA1XG4gKiDlj43lsITlhYnlrp/oo4VcbiAqL1xuXG5pbXBvcnQge21hdElWLCBxdG5JViwgdG9ydXMsIGN1YmUsIGhzdmEgLHNwaGVyZX0gZnJvbSBcIi4vbWluTWF0cml4XCI7XG5cbmNsYXNzIFNhbXBsZTUge1xuICAvKipcbiAgICogY29uc3RydWN0b3JcbiAgICog44Kz44Oz44K544OI44Op44Kv44K/XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIC8vY2FudmFz44G444Gu5Y+C5LiK44KS5aSJ5pWw44Gr5Y+W5b6X44GZ44KLXG4gICAgbGV0IGMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJyk7XG4gICAgLy8gc2l6ZeaMh+WumlxuICAgIGMud2lkdGggPSA1MTI7XG4gICAgYy5oZWlnaHQgPSA1MTI7XG4gICAgdGhpcy5jYW52YXMgPSBjO1xuXG4gICAgLy9XZWJHTOOCs+ODs+ODhuOCreOCueODiOOCkmNhbnZhc+OBi+OCieWPluW+l+OBmeOCi1xuICAgIHRoaXMuZ2wgPSBjLmdldENvbnRleHQoJ3dlYmdsJykgfHwgYy5nZXRDb250ZXh0KCdleHBlcmltZW50YWwtd2ViZ2wnKTtcblxuICAgIC8vIOihjOWIl+ioiOeul1xuICAgIHRoaXMubWF0ID0gbnVsbDtcbiAgICAvLyDjg6zjg7Pjg4Djg6rjg7PjgrDnlKjjgqvjgqbjg7Pjgr9cbiAgICB0aGlzLmNvdW50ID0gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBydW5cbiAgICog44K144Oz44OX44Or44Kz44O844OJ5a6f6KGMXG4gICAqL1xuICBydW4oKSB7XG4gICAgY29uc29sZS5sb2coJ1N0YXJ0IFNhbXBsZTUnKTtcblxuICAgIC8vIFdlYkdM44Kz44Oz44OG44Kt44K544OI44Gu5Y+W5b6X44GM44Gn44GN44Gf44GL44Gp44GG44GLXG4gICAgaWYgKHRoaXMuZ2wpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdzdXBwb3J0cyB3ZWJnbCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygnd2ViZ2wgbm90IHN1cHBvcnRlZCcpO1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8g44Kv44Oq44Ki44GZ44KL6Imy44KS5oyH5a6aXG4gICAgdGhpcy5nbC5jbGVhckNvbG9yKDAuMywgMC4zLCAwLjMsIDEuMCk7XG5cbiAgICB0aGlzLmdsLmNsZWFyRGVwdGgoMS4wKTtcblxuICAgIC8vIOOCqOODrOODoeODs+ODiOOCkuOCr+ODquOColxuICAgIHRoaXMuZ2wuY2xlYXIodGhpcy5nbC5DT0xPUl9CVUZGRVJfQklUKTtcblxuICAgIC8vIOOCt+OCp+ODvOODgOOBqOODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiFxuICAgIGNvbnN0IHZlcnRleFNvdXJjZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2cycpLnRleHRDb250ZW50O1xuICAgIGNvbnN0IGZyYWdtZW50U291cmNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZzJykudGV4dENvbnRlbnQ7XG5cbiAgICAvLyDjg6bjg7zjgrbjg7zlrprnvqnjga7jg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4jnlJ/miJDplqLmlbBcbiAgICB0aGlzLnByb2dyYW1zID0gdGhpcy5jcmVhdGVTaGFkZXJQcm9ncmFtKHZlcnRleFNvdXJjZSwgZnJhZ21lbnRTb3VyY2UpO1xuXG4gICAgLy8gdW5pZm9ybeODreOCseODvOOCt+ODp+ODs+OCkuWPluW+l+OBl+OBpuOBiuOBj1xuICAgIHRoaXMudW5pTG9jYXRpb24gPSB7fTtcbiAgICB0aGlzLnVuaUxvY2F0aW9uLm12cE1hdHJpeCA9IHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMucHJvZ3JhbXMsICdtdnBNYXRyaXgnKTtcbiAgICB0aGlzLnVuaUxvY2F0aW9uLmludk1hdHJpeCA9IHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMucHJvZ3JhbXMsICdpbnZNYXRyaXgnKTtcbiAgICB0aGlzLnVuaUxvY2F0aW9uLmxpZ2h0RGlyZWN0aW9uID0gdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5wcm9ncmFtcywgJ2xpZ2h0RGlyZWN0aW9uJyk7XG4gICAgLy8g5Y+N5bCE5YWJ55So44Gr44Kr44Oh44Op44Go5rOo6KaW54K544KS6L+95YqgXG4gICAgdGhpcy51bmlMb2NhdGlvbi5leWVQb3NpdGlvbiA9IHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMucHJvZ3JhbXMsICdleWVQb3NpdGlvbicpO1xuICAgIHRoaXMudW5pTG9jYXRpb24uY2VudGVyUG9pbnQgPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLnByb2dyYW1zLCAnY2VudGVyUG9pbnQnKTtcblxuICAgIC8vIOeQg+S9k+OCkuW9ouaIkOOBmeOCi+mggueCueOBruODh+ODvOOCv+OCkuWPl+OBkeWPluOCi1xuICAgIHRoaXMuc3BoZXJlRGF0YSA9IHNwaGVyZSg2NCwgNjQsIDEuMCk7XG5cbiAgICAvLyDpoILngrnjg4fjg7zjgr/jgYvjgonjg5Djg4Pjg5XjgqHjgpLnlJ/miJDjgZfjgabnmbvpjLLjgZnjgovvvIjpoILngrnluqfmqJnvvIlcbiAgICBsZXQgdlBvc2l0aW9uQnVmZmVyID0gdGhpcy5nbC5jcmVhdGVCdWZmZXIoKTtcbiAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIHZQb3NpdGlvbkJ1ZmZlcik7XG4gICAgdGhpcy5nbC5idWZmZXJEYXRhKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCBuZXcgRmxvYXQzMkFycmF5KHRoaXMuc3BoZXJlRGF0YS5wKSwgdGhpcy5nbC5TVEFUSUNfRFJBVyk7XG4gICAgbGV0IGF0dExvY1Bvc2l0aW9uID0gdGhpcy5nbC5nZXRBdHRyaWJMb2NhdGlvbih0aGlzLnByb2dyYW1zLCAncG9zaXRpb24nKTtcbiAgICB0aGlzLmdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGF0dExvY1Bvc2l0aW9uKTtcbiAgICB0aGlzLmdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYXR0TG9jUG9zaXRpb24sIDMsIHRoaXMuZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcblxuICAgIC8vIOmggueCueODh+ODvOOCv+OBi+OCieODkOODg+ODleOCoeOCkueUn+aIkOOBl+OBpueZu+mMsuOBmeOCi++8iOmggueCueazlee3mu+8iVxuICAgIGxldCB2Tm9ybWFsQnVmZmVyID0gdGhpcy5nbC5jcmVhdGVCdWZmZXIoKTtcbiAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIHZOb3JtYWxCdWZmZXIpO1xuICAgIHRoaXMuZ2wuYnVmZmVyRGF0YSh0aGlzLmdsLkFSUkFZX0JVRkZFUiwgbmV3IEZsb2F0MzJBcnJheSh0aGlzLnNwaGVyZURhdGEubiksIHRoaXMuZ2wuU1RBVElDX0RSQVcpO1xuICAgIGxldCBhdHRMb2NOb3JtYWwgPSB0aGlzLmdsLmdldEF0dHJpYkxvY2F0aW9uKHRoaXMucHJvZ3JhbXMsICdub3JtYWwnKTtcbiAgICB0aGlzLmdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGF0dExvY05vcm1hbCk7XG4gICAgdGhpcy5nbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dExvY05vcm1hbCwgMywgdGhpcy5nbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xuXG4gICAgLy8g6aCC54K544OH44O844K/44GL44KJ44OQ44OD44OV44Kh44KS55Sf5oiQ44GX44Gm55m76Yyy44GZ44KL77yI6aCC54K56Imy77yJXG4gICAgbGV0IHZDb2xvckJ1ZmZlciA9IHRoaXMuZ2wuY3JlYXRlQnVmZmVyKCk7XG4gICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCB2Q29sb3JCdWZmZXIpO1xuICAgIHRoaXMuZ2wuYnVmZmVyRGF0YSh0aGlzLmdsLkFSUkFZX0JVRkZFUiwgbmV3IEZsb2F0MzJBcnJheSh0aGlzLnNwaGVyZURhdGEuYyksIHRoaXMuZ2wuU1RBVElDX0RSQVcpO1xuICAgIGxldCBhdHRMb2NDb2xvciA9IHRoaXMuZ2wuZ2V0QXR0cmliTG9jYXRpb24odGhpcy5wcm9ncmFtcywgJ2NvbG9yJyk7XG4gICAgdGhpcy5nbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShhdHRMb2NDb2xvcik7XG4gICAgdGhpcy5nbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dExvY0NvbG9yLCA0LCB0aGlzLmdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XG5cbiAgICAvLyDjgqTjg7Pjg4fjg4Pjgq/jgrnjg5Djg4Pjg5XjgqHjga7nlJ/miJBcbiAgICBsZXQgaW5kZXhCdWZmZXIgPSB0aGlzLmdsLmNyZWF0ZUJ1ZmZlcigpO1xuICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBpbmRleEJ1ZmZlcik7XG4gICAgdGhpcy5nbC5idWZmZXJEYXRhKHRoaXMuZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIG5ldyBJbnQxNkFycmF5KHRoaXMuc3BoZXJlRGF0YS5pKSwgdGhpcy5nbC5TVEFUSUNfRFJBVyk7XG5cbiAgICAvLyDooYzliJfjga7liJ3mnJ/ljJZcbiAgICB0aGlzLm1hdCA9IG5ldyBtYXRJVigpO1xuICAgIHRoaXMubU1hdHJpeCA9IHRoaXMubWF0LmlkZW50aXR5KHRoaXMubWF0LmNyZWF0ZSgpKTtcbiAgICB0aGlzLnZNYXRyaXggPSB0aGlzLm1hdC5pZGVudGl0eSh0aGlzLm1hdC5jcmVhdGUoKSk7XG4gICAgdGhpcy5wTWF0cml4ID0gdGhpcy5tYXQuaWRlbnRpdHkodGhpcy5tYXQuY3JlYXRlKCkpO1xuICAgIHRoaXMudnBNYXRyaXggPSB0aGlzLm1hdC5pZGVudGl0eSh0aGlzLm1hdC5jcmVhdGUoKSk7XG4gICAgdGhpcy5tdnBNYXRyaXggPSB0aGlzLm1hdC5pZGVudGl0eSh0aGlzLm1hdC5jcmVhdGUoKSk7XG4gICAgdGhpcy5pbnZNYXRyaXggPSB0aGlzLm1hdC5pZGVudGl0eSh0aGlzLm1hdC5jcmVhdGUoKSk7XG5cbiAgICAvLyDjg5Pjg6Xjg7zluqfmqJnlpInmj5vooYzliJdcbiAgICBsZXQgY2FtZXJhUG9zaXRpb24gPSBbMC4wLCAwLjAsIDUuMF07IC8vIOOCq+ODoeODqeOBruS9jee9rlxuICAgIGxldCBjZW50ZXJQb2ludCA9IFswLjAsIDAuMCwgMC4wXTsgICAgLy8g5rOo6KaW54K5XG4gICAgbGV0IGNhbWVyYVVwID0gWzAuMCwgMS4wLCAwLjBdOyAgICAgICAvLyDjgqvjg6Hjg6njga7kuIrmlrnlkJFcbiAgICB0aGlzLm1hdC5sb29rQXQoY2FtZXJhUG9zaXRpb24sIGNlbnRlclBvaW50LCBjYW1lcmFVcCwgdGhpcy52TWF0cml4KTtcblxuICAgIC8vIOODl+ODreOCuOOCp+OCr+OCt+ODp+ODs+OBruOBn+OCgeOBruaDheWgseOCkuaPg+OBiOOCi1xuICAgIGxldCBmb3Z5ID0gNDU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDoppbph47op5JcbiAgICBsZXQgYXNwZWN0ID0gdGhpcy5jYW52YXMud2lkdGggLyB0aGlzLmNhbnZhcy5oZWlnaHQ7IC8vIOOCouOCueODmuOCr+ODiOavlFxuICAgIGxldCBuZWFyID0gMC4xOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDnqbrplpPjga7mnIDliY3pnaJcbiAgICBsZXQgZmFyID0gMTAuMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g56m66ZaT44Gu5aWl6KGM44GN57WC56uvXG4gICAgdGhpcy5tYXQucGVyc3BlY3RpdmUoZm92eSwgYXNwZWN0LCBuZWFyLCBmYXIsIHRoaXMucE1hdHJpeCk7XG5cbiAgICAvLyDooYzliJfjgpLmjpvjgZHlkIjjgo/jgZvjgaZWUOODnuODiOODquODg+OCr+OCueOCkueUn+aIkOOBl+OBpuOBiuOBj1xuICAgIHRoaXMubWF0Lm11bHRpcGx5KHRoaXMucE1hdHJpeCwgdGhpcy52TWF0cml4LCB0aGlzLnZwTWF0cml4KTsgICAvLyBw44GrduOCkuaOm+OBkeOCi1xuXG4gICAgLy8g5bmz6KGM5YWJ5rqQ44Gu5ZCR44GNXG4gICAgdGhpcy5saWdodERpcmVjdGlvbiA9IFsxLjAsIDEuMCwgMS4wXTtcblxuICAgIC8vIOioreWumuOCkuacieWKueWMluOBmeOCi1xuICAgIHRoaXMuZ2wuZW5hYmxlKHRoaXMuZ2wuREVQVEhfVEVTVCk7XG4gICAgdGhpcy5nbC5kZXB0aEZ1bmModGhpcy5nbC5MRVFVQUwpO1xuXG4gICAgLy8gcmVuZGVyaW5n6ZaL5aeLXG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDjg6zjg7Pjg4Djg6rjg7PjgrDplqLmlbDjga7lrprnvqlcbiAgICovXG4gIHJlbmRlcigpIHtcblxuICAgIC8vIENhbnZhc+OCqOODrOODoeODs+ODiOOCkuOCr+ODquOCouOBmeOCi1xuICAgIHRoaXMuZ2wuY2xlYXIodGhpcy5nbC5DT0xPUl9CVUZGRVJfQklUIHwgdGhpcy5nbC5ERVBUSF9CVUZGRVJfQklUKTtcblxuICAgIC8vIOODouODh+ODq+W6p+aomeWkieaPm+ihjOWIl+OCkuS4gOW6puWIneacn+WMluOBl+OBpuODquOCu+ODg+ODiOOBmeOCi1xuICAgIHRoaXMubWF0LmlkZW50aXR5KHRoaXMubU1hdHJpeCk7XG5cbiAgICAvLyDjgqvjgqbjg7Pjgr/jgpLjgqTjg7Pjgq/jg6rjg6Hjg7Pjg4jjgZnjgotcbiAgICB0aGlzLmNvdW50Kys7XG5cbiAgICAvLyDjg6Ljg4fjg6vluqfmqJnlpInmj5vooYzliJfjgpLkuIDluqbliJ3mnJ/ljJbjgZfjgabjg6rjgrvjg4Pjg4jjgZnjgotcbiAgICB0aGlzLm1hdC5pZGVudGl0eSh0aGlzLm1NYXRyaXgpO1xuXG4gICAgLy8g44Oi44OH44Or5bqn5qiZ5aSJ5o+b6KGM5YiXXG4gICAgbGV0IGF4aXMgPSBbMC4wLCAxLjAsIDAuMF07XG4gICAgbGV0IHJhZGlhbnMgPSAodGhpcy5jb3VudCAlIDM2MCkgKiBNYXRoLlBJIC8gMTgwO1xuICAgIHRoaXMubWF0LnJvdGF0ZSh0aGlzLm1NYXRyaXgsIHJhZGlhbnMsIGF4aXMsIHRoaXMubU1hdHJpeCk7XG5cbiAgICAvLyDooYzliJfjgpLmjpvjgZHlkIjjgo/jgZvjgaZNVlDjg57jg4jjg6rjg4Pjgq/jgrnjgpLnlJ/miJBcbiAgICB0aGlzLm1hdC5tdWx0aXBseSh0aGlzLnZwTWF0cml4LCB0aGlzLm1NYXRyaXgsIHRoaXMubXZwTWF0cml4KTsgLy8g44GV44KJ44GrbeOCkuaOm+OBkeOCi1xuXG4gICAgLy8g6YCG6KGM5YiX44KS55Sf5oiQXG4gICAgdGhpcy5tYXQuaW52ZXJzZSh0aGlzLm1NYXRyaXgsIHRoaXMuaW52TWF0cml4KTtcblxuICAgIC8vIOOCt+OCp+ODvOODgOOBq+axjueUqOODh+ODvOOCv+OCkumAgeS/oeOBmeOCi1xuICAgIHRoaXMuZ2wudW5pZm9ybU1hdHJpeDRmdih0aGlzLnVuaUxvY2F0aW9uLm12cE1hdHJpeCwgZmFsc2UsIHRoaXMubXZwTWF0cml4KTtcbiAgICB0aGlzLmdsLnVuaWZvcm1NYXRyaXg0ZnYodGhpcy51bmlMb2NhdGlvbi5pbnZNYXRyaXgsIGZhbHNlLCB0aGlzLmludk1hdHJpeCk7XG4gICAgdGhpcy5nbC51bmlmb3JtM2Z2KHRoaXMudW5pTG9jYXRpb24ubGlnaHREaXJlY3Rpb24sIHRoaXMubGlnaHREaXJlY3Rpb24pO1xuICAgIHRoaXMuZ2wudW5pZm9ybTNmdih0aGlzLnVuaUxvY2F0aW9uLmV5ZVBvc2l0aW9uLCB0aGlzLmNhbWVyYVBvc2l0aW9uKTtcbiAgICB0aGlzLmdsLnVuaWZvcm0zZnYodGhpcy51bmlMb2NhdGlvbi5jZW50ZXJQb2ludCwgdGhpcy5jZW50ZXJQb2ludCk7XG5cbiAgICAvLyDjgqTjg7Pjg4fjg4Pjgq/jgrnjg5Djg4Pjg5XjgqHjgavjgojjgovmj4/nlLtcbiAgICB0aGlzLmdsLmRyYXdFbGVtZW50cyh0aGlzLmdsLlRSSUFOR0xFUywgdGhpcy5zcGhlcmVEYXRhLmkubGVuZ3RoLCB0aGlzLmdsLlVOU0lHTkVEX1NIT1JULCAwKTtcbiAgICB0aGlzLmdsLmZsdXNoKCk7XG5cbiAgICAvLyDlho3luLDlkbzjgbPlh7rjgZdcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCk9PiB7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIGNyZWF0ZVNoYWRlclByb2dyYW1cbiAgICog44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OI55Sf5oiQ6Zai5pWwXG4gICAqL1xuICBjcmVhdGVTaGFkZXJQcm9ncmFtKHZlcnRleFNvdXJjZSwgZnJhZ21lbnRTb3VyY2UpIHtcblxuICAgIC8vIOOCt+OCp+ODvOODgOOCquODluOCuOOCp+OCr+ODiOOBrueUn+aIkFxuICAgIGxldCB2ZXJ0ZXhTaGFkZXIgPSB0aGlzLmdsLmNyZWF0ZVNoYWRlcih0aGlzLmdsLlZFUlRFWF9TSEFERVIpO1xuICAgIGxldCBmcmFnbWVudFNoYWRlciA9IHRoaXMuZ2wuY3JlYXRlU2hhZGVyKHRoaXMuZ2wuRlJBR01FTlRfU0hBREVSKTtcblxuICAgIC8vIOOCt+OCp+ODvOODgOOBq+OCveODvOOCueOCkuWJsuOCiuW9k+OBpuOBpuOCs+ODs+ODkeOCpOODq1xuICAgIHRoaXMuZ2wuc2hhZGVyU291cmNlKHZlcnRleFNoYWRlciwgdmVydGV4U291cmNlKTtcbiAgICB0aGlzLmdsLmNvbXBpbGVTaGFkZXIodmVydGV4U2hhZGVyKTtcbiAgICB0aGlzLmdsLnNoYWRlclNvdXJjZShmcmFnbWVudFNoYWRlciwgZnJhZ21lbnRTb3VyY2UpO1xuICAgIHRoaXMuZ2wuY29tcGlsZVNoYWRlcihmcmFnbWVudFNoYWRlcik7XG5cbiAgICAvLyDjgrfjgqfjg7zjg4Djg7zjgrPjg7Pjg5HjgqTjg6vjga7jgqjjg6njg7zliKTlrppcbiAgICBpZiAodGhpcy5nbC5nZXRTaGFkZXJQYXJhbWV0ZXIodmVydGV4U2hhZGVyLCB0aGlzLmdsLkNPTVBJTEVfU1RBVFVTKVxuICAgICAgJiYgdGhpcy5nbC5nZXRTaGFkZXJQYXJhbWV0ZXIoZnJhZ21lbnRTaGFkZXIsIHRoaXMuZ2wuQ09NUElMRV9TVEFUVVMpKSB7XG4gICAgICBjb25zb2xlLmxvZygnU3VjY2VzcyBTaGFkZXIgQ29tcGlsZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygnRmFpbGQgU2hhZGVyIENvbXBpbGUnKTtcbiAgICAgIGNvbnNvbGUubG9nKCd2ZXJ0ZXhTaGFkZXInLCB0aGlzLmdsLmdldFNoYWRlckluZm9Mb2codmVydGV4U2hhZGVyKSk7XG4gICAgICBjb25zb2xlLmxvZygnZnJhZ21lbnRTaGFkZXInLCB0aGlzLmdsLmdldFNoYWRlckluZm9Mb2coZnJhZ21lbnRTaGFkZXIpKTtcbiAgICB9XG5cbiAgICAvLyDjg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4jjga7nlJ/miJDjgYvjgonpgbjmip7jgb7jgadcbiAgICBjb25zdCBwcm9ncmFtcyA9IHRoaXMuZ2wuY3JlYXRlUHJvZ3JhbSgpO1xuXG4gICAgdGhpcy5nbC5hdHRhY2hTaGFkZXIocHJvZ3JhbXMsIHZlcnRleFNoYWRlcik7XG4gICAgdGhpcy5nbC5hdHRhY2hTaGFkZXIocHJvZ3JhbXMsIGZyYWdtZW50U2hhZGVyKTtcbiAgICB0aGlzLmdsLmxpbmtQcm9ncmFtKHByb2dyYW1zKTtcblxuICAgIC8vIOODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiOOBruOCqOODqeODvOWIpOWumuWHpueQhlxuICAgIGlmICh0aGlzLmdsLmdldFByb2dyYW1QYXJhbWV0ZXIocHJvZ3JhbXMsIHRoaXMuZ2wuTElOS19TVEFUVVMpKSB7XG4gICAgICB0aGlzLmdsLnVzZVByb2dyYW0ocHJvZ3JhbXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygnRmFpbGVkIExpbmsgUHJvZ3JhbScsIHRoaXMuZ2wuZ2V0UHJvZ3JhbUluZm9Mb2cocHJvZ3JhbXMpKTtcbiAgICB9XG5cbiAgICAvLyDnlJ/miJDjgZfjgZ/jg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4jjgpLmiLvjgorlgKTjgajjgZfjgabov5TjgZlcbiAgICByZXR1cm4gcHJvZ3JhbXM7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTYW1wbGU1O1xuIiwiICAvKlxuICogU2FtcGxlIDZcbiAqIOeSsOWig+WFieWun+ijhVxuICovXG5cbmltcG9ydCB7bWF0SVYsIHF0bklWLCB0b3J1cywgY3ViZSwgaHN2YSAsc3BoZXJlfSBmcm9tIFwiLi9taW5NYXRyaXhcIjtcblxuY2xhc3MgU2FtcGxlNiB7XG4gIC8qKlxuICAgKiBjb25zdHJ1Y3RvclxuICAgKiDjgrPjg7Pjgrnjg4jjg6njgq/jgr9cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgLy9jYW52YXPjgbjjga7lj4LkuIrjgpLlpInmlbDjgavlj5blvpfjgZnjgotcbiAgICBsZXQgYyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKTtcbiAgICAvLyBzaXpl5oyH5a6aXG4gICAgYy53aWR0aCA9IDUxMjtcbiAgICBjLmhlaWdodCA9IDUxMjtcbiAgICB0aGlzLmNhbnZhcyA9IGM7XG5cbiAgICAvL1dlYkdM44Kz44Oz44OG44Kt44K544OI44KSY2FudmFz44GL44KJ5Y+W5b6X44GZ44KLXG4gICAgdGhpcy5nbCA9IGMuZ2V0Q29udGV4dCgnd2ViZ2wnKSB8fCBjLmdldENvbnRleHQoJ2V4cGVyaW1lbnRhbC13ZWJnbCcpO1xuXG4gICAgLy8g6KGM5YiX6KiI566XXG4gICAgdGhpcy5tYXQgPSBudWxsO1xuICAgIC8vIOODrOODs+ODgOODquODs+OCsOeUqOOCq+OCpuODs+OCv1xuICAgIHRoaXMuY291bnQgPSAwO1xuICB9XG5cbiAgLyoqXG4gICAqIHJ1blxuICAgKiDjgrXjg7Pjg5fjg6vjgrPjg7zjg4nlrp/ooYxcbiAgICovXG4gIHJ1bigpIHtcbiAgICBjb25zb2xlLmxvZygnU3RhcnQgU2FtcGxlNScpO1xuXG4gICAgLy8gV2ViR0zjgrPjg7Pjg4bjgq3jgrnjg4jjga7lj5blvpfjgYzjgafjgY3jgZ/jgYvjganjgYbjgYtcbiAgICBpZiAodGhpcy5nbCkge1xuICAgICAgY29uc29sZS5sb2coJ3N1cHBvcnRzIHdlYmdsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCd3ZWJnbCBub3Qgc3VwcG9ydGVkJyk7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyDjgq/jg6rjgqLjgZnjgovoibLjgpLmjIflrppcbiAgICB0aGlzLmdsLmNsZWFyQ29sb3IoMC4zLCAwLjMsIDAuMywgMS4wKTtcblxuICAgIHRoaXMuZ2wuY2xlYXJEZXB0aCgxLjApO1xuXG4gICAgLy8g44Ko44Os44Oh44Oz44OI44KS44Kv44Oq44KiXG4gICAgdGhpcy5nbC5jbGVhcih0aGlzLmdsLkNPTE9SX0JVRkZFUl9CSVQpO1xuXG4gICAgLy8g44K344Kn44O844OA44Go44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OIXG4gICAgY29uc3QgdmVydGV4U291cmNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZzJykudGV4dENvbnRlbnQ7XG4gICAgY29uc3QgZnJhZ21lbnRTb3VyY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZnMnKS50ZXh0Q29udGVudDtcblxuICAgIC8vIOODpuODvOOCtuODvOWumue+qeOBruODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiOeUn+aIkOmWouaVsFxuICAgIHRoaXMucHJvZ3JhbXMgPSB0aGlzLmNyZWF0ZVNoYWRlclByb2dyYW0odmVydGV4U291cmNlLCBmcmFnbWVudFNvdXJjZSk7XG5cbiAgICAvLyB1bmlmb3Jt44Ot44Kx44O844K344On44Oz44KS5Y+W5b6X44GX44Gm44GK44GPXG4gICAgdGhpcy51bmlMb2NhdGlvbiA9IHt9O1xuICAgIHRoaXMudW5pTG9jYXRpb24ubXZwTWF0cml4ID0gdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5wcm9ncmFtcywgJ212cE1hdHJpeCcpO1xuICAgIHRoaXMudW5pTG9jYXRpb24uaW52TWF0cml4ID0gdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5wcm9ncmFtcywgJ2ludk1hdHJpeCcpO1xuICAgIHRoaXMudW5pTG9jYXRpb24ubGlnaHREaXJlY3Rpb24gPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLnByb2dyYW1zLCAnbGlnaHREaXJlY3Rpb24nKTtcbiAgICAvLyDlj43lsITlhYnnlKjjgavjgqvjg6Hjg6njgajms6joppbngrnjgpLov73liqBcbiAgICB0aGlzLnVuaUxvY2F0aW9uLmV5ZVBvc2l0aW9uID0gdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5wcm9ncmFtcywgJ2V5ZVBvc2l0aW9uJyk7XG4gICAgdGhpcy51bmlMb2NhdGlvbi5jZW50ZXJQb2ludCA9IHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMucHJvZ3JhbXMsICdjZW50ZXJQb2ludCcpO1xuICAgIC8vIOeSsOWig+WFieOCq+ODqeODvFxuICAgIHRoaXMudW5pTG9jYXRpb24uYW1iaWVudENvbG9yID0gdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5wcm9ncmFtcywgJ2FtYmllbnRDb2xvcicpO1xuXG4gICAgLy8g55CD5L2T44KS5b2i5oiQ44GZ44KL6aCC54K544Gu44OH44O844K/44KS5Y+X44GR5Y+W44KLXG4gICAgdGhpcy5zcGhlcmVEYXRhID0gc3BoZXJlKDY0LCA2NCwgMS4wKTtcblxuICAgIC8vIOmggueCueODh+ODvOOCv+OBi+OCieODkOODg+ODleOCoeOCkueUn+aIkOOBl+OBpueZu+mMsuOBmeOCi++8iOmggueCueW6p+aome+8iVxuICAgIGxldCB2UG9zaXRpb25CdWZmZXIgPSB0aGlzLmdsLmNyZWF0ZUJ1ZmZlcigpO1xuICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkFSUkFZX0JVRkZFUiwgdlBvc2l0aW9uQnVmZmVyKTtcbiAgICB0aGlzLmdsLmJ1ZmZlckRhdGEodGhpcy5nbC5BUlJBWV9CVUZGRVIsIG5ldyBGbG9hdDMyQXJyYXkodGhpcy5zcGhlcmVEYXRhLnApLCB0aGlzLmdsLlNUQVRJQ19EUkFXKTtcbiAgICBsZXQgYXR0TG9jUG9zaXRpb24gPSB0aGlzLmdsLmdldEF0dHJpYkxvY2F0aW9uKHRoaXMucHJvZ3JhbXMsICdwb3NpdGlvbicpO1xuICAgIHRoaXMuZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkoYXR0TG9jUG9zaXRpb24pO1xuICAgIHRoaXMuZ2wudmVydGV4QXR0cmliUG9pbnRlcihhdHRMb2NQb3NpdGlvbiwgMywgdGhpcy5nbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xuXG4gICAgLy8g6aCC54K544OH44O844K/44GL44KJ44OQ44OD44OV44Kh44KS55Sf5oiQ44GX44Gm55m76Yyy44GZ44KL77yI6aCC54K55rOV57ea77yJXG4gICAgbGV0IHZOb3JtYWxCdWZmZXIgPSB0aGlzLmdsLmNyZWF0ZUJ1ZmZlcigpO1xuICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkFSUkFZX0JVRkZFUiwgdk5vcm1hbEJ1ZmZlcik7XG4gICAgdGhpcy5nbC5idWZmZXJEYXRhKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCBuZXcgRmxvYXQzMkFycmF5KHRoaXMuc3BoZXJlRGF0YS5uKSwgdGhpcy5nbC5TVEFUSUNfRFJBVyk7XG4gICAgbGV0IGF0dExvY05vcm1hbCA9IHRoaXMuZ2wuZ2V0QXR0cmliTG9jYXRpb24odGhpcy5wcm9ncmFtcywgJ25vcm1hbCcpO1xuICAgIHRoaXMuZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkoYXR0TG9jTm9ybWFsKTtcbiAgICB0aGlzLmdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYXR0TG9jTm9ybWFsLCAzLCB0aGlzLmdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XG5cbiAgICAvLyDpoILngrnjg4fjg7zjgr/jgYvjgonjg5Djg4Pjg5XjgqHjgpLnlJ/miJDjgZfjgabnmbvpjLLjgZnjgovvvIjpoILngrnoibLvvIlcbiAgICBsZXQgdkNvbG9yQnVmZmVyID0gdGhpcy5nbC5jcmVhdGVCdWZmZXIoKTtcbiAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIHZDb2xvckJ1ZmZlcik7XG4gICAgdGhpcy5nbC5idWZmZXJEYXRhKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCBuZXcgRmxvYXQzMkFycmF5KHRoaXMuc3BoZXJlRGF0YS5jKSwgdGhpcy5nbC5TVEFUSUNfRFJBVyk7XG4gICAgbGV0IGF0dExvY0NvbG9yID0gdGhpcy5nbC5nZXRBdHRyaWJMb2NhdGlvbih0aGlzLnByb2dyYW1zLCAnY29sb3InKTtcbiAgICB0aGlzLmdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGF0dExvY0NvbG9yKTtcbiAgICB0aGlzLmdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYXR0TG9jQ29sb3IsIDQsIHRoaXMuZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcblxuICAgIC8vIOOCpOODs+ODh+ODg+OCr+OCueODkOODg+ODleOCoeOBrueUn+aIkFxuICAgIGxldCBpbmRleEJ1ZmZlciA9IHRoaXMuZ2wuY3JlYXRlQnVmZmVyKCk7XG4gICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIGluZGV4QnVmZmVyKTtcbiAgICB0aGlzLmdsLmJ1ZmZlckRhdGEodGhpcy5nbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgbmV3IEludDE2QXJyYXkodGhpcy5zcGhlcmVEYXRhLmkpLCB0aGlzLmdsLlNUQVRJQ19EUkFXKTtcblxuICAgIC8vIOihjOWIl+OBruWIneacn+WMllxuICAgIHRoaXMubWF0ID0gbmV3IG1hdElWKCk7XG4gICAgdGhpcy5tTWF0cml4ID0gdGhpcy5tYXQuaWRlbnRpdHkodGhpcy5tYXQuY3JlYXRlKCkpO1xuICAgIHRoaXMudk1hdHJpeCA9IHRoaXMubWF0LmlkZW50aXR5KHRoaXMubWF0LmNyZWF0ZSgpKTtcbiAgICB0aGlzLnBNYXRyaXggPSB0aGlzLm1hdC5pZGVudGl0eSh0aGlzLm1hdC5jcmVhdGUoKSk7XG4gICAgdGhpcy52cE1hdHJpeCA9IHRoaXMubWF0LmlkZW50aXR5KHRoaXMubWF0LmNyZWF0ZSgpKTtcbiAgICB0aGlzLm12cE1hdHJpeCA9IHRoaXMubWF0LmlkZW50aXR5KHRoaXMubWF0LmNyZWF0ZSgpKTtcbiAgICB0aGlzLmludk1hdHJpeCA9IHRoaXMubWF0LmlkZW50aXR5KHRoaXMubWF0LmNyZWF0ZSgpKTtcblxuICAgIC8vIOODk+ODpeODvOW6p+aomeWkieaPm+ihjOWIl1xuICAgIHRoaXMuY2FtZXJhUG9zaXRpb24gPSBbMC4wLCAwLjAsIDUuMF07IC8vIOOCq+ODoeODqeOBruS9jee9rlxuICAgIHRoaXMuY2VudGVyUG9pbnQgPSBbMC4wLCAwLjAsIDAuMF07ICAgIC8vIOazqOimlueCuVxuICAgIHRoaXMuY2FtZXJhVXAgPSBbMC4wLCAxLjAsIDAuMF07ICAgICAgIC8vIOOCq+ODoeODqeOBruS4iuaWueWQkVxuICAgIHRoaXMubWF0Lmxvb2tBdCh0aGlzLmNhbWVyYVBvc2l0aW9uLCB0aGlzLmNlbnRlclBvaW50LCB0aGlzLmNhbWVyYVVwLCB0aGlzLnZNYXRyaXgpO1xuXG4gICAgLy8g44OX44Ot44K444Kn44Kv44K344On44Oz44Gu44Gf44KB44Gu5oOF5aCx44KS5o+D44GI44KLXG4gICAgbGV0IGZvdnkgPSA0NTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOimlumHjuinklxuICAgIGxldCBhc3BlY3QgPSB0aGlzLmNhbnZhcy53aWR0aCAvIHRoaXMuY2FudmFzLmhlaWdodDsgLy8g44Ki44K544Oa44Kv44OI5q+UXG4gICAgbGV0IG5lYXIgPSAwLjE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOepuumWk+OBruacgOWJjemdolxuICAgIGxldCBmYXIgPSAxMC4wOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDnqbrplpPjga7lpaXooYzjgY3ntYLnq69cbiAgICB0aGlzLm1hdC5wZXJzcGVjdGl2ZShmb3Z5LCBhc3BlY3QsIG5lYXIsIGZhciwgdGhpcy5wTWF0cml4KTtcblxuICAgIC8vIOihjOWIl+OCkuaOm+OBkeWQiOOCj+OBm+OBplZQ44Oe44OI44Oq44OD44Kv44K544KS55Sf5oiQ44GX44Gm44GK44GPXG4gICAgdGhpcy5tYXQubXVsdGlwbHkodGhpcy5wTWF0cml4LCB0aGlzLnZNYXRyaXgsIHRoaXMudnBNYXRyaXgpOyAgIC8vIHDjgat244KS5o6b44GR44KLXG5cbiAgICAvLyDlubPooYzlhYnmupDjga7lkJHjgY1cbiAgICB0aGlzLmxpZ2h0RGlyZWN0aW9uID0gWzEuMCwgMS4wLCAxLjBdO1xuXG4gICAgLy8g55Kw5aKD5YWJ44Gu6ImyXG4gICAgdGhpcy5hbWJpZW50Q29sb3IgPSBbMC41LCAwLjAsIDAuMCwgMS4wXTtcblxuICAgIC8vIOioreWumuOCkuacieWKueWMluOBmeOCi1xuICAgIHRoaXMuZ2wuZW5hYmxlKHRoaXMuZ2wuREVQVEhfVEVTVCk7XG4gICAgdGhpcy5nbC5kZXB0aEZ1bmModGhpcy5nbC5MRVFVQUwpO1xuXG4gICAgLy8gcmVuZGVyaW5n6ZaL5aeLXG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDjg6zjg7Pjg4Djg6rjg7PjgrDplqLmlbDjga7lrprnvqlcbiAgICovXG4gIHJlbmRlcigpIHtcblxuICAgIC8vIENhbnZhc+OCqOODrOODoeODs+ODiOOCkuOCr+ODquOCouOBmeOCi1xuICAgIHRoaXMuZ2wuY2xlYXIodGhpcy5nbC5DT0xPUl9CVUZGRVJfQklUIHwgdGhpcy5nbC5ERVBUSF9CVUZGRVJfQklUKTtcblxuICAgIC8vIOODouODh+ODq+W6p+aomeWkieaPm+ihjOWIl+OCkuS4gOW6puWIneacn+WMluOBl+OBpuODquOCu+ODg+ODiOOBmeOCi1xuICAgIHRoaXMubWF0LmlkZW50aXR5KHRoaXMubU1hdHJpeCk7XG5cbiAgICAvLyDjgqvjgqbjg7Pjgr/jgpLjgqTjg7Pjgq/jg6rjg6Hjg7Pjg4jjgZnjgotcbiAgICB0aGlzLmNvdW50Kys7XG5cbiAgICAvLyDjg6Ljg4fjg6vluqfmqJnlpInmj5vooYzliJfjgpLkuIDluqbliJ3mnJ/ljJbjgZfjgabjg6rjgrvjg4Pjg4jjgZnjgotcbiAgICB0aGlzLm1hdC5pZGVudGl0eSh0aGlzLm1NYXRyaXgpO1xuXG4gICAgLy8g44Oi44OH44Or5bqn5qiZ5aSJ5o+b6KGM5YiXXG4gICAgbGV0IGF4aXMgPSBbMC4wLCAxLjAsIDAuMF07XG4gICAgbGV0IHJhZGlhbnMgPSAodGhpcy5jb3VudCAlIDM2MCkgKiBNYXRoLlBJIC8gMTgwO1xuICAgIHRoaXMubWF0LnJvdGF0ZSh0aGlzLm1NYXRyaXgsIHJhZGlhbnMsIGF4aXMsIHRoaXMubU1hdHJpeCk7XG5cbiAgICAvLyDooYzliJfjgpLmjpvjgZHlkIjjgo/jgZvjgaZNVlDjg57jg4jjg6rjg4Pjgq/jgrnjgpLnlJ/miJBcbiAgICB0aGlzLm1hdC5tdWx0aXBseSh0aGlzLnZwTWF0cml4LCB0aGlzLm1NYXRyaXgsIHRoaXMubXZwTWF0cml4KTsgLy8g44GV44KJ44GrbeOCkuaOm+OBkeOCi1xuXG4gICAgLy8g6YCG6KGM5YiX44KS55Sf5oiQXG4gICAgdGhpcy5tYXQuaW52ZXJzZSh0aGlzLm1NYXRyaXgsIHRoaXMuaW52TWF0cml4KTtcblxuICAgIC8vIOOCt+OCp+ODvOODgOOBq+axjueUqOODh+ODvOOCv+OCkumAgeS/oeOBmeOCi1xuICAgIHRoaXMuZ2wudW5pZm9ybU1hdHJpeDRmdih0aGlzLnVuaUxvY2F0aW9uLm12cE1hdHJpeCwgZmFsc2UsIHRoaXMubXZwTWF0cml4KTtcbiAgICB0aGlzLmdsLnVuaWZvcm1NYXRyaXg0ZnYodGhpcy51bmlMb2NhdGlvbi5pbnZNYXRyaXgsIGZhbHNlLCB0aGlzLmludk1hdHJpeCk7XG4gICAgdGhpcy5nbC51bmlmb3JtM2Z2KHRoaXMudW5pTG9jYXRpb24ubGlnaHREaXJlY3Rpb24sIHRoaXMubGlnaHREaXJlY3Rpb24pO1xuICAgIHRoaXMuZ2wudW5pZm9ybTNmdih0aGlzLnVuaUxvY2F0aW9uLmV5ZVBvc2l0aW9uLCB0aGlzLmNhbWVyYVBvc2l0aW9uKTtcbiAgICB0aGlzLmdsLnVuaWZvcm0zZnYodGhpcy51bmlMb2NhdGlvbi5jZW50ZXJQb2ludCwgdGhpcy5jZW50ZXJQb2ludCk7XG4gICAgdGhpcy5nbC51bmlmb3JtNGZ2KHRoaXMudW5pTG9jYXRpb24uYW1iaWVudENvbG9yLCB0aGlzLmFtYmllbnRDb2xvcik7XG4gICAgLy8g44Kk44Oz44OH44OD44Kv44K544OQ44OD44OV44Kh44Gr44KI44KL5o+P55S7XG4gICAgdGhpcy5nbC5kcmF3RWxlbWVudHModGhpcy5nbC5UUklBTkdMRVMsIHRoaXMuc3BoZXJlRGF0YS5pLmxlbmd0aCwgdGhpcy5nbC5VTlNJR05FRF9TSE9SVCwgMCk7XG4gICAgdGhpcy5nbC5mbHVzaCgpO1xuXG4gICAgLy8g5YaN5biw5ZG844Gz5Ye644GXXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpPT4ge1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjcmVhdGVTaGFkZXJQcm9ncmFtXG4gICAqIOODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiOeUn+aIkOmWouaVsFxuICAgKi9cbiAgY3JlYXRlU2hhZGVyUHJvZ3JhbSh2ZXJ0ZXhTb3VyY2UsIGZyYWdtZW50U291cmNlKSB7XG5cbiAgICAvLyDjgrfjgqfjg7zjg4Djgqrjg5bjgrjjgqfjgq/jg4jjga7nlJ/miJBcbiAgICBsZXQgdmVydGV4U2hhZGVyID0gdGhpcy5nbC5jcmVhdGVTaGFkZXIodGhpcy5nbC5WRVJURVhfU0hBREVSKTtcbiAgICBsZXQgZnJhZ21lbnRTaGFkZXIgPSB0aGlzLmdsLmNyZWF0ZVNoYWRlcih0aGlzLmdsLkZSQUdNRU5UX1NIQURFUik7XG5cbiAgICAvLyDjgrfjgqfjg7zjg4Djgavjgr3jg7zjgrnjgpLlibLjgorlvZPjgabjgabjgrPjg7Pjg5HjgqTjg6tcbiAgICB0aGlzLmdsLnNoYWRlclNvdXJjZSh2ZXJ0ZXhTaGFkZXIsIHZlcnRleFNvdXJjZSk7XG4gICAgdGhpcy5nbC5jb21waWxlU2hhZGVyKHZlcnRleFNoYWRlcik7XG4gICAgdGhpcy5nbC5zaGFkZXJTb3VyY2UoZnJhZ21lbnRTaGFkZXIsIGZyYWdtZW50U291cmNlKTtcbiAgICB0aGlzLmdsLmNvbXBpbGVTaGFkZXIoZnJhZ21lbnRTaGFkZXIpO1xuXG4gICAgLy8g44K344Kn44O844OA44O844Kz44Oz44OR44Kk44Or44Gu44Ko44Op44O85Yik5a6aXG4gICAgaWYgKHRoaXMuZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHZlcnRleFNoYWRlciwgdGhpcy5nbC5DT01QSUxFX1NUQVRVUylcbiAgICAgICYmIHRoaXMuZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKGZyYWdtZW50U2hhZGVyLCB0aGlzLmdsLkNPTVBJTEVfU1RBVFVTKSkge1xuICAgICAgY29uc29sZS5sb2coJ1N1Y2Nlc3MgU2hhZGVyIENvbXBpbGUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ0ZhaWxkIFNoYWRlciBDb21waWxlJyk7XG4gICAgICBjb25zb2xlLmxvZygndmVydGV4U2hhZGVyJywgdGhpcy5nbC5nZXRTaGFkZXJJbmZvTG9nKHZlcnRleFNoYWRlcikpO1xuICAgICAgY29uc29sZS5sb2coJ2ZyYWdtZW50U2hhZGVyJywgdGhpcy5nbC5nZXRTaGFkZXJJbmZvTG9nKGZyYWdtZW50U2hhZGVyKSk7XG4gICAgfVxuXG4gICAgLy8g44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OI44Gu55Sf5oiQ44GL44KJ6YG45oqe44G+44GnXG4gICAgY29uc3QgcHJvZ3JhbXMgPSB0aGlzLmdsLmNyZWF0ZVByb2dyYW0oKTtcblxuICAgIHRoaXMuZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW1zLCB2ZXJ0ZXhTaGFkZXIpO1xuICAgIHRoaXMuZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW1zLCBmcmFnbWVudFNoYWRlcik7XG4gICAgdGhpcy5nbC5saW5rUHJvZ3JhbShwcm9ncmFtcyk7XG5cbiAgICAvLyDjg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4jjga7jgqjjg6njg7zliKTlrprlh6bnkIZcbiAgICBpZiAodGhpcy5nbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHByb2dyYW1zLCB0aGlzLmdsLkxJTktfU1RBVFVTKSkge1xuICAgICAgdGhpcy5nbC51c2VQcm9ncmFtKHByb2dyYW1zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCBMaW5rIFByb2dyYW0nLCB0aGlzLmdsLmdldFByb2dyYW1JbmZvTG9nKHByb2dyYW1zKSk7XG4gICAgfVxuXG4gICAgLy8g55Sf5oiQ44GX44Gf44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OI44KS5oi744KK5YCk44Go44GX44Gm6L+U44GZXG4gICAgcmV0dXJuIHByb2dyYW1zO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2FtcGxlNjtcbiIsIi8qXG4gKiBTYW1wbGUgN1xuICogdG9kbzog44OG44Kv44K544OB44OjXG4gKi9cblxuaW1wb3J0IHttYXRJViwgcXRuSVYsIHRvcnVzLCBjdWJlLCBoc3ZhICxzcGhlcmV9IGZyb20gXCIuL21pbk1hdHJpeFwiO1xuXG5jbGFzcyBTYW1wbGU3IHtcbiAgLyoqXG4gICAqIGNvbnN0cnVjdG9yXG4gICAqIOOCs+ODs+OCueODiOODqeOCr+OCv1xuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAvL2NhbnZhc+OBuOOBruWPguS4iuOCkuWkieaVsOOBq+WPluW+l+OBmeOCi1xuICAgIGxldCBjID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpO1xuICAgIC8vIHNpemXmjIflrppcbiAgICBjLndpZHRoID0gNTEyO1xuICAgIGMuaGVpZ2h0ID0gNTEyO1xuICAgIHRoaXMuY2FudmFzID0gYztcblxuICAgIC8vV2ViR0zjgrPjg7Pjg4bjgq3jgrnjg4jjgpJjYW52YXPjgYvjgonlj5blvpfjgZnjgotcbiAgICB0aGlzLmdsID0gYy5nZXRDb250ZXh0KCd3ZWJnbCcpIHx8IGMuZ2V0Q29udGV4dCgnZXhwZXJpbWVudGFsLXdlYmdsJyk7XG5cbiAgICAvLyDooYzliJfoqIjnrpdcbiAgICB0aGlzLm1hdCA9IG51bGw7XG4gICAgLy8g44Os44Oz44OA44Oq44Oz44Kw55So44Kr44Km44Oz44K/XG4gICAgdGhpcy5jb3VudCA9IDA7XG4gIH1cblxuICAvKipcbiAgICogcnVuXG4gICAqIOOCteODs+ODl+ODq+OCs+ODvOODieWun+ihjFxuICAgKi9cbiAgcnVuKCkge1xuICAgIGNvbnNvbGUubG9nKCdTdGFydCBTYW1wbGU1Jyk7XG5cbiAgICAvLyBXZWJHTOOCs+ODs+ODhuOCreOCueODiOOBruWPluW+l+OBjOOBp+OBjeOBn+OBi+OBqeOBhuOBi1xuICAgIGlmICh0aGlzLmdsKSB7XG4gICAgICBjb25zb2xlLmxvZygnc3VwcG9ydHMgd2ViZ2wnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ3dlYmdsIG5vdCBzdXBwb3J0ZWQnKTtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIOOCr+ODquOCouOBmeOCi+iJsuOCkuaMh+WumlxuICAgIHRoaXMuZ2wuY2xlYXJDb2xvcigwLjMsIDAuMywgMC4zLCAxLjApO1xuXG4gICAgdGhpcy5nbC5jbGVhckRlcHRoKDEuMCk7XG5cbiAgICAvLyDjgqjjg6zjg6Hjg7Pjg4jjgpLjgq/jg6rjgqJcbiAgICB0aGlzLmdsLmNsZWFyKHRoaXMuZ2wuQ09MT1JfQlVGRkVSX0JJVCk7XG5cbiAgICAvLyDjgrfjgqfjg7zjg4Djgajjg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4hcbiAgICBjb25zdCB2ZXJ0ZXhTb3VyY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndnMnKS50ZXh0Q29udGVudDtcbiAgICBjb25zdCBmcmFnbWVudFNvdXJjZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmcycpLnRleHRDb250ZW50O1xuXG4gICAgLy8g44Om44O844K244O85a6a576p44Gu44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OI55Sf5oiQ6Zai5pWwXG4gICAgdGhpcy5wcm9ncmFtcyA9IHRoaXMuY3JlYXRlU2hhZGVyUHJvZ3JhbSh2ZXJ0ZXhTb3VyY2UsIGZyYWdtZW50U291cmNlKTtcblxuICAgIC8vIHVuaWZvcm3jg63jgrHjg7zjgrfjg6fjg7PjgpLlj5blvpfjgZfjgabjgYrjgY9cbiAgICB0aGlzLnVuaUxvY2F0aW9uID0ge307XG4gICAgdGhpcy51bmlMb2NhdGlvbi5tdnBNYXRyaXggPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLnByb2dyYW1zLCAnbXZwTWF0cml4Jyk7XG4gICAgdGhpcy51bmlMb2NhdGlvbi50ZXh0dXJlID0gdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5wcm9ncmFtcywgJ3RleHR1cmUnKTtcblxuICAgIC8vIOeQg+S9k+OCkuW9ouaIkOOBmeOCi+mggueCueOBruODh+ODvOOCv+OCkuWPl+OBkeWPluOCi1xuICAgIHRoaXMuc3BoZXJlRGF0YSA9IHNwaGVyZSg2NCwgNjQsIDEuMCk7XG5cbiAgICAvLyDpoILngrnjg4fjg7zjgr/jgYvjgonjg5Djg4Pjg5XjgqHjgpLnlJ/miJDjgZfjgabphY3liJfjgavmoLzntI3jgZfjgabjgYrjgY9cbiAgICB2YXIgdlBvc2l0aW9uQnVmZmVyID0gdGhpcy5nZW5lcmF0ZVZCTyh0aGlzLnNwaGVyZURhdGEucCk7XG4gICAgdmFyIHZUZXhDb29yZEJ1ZmZlciA9IHRoaXMuZ2VuZXJhdGVWQk8odGhpcy5zcGhlcmVEYXRhLnQpO1xuICAgIHZhciB2Ym9MaXN0ID0gW3ZQb3NpdGlvbkJ1ZmZlciwgdlRleENvb3JkQnVmZmVyXTtcblxuICAgIC8vIGF0dHJpYnV0ZUxvY2F0aW9u44KS5Y+W5b6X44GX44Gm6YWN5YiX44Gr5qC857SN44GZ44KLXG4gICAgdmFyIGF0dExvY2F0aW9uID0gW107XG4gICAgYXR0TG9jYXRpb25bMF0gPSB0aGlzLmdsLmdldEF0dHJpYkxvY2F0aW9uKHRoaXMucHJvZ3JhbXMsICdwb3NpdGlvbicpO1xuICAgIGF0dExvY2F0aW9uWzFdID0gdGhpcy5nbC5nZXRBdHRyaWJMb2NhdGlvbih0aGlzLnByb2dyYW1zLCAndGV4Q29vcmQnKTtcblxuICAgIC8vIGF0dHJpYnV0ZeOBruOCueODiOODqeOCpOODieOCkumFjeWIl+OBq+agvOe0jeOBl+OBpuOBiuOBj1xuICAgIHZhciBhdHRTdHJpZGUgPSBbXTtcbiAgICBhdHRTdHJpZGVbMF0gPSAzO1xuICAgIGF0dFN0cmlkZVsxXSA9IDI7XG5cblxuICAgIC8vIOOCpOODs+ODh+ODg+OCr+OCueODkOODg+ODleOCoeOBrueUn+aIkFxuICAgIHZhciBpbmRleEJ1ZmZlciA9IHRoaXMuZ2VuZXJhdGVJQk8odGhpcy5zcGhlcmVEYXRhLmkpO1xuXG4gICAgLy8gVkJP44GoSUJP44KS55m76Yyy44GX44Gm44GK44GPXG4gICAgdGhpcy5zZXRBdHRyaWJ1dGUodmJvTGlzdCwgYXR0TG9jYXRpb24sIGF0dFN0cmlkZSwgaW5kZXhCdWZmZXIpO1xuXG4gICAgLy8g6KGM5YiX44Gu5Yid5pyf5YyWXG4gICAgdGhpcy5tYXQgPSBuZXcgbWF0SVYoKTtcbiAgICB0aGlzLm1NYXRyaXggPSB0aGlzLm1hdC5pZGVudGl0eSh0aGlzLm1hdC5jcmVhdGUoKSk7XG4gICAgdGhpcy52TWF0cml4ID0gdGhpcy5tYXQuaWRlbnRpdHkodGhpcy5tYXQuY3JlYXRlKCkpO1xuICAgIHRoaXMucE1hdHJpeCA9IHRoaXMubWF0LmlkZW50aXR5KHRoaXMubWF0LmNyZWF0ZSgpKTtcbiAgICB0aGlzLnZwTWF0cml4ID0gdGhpcy5tYXQuaWRlbnRpdHkodGhpcy5tYXQuY3JlYXRlKCkpO1xuICAgIHRoaXMubXZwTWF0cml4ID0gdGhpcy5tYXQuaWRlbnRpdHkodGhpcy5tYXQuY3JlYXRlKCkpO1xuICAgIHRoaXMuaW52TWF0cml4ID0gdGhpcy5tYXQuaWRlbnRpdHkodGhpcy5tYXQuY3JlYXRlKCkpO1xuXG4gICAgLy8g44OT44Ol44O85bqn5qiZ5aSJ5o+b6KGM5YiXXG4gICAgdGhpcy5jYW1lcmFQb3NpdGlvbiA9IFswLjAsIDAuMCwgNS4wXTsgLy8g44Kr44Oh44Op44Gu5L2N572uXG4gICAgdGhpcy5jZW50ZXJQb2ludCA9IFswLjAsIDAuMCwgMC4wXTsgICAgLy8g5rOo6KaW54K5XG4gICAgdGhpcy5jYW1lcmFVcCA9IFswLjAsIDEuMCwgMC4wXTsgICAgICAgLy8g44Kr44Oh44Op44Gu5LiK5pa55ZCRXG4gICAgdGhpcy5tYXQubG9va0F0KHRoaXMuY2FtZXJhUG9zaXRpb24sIHRoaXMuY2VudGVyUG9pbnQsIHRoaXMuY2FtZXJhVXAsIHRoaXMudk1hdHJpeCk7XG5cbiAgICAvLyDjg5fjg63jgrjjgqfjgq/jgrfjg6fjg7Pjga7jgZ/jgoHjga7mg4XloLHjgpLmj4PjgYjjgotcbiAgICBsZXQgZm92eSA9IDQ1OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g6KaW6YeO6KeSXG4gICAgbGV0IGFzcGVjdCA9IHRoaXMuY2FudmFzLndpZHRoIC8gdGhpcy5jYW52YXMuaGVpZ2h0OyAvLyDjgqLjgrnjg5rjgq/jg4jmr5RcbiAgICBsZXQgbmVhciA9IDAuMTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g56m66ZaT44Gu5pyA5YmN6Z2iXG4gICAgbGV0IGZhciA9IDEwLjA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOepuumWk+OBruWlpeihjOOBjee1guerr1xuICAgIHRoaXMubWF0LnBlcnNwZWN0aXZlKGZvdnksIGFzcGVjdCwgbmVhciwgZmFyLCB0aGlzLnBNYXRyaXgpO1xuXG4gICAgLy8g6KGM5YiX44KS5o6b44GR5ZCI44KP44Gb44GmVlDjg57jg4jjg6rjg4Pjgq/jgrnjgpLnlJ/miJDjgZfjgabjgYrjgY9cbiAgICB0aGlzLm1hdC5tdWx0aXBseSh0aGlzLnBNYXRyaXgsIHRoaXMudk1hdHJpeCwgdGhpcy52cE1hdHJpeCk7ICAgLy8gcOOBq3bjgpLmjpvjgZHjgotcblxuICAgIC8vIOW5s+ihjOWFiea6kOOBruWQkeOBjVxuICAgIHRoaXMubGlnaHREaXJlY3Rpb24gPSBbMS4wLCAxLjAsIDEuMF07XG5cbiAgICAvLyDnkrDlooPlhYnjga7oibJcbiAgICB0aGlzLmFtYmllbnRDb2xvciA9IFswLjUsIDAuMCwgMC4wLCAxLjBdO1xuXG4gICAgLy8g6Kit5a6a44KS5pyJ5Yq55YyW44GZ44KLXG4gICAgdGhpcy5nbC5lbmFibGUodGhpcy5nbC5ERVBUSF9URVNUKTtcbiAgICB0aGlzLmdsLmRlcHRoRnVuYyh0aGlzLmdsLkxFUVVBTCk7XG5cbiAgICAvLyDjg4bjgq/jgrnjg4Hjg6PnlJ/miJDplqLmlbDjgpLlkbzjgbPlh7rjgZlcbiAgICB0aGlzLnRleHR1cmUgPSBudWxsO1xuICAgIHRoaXMuZ2VuZXJhdGVUZXh0dXJlKCcuLi9pbWFnZS9zc2YuanBnJyk7XG5cbiAgICAvLyDjg63jg7zjg4nlrozkuobjgpLjg4Hjgqfjg4Pjgq/jgZnjgovplqLmlbDjgpLlkbzjgbPlh7rjgZlcbiAgICB0aGlzLmxvYWRDaGVjaygpO1xuXG4gIH1cblxuICAvKipcbiAgICog44Os44Oz44OA44Oq44Oz44Kw6Zai5pWw44Gu5a6a576pXG4gICAqL1xuICByZW5kZXIoKSB7XG5cbiAgICAvLyDjgqvjgqbjg7Pjgr/jgpLjgqTjg7Pjgq/jg6rjg6Hjg7Pjg4jjgZnjgotcbiAgICB0aGlzLmNvdW50Kys7XG5cbiAgICAvLyBDYW52YXPjgqjjg6zjg6Hjg7Pjg4jjgpLjgq/jg6rjgqLjgZnjgotcbiAgICB0aGlzLmdsLmNsZWFyKHRoaXMuZ2wuQ09MT1JfQlVGRkVSX0JJVCB8IHRoaXMuZ2wuREVQVEhfQlVGRkVSX0JJVCk7XG5cbiAgICAvLyDjg6Ljg4fjg6vluqfmqJnlpInmj5vooYzliJfjgpLkuIDluqbliJ3mnJ/ljJbjgZfjgabjg6rjgrvjg4Pjg4jjgZnjgotcbiAgICB0aGlzLm1hdC5pZGVudGl0eSh0aGlzLm1NYXRyaXgpO1xuXG4gICAgLy8g44Oi44OH44Or5bqn5qiZ5aSJ5o+b6KGM5YiXXG4gICAgbGV0IGF4aXMgPSBbMC4wLCAxLjAsIDAuMF07XG4gICAgbGV0IHJhZGlhbnMgPSAodGhpcy5jb3VudCAlIDM2MCkgKiBNYXRoLlBJIC8gMTgwO1xuICAgIHRoaXMubWF0LnJvdGF0ZSh0aGlzLm1NYXRyaXgsIHJhZGlhbnMsIGF4aXMsIHRoaXMubU1hdHJpeCk7XG5cbiAgICAvLyDooYzliJfjgpLmjpvjgZHlkIjjgo/jgZvjgaZNVlDjg57jg4jjg6rjg4Pjgq/jgrnjgpLnlJ/miJBcbiAgICB0aGlzLm1hdC5tdWx0aXBseSh0aGlzLnZwTWF0cml4LCB0aGlzLm1NYXRyaXgsIHRoaXMubXZwTWF0cml4KTsgLy8g44GV44KJ44GrbeOCkuaOm+OBkeOCi1xuXG4gICAgLy8g6YCG6KGM5YiX44KS55Sf5oiQXG4gICAgdGhpcy5tYXQuaW52ZXJzZSh0aGlzLm1NYXRyaXgsIHRoaXMuaW52TWF0cml4KTtcblxuICAgIC8vIOOCt+OCp+ODvOODgOOBq+axjueUqOODh+ODvOOCv+OCkumAgeS/oeOBmeOCi1xuICAgIHRoaXMuZ2wudW5pZm9ybU1hdHJpeDRmdih0aGlzLnVuaUxvY2F0aW9uLm12cE1hdHJpeCwgZmFsc2UsIHRoaXMubXZwTWF0cml4KTtcbiAgICB0aGlzLmdsLnVuaWZvcm0xaSh0aGlzLnVuaUxvY2F0aW9uLnRleHR1cmUsIDApO1xuXG4gICAgLy8g44Kk44Oz44OH44OD44Kv44K544OQ44OD44OV44Kh44Gr44KI44KL5o+P55S7XG4gICAgdGhpcy5nbC5kcmF3RWxlbWVudHModGhpcy5nbC5UUklBTkdMRVMsIHRoaXMuc3BoZXJlRGF0YS5pLmxlbmd0aCwgdGhpcy5nbC5VTlNJR05FRF9TSE9SVCwgMCk7XG4gICAgdGhpcy5nbC5mbHVzaCgpO1xuXG4gICAgLy8g5YaN5biw5ZG844Gz5Ye644GXXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpPT4ge1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjcmVhdGVTaGFkZXJQcm9ncmFtXG4gICAqIOODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiOeUn+aIkOmWouaVsFxuICAgKi9cbiAgY3JlYXRlU2hhZGVyUHJvZ3JhbSh2ZXJ0ZXhTb3VyY2UsIGZyYWdtZW50U291cmNlKSB7XG5cbiAgICAvLyDjgrfjgqfjg7zjg4Djgqrjg5bjgrjjgqfjgq/jg4jjga7nlJ/miJBcbiAgICBsZXQgdmVydGV4U2hhZGVyID0gdGhpcy5nbC5jcmVhdGVTaGFkZXIodGhpcy5nbC5WRVJURVhfU0hBREVSKTtcbiAgICBsZXQgZnJhZ21lbnRTaGFkZXIgPSB0aGlzLmdsLmNyZWF0ZVNoYWRlcih0aGlzLmdsLkZSQUdNRU5UX1NIQURFUik7XG5cbiAgICAvLyDjgrfjgqfjg7zjg4Djgavjgr3jg7zjgrnjgpLlibLjgorlvZPjgabjgabjgrPjg7Pjg5HjgqTjg6tcbiAgICB0aGlzLmdsLnNoYWRlclNvdXJjZSh2ZXJ0ZXhTaGFkZXIsIHZlcnRleFNvdXJjZSk7XG4gICAgdGhpcy5nbC5jb21waWxlU2hhZGVyKHZlcnRleFNoYWRlcik7XG4gICAgdGhpcy5nbC5zaGFkZXJTb3VyY2UoZnJhZ21lbnRTaGFkZXIsIGZyYWdtZW50U291cmNlKTtcbiAgICB0aGlzLmdsLmNvbXBpbGVTaGFkZXIoZnJhZ21lbnRTaGFkZXIpO1xuXG4gICAgLy8g44K344Kn44O844OA44O844Kz44Oz44OR44Kk44Or44Gu44Ko44Op44O85Yik5a6aXG4gICAgaWYgKHRoaXMuZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHZlcnRleFNoYWRlciwgdGhpcy5nbC5DT01QSUxFX1NUQVRVUylcbiAgICAgICYmIHRoaXMuZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKGZyYWdtZW50U2hhZGVyLCB0aGlzLmdsLkNPTVBJTEVfU1RBVFVTKSkge1xuICAgICAgY29uc29sZS5sb2coJ1N1Y2Nlc3MgU2hhZGVyIENvbXBpbGUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ0ZhaWxkIFNoYWRlciBDb21waWxlJyk7XG4gICAgICBjb25zb2xlLmxvZygndmVydGV4U2hhZGVyJywgdGhpcy5nbC5nZXRTaGFkZXJJbmZvTG9nKHZlcnRleFNoYWRlcikpO1xuICAgICAgY29uc29sZS5sb2coJ2ZyYWdtZW50U2hhZGVyJywgdGhpcy5nbC5nZXRTaGFkZXJJbmZvTG9nKGZyYWdtZW50U2hhZGVyKSk7XG4gICAgfVxuXG4gICAgLy8g44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OI44Gu55Sf5oiQ44GL44KJ6YG45oqe44G+44GnXG4gICAgY29uc3QgcHJvZ3JhbXMgPSB0aGlzLmdsLmNyZWF0ZVByb2dyYW0oKTtcblxuICAgIHRoaXMuZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW1zLCB2ZXJ0ZXhTaGFkZXIpO1xuICAgIHRoaXMuZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW1zLCBmcmFnbWVudFNoYWRlcik7XG4gICAgdGhpcy5nbC5saW5rUHJvZ3JhbShwcm9ncmFtcyk7XG5cbiAgICAvLyDjg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4jjga7jgqjjg6njg7zliKTlrprlh6bnkIZcbiAgICBpZiAodGhpcy5nbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHByb2dyYW1zLCB0aGlzLmdsLkxJTktfU1RBVFVTKSkge1xuICAgICAgdGhpcy5nbC51c2VQcm9ncmFtKHByb2dyYW1zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCBMaW5rIFByb2dyYW0nLCB0aGlzLmdsLmdldFByb2dyYW1JbmZvTG9nKHByb2dyYW1zKSk7XG4gICAgfVxuXG4gICAgLy8g55Sf5oiQ44GX44Gf44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OI44KS5oi744KK5YCk44Go44GX44Gm6L+U44GZXG4gICAgcmV0dXJuIHByb2dyYW1zO1xuICB9XG5cbiAgLy8g6aCC54K544OQ44OD44OV44Kh77yIVkJP77yJ44KS55Sf5oiQ44GZ44KL6Zai5pWwXG4gIGdlbmVyYXRlVkJPKGRhdGEpIHtcbiAgICAvLyDjg5Djg4Pjg5XjgqHjgqrjg5bjgrjjgqfjgq/jg4jjga7nlJ/miJBcbiAgICB2YXIgdmJvID0gdGhpcy5nbC5jcmVhdGVCdWZmZXIoKTtcblxuICAgIC8vIOODkOODg+ODleOCoeOCkuODkOOCpOODs+ODieOBmeOCi1xuICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkFSUkFZX0JVRkZFUiwgdmJvKTtcblxuICAgIC8vIOODkOODg+ODleOCoeOBq+ODh+ODvOOCv+OCkuOCu+ODg+ODiFxuICAgIHRoaXMuZ2wuYnVmZmVyRGF0YSh0aGlzLmdsLkFSUkFZX0JVRkZFUiwgbmV3IEZsb2F0MzJBcnJheShkYXRhKSwgdGhpcy5nbC5TVEFUSUNfRFJBVyk7XG5cbiAgICAvLyDjg5Djg4Pjg5XjgqHjga7jg5DjgqTjg7Pjg4njgpLnhKHlirnljJZcbiAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIG51bGwpO1xuXG4gICAgLy8g55Sf5oiQ44GX44GfIFZCTyDjgpLov5TjgZfjgabntYLkuoZcbiAgICByZXR1cm4gdmJvO1xuICB9XG5cbiAgLy8g44Kk44Oz44OH44OD44Kv44K544OQ44OD44OV44Kh77yISUJP77yJ44KS55Sf5oiQ44GZ44KL6Zai5pWwXG4gIGdlbmVyYXRlSUJPKGRhdGEpIHtcbiAgICAvLyDjg5Djg4Pjg5XjgqHjgqrjg5bjgrjjgqfjgq/jg4jjga7nlJ/miJBcbiAgICB2YXIgaWJvID0gdGhpcy5nbC5jcmVhdGVCdWZmZXIoKTtcblxuICAgIC8vIOODkOODg+ODleOCoeOCkuODkOOCpOODs+ODieOBmeOCi1xuICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBpYm8pO1xuXG4gICAgLy8g44OQ44OD44OV44Kh44Gr44OH44O844K/44KS44K744OD44OIXG4gICAgdGhpcy5nbC5idWZmZXJEYXRhKHRoaXMuZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIG5ldyBJbnQxNkFycmF5KGRhdGEpLCB0aGlzLmdsLlNUQVRJQ19EUkFXKTtcblxuICAgIC8vIOODkOODg+ODleOCoeOBruODkOOCpOODs+ODieOCkueEoeWKueWMllxuICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBudWxsKTtcblxuICAgIC8vIOeUn+aIkOOBl+OBn0lCT+OCkui/lOOBl+OBpue1guS6hlxuICAgIHJldHVybiBpYm87XG4gIH1cblxuICAvLyBWQk/jgahJQk/jgpLnmbvpjLLjgZnjgovplqLmlbBcbiAgc2V0QXR0cmlidXRlKHZibywgYXR0TCwgYXR0UywgaWJvKSB7XG4gICAgLy8g5byV5pWw44Go44GX44Gm5Y+X44GR5Y+W44Gj44Gf6YWN5YiX44KS5Yem55CG44GZ44KLXG4gICAgZm9yICh2YXIgaSBpbiB2Ym8pIHtcbiAgICAgIC8vIOODkOODg+ODleOCoeOCkuODkOOCpOODs+ODieOBmeOCi1xuICAgICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCB2Ym9baV0pO1xuXG4gICAgICAvLyBhdHRyaWJ1dGVMb2NhdGlvbuOCkuacieWKueOBq+OBmeOCi1xuICAgICAgdGhpcy5nbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShhdHRMW2ldKTtcblxuICAgICAgLy8gYXR0cmlidXRlTG9jYXRpb27jgpLpgJrnn6XjgZfnmbvpjLLjgZnjgotcbiAgICAgIHRoaXMuZ2wudmVydGV4QXR0cmliUG9pbnRlcihhdHRMW2ldLCBhdHRTW2ldLCB0aGlzLmdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XG4gICAgfVxuXG4gICAgLy8g44Kk44Oz44OH44OD44Kv44K544OQ44OD44OV44Kh44KS44OQ44Kk44Oz44OJ44GZ44KLXG4gICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIGlibyk7XG4gIH1cblxuICAvLyDjg4bjgq/jgrnjg4Hjg6Pjgqrjg5bjgrjjgqfjgq/jg4jjgpLliJ3mnJ/ljJbjgZnjgotcbiAgZ2VuZXJhdGVUZXh0dXJlKHNvdXJjZSkge1xuICAgIC8vIOOCpOODoeODvOOCuOOCquODluOCuOOCp+OCr+ODiOOBrueUn+aIkFxuICAgIHZhciBpbWcgPSBuZXcgSW1hZ2UoKTtcblxuICAgIC8vIOODh+ODvOOCv+OBruOCquODs+ODreODvOODieOCkuODiOODquOCrOOBq+OBmeOCi1xuICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyh0aGlzLmdsKTtcblxuICAgICAgLy8g44OG44Kv44K544OB44Oj44Kq44OW44K444Kn44Kv44OI44Gu55Sf5oiQXG4gICAgICB0aGlzLnRleHR1cmUgPSB0aGlzLmdsLmNyZWF0ZVRleHR1cmUoKTtcblxuICAgICAgLy8g44OG44Kv44K544OB44Oj44KS44OQ44Kk44Oz44OJ44GZ44KLXG4gICAgICB0aGlzLmdsLmJpbmRUZXh0dXJlKHRoaXMuZ2wuVEVYVFVSRV8yRCwgdGhpcy50ZXh0dXJlKTtcblxuICAgICAgLy8g44OG44Kv44K544OB44Oj44G444Kk44Oh44O844K444KS6YGp55SoXG4gICAgICB0aGlzLmdsLnRleEltYWdlMkQodGhpcy5nbC5URVhUVVJFXzJELCAwLCB0aGlzLmdsLlJHQkEsIHRoaXMuZ2wuUkdCQSwgdGhpcy5nbC5VTlNJR05FRF9CWVRFLCBpbWcpO1xuXG4gICAgICAvLyDjg5/jg4Pjg5fjg57jg4Pjg5fjgpLnlJ/miJBcbiAgICAgIHRoaXMuZ2wuZ2VuZXJhdGVNaXBtYXAodGhpcy5nbC5URVhUVVJFXzJEKTtcblxuICAgICAgLy8g44OG44Kv44K544OB44Oj44Gu44OQ44Kk44Oz44OJ44KS54Sh5Yq55YyWXG4gICAgICB0aGlzLmdsLmJpbmRUZXh0dXJlKHRoaXMuZ2wuVEVYVFVSRV8yRCwgbnVsbCk7XG4gICAgfTtcblxuICAgIC8vIOOCpOODoeODvOOCuOOCquODluOCuOOCp+OCr+ODiOOBruiqreOBv+i+vOOBv+OCkumWi+Wni1xuICAgIGltZy5zcmMgPSBzb3VyY2U7XG4gIH1cblxuICAvLyDjg4bjgq/jgrnjg4Hjg6PnlJ/miJDlrozkuobjgpLjg4Hjgqfjg4Pjgq/jgZnjgovplqLmlbBcbiAgbG9hZENoZWNrKCkge1xuXG4gICAgY29uc29sZS5sb2coJ3N0YXJ0IHJlbmRlcicsIHRoaXMudGV4dHVyZSk7XG5cbiAgICAvLyDjg4bjgq/jgrnjg4Hjg6Pjga7nlJ/miJDjgpLjg4Hjgqfjg4Pjgq9cbiAgICBpZiAodGhpcy50ZXh0dXJlICE9IG51bGwpIHtcblxuICAgICAgLy8g55Sf5oiQ44GV44KM44Gm44GE44Gf44KJ44OG44Kv44K544OB44Oj44KS44OQ44Kk44Oz44OJ44GX44Gq44GK44GZXG4gICAgICB0aGlzLmdsLmJpbmRUZXh0dXJlKHRoaXMuZ2wuVEVYVFVSRV8yRCwgdGhpcy50ZXh0dXJlKTtcblxuICAgICAgLy8g44Os44Oz44OA44Oq44Oz44Kw6Zai5pWw44KS5ZG844Gz5Ye644GZXG4gICAgICB0aGlzLnJlbmRlcigpO1xuXG4gICAgICAvLyDlho3otbfjgpLmraLjgoHjgovjgZ/jgoHjgatyZXR1cm7jgZnjgotcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc29sZS5sb2coJ25vdyBsb2FkaW5nJyk7XG4gICAgLy8g5YaN5biw5ZG844Gz5Ye644GXXG4gICAgc2V0VGltZW91dCgoKSA9PiB7IHRoaXMubG9hZENoZWNrKCl9LCAxMDApO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2FtcGxlNztcbiIsIi8qXG4gKiBTYW1wbGUgN1xuICogdG9kbzog44OG44Kv44K544OB44OjXG4gKi9cblxuaW1wb3J0IHttYXRJViwgcXRuSVYsIHRvcnVzLCBjdWJlLCBoc3ZhICxzcGhlcmV9IGZyb20gXCIuL21pbk1hdHJpeFwiO1xuaW1wb3J0IHtvYmpzb25Db252ZXJ0LCB2ZWMzTm9ybWFsaXplLCBmYWNlTm9ybWFsfSBmcm9tIFwiLi9vYmpzb25cIjtcblxuY2xhc3MgU2FtcGxlOCB7XG4gIC8qKlxuICAgKiBjb25zdHJ1Y3RvclxuICAgKiDjgrPjg7Pjgrnjg4jjg6njgq/jgr9cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgLy9jYW52YXPjgbjjga7lj4LkuIrjgpLlpInmlbDjgavlj5blvpfjgZnjgotcbiAgICBsZXQgYyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKTtcbiAgICAvLyBzaXpl5oyH5a6aXG4gICAgYy53aWR0aCA9IDUxMjtcbiAgICBjLmhlaWdodCA9IDUxMjtcbiAgICB0aGlzLmNhbnZhcyA9IGM7XG5cbiAgICAvL1dlYkdM44Kz44Oz44OG44Kt44K544OI44KSY2FudmFz44GL44KJ5Y+W5b6X44GZ44KLXG4gICAgdGhpcy5nbCA9IGMuZ2V0Q29udGV4dCgnd2ViZ2wnKSB8fCBjLmdldENvbnRleHQoJ2V4cGVyaW1lbnRhbC13ZWJnbCcpO1xuXG4gICAgLy8g6KGM5YiX6KiI566XXG4gICAgdGhpcy5tYXQgPSBudWxsO1xuICAgIC8vIOODrOODs+ODgOODquODs+OCsOeUqOOCq+OCpuODs+OCv1xuICAgIHRoaXMuY291bnQgPSAwO1xuICB9XG5cbiAgLyoqXG4gICAqIHJ1blxuICAgKiDjgrXjg7Pjg5fjg6vjgrPjg7zjg4nlrp/ooYxcbiAgICovXG4gIHJ1bigpIHtcbiAgICBjb25zb2xlLmxvZygnU3RhcnQgU2FtcGxlNScpO1xuXG4gICAgLy8gV2ViR0zjgrPjg7Pjg4bjgq3jgrnjg4jjga7lj5blvpfjgYzjgafjgY3jgZ/jgYvjganjgYbjgYtcbiAgICBpZiAodGhpcy5nbCkge1xuICAgICAgY29uc29sZS5sb2coJ3N1cHBvcnRzIHdlYmdsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCd3ZWJnbCBub3Qgc3VwcG9ydGVkJyk7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyDjgq/jg6rjgqLjgZnjgovoibLjgpLmjIflrppcbiAgICB0aGlzLmdsLmNsZWFyQ29sb3IoMC4zLCAwLjMsIDAuMywgMS4wKTtcblxuICAgIHRoaXMuZ2wuY2xlYXJEZXB0aCgxLjApO1xuXG4gICAgLy8g44Ko44Os44Oh44Oz44OI44KS44Kv44Oq44KiXG4gICAgdGhpcy5nbC5jbGVhcih0aGlzLmdsLkNPTE9SX0JVRkZFUl9CSVQpO1xuXG4gICAgLy8g44K344Kn44O844OA44Go44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OIXG4gICAgY29uc3QgdmVydGV4U291cmNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZzJykudGV4dENvbnRlbnQ7XG4gICAgY29uc3QgZnJhZ21lbnRTb3VyY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZnMnKS50ZXh0Q29udGVudDtcblxuICAgIC8vIOODpuODvOOCtuODvOWumue+qeOBruODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiOeUn+aIkOmWouaVsFxuICAgIHRoaXMucHJvZ3JhbXMgPSB0aGlzLmNyZWF0ZVNoYWRlclByb2dyYW0odmVydGV4U291cmNlLCBmcmFnbWVudFNvdXJjZSk7XG5cbiAgICAvLyB1bmlmb3Jt44Ot44Kx44O844K344On44Oz44KS5Y+W5b6X44GX44Gm44GK44GPXG4gICAgdGhpcy51bmlMb2NhdGlvbiA9IHt9O1xuICAgIHRoaXMudW5pTG9jYXRpb24ubXZwTWF0cml4ID0gdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5wcm9ncmFtcywgJ212cE1hdHJpeCcpO1xuICAgIHRoaXMudW5pTG9jYXRpb24udGV4dHVyZSA9IHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMucHJvZ3JhbXMsICd0ZXh0dXJlJyk7XG5cbiAgICAvLyDnkIPkvZPjgpLlvaLmiJDjgZnjgovpoILngrnjga7jg4fjg7zjgr/jgpLlj5fjgZHlj5bjgotcbiAgICB0aGlzLnNwaGVyZURhdGEgPSBzcGhlcmUoNjQsIDY0LCAxLjApO1xuXG4gICAgLy8g6aCC54K544OH44O844K/44GL44KJ44OQ44OD44OV44Kh44KS55Sf5oiQ44GX44Gm6YWN5YiX44Gr5qC857SN44GX44Gm44GK44GPXG4gICAgdmFyIHZQb3NpdGlvbkJ1ZmZlciA9IHRoaXMuZ2VuZXJhdGVWQk8odGhpcy5zcGhlcmVEYXRhLnApO1xuICAgIHZhciB2VGV4Q29vcmRCdWZmZXIgPSB0aGlzLmdlbmVyYXRlVkJPKHRoaXMuc3BoZXJlRGF0YS50KTtcbiAgICB2YXIgdmJvTGlzdCA9IFt2UG9zaXRpb25CdWZmZXIsIHZUZXhDb29yZEJ1ZmZlcl07XG5cbiAgICAvLyBhdHRyaWJ1dGVMb2NhdGlvbuOCkuWPluW+l+OBl+OBpumFjeWIl+OBq+agvOe0jeOBmeOCi1xuICAgIHZhciBhdHRMb2NhdGlvbiA9IFtdO1xuICAgIGF0dExvY2F0aW9uWzBdID0gdGhpcy5nbC5nZXRBdHRyaWJMb2NhdGlvbih0aGlzLnByb2dyYW1zLCAncG9zaXRpb24nKTtcbiAgICBhdHRMb2NhdGlvblsxXSA9IHRoaXMuZ2wuZ2V0QXR0cmliTG9jYXRpb24odGhpcy5wcm9ncmFtcywgJ3RleENvb3JkJyk7XG5cbiAgICAvLyBhdHRyaWJ1dGXjga7jgrnjg4jjg6njgqTjg4njgpLphY3liJfjgavmoLzntI3jgZfjgabjgYrjgY9cbiAgICB2YXIgYXR0U3RyaWRlID0gW107XG4gICAgYXR0U3RyaWRlWzBdID0gMztcbiAgICBhdHRTdHJpZGVbMV0gPSAyO1xuXG5cbiAgICAvLyDjgqTjg7Pjg4fjg4Pjgq/jgrnjg5Djg4Pjg5XjgqHjga7nlJ/miJBcbiAgICB2YXIgaW5kZXhCdWZmZXIgPSB0aGlzLmdlbmVyYXRlSUJPKHRoaXMuc3BoZXJlRGF0YS5pKTtcblxuICAgIC8vIFZCT+OBqElCT+OCkueZu+mMsuOBl+OBpuOBiuOBj1xuICAgIHRoaXMuc2V0QXR0cmlidXRlKHZib0xpc3QsIGF0dExvY2F0aW9uLCBhdHRTdHJpZGUsIGluZGV4QnVmZmVyKTtcblxuICAgIC8vIOihjOWIl+OBruWIneacn+WMllxuICAgIHRoaXMubWF0ID0gbmV3IG1hdElWKCk7XG4gICAgdGhpcy5tTWF0cml4ID0gdGhpcy5tYXQuaWRlbnRpdHkodGhpcy5tYXQuY3JlYXRlKCkpO1xuICAgIHRoaXMudk1hdHJpeCA9IHRoaXMubWF0LmlkZW50aXR5KHRoaXMubWF0LmNyZWF0ZSgpKTtcbiAgICB0aGlzLnBNYXRyaXggPSB0aGlzLm1hdC5pZGVudGl0eSh0aGlzLm1hdC5jcmVhdGUoKSk7XG4gICAgdGhpcy52cE1hdHJpeCA9IHRoaXMubWF0LmlkZW50aXR5KHRoaXMubWF0LmNyZWF0ZSgpKTtcbiAgICB0aGlzLm12cE1hdHJpeCA9IHRoaXMubWF0LmlkZW50aXR5KHRoaXMubWF0LmNyZWF0ZSgpKTtcbiAgICB0aGlzLmludk1hdHJpeCA9IHRoaXMubWF0LmlkZW50aXR5KHRoaXMubWF0LmNyZWF0ZSgpKTtcblxuICAgIC8vIOODk+ODpeODvOW6p+aomeWkieaPm+ihjOWIl1xuICAgIHRoaXMuY2FtZXJhUG9zaXRpb24gPSBbMC4wLCAwLjAsIDUuMF07IC8vIOOCq+ODoeODqeOBruS9jee9rlxuICAgIHRoaXMuY2VudGVyUG9pbnQgPSBbMC4wLCAwLjAsIDAuMF07ICAgIC8vIOazqOimlueCuVxuICAgIHRoaXMuY2FtZXJhVXAgPSBbMC4wLCAxLjAsIDAuMF07ICAgICAgIC8vIOOCq+ODoeODqeOBruS4iuaWueWQkVxuICAgIHRoaXMubWF0Lmxvb2tBdCh0aGlzLmNhbWVyYVBvc2l0aW9uLCB0aGlzLmNlbnRlclBvaW50LCB0aGlzLmNhbWVyYVVwLCB0aGlzLnZNYXRyaXgpO1xuXG4gICAgLy8g44OX44Ot44K444Kn44Kv44K344On44Oz44Gu44Gf44KB44Gu5oOF5aCx44KS5o+D44GI44KLXG4gICAgbGV0IGZvdnkgPSA0NTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOimlumHjuinklxuICAgIGxldCBhc3BlY3QgPSB0aGlzLmNhbnZhcy53aWR0aCAvIHRoaXMuY2FudmFzLmhlaWdodDsgLy8g44Ki44K544Oa44Kv44OI5q+UXG4gICAgbGV0IG5lYXIgPSAwLjE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOepuumWk+OBruacgOWJjemdolxuICAgIGxldCBmYXIgPSAxMC4wOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDnqbrplpPjga7lpaXooYzjgY3ntYLnq69cbiAgICB0aGlzLm1hdC5wZXJzcGVjdGl2ZShmb3Z5LCBhc3BlY3QsIG5lYXIsIGZhciwgdGhpcy5wTWF0cml4KTtcblxuICAgIC8vIOihjOWIl+OCkuaOm+OBkeWQiOOCj+OBm+OBplZQ44Oe44OI44Oq44OD44Kv44K544KS55Sf5oiQ44GX44Gm44GK44GPXG4gICAgdGhpcy5tYXQubXVsdGlwbHkodGhpcy5wTWF0cml4LCB0aGlzLnZNYXRyaXgsIHRoaXMudnBNYXRyaXgpOyAgIC8vIHDjgat244KS5o6b44GR44KLXG5cbiAgICAvLyDlubPooYzlhYnmupDjga7lkJHjgY1cbiAgICB0aGlzLmxpZ2h0RGlyZWN0aW9uID0gWzEuMCwgMS4wLCAxLjBdO1xuXG4gICAgLy8g55Kw5aKD5YWJ44Gu6ImyXG4gICAgdGhpcy5hbWJpZW50Q29sb3IgPSBbMC41LCAwLjAsIDAuMCwgMS4wXTtcblxuICAgIC8vIOioreWumuOCkuacieWKueWMluOBmeOCi1xuICAgIHRoaXMuZ2wuZW5hYmxlKHRoaXMuZ2wuREVQVEhfVEVTVCk7XG4gICAgdGhpcy5nbC5kZXB0aEZ1bmModGhpcy5nbC5MRVFVQUwpO1xuXG4gICAgLy8g44OG44Kv44K544OB44Oj55Sf5oiQ6Zai5pWw44KS5ZG844Gz5Ye644GZXG4gICAgdGhpcy50ZXh0dXJlID0gbnVsbDtcbiAgICB0aGlzLmdlbmVyYXRlVGV4dHVyZSgnLi4vaW1hZ2Uvc3NmLmpwZycpO1xuXG4gICAgLy8g44Ot44O844OJ5a6M5LqG44KS44OB44Kn44OD44Kv44GZ44KL6Zai5pWw44KS5ZG844Gz5Ye644GZXG4gICAgdGhpcy5sb2FkQ2hlY2soKTtcblxuICB9XG5cbiAgLyoqXG4gICAqIOODrOODs+ODgOODquODs+OCsOmWouaVsOOBruWumue+qVxuICAgKi9cbiAgcmVuZGVyKCkge1xuXG4gICAgLy8g44Kr44Km44Oz44K/44KS44Kk44Oz44Kv44Oq44Oh44Oz44OI44GZ44KLXG4gICAgdGhpcy5jb3VudCsrO1xuXG4gICAgLy8gQ2FudmFz44Ko44Os44Oh44Oz44OI44KS44Kv44Oq44Ki44GZ44KLXG4gICAgdGhpcy5nbC5jbGVhcih0aGlzLmdsLkNPTE9SX0JVRkZFUl9CSVQgfCB0aGlzLmdsLkRFUFRIX0JVRkZFUl9CSVQpO1xuXG4gICAgLy8g44Oi44OH44Or5bqn5qiZ5aSJ5o+b6KGM5YiX44KS5LiA5bqm5Yid5pyf5YyW44GX44Gm44Oq44K744OD44OI44GZ44KLXG4gICAgdGhpcy5tYXQuaWRlbnRpdHkodGhpcy5tTWF0cml4KTtcblxuICAgIC8vIOODouODh+ODq+W6p+aomeWkieaPm+ihjOWIl1xuICAgIGxldCBheGlzID0gWzAuMCwgMS4wLCAwLjBdO1xuICAgIGxldCByYWRpYW5zID0gKHRoaXMuY291bnQgJSAzNjApICogTWF0aC5QSSAvIDE4MDtcbiAgICB0aGlzLm1hdC5yb3RhdGUodGhpcy5tTWF0cml4LCByYWRpYW5zLCBheGlzLCB0aGlzLm1NYXRyaXgpO1xuXG4gICAgLy8g6KGM5YiX44KS5o6b44GR5ZCI44KP44Gb44GmTVZQ44Oe44OI44Oq44OD44Kv44K544KS55Sf5oiQXG4gICAgdGhpcy5tYXQubXVsdGlwbHkodGhpcy52cE1hdHJpeCwgdGhpcy5tTWF0cml4LCB0aGlzLm12cE1hdHJpeCk7IC8vIOOBleOCieOBq23jgpLmjpvjgZHjgotcblxuICAgIC8vIOmAhuihjOWIl+OCkueUn+aIkFxuICAgIHRoaXMubWF0LmludmVyc2UodGhpcy5tTWF0cml4LCB0aGlzLmludk1hdHJpeCk7XG5cbiAgICAvLyDjgrfjgqfjg7zjg4DjgavmsY7nlKjjg4fjg7zjgr/jgpLpgIHkv6HjgZnjgotcbiAgICB0aGlzLmdsLnVuaWZvcm1NYXRyaXg0ZnYodGhpcy51bmlMb2NhdGlvbi5tdnBNYXRyaXgsIGZhbHNlLCB0aGlzLm12cE1hdHJpeCk7XG4gICAgdGhpcy5nbC51bmlmb3JtMWkodGhpcy51bmlMb2NhdGlvbi50ZXh0dXJlLCAwKTtcblxuICAgIC8vIOOCpOODs+ODh+ODg+OCr+OCueODkOODg+ODleOCoeOBq+OCiOOCi+aPj+eUu1xuICAgIHRoaXMuZ2wuZHJhd0VsZW1lbnRzKHRoaXMuZ2wuVFJJQU5HTEVTLCB0aGlzLnNwaGVyZURhdGEuaS5sZW5ndGgsIHRoaXMuZ2wuVU5TSUdORURfU0hPUlQsIDApO1xuICAgIHRoaXMuZ2wuZmx1c2goKTtcblxuICAgIC8vIOWGjeW4sOWRvOOBs+WHuuOBl1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKT0+IHtcbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogY3JlYXRlU2hhZGVyUHJvZ3JhbVxuICAgKiDjg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4jnlJ/miJDplqLmlbBcbiAgICovXG4gIGNyZWF0ZVNoYWRlclByb2dyYW0odmVydGV4U291cmNlLCBmcmFnbWVudFNvdXJjZSkge1xuXG4gICAgLy8g44K344Kn44O844OA44Kq44OW44K444Kn44Kv44OI44Gu55Sf5oiQXG4gICAgbGV0IHZlcnRleFNoYWRlciA9IHRoaXMuZ2wuY3JlYXRlU2hhZGVyKHRoaXMuZ2wuVkVSVEVYX1NIQURFUik7XG4gICAgbGV0IGZyYWdtZW50U2hhZGVyID0gdGhpcy5nbC5jcmVhdGVTaGFkZXIodGhpcy5nbC5GUkFHTUVOVF9TSEFERVIpO1xuXG4gICAgLy8g44K344Kn44O844OA44Gr44K944O844K544KS5Ymy44KK5b2T44Gm44Gm44Kz44Oz44OR44Kk44OrXG4gICAgdGhpcy5nbC5zaGFkZXJTb3VyY2UodmVydGV4U2hhZGVyLCB2ZXJ0ZXhTb3VyY2UpO1xuICAgIHRoaXMuZ2wuY29tcGlsZVNoYWRlcih2ZXJ0ZXhTaGFkZXIpO1xuICAgIHRoaXMuZ2wuc2hhZGVyU291cmNlKGZyYWdtZW50U2hhZGVyLCBmcmFnbWVudFNvdXJjZSk7XG4gICAgdGhpcy5nbC5jb21waWxlU2hhZGVyKGZyYWdtZW50U2hhZGVyKTtcblxuICAgIC8vIOOCt+OCp+ODvOODgOODvOOCs+ODs+ODkeOCpOODq+OBruOCqOODqeODvOWIpOWumlxuICAgIGlmICh0aGlzLmdsLmdldFNoYWRlclBhcmFtZXRlcih2ZXJ0ZXhTaGFkZXIsIHRoaXMuZ2wuQ09NUElMRV9TVEFUVVMpXG4gICAgICAmJiB0aGlzLmdsLmdldFNoYWRlclBhcmFtZXRlcihmcmFnbWVudFNoYWRlciwgdGhpcy5nbC5DT01QSUxFX1NUQVRVUykpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdTdWNjZXNzIFNoYWRlciBDb21waWxlJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCdGYWlsZCBTaGFkZXIgQ29tcGlsZScpO1xuICAgICAgY29uc29sZS5sb2coJ3ZlcnRleFNoYWRlcicsIHRoaXMuZ2wuZ2V0U2hhZGVySW5mb0xvZyh2ZXJ0ZXhTaGFkZXIpKTtcbiAgICAgIGNvbnNvbGUubG9nKCdmcmFnbWVudFNoYWRlcicsIHRoaXMuZ2wuZ2V0U2hhZGVySW5mb0xvZyhmcmFnbWVudFNoYWRlcikpO1xuICAgIH1cblxuICAgIC8vIOODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiOOBrueUn+aIkOOBi+OCiemBuOaKnuOBvuOBp1xuICAgIGNvbnN0IHByb2dyYW1zID0gdGhpcy5nbC5jcmVhdGVQcm9ncmFtKCk7XG5cbiAgICB0aGlzLmdsLmF0dGFjaFNoYWRlcihwcm9ncmFtcywgdmVydGV4U2hhZGVyKTtcbiAgICB0aGlzLmdsLmF0dGFjaFNoYWRlcihwcm9ncmFtcywgZnJhZ21lbnRTaGFkZXIpO1xuICAgIHRoaXMuZ2wubGlua1Byb2dyYW0ocHJvZ3JhbXMpO1xuXG4gICAgLy8g44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OI44Gu44Ko44Op44O85Yik5a6a5Yem55CGXG4gICAgaWYgKHRoaXMuZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcihwcm9ncmFtcywgdGhpcy5nbC5MSU5LX1NUQVRVUykpIHtcbiAgICAgIHRoaXMuZ2wudXNlUHJvZ3JhbShwcm9ncmFtcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgTGluayBQcm9ncmFtJywgdGhpcy5nbC5nZXRQcm9ncmFtSW5mb0xvZyhwcm9ncmFtcykpO1xuICAgIH1cblxuICAgIC8vIOeUn+aIkOOBl+OBn+ODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiOOCkuaIu+OCiuWApOOBqOOBl+OBpui/lOOBmVxuICAgIHJldHVybiBwcm9ncmFtcztcbiAgfVxuXG4gIC8vIOmggueCueODkOODg+ODleOCoe+8iFZCT++8ieOCkueUn+aIkOOBmeOCi+mWouaVsFxuICBnZW5lcmF0ZVZCTyhkYXRhKSB7XG4gICAgLy8g44OQ44OD44OV44Kh44Kq44OW44K444Kn44Kv44OI44Gu55Sf5oiQXG4gICAgdmFyIHZibyA9IHRoaXMuZ2wuY3JlYXRlQnVmZmVyKCk7XG5cbiAgICAvLyDjg5Djg4Pjg5XjgqHjgpLjg5DjgqTjg7Pjg4njgZnjgotcbiAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIHZibyk7XG5cbiAgICAvLyDjg5Djg4Pjg5XjgqHjgavjg4fjg7zjgr/jgpLjgrvjg4Pjg4hcbiAgICB0aGlzLmdsLmJ1ZmZlckRhdGEodGhpcy5nbC5BUlJBWV9CVUZGRVIsIG5ldyBGbG9hdDMyQXJyYXkoZGF0YSksIHRoaXMuZ2wuU1RBVElDX0RSQVcpO1xuXG4gICAgLy8g44OQ44OD44OV44Kh44Gu44OQ44Kk44Oz44OJ44KS54Sh5Yq55YyWXG4gICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCBudWxsKTtcblxuICAgIC8vIOeUn+aIkOOBl+OBnyBWQk8g44KS6L+U44GX44Gm57WC5LqGXG4gICAgcmV0dXJuIHZibztcbiAgfVxuXG4gIC8vIOOCpOODs+ODh+ODg+OCr+OCueODkOODg+ODleOCoe+8iElCT++8ieOCkueUn+aIkOOBmeOCi+mWouaVsFxuICBnZW5lcmF0ZUlCTyhkYXRhKSB7XG4gICAgLy8g44OQ44OD44OV44Kh44Kq44OW44K444Kn44Kv44OI44Gu55Sf5oiQXG4gICAgdmFyIGlibyA9IHRoaXMuZ2wuY3JlYXRlQnVmZmVyKCk7XG5cbiAgICAvLyDjg5Djg4Pjg5XjgqHjgpLjg5DjgqTjg7Pjg4njgZnjgotcbiAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgaWJvKTtcblxuICAgIC8vIOODkOODg+ODleOCoeOBq+ODh+ODvOOCv+OCkuOCu+ODg+ODiFxuICAgIHRoaXMuZ2wuYnVmZmVyRGF0YSh0aGlzLmdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBuZXcgSW50MTZBcnJheShkYXRhKSwgdGhpcy5nbC5TVEFUSUNfRFJBVyk7XG5cbiAgICAvLyDjg5Djg4Pjg5XjgqHjga7jg5DjgqTjg7Pjg4njgpLnhKHlirnljJZcbiAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgbnVsbCk7XG5cbiAgICAvLyDnlJ/miJDjgZfjgZ9JQk/jgpLov5TjgZfjgabntYLkuoZcbiAgICByZXR1cm4gaWJvO1xuICB9XG5cbiAgLy8gVkJP44GoSUJP44KS55m76Yyy44GZ44KL6Zai5pWwXG4gIHNldEF0dHJpYnV0ZSh2Ym8sIGF0dEwsIGF0dFMsIGlibykge1xuICAgIC8vIOW8leaVsOOBqOOBl+OBpuWPl+OBkeWPluOBo+OBn+mFjeWIl+OCkuWHpueQhuOBmeOCi1xuICAgIGZvciAodmFyIGkgaW4gdmJvKSB7XG4gICAgICAvLyDjg5Djg4Pjg5XjgqHjgpLjg5DjgqTjg7Pjg4njgZnjgotcbiAgICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkFSUkFZX0JVRkZFUiwgdmJvW2ldKTtcblxuICAgICAgLy8gYXR0cmlidXRlTG9jYXRpb27jgpLmnInlirnjgavjgZnjgotcbiAgICAgIHRoaXMuZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkoYXR0TFtpXSk7XG5cbiAgICAgIC8vIGF0dHJpYnV0ZUxvY2F0aW9u44KS6YCa55+l44GX55m76Yyy44GZ44KLXG4gICAgICB0aGlzLmdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYXR0TFtpXSwgYXR0U1tpXSwgdGhpcy5nbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xuICAgIH1cblxuICAgIC8vIOOCpOODs+ODh+ODg+OCr+OCueODkOODg+ODleOCoeOCkuODkOOCpOODs+ODieOBmeOCi1xuICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBpYm8pO1xuICB9XG5cbiAgLy8g44OG44Kv44K544OB44Oj44Kq44OW44K444Kn44Kv44OI44KS5Yid5pyf5YyW44GZ44KLXG4gIGdlbmVyYXRlVGV4dHVyZShzb3VyY2UpIHtcbiAgICAvLyDjgqTjg6Hjg7zjgrjjgqrjg5bjgrjjgqfjgq/jg4jjga7nlJ/miJBcbiAgICB2YXIgaW1nID0gbmV3IEltYWdlKCk7XG5cbiAgICAvLyDjg4fjg7zjgr/jga7jgqrjg7Pjg63jg7zjg4njgpLjg4jjg6rjgqzjgavjgZnjgotcbiAgICBpbWcub25sb2FkID0gKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2codGhpcy5nbCk7XG5cbiAgICAgIC8vIOODhuOCr+OCueODgeODo+OCquODluOCuOOCp+OCr+ODiOOBrueUn+aIkFxuICAgICAgdGhpcy50ZXh0dXJlID0gdGhpcy5nbC5jcmVhdGVUZXh0dXJlKCk7XG5cbiAgICAgIC8vIOODhuOCr+OCueODgeODo+OCkuODkOOCpOODs+ODieOBmeOCi1xuICAgICAgdGhpcy5nbC5iaW5kVGV4dHVyZSh0aGlzLmdsLlRFWFRVUkVfMkQsIHRoaXMudGV4dHVyZSk7XG5cbiAgICAgIC8vIOODhuOCr+OCueODgeODo+OBuOOCpOODoeODvOOCuOOCkumBqeeUqFxuICAgICAgdGhpcy5nbC50ZXhJbWFnZTJEKHRoaXMuZ2wuVEVYVFVSRV8yRCwgMCwgdGhpcy5nbC5SR0JBLCB0aGlzLmdsLlJHQkEsIHRoaXMuZ2wuVU5TSUdORURfQllURSwgaW1nKTtcblxuICAgICAgLy8g44Of44OD44OX44Oe44OD44OX44KS55Sf5oiQXG4gICAgICB0aGlzLmdsLmdlbmVyYXRlTWlwbWFwKHRoaXMuZ2wuVEVYVFVSRV8yRCk7XG5cbiAgICAgIC8vIOODhuOCr+OCueODgeODo+OBruODkOOCpOODs+ODieOCkueEoeWKueWMllxuICAgICAgdGhpcy5nbC5iaW5kVGV4dHVyZSh0aGlzLmdsLlRFWFRVUkVfMkQsIG51bGwpO1xuICAgIH07XG5cbiAgICAvLyDjgqTjg6Hjg7zjgrjjgqrjg5bjgrjjgqfjgq/jg4jjga7oqq3jgb/ovrzjgb/jgpLplovlp4tcbiAgICBpbWcuc3JjID0gc291cmNlO1xuICB9XG5cbiAgLy8g44OG44Kv44K544OB44Oj55Sf5oiQ5a6M5LqG44KS44OB44Kn44OD44Kv44GZ44KL6Zai5pWwXG4gIGxvYWRDaGVjaygpIHtcblxuICAgIGNvbnNvbGUubG9nKCdzdGFydCByZW5kZXInLCB0aGlzLnRleHR1cmUpO1xuXG4gICAgLy8g44OG44Kv44K544OB44Oj44Gu55Sf5oiQ44KS44OB44Kn44OD44KvXG4gICAgaWYgKHRoaXMudGV4dHVyZSAhPSBudWxsKSB7XG5cbiAgICAgIC8vIOeUn+aIkOOBleOCjOOBpuOBhOOBn+OCieODhuOCr+OCueODgeODo+OCkuODkOOCpOODs+ODieOBl+OBquOBiuOBmVxuICAgICAgdGhpcy5nbC5iaW5kVGV4dHVyZSh0aGlzLmdsLlRFWFRVUkVfMkQsIHRoaXMudGV4dHVyZSk7XG5cbiAgICAgIC8vIOODrOODs+ODgOODquODs+OCsOmWouaVsOOCkuWRvOOBs+WHuuOBmVxuICAgICAgdGhpcy5yZW5kZXIoKTtcblxuICAgICAgLy8g5YaN6LW344KS5q2i44KB44KL44Gf44KB44GrcmV0dXJu44GZ44KLXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKCdub3cgbG9hZGluZycpO1xuICAgIC8vIOWGjeW4sOWRvOOBs+WHuuOBl1xuICAgIHNldFRpbWVvdXQoKCkgPT4geyB0aGlzLmxvYWRDaGVjaygpfSwgMTAwKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNhbXBsZTg7XG4iLCJpbXBvcnQgU2FtcGxlMSBmcm9tIFwiLi9TYW1wbGUxXCI7XG5pbXBvcnQgU2FtcGxlMiBmcm9tIFwiLi9TYW1wbGUyXCI7XG5pbXBvcnQgU2FtcGxlMyBmcm9tIFwiLi9TYW1wbGUzXCI7XG5pbXBvcnQgU2FtcGxlNCBmcm9tIFwiLi9TYW1wbGU0XCI7XG5pbXBvcnQgU2FtcGxlNSBmcm9tIFwiLi9TYW1wbGU1XCI7XG5pbXBvcnQgU2FtcGxlNiBmcm9tIFwiLi9TYW1wbGU2XCI7XG5pbXBvcnQgU2FtcGxlNyBmcm9tIFwiLi9TYW1wbGU3XCI7XG5pbXBvcnQgU2FtcGxlOCBmcm9tIFwiLi9TYW1wbGU4XCI7XG5cbndpbmRvdy5zYW1wbGUxID0gbmV3IFNhbXBsZTEoKTtcbndpbmRvdy5zYW1wbGUyID0gbmV3IFNhbXBsZTIoKTtcbndpbmRvdy5zYW1wbGUzID0gbmV3IFNhbXBsZTMoKTtcbndpbmRvdy5zYW1wbGU0ID0gbmV3IFNhbXBsZTQoKTtcbndpbmRvdy5zYW1wbGU1ID0gbmV3IFNhbXBsZTUoKTtcbndpbmRvdy5zYW1wbGU2ID0gbmV3IFNhbXBsZTYoKTtcbndpbmRvdy5zYW1wbGU3ID0gbmV3IFNhbXBsZTcoKTtcbndpbmRvdy5zYW1wbGU4ID0gbmV3IFNhbXBsZTgoKTtcbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gbWluTWF0cml4LmpzXG4vLyB2ZXJzaW9uIDAuMC4zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZXhwb3J0IGNsYXNzIG1hdElWIHtcbiAgICBjcmVhdGUgKCkge1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheSgxNik7XG4gICAgfTtcbiAgICBpZGVudGl0eSAoZGVzdCkge1xuICAgICAgICBkZXN0WzBdID0gMTtcbiAgICAgICAgZGVzdFsxXSA9IDA7XG4gICAgICAgIGRlc3RbMl0gPSAwO1xuICAgICAgICBkZXN0WzNdID0gMDtcbiAgICAgICAgZGVzdFs0XSA9IDA7XG4gICAgICAgIGRlc3RbNV0gPSAxO1xuICAgICAgICBkZXN0WzZdID0gMDtcbiAgICAgICAgZGVzdFs3XSA9IDA7XG4gICAgICAgIGRlc3RbOF0gPSAwO1xuICAgICAgICBkZXN0WzldID0gMDtcbiAgICAgICAgZGVzdFsxMF0gPSAxO1xuICAgICAgICBkZXN0WzExXSA9IDA7XG4gICAgICAgIGRlc3RbMTJdID0gMDtcbiAgICAgICAgZGVzdFsxM10gPSAwO1xuICAgICAgICBkZXN0WzE0XSA9IDA7XG4gICAgICAgIGRlc3RbMTVdID0gMTtcbiAgICAgICAgcmV0dXJuIGRlc3Q7XG4gICAgfTtcbiAgICBtdWx0aXBseSAobWF0MSwgbWF0MiwgZGVzdCkge1xuICAgICAgICBsZXQgYSA9IG1hdDFbMF0sIGIgPSBtYXQxWzFdLCBjID0gbWF0MVsyXSwgZCA9IG1hdDFbM10sXG4gICAgICAgICAgICBlID0gbWF0MVs0XSwgZiA9IG1hdDFbNV0sIGcgPSBtYXQxWzZdLCBoID0gbWF0MVs3XSxcbiAgICAgICAgICAgIGkgPSBtYXQxWzhdLCBqID0gbWF0MVs5XSwgayA9IG1hdDFbMTBdLCBsID0gbWF0MVsxMV0sXG4gICAgICAgICAgICBtID0gbWF0MVsxMl0sIG4gPSBtYXQxWzEzXSwgbyA9IG1hdDFbMTRdLCBwID0gbWF0MVsxNV0sXG4gICAgICAgICAgICBBID0gbWF0MlswXSwgQiA9IG1hdDJbMV0sIEMgPSBtYXQyWzJdLCBEID0gbWF0MlszXSxcbiAgICAgICAgICAgIEUgPSBtYXQyWzRdLCBGID0gbWF0Mls1XSwgRyA9IG1hdDJbNl0sIEggPSBtYXQyWzddLFxuICAgICAgICAgICAgSSA9IG1hdDJbOF0sIEogPSBtYXQyWzldLCBLID0gbWF0MlsxMF0sIEwgPSBtYXQyWzExXSxcbiAgICAgICAgICAgIE0gPSBtYXQyWzEyXSwgTiA9IG1hdDJbMTNdLCBPID0gbWF0MlsxNF0sIFAgPSBtYXQyWzE1XTtcbiAgICAgICAgZGVzdFswXSA9IEEgKiBhICsgQiAqIGUgKyBDICogaSArIEQgKiBtO1xuICAgICAgICBkZXN0WzFdID0gQSAqIGIgKyBCICogZiArIEMgKiBqICsgRCAqIG47XG4gICAgICAgIGRlc3RbMl0gPSBBICogYyArIEIgKiBnICsgQyAqIGsgKyBEICogbztcbiAgICAgICAgZGVzdFszXSA9IEEgKiBkICsgQiAqIGggKyBDICogbCArIEQgKiBwO1xuICAgICAgICBkZXN0WzRdID0gRSAqIGEgKyBGICogZSArIEcgKiBpICsgSCAqIG07XG4gICAgICAgIGRlc3RbNV0gPSBFICogYiArIEYgKiBmICsgRyAqIGogKyBIICogbjtcbiAgICAgICAgZGVzdFs2XSA9IEUgKiBjICsgRiAqIGcgKyBHICogayArIEggKiBvO1xuICAgICAgICBkZXN0WzddID0gRSAqIGQgKyBGICogaCArIEcgKiBsICsgSCAqIHA7XG4gICAgICAgIGRlc3RbOF0gPSBJICogYSArIEogKiBlICsgSyAqIGkgKyBMICogbTtcbiAgICAgICAgZGVzdFs5XSA9IEkgKiBiICsgSiAqIGYgKyBLICogaiArIEwgKiBuO1xuICAgICAgICBkZXN0WzEwXSA9IEkgKiBjICsgSiAqIGcgKyBLICogayArIEwgKiBvO1xuICAgICAgICBkZXN0WzExXSA9IEkgKiBkICsgSiAqIGggKyBLICogbCArIEwgKiBwO1xuICAgICAgICBkZXN0WzEyXSA9IE0gKiBhICsgTiAqIGUgKyBPICogaSArIFAgKiBtO1xuICAgICAgICBkZXN0WzEzXSA9IE0gKiBiICsgTiAqIGYgKyBPICogaiArIFAgKiBuO1xuICAgICAgICBkZXN0WzE0XSA9IE0gKiBjICsgTiAqIGcgKyBPICogayArIFAgKiBvO1xuICAgICAgICBkZXN0WzE1XSA9IE0gKiBkICsgTiAqIGggKyBPICogbCArIFAgKiBwO1xuICAgICAgICByZXR1cm4gZGVzdDtcbiAgICB9O1xuICAgIHNjYWxlIChtYXQsIHZlYywgZGVzdCkge1xuICAgICAgICBkZXN0WzBdID0gbWF0WzBdICogdmVjWzBdO1xuICAgICAgICBkZXN0WzFdID0gbWF0WzFdICogdmVjWzBdO1xuICAgICAgICBkZXN0WzJdID0gbWF0WzJdICogdmVjWzBdO1xuICAgICAgICBkZXN0WzNdID0gbWF0WzNdICogdmVjWzBdO1xuICAgICAgICBkZXN0WzRdID0gbWF0WzRdICogdmVjWzFdO1xuICAgICAgICBkZXN0WzVdID0gbWF0WzVdICogdmVjWzFdO1xuICAgICAgICBkZXN0WzZdID0gbWF0WzZdICogdmVjWzFdO1xuICAgICAgICBkZXN0WzddID0gbWF0WzddICogdmVjWzFdO1xuICAgICAgICBkZXN0WzhdID0gbWF0WzhdICogdmVjWzJdO1xuICAgICAgICBkZXN0WzldID0gbWF0WzldICogdmVjWzJdO1xuICAgICAgICBkZXN0WzEwXSA9IG1hdFsxMF0gKiB2ZWNbMl07XG4gICAgICAgIGRlc3RbMTFdID0gbWF0WzExXSAqIHZlY1syXTtcbiAgICAgICAgZGVzdFsxMl0gPSBtYXRbMTJdO1xuICAgICAgICBkZXN0WzEzXSA9IG1hdFsxM107XG4gICAgICAgIGRlc3RbMTRdID0gbWF0WzE0XTtcbiAgICAgICAgZGVzdFsxNV0gPSBtYXRbMTVdO1xuICAgICAgICByZXR1cm4gZGVzdDtcbiAgICB9O1xuICAgIHRyYW5zbGF0ZSAobWF0LCB2ZWMsIGRlc3QpIHtcbiAgICAgICAgZGVzdFswXSA9IG1hdFswXTtcbiAgICAgICAgZGVzdFsxXSA9IG1hdFsxXTtcbiAgICAgICAgZGVzdFsyXSA9IG1hdFsyXTtcbiAgICAgICAgZGVzdFszXSA9IG1hdFszXTtcbiAgICAgICAgZGVzdFs0XSA9IG1hdFs0XTtcbiAgICAgICAgZGVzdFs1XSA9IG1hdFs1XTtcbiAgICAgICAgZGVzdFs2XSA9IG1hdFs2XTtcbiAgICAgICAgZGVzdFs3XSA9IG1hdFs3XTtcbiAgICAgICAgZGVzdFs4XSA9IG1hdFs4XTtcbiAgICAgICAgZGVzdFs5XSA9IG1hdFs5XTtcbiAgICAgICAgZGVzdFsxMF0gPSBtYXRbMTBdO1xuICAgICAgICBkZXN0WzExXSA9IG1hdFsxMV07XG4gICAgICAgIGRlc3RbMTJdID0gbWF0WzBdICogdmVjWzBdICsgbWF0WzRdICogdmVjWzFdICsgbWF0WzhdICogdmVjWzJdICsgbWF0WzEyXTtcbiAgICAgICAgZGVzdFsxM10gPSBtYXRbMV0gKiB2ZWNbMF0gKyBtYXRbNV0gKiB2ZWNbMV0gKyBtYXRbOV0gKiB2ZWNbMl0gKyBtYXRbMTNdO1xuICAgICAgICBkZXN0WzE0XSA9IG1hdFsyXSAqIHZlY1swXSArIG1hdFs2XSAqIHZlY1sxXSArIG1hdFsxMF0gKiB2ZWNbMl0gKyBtYXRbMTRdO1xuICAgICAgICBkZXN0WzE1XSA9IG1hdFszXSAqIHZlY1swXSArIG1hdFs3XSAqIHZlY1sxXSArIG1hdFsxMV0gKiB2ZWNbMl0gKyBtYXRbMTVdO1xuICAgICAgICByZXR1cm4gZGVzdDtcbiAgICB9O1xuICAgIHJvdGF0ZSAobWF0LCBhbmdsZSwgYXhpcywgZGVzdCkge1xuICAgICAgICBsZXQgc3EgPSBNYXRoLnNxcnQoYXhpc1swXSAqIGF4aXNbMF0gKyBheGlzWzFdICogYXhpc1sxXSArIGF4aXNbMl0gKiBheGlzWzJdKTtcbiAgICAgICAgaWYgKCFzcSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGEgPSBheGlzWzBdLCBiID0gYXhpc1sxXSwgYyA9IGF4aXNbMl07XG4gICAgICAgIGlmIChzcSAhPSAxKSB7XG4gICAgICAgICAgICBzcSA9IDEgLyBzcTtcbiAgICAgICAgICAgIGEgKj0gc3E7XG4gICAgICAgICAgICBiICo9IHNxO1xuICAgICAgICAgICAgYyAqPSBzcTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZCA9IE1hdGguc2luKGFuZ2xlKSwgZSA9IE1hdGguY29zKGFuZ2xlKSwgZiA9IDEgLSBlLFxuICAgICAgICAgICAgZyA9IG1hdFswXSwgaCA9IG1hdFsxXSwgaSA9IG1hdFsyXSwgaiA9IG1hdFszXSxcbiAgICAgICAgICAgIGsgPSBtYXRbNF0sIGwgPSBtYXRbNV0sIG0gPSBtYXRbNl0sIG4gPSBtYXRbN10sXG4gICAgICAgICAgICBvID0gbWF0WzhdLCBwID0gbWF0WzldLCBxID0gbWF0WzEwXSwgciA9IG1hdFsxMV0sXG4gICAgICAgICAgICBzID0gYSAqIGEgKiBmICsgZSxcbiAgICAgICAgICAgIHQgPSBiICogYSAqIGYgKyBjICogZCxcbiAgICAgICAgICAgIHUgPSBjICogYSAqIGYgLSBiICogZCxcbiAgICAgICAgICAgIHYgPSBhICogYiAqIGYgLSBjICogZCxcbiAgICAgICAgICAgIHcgPSBiICogYiAqIGYgKyBlLFxuICAgICAgICAgICAgeCA9IGMgKiBiICogZiArIGEgKiBkLFxuICAgICAgICAgICAgeSA9IGEgKiBjICogZiArIGIgKiBkLFxuICAgICAgICAgICAgeiA9IGIgKiBjICogZiAtIGEgKiBkLFxuICAgICAgICAgICAgQSA9IGMgKiBjICogZiArIGU7XG4gICAgICAgIGlmIChhbmdsZSkge1xuICAgICAgICAgICAgaWYgKG1hdCAhPSBkZXN0KSB7XG4gICAgICAgICAgICAgICAgZGVzdFsxMl0gPSBtYXRbMTJdO1xuICAgICAgICAgICAgICAgIGRlc3RbMTNdID0gbWF0WzEzXTtcbiAgICAgICAgICAgICAgICBkZXN0WzE0XSA9IG1hdFsxNF07XG4gICAgICAgICAgICAgICAgZGVzdFsxNV0gPSBtYXRbMTVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGVzdCA9IG1hdDtcbiAgICAgICAgfVxuICAgICAgICBkZXN0WzBdID0gZyAqIHMgKyBrICogdCArIG8gKiB1O1xuICAgICAgICBkZXN0WzFdID0gaCAqIHMgKyBsICogdCArIHAgKiB1O1xuICAgICAgICBkZXN0WzJdID0gaSAqIHMgKyBtICogdCArIHEgKiB1O1xuICAgICAgICBkZXN0WzNdID0gaiAqIHMgKyBuICogdCArIHIgKiB1O1xuICAgICAgICBkZXN0WzRdID0gZyAqIHYgKyBrICogdyArIG8gKiB4O1xuICAgICAgICBkZXN0WzVdID0gaCAqIHYgKyBsICogdyArIHAgKiB4O1xuICAgICAgICBkZXN0WzZdID0gaSAqIHYgKyBtICogdyArIHEgKiB4O1xuICAgICAgICBkZXN0WzddID0gaiAqIHYgKyBuICogdyArIHIgKiB4O1xuICAgICAgICBkZXN0WzhdID0gZyAqIHkgKyBrICogeiArIG8gKiBBO1xuICAgICAgICBkZXN0WzldID0gaCAqIHkgKyBsICogeiArIHAgKiBBO1xuICAgICAgICBkZXN0WzEwXSA9IGkgKiB5ICsgbSAqIHogKyBxICogQTtcbiAgICAgICAgZGVzdFsxMV0gPSBqICogeSArIG4gKiB6ICsgciAqIEE7XG4gICAgICAgIHJldHVybiBkZXN0O1xuICAgIH07XG4gICAgbG9va0F0IChleWUsIGNlbnRlciwgdXAsIGRlc3QpIHtcbiAgICAgICAgbGV0IGV5ZVggPSBleWVbMF0sIGV5ZVkgPSBleWVbMV0sIGV5ZVogPSBleWVbMl0sXG4gICAgICAgICAgICB1cFggPSB1cFswXSwgdXBZID0gdXBbMV0sIHVwWiA9IHVwWzJdLFxuICAgICAgICAgICAgY2VudGVyWCA9IGNlbnRlclswXSwgY2VudGVyWSA9IGNlbnRlclsxXSwgY2VudGVyWiA9IGNlbnRlclsyXTtcbiAgICAgICAgaWYgKGV5ZVggPT0gY2VudGVyWCAmJiBleWVZID09IGNlbnRlclkgJiYgZXllWiA9PSBjZW50ZXJaKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pZGVudGl0eShkZXN0KTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgeDAsIHgxLCB4MiwgeTAsIHkxLCB5MiwgejAsIHoxLCB6MiwgbDtcbiAgICAgICAgejAgPSBleWVYIC0gY2VudGVyWzBdO1xuICAgICAgICB6MSA9IGV5ZVkgLSBjZW50ZXJbMV07XG4gICAgICAgIHoyID0gZXllWiAtIGNlbnRlclsyXTtcbiAgICAgICAgbCA9IDEgLyBNYXRoLnNxcnQoejAgKiB6MCArIHoxICogejEgKyB6MiAqIHoyKTtcbiAgICAgICAgejAgKj0gbDtcbiAgICAgICAgejEgKj0gbDtcbiAgICAgICAgejIgKj0gbDtcbiAgICAgICAgeDAgPSB1cFkgKiB6MiAtIHVwWiAqIHoxO1xuICAgICAgICB4MSA9IHVwWiAqIHowIC0gdXBYICogejI7XG4gICAgICAgIHgyID0gdXBYICogejEgLSB1cFkgKiB6MDtcbiAgICAgICAgbCA9IE1hdGguc3FydCh4MCAqIHgwICsgeDEgKiB4MSArIHgyICogeDIpO1xuICAgICAgICBpZiAoIWwpIHtcbiAgICAgICAgICAgIHgwID0gMDtcbiAgICAgICAgICAgIHgxID0gMDtcbiAgICAgICAgICAgIHgyID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGwgPSAxIC8gbDtcbiAgICAgICAgICAgIHgwICo9IGw7XG4gICAgICAgICAgICB4MSAqPSBsO1xuICAgICAgICAgICAgeDIgKj0gbDtcbiAgICAgICAgfVxuICAgICAgICB5MCA9IHoxICogeDIgLSB6MiAqIHgxO1xuICAgICAgICB5MSA9IHoyICogeDAgLSB6MCAqIHgyO1xuICAgICAgICB5MiA9IHowICogeDEgLSB6MSAqIHgwO1xuICAgICAgICBsID0gTWF0aC5zcXJ0KHkwICogeTAgKyB5MSAqIHkxICsgeTIgKiB5Mik7XG4gICAgICAgIGlmICghbCkge1xuICAgICAgICAgICAgeTAgPSAwO1xuICAgICAgICAgICAgeTEgPSAwO1xuICAgICAgICAgICAgeTIgPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbCA9IDEgLyBsO1xuICAgICAgICAgICAgeTAgKj0gbDtcbiAgICAgICAgICAgIHkxICo9IGw7XG4gICAgICAgICAgICB5MiAqPSBsO1xuICAgICAgICB9XG4gICAgICAgIGRlc3RbMF0gPSB4MDtcbiAgICAgICAgZGVzdFsxXSA9IHkwO1xuICAgICAgICBkZXN0WzJdID0gejA7XG4gICAgICAgIGRlc3RbM10gPSAwO1xuICAgICAgICBkZXN0WzRdID0geDE7XG4gICAgICAgIGRlc3RbNV0gPSB5MTtcbiAgICAgICAgZGVzdFs2XSA9IHoxO1xuICAgICAgICBkZXN0WzddID0gMDtcbiAgICAgICAgZGVzdFs4XSA9IHgyO1xuICAgICAgICBkZXN0WzldID0geTI7XG4gICAgICAgIGRlc3RbMTBdID0gejI7XG4gICAgICAgIGRlc3RbMTFdID0gMDtcbiAgICAgICAgZGVzdFsxMl0gPSAtKHgwICogZXllWCArIHgxICogZXllWSArIHgyICogZXllWik7XG4gICAgICAgIGRlc3RbMTNdID0gLSh5MCAqIGV5ZVggKyB5MSAqIGV5ZVkgKyB5MiAqIGV5ZVopO1xuICAgICAgICBkZXN0WzE0XSA9IC0oejAgKiBleWVYICsgejEgKiBleWVZICsgejIgKiBleWVaKTtcbiAgICAgICAgZGVzdFsxNV0gPSAxO1xuICAgICAgICByZXR1cm4gZGVzdDtcbiAgICB9O1xuICAgIHBlcnNwZWN0aXZlIChmb3Z5LCBhc3BlY3QsIG5lYXIsIGZhciwgZGVzdCkge1xuICAgICAgICBsZXQgdCA9IG5lYXIgKiBNYXRoLnRhbihmb3Z5ICogTWF0aC5QSSAvIDM2MCk7XG4gICAgICAgIGxldCByID0gdCAqIGFzcGVjdDtcbiAgICAgICAgbGV0IGEgPSByICogMiwgYiA9IHQgKiAyLCBjID0gZmFyIC0gbmVhcjtcbiAgICAgICAgZGVzdFswXSA9IG5lYXIgKiAyIC8gYTtcbiAgICAgICAgZGVzdFsxXSA9IDA7XG4gICAgICAgIGRlc3RbMl0gPSAwO1xuICAgICAgICBkZXN0WzNdID0gMDtcbiAgICAgICAgZGVzdFs0XSA9IDA7XG4gICAgICAgIGRlc3RbNV0gPSBuZWFyICogMiAvIGI7XG4gICAgICAgIGRlc3RbNl0gPSAwO1xuICAgICAgICBkZXN0WzddID0gMDtcbiAgICAgICAgZGVzdFs4XSA9IDA7XG4gICAgICAgIGRlc3RbOV0gPSAwO1xuICAgICAgICBkZXN0WzEwXSA9IC0oZmFyICsgbmVhcikgLyBjO1xuICAgICAgICBkZXN0WzExXSA9IC0xO1xuICAgICAgICBkZXN0WzEyXSA9IDA7XG4gICAgICAgIGRlc3RbMTNdID0gMDtcbiAgICAgICAgZGVzdFsxNF0gPSAtKGZhciAqIG5lYXIgKiAyKSAvIGM7XG4gICAgICAgIGRlc3RbMTVdID0gMDtcbiAgICAgICAgcmV0dXJuIGRlc3Q7XG4gICAgfTtcbiAgICBvcnRobyAobGVmdCwgcmlnaHQsIHRvcCwgYm90dG9tLCBuZWFyLCBmYXIsIGRlc3QpIHtcbiAgICAgICAgbGV0IGggPSAocmlnaHQgLSBsZWZ0KTtcbiAgICAgICAgbGV0IHYgPSAodG9wIC0gYm90dG9tKTtcbiAgICAgICAgbGV0IGQgPSAoZmFyIC0gbmVhcik7XG4gICAgICAgIGRlc3RbMF0gPSAyIC8gaDtcbiAgICAgICAgZGVzdFsxXSA9IDA7XG4gICAgICAgIGRlc3RbMl0gPSAwO1xuICAgICAgICBkZXN0WzNdID0gMDtcbiAgICAgICAgZGVzdFs0XSA9IDA7XG4gICAgICAgIGRlc3RbNV0gPSAyIC8gdjtcbiAgICAgICAgZGVzdFs2XSA9IDA7XG4gICAgICAgIGRlc3RbN10gPSAwO1xuICAgICAgICBkZXN0WzhdID0gMDtcbiAgICAgICAgZGVzdFs5XSA9IDA7XG4gICAgICAgIGRlc3RbMTBdID0gLTIgLyBkO1xuICAgICAgICBkZXN0WzExXSA9IDA7XG4gICAgICAgIGRlc3RbMTJdID0gLShsZWZ0ICsgcmlnaHQpIC8gaDtcbiAgICAgICAgZGVzdFsxM10gPSAtKHRvcCArIGJvdHRvbSkgLyB2O1xuICAgICAgICBkZXN0WzE0XSA9IC0oZmFyICsgbmVhcikgLyBkO1xuICAgICAgICBkZXN0WzE1XSA9IDE7XG4gICAgICAgIHJldHVybiBkZXN0O1xuICAgIH07XG4gICAgdHJhbnNwb3NlIChtYXQsIGRlc3QpIHtcbiAgICAgICAgZGVzdFswXSA9IG1hdFswXTtcbiAgICAgICAgZGVzdFsxXSA9IG1hdFs0XTtcbiAgICAgICAgZGVzdFsyXSA9IG1hdFs4XTtcbiAgICAgICAgZGVzdFszXSA9IG1hdFsxMl07XG4gICAgICAgIGRlc3RbNF0gPSBtYXRbMV07XG4gICAgICAgIGRlc3RbNV0gPSBtYXRbNV07XG4gICAgICAgIGRlc3RbNl0gPSBtYXRbOV07XG4gICAgICAgIGRlc3RbN10gPSBtYXRbMTNdO1xuICAgICAgICBkZXN0WzhdID0gbWF0WzJdO1xuICAgICAgICBkZXN0WzldID0gbWF0WzZdO1xuICAgICAgICBkZXN0WzEwXSA9IG1hdFsxMF07XG4gICAgICAgIGRlc3RbMTFdID0gbWF0WzE0XTtcbiAgICAgICAgZGVzdFsxMl0gPSBtYXRbM107XG4gICAgICAgIGRlc3RbMTNdID0gbWF0WzddO1xuICAgICAgICBkZXN0WzE0XSA9IG1hdFsxMV07XG4gICAgICAgIGRlc3RbMTVdID0gbWF0WzE1XTtcbiAgICAgICAgcmV0dXJuIGRlc3Q7XG4gICAgfTtcbiAgICBpbnZlcnNlIChtYXQsIGRlc3QpIHtcbiAgICAgICAgbGV0IGEgPSBtYXRbMF0sIGIgPSBtYXRbMV0sIGMgPSBtYXRbMl0sIGQgPSBtYXRbM10sXG4gICAgICAgICAgICBlID0gbWF0WzRdLCBmID0gbWF0WzVdLCBnID0gbWF0WzZdLCBoID0gbWF0WzddLFxuICAgICAgICAgICAgaSA9IG1hdFs4XSwgaiA9IG1hdFs5XSwgayA9IG1hdFsxMF0sIGwgPSBtYXRbMTFdLFxuICAgICAgICAgICAgbSA9IG1hdFsxMl0sIG4gPSBtYXRbMTNdLCBvID0gbWF0WzE0XSwgcCA9IG1hdFsxNV0sXG4gICAgICAgICAgICBxID0gYSAqIGYgLSBiICogZSwgciA9IGEgKiBnIC0gYyAqIGUsXG4gICAgICAgICAgICBzID0gYSAqIGggLSBkICogZSwgdCA9IGIgKiBnIC0gYyAqIGYsXG4gICAgICAgICAgICB1ID0gYiAqIGggLSBkICogZiwgdiA9IGMgKiBoIC0gZCAqIGcsXG4gICAgICAgICAgICB3ID0gaSAqIG4gLSBqICogbSwgeCA9IGkgKiBvIC0gayAqIG0sXG4gICAgICAgICAgICB5ID0gaSAqIHAgLSBsICogbSwgeiA9IGogKiBvIC0gayAqIG4sXG4gICAgICAgICAgICBBID0gaiAqIHAgLSBsICogbiwgQiA9IGsgKiBwIC0gbCAqIG8sXG4gICAgICAgICAgICBpdmQgPSAxIC8gKHEgKiBCIC0gciAqIEEgKyBzICogeiArIHQgKiB5IC0gdSAqIHggKyB2ICogdyk7XG4gICAgICAgIGRlc3RbMF0gPSAoIGYgKiBCIC0gZyAqIEEgKyBoICogeikgKiBpdmQ7XG4gICAgICAgIGRlc3RbMV0gPSAoLWIgKiBCICsgYyAqIEEgLSBkICogeikgKiBpdmQ7XG4gICAgICAgIGRlc3RbMl0gPSAoIG4gKiB2IC0gbyAqIHUgKyBwICogdCkgKiBpdmQ7XG4gICAgICAgIGRlc3RbM10gPSAoLWogKiB2ICsgayAqIHUgLSBsICogdCkgKiBpdmQ7XG4gICAgICAgIGRlc3RbNF0gPSAoLWUgKiBCICsgZyAqIHkgLSBoICogeCkgKiBpdmQ7XG4gICAgICAgIGRlc3RbNV0gPSAoIGEgKiBCIC0gYyAqIHkgKyBkICogeCkgKiBpdmQ7XG4gICAgICAgIGRlc3RbNl0gPSAoLW0gKiB2ICsgbyAqIHMgLSBwICogcikgKiBpdmQ7XG4gICAgICAgIGRlc3RbN10gPSAoIGkgKiB2IC0gayAqIHMgKyBsICogcikgKiBpdmQ7XG4gICAgICAgIGRlc3RbOF0gPSAoIGUgKiBBIC0gZiAqIHkgKyBoICogdykgKiBpdmQ7XG4gICAgICAgIGRlc3RbOV0gPSAoLWEgKiBBICsgYiAqIHkgLSBkICogdykgKiBpdmQ7XG4gICAgICAgIGRlc3RbMTBdID0gKCBtICogdSAtIG4gKiBzICsgcCAqIHEpICogaXZkO1xuICAgICAgICBkZXN0WzExXSA9ICgtaSAqIHUgKyBqICogcyAtIGwgKiBxKSAqIGl2ZDtcbiAgICAgICAgZGVzdFsxMl0gPSAoLWUgKiB6ICsgZiAqIHggLSBnICogdykgKiBpdmQ7XG4gICAgICAgIGRlc3RbMTNdID0gKCBhICogeiAtIGIgKiB4ICsgYyAqIHcpICogaXZkO1xuICAgICAgICBkZXN0WzE0XSA9ICgtbSAqIHQgKyBuICogciAtIG8gKiBxKSAqIGl2ZDtcbiAgICAgICAgZGVzdFsxNV0gPSAoIGkgKiB0IC0gaiAqIHIgKyBrICogcSkgKiBpdmQ7XG4gICAgICAgIHJldHVybiBkZXN0O1xuICAgIH07XG59XG5cbmV4cG9ydCBjbGFzcyBxdG5JViB7XG4gICAgY3JlYXRlICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoNCk7XG4gICAgfTtcbiAgICBpZGVudGl0eSAoZGVzdCkge1xuICAgICAgICBkZXN0WzBdID0gMDtcbiAgICAgICAgZGVzdFsxXSA9IDA7XG4gICAgICAgIGRlc3RbMl0gPSAwO1xuICAgICAgICBkZXN0WzNdID0gMTtcbiAgICAgICAgcmV0dXJuIGRlc3Q7XG4gICAgfTtcbiAgICBpbnZlcnNlIChxdG4sIGRlc3QpIHtcbiAgICAgICAgZGVzdFswXSA9IC1xdG5bMF07XG4gICAgICAgIGRlc3RbMV0gPSAtcXRuWzFdO1xuICAgICAgICBkZXN0WzJdID0gLXF0blsyXTtcbiAgICAgICAgZGVzdFszXSA9IHF0blszXTtcbiAgICAgICAgcmV0dXJuIGRlc3Q7XG4gICAgfTtcbiAgICBub3JtYWxpemUgKGRlc3QpIHtcbiAgICAgICAgbGV0IHggPSBkZXN0WzBdLCB5ID0gZGVzdFsxXSwgeiA9IGRlc3RbMl0sIHcgPSBkZXN0WzNdO1xuICAgICAgICBsZXQgbCA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5ICsgeiAqIHogKyB3ICogdyk7XG4gICAgICAgIGlmIChsID09PSAwKSB7XG4gICAgICAgICAgICBkZXN0WzBdID0gMDtcbiAgICAgICAgICAgIGRlc3RbMV0gPSAwO1xuICAgICAgICAgICAgZGVzdFsyXSA9IDA7XG4gICAgICAgICAgICBkZXN0WzNdID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGwgPSAxIC8gbDtcbiAgICAgICAgICAgIGRlc3RbMF0gPSB4ICogbDtcbiAgICAgICAgICAgIGRlc3RbMV0gPSB5ICogbDtcbiAgICAgICAgICAgIGRlc3RbMl0gPSB6ICogbDtcbiAgICAgICAgICAgIGRlc3RbM10gPSB3ICogbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVzdDtcbiAgICB9O1xuICAgIG11bHRpcGx5IChxdG4xLCBxdG4yLCBkZXN0KSB7XG4gICAgICAgIGxldCBheCA9IHF0bjFbMF0sIGF5ID0gcXRuMVsxXSwgYXogPSBxdG4xWzJdLCBhdyA9IHF0bjFbM107XG4gICAgICAgIGxldCBieCA9IHF0bjJbMF0sIGJ5ID0gcXRuMlsxXSwgYnogPSBxdG4yWzJdLCBidyA9IHF0bjJbM107XG4gICAgICAgIGRlc3RbMF0gPSBheCAqIGJ3ICsgYXcgKiBieCArIGF5ICogYnogLSBheiAqIGJ5O1xuICAgICAgICBkZXN0WzFdID0gYXkgKiBidyArIGF3ICogYnkgKyBheiAqIGJ4IC0gYXggKiBiejtcbiAgICAgICAgZGVzdFsyXSA9IGF6ICogYncgKyBhdyAqIGJ6ICsgYXggKiBieSAtIGF5ICogYng7XG4gICAgICAgIGRlc3RbM10gPSBhdyAqIGJ3IC0gYXggKiBieCAtIGF5ICogYnkgLSBheiAqIGJ6O1xuICAgICAgICByZXR1cm4gZGVzdDtcbiAgICB9O1xuICAgIHJvdGF0ZSAoYW5nbGUsIGF4aXMsIGRlc3QpIHtcbiAgICAgICAgbGV0IHNxID0gTWF0aC5zcXJ0KGF4aXNbMF0gKiBheGlzWzBdICsgYXhpc1sxXSAqIGF4aXNbMV0gKyBheGlzWzJdICogYXhpc1syXSk7XG4gICAgICAgIGlmICghc3EpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGxldCBhID0gYXhpc1swXSwgYiA9IGF4aXNbMV0sIGMgPSBheGlzWzJdO1xuICAgICAgICBpZiAoc3EgIT0gMSkge1xuICAgICAgICAgICAgc3EgPSAxIC8gc3E7XG4gICAgICAgICAgICBhICo9IHNxO1xuICAgICAgICAgICAgYiAqPSBzcTtcbiAgICAgICAgICAgIGMgKj0gc3E7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHMgPSBNYXRoLnNpbihhbmdsZSAqIDAuNSk7XG4gICAgICAgIGRlc3RbMF0gPSBhICogcztcbiAgICAgICAgZGVzdFsxXSA9IGIgKiBzO1xuICAgICAgICBkZXN0WzJdID0gYyAqIHM7XG4gICAgICAgIGRlc3RbM10gPSBNYXRoLmNvcyhhbmdsZSAqIDAuNSk7XG4gICAgICAgIHJldHVybiBkZXN0O1xuICAgIH07XG4gICAgdG9WZWNJSUkgKHZlYywgcXRuLCBkZXN0KSB7XG4gICAgICAgIGxldCBxcCA9IHRoaXMuY3JlYXRlKCk7XG4gICAgICAgIGxldCBxcSA9IHRoaXMuY3JlYXRlKCk7XG4gICAgICAgIGxldCBxciA9IHRoaXMuY3JlYXRlKCk7XG4gICAgICAgIHRoaXMuaW52ZXJzZShxdG4sIHFyKTtcbiAgICAgICAgcXBbMF0gPSB2ZWNbMF07XG4gICAgICAgIHFwWzFdID0gdmVjWzFdO1xuICAgICAgICBxcFsyXSA9IHZlY1syXTtcbiAgICAgICAgdGhpcy5tdWx0aXBseShxciwgcXAsIHFxKTtcbiAgICAgICAgdGhpcy5tdWx0aXBseShxcSwgcXRuLCBxcik7XG4gICAgICAgIGRlc3RbMF0gPSBxclswXTtcbiAgICAgICAgZGVzdFsxXSA9IHFyWzFdO1xuICAgICAgICBkZXN0WzJdID0gcXJbMl07XG4gICAgICAgIHJldHVybiBkZXN0O1xuICAgIH07XG4gICAgdG9NYXRJViAocXRuLCBkZXN0KSB7XG4gICAgICAgIGxldCB4ID0gcXRuWzBdLCB5ID0gcXRuWzFdLCB6ID0gcXRuWzJdLCB3ID0gcXRuWzNdO1xuICAgICAgICBsZXQgeDIgPSB4ICsgeCwgeTIgPSB5ICsgeSwgejIgPSB6ICsgejtcbiAgICAgICAgbGV0IHh4ID0geCAqIHgyLCB4eSA9IHggKiB5MiwgeHogPSB4ICogejI7XG4gICAgICAgIGxldCB5eSA9IHkgKiB5MiwgeXogPSB5ICogejIsIHp6ID0geiAqIHoyO1xuICAgICAgICBsZXQgd3ggPSB3ICogeDIsIHd5ID0gdyAqIHkyLCB3eiA9IHcgKiB6MjtcbiAgICAgICAgZGVzdFswXSA9IDEgLSAoeXkgKyB6eik7XG4gICAgICAgIGRlc3RbMV0gPSB4eSAtIHd6O1xuICAgICAgICBkZXN0WzJdID0geHogKyB3eTtcbiAgICAgICAgZGVzdFszXSA9IDA7XG4gICAgICAgIGRlc3RbNF0gPSB4eSArIHd6O1xuICAgICAgICBkZXN0WzVdID0gMSAtICh4eCArIHp6KTtcbiAgICAgICAgZGVzdFs2XSA9IHl6IC0gd3g7XG4gICAgICAgIGRlc3RbN10gPSAwO1xuICAgICAgICBkZXN0WzhdID0geHogLSB3eTtcbiAgICAgICAgZGVzdFs5XSA9IHl6ICsgd3g7XG4gICAgICAgIGRlc3RbMTBdID0gMSAtICh4eCArIHl5KTtcbiAgICAgICAgZGVzdFsxMV0gPSAwO1xuICAgICAgICBkZXN0WzEyXSA9IDA7XG4gICAgICAgIGRlc3RbMTNdID0gMDtcbiAgICAgICAgZGVzdFsxNF0gPSAwO1xuICAgICAgICBkZXN0WzE1XSA9IDE7XG4gICAgICAgIHJldHVybiBkZXN0O1xuICAgIH07XG4gICAgc2xlcnAgKHF0bjEsIHF0bjIsIHRpbWUsIGRlc3QpIHtcbiAgICAgICAgbGV0IGh0ID0gcXRuMVswXSAqIHF0bjJbMF0gKyBxdG4xWzFdICogcXRuMlsxXSArIHF0bjFbMl0gKiBxdG4yWzJdICsgcXRuMVszXSAqIHF0bjJbM107XG4gICAgICAgIGxldCBocyA9IDEuMCAtIGh0ICogaHQ7XG4gICAgICAgIGlmIChocyA8PSAwLjApIHtcbiAgICAgICAgICAgIGRlc3RbMF0gPSBxdG4xWzBdO1xuICAgICAgICAgICAgZGVzdFsxXSA9IHF0bjFbMV07XG4gICAgICAgICAgICBkZXN0WzJdID0gcXRuMVsyXTtcbiAgICAgICAgICAgIGRlc3RbM10gPSBxdG4xWzNdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaHMgPSBNYXRoLnNxcnQoaHMpO1xuICAgICAgICAgICAgaWYgKE1hdGguYWJzKGhzKSA8IDAuMDAwMSkge1xuICAgICAgICAgICAgICAgIGRlc3RbMF0gPSAocXRuMVswXSAqIDAuNSArIHF0bjJbMF0gKiAwLjUpO1xuICAgICAgICAgICAgICAgIGRlc3RbMV0gPSAocXRuMVsxXSAqIDAuNSArIHF0bjJbMV0gKiAwLjUpO1xuICAgICAgICAgICAgICAgIGRlc3RbMl0gPSAocXRuMVsyXSAqIDAuNSArIHF0bjJbMl0gKiAwLjUpO1xuICAgICAgICAgICAgICAgIGRlc3RbM10gPSAocXRuMVszXSAqIDAuNSArIHF0bjJbM10gKiAwLjUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgcGggPSBNYXRoLmFjb3MoaHQpO1xuICAgICAgICAgICAgICAgIGxldCBwdCA9IHBoICogdGltZTtcbiAgICAgICAgICAgICAgICBsZXQgdDAgPSBNYXRoLnNpbihwaCAtIHB0KSAvIGhzO1xuICAgICAgICAgICAgICAgIGxldCB0MSA9IE1hdGguc2luKHB0KSAvIGhzO1xuICAgICAgICAgICAgICAgIGRlc3RbMF0gPSBxdG4xWzBdICogdDAgKyBxdG4yWzBdICogdDE7XG4gICAgICAgICAgICAgICAgZGVzdFsxXSA9IHF0bjFbMV0gKiB0MCArIHF0bjJbMV0gKiB0MTtcbiAgICAgICAgICAgICAgICBkZXN0WzJdID0gcXRuMVsyXSAqIHQwICsgcXRuMlsyXSAqIHQxO1xuICAgICAgICAgICAgICAgIGRlc3RbM10gPSBxdG4xWzNdICogdDAgKyBxdG4yWzNdICogdDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlc3Q7XG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvcnVzKHJvdywgY29sdW1uLCBpcmFkLCBvcmFkLCBjb2xvcikge1xuICAgIGxldCBpLCBqLCB0YztcbiAgICBsZXQgcG9zID0gbmV3IEFycmF5KCksIG5vciA9IG5ldyBBcnJheSgpLFxuICAgICAgICBjb2wgPSBuZXcgQXJyYXkoKSwgc3QgPSBuZXcgQXJyYXkoKSwgaWR4ID0gbmV3IEFycmF5KCk7XG4gICAgZm9yIChpID0gMDsgaSA8PSByb3c7IGkrKykge1xuICAgICAgICBsZXQgciA9IE1hdGguUEkgKiAyIC8gcm93ICogaTtcbiAgICAgICAgbGV0IHJyID0gTWF0aC5jb3Mocik7XG4gICAgICAgIGxldCByeSA9IE1hdGguc2luKHIpO1xuICAgICAgICBmb3IgKGogPSAwOyBqIDw9IGNvbHVtbjsgaisrKSB7XG4gICAgICAgICAgICBsZXQgdHIgPSBNYXRoLlBJICogMiAvIGNvbHVtbiAqIGo7XG4gICAgICAgICAgICBsZXQgdHggPSAocnIgKiBpcmFkICsgb3JhZCkgKiBNYXRoLmNvcyh0cik7XG4gICAgICAgICAgICBsZXQgdHkgPSByeSAqIGlyYWQ7XG4gICAgICAgICAgICBsZXQgdHogPSAocnIgKiBpcmFkICsgb3JhZCkgKiBNYXRoLnNpbih0cik7XG4gICAgICAgICAgICBsZXQgcnggPSByciAqIE1hdGguY29zKHRyKTtcbiAgICAgICAgICAgIGxldCByeiA9IHJyICogTWF0aC5zaW4odHIpO1xuICAgICAgICAgICAgaWYgKGNvbG9yKSB7XG4gICAgICAgICAgICAgICAgdGMgPSBjb2xvcjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGMgPSBoc3ZhKDM2MCAvIGNvbHVtbiAqIGosIDEsIDEsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHJzID0gMSAvIGNvbHVtbiAqIGo7XG4gICAgICAgICAgICBsZXQgcnQgPSAxIC8gcm93ICogaSArIDAuNTtcbiAgICAgICAgICAgIGlmIChydCA+IDEuMCkge1xuICAgICAgICAgICAgICAgIHJ0IC09IDEuMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJ0ID0gMS4wIC0gcnQ7XG4gICAgICAgICAgICBwb3MucHVzaCh0eCwgdHksIHR6KTtcbiAgICAgICAgICAgIG5vci5wdXNoKHJ4LCByeSwgcnopO1xuICAgICAgICAgICAgY29sLnB1c2godGNbMF0sIHRjWzFdLCB0Y1syXSwgdGNbM10pO1xuICAgICAgICAgICAgc3QucHVzaChycywgcnQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZvciAoaSA9IDA7IGkgPCByb3c7IGkrKykge1xuICAgICAgICBmb3IgKGogPSAwOyBqIDwgY29sdW1uOyBqKyspIHtcbiAgICAgICAgICAgIHIgPSAoY29sdW1uICsgMSkgKiBpICsgajtcbiAgICAgICAgICAgIGlkeC5wdXNoKHIsIHIgKyBjb2x1bW4gKyAxLCByICsgMSk7XG4gICAgICAgICAgICBpZHgucHVzaChyICsgY29sdW1uICsgMSwgciArIGNvbHVtbiArIDIsIHIgKyAxKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge3A6IHBvcywgbjogbm9yLCBjOiBjb2wsIHQ6IHN0LCBpOiBpZHh9O1xufVxuXG4vKipcbiAqIOeQg+S9k+OBrumggueCueODh+ODvOOCv+eUn+aIkFxuICogQHBhcmFtIHJvd1xuICogQHBhcmFtIGNvbHVtblxuICogQHBhcmFtIHJhZFxuICogQHBhcmFtIGNvbG9yXG4gKiBAcmV0dXJucyB7e3A6IEFycmF5LCBuOiBBcnJheSwgYzogQXJyYXksIHQ6IEFycmF5LCBpOiBBcnJheX19XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzcGhlcmUocm93LCBjb2x1bW4sIHJhZCwgY29sb3IpIHtcbiAgICBsZXQgaSwgaiwgdGM7XG4gICAgbGV0IHBvcyA9IG5ldyBBcnJheSgpLCBub3IgPSBuZXcgQXJyYXkoKSxcbiAgICAgICAgY29sID0gbmV3IEFycmF5KCksIHN0ID0gbmV3IEFycmF5KCksIGlkeCA9IG5ldyBBcnJheSgpO1xuICAgIGZvciAoaSA9IDA7IGkgPD0gcm93OyBpKyspIHtcbiAgICAgICAgbGV0IHIgPSBNYXRoLlBJIC8gcm93ICogaTtcbiAgICAgICAgbGV0IHJ5ID0gTWF0aC5jb3Mocik7XG4gICAgICAgIGxldCByciA9IE1hdGguc2luKHIpO1xuICAgICAgICBmb3IgKGogPSAwOyBqIDw9IGNvbHVtbjsgaisrKSB7XG4gICAgICAgICAgICBsZXQgdHIgPSBNYXRoLlBJICogMiAvIGNvbHVtbiAqIGo7XG4gICAgICAgICAgICBsZXQgdHggPSByciAqIHJhZCAqIE1hdGguY29zKHRyKTtcbiAgICAgICAgICAgIGxldCB0eSA9IHJ5ICogcmFkO1xuICAgICAgICAgICAgbGV0IHR6ID0gcnIgKiByYWQgKiBNYXRoLnNpbih0cik7XG4gICAgICAgICAgICBsZXQgcnggPSByciAqIE1hdGguY29zKHRyKTtcbiAgICAgICAgICAgIGxldCByeiA9IHJyICogTWF0aC5zaW4odHIpO1xuICAgICAgICAgICAgaWYgKGNvbG9yKSB7XG4gICAgICAgICAgICAgICAgdGMgPSBjb2xvcjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGMgPSBoc3ZhKDM2MCAvIHJvdyAqIGksIDEsIDEsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcG9zLnB1c2godHgsIHR5LCB0eik7XG4gICAgICAgICAgICBub3IucHVzaChyeCwgcnksIHJ6KTtcbiAgICAgICAgICAgIGNvbC5wdXNoKHRjWzBdLCB0Y1sxXSwgdGNbMl0sIHRjWzNdKTtcbiAgICAgICAgICAgIHN0LnB1c2goMSAtIDEgLyBjb2x1bW4gKiBqLCAxIC8gcm93ICogaSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbGV0IHIgPSAwO1xuICAgIGZvciAoaSA9IDA7IGkgPCByb3c7IGkrKykge1xuICAgICAgICBmb3IgKGogPSAwOyBqIDwgY29sdW1uOyBqKyspIHtcbiAgICAgICAgICAgIHIgPSAoY29sdW1uICsgMSkgKiBpICsgajtcbiAgICAgICAgICAgIGlkeC5wdXNoKHIsIHIgKyAxLCByICsgY29sdW1uICsgMik7XG4gICAgICAgICAgICBpZHgucHVzaChyLCByICsgY29sdW1uICsgMiwgciArIGNvbHVtbiArIDEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7cDogcG9zLCBuOiBub3IsIGM6IGNvbCwgdDogc3QsIGk6IGlkeH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjdWJlKHNpZGUsIGNvbG9yKSB7XG4gICAgbGV0IHRjLCBocyA9IHNpZGUgKiAwLjU7XG4gICAgbGV0IHBvcyA9IFtcbiAgICAgICAgLWhzLCAtaHMsIGhzLCBocywgLWhzLCBocywgaHMsIGhzLCBocywgLWhzLCBocywgaHMsXG4gICAgICAgIC1ocywgLWhzLCAtaHMsIC1ocywgaHMsIC1ocywgaHMsIGhzLCAtaHMsIGhzLCAtaHMsIC1ocyxcbiAgICAgICAgLWhzLCBocywgLWhzLCAtaHMsIGhzLCBocywgaHMsIGhzLCBocywgaHMsIGhzLCAtaHMsXG4gICAgICAgIC1ocywgLWhzLCAtaHMsIGhzLCAtaHMsIC1ocywgaHMsIC1ocywgaHMsIC1ocywgLWhzLCBocyxcbiAgICAgICAgaHMsIC1ocywgLWhzLCBocywgaHMsIC1ocywgaHMsIGhzLCBocywgaHMsIC1ocywgaHMsXG4gICAgICAgIC1ocywgLWhzLCAtaHMsIC1ocywgLWhzLCBocywgLWhzLCBocywgaHMsIC1ocywgaHMsIC1oc1xuICAgIF07XG4gICAgbGV0IG5vciA9IFtcbiAgICAgICAgLTEuMCwgLTEuMCwgMS4wLCAxLjAsIC0xLjAsIDEuMCwgMS4wLCAxLjAsIDEuMCwgLTEuMCwgMS4wLCAxLjAsXG4gICAgICAgIC0xLjAsIC0xLjAsIC0xLjAsIC0xLjAsIDEuMCwgLTEuMCwgMS4wLCAxLjAsIC0xLjAsIDEuMCwgLTEuMCwgLTEuMCxcbiAgICAgICAgLTEuMCwgMS4wLCAtMS4wLCAtMS4wLCAxLjAsIDEuMCwgMS4wLCAxLjAsIDEuMCwgMS4wLCAxLjAsIC0xLjAsXG4gICAgICAgIC0xLjAsIC0xLjAsIC0xLjAsIDEuMCwgLTEuMCwgLTEuMCwgMS4wLCAtMS4wLCAxLjAsIC0xLjAsIC0xLjAsIDEuMCxcbiAgICAgICAgMS4wLCAtMS4wLCAtMS4wLCAxLjAsIDEuMCwgLTEuMCwgMS4wLCAxLjAsIDEuMCwgMS4wLCAtMS4wLCAxLjAsXG4gICAgICAgIC0xLjAsIC0xLjAsIC0xLjAsIC0xLjAsIC0xLjAsIDEuMCwgLTEuMCwgMS4wLCAxLjAsIC0xLjAsIDEuMCwgLTEuMFxuICAgIF07XG4gICAgbGV0IGNvbCA9IG5ldyBBcnJheSgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9zLmxlbmd0aCAvIDM7IGkrKykge1xuICAgICAgICBpZiAoY29sb3IpIHtcbiAgICAgICAgICAgIHRjID0gY29sb3I7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0YyA9IGhzdmEoMzYwIC8gcG9zLmxlbmd0aCAvIDMgKiBpLCAxLCAxLCAxKTtcbiAgICAgICAgfVxuICAgICAgICBjb2wucHVzaCh0Y1swXSwgdGNbMV0sIHRjWzJdLCB0Y1szXSk7XG4gICAgfVxuICAgIGxldCBzdCA9IFtcbiAgICAgICAgMC4wLCAwLjAsIDEuMCwgMC4wLCAxLjAsIDEuMCwgMC4wLCAxLjAsXG4gICAgICAgIDAuMCwgMC4wLCAxLjAsIDAuMCwgMS4wLCAxLjAsIDAuMCwgMS4wLFxuICAgICAgICAwLjAsIDAuMCwgMS4wLCAwLjAsIDEuMCwgMS4wLCAwLjAsIDEuMCxcbiAgICAgICAgMC4wLCAwLjAsIDEuMCwgMC4wLCAxLjAsIDEuMCwgMC4wLCAxLjAsXG4gICAgICAgIDAuMCwgMC4wLCAxLjAsIDAuMCwgMS4wLCAxLjAsIDAuMCwgMS4wLFxuICAgICAgICAwLjAsIDAuMCwgMS4wLCAwLjAsIDEuMCwgMS4wLCAwLjAsIDEuMFxuICAgIF07XG4gICAgbGV0IGlkeCA9IFtcbiAgICAgICAgMCwgMSwgMiwgMCwgMiwgMyxcbiAgICAgICAgNCwgNSwgNiwgNCwgNiwgNyxcbiAgICAgICAgOCwgOSwgMTAsIDgsIDEwLCAxMSxcbiAgICAgICAgMTIsIDEzLCAxNCwgMTIsIDE0LCAxNSxcbiAgICAgICAgMTYsIDE3LCAxOCwgMTYsIDE4LCAxOSxcbiAgICAgICAgMjAsIDIxLCAyMiwgMjAsIDIyLCAyM1xuICAgIF07XG4gICAgcmV0dXJuIHtwOiBwb3MsIG46IG5vciwgYzogY29sLCB0OiBzdCwgaTogaWR4fTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhzdmEoaCwgcywgdiwgYSkge1xuICAgIGlmIChzID4gMSB8fCB2ID4gMSB8fCBhID4gMSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCB0aCA9IGggJSAzNjA7XG4gICAgbGV0IGkgPSBNYXRoLmZsb29yKHRoIC8gNjApO1xuICAgIGxldCBmID0gdGggLyA2MCAtIGk7XG4gICAgbGV0IG0gPSB2ICogKDEgLSBzKTtcbiAgICBsZXQgbiA9IHYgKiAoMSAtIHMgKiBmKTtcbiAgICBsZXQgayA9IHYgKiAoMSAtIHMgKiAoMSAtIGYpKTtcbiAgICBsZXQgY29sb3IgPSBuZXcgQXJyYXkoKTtcbiAgICBpZiAoIXMgPiAwICYmICFzIDwgMCkge1xuICAgICAgICBjb2xvci5wdXNoKHYsIHYsIHYsIGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCByID0gbmV3IEFycmF5KHYsIG4sIG0sIG0sIGssIHYpO1xuICAgICAgICBsZXQgZyA9IG5ldyBBcnJheShrLCB2LCB2LCBuLCBtLCBtKTtcbiAgICAgICAgbGV0IGIgPSBuZXcgQXJyYXkobSwgbSwgaywgdiwgdiwgbik7XG4gICAgICAgIGNvbG9yLnB1c2gocltpXSwgZ1tpXSwgYltpXSwgYSk7XG4gICAgfVxuICAgIHJldHVybiBjb2xvcjtcbn1cbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gb2Jqc29uLmpzXG4vLyB2ZXJzaW9uIDAuMC4xXG4vLyBDb3B5cmlnaHQgKGMpIGRveGFzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZXhwb3J0IGZ1bmN0aW9uIG9ianNvbkNvbnZlcnQoc291cmNlKSB7XG4gIHNvdXJjZSA9IHNvdXJjZS5yZXBsYWNlKC9eI1tcXHgyMC1cXHg3ZV0rXFxzJC9nbSwgJycpO1xuICBzb3VyY2UgPSBzb3VyY2UucmVwbGFjZSgvXmdbXFx4MjAtXFx4N2VdK1xccyQvZ20sICcnKTtcbiAgc291cmNlID0gc291cmNlLnJlcGxhY2UoL15nXFxzJC9nbSwgJycpO1xuICBzb3VyY2UgPSBzb3VyY2UucmVwbGFjZSgvXFx4MjB7Mix9L2dtLCAnXFx4MjAnKTtcbiAgc291cmNlID0gc291cmNlLnJlcGxhY2UoL15cXHMvZ20sICcnKTtcbiAgdmFyIHJvd3MgPSBzb3VyY2UubWF0Y2goL1tcXHgyMC1cXHg3ZV0rXFxzL2dtKTtcbiAgdmFyIGksIGosIGssIGw7XG4gIHZhciBhLCBiLCBjLCBkO1xuICB2YXIgbGVuLCBkZXN0LCBmTm9ybWFsO1xuICB2YXIgcG9zID0gMDtcbiAgdmFyIG5vciA9IDA7XG4gIHZhciB0ZXggPSAwO1xuICB2YXIgcG9zaXRpb24gPSBbXTtcbiAgdmFyIG5vcm1hbCA9IFtdO1xuICB2YXIgdGV4Q29vcmQgPSBbXTtcbiAgdmFyIHZlcnRleCA9IFtdO1xuICB2YXIgaW5kZXggPSBbXTtcbiAgdmFyIGluZGljZXMgPSBbXTtcbiAgZm9yIChpID0gMCwgbGVuID0gcm93cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIHN3aXRjaCAocm93c1tpXS5zdWJzdHIoMCwgMikpIHtcbiAgICAgIGNhc2UgJ3YgJzpcbiAgICAgICAgYSA9IHJvd3NbaV0ubWF0Y2goLy0/W1xcZFxcLl0rKGUoPz0tKT98ZSg/PVxcKyk/KT9bLVxcK1xcZFxcLl0qL2cpO1xuICAgICAgICBpZiAodmVydGV4W3Bvc10gPT0gbnVsbCkge1xuICAgICAgICAgIHZlcnRleFtwb3NdID0gbmV3IG9ianNvblZlcnRleERhdGEoKTtcbiAgICAgICAgICB2ZXJ0ZXhbcG9zXS5mYWNlSW5kZXggPSBbXTtcbiAgICAgICAgfVxuICAgICAgICB2ZXJ0ZXhbcG9zXS5wb3NpdGlvbiA9IFthWzBdLCBhWzFdLCBhWzJdXTtcbiAgICAgICAgcG9zKys7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndm4nOlxuICAgICAgICBhID0gcm93c1tpXS5tYXRjaCgvLT9bXFxkXFwuXSsoZSg/PS0pP3xlKD89XFwrKT8pP1stXFwrXFxkXFwuXSovZyk7XG4gICAgICAgIGlmICh2ZXJ0ZXhbbm9yXSA9PSBudWxsKSB7XG4gICAgICAgICAgdmVydGV4W25vcl0gPSBuZXcgb2Jqc29uVmVydGV4RGF0YSgpO1xuICAgICAgICAgIHZlcnRleFtub3JdLmZhY2VJbmRleCA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIHZlcnRleFtub3JdLm5vcm1hbCA9IFthWzBdLCBhWzFdLCBhWzJdXTtcbiAgICAgICAgbm9yKys7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndnQnOlxuICAgICAgICBhID0gcm93c1tpXS5tYXRjaCgvLT9bXFxkXFwuXSsoZSg/PS0pP3xlKD89XFwrKT8pP1stXFwrXFxkXFwuXSovZyk7XG4gICAgICAgIGlmICh2ZXJ0ZXhbdGV4XSA9PSBudWxsKSB7XG4gICAgICAgICAgdmVydGV4W3RleF0gPSBuZXcgb2Jqc29uVmVydGV4RGF0YSgpO1xuICAgICAgICAgIHZlcnRleFt0ZXhdLmZhY2VJbmRleCA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIHZlcnRleFt0ZXhdLnRleENvb3JkID0gW2FbMF0sIGFbMV1dO1xuICAgICAgICB0ZXgrKztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdmICc6XG4gICAgICAgIGEgPSByb3dzW2ldLm1hdGNoKC9bXFxkXFwvXSsvZyk7XG4gICAgICAgIGluZGV4LnB1c2goYVswXSwgYVsxXSwgYVsyXSk7XG4gICAgICAgIGlmIChhLmxlbmd0aCA+IDMpIHtcbiAgICAgICAgICBpbmRleC5wdXNoKGFbMl0sIGFbM10sIGFbMF0pO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdCA6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICBpZiAobm9yID09PSAwKSB7XG4gICAgaiA9IGluZGV4Lmxlbmd0aCAvIDM7XG4gICAgZk5vcm1hbCA9IG5ldyBBcnJheShqKTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgajsgaSsrKSB7XG4gICAgICBhID0gaW5kZXhbaSAqIDNdLnNwbGl0KC9cXC8vKTtcbiAgICAgIGIgPSBpbmRleFtpICogMyArIDFdLnNwbGl0KC9cXC8vKTtcbiAgICAgIGMgPSBpbmRleFtpICogMyArIDJdLnNwbGl0KC9cXC8vKTtcbiAgICAgIGZOb3JtYWxbaV0gPSBmYWNlTm9ybWFsKHZlcnRleFthWzBdIC0gMV0ucG9zaXRpb24sIHZlcnRleFtiWzBdIC0gMV0ucG9zaXRpb24sIHZlcnRleFtjWzBdIC0gMV0ucG9zaXRpb24pO1xuICAgICAgdmVydGV4W2FbMF0gLSAxXS5mYWNlSW5kZXgucHVzaChpKTtcbiAgICAgIHZlcnRleFtiWzBdIC0gMV0uZmFjZUluZGV4LnB1c2goaSk7XG4gICAgICB2ZXJ0ZXhbY1swXSAtIDFdLmZhY2VJbmRleC5wdXNoKGkpO1xuICAgIH1cbiAgICBmb3IgKGkgPSAwOyBpIDwgcG9zOyBpKyspIHtcbiAgICAgIGEgPSBbMC4wLCAwLjAsIDAuMF07XG4gICAgICBiID0gdmVydGV4W2ldLmZhY2VJbmRleDtcbiAgICAgIGsgPSBiLmxlbmd0aDtcbiAgICAgIGZvciAoaiA9IDA7IGogPCBrOyBqKyspIHtcbiAgICAgICAgYVswXSArPSBwYXJzZUZsb2F0KGZOb3JtYWxbYltqXV1bMF0pO1xuICAgICAgICBhWzFdICs9IHBhcnNlRmxvYXQoZk5vcm1hbFtiW2pdXVsxXSk7XG4gICAgICAgIGFbMl0gKz0gcGFyc2VGbG9hdChmTm9ybWFsW2Jbal1dWzJdKTtcbiAgICAgIH1cbiAgICAgIHZlcnRleFtpXS5ub3JtYWwgPSB2ZWMzTm9ybWFsaXplKGEpO1xuICAgIH1cbiAgfVxuICBmb3IgKGkgPSAwLCBsZW4gPSBpbmRleC5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGogPSBNYXRoLmZsb29yKGkgLyAzKTtcbiAgICBhID0gaW5kZXhbaV0uc3BsaXQoL1xcLy8pO1xuICAgIGsgPSBhWzBdIC0gMTtcbiAgICBpZiAoaW5kaWNlc1trXSA9PSBudWxsKSB7XG4gICAgICBpbmRpY2VzW2tdID0gbmV3IG9ianNvblZlcnRleERhdGEoKTtcbiAgICAgIGluZGljZXNba10ucG9zaXRpb24gPSBrO1xuICAgIH1cbiAgICBpZiAoYVsyXSAhPSBudWxsKSB7XG4gICAgICBpZiAoYVsyXSAhPT0gJycpIHtcbiAgICAgICAgaWYgKGluZGljZXNba10ubm9ybWFsID09IG51bGwpIHtcbiAgICAgICAgICBpbmRpY2VzW2tdLm5vcm1hbCA9IGFbMl0gLSAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChpbmRpY2VzW2tdLm5vcm1hbCAhPT0gYVsyXSAtIDEpIHtcbiAgICAgICAgICAgIGluZGljZXNbcG9zXSA9IG5ldyBvYmpzb25WZXJ0ZXhEYXRhKCk7XG4gICAgICAgICAgICBpbmRpY2VzW3Bvc10ucG9zaXRpb24gPSBrO1xuICAgICAgICAgICAgaW5kaWNlc1twb3NdLm5vcm1hbCA9IGFbMl0gLSAxO1xuICAgICAgICAgICAgayA9IHBvcztcbiAgICAgICAgICAgIHBvcysrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoYVsxXSAhPSBudWxsKSB7XG4gICAgICBpZiAoYVsxXSAhPT0gJycpIHtcbiAgICAgICAgaWYgKGluZGljZXNba10udGV4Q29vcmQgPT0gbnVsbCkge1xuICAgICAgICAgIGluZGljZXNba10udGV4Q29vcmQgPSBhWzFdIC0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoaW5kaWNlc1trXS50ZXhDb29yZCAhPT0gYVsxXSAtIDEpIHtcbiAgICAgICAgICAgIGluZGljZXNbcG9zXSA9IG5ldyBvYmpzb25WZXJ0ZXhEYXRhKCk7XG4gICAgICAgICAgICBpbmRpY2VzW3Bvc10ucG9zaXRpb24gPSBhWzBdIC0gMTtcbiAgICAgICAgICAgIGlmIChhWzJdICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgaWYgKGFbMl0gIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgaW5kaWNlc1twb3NdLm5vcm1hbCA9IGFbMl0gLSAxO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpbmRpY2VzW3Bvc10udGV4Q29vcmQgPSBhWzFdIC0gMTtcbiAgICAgICAgICAgIGsgPSBwb3M7XG4gICAgICAgICAgICBwb3MrKztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaW5kZXhbaV0gPSBrO1xuICB9XG4gIGZvciAoaSA9IDAsIGxlbiA9IGluZGljZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBhID0gaW5kaWNlc1tpXTtcbiAgICBiID0gW107XG4gICAgYyA9IFtdO1xuICAgIGQgPSBbXTtcbiAgICBpZiAoYSAhPSBudWxsKSB7XG4gICAgICBrID0gYS5wb3NpdGlvbjtcbiAgICAgIGIgPSB2ZXJ0ZXhba10ucG9zaXRpb247XG4gICAgICBwb3NpdGlvbltpICogM10gPSBiWzBdO1xuICAgICAgcG9zaXRpb25baSAqIDMgKyAxXSA9IGJbMV07XG4gICAgICBwb3NpdGlvbltpICogMyArIDJdID0gYlsyXTtcbiAgICAgIGlmIChub3IgPiAwKSB7XG4gICAgICAgIGsgPSBhLm5vcm1hbDtcbiAgICAgIH1cbiAgICAgIGMgPSB2ZXJ0ZXhba10ubm9ybWFsO1xuICAgICAgbm9ybWFsW2kgKiAzXSA9IGNbMF07XG4gICAgICBub3JtYWxbaSAqIDMgKyAxXSA9IGNbMV07XG4gICAgICBub3JtYWxbaSAqIDMgKyAyXSA9IGNbMl07XG4gICAgICBpZiAodGV4ID4gMCkge1xuICAgICAgICBrID0gYS50ZXhDb29yZDtcbiAgICAgICAgZCA9IHZlcnRleFtrXS50ZXhDb29yZDtcbiAgICAgICAgdGV4Q29vcmRbaSAqIDJdID0gZFswXTtcbiAgICAgICAgdGV4Q29vcmRbaSAqIDIgKyAxXSA9IGRbMV07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGIgPSB2ZXJ0ZXhbaV0ucG9zaXRpb247XG4gICAgICBwb3NpdGlvbltpICogM10gPSBiWzBdO1xuICAgICAgcG9zaXRpb25baSAqIDMgKyAxXSA9IGJbMV07XG4gICAgICBwb3NpdGlvbltpICogMyArIDJdID0gYlsyXTtcbiAgICAgIGMgPSB2ZXJ0ZXhbaV0ubm9ybWFsO1xuICAgICAgbm9ybWFsW2kgKiAzXSA9IGNbMF07XG4gICAgICBub3JtYWxbaSAqIDMgKyAxXSA9IGNbMV07XG4gICAgICBub3JtYWxbaSAqIDMgKyAyXSA9IGNbMl07XG4gICAgICBpZiAodGV4ID4gMCkge1xuICAgICAgICBkID0gdmVydGV4W2ldLnRleENvb3JkO1xuICAgICAgICB0ZXhDb29yZFtpICogMl0gPSBkWzBdO1xuICAgICAgICB0ZXhDb29yZFtpICogMiArIDFdID0gZFsxXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZGVzdCA9ICd7JztcbiAgZGVzdCArPSAnXCJ2ZXJ0ZXhcIjonICsgaW5kaWNlcy5sZW5ndGg7XG4gIGRlc3QgKz0gJyxcImZhY2VcIjonICsgaW5kZXgubGVuZ3RoIC8gMztcbiAgZGVzdCArPSAnLFwicG9zaXRpb25cIjpbJyArIHBvc2l0aW9uLmpvaW4oJywnKSArICddJztcbiAgZGVzdCArPSAnLFwibm9ybWFsXCI6WycgKyBub3JtYWwuam9pbignLCcpICsgJ10nO1xuICBpZiAodGV4ID4gMCkge1xuICAgIGRlc3QgKz0gJyxcInRleENvb3JkXCI6WycgKyB0ZXhDb29yZC5qb2luKCcsJykgKyAnXSc7XG4gIH1cbiAgZGVzdCArPSAnLFwiaW5kZXhcIjpbJyArIGluZGV4LmpvaW4oJywnKSArICddJztcbiAgZGVzdCArPSAnfSc7XG4gIHJldHVybiBkZXN0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb2Jqc29uVmVydGV4RGF0YSgpIHtcbiAgdGhpcy5wb3NpdGlvbiA9IG51bGw7XG4gIHRoaXMubm9ybWFsID0gbnVsbDtcbiAgdGhpcy50ZXhDb29yZCA9IG51bGw7XG4gIHRoaXMuZmFjZUluZGV4ID0gbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZlYzNOb3JtYWxpemUodiwgZCkge1xuICB2YXIgZSwgZGlnO1xuICB2YXIgbiA9IFswLjAsIDAuMCwgMC4wXTtcbiAgdmFyIGwgPSBNYXRoLnNxcnQodlswXSAqIHZbMF0gKyB2WzFdICogdlsxXSArIHZbMl0gKiB2WzJdKTtcbiAgaWYgKGwgPiAwKSB7XG4gICAgaWYgKCFkKSB7XG4gICAgICBkaWcgPSA1O1xuICAgIH0gZWxzZSB7XG4gICAgICBkaWcgPSBkO1xuICAgIH1cbiAgICBlID0gMS4wIC8gbDtcbiAgICBuWzBdID0gKHZbMF0gKiBlKS50b0ZpeGVkKGRpZyk7XG4gICAgblsxXSA9ICh2WzFdICogZSkudG9GaXhlZChkaWcpO1xuICAgIG5bMl0gPSAodlsyXSAqIGUpLnRvRml4ZWQoZGlnKTtcbiAgfVxuICByZXR1cm4gbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZhY2VOb3JtYWwodjAsIHYxLCB2Mikge1xuICB2YXIgbiA9IFtdO1xuICB2YXIgdmVjMSA9IFt2MVswXSAtIHYwWzBdLCB2MVsxXSAtIHYwWzFdLCB2MVsyXSAtIHYwWzJdXTtcbiAgdmFyIHZlYzIgPSBbdjJbMF0gLSB2MFswXSwgdjJbMV0gLSB2MFsxXSwgdjJbMl0gLSB2MFsyXV07XG4gIG5bMF0gPSB2ZWMxWzFdICogdmVjMlsyXSAtIHZlYzFbMl0gKiB2ZWMyWzFdO1xuICBuWzFdID0gdmVjMVsyXSAqIHZlYzJbMF0gLSB2ZWMxWzBdICogdmVjMlsyXTtcbiAgblsyXSA9IHZlYzFbMF0gKiB2ZWMyWzFdIC0gdmVjMVsxXSAqIHZlYzJbMF07XG4gIHJldHVybiB2ZWMzTm9ybWFsaXplKG4pO1xufVxuIl19
