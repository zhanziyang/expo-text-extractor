import ExpoTextExtractorModule from './ExpoTextExtractorModule';
import { TextRecognitionScript, RecognitionLevel, RecognitionOptions } from './types';

// Re-export types
export { TextRecognitionScript, RecognitionLevel, RecognitionOptions };

/**
 * A boolean value that indicates whether the text extraction module is supported on the current device.
 *
 * @example
 * if (isSupported) {
 *   console.log('Text extraction is supported on this device.');
 * } else {
 *   console.log('Text extraction is not supported on this device.');
 * }
 */
export const isSupported = ExpoTextExtractorModule.isSupported;

/**
 * Extracts text from an image.
 *
 * @param {string} uri - The URI of the image to extract text from.
 * @param {RecognitionOptions} options - Optional recognition options.
 * @returns {Promise<string[]>} A promise that fulfills with an array of recognized texts.
 * 
 * @example
 * // Basic usage (Latin script by default)
 * const texts = await extractTextFromImage('file:///path/to/image.jpg');
 * 
 * @example
 * // With Chinese script on Android
 * const texts = await extractTextFromImage('file:///path/to/image.jpg', {
 *   script: TextRecognitionScript.CHINESE,
 * });
 * 
 * @example
 * // With specific languages on iOS
 * const texts = await extractTextFromImage('file:///path/to/image.jpg', {
 *   languages: ['ja-JP', 'en-US'],
 * });
 */
export async function extractTextFromImage(
  uri: string,
  options?: RecognitionOptions
): Promise<string[]> {
  const processedUri = uri.replace('file://', '');

  return ExpoTextExtractorModule.extractTextFromImage(processedUri, options);
}

/**
 * Gets the list of supported languages for text recognition.
 * 
 * On iOS, this returns BCP-47 language codes supported by the Vision framework
 * for the current device and OS version.
 * 
 * On Android, this returns the available scripts (LATIN, CHINESE, DEVANAGARI, 
 * JAPANESE, KOREAN) that have been included in the build.
 *
 * @param {TextRecognitionScript} script - Optional. On iOS, pass a script to get
 *   languages for that specific script category. Ignored on Android.
 * @returns {Promise<string[]>} A promise that fulfills with an array of supported
 *   language codes or script names.
 * 
 * @example
 * // Get all supported languages
 * const languages = await getSupportedLanguages();
 * console.log(languages); 
 * // iOS: ['en-US', 'fr-FR', 'de-DE', 'zh-Hans', 'zh-Hant', 'ja-JP', 'ko-KR', ...]
 * // Android: ['latin', 'chinese', 'devanagari', 'japanese', 'korean']
 */
export async function getSupportedLanguages(
  script?: TextRecognitionScript
): Promise<string[]> {
  return ExpoTextExtractorModule.getSupportedLanguages(script);
}
