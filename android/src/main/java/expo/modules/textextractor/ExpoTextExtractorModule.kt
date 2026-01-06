package expo.modules.textextractor

import android.net.Uri
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.text.TextRecognition
import com.google.mlkit.vision.text.TextRecognizer
import com.google.mlkit.vision.text.chinese.ChineseTextRecognizerOptions
import com.google.mlkit.vision.text.devanagari.DevanagariTextRecognizerOptions
import com.google.mlkit.vision.text.japanese.JapaneseTextRecognizerOptions
import com.google.mlkit.vision.text.korean.KoreanTextRecognizerOptions
import com.google.mlkit.vision.text.latin.TextRecognizerOptions
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import java.io.File

/**
 * Options for text recognition passed from JavaScript.
 */
class RecognitionOptionsRecord : Record {
  @Field
  val script: String? = null
  
  @Field
  val languages: List<String>? = null
}

class ExpoTextExtractorModule : Module() {
  // Lazy-initialized recognizers to avoid loading all models at startup
  private val latinRecognizer by lazy { 
    TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS) 
  }
  private val chineseRecognizer by lazy { 
    TextRecognition.getClient(ChineseTextRecognizerOptions.Builder().build()) 
  }
  private val devanagariRecognizer by lazy { 
    TextRecognition.getClient(DevanagariTextRecognizerOptions.Builder().build()) 
  }
  private val japaneseRecognizer by lazy { 
    TextRecognition.getClient(JapaneseTextRecognizerOptions.Builder().build()) 
  }
  private val koreanRecognizer by lazy { 
    TextRecognition.getClient(KoreanTextRecognizerOptions.Builder().build()) 
  }

  /**
   * Returns the appropriate text recognizer based on the script type.
   */
  private fun getRecognizerForScript(script: String?): TextRecognizer {
    return when (script?.lowercase()) {
      "chinese" -> chineseRecognizer
      "devanagari" -> devanagariRecognizer
      "japanese" -> japaneseRecognizer
      "korean" -> koreanRecognizer
      else -> latinRecognizer // Default to Latin
    }
  }

  /**
   * List of available scripts. All are included by default since
   * we've added all the dependencies in build.gradle.
   */
  private val availableScripts = listOf(
    "latin",
    "chinese",
    "devanagari",
    "japanese",
    "korean"
  )

  override fun definition() = ModuleDefinition {
    Name("ExpoTextExtractor")

    Constants(
      "isSupported" to true
    )

    /**
     * Extract text from an image with optional recognition options.
     * 
     * @param uriString - Path or URI to the image file
     * @param options - Optional recognition options containing script type
     */
    AsyncFunction("extractTextFromImage") { uriString: String, options: RecognitionOptionsRecord?, promise: Promise ->
      try {
        val context = appContext.reactContext!!
        val uri = if (uriString.startsWith("content://")) {
          Uri.parse(uriString)
        } else {
          val file = File(uriString)
          if (!file.exists()) {
            throw Exception("File not found: $uriString")
          }
          Uri.fromFile(file)
        }

        val inputImage = InputImage.fromFilePath(context, uri)
        val recognizer = getRecognizerForScript(options?.script)

        recognizer.process(inputImage)
          .addOnSuccessListener { visionText ->
            val recognizedTexts = visionText.textBlocks.map { it.text }
            promise.resolve(recognizedTexts)
          }
          .addOnFailureListener { error ->
            promise.reject(CodedException("TEXT_RECOGNITION_ERROR", error.message ?: "Text recognition failed", error))
          }
      } catch (error: Exception) {
        promise.reject(CodedException("UNKNOWN_ERROR", error.message ?: "Unknown error", error))
      }
    }

    /**
     * Returns the list of supported scripts on Android.
     * 
     * @param script - Ignored on Android (provided for API compatibility with iOS)
     */
    AsyncFunction("getSupportedLanguages") { _: String?, promise: Promise ->
      promise.resolve(availableScripts)
    }
  }

  /**
   * Clean up recognizers when the module is destroyed.
   */
  override fun onDestroy() {
    // Close all initialized recognizers to free resources
    try {
      latinRecognizer.close()
    } catch (_: Exception) {}
    try {
      chineseRecognizer.close()
    } catch (_: Exception) {}
    try {
      devanagariRecognizer.close()
    } catch (_: Exception) {}
    try {
      japaneseRecognizer.close()
    } catch (_: Exception) {}
    try {
      koreanRecognizer.close()
    } catch (_: Exception) {}
    
    super.onDestroy()
  }
}
