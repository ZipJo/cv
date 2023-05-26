import "./css/app.css";
import favicon from "./files/icon_colored.ico";
import profileImage from "./files/cv-profil.png";
import InterimReportRE from "./files/Jonas_Brüggen-Zwischenzeugnis_RE.pdf";
import { initializeLanguage } from "./lang/lang";
import confetti from "canvas-confetti";

const confettiOptions = () => ({
  particleCount: 15,
  spread: 26,
  angle: 50,
  startVelocity: 12,
  decay: 0.92,
  ticks: 100,
  origin: {
    x:
      (document.querySelector(".dob")!.getBoundingClientRect().x + 23) /
      window.innerWidth,
    y:
      (document.querySelector(".dob")!.getBoundingClientRect().y + 10) /
      window.innerHeight,
  },
});

const main = () => {
  initializeLanguage();

  // add confetti
  document.querySelectorAll<HTMLElement>("[data-confetti]").forEach((elem) => {
    elem.onclick = () => confetti(confettiOptions());
  });

  // add static files
  document.querySelector<HTMLLinkElement>("link[rel=icon]")!.href = favicon;
  document.querySelector<HTMLBaseElement>("[data-report]")!.href =
    InterimReportRE;
  document.querySelector<HTMLImageElement>("img[alt=profileImage]")!.src =
    profileImage;
};

main();
