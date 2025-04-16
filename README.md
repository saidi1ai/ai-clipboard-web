# ai-clipboard-web
AI-powered clipboard manager web application"
Install dependencies
2. ```shellscript
npm install
# or
yarn install
```


3. Start the development server:

```shellscript
npm start
# or
yarn start
```


4. Open your browser to the URL shown in the terminal (typically [http://localhost:19006](http://localhost:19006))


## Deployment

This project is configured for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect the configuration from `vercel.json`
4. Deploy and enjoy your application on Vercel's global network


## Project Structure

```
ai-clipboard-web/
├── app/                  # Application screens and navigation
│   ├── (auth)/           # Authentication screens
│   ├── (tabs)/           # Main tab screens
│   ├── item/             # Item detail screens
│   └── _layout.tsx       # Root layout component
├── components/           # Reusable UI components
├── constants/            # Application constants
├── store/                # State management
│   ├── auth-store.ts     # Authentication state
│   ├── clipboard-store.ts # Clipboard data state
│   └── subscription-store.ts # Subscription state
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
├── assets/               # Static assets
├── app.json              # Expo configuration
└── vercel.json           # Vercel deployment configuration
```
## Web Adaptation Notes

This application was originally designed for mobile platforms (iOS and Android) and has been adapted for web browsers. Some considerations:

- **Clipboard Access**: Browser clipboard access requires user permission and secure contexts (HTTPS)
- **File System**: File operations are limited in the browser environment
- **UI Adaptations**: Some components may behave differently on web vs. mobile


## Environment Variables

For full functionality, you may need to set up the following environment variables:

- `OPENAI_API_KEY`: For OpenAI integration
- `GEMINI_API_KEY`: For Google Gemini integration
- `FIREBASE_CONFIG`: For authentication (if using Firebase)


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Expo](https://expo.dev/) for the cross-platform framework
- [Vercel](https://vercel.com/) for hosting and deployment
- [OpenAI](https://openai.com/) and [Google Gemini](https://ai.google.dev/) for AI capabilities
```
