const loadLessonBtn = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((data) => displayLessonBtn(data.data));
};

const displayLessonBtn = (lessons) => {
  const lessonSec = document.getElementById("lesson_container");

  lessons.forEach((element) => {
    const createEl = document.createElement("div");
    createEl.innerHTML = `
      <button class="btn btn-outline btn-primary w-33 flex justify-evenly items-center lesson-btn">
        <i class="fa-solid fa-book-open"></i> Lesson-${element.level_no}
      </button>
    `;
    lessonSec.appendChild(createEl);

    const btn = createEl.querySelector("button");

    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".lesson-btn")
        .forEach((b) => b.classList.remove("active"));

      btn.classList.add("active");

      LoadLessonDetails(element.level_no);
    });
  });
};

// Dynamic fetch & display
const LoadLessonDetails = (levelId) => {
  let load = document.querySelector(".load");
  load.style.display = "block";
  fetch(`https://openapi.programming-hero.com/api/level/${levelId}`)
    .then((res) => res.json())
    .then((data) => displayLessonDetails(data.data))
    .catch((err) => console.error(err))

    .finally(() => {
      load.style.display = "none";
    });
};

const displayLessonDetails = (lesson) => {
  const find = document.getElementById("lesson_card_container");
  find.innerHTML = ""; // container খালি করা
  if (!lesson || lesson.length === 0) {
    find.innerHTML = `
          <div class="empty text-center space-y-4 col-span-3 bangla_font ">
            <img class="m-auto " src="./assets/alert-error.png" alt="">
           <p class="text-sm">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
           <p class="text-xl font-bold">নেক্সট Lesson এ যান</p>
        </div>`;
    return;
  }

  lesson.forEach((el) => {
    const create = document.createElement("div");

    create.innerHTML = `
      <div class="card w-80 h-auto p-7 bg-white poppins mb-4">
        <div class="info text-center space-y-5">
          <p class="font-bold text-2xl">${el.word}</p>
          <p class="font-semibold">Meaning / Pronunciation</p>
          <p class="font-semibold">${el.meaning} / ${el.pronunciation}</p>
        </div>
        <br>
        <div class="icon flex justify-between px-3">

           <p class="bg-blue-200 cursor-pointer p-2 rounded-md"><i class="fa-solid fa-circle-info" data-word-id="${el.id}"></i></p> 
      
          <p  class="bg-blue-200 cursor-pointer  p-2 rounded-md">
          <i class="fa-solid fa-volume-high" data-word="${el.word}"></i>
          </p> 
        </div>
      </div>
    `;

    find.appendChild(create);
  });
};
loadLessonBtn();

// Event delegation for info button
document
  .getElementById("lesson_card_container")
  .addEventListener("click", (e) => {
    if (e.target.classList.contains("fa-circle-info")) {
      const wordId = e.target.dataset.wordId;

      fetch(`https://openapi.programming-hero.com/api/word/${wordId}`)
        .then((res) => res.json())
        .then((info) => displayModel(info.data));
    }
  });

let displayModel = (info) => {
  console.log("Modal info:", info);

  let mod = document.getElementById("popup_container");

  // clear old modal
  mod.innerHTML = "";

  // unique modal id
  const modalId = `my_modal_${Date.now()}`;

  let synonyms = Array.isArray(info.synonyms) ? info.synonyms : [];

  mod.innerHTML = `
    <dialog id="${modalId}" class="modal modal-bottom sm:modal-middle">
      <div class="modal-box space-y-3">
        <h3 class="text-xl font-bold">${info.word} 🎙️ ${info.pronunciation}</h3>

        <p class='font-semibold'>Meaning</p>
        <p>${info.meaning}</p>

        <p class='font-semibold'>Examples</p>
        <p>${info.sentence}</p>

        <p class='font-semibold'>সমার্থক শব্দ গুলো</p>
        <div class="flex gap-5">
          ${synonyms
            .map(
              (s) =>
                `<button class="btn text-white btn-active btn-info">${s}</button>`
            )
            .join("")}
        </div>

        <div class="modal-action">
          <form method="dialog">
            <button class="btn btn-primary">Continue Learning</button>
          </form>
        </div>
      </div>
    </dialog>
  `;

  // show modal
  document.getElementById(modalId).showModal();
};

document.getElementById("lesson_card_container")
  .addEventListener("click", (e) => {
    if (e.target.classList.contains("fa-volume-high")) {
      const word = e.target.dataset.word; // dataset থেকে word নাও
      if (word) {
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = "en-US"; // English pronunciation
        window.speechSynthesis.speak(utterance);
      }
    }
  });
