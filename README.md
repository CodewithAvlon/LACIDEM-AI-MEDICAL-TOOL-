# LACIDEM - Medical Management System

## 📁 File Structure

```
LACIDEM/
├── index.html      - Main HTML structure
├── styles.css      - All CSS styling
└── script.js       - All JavaScript functionality
```

## 🚀 How to Use

### Option 1: Simple Setup
1. Download all three files (index.html, styles.css, script.js)
2. Keep them in the same folder
3. Open `index.html` in any modern web browser
4. Done! The system is ready to use.

### Option 2: Web Server Setup
1. Place all files in your web server directory
2. Access through your web server URL
3. Ensure files maintain the same directory structure

## 🔑 Login Credentials

### Admin Login
- **Password:** `admin123`

### User Login
- **Phone:** `1234567890`
- **Password:** `pass123`

**OR**

- **Phone:** `9876543210`
- **Password:** `pass456`

## 🤖 AI Health Assistant (Powered by Claude)

LACIDEM features an advanced AI health assistant powered by **Anthropic's Claude 3 Sonnet** - one of the most capable AI models available.

### Setup Claude AI Integration
1. Get an API key from [Anthropic Console](https://console.anthropic.com/)
2. Follow the setup instructions in `CLAUDE_SETUP.md`
3. Replace the placeholder API key in `script.js`

### AI Features
- **Medical Knowledge**: Comprehensive information about medicines, conditions, and treatments
- **Evidence-Based**: Provides accurate, research-backed health information
- **Safety First**: Always includes appropriate medical disclaimers
- **Contextual Responses**: Understands complex health questions
- **Fallback System**: Works offline if API is unavailable

### Sample Questions to Ask
- "What are alternatives to ibuprofen for arthritis?"
- "Side effects of blood pressure medications"
- "How to manage type 2 diabetes naturally"
- "Vitamin deficiencies and symptoms"
- "Antibiotic resistance explained"

**Note:** The AI assistant provides general information and should not replace professional medical advice.
- 📍 **Nearby Stores** - Find pharmacies with ratings
- 🤖 **AI Chatbot** - Medicine alternatives and health advice (powered by Claude API)
- 📰 **Health News** - Latest pharmaceutical updates
- 📦 **Order Tracking** - Complete order history

## 💻 Technical Details

### Dependencies
- **Tailwind CSS** - Loaded via CDN
- **Google Fonts** - Outfit & Poppins fonts
- **Claude API** - For AI chatbot functionality

### Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge

All modern browsers with ES6+ support

## 📝 File Details

### index.html
- Contains the complete HTML structure
- Three main pages: Login, Admin Dashboard, User Dashboard
- Links to styles.css and script.js

### styles.css
- All CSS styling organized by sections
- CSS variables for consistent theming
- Animations and transitions
- Responsive design classes

### script.js
- Complete JavaScript functionality
- Login authentication
- Admin dashboard logic (AI predictions, inventory)
- User dashboard features (search, chatbot, orders)
- Sample data for demonstration

## 🎨 Customization

### Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary: #3a7e6f;
    --primary-dark: #2d6159;
    --secondary: #10b981;
    --accent: #f59e0b;
}
```

### Sample Data
Modify sample data in `script.js`:
- `sampleMedicines` - Medicine database
- `sampleStores` - Store locations
- `sampleNews` - News articles
- `userDatabase` - User credentials

## 🔒 Security Note

**Important:** This is a demo application with hardcoded credentials. For production use:
1. Implement proper backend authentication
2. Use secure password hashing
3. Add database integration
4. Implement proper API security

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1024px - 1920px)
- Tablet (768px - 1024px)
- Mobile (320px - 768px)

## 🆘 Troubleshooting

### Files not loading?
- Ensure all three files are in the same directory
- Check file names are exactly: `index.html`, `styles.css`, `script.js`
- Clear browser cache and reload

### AI Chatbot not working?
- Check internet connection
- Verify Claude API access
- Check browser console for errors

### Styling issues?
- Ensure Tailwind CSS CDN is loading
- Check network tab in browser DevTools
- Verify styles.css is linked correctly

## 📄 License

This is a demonstration project for educational purposes.

## 🤝 Support

For issues or questions, refer to the code comments in each file for detailed documentation.

---

**Made with ❤️ for LACIDEM Medical Management System**
