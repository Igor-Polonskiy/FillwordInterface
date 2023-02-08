// const breakPoints = [2040, 1920, 1366, 1280, 920]; - цифры в массиве - number
// function yourFunction(rangeMedia) {}
// при первом запуске страницы yourFunction(queryPointsListener(breakPoints, yourFunction)), чтобы получить диапазон при первом запуске

// function yourFunction(rangeMedia) {
//   switch (rangeMedia) {
//     case '0-920':
//       console.log('твой код для разрешения ниже 920');
//       break;
//     case '1366-1920':
//       console.log('твой код для диапазона от 1366 до 1920');
//       break;
//     case '2040-infinit':
//       console.log('твой код для разрешения от 2040 и выше');
//       break;
//   }
// }

// ВАЖНО!!!!
// кейсы расписывать диапазонами, взятыми из чисел передаваемого массива, прописывать как строку!!!
// '1366-1920' - существующий диапазон точек из переданного вами массива [2040, 1920, 1366, 1280, 920]
// в случае крайних чисел массива (в примере это 2040 и 920) прописывать строго '0-920' и '2040-infinit'

// Функция вешает слушатели на ширины экрана из принимаемого массива [2040, 1920, 1366, 1280, 920] (в любом порядке, можно не сортировать)
// вторым аргументом принимается ваша функция yourFunction  которая сработает при прохождении точек и первой загрузке страницы (при услови наличия вызова)
// ваша функция принимает аргумент в виде строки - диапазон вида '1280-1366'

export function queryPointsListener(targetQueries, actionFunc) {
  const sortedArray = targetQueries.sort((a, b) => a - b);
  sortedArray.map((query) => {
    window
      .matchMedia(`(max-width: ${query}px)`)
      .addEventListener("change", (e) => actionFunc(rangeMedia(e)), false);
  });
  function rangeMedia(e) {
    if (e) {
      const targetMedia = Number(e.media?.replace(/[^0-9]/g, ""));
      const index = sortedArray.indexOf(targetMedia);
      const lessRange = !sortedArray[index - 1]
        ? `0-${targetMedia}`
        : `${sortedArray[index - 1]}-${targetMedia}`;
      const largeRange = sortedArray[index + 1]
        ? `${targetMedia}-${sortedArray[index + 1]}`
        : `${targetMedia}-infinit`;
      const range = e.matches ? lessRange : largeRange;
      return range;
    } else {
      // const targetMedia = window.screen.width;
      const targetMedia = window.innerWidth;

      let larger, lesser;
      for (let i = 0; i < sortedArray.length; i++) {
        if (sortedArray[i] < targetMedia) {
          lesser = sortedArray[i];
        } else {
          larger = sortedArray[i];
          break;
        }
      }
      const startLessRange = lesser || "0";
      const startLargerRange = larger || "infinit";
      const startRange = `${startLessRange}-${startLargerRange}`;
      return startRange;
    }
  }
  return rangeMedia();
}

// увеличение картинки
export function scaleImage(targetEl) {
  let task = targetEl.closest(".trainerTaskWrapper");

  let modal = document.createElement("div");
  modal.style.position = "absolute";
  modal.style.left = 0;
  modal.style.top = 0;
  modal.style.bottom = 0;
  modal.style.right = 0;
  modal.style.background = "rgb(235 232 232 / 90%)";
  modal.style.zIndex = 100;
  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.flexDirection = "column";
  modal.style.alignItems = "center";

  let div = document.createElement("div");

  div.style.position = "relative";
  div.style.width = "50%";
  div.style.height = "80%";
  //div.style.top = `${top}px`;
  div.style.textAlign = "center";
  let img = document.createElement("img");
  if (targetEl.tagName === "IMG") {
    img.src = targetEl.src;
  } else {
    img.src = targetEl.style.backgroundImage.slice(5, -2);
  }
  img.style.maxWidth = "100%";
  img.style.maxHeight = "100%";

  div.append(img);
  modal.append(div);
  let close = document.createElement("div");
  close.classList.add("icon_close_button", "close_icon_dark");

  close.style.position = "absolute";
  close.style.top = "0";
  close.style.right = "0";
  close.style.marginLeft = "calc(100%)";
  //close.style.marginBottom = "100px";
  close.style.cursor = "pointer";

  div.append(close);
  modal.addEventListener("pointerdown", (e) => {
    modal.remove();
    task.style.position = "inherit";
  });
  task.style.position = "relative";
  task.append(modal);
}

