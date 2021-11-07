/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

let score = 0;
const appElement = document.getElementById("appContainer");
const QUIZ_OPTION_BUTTON_CONTAINER_CLASS = "quizOptions";
const QUIZ_OPTION_BUTTON_CLASS = "quizOption";
const QUIZ_OPTION_SUCCESS_CLASS = "quizOptionWin";
const QUIZ_OPTION_FAILURE_CLASS = "quizOptionFail";
const QUIZ_CONTINUE_BUTTON_CLASS = "quizContinue";
const QUIZ_IMAGE_CLASS = "quizImage";
const QUIZ_TYPE_CLASS = "quizType";

const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const addElement = (options) => {
  const { label, onClick, parentElement, className, type, id } = options;
  const element = document.createElement(type);
  if (id) {
    element.id = id;
  }
  if (label) {
    element.textContent = label;
  }
  if (onClick) {
    element.addEventListener("click", onClick);
  }
  if (className) {
    element.classList.add(className);
  }
  parentElement.appendChild(element);

  return element;
};

const drawQuizUI = ({ labels, quizData, quizImageLimit, quizType }) => {
  appElement.innerHTML = ""; // reset main element

  // Init UI
  const scoreBoard = addElement({
    label: `Score: ${score}`,
    parentElement: appElement,
    className: "quizScore",
    type: "label",
  });

  const currentImageNumber = getRandom(0, quizImageLimit - 1);
  fetch(`/imagePath?imageNumber=${currentImageNumber}&group=${quizType}`)
    .then((result) => result.json())
    .then((data) => {
      const { imageName } = data;
      const imagePage = `/images/${quizType}/${imageName}`;
      const buttons = [];

      const image = addElement({
        className: QUIZ_IMAGE_CLASS,
        type: "img",
        parentElement: appElement,
      });
      image.src = imagePage;
      
      const buttonsContainer = addElement({
        className: QUIZ_OPTION_BUTTON_CONTAINER_CLASS,
        type: 'div',
        parentElement: appElement
      })

      // for of
      for (const quizOptionKey in quizData) {
        const option = addElement({
          id: quizOptionKey,
          className: QUIZ_OPTION_BUTTON_CLASS,
          label: quizData[quizOptionKey],
          onClick: () => {
            buttons.forEach(element => {
              element.disabled = true;
              if (imageName.includes(`${element.id}_`)){
                element.classList.add(QUIZ_OPTION_SUCCESS_CLASS)
                if (element.id == option.id) {
                  score++;
                }
              } else {
                element.classList.add(QUIZ_OPTION_FAILURE_CLASS)
              }
            });
            addElement({
              className: QUIZ_CONTINUE_BUTTON_CLASS,
              label: "Continue",
              onClick: () => {
                drawQuizUI({ labels, quizData, quizImageLimit, quizType });
              },
              parentElement: appElement,
              type: "button"
            });
          },
          parentElement: buttonsContainer,
          type: "button"
        });
        buttons.push(option);
      }

    });
};

const initQuiz = (data, quizType) => {
  const { labels } = data;
  const quizData = data[quizType];
  const quizImageLimit = data[`${quizType}ImageCount`];
  // Reset
  score = 0;

  drawQuizUI({ labels, quizData, quizImageLimit, quizType });
};

const initStartScreen = (data) => {
  const { quizTypes, labels } = data;
  appElement.innerHTML = ""; // reset main element

  // Fill-in types to choose from
  quizTypes.forEach((quizType) => {
    const onClick = () => {
      console.log("onClick");
      initQuiz(data, quizType);
    };
    addElement({
      label: labels[quizType].short,
      onClick: onClick,
      parentElement: appElement,
      className: QUIZ_TYPE_CLASS,
      type: "button",
    });
  });
};

const init = () => {
  // Get config info
  fetch("/config.json")
    .then((result) => result.json())
    .then((data) => {
      if (data && data.quizTypes && data.quizTypes.length > 0) {
        console.log(data);
        initStartScreen(data);
      } else {
        alert("Config is corrupted or failed to load!");
      }
    });
};

const onDocumentReady = (fn) => {
  if (
    document.attachEvent
      ? document.readyState === "complete"
      : document.readyState !== "loading"
  ) {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
};

onDocumentReady(init);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/serviceWorker.js?v=1")
      .then((res) => console.log("service worker registered"))
      .catch((err) => console.log(err));
  });
}
