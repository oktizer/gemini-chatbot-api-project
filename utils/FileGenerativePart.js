const fs = require('fs/promises');

/**
 * Converts a file into a generative part object containing base64 encoded data.
 *
 * @param {string} filePath - The path to the file to be converted.
 * @param {string} mimeType - The MIME type of the file.
 * @returns {Object} An object containing the base64 encoded data and its MIME type.
 */

async function fileToGenerativePart(filePath, mimeType){
    try{
        const fileData = await fs.readFile(filePath);
        return{
            inlineData: {
                data: fileData.toString('base64'),
                mimeType: mimeType
            }
        }
    }catch (error){
        console.error('Error converting file to generative part:', error);
        throw new Error('Failed to convert file to generative part.');
    }

}


module.exports = {
    fileToGenerativePart
}
