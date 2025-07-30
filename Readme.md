# 💰 Smart Finance Tracker
🎉 Journey of Building My Smart Finance App with GenAI Hello everyone! 🌟 I've embarked on an incredible journey of creating a personal finance app, and I wanted to share my experience with you.

For the longest time, I had the dream of building an application to manage my finance efficiently. However, my vision was often shrouded by the lack of knowledge on the resources available that could execute this task optimally and at zero cost.

Thanks to GenAI, this dream has finally become a reality! Initially, I anticipated that even with the help of GenAI, it might take a week just to build the initial version. To my delightful surprise, it only took a day to craft both the UI and the backend—complete with a file upload feature! ⚡

Here's a quick peek into my project: Smart Finance Tracker

🌟 Project Highlights 🔍 Features AI-Powered PDF Statement Processing: Automates the extraction and categorization of transactions from bank and credit card statements. Multi-Member Management: Manage finances for the entire family. Comprehensive Expense Categories: Over 25 categories to provide a holistic financial overview. 🚀 Tech Stack Frontend: React.js for an interactive UI experience. Backend: Node.js with Express.js to power a RESTful API. Database: MongoDB Atlas, offering robust cloud storage. 🌐 Features Real-time Updates & Calendar View: Financial performance tracking and goal setting with intuitive color-coded indicators. 📈 Quick Start Guide Clone the repository and set up your environment. Deploy effortlessly with free cloud options available for both the frontend and backend. I invite everyone interested in finance and technology to check out the details above, explore the project, and even contribute! 😊
A full-stack personal finance management application with **AI-powered PDF statement processing** that automatically extracts and categorizes transactions from bank and credit card statements.

## 🚀 Features

### 📊 **Core Functionality**
- **Multi-Member Management**: Track finances for entire family
- **Smart PDF Processing**: Auto-extract transactions from bank/credit card statements
- **25+ Expense Categories**: Comprehensive expense tracking
- **Calendar Visualization**: View financial data by date with member-wise breakdown
- **Goal Setting**: Set percentage-based financial expectations
- **Performance Analysis**: Compare actual vs expected spending with color-coded indicators

### 🤖 **AI-Powered PDF Processing**
- **Automatic Transaction Extraction**: Upload PDF statements and get transactions automatically
- **Smart Categorization**: AI categorizes expenses (groceries, petrol, food orders, etc.)
- **Member Auto-Detection**: Automatically matches statements to family members
- **Multi-Format Support**: Works with both bank statements and credit card statements
- **Pattern Recognition**: Advanced regex patterns for Indian banking formats

### 📱 **User Experience**
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Instant data synchronization
- **Color-coded Performance**: Green (meeting goals) / Red (below expectations)
- **Date-wise Calendar View**: Monthly and weekly financial overview

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React.js, React Router, React Calendar | Interactive UI and navigation |
| **Backend** | Node.js, Express.js | RESTful API server |
| **Database** | MongoDB Atlas | Cloud data storage |
| **PDF Processing** | pdf-parse, multer | Extract data from statements |
| **Styling** | CSS3 | Responsive design |

## 📁 Project Structure

```
Finance_App/
├── Client/                     # React Frontend
│   ├── src/
│   │   ├── Pages/             # Main application pages
│   │   │   ├── Members.js     # Member management
│   │   │   ├── Form.js        # Manual/PDF data entry
│   │   │   ├── Calendar.js    # Financial calendar view
│   │   │   ├── Expectation.js # Goal setting
│   │   │   └── Summary.js     # Performance analysis
│   │   ├── components/        # Reusable components
│   │   ├── App.js            # Main app component
│   │   └── App.css           # Styling
│   └── public/
├── Server/                    # Express Backend
│   ├── models/               # MongoDB schemas
│   │   ├── Member.js         # Family member model
│   │   ├── Entry.js          # Financial entry model
│   │   └── Expectation.js    # Goals model
│   ├── routes/               # API endpoints
│   │   ├── members.js        # Member CRUD operations
│   │   ├── entries.js        # Financial data operations
│   │   ├── expectations.js   # Goals management
│   │   └── pdf-processor.js  # PDF processing logic
│   └── index.js              # Server entry point
└── uploads/                  # Temporary PDF storage
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account (free tier)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Finance_App
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   ```bash
   # Server/.env
   PORT=5001
   MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/financeapp
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

5. **Access the app**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001


