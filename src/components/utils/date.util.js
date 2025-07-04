export function getWorkingDaysInMonth(month, year = new Date().getFullYear()) {
  let workingDays = 0;

  // JavaScript months are 0-indexed internally
  const jsMonth = month - 1;

  // Get the total number of days in the month
  const totalDays = new Date(year, month, 0).getDate();

  for (let day = 1; day <= totalDays; day++) {
    const date = new Date(year, jsMonth, day);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday

    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDays++;
    }
  }

  return workingDays;
}

export function getMonthDates(month, year) {
  const dateList = [];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // JavaScript months are 0-based; adjust for 1-based input
  const jsMonth = month - 1;

  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, jsMonth, day);
    const dayStr = String(day).padStart(2, "0");
    const monthStr = monthNames[jsMonth];
    const dayOfWeekStr = dayNames[date.getDay()];
    dateList.push({dayStr, monthStr, dayOfWeekStr, day, jsMonth, year});
  }

  return dateList;
}
