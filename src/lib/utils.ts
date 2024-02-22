import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function temporaryRepairIosKeyboard() {
  let currentPosition: number, timer: NodeJS.Timeout;
  let speed = 1;
  timer = setInterval(function () {
    currentPosition =
      document.documentElement.scrollTop || document.body.scrollTop;
    currentPosition -= speed;
    window.scrollTo(0, currentPosition);
    currentPosition += speed; //speed变量
    window.scrollTo(0, currentPosition);
    clearInterval(timer);
  }, 1);
}

export function temporaryRepairIosKeyboardFocus() {
  let timer: NodeJS.Timeout;
  timer = setInterval(function () {
    window.scrollTo(0, 200);
    clearInterval(timer);
  }, 1);
}
