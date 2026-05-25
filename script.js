// Change this passcode to the secret code you want to use.
const CORRECT_PASSCODE = "0924";

// Change this name to the birthday person's name or nickname.
const BIRTHDAY_NAME = "Nemoy";

// Change this final message to your own birthday letter.
const FINAL_MESSAGE = `Happy 25th birthday, my love.

You're older than me again bebu :) I hope and pray that God will give you more birthdays and happy moments to celebrate. I hope this new chapter brings you more peace, more laughter, more confidence, and more reasons to smile.

You have already been through so much, and I am proud of the person you are becoming. I hope 25 treats you gently and gives you the happiness you truly deserve.

Even from far away, I am celebrating you with all my heart. I may not be there beside you today, but I hope you feel my love, my support, and my prayers for you.

May all your dreams come true langga. I will always be here for you. I love youuu.`;


const PHOTO_PATHS = [
  "assets/photo1.png",
  "assets/photo2.jpeg",
  "assets/photo3.jpg",
  "assets/photo4.png"
];

// Gift messages shown after choosing a gift.
const GIFT_MESSAGES = [
  "You make every day brighter.",
  "You deserve all the happiness langga",
  "There is one more surprise waiting."
];

document.addEventListener("DOMContentLoaded", () => {
  const pages = document.querySelectorAll(".page");

  const passcodeDisplay = document.getElementById("passcodeDisplay");
  const cakeMessage = document.getElementById("cakeMessage");
  const scrapbookTitle = document.getElementById("scrapbookTitle");

  const giftNextButton = document.getElementById("giftNextButton");
  const giftRow = document.querySelector(".gift-row");
  const giftItems = document.querySelectorAll(".gift-item");

  const giftWishBlowButton = document.getElementById("giftWishBlowButton");
  const giftWishBackButton = document.getElementById("giftWishBackButton");
  const giftWishCakeScene = document.getElementById("giftWishCakeScene");
  const giftWishMessage = document.getElementById("giftWishMessage");
  const giftWishCard = document.querySelector(".gift-wish-card");

  const cakeNextButton = document.getElementById("cakeNextButton");
  const blowButton = document.getElementById("blowButton");
  const cakeScene = document.getElementById("cakeScene");

  const letterGreeting = document.getElementById("letterGreeting");
  const finalMessageText = document.getElementById("finalMessageText");
  const openLetterButton = document.getElementById("openLetterButton");
  const letterPaper = document.getElementById("letterPaper");
  const letterCard = document.querySelector(".letter-card");

  const typeSound = document.getElementById("typeSound");
  const bgMusic = document.getElementById("bgMusic");

  let enteredCode = "";
  let selectedGiftIndex = null;
  let giftWishBlown = false;
  let candlesBlown = false;
  let typingTimer = null;

  createPasscodeBoxes();
  connectPhotos();
  fillLetter();
  renderPasscode();
  updateDocumentTitle();

  setupNavigation();
  setupKeypad();
  setupGifts();
  setupGiftWish();
  setupCake();
  setupLetterOpen();

  function playBackgroundMusic() {
  if (!bgMusic) {
    return;
  }

  bgMusic.volume = 0.45;
  bgMusic.loop = true;

  bgMusic.play().catch(() => {
    // Some browsers may still block autoplay.
  });
}

  function setupNavigation() {
    document.querySelectorAll("[data-next]").forEach((button) => {
      button.addEventListener("click", () => {
        showPage(button.dataset.next);
      });
    });

    document.querySelectorAll("[data-back]").forEach((button) => {
      button.addEventListener("click", () => {
        if (button.classList.contains("gift-back-button")) {
          resetGiftSelection();
        }

        showPage(button.dataset.back);
      });
    });
  }

  function setupKeypad() {
    document.querySelectorAll(".keypad-btn").forEach((button) => {
      button.addEventListener("click", () => {
        addPasscodeCharacter(button.dataset.value);
      });
    });

    document.addEventListener("keydown", (event) => {
      const passwordPage = document.querySelector('[data-page="password"]');

      if (!passwordPage || !passwordPage.classList.contains("active")) {
        return;
      }

      const allowedKeys = "0123456789*#";

      if (!allowedKeys.includes(event.key)) {
        return;
      }

      addPasscodeCharacter(event.key);
    });
  }

  function setupGifts() {
    if (!giftRow || !giftNextButton || giftItems.length === 0) {
      return;
    }

    giftItems.forEach((gift, index) => {
      const message = gift.querySelector(".gift-message");

      if (message) {
        message.textContent = GIFT_MESSAGES[index] || "A sweet surprise is waiting.";
      }

      gift.addEventListener("click", () => {
        // Only one gift can be selected at a time.
        if (selectedGiftIndex !== null) {
          return;
        }

        selectedGiftIndex = index;

        gift.classList.add("opened", "selected-gift");
        giftRow.classList.add("has-selection");

        // Gift 3 goes directly to the birthday letter page.
        giftNextButton.dataset.next = index === 2 ? "letter" : `gift-result-${index}`;
        giftNextButton.classList.remove("hidden");
      });
    });
  }

  function setupGiftWish() {
    if (!giftWishBlowButton || !giftWishCakeScene || !giftWishCard || !giftWishMessage) {
      return;
    }

    // No BACK button before blowing the candles.
    if (giftWishBackButton) {
      giftWishBackButton.classList.add("hidden");
    }

    giftWishBlowButton.addEventListener("click", () => {
      if (giftWishBlown) {
        return;
      }

      giftWishBlown = true;

      giftWishCakeScene.classList.add("blown");
      giftWishCard.classList.add("wish-blown");
      giftWishBlowButton.classList.add("hidden");

      if (giftWishBackButton) {
        giftWishBackButton.classList.remove("hidden");
      }

      typeText(giftWishMessage, "Happy birthday my loveee. May all your dreams come true.", 65);
    });
  }

  function setupCake() {
    if (!blowButton || !cakeScene || !cakeNextButton || !cakeMessage) {
      return;
    }

    blowButton.addEventListener("click", () => {
      if (candlesBlown) {
        return;
      }

      candlesBlown = true;
      cakeScene.classList.add("blown");
      typeText(cakeMessage, buildBirthdayLine(), 65);
      cakeNextButton.classList.remove("hidden");
    });
  }

  function setupLetterOpen() {
    if (!openLetterButton || !letterPaper || !letterCard) {
      return;
    }

    openLetterButton.addEventListener("click", () => {
      letterCard.classList.add("letter-opened");
    });
  }

  function createPasscodeBoxes() {
    if (!passcodeDisplay) {
      return;
    }

    passcodeDisplay.innerHTML = "";

    for (let index = 0; index < CORRECT_PASSCODE.length; index += 1) {
      const box = document.createElement("div");
      box.className = "passcode-box";
      passcodeDisplay.appendChild(box);
    }
  }

  function renderPasscode() {
    if (!passcodeDisplay) {
      return;
    }

    const boxes = passcodeDisplay.querySelectorAll(".passcode-box");

    boxes.forEach((box, index) => {
      box.textContent = enteredCode[index] ? "\u2022" : "";
    });
  }

  function addPasscodeCharacter(value) {
    if (enteredCode.length >= CORRECT_PASSCODE.length) {
      return;
    }

    playTypeSound();

    enteredCode += value;
    renderPasscode();

    if (enteredCode.length === CORRECT_PASSCODE.length) {
      window.setTimeout(checkPasscode, 180);
    }
  }

  function playTypeSound() {
    if (!typeSound) {
      return;
    }

    typeSound.currentTime = 0;

    typeSound.play().catch(() => {
      // Browser may block audio until user interaction.
    });
  }

  function checkPasscode() {
    if (enteredCode === CORRECT_PASSCODE) {
      enteredCode = "";
      renderPasscode();
      playBackgroundMusic();
      showPage("intro");
      return;
    }

    if (!passcodeDisplay) {
      return;
    }

    passcodeDisplay.classList.add("shake");

    window.setTimeout(() => {
      enteredCode = "";
      renderPasscode();
      passcodeDisplay.classList.remove("shake");
    }, 420);
  }

  function showPage(pageName) {
  pages.forEach((page) => {
    const isActive = page.dataset.page === pageName;
    page.classList.toggle("active", isActive);

    if (isActive) {
      page.scrollTop = 0;
    }
  });

  if (pageName === "gift-result-1") {
    prepareGiftWishPage();
  }

  if (pageName === "letter") {
    prepareLetterPage();
  }

  if (pageName === "cake") {
    prepareCakePage();
  }

  if (pageName === "scrapbook") {
    typeText(scrapbookTitle, "Happy birthday", 90);
  }
}

function prepareGiftWishPage() {
  if (giftWishBlown) {
    if (giftWishBlowButton) {
      giftWishBlowButton.classList.add("hidden");
    }

    if (giftWishBackButton) {
      giftWishBackButton.classList.remove("hidden");
    }

    return;
  }

  if (giftWishBlowButton) {
    giftWishBlowButton.classList.remove("hidden");
  }

  if (giftWishBackButton) {
    giftWishBackButton.classList.add("hidden");
  }

  if (giftWishMessage) {
    giftWishMessage.textContent = "Make a wish";
    giftWishMessage.classList.remove("is-typing");
  }
}

function prepareLetterPage() {
  if (letterCard) {
    letterCard.classList.remove("letter-opened");
  }

  const letterPage = document.querySelector('[data-page="letter"]');

  if (letterPage) {
    letterPage.scrollTop = 0;
  }
}

  function prepareCakePage() {
    if (!cakeScene || !cakeNextButton || !cakeMessage) {
      return;
    }

    if (!candlesBlown) {
      cakeScene.classList.remove("blown");
      cakeNextButton.classList.add("hidden");
      typeText(cakeMessage, "Make a wish", 90);
      return;
    }

    cakeScene.classList.add("blown");
    cakeNextButton.classList.remove("hidden");
    cakeMessage.textContent = buildBirthdayLine();
    cakeMessage.classList.remove("is-typing");
  }

  function resetGiftSelection() {
    selectedGiftIndex = null;

    if (giftRow) {
      giftRow.classList.remove("has-selection");
    }

    if (giftNextButton) {
      giftNextButton.classList.add("hidden");
      giftNextButton.dataset.next = "cake";
    }

    giftItems.forEach((gift) => {
      gift.classList.remove("opened", "selected-gift");
    });

    resetGiftWish();
  }

  function resetGiftWish() {
    giftWishBlown = false;
    window.clearInterval(typingTimer);

    if (giftWishCakeScene) {
      giftWishCakeScene.classList.remove("blown");
    }

    if (giftWishCard) {
      giftWishCard.classList.remove("wish-blown");
    }

    if (giftWishBlowButton) {
      giftWishBlowButton.classList.remove("hidden");
    }

    if (giftWishBackButton) {
      giftWishBackButton.classList.add("hidden");
    }

    if (giftWishMessage) {
      giftWishMessage.textContent = "Make a wish";
      giftWishMessage.classList.remove("is-typing");
    }
  }

  function typeText(element, text, speed) {
    if (!element) {
      return;
    }

    window.clearInterval(typingTimer);

    element.textContent = "";
    element.classList.add("is-typing");

    let index = 0;

    typingTimer = window.setInterval(() => {
      element.textContent += text[index];
      index += 1;

      if (index >= text.length) {
        window.clearInterval(typingTimer);
        element.classList.remove("is-typing");
      }
    }, speed);
  }

  function connectPhotos() {
    const safePhotos = [
      PHOTO_PATHS[0] || "assets/photo1.png",
      PHOTO_PATHS[1] || PHOTO_PATHS[0] || "assets/photo2.jpeg",
      PHOTO_PATHS[2] || PHOTO_PATHS[0] || "assets/photo3.jpg",
      PHOTO_PATHS[3] || PHOTO_PATHS[0] || "assets/photo4.png"
    ];

    setImageSource("passwordPhoto", safePhotos[0]);
    setImageSource("scrapbookMainPhoto", safePhotos[3]);
    setImageSource("letterPhoto1", safePhotos[0]);
    setImageSource("letterPhoto2", safePhotos[1]);
    setImageSource("letterPhoto3", safePhotos[2]);
  }

  function setImageSource(id, src) {
    const image = document.getElementById(id);

    if (image) {
      image.src = src;
    }
  }

  function fillLetter() {
    if (letterGreeting) {
      letterGreeting.textContent = `Dear ${getDisplayName()},`;
    }

    if (finalMessageText) {
      finalMessageText.textContent = FINAL_MESSAGE;
    }
  }

  function updateDocumentTitle() {
    document.title = hasCustomName()
      ? `${BIRTHDAY_NAME.trim()} Birthday Greeting`
      : "Birthday Greeting";
  }

  function buildBirthdayLine() {
    return hasCustomName()
      ? `Happy birthday, ${BIRTHDAY_NAME.trim()}`
      : "Happy birthday, my love";
  }

  function getDisplayName() {
    return hasCustomName() ? BIRTHDAY_NAME.trim() : "my love";
  }

  function hasCustomName() {
    const safeName = BIRTHDAY_NAME.trim();
    return safeName !== "" && safeName !== "Name Here";
  }
});