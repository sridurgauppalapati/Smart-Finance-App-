const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

const extractAmount = (text, patterns) => {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return parseFloat(match[1].replace(/,/g, '')) || 0;
    }
  }
  return 0;
};

router.post('/extract', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const dataBuffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(dataBuffer);
    const text = data.text.toLowerCase();

    const extractedData = {
      homeEmi: extractAmount(text, [/home.*emi.*?(\d+(?:,\d+)*(?:\.\d+)?)/i, /housing.*loan.*?(\d+(?:,\d+)*(?:\.\d+)?)/i]),
      carEmi: extractAmount(text, [/car.*emi.*?(\d+(?:,\d+)*(?:\.\d+)?)/i, /vehicle.*loan.*?(\d+(?:,\d+)*(?:\.\d+)?)/i]),
      personalLoanEmi: extractAmount(text, [/personal.*loan.*?(\d+(?:,\d+)*(?:\.\d+)?)/i]),
      creditcardEmi: extractAmount(text, [/credit.*card.*?(\d+(?:,\d+)*(?:\.\d+)?)/i, /cc.*payment.*?(\d+(?:,\d+)*(?:\.\d+)?)/i]),
      groceries: extractAmount(text, [/groceries.*?(\d+(?:,\d+)*(?:\.\d+)?)/i, /supermarket.*?(\d+(?:,\d+)*(?:\.\d+)?)/i]),
      petrol: extractAmount(text, [/petrol.*?(\d+(?:,\d+)*(?:\.\d+)?)/i, /fuel.*?(\d+(?:,\d+)*(?:\.\d+)?)/i]),
      foodOrders: extractAmount(text, [/food.*order.*?(\d+(?:,\d+)*(?:\.\d+)?)/i, /zomato.*?(\d+(?:,\d+)*(?:\.\d+)?)/i, /swiggy.*?(\d+(?:,\d+)*(?:\.\d+)?)/i]),
      transport: extractAmount(text, [/transport.*?(\d+(?:,\d+)*(?:\.\d+)?)/i, /uber.*?(\d+(?:,\d+)*(?:\.\d+)?)/i, /ola.*?(\d+(?:,\d+)*(?:\.\d+)?)/i]),
      gym: extractAmount(text, [/gym.*?(\d+(?:,\d+)*(?:\.\d+)?)/i, /fitness.*?(\d+(?:,\d+)*(?:\.\d+)?)/i]),
      onlineShopping: extractAmount(text, [/amazon.*?(\d+(?:,\d+)*(?:\.\d+)?)/i, /flipkart.*?(\d+(?:,\d+)*(?:\.\d+)?)/i, /shopping.*?(\d+(?:,\d+)*(?:\.\d+)?)/i]),
      income: extractAmount(text, [/salary.*?(\d+(?:,\d+)*(?:\.\d+)?)/i, /income.*?(\d+(?:,\d+)*(?:\.\d+)?)/i, /credit.*?(\d+(?:,\d+)*(?:\.\d+)?)/i])
    };

    fs.unlinkSync(req.file.path);
    res.json(extractedData);
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;