# Expo Text Extractor

> **Fork Notice:** This is a fork of [pchalupa/expo-text-extractor](https://github.com/pchalupa/expo-text-extractor) with added multi-language support for Chinese, Japanese, Korean, and Devanagari scripts.

Expo Text Extractor is a library that enables text recognition (OCR) using Google ML Kit on Android and Apple Vision on iOS.

### Platform Compatibility

| Android Device | Android Emulator | iOS Device | iOS Simulator | Web |
| -------------- | ---------------- | ---------- | ------------- | --- |
| ✅             | ✅               | ✅         | ✅            | ❌  |

### Supported Languages

The library supports multiple scripts and languages:

| Script     | Languages                                           | Android | iOS |
| ---------- | --------------------------------------------------- | ------- | --- |
| Latin      | English, Spanish, French, German, Italian, etc.     | ✅      | ✅  |
| Chinese    | Simplified Chinese, Traditional Chinese             | ✅      | ✅  |
| Japanese   | Japanese (Hiragana, Katakana, Kanji)                | ✅      | ✅  |
| Korean     | Korean (Hangul)                                     | ✅      | ✅  |
| Devanagari | Hindi, Sanskrit, Marathi, Nepali, etc.              | ✅      | ✅  |

### Demo

<p align="center">
 <img src="https://github.com/pchalupa/readme-assets/blob/main/expo-text-extractor.gif" alt="demo" width="75%" />
</p>

## Installation

To get started, install the library using Expo CLI:

```sh
npx expo install expo-text-extractor
```

> Ensure your project is running Expo SDK 52+.

## API Documentation

Check the [example app](https://github.com/pchalupa/expo-text-extractor/blob/main/example/App.tsx) for more details.

### `isSupported`

A boolean value indicating whether the current device supports text extraction.

```ts
import { isSupported } from 'expo-text-extractor';

if (isSupported) {
  console.log('Text extraction is supported on this device.');
}
```

### `extractTextFromImage(uri, options?)`

Extracts text from an image and returns the recognized text as an array.

```ts
import { extractTextFromImage, TextRecognitionScript } from 'expo-text-extractor';

// Basic usage (Latin script by default)
const texts = await extractTextFromImage('file:///path/to/image.jpg');

// With a specific script (Android)
const chineseTexts = await extractTextFromImage('file:///path/to/image.jpg', {
  script: TextRecognitionScript.CHINESE,
});

// With specific languages (iOS)
const japaneseTexts = await extractTextFromImage('file:///path/to/image.jpg', {
  languages: ['ja-JP', 'en-US'],
});
```

#### Parameters

| Parameter | Type                 | Description                                    |
| --------- | -------------------- | ---------------------------------------------- |
| `uri`     | `string`             | The URI of the image to extract text from.     |
| `options` | `RecognitionOptions` | Optional. Recognition options (see below).     |

#### Recognition Options

| Property    | Type                      | Platform | Description                                                                                                        |
| ----------- | ------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------ |
| `script`    | `TextRecognitionScript`   | Android  | The script type to use for recognition. Defaults to `LATIN`.                                                       |
| `languages` | `string[]`                | iOS      | Array of BCP-47 language codes (e.g., `'en-US'`, `'zh-Hans'`, `'ja-JP'`). The order indicates preference.          |

#### TextRecognitionScript Enum

| Value         | Description                                                        |
| ------------- | ------------------------------------------------------------------ |
| `LATIN`       | Latin script - English, Spanish, French, German, Italian, etc.     |
| `CHINESE`     | Chinese script - Simplified and Traditional Chinese                |
| `DEVANAGARI`  | Devanagari script - Hindi, Sanskrit, Marathi, Nepali, etc.         |
| `JAPANESE`    | Japanese script - Hiragana, Katakana, Kanji                        |
| `KOREAN`      | Korean script - Hangul                                             |

### `getSupportedLanguages()`

Returns the list of supported languages on the current platform.

```ts
import { getSupportedLanguages } from 'expo-text-extractor';

const languages = await getSupportedLanguages();
console.log(languages);
// iOS: ['en-US', 'fr-FR', 'de-DE', 'zh-Hans', 'zh-Hant', 'ja-JP', 'ko-KR', ...]
// Android: ['latin', 'chinese', 'devanagari', 'japanese', 'korean']
```

## Platform-Specific Notes

### Android (ML Kit)

- Each script requires a separate ML Kit model that is downloaded on-demand by Google Play Services.
- The first recognition request for a new script may be slower as the model downloads.
- All script models are included by default. If you want to reduce app size, you can create a custom build configuration.

### iOS (Vision)

- The Vision framework automatically detects the script in most cases.
- Use the `languages` option for best results when you know the expected language(s).
- Call `getSupportedLanguages()` to get the full list of available languages for the device.
- Language support may vary by iOS version. Korean support was added in iOS 16.

## Examples

### Recognizing Chinese Text

```ts
import { extractTextFromImage, TextRecognitionScript } from 'expo-text-extractor';

const recognizeChineseText = async (imageUri: string) => {
  const texts = await extractTextFromImage(imageUri, {
    script: TextRecognitionScript.CHINESE,
    // On iOS, you can also specify:
    // languages: ['zh-Hans', 'zh-Hant'],
  });
  
  return texts.join('\n');
};
```

### Recognizing Japanese Text

```ts
import { extractTextFromImage, TextRecognitionScript } from 'expo-text-extractor';

const recognizeJapaneseText = async (imageUri: string) => {
  const texts = await extractTextFromImage(imageUri, {
    script: TextRecognitionScript.JAPANESE,
    // On iOS:
    // languages: ['ja-JP'],
  });
  
  return texts.join('\n');
};
```

### Recognizing Korean Text

```ts
import { extractTextFromImage, TextRecognitionScript } from 'expo-text-extractor';

const recognizeKoreanText = async (imageUri: string) => {
  const texts = await extractTextFromImage(imageUri, {
    script: TextRecognitionScript.KOREAN,
    // On iOS:
    // languages: ['ko-KR'],
  });
  
  return texts.join('\n');
};
```

### Multi-language Recognition (iOS)

On iOS, you can specify multiple preferred languages:

```ts
import { extractTextFromImage } from 'expo-text-extractor';

const recognizeMultiLanguage = async (imageUri: string) => {
  const texts = await extractTextFromImage(imageUri, {
    // Recognize Japanese with English as fallback
    languages: ['ja-JP', 'en-US'],
  });
  
  return texts.join('\n');
};
```

## Credits

This project is a fork of [expo-text-extractor](https://github.com/pchalupa/expo-text-extractor) by [pchalupa](https://github.com/pchalupa). Original work © pchalupa.

## License

MIT
