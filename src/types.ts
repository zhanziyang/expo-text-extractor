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
 * Recognition level for iOS Vision framework.
 * 
 * @platform iOS
 */
export enum RecognitionLevel {
  /**
   * Accurate recognition - slower but more accurate.
   * Best for most use cases where accuracy is important.
   */
  ACCURATE = 'accurate',
  
  /**
   * Fast recognition - faster but less accurate.
   * Best for real-time processing or when speed is critical.
   */
  FAST = 'fast',
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
   * @platform iOS
   * @example ['en-US', 'zh-Hans'] // Prefer English, then Chinese
   * @example ['ja-JP'] // Japanese only
   * @example ['ko-KR'] // Korean
   * 
   * @see Use `getSupportedLanguages()` to get the list of available languages.
   */
  languages?: string[];

  /**
   * Whether to automatically detect the language of the text (iOS only).
   * 
   * When `true`, the Vision framework will automatically detect the language
   * without requiring you to specify `languages`. This is useful when you
   * don't know what language the text might be in.
   * 
   * Defaults to `false`.
   * 
   * @platform iOS
   * @default false
   */
  automaticallyDetectsLanguage?: boolean;

  /**
   * Whether to use language correction (iOS only).
   * 
   * When `true`, the Vision framework applies language correction to improve
   * recognition accuracy. This can help with spelling and grammar.
   * 
   * Defaults to `true`.
   * 
   * @platform iOS
   * @default true
   */
  usesLanguageCorrection?: boolean;

  /**
   * Custom words to help with recognition (iOS only).
   * 
   * An array of custom words (like proper nouns, technical terms, or brand names)
   * that should be recognized even if they're not in the standard dictionary.
   * 
   * @platform iOS
   * @example ['iPhone', 'MacBook', 'AirPods']
   */
  customWords?: string[];

  /**
   * Minimum text height as a fraction of the image height (iOS only).
   * 
   * Text smaller than this fraction of the image height will be ignored.
   * Value should be between 0 and 1. Lower values detect smaller text.
   * 
   * Defaults to approximately 1/32 of the image height.
   * 
   * @platform iOS
   * @example 0.05 // Ignore text smaller than 5% of image height
   */
  minimumTextHeight?: number;

  /**
   * Recognition level for accuracy vs speed tradeoff (iOS only).
   * 
   * - `ACCURATE`: Slower but more accurate (default)
   * - `FAST`: Faster but less accurate
   * 
   * @platform iOS
   * @default RecognitionLevel.ACCURATE
   */
  recognitionLevel?: RecognitionLevel;
}
