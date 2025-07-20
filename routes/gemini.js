const express = require('express');
const router = express.Router();
const geminiServices = require('../service/geminiServices');
const multer = require('multer');

const upload = multer({dest: 'uploads/'});


function handleRouteError(err, res){
  console.error('[API Error]', err.message);
  res.status(500).json({error: 'Internal Server Error'});
}


router.post('/api-chat', async function(req, res) {
  try{
    const { message } = req.body;

    if(!message){
      return res.status(400).json({error: 'Message is required'});
    }

    const resultGenerateText = await geminiServices.generateText(message);
    res.json({reply: resultGenerateText});
  }catch(err){
    handleRouteError(err, res);
  }

});

router.post('/generate-text', async function(req, res, next) {
  try{
    const { prompt } = req.body;
    const resultGenerateText = await geminiServices.generateText(prompt);
    res.json({output: resultGenerateText});
  }catch (err){
    handleRouteError(err,res);
  }
});

router.post('/generate-from-image', upload.single('image'), async function(req, res, next) {
  try{
    const prompt = req.body.prompt || 'Describe the image';
    if(!req.file){
      return res.status(400).json({error: 'File is required'});
    }
    const { path, mimetype } = req.file;
    const resultGenerateText = await geminiServices.generateFromImage(prompt, path, mimetype);
    res.json({output: resultGenerateText});
  }catch (err){
    handleRouteError(err, res);
  }
});

router.post('/generate-from-document', upload.single('document'), async function(req, res, next) {
  try{
    const prompt = req.body.prompt || 'Analyze this document';
    if(!req.file){
      return res.status(400).json({error: 'File is required'});
    }
    const { path, mimetype } = req.file;
    const resultGenerateText = await geminiServices.generateFromDocument(prompt, path, mimetype);
    res.json({output: resultGenerateText});
  }catch (err){
    handleRouteError(err, res);
  }
});

router.post('/generate-from-audio', upload.single('audio'), async function(req, res, next) {
  try{
    const prompt = req.body.prompt || 'Transcribe or analyze this audio';
    if(!req.file){
      return res.status(400).json({error: 'File is required'});
    }
    const { path, mimetype } = req.file;
    const resultGenerateText = await geminiServices.generateFromAudio(prompt, path, mimetype);
    res.json({output: resultGenerateText});
  }catch (err){
    handleRouteError(err, res);
  }
});



module.exports = router;
