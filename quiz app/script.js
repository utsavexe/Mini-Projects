const questions = [
    {
        question: "What does HTML stand for?",
        answers: [
            { text: "HyperText Markup Language", correct: true },
            { text: "HighText Machine Language", correct: false },
            { text: "Hyperlinks and Text Markup", correct: false },
            { text: "Home Tool Markup", correct: false }
        ]
    },
    {
        question: "Which language is used for styling web pages?",
        answers: [
            { text: "HTML", correct: false },
            { text: "CSS", correct: true },
            { text: "Python", correct: false },
            { text: "Java", correct: false }
        ]
    },
    {
        question: "Which tag is used to include JavaScript?",
        answers: [
            { text: "<script>", correct: true },
            { text: "<javascript>", correct: false },
            { text: "<js>", correct: false },
            { text: "<code>", correct: false }
        ]
    },
    {
        question: "What is the correct CSS syntax to change font size?",
        answers: [
            { text: "font-size: 16px;", correct: true },
            { text: "text-size: 16px;", correct: false },
            { text: "font: 16px;", correct: false },
            { text: "size-font: 16px;", correct: false }
        ]
    },
    {
        question: "Which HTML attribute is used to define inline styles?",
        answers: [
            { text: "class", correct: false },
            { text: "styles", correct: false },
            { text: "style", correct: true },
            { text: "css", correct: false }
        ]
    },
    {
        question: "Which is a JavaScript framework/library?",
        answers: [
            { text: "React", correct: true },
            { text: "Laravel", correct: false },
            { text: "Django", correct: false },
            { text: "Flask", correct: false }
        ]
    },
    {
        question: "What symbol is used for comments in JavaScript?",
        answers: [
            { text: "// for single-line", correct: true },
            { text: "<!-- -->", correct: false },
            { text: "/* */ only", correct: false },
            { text: "# comment", correct: false }
        ]
    },
    {
        question: "Which HTML element is used to define the title of a document?",
        answers: [
            { text: "<meta>", correct: false },
            { text: "<title>", correct: true },
            { text: "<head>", correct: false },
            { text: "<header>", correct: false }
        ]
    }
];

// Config
const QUESTION_TIME = 15; // seconds per question
let currentQuestion = 0;
let score = 0;
let timer = null;
let remaining = QUESTION_TIME;
let isFinished = false;
let focusedIndex = -1; // for keyboard navigation
let currentAttempt = [];
let isReview = false;
let reviewIndex = 0;

const questionEl = document.getElementById("question");
const answerButtons = document.getElementById("answers");
const nextBtn = document.getElementById("next-btn");
const progressBar = document.getElementById("progress-bar");
const timerEl = document.getElementById("timer");
const historyBtn = document.getElementById("history-btn");
const historyModal = document.getElementById("history-modal");
const historyList = document.getElementById("history-list");
const closeHistory = document.getElementById("close-history");
const clearHistoryBtn = document.getElementById("clear-history");
const themeSwitch = document.getElementById("theme-switch");

// Utilities
function shuffle(a){
    for(let i=a.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];
    }
}

function formatTime(s){
    const mm = Math.floor(s/60).toString().padStart(2,'0');
    const ss = (s%60).toString().padStart(2,'0');
    return `${mm}:${ss}`;
}

// Theme init
(function(){
    const t = localStorage.getItem('quiz_theme');
    if(t === 'purple') document.body.classList.add('purple');
    themeSwitch.checked = document.body.classList.contains('purple');
})();

themeSwitch.addEventListener('change', ()=>{
    if(themeSwitch.checked){
        // enable purple theme when toggle is checked
        document.body.classList.add('purple');
        localStorage.setItem('quiz_theme','purple');
    } else {
        document.body.classList.remove('purple');
        localStorage.setItem('quiz_theme','default');
    }
});

// History (localStorage)
function saveHistory(score, total, attempt){
    const key = 'quiz_history';
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    list.unshift({score, total, date: new Date().toISOString(), attempt: attempt || []});
    localStorage.setItem(key, JSON.stringify(list.slice(0,20)));
    // clear currentAttempt after saving
    currentAttempt = [];
}

