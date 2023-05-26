import jq from "json-query";
import languageData from "./lang.json";

type Language = "de" | "en";

export const initializeLanguage = () => {
  document.querySelector<HTMLAnchorElement>("a.lang.de")!.onclick = () => {
    setLanguageParam("de");
    setLanguage("de");
  };
  document.querySelector<HTMLAnchorElement>("a.lang.en")!.onclick = () => {
    setLanguageParam("en");
    setLanguage("en");
  };

  const language =
    new URL(window.location.href).searchParams.get("lang") === "de"
      ? "de"
      : "en";

  setLanguage(language);
};

const setLanguageParam = (language: Language) => {
  const url = new URL(window.location.href);
  url.searchParams.set("lang", language);
  window.history.pushState(null, "", url.toString());
};

const setLanguage = (language: Language) => {
  setLanguageButton(language);
  setPageContent(language);
};

const setLanguageButton = (language: Language) => {
  document.querySelectorAll(".lang").forEach((elem) => {
    elem.classList.remove("active");
  });
  document.querySelector(`.lang.${language}`)?.classList.add("active");
};

const setPageContent = (language: Language) => {
  const lastModified = new Date(document.lastModified).toLocaleDateString(
    language,
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );
  document.querySelector("#lastModified")!.innerHTML = lastModified;

  const textElements = document.querySelectorAll<HTMLElement>("[data-lang]");
  textElements.forEach((elem) => {
    const key = elem.dataset.lang;
    //make sure the key leads to a valid json path
    const value = jq(`${key}.${language}`, { data: languageData }).value;
    if (value) elem.innerHTML = value;
    else console.warn(`No translation found for key ${key}`);
  });
};
