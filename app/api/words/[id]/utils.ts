export const calculatePoints = (word: string, isPangram: boolean) => {
      if (word.length === 4) {
        return 1;
      }
      const points = word.length;
      if (isPangram) {
        return points + 7;
      }
      return points;
}