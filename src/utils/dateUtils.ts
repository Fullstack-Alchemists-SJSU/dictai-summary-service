export function isWithinLastNDays(dateStr: string, days = 7): boolean {
    const entryDate = new Date(dateStr);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return entryDate >= cutoff;
  }
  
export function getDateRange(days = 7): { start: string; end: string } {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  
  return {
    start: start.toISOString(),
    end: end.toISOString()
  };
}
  