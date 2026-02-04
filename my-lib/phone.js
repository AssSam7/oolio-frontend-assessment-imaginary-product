import * as libphonenumber from 'libphonenumber-js';

// Validate phone number
export function validatePhoneNumber(phoneNumber, country = 'US') {
  try {
    const phoneNumberObj = libphonenumber.parsePhoneNumber(phoneNumber, country);
    return phoneNumberObj.isValid();
  } catch (error) {
    return false;
  }
}

// Format phone number
export function formatPhoneNumber(phoneNumber, country = 'US') {
  try {
    const phoneNumberObj = libphonenumber.parsePhoneNumber(phoneNumber, country);
    return phoneNumberObj.formatInternational();
  } catch (error) {
    return phoneNumber;
  }
}

// Get phone number type (mobile, fixed-line, etc.)
export function getPhoneNumberType(phoneNumber, country = 'US') {
  try {
    const phoneNumberObj = libphonenumber.parsePhoneNumber(phoneNumber, country);
    return phoneNumberObj.getType();
  } catch (error) {
    return 'UNKNOWN';
  }
}

// Get country code from phone number
export function getCountryCode(phoneNumber, country = 'US') {
  try {
    const phoneNumberObj = libphonenumber.parsePhoneNumber(phoneNumber, country);
    return phoneNumberObj.country;
  } catch (error) {
    return null;
  }
}

// Parse phone number
export function parsePhone(phoneNumber, country = 'US') {
  try {
    const phoneNumberObj = libphonenumber.parsePhoneNumber(phoneNumber, country);
    return {
      isValid: phoneNumberObj.isValid(),
      international: phoneNumberObj.formatInternational(),
      national: phoneNumberObj.formatNational(),
      country: phoneNumberObj.country,
      type: phoneNumberObj.getType(),
    };
  } catch (error) {
    return {
      isValid: false,
      error: 'Invalid phone number',
    };
  }
}
