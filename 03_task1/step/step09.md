# りんごキャッチ9：ソースをきれいにしよう

## このカリキュラムのゴール  
  
- よく使うデータは定数化します  
  
## ソースをきれいにしよう  

文字や数値の打ち間違え防止や、変更時の修正を簡単にするため、変わらない定義は全て定数化しましょう。  

1. 変わらない数値や文字は定数化しよう  

    ```javascript
    const CAT = 'cat.png';
    const APPLE = 'apple.png';
    const SOUND = 'meow.wav';
    const DISP_SIZE = 640;
    const TIME = 10;
    ```

---  

## main.js 完成品

```javascript
// enchant.jsの利用宣言
enchant();

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

    // 画像と音の定義
    const CAT = 'cat.png';
    const APPLE = 'apple.png';
    const SOUND = 'meow.wav';

    // 画面サイズ
    const DISP_SIZE = 640;

    // ゲームの残り時間
    const TIME = 10;
    var score = 0;

    // ゲーム画面の生成
    var core = new Core(DISP_SIZE, DISP_SIZE);
    // 画像と音の読み込み
    core.preload(CAT, APPLE, SOUND);
    // 画面更新間隔の設定
    core.fps = 30;

    // ゲームの処理
    core.onload = function() {

        // ネコスプライトの生成
        var cat = new Sprite(100, 100);
        // ネコ画像の設定
        cat.image = core.assets[CAT];
        // ネコの初期座標を設定
        cat.x = 270;
        cat.y = 500;
        // ネコのサイズを設定（0.5倍）
        cat.scaleX = 0.5;
        cat.scaleY = 0.5;
        // ネコの初期コスチュームを設定
        cat.frame = 0;
        // ネコの動き
        cat.on('enterframe', function() {
            // 左キーが押された場合
            if(core.input.left) {
                // コスチュームを切り替え
                this.frame = this.age % 2;
                // 左に移動
                this.x -= 5;
                // 左向きに変更
                this.scaleX = -0.5;
            }
            // 右キーが押された場合
            if(core.input.right) {
                // コスチュームを切り替え
                this.frame = this.age % 2;
                // 右に移動
                this.x += 5;
                // 右向きに変更
                this.scaleX = 0.5;
            }
        });
        // ルートシーンにネコのスプライトを登録
        core.rootScene.addChild(cat);

        // 残り時間ラベルの生成
        var timeLabel = new Label();
        // ラベルの初期位置を設定
        timeLabel.x = 10;
        timeLabel.y = 10;
        // ラベルの文字サイズと種類を設定
        timeLabel.font = '20px Hiragino';
        // ラベルの初期文字を設定
        timeLabel.text = 'Time: ';
        // ルートシーンにラベルを登録
        core.rootScene.addChild(timeLabel);

        // りんごクラスの定義
        var Apple = Class.create(Sprite, {
            initialize: function() {
                // スプライトを生成
                Sprite.call(this, 100, 100);
                // 初期位置の定義
                this.x = rand(DISP_SIZE);
                this.y = 0;
                // サイズの縮小
                this.scaleX = 0.25;
                this.scaleY = 0.25;
                // りんご画像の設定
                this.image = core.assets[APPLE];
                // コスチュームの設定
                this.frame = 0;
                // りんごの動き
                this.on('enterframe', function() {
                    // 下に移動
                    this.y += 5;
                    // 画面外に出た場合
                    if (this.y >= DISP_SIZE) {
                        // ルートシーンからりんごスプライトを削除する
                        core.rootScene.removeChild(this);
                    }
                    // りんごとネコがぶつかった時
                    if (this.within(cat, 30)) {
                        // ネコの鳴き声を鳴らす
                        core.assets[SOUND].clone().play();
                        // ルートシーンからりんごスプライトを削除する
                        core.rootScene.removeChild(this);
                        // 得点をカウントアップ
                        score++;
                    }
                });
                core.rootScene.addChild(this);
            }
        });
        var apple = new Apple();

        // ゲームオーバーシーンの生成
        var gameOver = new Scene();
        // ゲームオーバーシーンの背景を黒に設定
        gameOver.backgroundColor = 'black';

        // ゲームオーバー画面のラベルを生成
        var goLabel = new Label();
        // ラベルの初期位置を設定
        goLabel.x = 280;
        goLabel.y = 310;
        // ラベルの文字を設定
        goLabel.text = 'Game Over';
        // 文字のサイズと種類を設定
        goLabel.font = '20px Hiragino';
        // 文字色（白）を設定
        goLabel.color = 'white';
        // ゲームオーバーシーンにラベルを登録
        gameOver.addChild(goLabel);

        // 得点ラベルの生成
        var scoreLabel = new Label();
        // 得点ラベルの初期位置を設定
        scoreLabel.x = 550;
        scoreLabel.y = 10;
        // ラベルの文字を設定
        scoreLabel.text = 'Score: 0';
        // 文字のサイズと種類を設定
        scoreLabel.font = '20px Hiragino';
        // 文字色（白）を設定
        scoreLabel.color = 'white';
        // ゲームオーバーシーンにラベルを登録
        gameOver.addChild(scoreLabel);

        // ルートシーンの動き
        core.rootScene.on('enterframe', function() {
            // 残り時間を表示
            timeLabel.text = 'Time: ' + ((((TIME * core.fps) - core.frame)) / core.fps).toFixed(0);

            // 一定間隔
            if (core.frame % 10 == 0) {
                // りんごをクローンする
                apples = new Apple();
            }

            // 10秒経過したら
            if(core.frame >= (core.fps * TIME) ) {
                // 得点ラベルを更新
                scoreLabel.text = 'Score: ' + score;
                // ゲームオーバーシーンに切り替え
                core.pushScene(gameOver);
                // ゲームを止める
                core.stop();
            }
        });
    }
    // ゲームスタート
    core.start();
}
```

- - -  
©️スタートプログラミング  
  