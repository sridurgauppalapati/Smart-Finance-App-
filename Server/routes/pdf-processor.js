const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const Entry = require('../models/Entry');
const Member = require('../models/Member');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// Enhanced patterns for both bank and credit card statements
const patterns = {
  // Credit card specific patterns
  ccTransaction: /(?:purchase|payment|cash advance|fee|interest)/i,
  ccAmount: /(?:rs\.?\s*|₹\s*)?([\d,]+\.?\d*)(?:\s*cr|\s*dr)?/gi,
  
  // Bank statement patterns  
  debit: /(?:debit|withdrawal|payment|transfer out|atm|purchase|dr)/i,
  credit: /(?:credit|deposit|salary|transfer in|refund|cr)/i,
  amount: /(?:rs\.?\s*|₹\s*)?([\d,]+\.?\d*)/gi,
  
  // Common patterns
  date: /(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/g,
  description: /(?:to|from|at|for)\s+([a-zA-Z0-9\s]+)/i,
  memberName: /([A-Z][a-z]+\s+[A-Z][a-z]+)/g,
  
  // Credit card specific merchant patterns
  merchant: /(?:merchant|pos|online|ecom)\s*:?\s*([a-zA-Z0-9\s]+)/i
};

function detectStatementType(text) {
  const ccKeywords = /(?:credit card|card statement|outstanding|minimum due|payment due)/i;
  const bankKeywords = /(?:bank statement|account statement|current balance|available balance)/i;
  
  if (ccKeywords.test(text)) return 'creditcard';
  if (bankKeywords.test(text)) return 'bank';
  return 'unknown';
}

async function findMemberByName(text, members) {
  const nameMatches = [...text.matchAll(patterns.memberName)];
  
  for (const nameMatch of nameMatches) {
    const extractedName = nameMatch[1].toLowerCase();
    
    for (const member of members) {
      const memberName = member.name.toLowerCase();
      if (extractedName.includes(memberName) || memberName.includes(extractedName)) {
        return member;
      }
    }
  }
  
  return members[0]; // Default to first member if no match
}

// Enhanced category mapping for both bank and credit card
const categoryMap = {
  'petrol': /(?:petrol|fuel|gas|hp|ioc|bpcl|shell|essar)/i,
  'groceries': /(?:grocery|supermarket|dmart|reliance|fresh|vegetables|big bazaar|more)/i,
  'foodOrders': /(?:zomato|swiggy|uber eats|food|restaurant|cafe|dominos|pizza|kfc|mcdonalds)/i,
  'transport': /(?:uber|ola|metro|bus|taxi|auto|rapido)/i,
  'onlineShopping': /(?:amazon|flipkart|myntra|shopping|online|paytm|nykaa|ajio)/i,
  'gym': /(?:gym|fitness|sports|cult)/i,
  'maid': /(?:maid|cleaning|domestic)/i,
  'waterCharges': /(?:water|aqua|bisleri|kinley)/i,
  'netPhoneCharges': /(?:airtel|jio|vodafone|bsnl|internet|mobile|broadband|wifi)/i,
  'homeMaintenance': /(?:maintenance|repair|plumber|electrician|hardware)/i,
  'clothing': /(?:clothing|dress|shirt|pant|fashion|textile|garment)/i,
  'eatery': /(?:restaurant|hotel|dining|food court|cafe|bar)/i,
  'travelling': /(?:travel|flight|train|booking|irctc|makemytrip|goibibo|hotel)/i,
  'donations': /(?:donation|charity|temple|church|gurudwara|mosque)/i,
  'school': /(?:school|education|fees|tuition|college|university)/i,
  'creditcardEmi': /(?:emi|installment|equated|monthly)/i,
  'urbanCompany': /(?:urban company|urbanclap|home service)/i,
  'eatery': /(?:sweets|bakery|ice cream|juice)/i
};

function categorizeTransaction(description) {
  const desc = description.toLowerCase();
  for (const [category, pattern] of Object.entries(categoryMap)) {
    if (pattern.test(desc)) return category;
  }
  return 'transport'; // default category
}

function extractTransactions(text) {
  const lines = text.split('\n').filter(line => line.trim());
  const transactions = [];
  const statementType = detectStatementType(text);
  
  lines.forEach(line => {
    const dateMatch = line.match(patterns.date);
    let amountMatches;
    
    // Use appropriate amount pattern based on statement type
    if (statementType === 'creditcard') {
      amountMatches = [...line.matchAll(patterns.ccAmount)];
    } else {
      amountMatches = [...line.matchAll(patterns.amount)];
    }
    
    if (dateMatch && amountMatches.length > 0) {
      const amount = parseFloat(amountMatches[0][1].replace(/,/g, ''));
      
      let isDebit, isCredit, description;
      
      if (statementType === 'creditcard') {
        // For credit cards, most transactions are expenses (debits)
        isDebit = !(/payment|credit|refund/i.test(line));
        isCredit = /payment|credit|refund/i.test(line);
        
        // Extract merchant name for credit cards
        const merchantMatch = line.match(patterns.merchant);
        description = merchantMatch ? merchantMatch[1].trim() : line.substring(0, 50);
      } else {
        // For bank statements
        isDebit = patterns.debit.test(line);
        isCredit = patterns.credit.test(line);
        
        const descMatch = line.match(patterns.description);
        description = descMatch ? descMatch[1].trim() : line.substring(0, 50);
      }
      
      if (amount > 0 && (isDebit || isCredit)) {
        transactions.push({
          date: new Date(dateMatch[0]),
          amount: amount,
          type: isDebit ? 'expense' : 'income',
          description: description,
          category: isDebit ? categorizeTransaction(description) : 'income',
          source: `PDF Import (${statementType})`,
          statementType: statementType
        });
      }
    }
  });
  
  return transactions;
}

router.post('/upload', upload.single('bankStatement'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const pdfData = await pdf(req.file.buffer);
    const transactions = extractTransactions(pdfData.text);
    
    if (transactions.length === 0) {
      return res.status(400).json({ error: 'No transactions found in PDF' });
    }
    
    // Get all members and find matching member
    const members = await Member.find();
    const matchedMember = await findMemberByName(pdfData.text, members);

    // Group transactions by date and category
    const groupedData = {};
    
    transactions.forEach(transaction => {
      const dateKey = transaction.date.toISOString().split('T')[0];
      
      if (!groupedData[dateKey]) {
        groupedData[dateKey] = {
          date: transaction.date,
          memberId: matchedMember._id,
          income: 0,
          homeEmi: 0, carEmi: 0, personalLoanEmi: 0, creditcardEmi: 0,
          homeMaintenance: 0, waterCharges: 0, netPhoneCharges: 0, transport: 0,
          foodOrders: 0, groceries: 0, clothing: 0, travelling: 0,
          carMaintenance: 0, petrol: 0, bikeMaintenance: 0, maid: 0,
          urbanCompany: 0, drinkingWater: 0, donations: 0, school: 0,
          gym: 0, badminton: 0, eatery: 0, onlineShopping: 0,
          repairsReplacements: 0, investment: 0
        };
      }
      
      if (transaction.type === 'income') {
        groupedData[dateKey].income += transaction.amount;
      } else {
        groupedData[dateKey][transaction.category] += transaction.amount;
      }
    });
    
    // Save grouped entries to database
    const savedEntries = [];
    for (const dateKey of Object.keys(groupedData)) {
      const entry = new Entry(groupedData[dateKey]);
      await entry.save();
      savedEntries.push(entry);
    }

    const statementType = detectStatementType(pdfData.text);
    
    res.json({
      message: `${transactions.length} ${statementType} transactions processed for ${matchedMember.name} into ${savedEntries.length} daily entries`,
      memberName: matchedMember.name,
      statementType: statementType,
      transactions: transactions,
      entries: savedEntries
    });

  } catch (error) {
    console.error('PDF processing error:', error);
    res.status(500).json({ error: 'Failed to process PDF: ' + error.message });
  }
});

module.exports = router;