// вывод и сброс результатов проверки в панели

export function checkingAnswerPositive(controlsBox, infoBox) {
  controlsBox.classList.add("chek_answer_rightChoice_color");
  infoBox.innerHTML =
    '<div class="answer_indicator">&#128516;&nbsp;&nbsp;Молодец!</div>';
}

export function checkingAnswerNegative(controlsBox, infoBox) {
  controlsBox.classList.add("chek_answer_wrongChoice_color");

  infoBox.innerHTML =
    '<div class="answer_indicator">&#128528;&nbsp;&nbsp;Попробуй&nbsp;еще!</div>';
}

export function checkingAnswerReset(controlsBox, infoBox) {
  controlsBox.classList.remove("chek_answer_wrongChoice_color");
  controlsBox.classList.remove("chek_answer_rightChoice_color");

  infoBox.firstElementChild !== null &&
    infoBox.removeChild(infoBox.firstElementChild);
}

// управление индикацией проверенных элементов

export function removeActiveCardClass(card) {
  card.classList.remove("targetChoice_color");
  card.classList.remove("rightChoice_answered");
  card.classList.remove("wrongChoice_answered");
}

export function addCheckClass(card) {
  card.classList.add("targetChoice_color");
}

export function addRightChoiceClass(card) {
  card.classList.add("rightChoice_answered");
}

export function addWrongChoiceClass(card) {
  card.classList.add("wrongChoice_answered");
}

// управление звуком
// пример объекта
/*
const soundDataAttribute =  "drop-data";
let soundSetStates = {
currentAudio: null,
currentAudioIcon: null,
isPlaying: false
};
*/
export function onSoundIconClick(e, soundSet, allAudioFiles, audioAttribute) {
  if (soundSet.currentAudio && soundSet.currentAudioIcon !== e.target) {
    soundSet.currentAudio.pause();
    soundSet.currentAudio.currentTime = 0;
    soundSet.isPlaying = false;
    soundSet.currentAudioIcon.classList.remove("buttonPlayPause--active");
  }

  e.stopPropagation();
  const audio = [...allAudioFiles].find(
    (el) => el.id === e.target.getAttribute(audioAttribute)
  );

  soundSet.currentAudioIcon = e.target;
  soundSet.currentAudio = audio;
  soundSet.isPlaying ? audio.pause() : audio.play();
  if (e.target.classList.contains("buttonPlayPausePlayPause_wrap")) {
    e.target.classList.toggle("buttonPlayPause--active");
  }
  audio.onplaying = function () {
    soundSet.isPlaying = true;
  };
  audio.onpause = function () {
    soundSet.isPlaying = false;
  };
  audio.onended = function () {
    e.target.classList.remove("buttonPlayPause--active");
    soundSet.isPlaying = false;
    soundSet.currentAudio = null;
    soundSet.currentAudioIcon = null;
  };
}

export function resetSound(soundSet) {
  if (soundSet.currentAudio && soundSet.currentAudioIcon) {
    soundSet.currentAudio.pause();
    soundSet.currentAudio.currentTime = 0;
    soundSet.isPlaying = false;
    soundSet.currentAudioIcon.classList.remove("buttonPlayPause--active");
  }
}
// рандомайзер объектов
export function getRandomPositionToCard(card) {
  let randomPos = Math.floor(Math.random() * 12);
  card.style.order = randomPos;
}
export function shuffleCards(array) {
  const length = array.length;
  for (let i = length; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * i);
    const currentIndex = i - 1;
    const temp = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temp;
  }
  return array;
}

// кнопки слайдера
/*
let sliderSetStates = {
sliderItemWidth: null,
sliderSize: null,
sliderWrapperSize: null,
sliderShift: 0
}


onBtnLeftClick(
  sliderSetStates, - данные для управления слайдером
  dragBox, - стартовый контейнер с перетаскиваемыми элементами
  leftBtn, - кнопка влево, которую скрыть
  rightBtn); - кнопка вправо, которую скрыть

onBtnRightClick(sliderSetStates, dragBox, leftBtn, rightBtn);
*/

