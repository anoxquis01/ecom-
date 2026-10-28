import { mountProductCards } from "./product-cards.js";

const INTRO_DURATION_MS = {
  desktop: 8000,
  mobile: 7940,
};
let storeStylesPromise;

export async function startIntro({ desktopGif, mobileGif }) {
  const welcome = document.querySelector("#welcome-root");
  const entryPreview = document.querySelector("#entry-preview");
  const animationScreen = document.querySelector("#intro-animation");
  const introGif = document.querySelector("#intro-gif");
  const store = document.querySelector("#store");

  async function showStore() {
    if (!storeStylesPromise) {
      storeStylesPromise = new Promise((resolve, reject) => {
        const stylesheet = document.createElement("link");
        stylesheet.rel = "stylesheet";
        stylesheet.href = "/styles.css";
        stylesheet.onload = resolve;
        stylesheet.onerror = () => {
          stylesheet.remove();
          storeStylesPromise = null;
          reject(new Error("O estilo da loja não pôde ser carregado."));
        };
        document.head.append(stylesheet);
      });
    }

    await storeStylesPromise;
    await mountProductCards(document.querySelector("#product-grid"));
    entryPreview.hidden = true;
    animationScreen.hidden = true;
    store.hidden = false;
    document.querySelector("#store-title").focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    welcome.hidden = true;
    entryPreview.hidden = true;
    await showStore();
    return;
  }

  const isMobile = window.matchMedia("(max-width: 700px)").matches;
  const selectedGif = isMobile ? mobileGif : desktopGif;
  const introDuration = isMobile
    ? INTRO_DURATION_MS.mobile
    : INTRO_DURATION_MS.desktop;

  try {
    await new Promise((resolve, reject) => {
      introGif.onload = resolve;
      introGif.onerror = () =>
        reject(new Error("O arquivo da animação não pôde ser carregado."));
      introGif.src = selectedGif;
    });
    welcome.hidden = true;
    entryPreview.hidden = true;
    animationScreen.hidden = false;
    await new Promise((resolve) => window.setTimeout(resolve, introDuration));
    await showStore();
  } catch (error) {
    animationScreen.hidden = true;
    entryPreview.hidden = false;
    throw error;
  }
}
