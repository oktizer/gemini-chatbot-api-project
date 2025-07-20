const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs/promises');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({model: 'gemini-1.5-flash'});
const { fileToGenerativePart } = require('../utils/FileGenerativePart');


/**
 * Generates text based on the provided prompt using the Gemini generative model.
 *
 * @param {string} prompt - The input text prompt to generate content from.
 * @returns {Promise<string>} - A promise that resolves to the generated text.
 * @throws {Error} - Throws an error if text generation fails.
 */

async function generateText(prompt) {
    try{
        const { response} =
            await geminiModel.generateContent(prompt);
        return response.text();
    }catch (err){
        console.error("Error generating text:", err);
        throw new Error("Failed to generate text.");
    }
}

/**
 * Generates text based on the provided prompt and image using the Gemini generative model.
 *
 * @param {string} prompt - The input text prompt to generate content from.
 * @param {Buffer|string} image - The image data or path to be used in content generation.
 * @param {string} mimeType - The MIME type of the image.
 * @returns {Promise<string|Error>} - A promise that resolves to the generated text or an error if generation fails.
 */

async function generateFromImage(prompt, imagePath, mimeType){
    if(!mimeType){
        throw new Error("MIME type is required.");
    }
    try{
        const imagePart = await fileToGenerativePart(imagePath, mimeType);
        const { response} =
            await geminiModel.generateContent([prompt, imagePart]);
        return response.text();
    }catch (err){
        console.error("Error generating from image:", err);
        throw new Error("Failed to process content from image.");
    }
}

/**
 * Generates text based on the provided prompt and document using the Gemini generative model.
 *
 * @param {string} prompt - The input text prompt to generate content from.
 * @param {string} documentPath - The path to the document file to be used in content generation.
 * @param {string} mimeType - The MIME type of the document.
 * @returns {Promise<string|Error>} - A promise that resolves to the generated text or an error if generation fails.
 * @throws {Error} - Throws an error if the document cleanup fails.
 */

async function generateFromDocument(prompt, documentPath, mimeType){
    try{
        const documentPart = await fileToGenerativePart(documentPath, mimeType);
        const { response} =
            await geminiModel.generateContent([prompt, documentPart]);
        return response.text();
    } catch (err){
        console.error("Error generating document", err);
        throw new Error("Failed to process document with Gemini API.");
    } finally {
        try {
            await fs.unlink(documentPath);
        } catch (cleanUpError){
            console.error(`Failed to clean up temporary file: ${documentPath}`, cleanUpError);
        }
    }
}

async function generateFromAudio(prompt, audioPath, mimeType){
    try{
        const audioPart = await fileToGenerativePart(audioPath, mimeType);
        const { response} =
            await geminiModel.generateContent([prompt, audioPart]);
        return response.text();
    } catch (err) {
        console.error("Error generating from audio", err);
        throw new Error("Failed to process audio with Gemini API.");
    } finally {
        try {
            await fs.promises.unlink(audioPath);
        } catch (cleanUpError){
            console.error(`Failed to clean up temporary file: ${audioPath}`, cleanUpError);
        }
    }
}

module.exports = {
    generateText,
    generateFromImage,
    generateFromDocument,
    generateFromAudio
}
