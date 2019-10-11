# りんごキャッチ8：りんごをキャッチしよう  

## このカリキュラムのゴール  
  
- 音を鳴らす方法を学びます
- スプライト同士がぶつかった時の判定方法を学びます
  
## りんごをキャッチしよう  

1. ネコとリンゴがあたったら音を鳴らす  
ネコとリンゴが当たると音を鳴らしてリンゴを削除する動きを作ります。
まずはネコの鳴き声の音を読み込みましょう。  

    ```javascript
    // 修正
    core.preload('cat.png', 'apple.png', 'meow.wav');
    ```

    続いて、ネコとりんごがぶつかった時の動きです。  

    ```javascript
    var Apple = Class.create(Sprite, {
        initialize: function() {
            this.on('enterframe', function() {
                // りんごとネコがぶつかった時
                if (this.within(cat, 30)) {
                    // ネコの鳴き声をならす
                    core.assets['meow.wav'].clone().play();
                    core.rootScene.removeChild(this);
                }
            });
        }
    });
    ```

    りんごとぶつかったかを判定するのは `within()` メソッドを使います。  
    `30`という数字は中心からの半径のサイズで、りんごの中心から30以内にネコが触れるとぶつかったという判定になります。  
  
2. スコアを作ろう  
ゲームオーバー時にキャッチしたリンゴを表示します。  
リンゴの数はラベルで表示します。  
ラベルを生成してゲームオーバーシーンに追加します。  

    ```javascript
    var label = new Label();
    label.x = 550;
    label.y = 10;
    label.text = 'Score: 0';
    label.font = '20px Hiragino';
    label.color = 'white';
    gameOver.addChild(label);
    ```

3. スコアを更新しよう  
リンゴをキャッチする度にスコアの変数をカウントしていきます。  

    ```javascript
    var score = 0;
    var Apple = Class.create(Sprite, {
        initialize: function(x, y) {
            this.on('enterframe', function() {
                if (this.within(cat, 30)) {
                    // 得点をカウントアップ
                    score++;
                }
            });
        }
    });
    ```

4. スコアを表示しよう  
ゲームが終わりゲームオーバーシーンが表示される前に得点のラベルを更新しておきます。  

    ```javascript
    core.rootScene.on('enterframe', function() {
        // 10秒経過したら
        if(core.frame >= (core.fps * TIME) ) {
            // 得点ラベルを更新
            scoreLabel.text = 'Score: ' + score;
        }
    });
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

    // ゲームの残り時間
    const TIME = 10;
    var score = 0;

    // ゲーム画面の生成
    var core = new Core(640, 640);
    // 画像と音の読み込み
    core.preload('cat.png', 'apple.png', 'meow.wav');
    // 画面更新間隔の設定
    core.fps = 30;

    // ゲームの処理
    core.onload = function() {

        // ネコスプライトの生成
        var cat = new Sprite(100, 100);
        // ネコ画像の設定
        cat.image = core.assets['cat.png'];
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
                this.x = rand(640);
                this.y = 0;
                // サイズの縮小
                this.scaleX = 0.25;
                this.scaleY = 0.25;
                // りんご画像の設定
                this.image = core.assets['apple.png'];
                // コスチュームの設定
                this.frame = 0;
                // りんごの動き
                this.on('enterframe', function() {
                    // 下に移動
                    this.y += 5;
                    // 画面外に出た場合
                    if (this.y >= 640) {
                        // ルートシーンからりんごスプライトを削除する
                        core.rootScene.removeChild(this);
                    }
                    // りんごとネコがぶつかった時
                    if (this.within(cat, 30)) {
                        // ネコの鳴き声を鳴らす
                        core.assets['meow.wav'].clone().play();
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
  