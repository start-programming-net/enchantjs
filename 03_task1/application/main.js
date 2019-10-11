// enchant.jsの利用宣言
enchant();
// iPhoneで音が鳴るようにする設定
enchant.Sound.enabledInMobileSafari = true;

// 乱数を取得します
// Parameters
//   - n: 取得する最大値
// Return:
//   - int: 取得した乱数
function rand(n) {
    return Math.floor(Math.random() * (n + 1));
}

// JavaScriptプログラムを実行する定型文
window.onload = function() {

    // リソース（画像・音）素材の定義
    const CAT = 'cat.png';
    const APPLE = 'apple.png';
    const SOUND = 'meow.wav';
    // 画面サイズ
    const DISP_SIZE = 640;
    // ゲームの終了時間
    const TIME = 10;
    // 得点
    var score = 0;

    // ゲーム画面の生成
    var core = new Core(DISP_SIZE, DISP_SIZE);
    // 画像と音源の読み込み
    core.preload(CAT, APPLE, SOUND);
    // 画面更新間隔の設定
    core.fps = 30;

    // ゲームの処理
    core.onload = function() {
        // ネコスプライト生成
        var cat = new Sprite(100, 100);
        // 初期位置の設定
        cat.x = 320 - 50;
        cat.y = 500;
        // サイズの縮小
        cat.scaleX = 0.5;
        cat.scaleY = 0.5;
        // ネコ画像を指定
        cat.image = core.assets[CAT];
        // コスチュームの設定
        cat.frame = 0;
        // ネコの動き
        cat.on('enterframe', function() {
            this.ax = 0;
            
            // 右キーが押された時
            if (core.input.right) {
                // 右に移動
                this.x += 5;
                this.ax += 0.5;
                // 右向き
                this.scaleX = 0.5;
                // コスチュームを切り替え
                this.frame = core.frame % 2;
            }
            // 左キーが押された時
            if (core.input.left) {
                // 左に移動
                this.x -= 5;
                this.ax -= 0.5;
                // 左向き
                this.scaleX = -0.5;
                // コスチュームを切り替え
                this.frame = core.frame % 2;
            }
        });
        // ルートシーンにネコスプライトを登録
        core.rootScene.addChild(cat);

        // りんごクラスの定義
        var Apple = Class.create(Sprite, {
            // 初期化処理
            initialize: function(x, y) {
                // スプライトサイズ
                Sprite.call(this, 100, 100);
                // 初期位置の設定
                this.x = rand(DISP_SIZE);
                this.y = 0;
                // サイズの設定
                this.scaleX = 0.25;
                this.scaleY = 0.25;
                // りんご画像の読み込み
                this.image = core.assets[APPLE];
                // コスチュームの設定
                this.frame = 0;
                // りんごの動き
                this.on('enterframe', function() {
                    // 下に落ちる
                    this.y += 5;
                    // ネコに触れた時
                    if (this.within(cat, 30)) {
                        // ネコの鳴き声を鳴らす
                        core.assets[SOUND].clone().play();
                        // ルートシーンからりんごを削除
                        core.rootScene.removeChild(this);
                        // 得点をカウントアップ
                        score++;
                        // スコアを更新
                        label.text = 'Score: ' + score;
                    }
                    // 画面外に出た時
                    else if (this.y >= DISP_SIZE) {
                        // ルートシーンからりんごを削除
                        core.rootScene.removeChild(this);
                    }
                });
                // ルートシーンにりんごスプライトを登録
                core.rootScene.addChild(this);
            }
        });

        // りんご格納用配列
        var apples = [];
        //　ゲーム開始
        core.rootScene.on('enterframe', function() {

            // 残り時間を表示
            time.text = 'Time: ' + ((((TIME * core.fps) - core.frame)) / core.fps).toFixed(0);

            // 一定の間隔でりんごを生成
            if (core.frame % 10 == 0) {
                apples = new Apple(0, 0);
            }
            // ゲーム時間をすぎたら
            if(core.frame >= (core.fps * TIME) ) {
                // ゲームオーバーを表示
                core.pushScene(gameOver);
                core.stop();
            }
        });

        // 時間ラベル
        var time = new Label();
        time.x = 10;
        time.y = 10;
        // 表示するフォントの大きさと種類を設定
        time.font = '20px Hiragino';
        // 初期文字を設定
        time.text = 'Time: ';
        // ルートシーンに追加
        core.rootScene.addChild(time);

        // ゲームオーバーシーンの作成
        var gameOver = new Scene();
        // 背景を黒に設定
        gameOver.backgroundColor = 'black';

        // ゲームオーバー表示ラベル
        var goLabel = new Label();
        // 初期位置の設定
        goLabel.x = 280;
        goLabel.y = 310;
        // 初期表示文字の設定
        goLabel.text = 'Game Over';
        // フォントの大きさと種類を設定
        goLabel.font = '20px Hiragino';
        // 文字色の設定
        goLabel.color = 'white';
        // ゲームオーバーシーンにラベルを登録
        gameOver.addChild(goLabel);

        // 得点ラベル
        var label = new Label();
        // 初期位置の設定
        label.x = 550;
        label.y = 10;
        // 初期表示文字の設定
        label.text = 'Score: 0';
        // 文字色の設定
        label.font = '20px Hiragino';
        // 文字色の設定
        label.color = 'white';
        // ゲームオーバーシーンに得点ラベルを登録
        gameOver.addChild(label);
    }
    // ゲームスタート
    core.start();
}
