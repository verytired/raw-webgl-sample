import {matIV, qtnIV, torus, cube, hsva ,sphere} from "./minMatrix";
/*
 * Sample 2
 */

class Sample3 {
  /**
   * constructor
   * コンストラクタ
   */
  constructor() {

    console.log('Start Sample3');

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

    // WebGLコンテキストの取得ができたかどうか
    if (this.gl) {
      console.log('supports webgl');
    } else {
      console.log('webgl not supported');
      return
    }

    // クリアする色を指定
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // エレメントをクリア
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);


    // 球体を形成する頂点のデータを受け取る
    this.sphereData = sphere(16, 16, 1.0);

    // 頂点データからバッファを生成
    let vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.sphereData.p), this.gl.STATIC_DRAW);

    // インデックスバッファの生成
    let indexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Int16Array(this.sphereData.i), this.gl.STATIC_DRAW);

    // シェーダとプログラムオブジェクト
    const vertexSource = document.getElementById('vs').textContent;
    const fragmentSource = document.getElementById('fs').textContent;

    // ユーザー定義のプログラムオブジェクト生成関数
    this.programs = this.createShaderProgram(vertexSource, fragmentSource);

    // プログラムオブジェクトに頂点データを登録
    let attLocation = this.gl.getAttribLocation(this.programs, 'position');
    this.gl.enableVertexAttribArray(attLocation);
    this.gl.vertexAttribPointer(attLocation, 3, this.gl.FLOAT, false, 0, 0);

    // 行列の初期化
    this.mat = new matIV();
    this.mMatrix = this.mat.identity(this.mat.create());
    this.vMatrix = this.mat.identity(this.mat.create());
    this.pMatrix = this.mat.identity(this.mat.create());
    this.vpMatrix = this.mat.identity(this.mat.create());
    this.mvpMatrix = this.mat.identity(this.mat.create());

    // ビュー座標変換行列
    let cameraPosition = [0.0, 0.0, 3.0]; // カメラの位置
    let centerPoint = [0.0, 0.0, 0.0];    // 注視点
    let cameraUp = [0.0, 1.0, 0.0];       // カメラの上方向
    this.mat.lookAt(cameraPosition, centerPoint, cameraUp, this.vMatrix);

    // プロジェクションのための情報を揃える
    let fovy = 45;                             // 視野角
    let aspect = this.canvas.width / this.canvas.height; // アスペクト比
    let near = 0.1;                            // 空間の最前面
    let far = 10.0;                            // 空間の奥行き終端
    this.mat.perspective(fovy, aspect, near, far, this.pMatrix);

    // 行列を掛け合わせてVPマトリックスを生成しておく
    this.mat.multiply(this.pMatrix, this.vMatrix, this.vpMatrix);   // pにvを掛ける

    // rendering開始
    this.render();
  }

  /**
   * レンダリング関数の定義
   */
  render() {

    // Canvasエレメントをクリアする
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    // モデル座標変換行列を一度初期化してリセットする
    this.mat.identity(this.mMatrix);

    // カウンタをインクリメントする
    this.count++;

    // モデル座標変換行列
    // 移動
    let move = [0.0, 0.0, 0.0];
    this.mat.translate(this.mMatrix, move, this.mMatrix);

    // 回転
    let radians = (this.count % 360) * Math.PI / 180;
    let axis = [0.0, 0.0, 1.0];
    this.mat.rotate(this.mMatrix, radians, axis, this.mMatrix);


    // 行列を掛け合わせてMVPマトリックスを生成
    this.mat.multiply(this.pMatrix, this.vMatrix, this.vpMatrix);   // pにvを掛ける
    this.mat.multiply(this.vpMatrix, this.mMatrix, this.mvpMatrix); // さらにmを掛ける

    // シェーダに行列を送信する
    let uniLocation = this.gl.getUniformLocation(this.programs, 'mvpMatrix');
    this.gl.uniformMatrix4fv(uniLocation, false, this.mvpMatrix);

    // VPマトリックスにモデル座標変換行列を掛ける
    this.mat.multiply(this.vpMatrix, this.mMatrix, this.mvpMatrix);

    // 描画
    // this.gl.drawArrays(this.gl.TRIANGLES, 0, this.sphereData.p.length / 3);
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
}

module.exports = Sample3;
