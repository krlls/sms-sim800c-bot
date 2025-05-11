export function phoneFormatter(phoneNumber: string, formatString: string, options?: any) {
  const countryCode = phoneNumber.slice(0, -10);
  if (!options || !options.normalize) {
    phoneNumber = normalize(phoneNumber)
  }

  for ( let i = 0, l = phoneNumber.length; i < l; i++ ) {
    formatString = formatString.replace("N", phoneNumber[i]);
  }

  return countryCode + formatString;
}

function normalize(phoneNumber) {
  return phoneNumber.replace(
    /^[\+\d{1,3}\-\s]*\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
    "$1$2$3"
  );
}
