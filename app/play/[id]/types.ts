export interface GameData {
  answers: string[];
  centerLetter: string;
  displayDate: string;
  displayWeekday: string;
  outerLetters: string[];
  pangrams: string[];
}

export type PopUp = "chat" | "invite" | "";
