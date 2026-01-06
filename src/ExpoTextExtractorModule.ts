import { requireNativeModule } from 'expo-modules-core';

import type { TextRecognitionScript, RecognitionOptions } from './types';

interface ExpoTextExtractorModule {
  isSupported: boolean;
  extractTextFromImage: (uri: string, options?: RecognitionOptions) => Promise<string[]>;
  getSupportedLanguages: (script?: TextRecognitionScript) => Promise<string[]>;
}

export default requireNativeModule<ExpoTextExtractorModule>('ExpoTextExtractor');
