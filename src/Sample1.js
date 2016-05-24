/**
* Sample 1
* 生WebGLを記述して三角形を表示させる
*/

class Sample1 {

  /**
   * run
   * サンプルコード実行
   */
  run() {
    console.log('Start Sample1');

    // canvasへの参上を変数に取得する
    let c = document.getElementById('canvas');

    // size指定
    c.width = 512;
    c.height = 512;

    // WebGLコンテキストをcanvasから取得する
    const gl = c.getContext('webgl') || c.getContext('experimental-webgl');

    // WebGLコンテキストの取得ができたかどうか
    if (gl) {
      console.log('supports webgl');
    } else {
      console.log('webgl not supported');
      return
    }

    // クリアする色を指定
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // エレメントをクリア
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 三角形を形成する頂点のデータを受け取る
    let triangleData = this.genTriangle();

    // 頂点データからバッファを生成
    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleData.p), gl.STATIC_DRAW);

    // シェーダとプログラムオブジェクト
    let vertexSource = document.getElementById('vs').textContent;
    let fragmentSource = document.getElementById('fs').textContent;
    let vertexShader = gl.createShader(gl.VERTEX_SHADER);
    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    let programs = gl.createProgram();

    gl.shaderSource(vertexShader, vertexSource);
    gl.compileShader(vertexShader);
    gl.attachShader(programs, vertexShader);
    gl.shaderSource(fragmentShader, fragmentSource);
    gl.compileShader(fragmentShader);
    gl.attachShader(programs, fragmentShader);
    gl.linkProgram(programs);
    gl.useProgram(programs);

    // プログラムオブジェクトに三角形の頂点データを登録
    let attLocation = gl.getAttribLocation(programs, 'position');
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

module.exports = Sample1;
