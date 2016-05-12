

//canvasへの参上を変数に取得する
let c = document.getElementById('canvas');

//WebGLコンテキストをcanvasから取得する
let gl = c.getContext('webgl') || c.getContext('experimental-webgl');

//WebGLコンテキストの取得ができたかどうか
if(gl){
  console.log('supports webgl');
}else{
  console.log('webgl not supported');
}