
export function translateToUI(input, language) {
  if (language == "nl") return input;
  return translations[language][input];
}

export function translateFromUI(input, language) {
  if (language == "nl") return input;
  const translation = translations[language];
  for (var key in translation) {
    if (typeof key == 'string' && translation[key] == input)
      return key;
  }
  return null;
}

const translations = {
  'en': {
    'lamp': 'lamp',
    'deur': 'door',
    'bericht': 'message',
    'tijd': 'time',
    'muziek': 'music',
    'kat': 'cat',
    'weer': 'weather',
    'goed': 'good',
    'slecht': 'bad',
    'binnen': 'inside',
    'buiten': 'outside',
    'aan': 'on',
    'uit': 'off',
    'klassiek': 'classical',
    'open': 'open',
    'dicht': 'closed',
    'sky': 'sky',
    'jazz': 'jazz',
    '3fm': '3fm',
    '=': '=',
    '>': '>',
    '<': '<',
    'als': 'als',
    'en': 'en'
  }
}
