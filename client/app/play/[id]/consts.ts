import { GameData } from "./types";

export const EMPTY_GAME_DATA: GameData = {
    outerLetters: [],
    centerLetter: "",
    displayDate: "",
    displayWeekday: "",
    answers: [],
    pangrams: [],
  }

  export const INVITE_FRIEND_ROUTE = "/join?gameCode="