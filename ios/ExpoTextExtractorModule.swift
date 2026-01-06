import ExpoModulesCore
import Vision

/// Recognition options passed from JavaScript.
struct RecognitionOptions: Record {
    @Field
    var script: String?
    
    @Field
    var languages: [String]?
    
    @Field
    var automaticallyDetectsLanguage: Bool?
    
    @Field
    var usesLanguageCorrection: Bool?
    
    @Field
    var customWords: [String]?
    
    @Field
    var minimumTextHeight: Float?
    
    @Field
    var recognitionLevel: String?
}

public class ExpoTextExtractorModule: Module {
    public func definition() -> ModuleDefinition {
        Name("ExpoTextExtractor")

        Constants([
            "isSupported": true
        ])

        /// Extract text from an image with optional recognition options.
        ///
        /// - Parameters:
        ///   - url: Path or URL to the image file
        ///   - options: Optional recognition options containing preferred languages and other settings
        AsyncFunction("extractTextFromImage") { (url: URL, options: RecognitionOptions?, promise: Promise) in
            do {
                let imageData = try Data(contentsOf: url)
                let image = UIImage(data: imageData)
                guard let cgImage = image?.cgImage else {
                    throw Exception(name: "IMAGE_LOAD_ERROR", description: "Failed to load image from URL")
                }

                let requestHandler = VNImageRequestHandler(cgImage: cgImage)
                let request = VNRecognizeTextRequest { (request, error) in
                    if let error = error {
                        promise.reject(Exception(name: "TEXT_RECOGNITION_ERROR", description: error.localizedDescription))
                        return
                    }
                    
                    guard let observations = request.results as? [VNRecognizedTextObservation] else {
                        return promise.resolve([])
                    }

                    let recognizedTexts = observations.compactMap { observation in
                        observation.topCandidates(1).first?.string
                    }

                    promise.resolve(recognizedTexts)
                }
                
                // Configure recognition level (default: accurate)
                if let level = options?.recognitionLevel?.lowercased() {
                    request.recognitionLevel = level == "fast" ? .fast : .accurate
                } else {
                    request.recognitionLevel = .accurate
                }
                
                // Set recognition languages if provided
                if let languages = options?.languages, !languages.isEmpty {
                    request.recognitionLanguages = languages
                } else if let script = options?.script {
                    // Map script to appropriate languages as a hint
                    request.recognitionLanguages = self.languagesForScript(script)
                }
                
                // Configure automatic language detection (iOS 16+)
                if #available(iOS 16.0, *) {
                    if let autoDetect = options?.automaticallyDetectsLanguage {
                        request.automaticallyDetectsLanguage = autoDetect
                    }
                }
                
                // Configure language correction (default: true)
                if let usesCorrection = options?.usesLanguageCorrection {
                    request.usesLanguageCorrection = usesCorrection
                } else {
                    request.usesLanguageCorrection = true
                }
                
                // Set custom words for recognition
                if let customWords = options?.customWords, !customWords.isEmpty {
                    request.customWords = customWords
                }
                
                // Set minimum text height
                if let minHeight = options?.minimumTextHeight {
                    request.minimumTextHeight = minHeight
                }

                try requestHandler.perform([request])
            } catch {
                promise.reject(error)
            }
        }
        
        /// Returns the list of supported recognition languages for the current device.
        ///
        /// - Parameter script: Optional script type to filter languages (currently unused)
        AsyncFunction("getSupportedLanguages") { (script: String?, promise: Promise) in
            do {
                let request = VNRecognizeTextRequest()
                request.recognitionLevel = .accurate
                
                // Get supported languages for accurate recognition
                let languages = try request.supportedRecognitionLanguages()
                promise.resolve(languages)
            } catch {
                // Fallback: return a known list of commonly supported languages
                let fallbackLanguages = [
                    "en-US", "fr-FR", "it-IT", "de-DE", "es-ES", "pt-BR",
                    "zh-Hans", "zh-Hant", "ja-JP", "ko-KR"
                ]
                promise.resolve(fallbackLanguages)
            }
        }
    }
    
    /// Maps a script name to appropriate BCP-47 language codes.
    ///
    /// - Parameter script: The script type (latin, chinese, japanese, korean, devanagari)
    /// - Returns: An array of language codes suitable for the script
    private func languagesForScript(_ script: String) -> [String] {
        switch script.lowercased() {
        case "chinese":
            return ["zh-Hans", "zh-Hant"]
        case "japanese":
            return ["ja-JP"]
        case "korean":
            return ["ko-KR"]
        case "devanagari":
            return ["hi-IN"] // Hindi - primary Devanagari language
        case "latin":
            return ["en-US", "fr-FR", "de-DE", "es-ES", "it-IT", "pt-BR"]
        default:
            return [] // Let Vision auto-detect
        }
    }
}
