import moment from 'moment';

// Get current date
export function getCurrentDate() {
  return moment().format('MMMM DD, YYYY');
}

// Get tomorrow's date
export function getTomorrowDate() {
  return moment().add(1, 'days').format('MMMM DD, YYYY');
}

// Get a future date (30 days from now)
export function getFutureDate(days = 30) {
  return moment().add(days, 'days').format('MMMM DD, YYYY');
}

// Check if current year is a leap year
export function isLeapYear() {
  return moment().isLeapYear();
}

// Get current year
export function getCurrentYear() {
  return moment().year();
}

// Format a date
export function formatDate(date) {
  return moment(date).format('MMMM DD, YYYY');
}

// Get relative time
export function getRelativeTime(date) {
  return moment(date).fromNow();
}
