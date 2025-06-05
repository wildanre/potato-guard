# Potato Guardian Frontend

A modern React-based web application for detecting potato diseases using machine learning. This application provides an intuitive interface for farmers and agricultural specialists to identify Early Blight, Late Blight, and Healthy potato leaves through image analysis.

## Features

- 🔍 **AI-Powered Disease Detection**: Upload potato leaf images for instant disease analysis
- 📊 **Detailed Results**: View confidence scores and all possible predictions
- 🤖 **AI Chatbot**: Interactive chatbot powered by Google Gemini for expert advice
- 🌓 **Dark/Light Theme**: Toggle between dark and light modes for comfortable viewing
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- ⚡ **Real-time Processing**: Fast image analysis with loading indicators
- 🎯 **Accuracy Tips**: Built-in guidance for optimal image capture
- 🚨 **Uncertainty Warnings**: Alerts when predictions have low confidence

## Disease Detection Capabilities

The application can identify three categories:
- **Early Blight**: Fungal disease with dark spots and yellowing
- **Late Blight**: Destructive disease causing dark lesions
- **Healthy**: Normal, disease-free potato leaves

## Chatbot Features

The integrated AI chatbot can help you with:
- Information about potato diseases
- Treatment and prevention recommendations
- Plant care tips
- Interpretation of detection results

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context API
- **HTTP Client**: Fetch API
- **AI Integration**: Google Generative AI (Gemini)

## Prerequisites

- Node.js 16 or higher
- npm or yarn package manager
- Google Gemini API key

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd potato-guardian
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   VITE_API_URL=your_backend_api_url
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

   To get a Gemini API key:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Create a new API key
   - Copy the key to your `.env` file

4. **Start the development server**
   ```bash
   npm run dev
   ```
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AccuracyTips.tsx    # Tips for better image quality
│   ├── Footer.tsx          # Application footer
│   ├── Header.tsx          # Application header with theme toggle
│   ├── ImageUploader.tsx   # Image upload and preview component
│   ├── InfoSection.tsx     # Information about potato diseases
│   └── ResultsDisplay.tsx  # Disease detection results display
├── context/             # React Context providers
│   └── ThemeContext.tsx    # Theme management
├── types/              # TypeScript type definitions
│   └── index.ts           # Application types
├── utils/              # Utility functions
│   └── detectionService.ts # API communication service
├── App.tsx             # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000
```

### Backend Integration

The frontend communicates with the backend API for disease detection. Ensure the backend server is running on the configured port (default: 5000).

## API Integration

The application integrates with the following backend endpoints:

- `POST /predict` - Upload image for disease detection
- `GET /health` - Check backend service health

## Usage

1. **Upload Image**: Click the upload area or drag and drop a potato leaf image
2. **Analyze**: Click "Analyze Image" to start the detection process
3. **View Results**: See the predicted disease, confidence score, and all predictions
4. **Review Tips**: Check accuracy tips for better results

## Image Requirements

For best results, ensure your images:
- Show clear potato leaves
- Have good lighting
- Are in focus
- Include the entire leaf
- Are taken from a reasonable distance

## Supported File Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- Maximum file size: 10MB

## Performance Optimization

- Images are automatically resized for optimal processing
- Lazy loading for improved initial load times
- Optimized bundle size with Vite

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Deployment

### Production Build

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify

1. Build the project: `npm run build`
2. Deploy the `dist/` folder to Netlify

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## Troubleshooting

### Common Issues

1. **Backend Connection Failed**
   - Ensure backend server is running
   - Check API URL configuration
   - Verify CORS settings

2. **Image Upload Failed**
   - Check file size (max 10MB)
   - Verify supported file format
   - Ensure stable internet connection

3. **Slow Processing**
   - Reduce image file size
   - Check internet connection
   - Verify backend server performance

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository or contact the development team.
