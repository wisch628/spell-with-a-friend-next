import { WordObject } from "./WordContainer";



export const wordErrorCheck = ({foundWords, answers, newWord, centerLetter, outerLetters}: {foundWords: WordObject[]; answers: string[], newWord: string, centerLetter: string, outerLetters: string[]}) => {
    const string = centerLetter + outerLetters.join("");
    const regex = new RegExp(`^[${string}]*$`);
    if (newWord.length <= 3) {
      return "Too Short!";
    } else if (regex.test(newWord) === false) {
      return "Bad Letters!";
    } else if (newWord.includes(centerLetter) === false) {
      return "Missing center letter!";
    } else if (answers.indexOf(newWord) === -1) {
      return "Not in word list!!";
    } else if (foundWords.filter(({word}) => word === newWord).length > 0) {
      return "You already got that word!";
    }
    return ''
}

export const pangramCheck = ({newWord, pangrams}: {newWord: string, pangrams: string[]}) => {
      debugger;
      if (pangrams.includes(newWord)) {
        return true
      }
      return false
     
}