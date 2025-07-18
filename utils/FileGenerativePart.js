
const fs = require('fs');

function fileToGenerativePart(filePath, mimeType){
    const fileData = fs.readFileSync(filePath);
    return{
        inlineData: {
            data: Buffer.from(fileData).toString('base64'),
            mimeType: mimeType
        }
    }
}


module.exports = {
    fileToGenerativePart
}
