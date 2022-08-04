import { advancedSettingAccordions } from "./elements";
import { hide, show } from "./visibility";

export default function accordionController() {
  advancedSettingAccordions.forEach((accordion) => {
    accordion.controller.onclick = () => accordionOnClick(accordion);
  });
}

function accordionOnClick(accordion: Accordion) {
  const accordionImg = accordion.controller.querySelector(
    "img"
  ) as HTMLImageElement;

  if (accordion.expanded) {
    accordionImg.src = "./arrowDown.svg";
    hide(accordion.content);
    addBottomBorder(accordion.controller);
    removeBottomBorder(accordion.container);
    accordion.expanded = false;
  } else {
    accordionImg.src = "./arrowUp.svg";
    addBottomBorder(accordion.container);
    removeBottomBorder(accordion.controller);
    show(accordion.content);
    accordion.expanded = true;
  }
}

function addBottomBorder(el: HTMLElement) {
  el.classList.add("bottom-border");
}

function removeBottomBorder(el: HTMLElement) {
  el.classList.remove("bottom-border");
}
