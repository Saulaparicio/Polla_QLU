export function formatDateEs(dateStr) {
  if (!dateStr || dateStr === "TBD") return "TBD";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const [year, month, day] = parts;
  const monthsEs = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const mName = monthsEs[parseInt(month, 10) - 1] || month;
  return `${parseInt(day, 10)}-${mName}-${year}`;
}

export function formatTime12h(timeStr) {
  if (!timeStr || timeStr === "TBD") return "TBD";
  const parts = timeStr.split(":");
  if (parts.length < 2) return timeStr;
  let [hours, minutes] = parts;
  let hr = parseInt(hours, 10);
  const ampm = hr >= 12 ? "PM" : "AM";
  hr = hr % 12;
  hr = hr ? hr : 12; // the hour '0' should be '12'
  return `${hr}:${minutes} ${ampm}`;
}
