export const getRelevantDate = () => {
  const today = new Date()
  const cutoffTime = new Date(today);
  cutoffTime.setUTCHours(8, 0, 0, 0); // Set to 08:00:00 UTC

  if (today < cutoffTime) {
    // If before 8 AM UTC, return the previous day
    today.setUTCDate(today.getUTCDate() - 1);
  }

  return today.toISOString().split("T")[0]; // Return YYYY-MM-DD format
};