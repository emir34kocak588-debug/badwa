// Kufur kok listesi. Mesaj normalize edilip (kucuk harf, turkce karakter sadelestirme,
// tekrar eden harfleri azaltma, bosluk/noktalama temizleme) bu koklere gore kontrol edilir.
// Boylece "a.m.k", "amkkk", "OrOsPu CoCuGu" gibi varyasyonlar da yakalanir.

const CURSE_ROOTS = [
  'amk', 'aq', 'mk',
  'piç', 'pic',
  'orospu', 'oç', 'oc',
  'orospucocugu', 'orospucocuğu',
  'aminakoyim', 'aminakodum', 'aminakoduğunun', 'aminakoyayim',
  'siktir', 'sikeyim', 'sikerim', 'sik',
  'yarrak', 'yarak',
  'göt', 'got',
  'ibne',
  'kahpe',
  'şerefsiz', 'serefsiz',
  'gerizekalı', 'gerizekali',
  'salak', 'aptal',
  'bok',
  'puşt', 'pust',
];

// Kutsal degerlere hakaret (dogrudan ban tetikler) - ayri liste, asagida kullanilir.
const HOLY_INSULT_PATTERNS = [
  // "allah" veya "atatürk" kelimesi + yakininda kufur koku varsa hakaret sayilir.
];

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u')
    .replace(/[^a-z0-9\s]/g, ' ') // noktalama/nokta/yildiz temizle (a.m.k -> a m k)
    .replace(/\s+/g, ' ')
    .trim();
}

function collapseRepeats(text) {
  // "amkkkk" -> "amk", "siiiktir" -> "siktir"
  return text.replace(/(.)\1{1,}/g, '$1');
}

function containsCurse(rawText) {
  const normalized = normalize(rawText);
  const noSpaces = normalized.replace(/\s/g, '');
  const collapsedNoSpaces = collapseRepeats(noSpaces);

  for (const root of CURSE_ROOTS) {
    const normRoot = normalize(root).replace(/\s/g, '');
    if (noSpaces.includes(normRoot) || collapsedNoSpaces.includes(normRoot)) {
      return true;
    }
  }
  return false;
}

function containsHolyInsult(rawText) {
  const normalized = collapseRepeats(normalize(rawText));
  const holyNames = ['allah', 'atatürk', 'ataturk'].map((w) => normalize(w));
  const hasHolyName = holyNames.some((name) => normalized.includes(name));
  if (!hasHolyName) return false;
  // Kutsal isim gecen mesajda ayrica kufur koku de varsa hakaret kabul edilir.
  return containsCurse(rawText);
}

module.exports = { containsCurse, containsHolyInsult, normalize };
