const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies

const AppError = require('./utils/appError');

const globalErrorHandler = require('./controllers/errorController');

// Main Routers
const userRouter = require('./routes/userRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const sectionRouter = require('./routes/sectionRoutes');
const usersV2Router = require('./routes/usersV2Routes');

const app = express();

app.set('trust proxy', true);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static('images'));

// Set security HTTP headers with enhanced CSP
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https://api.your-domain.com'],
        fontSrc: ["'self'", 'https:', 'data:'],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
        upgradeInsecureRequests: []
      }
    },
    crossOriginEmbedderPolicy: { policy: 'credentialless' },
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'same-site' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
  })
);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  max: 100, // limit each IP to 100 requests per windowMs
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour'
});
app.use('/api', limiter);

// Body parser with size limits
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Prevent parameter pollution with specific allowed parameters
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// Enable CORS with specific options
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : true,
    credentials: true
  })
);
app.options('*', cors());

// Compression for responses
app.use(compression());

// Add cache control headers
app.use((req, res, next) => {
  // Don't cache API responses
  if (req.url.match(/^\/api/)) {
    res.setHeader('Cache-Control', 'no-store');
  }
  next();
});

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/sections', sectionRouter);
app.use('/api/users', usersV2Router);

app.post('/api/v1/logout', (req, res) => {
  res.send('Done');
});

// app.get('/api/users', (req, res) => {
//   console.log('req.body :>> ', req.body);
//   res.send({
//     message:
//       'Hello from a secured endpoint! You need to be authenticated to see this.',
//     data: req.body
//   });
// });

// app.get('/authorized', (req, res) => {
//   res.send('Secured Resource');
// });

// Handle 404 for API routes
app.all('/api/*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Handle 404 errors - add this at the end before error handler
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
