# CSR Module Setup & Deployment Guide

## Overview

This guide provides comprehensive instructions for setting up, configuring, and deploying the CSR (Corporate Social Responsibility) module in the 14Trees frontend application.

## Prerequisites

### System Requirements
- **Node.js**: Version 16.x or higher
- **npm**: Version 8.x or higher (or yarn equivalent)
- **Git**: Latest version
- **Modern Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Development Tools
- **IDE**: Visual Studio Code (recommended)
- **Extensions**: 
  - ES7+ React/Redux/React-Native snippets
  - TypeScript Importer
  - Prettier - Code formatter
  - ESLint

### External Services
- **AWS Account**: For S3 file storage
- **Razorpay Account**: For payment processing
- **Backend API**: 14Trees backend service running

## Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/14trees-foundation/14trees-web-monorepo.git
cd 14trees-web-monorepo
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd apps/frontend
npm install
```

### 3. Environment Configuration

Create environment files for different deployment stages:

#### Development Environment (`.env.development`)
```env
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:3001/api
REACT_APP_API_VERSION=v1

# Authentication
REACT_APP_BYPASS_AUTH=false
REACT_APP_JWT_SECRET=your-jwt-secret

# Payment Gateway
REACT_APP_RAZORPAY_KEY=rzp_test_your_test_key
REACT_APP_RAZORPAY_SECRET=your_razorpay_secret

# AWS Configuration
REACT_APP_AWS_REGION=us-east-1
REACT_APP_AWS_ACCESS_KEY_ID=your_aws_access_key
REACT_APP_AWS_SECRET_ACCESS_KEY=your_aws_secret_key
REACT_APP_AWS_BUCKET=14trees-dev-bucket

# Feature Flags
REACT_APP_ENABLE_CSR=true
REACT_APP_ENABLE_ANALYTICS=true

# Monitoring
REACT_APP_SENTRY_DSN=your_sentry_dsn
REACT_APP_ANALYTICS_ID=your_analytics_id

# Debug
REACT_APP_DEBUG=true
REACT_APP_LOG_LEVEL=debug
```

#### Production Environment (`.env.production`)
```env
# API Configuration
REACT_APP_API_BASE_URL=https://api.14trees.org/api
REACT_APP_API_VERSION=v1

# Authentication
REACT_APP_BYPASS_AUTH=false

# Payment Gateway
REACT_APP_RAZORPAY_KEY=rzp_live_your_live_key

# AWS Configuration
REACT_APP_AWS_REGION=us-east-1
REACT_APP_AWS_BUCKET=14trees-prod-bucket

# Feature Flags
REACT_APP_ENABLE_CSR=true
REACT_APP_ENABLE_ANALYTICS=true

# Monitoring
REACT_APP_SENTRY_DSN=your_production_sentry_dsn
REACT_APP_ANALYTICS_ID=your_production_analytics_id

# Debug
REACT_APP_DEBUG=false
REACT_APP_LOG_LEVEL=error
```

### 4. AWS S3 Configuration

#### Create S3 Bucket
```bash
# Using AWS CLI
aws s3 mb s3://14trees-csr-files --region us-east-1

# Set bucket policy for public read access to logos
aws s3api put-bucket-policy --bucket 14trees-csr-files --policy file://bucket-policy.json
```

#### Bucket Policy (`bucket-policy.json`)
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::14trees-csr-files/logos/*"
    }
  ]
}
```

#### CORS Configuration
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://dashboard.14trees.org", "http://localhost:3000"],
    "ExposeHeaders": ["ETag"]
  }
]
```

### 5. Razorpay Configuration

#### Test Environment Setup
1. Create Razorpay test account
2. Generate test API keys
3. Configure webhook endpoints
4. Set up payment methods

#### Webhook Configuration
```javascript
// Webhook endpoint: /api/payments/webhook
const webhookEndpoint = 'https://api.14trees.org/api/payments/webhook';

// Webhook events to subscribe:
const events = [
  'payment.captured',
  'payment.failed',
  'order.paid',
  'refund.created'
];
```

## Development Setup

### 1. Start Development Server

```bash
# From frontend directory
npm start

# Or with specific environment
npm run start:development
```

### 2. Development Workflow

#### File Structure for CSR Development
```
apps/frontend/src/pages/admin/csr/
├── components/           # Shared CSR components
├── form/                # Form components
├── hooks/               # Custom hooks (if any)
├── utils/               # CSR-specific utilities
├── types/               # TypeScript type definitions
└── __tests__/           # Test files
```

#### Adding New CSR Features

1. **Create Component**
```typescript
// apps/frontend/src/pages/admin/csr/NewFeature.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';