function renderHistory(){
    const list = JSON.parse(localStorage.getItem('quiz_history') || '[]');
    if(!list.length){ historyList.innerText = 'No history yet.'; return; }
    historyList.innerHTML = '';
    list.forEach((item, idx) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'history-item';
        const d = new Date(item.date);
        const header = document.createElement('div');
        header.className = 'history-header';
        header.innerText = `${d.toLocaleString()} — ${item.score}/${item.total}`;

        const details = document.createElement('div');
        details.className = 'history-details';
                if(item.attempt && item.attempt.length){
                        item.attempt.forEach((q,i)=>{
                                const row = document.createElement('div');
                                row.className = 'history-row';
                                const qText = document.createElement('div'); qText.className = 'history-q'; qText.innerText = `${i+1}. ${q.question}`;

                                const aText = document.createElement('div'); aText.className = 'history-a';
                                const userAns = q.selected ?? null;
                                // show user's answer as a colored chip (correct/wrong/no-answer)
                                if(userAns === null){
                                    aText.innerText = `Your answer: — (no answer)`;
                                    aText.classList.add('no-answer');
                                } else {
                                    aText.innerText = `Your answer: ${userAns}`;
                                    if(q.correct && userAns === q.correct){
                                        aText.classList.add('correct');
                                    } else {
                                        aText.classList.add('wrong');
                                    }
                                }

                                // show correct answer as its own chip and mark it green when applicable
                                const cText = document.createElement('div');
                                cText.className = 'history-a history-c';
                                cText.innerText = `Correct answer: ${q.correct ?? '—'}`;
                                if(q.correct){
                                    // always mark the correct answer visually as correct
                                    cText.classList.add('correct');
                                }
                                row.appendChild(qText); row.appendChild(aText); row.appendChild(cText);
                                details.appendChild(row);
                        });
                } else {
                        details.innerText = 'No question details saved.';
                }

        // collapsible
        const toggle = document.createElement('button');
        toggle.className = 'history-toggle';
        toggle.innerText = 'Details';
        toggle.onclick = ()=>{ details.classList.toggle('open'); };

        wrapper.appendChild(header);
        wrapper.appendChild(toggle);
        wrapper.appendChild(details);
        historyList.appendChild(wrapper);
    });
}

historyBtn.addEventListener('click', ()=>{
    renderHistory();
    historyModal.setAttribute('aria-hidden','false');
});
closeHistory.addEventListener('click', ()=> historyModal.setAttribute('aria-hidden','true'));
clearHistoryBtn.addEventListener('click', ()=>{ localStorage.removeItem('quiz_history'); renderHistory(); });

// Ripple effect for Android-style feel
function createRipple(e){
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const span = document.createElement('span');
    span.className = 'ripple';
    span.style.width = span.style.height = Math.max(rect.width, rect.height) + 'px';
    span.style.left = (e.clientX - rect.left - rect.width/2) + 'px';
    span.style.top = (e.clientY - rect.top - rect.height/2) + 'px';
    btn.appendChild(span);
    setTimeout(()=> span.remove(), 700);
}

// Game logic
function startTimer(){
    clearInterval(timer);
    remaining = QUESTION_TIME;
    updateTimerDisplay();
    timer = setInterval(()=>{
        remaining--;
        updateTimerDisplay();
        if(remaining <= 0){
            clearInterval(timer);
            handleTimeout();
        }
    },1000);
}

function updateTimerDisplay(){
    if(timerEl) timerEl.innerText = `⏱ ${formatTime(remaining)}`;
}

function handleTimeout(){
    // disable buttons
        Array.from(answerButtons.children).forEach(btn=>{ btn.disabled=true; });
        // record unanswered for this question
        if(!currentAttempt[currentQuestion]){
            const q = questions[currentQuestion];
            const correctText = q.answers.find(a=>a.correct)?.text || null;
            currentAttempt[currentQuestion] = { question: q.question, selected: null, correct: correctText };
        }
    nextBtn.style.display = 'inline-block';
}

function showQuestion(){
    resetState();
    const q = JSON.parse(JSON.stringify(questions[currentQuestion]));
    // shuffle answers for this question
    shuffle(q.answers);
    questionEl.innerText = `${currentQuestion + 1}. ${q.question}`;

    q.answers.forEach((ans, i) => {
        const btn = document.createElement('button');
        btn.innerText = ans.text;
        btn.classList.add('btn','android');
        btn.onclick = (ev) => { createRipple(ev); selectAnswer(btn, ans.correct, ans.text); };
        btn.addEventListener('mousedown', (ev)=> createRipple(ev));
        btn.setAttribute('tabindex', '0');
        answerButtons.appendChild(btn);
        setTimeout(() => btn.classList.add('pop'), 40 * i);
    });

    // set initial focus to first answer button for keyboard users
    const btns = Array.from(answerButtons.querySelectorAll('.btn'));
    if(btns.length){ focusedIndex = 0; btns[0].focus(); }

    questionEl.classList.add('fade-in');
    setTimeout(()=> questionEl.classList.remove('fade-in'), 500);

    updateProgress();
    startTimer();
}

function resetState(){
    nextBtn.style.display = 'none';
    answerButtons.innerHTML = '';
    clearInterval(timer);
    focusedIndex = -1;
}

function selectAnswer(button, correct){
    clearInterval(timer);
    // do not show correct/wrong immediately — only record selection
    Array.from(answerButtons.children).forEach(btn=> btn.disabled=true);
    // mark selected visually
    Array.from(answerButtons.children).forEach(btn=> btn.classList.remove('selected'));
    button.classList.add('selected');

    // record attempt for this question
    const q = questions[currentQuestion];
    const correctText = q.answers.find(a=>a.correct)?.text || null;
    currentAttempt[currentQuestion] = { question: q.question, selected: button.innerText, correct: correctText };

    // update score internally
    if(correct) score++;

    nextBtn.style.display = 'inline-block';
}

