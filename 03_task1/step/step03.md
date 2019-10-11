# りんごキャッチ03：ネコを操作してみよう！

## このカリキュラムのゴール  
  
- キーを押すことでスプライトを操作する方法を学びます。  
- スプライトの位置やサイズ、コスチュームの切り替えについて学びます。  

## ネコを操作してみよう！

1. ネコを操作してみよう  
左右キーが押されたらネコが左右に動くように修正します。  
`on.('enterframe')`メソッドの中では、キーが押された時に処理することができます。  
左キーが押された場合は `core.input.left` 、右キーが押された場合は `core.input.right` にそれぞれ `true` が入りますので、`if文` で判定します。  
また、キーが押された場合のみコスチュームを切り替えて、移動している時だけ歩いているように見せましょう。  

    ```javascript
    cat.on('enterframe', function() {
        if(core.input.left) {
            this.frame = this.age % 2;
            this.x -= 5;
        }
        if(core.input.right) {
            this.frame = this.age % 2;
            this.x += 5;
        }
    });
    ```

2. ネコの大きさと位置を変えよう  
りんごがキャッチできるように初期位置を画面の下の方に移動します。  

    ```javascript
    cat.x = 270;
    cat.y = 500;
    ```

    また、このままではネコが大きすぎるので小さくしてみましょう。  
    スプライトの大き変えるには`scale（サイズ）`を更新します。  

    ```javascript
    cat.scaleX = 0.5;
    cat.scaleY = 0.5;
    ```

3. ネコの向きを変えよう  
ここまでの実装で動かすとネコは移動できるようになりましたが、このままでは左キーを押すとネコがバックしてしまいます。  
スプライトの向きを変えるには`scaleX`をマイナスで指定し、左右を反転させます。  

    ```javascript
    cat.on('enterframe', function() {
        if(core.input.left) {
            this.frame = this.age % 2;
            this.x -= 5;
            this.scaleX = -0.5;
        }
        if(core.input.right) {
            this.frame = this.age % 2;
            this.x += 5;
            this.scaleX = 0.5;
        }
    });
    ```

---  

## main.js 完成品
```javascript
// enchant.jsの利用宣言
enchant();

// JavaScriptプログラムを実行する定型文
window.onload = function() {

    // ゲーム画面の生成
    var core = new Core(640, 640);
    // ネコ画像の読み込み
    core.preload('cat.png');
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
    }
    // ゲームスタート
    core.start();
}
```

- - -  
©️スタートプログラミング  
  