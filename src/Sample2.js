/*
 * Sample 2
 */

class Sample2 {

  /**
   * constructor
   * コンストラクタ
   */
  constructor(){

    //canvasへの参上を変数に取得する
    let c = document.getElementById('canvas');

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
  run() {

    //WebGLコンテキストの取得ができたかどうか
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

    // 三角形を形成する頂点のデータを受け取る
    let triangleData = this.genTriangle();

    // 頂点データからバッファを生成
    var vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(triangleData.p), this.gl.STATIC_DRAW);

    // シェーダとプログラムオブジェクト
    const vertexSource = document.getElementById('vs').textContent;
    const fragmentSource = document.getElementById('fs').textContent;

    // ユーザー定義のプログラムオブジェクト生成関数
    let programs = this.createShaderProgram(vertexSource, fragmentSource);

    // プログラムオブジェクトに三角形の頂点データを登録
    let attLocation = this.gl.getAttribLocation(programs, 'position');
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
  createShaderProgram(vertexSource, fragmentSource) {

    // シェーダオブジェクトの生成
    let vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
    let fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);

    // シェーダにソースを割り当ててコンパイル
    this.gl.shaderSource(vertexShader, vertexSource);
    this.gl.compileShader(vertexShader);
    this.gl.shaderSource(fragmentShader, fragmentSource);
    this.gl.compileShader(fragmentShader);

    // プログラムオブジェクトの生成から選択まで
    let programs = this.gl.createProgram();
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
  genTriangle() {
    let obj = {};
    obj.p = [
      // ひとつ目の三角形
      0.0, 0.5, 0.0,
      0.5, -0.5, 0.0,
      -0.5, -0.5, 0.0,

      // ふたつ目の三角形
      0.0, -0.5, 0.0,
      0.5, 0.5, 0.0,
      -0.5, 0.5, 0.0
    ];
    return obj;
  }
}

module.exports = Sample2;

