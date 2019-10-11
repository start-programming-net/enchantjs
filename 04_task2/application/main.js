// enchant.jsの利用宣言
enchant();
// iPhoneで音が鳴るようにする設定
enchant.Sound.enabledInMobileSafari = true;

/// 乱数取得
/// 0から指定した整数値の中から乱数を取得します。
/// 
/// parameters: 最大値（整数）
/// return: 乱数
function rand(n) {
    return Math.floor(Math.random() * (n + 1));
}

// JavaScriptプログラムを実行
window.onload = function() {

    // リソース（画像・音）素材の定義
    const IMG_FLAPPY = 'res/flappy.png';
    const IMG_PIPE = 'res/pipe.png';
    const IMG_TITLE = 'res/title.png';
    const IMG_GROUND = 'res/ground.png';
    const IMG_SCREEN = 'res/screen.png';
    const IMG_SCORE = 'res/score.png';
    const SOUND_FLAP = 'sound/flap.wav';
    const SOUND_BING = 'sound/bing.wav';
    const SOUND_DEAD = 'sound/dead.wav';

    // 画面サイズ
    const DISP_SIZE = 640;

    // 得点
    var score = 0;
    var move = 0;

    // ゲーム画面の生成
    var core = new Core(DISP_SIZE, DISP_SIZE);
    // 画像と音源の読み込み
    core.preload(IMG_FLAPPY, IMG_PIPE, IMG_TITLE, IMG_GROUND, IMG_SCREEN, IMG_SCORE, SOUND_FLAP, SOUND_BING, SOUND_DEAD);
    // 画面更新間隔の設定
    core.fps = 30;
    // スペースキーの利用設定
    core.keybind(32, "space");

    // ゲームの処理
    core.onload = function() {

        //********** スタートシーン **********//

        // 背景スプライトの生成
        var screen = new Sprite(640, 500);
        screen.x = 0;
        screen.y = 0;
        screen.image = core.assets[IMG_SCREEN];
        core.rootScene.addChild(screen);

        // 地面スプライトの生成
        var ground = new Sprite(640, 102);
        ground.x = 0;
        ground.y = screen.height;
        ground.image = core.assets[IMG_GROUND];
        core.rootScene.addChild(ground);

        // タイトルスプライトの生成
        var title = new Sprite(200, 54);
        title.x = (DISP_SIZE - title.width) /2;
        title.y = (DISP_SIZE - title.height - ground.height) / 2;
        title.image = core.assets[IMG_TITLE];
        title.on('enterframe', function() {
            if (core.frame % 40 >= 20) {
                title.y += 1;
            }
            else {
                title.y -= 1;
            }
        });
        core.rootScene.addChild(title);

        // ルートシーンの初期処理
        core.rootScene.on('enter', function() {
            // 得点の初期化
            score = 0;
            // タイトルスプライトをルートシーンに登録
            core.rootScene.addChild(title);
        });
        // ルートシーンの実行処理
        core.rootScene.on('enterframe', function() {
            // スペースキーが押された時
            if (core.input.space) {
                // プレイシーンを表示
                core.pushScene(playScene);
            }
        });
        // ルートシーンの終了処理
        core.rootScene.on('exit', function() {
            // タイトルスプライトをルートシーンから削除
            core.rootScene.removeChild(title);
        });

        //********** プレイシーン **********//

        // プレイシーン
        var playScene = new Scene();

        // 土管（下）クラスの定義
        var PipeDown = Class.create(Sprite, {
            // 初期化
            initialize: function(posY) {
                // 土管スプライトのサイズを定義
                Sprite.call(this, 64, 288);
                this.x = DISP_SIZE;
                this.y = DISP_SIZE - 200 - posY;
                this.image = core.assets[IMG_PIPE];
                // 土管（下）スプライトの実行処理
                this.on('enterframe', function() {
                    // 左へ移動
                    this.x -= 5;

                    // 画面の中央を通過
                    if(this.x == DISP_SIZE/2) {
                        // Hack: 土管が中央を通過したことでフラッピーバードが超えたことを判断
                        // 通過音を鳴らす
                        core.assets[SOUND_BING].clone().play();
                        // 得点をカウントアップ
                        score++;
                    }
                    // フラッピーバードに触れた
                    if (this.intersect(flappy)) {
                        // ぶつかった音を鳴らす
                        core.assets[SOUND_DEAD].clone().play();
                        // プレイシーンからスプライトを削除
                        playScene.removeChild(this);
                        // ゲームオーバーシーンに移動
                        core.pushScene(gameoverScene);
                    }
                    // 画面の左端に到達
                    else if (this.x < 0) {
                        // プレイシーンからスプライトを削除
                        playScene.removeChild(this);
                    }
                });
                // プレイシーンに土管（下）を登録
                playScene.addChild(this);
            }
        });

        // 土管（上）クラスの定義
        var PipeUp = Class.create(Sprite, {
            // 初期化
            initialize: function(posY) {
                // 土管スプライトのサイズを定義
                Sprite.call(this, 64, 288);
                this.x = DISP_SIZE;
                this.y -= posY;
                this.scaleY = -1;
                this.image = core.assets[IMG_PIPE];
                // 土管（上）スプライトの実行処理
                this.on('enterframe', function() {
                    // 左に移動
                    this.x -= 5;
                    // フラッピーバードに触れた
                    if (this.intersect(flappy)) {
                        // ぶつかった音を鳴らす
                        core.assets[SOUND_DEAD].clone().play();
                        // プレイシーンからスプライトを削除
                        playScene.removeChild(this);
                        // ゲームオーバーシーンに移動
                        core.pushScene(gameoverScene);
                    }
                    // 画面の左端に到達
                    else if (this.x < 0) {
                        // プレイシーンからスプライトを削除
                        playScene.removeChild(this);
                    }
                });
                // プレイシーンに土管（上）を登録
                playScene.addChild(this);
            }
        });
        
        // 土管配列
        var pipeDowns = [];
        var pipeUps = [];

        // フラッピーバードスプライトの生成
        var flappy = new Sprite(40, 40);
        flappy.x = (DISP_SIZE - flappy.width) / 2;
        flappy.y = (DISP_SIZE - flappy.height - 100) / 2;
        flappy.image = core.assets[IMG_FLAPPY];
        flappy.frame = 0;
        // フラッピーバードの実行処理
        flappy.on('enterframe', function() {
            // 3フレームごとにコスチュームを切り替え
            if((core.frame % 3) == 0) {
                this.frame = core.frame % 2;
            }
            // スペースキーが押された場合
            if (core.input.space) {
                // 飛ぶ動き
                // 縦方向の移動距離を設定
                move = -7;
                // 角度を設定
                flappy.rotation = -45;
                // 羽ばたきの音を鳴らす
                core.assets[SOUND_FLAP].clone().play();
            }
            // 縦方向の移動
            flappy.y += move;
            // 移動距離の更新
            move += 0.8;
            // 角度の更新
            flappy.rotation += 2;

            // 地面スプライトに触れた
            if (this.intersect(ground)) {
                // 激突の音を鳴らす
                core.assets[SOUND_DEAD].clone().play();
                // ゲームオーバーシーンを表示
                core.pushScene(gameoverScene);
            }
        });

        // プレイシーンの初期処理
        playScene.on('enter', function(){
            flappy.x = (DISP_SIZE - flappy.width) / 2;
            flappy.y = (DISP_SIZE - flappy.height - 100) / 2;    
            playScene.addChild(flappy);
        });
        // プレイシーンの実行処理
        playScene.on('enterframe', function() {
            // 一定の間隔で土管を生成
            if (core.frame % 100 == 99) {
                // 0〜100までの乱数取得
                var posY = rand(100);
                // 土管（下）を生成
                pipeDowns = new PipeDown(posY);
                // 土管（上）を生成
                pipeUps = new PipeUp(posY);
            }
        });
        // プレイシーンの終了処理
        playScene.on('exit', function() {
            // フラッピーバードスプライトの削除
            playScene.removeChild(flappy)
            // 土管（上）スプライトの削除
            playScene.removeChild(pipeUps)
            // 土管（下）スプライトの削除
            playScene.removeChild(pipeDowns)
        });

        // ゲームオーバーシーンの生成
        var gameoverScene = new Scene();

        // 得点ボードスプライトの生成
        var scoreBoard = new Sprite(500, 254);
        scoreBoard.image = core.assets[IMG_SCORE];
        scoreBoard.x = (DISP_SIZE - scoreBoard.width) / 2;
        scoreBoard.y = (DISP_SIZE - scoreBoard.height) / 2;

        // スコアラベルの生成
        var scoreLabel = new Label();
        scoreLabel.x = scoreBoard.x + 100;
        scoreLabel.y = scoreBoard.y + 100;
        // フォントのサイズと種類を設定
        scoreLabel.font = '32px Hiragino';
        // 文字色の設定
        scoreLabel.color = 'white';

        //********** ゲームオーバーシーン **********//

        // ゲームオーバーシーンの初期処理
        gameoverScene.on('enter', function() {
            scoreLabel.text = 'Score: ' + score;
            gameoverScene.addChild(scoreBoard);
            gameoverScene.addChild(scoreLabel);
        });
        // ゲームオーバーシーンの実行処理
        gameoverScene.on('enterframe', function() {
            // タイトルに戻る
            if (core.input.down) {
                // Hack: 2回実行することでルートシーンに戻す
                // ひとつ前のシーンに戻る
                core.popScene()
                // ひとつ前のシーンに戻る
                core.popScene()
            }
        });
        // ゲームオーバーシーンの終了処理
        gameoverScene.on('exit', function() {
            // スコアラベルの削除
            gameoverScene.removeChild(scoreLabel)
            // 得点ボードスプライトの削除
            gameoverScene.removeChild(scoreBoard)
        });
    }
    // ゲーム開始
    core.start();
}
