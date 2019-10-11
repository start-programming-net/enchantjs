// enchant.js利用宣言
enchant();

// JavaScriptプログラム実行
window.onload = function() {

    // ゲーム画面生成
    var core = new Core(640, 640);
    // ゲーム開始
    core.start();
    // ゲーム実行
    core.onload = function() {
        // ここにゲームの処理を書く
    };
};
