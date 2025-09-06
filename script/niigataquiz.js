const invasiveSpeciesQuiz = [
  {
    question: "新潟県の河川や湖沼で繁殖して問題となっている肉食魚で、在来の小魚を食べてしまう外来魚は何でしょう？",
    choices: ["A. ニジマス", "B. ブラックバス（オオクチバス・コクチバス）", "C. ワカサギ"],
    correctAnswer: "B",
    explanation: "新潟県内のダム湖やため池で繁殖し、フナやモロコなどを捕食。釣りのために放流されたケースが多いです。"
  },
  {
    question: "佐潟や鳥屋野潟などで見られる、アメリカ原産の外来魚で在来魚の卵や稚魚を食べる種は？",
    choices: ["A. コイ", "B. ブルーギル", "C. オイカワ"],
    correctAnswer: "B",
    explanation: "繁殖力が強く、在来魚に大きな影響を与えます。特定外来生物に指定されています。"
  },
  {
    question: "新潟の田んぼや用水路で繁殖し、在来のイシガメと競合する外来カメは？",
    choices: ["A. クサガメ", "B. ミシシッピアカミミガメ（ミドリガメ）", "C. スッポン"],
    correctAnswer: "B",
    explanation: "ペットとして飼われたものが放流され、各地で定着。雑食性で水草や小動物を食べます。"
  },
  {
    question: "新潟の河川で外来のエビが見つかっています。東南アジア原産で釣りの生き餌として持ち込まれたのは？",
    choices: ["A. ミナミヌマエビ（外来系統）", "B. スジエビ（在来種）", "C. ヤマトヌマエビ（在来種）"],
    correctAnswer: "A",
    explanation: "在来種と交雑し、固有の遺伝子が失われる危険性があります。"
  },
  {
    question: "新潟県の水辺で急速に広がる、北米原産の外来水草は？",
    choices: ["A. オオフサモ", "B. ガマ", "C. ヨシ"],
    correctAnswer: "A",
    explanation: "水面を覆って光を遮り、水中の生態系を壊します。断片から再生するため駆除が難しいです。"
  },
  {
    question: "佐渡を含む新潟県内で問題になっている、黄色い花を咲かせる北米原産の外来植物は？",
    choices: ["A. オオハンゴンソウ", "B. ナノハナ", "C. キンポウゲ"],
    correctAnswer: "A",
    explanation: "群落をつくり在来植物を駆逐します。特定外来生物に指定されています。"
  },
  {
    question: "新潟県で農作物に被害を与える外来哺乳類で、手先が器用な動物は？",
    choices: ["A. アライグマ", "B. タヌキ", "C. ハクビシン"],
    correctAnswer: "A",
    explanation: "農作物を荒らすほか、在来生物や人間の生活にも被害を及ぼします。"
  },
  {
    question: "新潟の沿岸や河口域に侵入している外来のカニは？",
    choices: ["A. モクズガニ", "B. チチュウカイミドリガニ", "C. サワガニ"],
    correctAnswer: "B",
    explanation: "地中海原産で繁殖力が強く、在来種と競合。近年新潟港でも確認されています。"
  },
  {
    question: "新潟県で外来生物を見つけたときに、やってはいけない行為は？",
    choices: ["A. 写真を撮る", "B. 捕まえて別の場所に放す", "C. 自治体に報告する"],
    correctAnswer: "B",
    explanation: "放流・移動は分布拡大につながります。見つけたら報告が大切です。"
  },
  {
    question: "新潟県で住民や子どもたちが参加できる外来種対策活動は？",
    choices: ["A. 外来水草の抜き取り・外来魚の捕獲イベント", "B. 外来種を集めてペットとして販売すること", "C. 外来魚を守るために放流すること"],
    correctAnswer: "A",
    explanation: "佐潟などで市民協働の取り組みが進められ、啓発や環境保全につながっています。"
  }
];

// クイズの内容をコンソールに出力する関数
function displayQuiz() {
  invasiveSpeciesQuiz.forEach((quiz, index) => {
    console.log(`Q${index + 1}. ${quiz.question}`);
    quiz.choices.forEach(choice => {
      console.log(choice);
    });
    console.log(`**答え：${quiz.correctAnswer}**`);
    console.log(`**解説：** ${quiz.explanation}`);
    console.log(''); // 空行を追加
  });
}

// インタラクティブなクイズゲーム
class QuizGame {
  constructor(quizData) {
    this.quizData = quizData;
    this.currentQuestion = 0;
    this.score = 0;
    this.userAnswers = [];
  }

