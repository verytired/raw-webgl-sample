
window.onload = function () {

    //canvasへの参上を変数に取得する
    let c = document.getElementById('canvas');

    //WebGLコンテキストをcanvasから取得する
    let gl = c.getContext('webgl') || c.getContext('experimental-webgl');

    //WebGLコンテキストの取得ができたかどうか
    if (gl) {
        console.log('supports webgl');
    } else {
        console.log('webgl not supported');
    }

    // クリアする色を指定
    gl.clearColor(0, 0, 0, 1.0);

    //　エレメントをクリア
    gl.clear(gl.COLOR_BUFFER_BIT);

};
