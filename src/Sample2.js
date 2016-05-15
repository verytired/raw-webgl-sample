import {matIV, qtnIV, torus, cube, hsva ,sphere} from "./minMatrix";
/*
 * Sample 2
 */

class Sample2 {
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
        let vertexBuffer = this.gl.createBuffer();
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

        // 行列の初期化
        let mat = new matIV();
        let mMatrix = mat.identity(mat.create());
        let vMatrix = mat.identity(mat.create());
        let pMatrix = mat.identity(mat.create());
        let vpMatrix = mat.identity(mat.create());
        let mvpMatrix = mat.identity(mat.create());

        // モデル座標変換行列
        let move = [0.5, 0.5, 0.0];           // 移動量はXYそれぞれ0.5
        mat.translate(mMatrix, move, mMatrix);

        // ビュー座標変換行列
        let cameraPosition = [0.0, 0.0, 3.0]; // カメラの位置
        let centerPoint = [0.0, 0.0, 0.0];    // 注視点
        let cameraUp = [0.0, 1.0, 0.0];       // カメラの上方向
        mat.lookAt(cameraPosition, centerPoint, cameraUp, vMatrix);

        // プロジェクションのための情報を揃える
        let fovy = 45;                             // 視野角
        let aspect = this.canvas.width / this.canvas.height; // アスペクト比
        let near = 0.1;                            // 空間の最前面
        let far = 10.0;                            // 空間の奥行き終端
        mat.perspective(fovy, aspect, near, far, pMatrix);

        // 行列を掛け合わせてMVPマトリックスを生成
        mat.multiply(pMatrix, vMatrix, vpMatrix);   // pにvを掛ける
        mat.multiply(vpMatrix, mMatrix, mvpMatrix); // さらにmを掛ける

        // シェーダに行列を送信する
        let uniLocation = this.gl.getUniformLocation(programs, 'mvpMatrix');
        this.gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);

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