interface NewFeatureProps {
  groupId: number;
  selectedGroup: Group;
}

const NewFeature: React.FC<NewFeatureProps> = ({ groupId, selectedGroup }) => {
  return (
    <Box>
      <Typography variant="h4">New Feature</Typography>
      {/* Feature implementation */}
    </Box>
  );
};

export default NewFeature;
```

2. **Add to Main CSR Page**
```typescript
// In CSRPage.tsx
import NewFeature from './NewFeature';

// Add to navigation items
const items = [
  // ... existing items
  {
    displayName: "New Feature",
    logo: NewIcon,
    key: 5,
    display: true,
    onClick: () => setActiveTab("newFeature")
  }
];

// Add to render section
{activeTab === "newFeature" && currentGroup && (
  <NewFeature selectedGroup={currentGroup} groupId={currentGroup.id} />
)}
```

3. **Add Route (if needed)**
```typescript
// In App.jsx
<Route
  path="/csr/new-feature/:groupId"
  element={
    <RequireAuth>
      <NewFeature />
    </RequireAuth>
  }
/>
```

### 3. Testing Setup

#### Unit Testing
```bash
# Run CSR-specific tests
npm test -- --testPathPattern=csr

# Run with coverage
npm test -- --coverage --testPathPattern=csr
```

#### Integration Testing
```bash
# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e
```

#### Test Configuration
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@csr/(.*)$': '<rootDir>/src/pages/admin/csr/$1'
  },
  collectCoverageFrom: [
    'src/pages/admin/csr/**/*.{ts,tsx}',
    '!src/pages/admin/csr/**/*.d.ts',
    '!src/pages/admin/csr/**/*.stories.{ts,tsx}'
  ]
};
```

## Production Deployment

### 1. Build Process

#### Build Configuration
```bash
# Production build
npm run build

# Build with specific environment
NODE_ENV=production npm run build

# Analyze bundle size
npm run build:analyze
```

#### Build Optimization
```javascript
// webpack.config.js optimizations
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        csr: {
          test: /[\\/]src[\\/]pages[\\/]admin[\\/]csr[\\/]/,
          name: 'csr',
          chunks: 'all',
        }
      }
    }
  }
};
```

### 2. Deployment Strategies

#### Option 1: Static Hosting (Recommended)

**AWS S3 + CloudFront**
```bash
# Build and deploy script
#!/bin/bash
npm run build
aws s3 sync build/ s3://14trees-frontend-prod --delete
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

**Netlify Deployment**
```toml
# netlify.toml
[build]
  publish = "build"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "16"

[[redirects]]
  from = "/csr/*"
  to = "/index.html"
  status = 200
```

**Vercel Deployment**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "build" }
    }
  ],
  "routes": [
    {
      "src": "/csr/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

#### Option 2: Docker Deployment

**Dockerfile**
```dockerfile
# Multi-stage build
FROM node:16-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf**
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # CSR routes
    location /csr {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://backend:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Static assets
    location /static {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Docker Compose**
```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - REACT_APP_API_BASE_URL=http://backend:3001/api
    depends_on:
      - backend
    
  backend:
    image: 14trees/backend:latest
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
```

### 3. CI/CD Pipeline

#### GitHub Actions
```yaml
# .github/workflows/deploy-csr.yml
name: Deploy CSR Module

on:
  push:
    branches: [main]
    paths: ['apps/frontend/src/pages/admin/csr/**']

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run test:csr
      - run: npm run lint:csr

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build
        env:
          REACT_APP_API_BASE_URL: ${{ secrets.API_BASE_URL }}
          REACT_APP_RAZORPAY_KEY: ${{ secrets.RAZORPAY_KEY }}
      
      - name: Deploy to S3
        run: |
          aws s3 sync build/ s3://${{ secrets.S3_BUCKET }} --delete
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      
      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_ID }} --paths "/*"
```

## Monitoring & Maintenance

### 1. Performance Monitoring

#### Core Web Vitals Tracking
```typescript
// src/utils/performance.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export const initPerformanceMonitoring = () => {
  const sendToAnalytics = (metric: any) => {
    // Send to your analytics service
    if (window.gtag) {
      window.gtag('event', metric.name, {
        event_category: 'Web Vitals',
        value: Math.round(metric.value),
        event_label: metric.id,
      });
    }
  };

  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
};
```

#### Error Tracking with Sentry
```typescript
// src/utils/errorTracking.ts
import * as Sentry from '@sentry/react';

export const initErrorTracking = () => {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    integrations: [
      new Sentry.BrowserTracing({
        routingInstrumentation: Sentry.reactRouterV6Instrumentation(
          React.useEffect,
          useLocation,
          useNavigationType,
          createRoutesFromChildren,
          matchRoutes
        ),
      }),
    ],
    tracesSampleRate: 0.1,
    beforeSend(event) {
      // Filter out non-CSR errors if needed
      if (event.request?.url?.includes('/csr/')) {
        return event;
      }
      return null;
    }
  });
};
```

### 2. Health Checks

#### Application Health Check
```typescript
// src/utils/healthCheck.ts
export const performHealthCheck = async () => {
  const checks = {
    api: false,
    auth: false,
    storage: false,
    payment: false
  };

  try {
    // API health check
    const apiResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/health`);
    checks.api = apiResponse.ok;

    // Auth check
    const token = localStorage.getItem('authToken');
    checks.auth = !!token;

    // Storage check (AWS S3)
    checks.storage = await checkS3Connection();

    // Payment gateway check
    checks.payment = await checkRazorpayConnection();

  } catch (error) {
    console.error('Health check failed:', error);
  }

  return checks;
};
```

### 3. Logging Strategy

#### Structured Logging
```typescript
// src/utils/logger.ts
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

