const express = require('express');
const router = express.Router();
const geminiServices = require('../service/geminiServices');


router.post('/api-chat', async function(req, res, next) {
  const { message } = req.body;

  if(!message){
    return res.status(400).json({error: 'Message is required'});
  }

  const resultGenerateText = await geminiServices.generateText(message);
  res.json({reply: resultGenerateText});
});

router.post('/generate-text', async function(req, res, next) {
  const { prompt } = req.body;
  const resultGenerateText = await geminiServices.generateText(prompt);
  res.json({output: resultGenerateText});
});

router.post('/generate-from-image', async function(req, res, next) {
  const { prompt } = req.body || 'Describe the image';
  const { path, mimeType } = req.file;
  const resultGenerateText = await geminiServices.generateFromImage(prompt, path, mimeType);
  res.json({output: resultGenerateText});
});

module.exports = router;
