export interface WordGuide {
  ipa: string;
  tip: string;
}

// IPA and pronunciation tips for common English words
// Focused on sounds Vietnamese speakers frequently mispronounce
const guide: Record<string, WordGuide> = {
  // ─── Tech vocabulary ──────────────────────────────────────────────
  bug: { ipa: '/bʌɡ/', tip: 'The /ʌ/ vowel is like a short, flat "uh" — not "a" or "oo"' },
  debug: { ipa: '/diːˈbʌɡ/', tip: 'Stress on second syllable: dee-BUG. Same /ʌ/ as "bug"' },
  thread: { ipa: '/θrɛd/', tip: '/θ/ — tongue between teeth. Do not use /t/ or /d/' },
  version: { ipa: '/ˈvɜːrʒən/', tip: '/v/ — bite lower lip. /ʒ/ is like "s" in "measure". Stress first syllable' },
  review: { ipa: '/rɪˈvjuː/', tip: '/r/ — tongue curls back, touches nothing. /v/ — bite lower lip. Stress second syllable' },
  feature: { ipa: '/ˈfiːtʃər/', tip: 'Stress first syllable: FEA-ture. The /tʃ/ is the "ch" in "church"' },
  release: { ipa: '/rɪˈliːs/', tip: 'Stress on second syllable: re-LEASE. Long /iː/ vowel' },
  deploy: { ipa: '/dɪˈplɔɪ/', tip: 'Stress on second syllable: de-PLOY' },
  merge: { ipa: '/mɜːrdʒ/', tip: '/ɜː/ is unique to English — not "e" or "a". Lips neutral, not rounded' },
  branch: { ipa: '/bræntʃ/', tip: '/æ/ — mouth wide open and spread. Different from "a" in Vietnamese' },
  commit: { ipa: '/kəˈmɪt/', tip: 'Stress on second syllable: co-MIT. First syllable is reduced schwa /kə/' },
  server: { ipa: '/ˈsɜːrvər/', tip: 'Both syllables have the /ɜː/ sound: SER-ver. Lips stay neutral' },
  error: { ipa: '/ˈɛrər/', tip: 'Two syllables: ER-ror. The /r/ colors both vowels in American English' },
  fetch: { ipa: '/fɛtʃ/', tip: '/f/ — upper teeth on lower lip. /tʃ/ like "ch" in "church"' },
  cache: { ipa: '/kæʃ/', tip: '/æ/ is a low, wide vowel — not "a" or "e". Rhymes with "bash"' },
  queue: { ipa: '/kjuː/', tip: 'Just two sounds: /kj/ + /uː/. Pronounced like the letter "Q"' },
  build: { ipa: '/bɪld/', tip: 'Short /ɪ/ vowel. Do not add extra sounds at the end — stop on /d/' },
  push: { ipa: '/pʊʃ/', tip: 'Short /ʊ/ — not the long /uː/ in "food". Lips slightly rounded' },
  pull: { ipa: '/pʊl/', tip: 'Same short /ʊ/ as "push". Rhymes with "full"' },
  loop: { ipa: '/luːp/', tip: 'Long /uː/ vowel — like in "food". One syllable only' },
  scope: { ipa: '/skoʊp/', tip: 'The /oʊ/ is a diphthong — starts with /o/ and glides to /ʊ/' },
  patch: { ipa: '/pætʃ/', tip: '/æ/ wide vowel + /tʃ/ "ch" sound. Rhymes with "catch"' },
  sync: { ipa: '/sɪŋk/', tip: 'Ends with /ŋk/ — tongue on roof, then /k/. Rhymes with "think"' },
  // ─── Business/office vocabulary ───────────────────────────────────
  urgent: { ipa: '/ˈɜːrdʒənt/', tip: 'Stress first syllable: UR-gent. The /ɜː/ is not "a" or "e"' },
  schedule: { ipa: '/ˈʃɛdʒuːl/', tip: 'UK: SHED-yool. US: SKED-jool. Either is acceptable' },
  clarify: { ipa: '/ˈklærɪfaɪ/', tip: 'Stress first syllable: CLA-ri-fy. /æ/ wide vowel in first syllable' },
  elaborate: { ipa: '/ɪˈlæbəreɪt/', tip: 'Stress second syllable: e-LAB-o-rate. /æ/ wide vowel' },
  rationale: { ipa: '/ˌræʃəˈnæl/', tip: 'Stress on last syllable: ra-tio-NAL. Both /æ/ vowels are wide' },
  resilience: { ipa: '/rɪˈzɪliəns/', tip: 'Stress second syllable: re-SIL-ience. /z/ is voiced (vocal cords vibrate)' },
  paramount: { ipa: '/ˈpærəmaʊnt/', tip: 'Stress first syllable: PAR-a-mount. /æ/ wide vowel at start' },
  paradigm: { ipa: '/ˈpærədaɪm/', tip: 'The G is SILENT — PAR-a-dime. Many people mispronounce this' },
  negotiate: { ipa: '/nɪˈɡoʊʃieɪt/', tip: 'Stress second syllable: ne-GO-ti-ate. No /dʒ/ sound — it\'s /ʃ/' },
  leverage: { ipa: '/ˈlɛvərɪdʒ/', tip: 'Stress first syllable: LEV-er-age. Three syllables total' },
  threshold: { ipa: '/ˈθrɛʃhoʊld/', tip: '/θ/ — tongue between teeth. "thresh" rhymes with "fresh"' },
  collaborate: { ipa: '/kəˈlæbəreɪt/', tip: 'Stress second syllable: col-LAB-o-rate. /æ/ wide vowel' },
  // ─── Common words often mispronounced ─────────────────────────────
  focus: { ipa: '/ˈfoʊkəs/', tip: 'Stress first syllable: FO-cus. Second syllable is a weak schwa /kəs/' },
  process: { ipa: '/ˈproʊsɛs/', tip: 'US: PRO-cess. UK: PROS-ess. First syllable stressed in both' },
  project: { ipa: '/ˈprɒdʒɛkt/', tip: 'Noun: PRO-ject (stress 1st). Verb: pro-JECT (stress 2nd)' },
  record: { ipa: '/ˈrɛkərd/', tip: 'Noun: REC-ord (stress 1st). Verb: re-CORD (stress 2nd)' },
  present: { ipa: '/ˈprɛzənt/', tip: 'Noun/adj: PRE-sent. Verb: pre-SENT. Stress shifts meaning' },
  concern: { ipa: '/kənˈsɜːrn/', tip: 'Stress second syllable: con-CERN. /ɜː/ — lips neutral' },
  ensure: { ipa: '/ɪnˈʃʊər/', tip: 'Stress second syllable: en-SURE. /ʃ/ like "sh" in "ship"' },
  issue: { ipa: '/ˈɪʃuː/', tip: 'Two syllables: ISS-yoo. /ɪ/ is short. Do not say "ee-shoo"' },
  value: { ipa: '/ˈvæljuː/', tip: '/v/ — bite lower lip, then /æ/ wide vowel. Two syllables: VAL-yoo' },
  available: { ipa: '/əˈveɪləbl/', tip: 'Stress second syllable: a-VAIL-a-ble. /v/ — lower lip to upper teeth' },
  development: { ipa: '/dɪˈvɛləpmənt/', tip: 'Stress second syllable: de-VEL-op-ment. 4 syllables, don\'t drop one' },
  environment: { ipa: '/ɪnˈvaɪrənmənt/', tip: 'Often reduced in speech: en-VI-ron-ment or en-VI-ment (4→3 syllables)' },
  management: { ipa: '/ˈmænɪdʒmənt/', tip: 'Stress first syllable: MAN-age-ment. /æ/ wide vowel' },
  requirement: { ipa: '/rɪˈkwaɪərmənt/', tip: 'Stress second syllable: re-QUIRE-ment. /r/ at start curls back' },
  // ─── Tricky consonants for Vietnamese speakers ────────────────────
  think: { ipa: '/θɪŋk/', tip: '/θ/ — tongue between teeth, breathe out. Never /t/ or /d/' },
  through: { ipa: '/θruː/', tip: '/θ/ — tongue between teeth. Only one syllable — "threw" rhymes with it' },
  both: { ipa: '/boʊθ/', tip: '/θ/ at the end — tongue out between teeth. Not "bos" or "bot"' },
  this: { ipa: '/ðɪs/', tip: '/ð/ is voiced /θ/ — tongue out, vocal cords vibrate. Like in "the"' },
  that: { ipa: '/ðæt/', tip: '/ð/ voiced — tongue out + vocal cords. /æ/ wide vowel' },
  other: { ipa: '/ˈʌðər/', tip: '/ð/ in the middle — tongue briefly between teeth. /ʌ/ flat vowel at start' },
  verb: { ipa: '/vɜːrb/', tip: '/v/ — upper teeth on lower lip. /ɜː/ neutral lips — not "e" or "a"' },
  very: { ipa: '/ˈvɛri/', tip: '/v/ — teeth on lip. /r/ — tongue curls, touches nothing. Two syllables' },
  voice: { ipa: '/vɔɪs/', tip: '/v/ — teeth on lip. /ɔɪ/ diphthong like in "boy". One syllable' },
  // ─── Shadowing-specific words ─────────────────────────────────────
  postpone: { ipa: '/pəˈspoʊn/', tip: 'Stress second syllable: post-PONE. /oʊ/ diphthong at end' },
  unforeseen: { ipa: '/ˌʌnfɔːrˈsiːn/', tip: 'Stress last syllable: un-fore-SEEN. /ʌ/ flat at start' },
  outweigh: { ipa: '/ˌaʊtˈweɪ/', tip: 'Stress second part: out-WEIGH. /eɪ/ diphthong in "weigh"' },
  seamlessly: { ipa: '/ˈsiːmləsli/', tip: 'Stress first syllable: SEAM-less-ly. Long /iː/ at start' },
  elusive: { ipa: '/ɪˈluːsɪv/', tip: 'Stress second syllable: e-LU-sive. Long /uː/ vowel' },
  entitled: { ipa: '/ɪnˈtaɪtld/', tip: 'Stress second syllable: en-TI-tled. /tl/ — both sounds, don\'t drop /l/' },
  compelling: { ipa: '/kəmˈpɛlɪŋ/', tip: 'Stress second syllable: com-PEL-ling. Double /l/ hold briefly' },
  architecture: { ipa: '/ˈɑːrkɪtɛktʃər/', tip: 'Stress first syllable: AR-chi-tec-ture. 4 syllables total' },
  distributed: { ipa: '/dɪˈstrɪbjuːtɪd/', tip: 'Stress second syllable: dis-TRIB-ut-ed. 4 syllables' },
  resilient: { ipa: '/rɪˈzɪliənt/', tip: 'Stress second syllable: re-SIL-ient. /z/ is voiced' },
  gracefully: { ipa: '/ˈɡreɪsfəli/', tip: 'Stress first syllable: GRACE-ful-ly. /eɪ/ diphthong in "grace"' },
  flexibility: { ipa: '/ˌflɛksɪˈbɪlɪti/', tip: 'Stress fourth syllable: flex-i-BIL-i-ty. 5 syllables' },
  accelerated: { ipa: '/əkˈsɛləreɪtɪd/', tip: 'Stress second syllable: ac-CEL-er-at-ed. 5 syllables' },
  pragmatic: { ipa: '/præɡˈmætɪk/', tip: 'Stress second syllable: prag-MAT-ic. Two /æ/ sounds — wide mouth' },
};

export function getWordGuide(word: string): WordGuide | null {
  const clean = word.toLowerCase().replace(/[^a-z]/g, '');
  return guide[clean] ?? null;
}

export default guide;