class Logger {
  private level: LogLevel;

  constructor() {
    this.level = process.env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG;
  }

  private log(level: LogLevel, message: string, data?: any) {
    if (level >= this.level) {
      const logEntry = {
        timestamp: new Date().toISOString(),
        level: LogLevel[level],
        message,
        data,
        module: 'CSR',
        url: window.location.href
      };

      console.log(JSON.stringify(logEntry));

      // Send to external logging service in production
      if (process.env.NODE_ENV === 'production' && level >= LogLevel.ERROR) {
        this.sendToLoggingService(logEntry);
      }
    }
  }

  debug(message: string, data?: any) { this.log(LogLevel.DEBUG, message, data); }
  info(message: string, data?: any) { this.log(LogLevel.INFO, message, data); }
  warn(message: string, data?: any) { this.log(LogLevel.WARN, message, data); }
  error(message: string, data?: any) { this.log(LogLevel.ERROR, message, data); }

  private async sendToLoggingService(logEntry: any) {
    // Implementation for external logging service
  }
}

export const logger = new Logger();
```

## Troubleshooting

### Common Issues

#### 1. Authentication Issues
```bash
# Check token validity
localStorage.getItem('authToken')

# Clear auth data
localStorage.removeItem('authToken')
localStorage.removeItem('userId')
localStorage.removeItem('roles')
```

#### 2. API Connection Issues
```bash
# Check API endpoint
curl -X GET "http://localhost:3001/api/health"

# Check CORS configuration
# Ensure backend allows frontend origin
```

#### 3. Payment Gateway Issues
```bash
# Test Razorpay connection
curl -X POST "https://api.razorpay.com/v1/orders" \
  -H "Content-Type: application/json" \
  -u "YOUR_KEY_ID:YOUR_KEY_SECRET" \
  -d '{"amount": 100, "currency": "INR"}'
```

#### 4. File Upload Issues
```bash
# Check AWS credentials
aws sts get-caller-identity

# Test S3 upload
aws s3 cp test-file.txt s3://your-bucket/test/
```

### Debug Mode

#### Enable Debug Logging
```typescript
// In development
localStorage.setItem('debug', 'csr:*');

// In component
import debug from 'debug';
const log = debug('csr:component-name');

log('Debug message', { data });
```

#### Performance Profiling
```typescript
// Enable React DevTools Profiler
if (process.env.NODE_ENV === 'development') {
  import('react-dom').then(({ unstable_trace }) => {
    // Enable tracing
  });
}
```

## Security Considerations

### 1. Environment Variables
- Never commit `.env` files to version control
- Use different keys for development and production
- Rotate keys regularly
- Use AWS IAM roles instead of access keys when possible

### 2. Content Security Policy
```html
<!-- In public/index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://checkout.razorpay.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https://*.amazonaws.com;
  connect-src 'self' https://api.14trees.org https://api.razorpay.com;
">
```

### 3. Input Validation
- Validate all user inputs on both client and server
- Sanitize data before displaying
- Use parameterized queries for database operations
- Implement rate limiting for API calls

This comprehensive setup guide ensures a smooth development experience and robust production deployment for the CSR module.