// Keyboard navigation: arrow keys to move between answers, Enter to select, Space/Enter for next
document.addEventListener('keydown', (e)=>{
    // ignore when modal open
    if(historyModal && historyModal.getAttribute('aria-hidden') === 'false') return;
    const btns = Array.from(answerButtons.querySelectorAll('.btn'));
    if(btns.length && !isFinished){
        if(e.key === 'ArrowRight' || e.key === 'ArrowDown'){
            e.preventDefault();
            focusedIndex = (focusedIndex + 1) % btns.length;
            btns[focusedIndex].focus();
        } else if(e.key === 'ArrowLeft' || e.key === 'ArrowUp'){
            e.preventDefault();
            focusedIndex = (focusedIndex - 1 + btns.length) % btns.length;
            btns[focusedIndex].focus();
        } else if(e.key === 'Enter' || e.key === ' '){
            // activate focused button if any
            const active = document.activeElement;
            if(active && btns.includes(active)){
                e.preventDefault(); active.click();
            }
        }
    }

    // If finished and Next/Restart has focus, Enter should trigger it
    if(isFinished && (document.activeElement === nextBtn) && (e.key === 'Enter' || e.key === ' ')){
        e.preventDefault(); nextBtn.click();
    }
});

function updateProgress(){
    const pct = Math.round((currentQuestion / questions.length) * 100);
    if(progressBar) progressBar.style.width = pct + '%';
}

function showScore(){
    questionEl.innerText = `Your Score: ${score}/${questions.length}`;
    answerButtons.innerHTML = '';
    if(progressBar) progressBar.style.width = '100%';
    saveHistory(score, questions.length, currentAttempt);

    // reuse the primary next button as Restart for clarity
    isFinished = true;
    nextBtn.innerText = 'Restart';
    nextBtn.style.display = 'inline-block';

    // add Review button
    const cont = document.querySelector('.controls');
    const reviewBtn = document.createElement('button');
    reviewBtn.className = 'next';
    reviewBtn.innerText = 'Review';
    reviewBtn.style.marginRight = '8px';
    reviewBtn.onclick = ()=> startReview();
    cont.insertBefore(reviewBtn, nextBtn);
}

nextBtn.onclick = ()=>{
    if(isFinished){
        // restart flow
        shuffle(questions);
        currentQuestion = 0; score = 0; isFinished = false;
        nextBtn.innerText = 'Next';
        const cont = document.querySelector('.controls');
        cont.innerHTML = '';
        cont.appendChild(nextBtn);
        // reset attempt
        currentAttempt = [];
        showQuestion();
        return;
    }

    currentQuestion++;
    if(currentQuestion < questions.length) showQuestion();
    else showScore();
};

// Randomize questions initially
shuffle(questions);

// Start
showQuestion();

// --- Review flow ---
function startReview(){
    isReview = true;
    reviewIndex = 0;
    showReviewQuestion(reviewIndex);
}

function showReviewQuestion(idx){
    resetState();
    // display question text and answers from questions[idx]
    const q = questions[idx];
    questionEl.innerText = `${idx+1}. ${q.question}`;

    // render answers in original order (not shuffled) for clarity
    q.answers.forEach((ans) => {
        const btn = document.createElement('button');
        btn.innerText = ans.text;
        btn.classList.add('btn','android');
        // mark correct/selected
        const attempt = (JSON.parse(localStorage.getItem('quiz_history') || '[]')[0] && JSON.parse(localStorage.getItem('quiz_history') || '[]')[0].attempt) || currentAttempt;
        const saved = attempt && attempt[idx];
        if(ans.correct){ btn.classList.add('review-correct'); }
        if(saved && saved.selected === ans.text && !ans.correct){ btn.classList.add('review-wrong'); }
        if(saved && saved.selected === ans.text){ btn.classList.add('review-selected'); }
        btn.disabled = true;
        answerButtons.appendChild(btn);
    });

    // build review controls: Prev, Next, Exit
    const cont = document.querySelector('.controls');
    cont.innerHTML = '';
    const prev = document.createElement('button'); prev.className='next'; prev.innerText='Prev';
    const next = document.createElement('button'); next.className='next'; next.innerText='Next';
    const exit = document.createElement('button'); exit.className='next'; exit.innerText='Exit';
    prev.onclick = ()=>{ if(reviewIndex>0){ reviewIndex--; showReviewQuestion(reviewIndex); } };
    next.onclick = ()=>{ if(reviewIndex < questions.length-1){ reviewIndex++; showReviewQuestion(reviewIndex); } };
    exit.onclick = ()=>{ isReview=false; const c = document.querySelector('.controls'); c.innerHTML=''; c.appendChild(nextBtn); nextBtn.innerText = 'Restart'; nextBtn.style.display='inline-block'; questionEl.innerText = `Your Score: ${score}/${questions.length}`; answerButtons.innerHTML=''; };
    // disable prev/next where appropriate
    if(reviewIndex===0) prev.disabled=true; if(reviewIndex===questions.length-1) next.disabled=true;
    cont.appendChild(prev); cont.appendChild(next); cont.appendChild(exit);
}

