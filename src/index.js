window.onload = function () {

    //canvasへの参上を変数に取得する
    let c = document.getElementById('canvas');

    // size指定
    c.width = 512;
    c.height = 512;

    //WebGLコンテキストをcanvasから取得する
    const gl = c.getContext('webgl') || c.getContext('experimental-webgl');

    //WebGLコンテキストの取得ができたかどうか
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
    let triangleData = genTriangle();

    // 頂点データからバッファを生成
    var vertexBuffer = gl.createBuffer();
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
};

function genTriangle() {
    let obj = {};
    obj.p = [
      // ひとつ目の三角形
      0.0,  0.5, 0.0,
      0.5, -0.5, 0.0,
      -0.5, -0.5, 0.0,

      // ふたつ目の三角形
      0.0, -0.5, 0.0,
      0.5,  0.5, 0.0,
      -0.5,  0.5, 0.0
    ];
    return obj;
}
