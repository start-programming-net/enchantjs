// enchant.jsの利用宣言
enchant();
// iPhoneで音が鳴るようにする設定
enchant.Sound.enabledInMobileSafari = true;

var core;

// キー押下完了
// Hack: キーを押して離した時に呼ばれるメソッド。
//       キーが離されたらフラグがfalseになり次のキーを受付けることができます
document.onkeyup = function (e) {
    core.press = false;
    return true;
};

// キー押下を判定します
// Hack:キー押下が連続で入力されるのを制御します
// Parameters
//   - key: 入力したキー
// Return:
//   - boolean: キー押下の判定結果（true:押した、false:押してない）
function keyPress(key) {
    var press = false;
    if(key && !core.press) {
        core.press = true;
        press = true;
    }
    return press;
}

// 乱数を取得します
// Parameters
//   - n: 取得する最大値
// Return:
//   - int: 取得した乱数
function rand(n) {
    return Math.floor(Math.random() * (n + 1));
}

window.onload = function() {

    // 画面サイズ
    const SIZE = 640;
    // FPS
    const FPS = 60;
    // 移動距離
    const MOVE_DOWN = 50;
    // 敵の数
    const ENEMY_COUNT = 10;
    // 移動距離
    var MOVE = 50;
    // プレイヤーと敵の移動可能範囲
    const MOVE_SIZE = (SIZE - (SIZE % MOVE)) - MOVE;

    // 画像
    const STAGE_START = "res/stage-start.png";
    const PLAYER = "res/player.png";
    const ENEMY = "res/enemy.png";
    const PLAYER_BEAM = "res/player-beam.png";
    const ENEMY_BEAM = "res/enemy-beam.png";
    const GAMEOVER = "res/stage-gameover.png";
    // 音源
    const BEAM = "sound/beam.wav";
    const BGM = "sound/bgm.wav";

    //********** ゲーム全体の初期設定 **********//

    // ゲーム画面生成
    core = new Core(SIZE, SIZE);
    // リソースの読み込み
    core.preload(STAGE_START, PLAYER, ENEMY, PLAYER_BEAM, ENEMY_BEAM, GAMEOVER, BEAM, BGM);

    // FPS（画面更新の早さ）
    core.fps = FPS;

    // キーの登録
    core.keybind(32, "Space");
    core.keybind(37, "Left");
    core.keybind(39, "Right");

    // ゲーム開始後のプログラム
    core.onload = function() {
        var beamFrame = 0;          // プレイヤービーム間隔
        var enemyList = [];         // 敵配列
        var enemyMove = MOVE;       // 敵進行方向
        var enemyDownFlg = false;   // 敵下移動中フラグ
        var enemyBeamList = [];     // 敵ビーム配列

        //********** ゲームスタートシーン **********//

        // スタート画面背景の生成
        var bgStart = new Sprite(SIZE, SIZE);
        // スタート画面画像の設定
        bgStart.image = core.assets[STAGE_START];
        // ルートシーンにスタート画面の登録
        core.rootScene.addChild(bgStart);

        // ルートシーンの初期処理
        core.rootScene.on("enter", function() {
            // スタート画面背景の位置とサイズ調整
            bgStart.x = 0;
            bgStart.y = 0;
            bgStart.scaleX = 1;
            bgStart.scaleY = 1;
            // ルートシーンにスタート画面の登録
            core.rootScene.addChild(bgStart);
        });

        // ルートシーンの実行処理
        core.rootScene.on("enterframe", function() {
            // スペースキーが押された場合
            if(keyPress(core.input.Space)) {
                // プレイシーンに遷移
                core.pushScene(playScene);
            }
        });

        // ルートシーンの終了処理
        core.rootScene.on("exit", function() {
            // なし
        });

        //********** プレイシーン **********//

        // プレイヤー
        var player = new Sprite(100, 100);
        player.image = core.assets[PLAYER];
        player.scaleX = 0.4;
        player.scaleY = 0.4;
        player.on("enterframe", function() {
            // 左キー押下
            if(keyPress(core.input.Left)) {
                // 左に移動
                this.x -= MOVE;
                // 画面端に到達した場合
                if(this.x <= 0) {
                    // 画面端を超えないように制御
                    this.x = 0;
                }
            }
            // 右キー押下
            if(keyPress(core.input.Right)) {
                // 左に移動
                this.x += MOVE;
                // 画面端に到達した場合
                if(this.x >= MOVE_SIZE) {
                    // 画面端を超えないように制御
                    this.x = MOVE_SIZE;
                }
            }

            // スペースキー押下（前回発射から0.5秒後）
            if(keyPress(core.input.Space) && core.frame >= beamFrame){
                // ビーム音を鳴らす
                core.assets[BEAM].clone().play();
                // プレイシーンにビームスプライトを追加
                playScene.addChild(new PlayerBeam);
                // 0.5秒経過しないと次のビームが生成できないよう制御
                beamFrame = core.frame + FPS/2;
            }
        });

        // プレイヤービームクラス
        var PlayerBeam = Class.create(Sprite,{
            initialize: function(){
                Sprite.call(this,50,50);
                this.image = core.assets[PLAYER_BEAM];
                this.x = player.x + player.width * player.scaleX / 2;
                this.y = player.y;
                this.scaleX = 0.5;
                this.scaleY = 0.5;
                this.frame = 0;
                // プレイヤービームの動き
                this.on("enterframe", function(){
                    // 上方向へ移動
                    this.y -= 5;
                    // ビームと敵との衝突判定
                    for(var i = 0 ; i < enemyList.length ; i++) {
                        // ビームが敵に当たった場合
                        if(this.within(enemyList[i],10)) {
                            // 自身のインスタンスを削除
                            playScene.removeChild(this);
                            // ビームが当たった敵のインスタンスを削除
                            playScene.removeChild(enemyList[i]);
                            // 敵リストから削除
                            enemyList.splice(i,1);
                        }
                    }
                    // ビームが画面外まで移動した場合
                    if(this.y == 0) {
                        // 自身のインスタンスを削除
                        playScene.removeChild(this);
                    }
                });
            }
        });

        // 敵クラス
        var Enemy = Class.create(Sprite,{
            initialize: function() {
                Sprite.call(this,100,100);
                this.image = core.assets[ENEMY];
                this.x = 0;
                this.y = 0;
                this.scaleX = 0.4;
                this.scaleY = 0.4;
                this.frame = 0;
                this.on('enterframe', function(){

                    // ビーム発射間隔
                    if(core.frame % (30 * rand(100)) == 0) {
                        // 敵ビーム生成
                        var beam = new EnemyBeam();
                        // 敵ビームの座標を指定
                        beam.x = this.x + this.width * this.scaleX / 2;
                        beam.y = this.y + this.height * this.scaleY / 2;
                        // 敵ビーム配列に追加
                        enemyBeamList.push(beam);
                        // プレイシーンに敵ビームを登録
                        playScene.addChild(beam);
                    }

                    // 敵がプレイヤーに当たった時
                    if(this.within(player, 10)) {
                        // プレイヤーのコスチュームを切り替え
                        player.frame = 1;
                        // ゲームオーバーシーンを表示
                        core.pushScene(gameOver);
                    }
                });
            }
        });

        // 敵ビームクラス
        var EnemyBeam = Class.create(Sprite,{
            initialize: function(){
                Sprite.call(this,50,50);
                this.image = core.assets[ENEMY_BEAM];
                this.scaleX = 0.5;
                this.scaleY = 0.5;
                this.on('enterframe', function() {
                    // 下方向へ移動
                    this.y += 5;

                    // 画面外まで到達した時
                    if(this.y >= SIZE - MOVE) {
                        // プレイシーンから削除
                        playScene.removeChild(this);
                    }

                    // 敵ビームがプレイヤーに当たった時
                    if(this.within(player, 10)) {
                        // プレイヤーのコスチュームを切り替え
                        player.frame = 1;
                        // ゲームオーバーシーンを表示
                        core.pushScene(gameOver);
                    }
                });
            }
        });

        // プレイシーンのインスタンス生成
        var playScene = new Scene();

        // プレイシーンの初期処理
        playScene.on("enter", function() {
            // 背景を黒に設定
            playScene.backgroundColor = 'black';

            // プレイヤー初期位置の設定
            player.x = (SIZE - player.width * player.scaleX ) / 2 ;
            player.y = (SIZE - player.height * player.scaleY) * 2;
            // プレイヤー初期フレームの設定
            player.frame = 0;

            // プレイヤーのX座標を切りの良いものにする
            while(player.x % MOVE != 0) {
                player.x -= 1;
            }
            // プレイヤーのY座標をしたの少しのスペースができるようにする
            while(player.y + player.height * player.scaleY >= (SIZE-40)) {
                player.y -= 10;
            }
            // プレイヤースプライトをプレイシーンに登録
            playScene.addChild(player);

            // 敵進行方向を初期化
            enemyMove = MOVE;
            enemyDownFlg = false;

            // 敵と敵ビームの配列をクリア
            enemyList = [];
            enemyBeamList = [];

            // 敵を生成
            for(var i = 0 ; i < ENEMY_COUNT; i++) {
                // 敵配列に敵インスタンスを挿入
                enemyList.push(new Enemy());
                // プレイシーンに敵スプライトを追加
                playScene.addChild(enemyList[i]);
                // 敵のX座標を調整
                enemyList[i].x += (i+1) * MOVE;
            }
        });

        // プレイシーンの実行処理
        playScene.on("enterframe", function() {
            // BGMを鳴らす
            core.assets[BGM].play();

            // 敵を全滅
            if(enemyList.length == 0) {
                // ゲームオーバーシーンを表示
                core.pushScene(gameOver);
            }

            // 敵スプライトの動き（1.5秒ごとに動作）
            if(core.frame % (FPS*1.5) == 0 ) {
                // コスチュームを変更
                enemyList.forEach(function(value) {
                    value.frame += 1;
                });

                // 敵が右端まで移動した時
                if(enemyDownFlg == false && enemyList[enemyList.length-1].x == MOVE_SIZE) {
                    // 下方向に移動
                    moveDown();
                    // 下移動中フラグをオン
                    enemyDownFlg = true;
                    // 左右移動向きの設定
                    enemyMove = -MOVE;
                }
                // 敵が左端まで移動した時
                else if(enemyDownFlg == false && enemyList[0].x == 0) {
                    // 下方向に移動
                    moveDown();
                    // 下移動中フラグをオン
                    enemyDownFlg = true;
                    // 左右移動向きの設定
                    enemyMove = MOVE;
                }
                else {
                    // 移動
                    enemyList.forEach(function(value) {
                        value.x += enemyMove;
                    });
                    enemyDownFlg = false;
                }
            }
        });

        // プレイシーンの終了処理
        playScene.on("exit", function() {

            // BGMを停止
            core.assets[BGM].stop();

            // プレイシーンからプレイヤーを削除
            playScene.removeChild(player);
            // プレイシーンから敵を削除
            enemyList.forEach(function(value) {
                playScene.removeChild(value);
            });
            // プレイシーンから敵ビームを削除
            enemyBeamList.forEach(function(value) {
                playScene.removeChild(value);
            });
        });

        // enemyが端に来たときの動き
        function moveDown() {
            enemyList.forEach(function(value){
                value.y += MOVE_DOWN;
            });
        }

        //********** ゲームオーバー **********//

        // ゲームオーバーシーンの生成
        var gameOver = new Scene();

        // ゲームオーバー背景の生成
        var stageGameOver = new Sprite(SIZE, SIZE);
        stageGameOver.image = core.assets[GAMEOVER];
        stageGameOver.x = 0;
        stageGameOver.y = 0;

        // ゲームオーバーシーンの初期処理
        gameOver.on("enter", function() {
            // ゲームオーバーシーンに背景を登録
            gameOver.addChild(stageGameOver);
        });

        // ゲームオーバーシーンの実行処理
        gameOver.on("enterframe", function(){
            // スペースキー押下
            if (keyPress(core.input.Space)) {
                // ルートシーンに戻る
                core.replaceScene(core.rootScene);
            }
        });

        // ゲームオーバーシーンの終了処理
        gameOver.on("exit", function() {
            // ゲームオーバー背景の削除
            gameOver.removeChild(stageGameOver);
        });
    }

    // ゲームスタート
    core.start();
}
