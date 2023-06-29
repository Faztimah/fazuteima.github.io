var response = {
    "あなたは誰ですか":"わたしはアレクサではありません",
		"名前":"名乗りたくないが、お姫様で呼んでいだたけたら～",
		"私は":"宇宙人じゃないでしょうか",
		"失礼":"冗談好きですみませんね",
    "何歳ですか":"え、わたし、何歳にみえますか",
		"若く見えます":"嘘つくのがだめですわ、きらいですね",
    "元気ですか":"元気ですよー",
    "好きな食べ物は":"焼肉です",
		"かわいいですね。":"そう？からかわないで!",
		"可愛いですね":"そう？からかわないで!"
};

const startButton = document.querySelector('#startButton'); // 開始ボタン
const stopButton = document.querySelector('#stopButton'); // 停止ボタン
const resultOutput = document.querySelector('#resultOutput'); // 結果出力エリア

SpeechRecognition = webkitSpeechRecognition || SpeechRecognition;
if (!'SpeechRecognition' in window) {
    alert("あなたのブラウザはSpeech Recognition APIに未対応です。");
}

const asr = new SpeechRecognition(); // ASRインスタンスを生成
asr.lang = "ja-JP"; // 言語（日本語）
asr.interimResults = true; // 途中結果出力をオン
asr.continuous = false; // 継続入力をオン

if (!'SpeechSynthesisUtterance' in window) {
    alert("あなたのブラウザはSpeech Synthesis APIに未対応です。");
}
const tts = new SpeechSynthesisUtterance(); // TTSインスタンスを生成
    tts.lang = "ja-JP"; // 言語(日本語)、英語の場合はen-US
    tts.rate = 1.0; // 速度
    tts.pitch = 1.0; // 声の高さ
    tts.volume = 1.0; // 音量

let output = ''; // 出力

// 認識結果が出力されたときのイベントハンドラ
asr.onresult = function(event){
    let transcript = event.results[event.resultIndex][0].transcript; // 結果文字列

    let output_not_final = '';
    if (event.results[event.resultIndex].isFinal) { // 結果が確定（Final）のとき
        start_img.src = 'https://cdn.dribbble.com/users/2790075/screenshots/5571604/microphone_ui_animation_still_2x.gif?compress=1&resize=450x338&vertical=top';
				asr.abort(); // 音声認識を停止
        output += transcript + '<br>';

        let matchedKeyword = '';
        for (const keyword in response) {
            if (transcript.includes(keyword)) {
                matchedKeyword = keyword;
                break;
            }
        }
				
        if (matchedKeyword !== '') {
            tts.text = response[matchedKeyword];
            speechSynthesis.speak(tts);
            tts.onend = function(event){
                output += response[matchedKeyword] + '<br>';
                resultOutput.innerHTML = output;
								start_img.src = 'https://cdn.dribbble.com/users/2790075/screenshots/5571604/media/02df16d0aca0257ccb028f3cf4c266a7.gif';
                asr.start(); // 音声認識を再開
            }
        } else {
            let message = "ごめん、もう一度いってくれないか？";
            tts.text = message;
            speechSynthesis.speak(tts);
            output += message + '<br>';
            asr.start(); // 音声認識を再開
        }
    } else { // 結果がまだ未確定のとき
        output_not_final = '<span style="color:#ddd;">' + transcript + '</span>';
        resultOutput.innerHTML = output + output_not_final;
    }
		
    let queryText = transcript; // transcriptからのテキストの取得
    let newText = queryText.replace(/\r?\n/g,'').replace(/\0/g,'');
    resultOutput.innerHTML = newText + " => " + response[newText];
}

function resizeImg(img, height, width) {
    img.height = height;
    img.width = width;
}
// 開始ボタンのイベントハンドラ
startButton.addEventListener('click', function() {
    asr.start();
		start_img.src = 'https://cdn.dribbble.com/users/2790075/screenshots/5571604/media/02df16d0aca0257ccb028f3cf4c266a7.gif';
})

// 停止ボタンのイベントハンドラ
stopButton.addEventListener('click', function() {
    asr.stop();
		start_img.src = 'https://cdn.dribbble.com/users/2790075/screenshots/5571604/microphone_ui_animation_still_2x.gif?compress=1&resize=450x338&vertical=top';
})