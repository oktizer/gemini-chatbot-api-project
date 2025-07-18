const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({model: 'models/gemini-2.5-flash'});
const fileToGenerativePart = require('../utils/FileGenerativePart');


async function generateText(prompt) {
    try{
        const { response} = await geminiModel.generateContent(prompt);
        return response.text();
    }catch (err){
        return err;
    }
}

async function generateFromImage(prompt, image, mimeType){
    try{
        const imagePart = fileToGenerativePart(image, mimeType);
        const { response} = await geminiModel.generateContent([prompt, imagePart]);
        return response.text();
    }catch (err){
        return err;
    }
}

function generateFromDocument(documentPart){

}

function generateFromAudio(audioPart){

}

module.exports = {
    generateText,
    generateFromImage,
    generateFromDocument,
    generateFromAudio
}
