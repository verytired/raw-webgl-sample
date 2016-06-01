/*
 * Sample 7
 * todo: テクスチャ
 */

import {matIV, qtnIV, torus, cube, hsva ,sphere} from "./minMatrix";

class Sample7 {
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

    this.gl.clearDepth(1.0);

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
    this.uniLocation.texture = this.gl.getUniformLocation(this.programs, 'texture');

    // 球体を形成する頂点のデータを受け取る
    this.sphereData = sphere(64, 64, 1.0);

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
  render() {

    // カウンタをインクリメントする
    this.count++;

    // Canvasエレメントをクリアする
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

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
    this.gl.uniform1i(this.uniLocation.texture, 0);

    // インデックスバッファによる描画
    this.gl.drawElements(this.gl.TRIANGLES, this.sphereData.i.length, this.gl.UNSIGNED_SHORT, 0);
    this.gl.flush();

    // 再帰呼び出し
    requestAnimationFrame(()=> {
      this.render();
    });
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

  // 頂点バッファ（VBO）を生成する関数
  generateVBO(data) {
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
  generateIBO(data) {
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
  setAttribute(vbo, attL, attS, ibo) {
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
  generateTexture(source) {
    // イメージオブジェクトの生成
    var img = new Image();

    // データのオンロードをトリガにする
    img.onload = () => {
      console.log(this.gl);

      // テクスチャオブジェクトの生成
      this.texture = this.gl.createTexture();

      // テクスチャをバインドする
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);

      // テクスチャへイメージを適用
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, img);

      // ミップマップを生成
      this.gl.generateMipmap(this.gl.TEXTURE_2D);

      // テクスチャのバインドを無効化
      this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    };

    // イメージオブジェクトの読み込みを開始
    img.src = source;
  }

  // テクスチャ生成完了をチェックする関数
  loadCheck() {

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
    setTimeout(() => { this.loadCheck()}, 100);
  }
}

module.exports = Sample7;