<img width="1737" height="807" alt="Screenshot 2025-07-29 142435" src="https://github.com/user-attachments/assets/9c3d15f8-ac90-4fa2-a2cf-f48d7998f9c5" />
<img width="1629" height="815" alt="Screenshot 2025-07-29 142605" src="https://github.com/user-attachments/assets/1f52654d-d8c6-4101-b622-d190dd3186ca" />
<img width="1644" height="923" alt="Screenshot 2025-07-29 142733" src="https://github.com/user-attachments/assets/c9b7c15f-76ee-4d0b-896f-fb2809f6f5e3" />
<img width="1638" height="931" alt="Screenshot 2025-07-29 142806" src="https://github.com/user-attachments/assets/7cb5dc62-2644-43b6-9cb8-f45ba05aa3fd" />
<img width="1560" height="904" alt="Screenshot 2025-07-29 142837" src="https://github.com/user-attachments/assets/93a2c388-516f-457b-b05e-472aa7f16285" />
<img width="1548" height="904" alt="Screenshot 2025-07-29 143230" src="https://github.com/user-attachments/assets/efdd99cc-17bd-4546-a18d-772ba33ab70d" />


## 📊 How PDF Processing Works

### 1. **Upload PDF Statement**
```javascript
// Supports both bank and credit card statements
const handlePdfUpload = async (file) => {
  const formData = new FormData();
  formData.append('pdf', file);
  
  const response = await axios.post('/api/pdf/extract', formData);
  // Auto-populates form with extracted data
};
```

### 2. **Smart Pattern Recognition**
```javascript
// Advanced regex patterns for Indian banking
const patterns = {
  homeEmi: [/home.*emi.*?(\d+)/i, /housing.*loan.*?(\d+)/i],
  groceries: [/grocery|dmart|reliance|supermarket/i],
  petrol: [/petrol|fuel|hp|ioc|bpcl/i],
  foodOrders: [/zomato|swiggy|uber eats|dominos/i]
  // 25+ categories supported
};
```

### 3. **Automatic Categorization**
- **Groceries**: DMart, Reliance Fresh, Big Bazaar
- **Food Orders**: Zomato, Swiggy, Dominos, KFC
- **Transport**: Uber, Ola, Metro, Auto
- **Petrol**: HP, IOC, BPCL, Shell
- **Online Shopping**: Amazon, Flipkart, Myntra

## 🎯 Usage Guide

### 1. **Add Family Members**
- Navigate to Members page
- Add name, age, and profession
- Each member gets unique color coding

### 2. **Set Financial Goals**
- Go to Expectations page
- Set monthly income and percentage allocations
- Define targets for necessary expenses, savings, investments

### 3. **Track Expenses**
- **Manual Entry**: Use Form page for daily entries
- **PDF Upload**: Upload bank/credit card statements for automatic processing
- **Calendar View**: Visualize spending patterns by date

### 4. **Analyze Performance**
- Summary page shows actual vs expected performance
- Green indicators: Meeting/exceeding goals
- Red indicators: Below expectations

## 🌐 Free Cloud Deployment

### Frontend Options
- **Vercel**: Connect GitHub repo for auto-deployment
- **Netlify**: Drag & drop build folder

### Backend Options
- **Render**: Free tier with 750 hours/month
- **Railway**: Free tier with usage limits

### Database
- **MongoDB Atlas**: Free tier with 512MB storage

## 📈 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/members` | Member management |
| GET/POST | `/api/entries` | Financial entries |
| GET/POST/PUT | `/api/expectations` | Financial goals |
| POST | `/api/pdf/extract` | PDF processing |

## 🎨 Key Features Demo

### PDF Processing
```bash
# Upload statement → Auto-extract → Categorize → Save
Bank Statement PDF → 50 transactions → 25 categories → Daily entries
```

### Smart Categorization
```bash
"ZOMATO ONLINE ORDER" → foodOrders: ₹450
"HP PETROL PUMP" → petrol: ₹2000  
"AMAZON SHOPPING" → onlineShopping: ₹1200
```

### Performance Tracking
```bash
Expected Investment: ₹10,000 | Actual: ₹12,000 → 🟢 Green
Expected Savings: ₹15,000 | Actual: ₹8,000 → 🔴 Red
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request


## 🙏 Acknowledgments

- Built with React.js and Node.js
- PDF processing powered by pdf-parse
- MongoDB Atlas for cloud database
- Responsive design with CSS3

---

**⭐ Star this repo if you find it helpful!**
