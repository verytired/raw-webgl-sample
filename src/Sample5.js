  /*
 * Sample 5
 * todo:反射光実装
 */

import {matIV, qtnIV, torus, cube, hsva ,sphere} from "./minMatrix";

class Sample5 {
  /**
   * constructor
   * コンストラクタ
   */
  constructor() {

    //canvasへの参上を変数に取得する
    let c = document.getElementById('canvas');
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
   * レンダリング関数の定義
   */
  render() {

    // Canvasエレメントをクリアする
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // モデル座標変換行列を一度初期化してリセットする
    this.mat.identity(this.mMatrix);

    // カウンタをインクリメントする
    this.count++;

    // モデル座標変換行列を一度初期化してリセットする
    this.mat.identity(this.mMatrix);

    // モデル座標変換行列
    let axis = [0.0, 1.0, 0.0];
    let radians = (this.count % 360) * Math.PI / 180;
    this.mat.rotate(this.mMatrix, radians, axis, this.mMatrix);

    // 行列を掛け合わせてMVPマトリックスを生成
    this.mat.multiply(this.vpMatrix, this.mMatrix, this.mvpMatrix); // さらにmを掛ける

    // 逆行列を生成
    this.mat.inverse(this.mMatrix, this.invMatrix);

    // シェーダに汎用データを送信する
    this.gl.uniformMatrix4fv(this.uniLocation.mvpMatrix, false, this.mvpMatrix);
    this.gl.uniformMatrix4fv(this.uniLocation.invMatrix, false, this.invMatrix);
    this.gl.uniform3fv(this.uniLocation.lightDirection, this.lightDirection);
    console.log(this.uniLocation.eyePosition);

    this.gl.uniform3fv(this.uniLocation.eyePosition, this.cameraPosition);
    this.gl.uniform3fv(this.uniLocation.centerPoint, this.centerPoint);

    // インデックスバッファによる描画
    this.gl.drawElements(this.gl.TRIANGLES, this.sphereData.i.length, this.gl.UNSIGNED_SHORT, 0);
    this.gl.flush();

    // 再帰呼び出し
    requestAnimationFrame(()=> {
      this.render();
  });
  }

  /**
   * run
   * サンプルコード実行
   */
  run() {
    console.log('Start Sample5');

    // WebGLコンテキストの取得ができたかどうか
    if (this.gl) {
      console.log('supports webgl');
    } else {
      console.log('webgl not supported');
      return
    }

    // クリアする色を指定
    this.gl.clearColor(0.3, 0.3, 0.3, 1.0);

    // エレメントをクリア
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    // シェーダとプログラムオブジェクト
    const vertexSource = document.getElementById('vs').textContent;
    const fragmentSource = document.getElementById('fs').textContent;

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
    this.sphereData = sphere(64, 64, 1.0);

    // 頂点データからバッファを生成して登録する（頂点座標）
    let vPositionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vPositionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.sphereData.p), this.gl.STATIC_DRAW);
    let attLocPosition = this.gl.getAttribLocation(this.programs, 'position');
    this.gl.enableVertexAttribArray(attLocPosition);
    this.gl.vertexAttribPointer(attLocPosition, 3, this.gl.FLOAT, false, 0, 0);

    // 頂点データからバッファを生成して登録する（頂点法線）
    let vNormalBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vNormalBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.sphereData.n), this.gl.STATIC_DRAW);
    let attLocNormal = this.gl.getAttribLocation(this.programs, 'normal');
    this.gl.enableVertexAttribArray(attLocNormal);
    this.gl.vertexAttribPointer(attLocNormal, 3, this.gl.FLOAT, false, 0, 0);

    // 頂点データからバッファを生成して登録する（頂点色）
    let vColorBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vColorBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.sphereData.c), this.gl.STATIC_DRAW);
    let attLocColor = this.gl.getAttribLocation(this.programs, 'color');
    this.gl.enableVertexAttribArray(attLocColor);
    this.gl.vertexAttribPointer(attLocColor, 4, this.gl.FLOAT, false, 0, 0);

    // インデックスバッファの生成
    let indexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Int16Array(this.sphereData.i), this.gl.STATIC_DRAW);

    // 行列の初期化
    this.mat = new matIV();
    this.mMatrix = this.mat.identity(this.mat.create());
    this.vMatrix = this.mat.identity(this.mat.create());
    this.pMatrix = this.mat.identity(this.mat.create());
    this.vpMatrix = this.mat.identity(this.mat.create());
    this.mvpMatrix = this.mat.identity(this.mat.create());
    this.invMatrix = this.mat.identity(this.mat.create());

    // ビュー座標変換行列
    this.cameraPosition = [0.0, 0.0, 5.0]; // カメラの位置
    this.centerPoint = [0.0, 0.0, 0.0];    // 注視点
    this.cameraUp = [0.0, 1.0, 0.0];       // カメラの上方向
    this.mat.lookAt(this.cameraPosition, this.centerPoint, this.cameraUp, this.vMatrix);

    // プロジェクションのための情報を揃える
    let fovy = 45;                             // 視野角
    let aspect = this.canvas.width / this.canvas.height; // アスペクト比
    let near = 0.1;                            // 空間の最前面
    let far = 10.0;                            // 空間の奥行き終端
    this.mat.perspective(fovy, aspect, near, far, this.pMatrix);

    // 行列を掛け合わせてVPマトリックスを生成しておく
    this.mat.multiply(this.pMatrix, this.vMatrix, this.vpMatrix);   // pにvを掛ける

    // 平行光源の向き
    this.lightDirection = [1.0, 1.0, 1.0];

    // 設定を有効化する
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);

    // rendering開始
    this.render();
  }

  /**
   * createShaderProgram
   * プログラムオブジェクト生成関数
   */
  createShaderProgram(vertexSource, fragmentSource) {

    // シェーダオブジェクトの生成
    let vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
    let fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);

    // シェーダにソースを割り当ててコンパイル
    this.gl.shaderSource(vertexShader, vertexSource);
    this.gl.compileShader(vertexShader);
    this.gl.shaderSource(fragmentShader, fragmentSource);
    this.gl.compileShader(fragmentShader);

    // シェーダーコンパイルのエラー判定
    if (this.gl.getShaderParameter(vertexShader, this.gl.COMPILE_STATUS)
      && this.gl.getShaderParameter(fragmentShader, this.gl.COMPILE_STATUS)) {
      console.log('Success Shader Compile');
    } else {
      console.log('Faild Shader Compile');
      console.log('vertexShader', this.gl.getShaderInfoLog(vertexShader));
      console.log('fragmentShader', this.gl.getShaderInfoLog(fragmentShader));
    }

    // プログラムオブジェクトの生成から選択まで
    const programs = this.gl.createProgram();

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
}

module.exports = Sample5;