export function getBlocksSizes(sliderSet, dragContainer) {
  sliderSet.sliderSize = dragContainer.scrollWidth;
  sliderSet.sliderItemWidth = dragContainer.children[0].clientWidth;
}

export function onBtnLeftClick(
  sliderSet,
  dragContainer,
  leftButton,
  rightButton
) {
  getBlocksSizes(sliderSet, dragContainer);

  if (sliderSet.sliderShift < 0) {
    sliderSet.sliderShift += sliderSet.sliderItemWidth;
    dragContainer.style.left = `${sliderSet.sliderShift}px`;
  }
  showArrows(sliderSet, leftButton, rightButton);
}

export function onBtnRightClick(
  sliderSet, //  - данные для управления слайдером
  dragContainer, // - стартовый контейнер с перетаскиваемыми элементами
  leftButton, // - кнопка влево, которую скрыть
  rightButton
) {
  // -кнопка вправо, которую скрыть

  getBlocksSizes(sliderSet, dragContainer);

  if (
    sliderSet.sliderShift >
    -sliderSet.sliderSize + sliderSet.sliderWrapperSize
  ) {
    sliderSet.sliderShift -= sliderSet.sliderItemWidth;
    dragContainer.style.left = `${sliderSet.sliderShift}px`;
  }
  showArrows(sliderSet, leftButton, rightButton);
}

export function showArrows(sliderSet, leftButton, rightButton) {
  if (sliderSet.sliderShift === 0) {
    leftButton.classList.add("noDisplayElement");
  } else leftButton.classList.remove("noDisplayElement");

  if (
    sliderSet.sliderShift <=
    -sliderSet.sliderSize + sliderSet.sliderWrapperSize
  ) {
    rightButton.classList.add("noDisplayElement");
  } else rightButton.classList.remove("noDisplayElement");
}

// кнопки слайдшоу
// пример объекта
/*
const slideshowParameters = {
  currentShowImg: slideBoxImages[0], // первый слайд
  counter: 1, // начальный счетчик
};
*/
export function changeSlideMoveLeft(
  slideshowParameters, // данные для слайда
  numberOfSlide, //блок, куда пишется цифра
  arrayOfSlides, // массив слайдов
  leftBtn, // кнопка влево, которую скрыть
  rightBtn // кнопка вправо, которую скрыть
) {
  if (slideshowParameters.counter > 1) {
    slideshowParameters.counter -= 1;
    slideshowParameters.currentShowImg.classList.add("visually-hidden");

    slideshowParameters.currentShowImg =
      arrayOfSlides[slideshowParameters.counter - 1];

    slideshowParameters.currentShowImg.classList.remove("visually-hidden");
    numberOfSlide.textContent = slideshowParameters.counter;
    rightBtn.classList.remove("noDisplayElement");
  }

  if (slideshowParameters.counter === 1) {
    leftBtn.classList.add("noDisplayElement");
  }
}

export function changeSlideMoveRight(
  slideshowParameters, // данные для слайда
  numberOfSlide, //блок, куда пишется цифра
  arrayOfSlides, // массив слайдов
  leftBtn, // кнопка влево, которую скрыть
  rightBtn // кнопка вправо, которую скрыть
) {
  if (slideshowParameters.counter < arrayOfSlides.length) {
    slideshowParameters.counter += 1;

    leftBtn.classList.remove("noDisplayElement");

    slideshowParameters.currentShowImg.classList.add("visually-hidden");

    slideshowParameters.currentShowImg =
      arrayOfSlides[slideshowParameters.counter - 1];

    slideshowParameters.currentShowImg.classList.remove("visually-hidden");

    numberOfSlide.textContent = slideshowParameters.counter;
  }

  if (slideshowParameters.counter === arrayOfSlides.length) {
    rightBtn.classList.add("noDisplayElement");
  }
}

// сброс стилей и append
export function changeStyles(draggingElem) {
  draggingElem.style.position = "relative ";
  draggingElem.style.zIndex = null;
  draggingElem.style.top = null;
  draggingElem.style.left = null;
}

export function dragAppend(dropPlace, draggingElem, findIdx) {
  const referenceElement = [...dropPlace.children][findIdx];
  dropPlace.insertBefore(draggingElem, referenceElement);
  changeStyles(draggingElem);
}

