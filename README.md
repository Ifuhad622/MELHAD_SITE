# MelHad Investment - Professional Printing Services

## Overview
MelHad Investment is a leading printing services provider based in Sierra Leone, offering a comprehensive range of professional printing solutions. The company specializes in high-quality printing services, graphics design, IT support, and web development, with a strong commitment to customer satisfaction and timely delivery.

## Features

### Core Services
- Graphics Design
- IT Support
- Web Development
- Professional Printing Services
- Custom Design Solutions

### Printing Services
- Business Cards & Stationery
- Large Format Printing
- Digital & Screen Printing
- T-shirt Printing
- Offset Printing
- Engraving & Embroidery
- Signage & Branding
- Custom Merchandise (Mugs, Pens, etc.)
- Book & Document Printing
- PVC ID Cards
- And many more specialized services

### Website Features
- Responsive Design
- Interactive Gallery
- Secure Payment Integration
- Contact Form
- Testimonials Section
- Google Maps Integration
- Social Media Integration
- Mobile-Friendly Interface

## Technical Implementation

### Frontend Technologies
- HTML5
- CSS3
- JavaScript
- jQuery
- Font Awesome Icons
- Boxicons
- Owl Carousel
- Responsive Design

### Backend Integration
- Node.js
- Express.js
- RESTful API
- Monime Payment Integration
- Form Submission Handling

### Development Tools
- Git Version Control
- npm Package Manager
- Modern Development Workflow
- Cross-browser Compatibility

## Website Structure
1. Home Section
   - Company Introduction
   - Core Values
   - Mission & Vision

2. Services Section
   - Comprehensive Service List
   - Service Descriptions
   - Interactive Elements

3. Gallery Section
   - Portfolio Display
   - Service Showcase
   - Image Carousel

4. Payment Section
   - Secure Payment Form
   - Monime Integration
   - Payment Processing

5. Contact Section
   - Contact Form
   - Location Map
   - Social Media Links

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/your-username/MELHAD-SITE.git
cd MELHAD-SITE
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
- Create a `.env` file with:
  ```
  MONIME_API_KEY=your_api_key
  MONIME_PUBLIC_KEY=your_public_key
  PORT=3000
  ```

4. Start the development server:
```bash
npm start
```

# MelHad Investment - Professional Printing Services

// ... existing code ...

## Backend Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (v4.4 or higher)
- Monime API credentials

### Installation Steps

1. Clone the repository:
```bash
git clone https://github.com/your-username/MELHAD_SITE.git
cd ELHAD_SITE
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables:
Create a `.env` file in the root directory with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/melhad-investment
MONIME_API_KEY=your_monime_api_key
MONIME_PUBLIC_KEY=your_monime_public_key
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

4. Database Setup:
```bash
# Start MongoDB service
sudo service mongod start

# Create database and collections
mongo
> use melhad-investment
> db.createCollection('users')
> db.createCollection('orders')
> db.createCollection('payments')
```

5. Start the development server:
```bash
npm run dev
```

### API Endpoints

#### Payment Endpoints
- `POST /api/pay`
  - Description: Initiate payment process
  - Request Body:
    ```json
    {
      "email": "user@example.com",
      "name": "John Doe",
      "amount": 1000,
      "reference": "PAY-123456"
    }
    ```
  - Response:
    ```json
    {
      "status": "success",
      "checkout_url": "https://checkout.monime.com/..."
    }
    ```

#### Form Submission Endpoints
- `POST /api/forms/submit`
  - Description: Handle contact form submissions
  - Request Body:
    ```json
    {
      "name": "John Doe",
      "email": "user@example.com",
      "message": "Inquiry message"
    }
    ```
  - Response:
    ```json
    {
      "status": "success",
      "message": "Form submitted successfully"
    }
    ```

### Security Configuration

1. CORS Setup:
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'https://melhad-investment.com'],
  methods: ['GET', 'POST'],
  credentials: true
}));
```

2. Rate Limiting:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

3. Security Headers:
```javascript
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
```

### Error Handling

1. Global Error Handler:
```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!'
  });
});
```

2. API Error Responses:
```javascript
// 400 Bad Request
res.status(400).json({
  status: 'error',
  message: 'Invalid request data'
});

// 401 Unauthorized
res.status(401).json({
  status: 'error',
  message: 'Authentication required'
});

// 404 Not Found
res.status(404).json({
  status: 'error',
  message: 'Resource not found'
});
```

