export const show = (el: HTMLElement) => {
  el.classList.remove("hidden");
};

export const hide = (el: HTMLElement) => {
  el.classList.add("hidden");
};
