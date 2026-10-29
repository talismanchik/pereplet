const SHORT_WORDS =
  'в|во|без|до|для|за|из|к|ко|на|над|о|об|обо|от|по|под|при|про|с|со|у|и|а|но|да|или|либо|же|ли|бы|не|ни'

const SHORT_WORD = new RegExp(`(^|[\\s«(])(${SHORT_WORDS}) `, 'gi')

/**
 * Типографика только на рендере: исходный markdown не меняется.
 * Неразрывный пробел после коротких слов и перед тире, прямые кавычки становятся ёлочками.
 */
export function applyTypography(input: string): string {
  const withQuotes = input.replace(/"([^"]+)"/g, '«$1»')
  return withQuotes.replace(SHORT_WORD, '$1$2\u00A0').replace(/ (\u2014)/g, '\u00A0$1')
}