  displayCurrentQuestion() {
    if (this.currentQuestion >= this.quizData.length) {
      this.showResults();
      return;
    }

    const quiz = this.quizData[this.currentQuestion];
    console.log(`\n=== 問題 ${this.currentQuestion + 1}/${this.quizData.length} ===`);
    console.log(quiz.question);
    quiz.choices.forEach(choice => {
      console.log(choice);
    });
  }

  answerQuestion(userAnswer) {
    const quiz = this.quizData[this.currentQuestion];
    const isCorrect = userAnswer.toUpperCase() === quiz.correctAnswer;
    
    this.userAnswers.push({
      question: this.currentQuestion + 1,
      userAnswer: userAnswer.toUpperCase(),
      correctAnswer: quiz.correctAnswer,
      isCorrect: isCorrect
    });

    if (isCorrect) {
      this.score++;
      console.log("正解！");
    } else {
      console.log(`不正解。正解は ${quiz.correctAnswer} です。`);
    }
    
    console.log(`**解説：** ${quiz.explanation}`);
    
    this.currentQuestion++;
    setTimeout(() => this.displayCurrentQuestion(), 2000);
  }

  showResults() {
    console.log('\n=== クイズ終了 ===');
    console.log(`あなたの得点: ${this.score}/${this.quizData.length}`);
    console.log(`正答率: ${Math.round((this.score / this.quizData.length) * 100)}%`);
    
    if (this.score === this.quizData.length) {
      console.log('素晴らしい！新潟県の外来種について完璧です！');
    } else if (this.score >= this.quizData.length * 0.8) {
      console.log('よくできました！外来種問題に詳しいですね。');
    } else if (this.score >= this.quizData.length * 0.6) {
      console.log('まずまずです。もう少し学習してみましょう。');
    } else {
      console.log('外来種について学ぶ良い機会ですね！');
    }

    const wrongAnswers = this.userAnswers.filter(answer => !answer.isCorrect);
    if (wrongAnswers.length > 0) {
      console.log('\n=== 間違えた問題の復習 ===');
      wrongAnswers.forEach(answer => {
        const quiz = this.quizData[answer.question - 1];
        console.log(`Q${answer.question}: ${quiz.question}`);
        console.log(`あなたの答え: ${answer.userAnswer}, 正解: ${answer.correctAnswer}`);
        console.log(`解説: ${quiz.explanation}\n`);
      });
    }
  }

  start() {
    console.log('=== 新潟県外来種クイズ開始 ===');
    console.log('A、B、Cから選択して答えてください。');
    this.displayCurrentQuestion();
  }
}

// ランダムな問題を取得
function getRandomQuiz() {
  const randomIndex = Math.floor(Math.random() * invasiveSpeciesQuiz.length);
  return invasiveSpeciesQuiz[randomIndex];
}

// キーワード検索
function searchQuiz(keyword) {
  return invasiveSpeciesQuiz.filter(quiz => 
    quiz.question.includes(keyword) || 
    quiz.choices.some(choice => choice.includes(keyword)) ||
    quiz.explanation.includes(keyword)
  );
}

// HTML表示用関数
function displayQuizInHTML(containerId = 'quiz-container') {
  const container = document.getElementById(containerId) || document.body;
  
  invasiveSpeciesQuiz.forEach((quiz, index) => {
    const quizElement = document.createElement('div');
    quizElement.className = 'quiz-item';
    quizElement.innerHTML = `
      <h3>Q${index + 1}. ${quiz.question}</h3>
      <ul>
        ${quiz.choices.map(choice => `<li>${choice}</li>`).join('')}
      </ul>
      <p><strong>答え：${quiz.correctAnswer}</strong></p>
      <p><strong>解説：</strong> ${quiz.explanation}</p>
      <hr>
    `;
    container.appendChild(quizElement);
  });
}

// 使用例
console.log('=== 新潟県外来種クイズ（選択肢付き） ===');
displayQuiz();

console.log('\n=== ランダムな問題 ===');
const randomQuiz = getRandomQuiz();
console.log(randomQuiz.question);
randomQuiz.choices.forEach(choice => console.log(choice));
console.log(`正解: ${randomQuiz.correctAnswer}`);


// ✅ ここから追加
export function startNiigataQuiz(onFinish) {
  const game = new QuizGame(invasiveSpeciesQuiz);
  game.start();

  setTimeout(() => {
    if (onFinish) onFinish(game.score);
  }, invasiveSpeciesQuiz.length * 3000);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    invasiveSpeciesQuiz,
    QuizGame,
    displayQuiz,
    displayQuizInHTML,
    getRandomQuiz,
    searchQuiz,
    startNiigataQuiz
  };
}