export function dropAppend(dropPlace, draggingElem) {
  dropPlace.appendChild(draggingElem);
  changeStyles(draggingElem);
}

// полная исчезалка (для тренажёров без проверки)
export function toggleDisplayVisibilityElement(elem) {
  elem.classList.toggle("noDisplayElement");
}

// глушилка без опасити (для панели после нажатия проверки)
export function togglePointerEventElement(elem) {
  elem.classList.toggle("noEventElement");
}

// глушилка с опасити (для индикации неактивности элемента)
/* НА ПРИМЕРЕ КНОПКИ -ПРОВЕРИТЬ-:

вводим переменную
let isGameStart = false;
----------------------------------------
при запуске сборщика - запускаем для сокрытия
toggleOpacityAndEventsElement(btnTest);
----------------------------------------
в функцию сброс:
  ....function onBtnResetClick(e) {
    if (isGameStart) {
      toggleOpacityAndEventsElement(btnTest);
      isGameStart = false;
    }
    .....

в условие запускающееся по взаимодействии с игровыми элементами (игнорируя плеер и scaleImage):
   ....
  if (!isGameStart) {
      toggleOpacityAndEventsElement(btnTest);
      isGameStart = true;
    }
  .......
*/
export function toggleOpacityAndEventsElement(elem) {
  elem.classList.toggle("noEventAddOpacity");
}

// функция для скрытия/отображения целого блока
export function toggleVisuallyHiddenClass(elem) {
  elem.classList.toggle("visually-hidden");
}

// ФУНКЦИИ ДЛЯ РЕНДЕРА ПАНЕЛИ ПРОВЕРКИ

// функция для рендера панели проверки

// renderCheckPanel(taskWrapper, true); // вызов в тренажере

export function renderCheckPanel(wrapper, isCheckBtnActive) {
  // isCheckBtnActiv : true - если кнопка  "Проверить" нужна в тренажере,
  // false -если нет
  const isActive = isCheckBtnActive ? "" : "noDisplayElement";
  const markup = `
     <div class="show-answer-controls checkTask">
            <div type="button" class="resetButton taskBtn">
              СБРОС
              <div class="reloadIconTask">&#8635;</div>
            </div>
            <div class="show-answer-info chek_answer"></div>
            <div type="button" class="checkButton taskBtn ${isActive}">
              <div class="checkIconTask">&#10004;</div>
              ПРОВЕРИТЬ
            </div>
          </div>
    `;
  return wrapper.insertAdjacentHTML("beforeend", markup);
}

// функция для получения ссылок на элементы панели проверки

// const { btnReset, btnTest, controlsBox, infoBox } =
//   getCheckPanelElements(taskWrapper); получение ссылок в тренажере (имена переменных в объекте должны быть такими/не изменять)

export function getCheckPanelElements(wrapper) {
  const checkPanelControls = {
    btnReset: wrapper.querySelector(".resetButton"),
    btnTest: wrapper.querySelector(".checkButton"),
    controlsBox: wrapper.querySelector(".show-answer-controls"),
    infoBox: wrapper.querySelector(".show-answer-info"),
  };

  return checkPanelControls;
}
//проверка на правильный порядок элементов до начала решения упражнения
//itemsClass - класс перетаскиваемых элементов(СТРОКА)
//data - исходный массив данных
//resetTask - функция для перерендера
//attribute - атрибут по которому сравнивается правильность последовательности(id или другой уникальный атрибут)(СТРОКА)
//key - ключ для сравнения с атрибутом(СТРОКА)
//функция вызывается после первого рендера таска, и во время taskReset
export function shuffleTracing(
  taskWrapper,
  itemsClass,
  data,
  resetTask,
  attribute,
  key
) {
  const tempArr = data.map((el) => el.answerTag);

  if (tempArr.every((el) => el === tempArr[0])) {
    return;
  } else {
    let winVar = 0;
    let cards = taskWrapper.querySelectorAll(`.${itemsClass}`);

    cards.forEach((item, index) => {
      if (item.getAttribute(`${attribute}`) === data[index][key].toString()) {
        winVar++;
      }
    });
    if (winVar === data.length) {
      resetTask();
    }
  }
}