### Testing

1. Install testing dependencies:
```bash
npm install --save-dev jest supertest
```

2. Run tests:
```bash
npm test
```

### Deployment

1. Production Environment Setup:
```bash
# Set environment to production
export NODE_ENV=production

# Install production dependencies
npm install --production

# Start the server
npm start
```

2. PM2 Process Manager:
```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start server.js --name "melhad-investment"

# Monitor the application
pm2 monit
```

### Monitoring

1. Logging:
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

2. Health Check Endpoint:
```javascript
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});
```

// ... rest of existing code ...

## Usage

### Making Payments
1. Navigate to the payment section
2. Fill in the required details:
   - Email Address
   - Full Name
   - Payment Amount
3. Click "Pay Securely"
4. Complete the payment through Monime

### Contacting Support
- Email: melhad0121@gmail.com
- Phone: +232 76 747-893 / +232 78 475-680
- Social Media: Facebook, WhatsApp, Instagram, TikTok

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Support
For support, please contact:
- Email: melhad0121@gmail.com
- Phone: +232 76 747-893 / +232 78 475-680
- Social Media: linktr.ee/melhad_investment

## Acknowledgments
- Monime Payment System
- Modern UI/UX frameworks
- Open source libraries and tools
- Printing industry standards

## Project Status
Active development - Regular updates and improvements are being made.

## Future Enhancements
- Enhanced payment processing
- Additional printing services
- Improved user interface
- Advanced order tracking
- Mobile app integration
- Enhanced security features
- Multiple currency support

## Backend Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (v4.4 or higher)
- Monime API credentials

### Installation Steps

1. Clone the repository:
```bash
git clone https://github.com/your-username/melhad-investment.git
cd melhad-investment
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables:
Create a `.env` file in the root directory with the following variables:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/melhad-investment
MONIME_API_KEY=your_monime_api_key
MONIME_PUBLIC_KEY=your_monime_public_key
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

4. Database Setup:
```bash
# Start MongoDB service
sudo service mongod start

# Create database and collections
mongo
> use melhad-investment
> db.createCollection('users')
> db.createCollection('orders')
> db.createCollection('payments')
```

5. Start the development server:
```bash
npm run dev
```

### API Endpoints

#### Payment Endpoints
- `POST /api/pay`
  - Description: Initiate payment process
  - Request Body:
    ```json
    {
      "email": "user@example.com",
      "name": "John Doe",
      "amount": 1000,
      "reference": "PAY-123456"
    }
    ```
  - Response:
    ```json
    {
      "status": "success",
      "checkout_url": "https://checkout.monime.com/..."
    }
    ```

#### Form Submission Endpoints
- `POST /api/forms/submit`
  - Description: Handle contact form submissions
  - Request Body:
    ```json
    {
      "name": "John Doe",
      "email": "user@example.com",
      "message": "Inquiry message"
    }
    ```
  - Response:
    ```json
    {
      "status": "success",
      "message": "Form submitted successfully"
    }
    ```

### Security Configuration

1. CORS Setup:
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'https://melhad-investment.com'],
  methods: ['GET', 'POST'],
  credentials: true
}));
```

2. Rate Limiting:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

3. Security Headers:
```javascript
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
```

### Error Handling

1. Global Error Handler:
```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!'
  });
});
```

2. API Error Responses:
```javascript
// 400 Bad Request
res.status(400).json({
  status: 'error',
  message: 'Invalid request data'
});

// 401 Unauthorized
res.status(401).json({
  status: 'error',
  message: 'Authentication required'
});

// 404 Not Found
res.status(404).json({
  status: 'error',
  message: 'Resource not found'
});
```

### Testing

1. Install testing dependencies:
```bash
npm install --save-dev jest supertest
```

2. Run tests:
```bash
npm test
```

### Deployment

1. Production Environment Setup:
```bash
# Set environment to production
export NODE_ENV=production

# Install production dependencies
npm install --production

# Start the server
npm start
```

2. PM2 Process Manager:
```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start server.js --name "melhad-investment"

# Monitor the application
pm2 monit
```

### Monitoring

1. Logging:
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

2. Health Check Endpoint:
```javascript
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});
```
