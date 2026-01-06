/**
 * Script types for text recognition.
 * 
 * On Android (ML Kit), each script requires a separate model:
 * - LATIN: Default, supports Latin-based languages (English, Spanish, French, German, etc.)
 * - CHINESE: Simplified and Traditional Chinese
 * - DEVANAGARI: Hindi, Sanskrit, Marathi, etc.
 * - JAPANESE: Japanese (Hiragana, Katakana, Kanji)
 * - KOREAN: Korean (Hangul)
 * 
 * On iOS (Vision), the script is automatically detected, but you can specify
 * preferred languages using the `languages` option in RecognitionOptions.
 */
export enum TextRecognitionScript {
  /**
   * Latin script - supports English, Spanish, French, German, Italian, Portuguese, etc.
   * This is the default script on Android.
   */
  LATIN = 'latin',
  
  /**
   * Chinese script - supports Simplified and Traditional Chinese.
   */
  CHINESE = 'chinese',
  
  /**
   * Devanagari script - supports Hindi, Sanskrit, Marathi, Nepali, etc.
   */
  DEVANAGARI = 'devanagari',
  
  /**
   * Japanese script - supports Hiragana, Katakana, and Kanji.
   */
  JAPANESE = 'japanese',
  
  /**
   * Korean script - supports Hangul.
   */
  KOREAN = 'korean',
}

/**
 * Options for text recognition.
 */
export interface RecognitionOptions {
  /**
   * The script to use for text recognition.
   * 
   * **Android (ML Kit):** This determines which ML Kit model to use.
   * Each script requires a separate dependency to be included in the build.
   * Defaults to `LATIN` if not specified.
   * 
   * **iOS (Vision):** This is used as a hint but iOS Vision can auto-detect scripts.
   * For more control on iOS, use the `languages` option instead.
   */
  script?: TextRecognitionScript;
  
  /**
   * Preferred recognition languages (iOS only).
   * 
   * An array of BCP-47 language codes (e.g., 'en-US', 'zh-Hans', 'ja-JP', 'ko-KR').
   * The order indicates preference - the first language is the most preferred.
   * 
   * This option is ignored on Android. Use `script` instead.
   * 
   * @example ['en-US', 'zh-Hans'] // Prefer English, then Chinese
   * @example ['ja-JP'] // Japanese only
   * @example ['ko-KR'] // Korean
   * 
   * @see Use `getSupportedLanguages()` to get the list of available languages.
   */
  languages?: string[];
}

