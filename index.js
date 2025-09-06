const lessonContainer = document.getElementById("lesson_container");
const wordContainer = document.getElementById("word_container");
const initialText = document.getElementById("initial_text");

let allWordsData = []; // global storage for all words

// Load all lessons
const loadLesson = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then(res => res.json())
    .then(data => displayLesson(data.data));
};

// Load lesson by id
const lessonBtn = (id) => {
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then(res => res.json())
    .then(data => displayWords(data.data));
};

// Display words (dynamic cards)
const displayWords = (words) => {
  wordContainer.innerHTML = "";
  if (words.length === 0) {
    wordContainer.innerHTML = `
      <div class="col-span-3 text-center space-y-4 bangla_font flex flex-col items-center justify-center">
        <img class="m-auto" src="./assets/alert-error.png" alt="">
        <p class="text-lg">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
        <p class="text-3xl font-bold">নেক্সট Lesson এ যান</p>
      </div>`;
    return;
  }

  initialText.classList.add("hidden");

  words.forEach(elem => {
    const empty = "not found";
    const createDiv = document.createElement("div");
    createDiv.innerHTML = `
      <div class="w-78 h-55 bg-white rounded-md p-5">
        <div class="text-center space-y-4 bangla_font">
          <p class="font-bold text-2xl">${elem.word || empty}</p>
          <p class="font-semibold text-lg">Meaning / Pronunciation</p>
          <p class="font-semibold text-lg">"${elem.meaning || empty} / ${elem.pronunciation || empty}"</p>
        </div>
        <div class="flex justify-between px-4 mt-4">
          <button class="bg-[rgba(26,145,255,0.1)] p-2 rounded-lg" onclick="loadModel(${elem.id})">
            <i class="fa-solid fa-circle-info"></i>
          </button>
          <button class="bg-[rgba(26,145,255,0.1)] p-2 rounded-lg" onclick="speakWord('${elem.word}')">
            <i class="fa-solid fa-volume-high"></i>
          </button>
        </div>
      </div>`;
    wordContainer.appendChild(createDiv);
  });
};

// Display lessons
const displayLesson = (level) => {
  lessonContainer.innerHTML = "";
  level.forEach(element => {
    const createElement = document.createElement("div");
    createElement.innerHTML = `
      <button onclick="lessonBtn(${element.level_no})" class="lesson_btn btn btn-outline btn-primary">
        <i class="fa-solid fa-book-open"></i> Lesson-${element.level_no}
      </button>`;
    lessonContainer.appendChild(createElement);
  });
  activeBtn();
};

// Active lesson button
const activeBtn = () => {
  const btns = document.getElementsByClassName("lesson_btn");
  for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
      const current = document.querySelector(".lesson_btn.active");
      if (current) current.classList.remove("active");
      this.classList.add("active");
    });
  }
};

// Load modal by word id
const loadModel = (id) => {
  fetch(`https://openapi.programming-hero.com/api/word/${id}`)
    .then(res => res.json())
    .then(data => displayModel(data.data));
};

// Display modal content
const displayModel = (word) => {
  const modalContent = document.getElementById("modal_content");
  modalContent.innerHTML = `
    <h3 class="text-2xl font-bold">${word.word} (🎙️: ${word.pronunciation})</h3>
    <p class="font-semiboldbold">Meaning</p>
    <p>${word.meaning}</p>
    <p class="font-semibold">Example</p>
    <p>${word.sentence}</p>
    <p class="font-semibold">সমার্থক শব্দ গুলো</p>
    <ul class="flex gap-3">
      <li><button class="btn p-3 bg-sky-200">${word.synonyms[0] || "empty"}</button></li>
      <li><button class="btn p-3 bg-sky-200">${word.synonyms[1] || "empty"}</button></li>
      <li><button class="btn p-3 bg-sky-200">${word.synonyms[2] || "empty"}</button></li>
    </ul>
    <div class="modal-action">
      <button type="button" class="btn btn-primary" onclick="document.getElementById('my_modal_1').close()">Continue Learning</button>
    </div>`;
  document.getElementById("my_modal_1").showModal();
};

// Text-to-Speech
const speakWord = (word) => {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  } else {
    alert("Your browser does not support Text-to-Speech!");
  }
};

// Search & filter words
document.getElementById("search-btn").addEventListener("click", (e) => {
  e.preventDefault();
  const inputText = document.getElementById("input").value.toLowerCase().trim();
  const filteredWords = allWordsData.filter(word => word.word.toLowerCase().includes(inputText));
  
  if(filteredWords.length === 0){
    wordContainer.innerHTML = `<p class="text-center text-lg font-bold col-span-3">No matching words found</p>`;
  } else {
    displayWords(filteredWords); // show filtered words
  }
});

// Load all words initially for search
const allWords = () => {
  fetch('https://openapi.programming-hero.com/api/words/all')
    .then(res => res.json())
    .then(data => allWordsData = data.data);
}

// Initial load
allWords();
loadLesson();
