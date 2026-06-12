const serial = 46184.625;
const utcMs = Math.round((serial - 25569) * 86400 * 1000);
const date = new Date(utcMs);

// We can get the UTC time to format it, or timezone-adjusted.
// Let's see what components we get.
const year = date.getUTCFullYear();
const month = String(date.getUTCMonth() + 1).padStart(2, '0');
const day = String(date.getUTCDate()).padStart(2, '0');
const hours = String(date.getUTCHours()).padStart(2, '0');
const minutes = String(date.getUTCMinutes()).padStart(2, '0');

console.log(`UTC: ${year}-${month}-${day} ${hours}:${minutes}`);

// Let's also check local time:
const lYear = date.getFullYear();
const lMonth = String(date.getMonth() + 1).padStart(2, '0');
const lDay = String(date.getDate()).padStart(2, '0');
const lHours = String(date.getHours()).padStart(2, '0');
const lMinutes = String(date.getMinutes()).padStart(2, '0');

console.log(`Local: ${lYear}-${lMonth}-${lDay} ${lHours}:${lMinutes}`);
