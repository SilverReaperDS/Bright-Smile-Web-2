function normalizePhone(phone) {
  return String(phone ?? '').trim();
}

/** Returns error string or null if OK */
function validatePhoneRequired(phone) {
  const t = normalizePhone(phone);
  if (!t) {
    return 'Phone number is required';
  }
  const digits = t.replace(/\D/g, '');
  if (digits.length < 7) {
    return 'Enter a valid phone number (at least 7 digits)';
  }
  return null;
}

module.exports = { normalizePhone, validatePhoneRequired };
