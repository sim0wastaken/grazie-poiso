# 🏆 Grazie Poiso Foundation

> *"Elo grind attraverso gratitudine e divertimento"*  
> Elo grind through gratitude and fun

[![Next.js](https://img.shields.io/badge/Next.js-15.0.3-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0--rc-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.1-38B2AC)](https://tailwindcss.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991)](https://openai.com/)

> The Grazie Poiso Foundation is a unique spiritual gaming community that combines gratitude, competitive gaming, and AI-powered guidance. Our platform celebrates the sacred art of the "elo grind" through divine intervention and community support.

### What the hell is this?

I made this purely for fun. It is my first project ever. 

It is about gaming, memes and inside jokes of a niche Italian community of Italian gamers.

You will definitely NOT get it, you will not understand and you might even think I am weird.

Which honestly, I don't mind.

Access the hosted verion at https://www.graziepoiso.com/

## ✨ Features

### 🙏 Sacred Mantras & Teachings
- Collection of powerful mantras including "Grazie Poiso" and "Eccellente"
- Spiritual guidance for competitive gaming
- Community testimonials and success stories

### 🤖 Poiso Oracle (AI Chat)
- AI-powered spiritual guidance using OpenAI GPT-4o-mini
- Interactive chat interface with markdown support
- Contextual examples and predefined questions
- Real-time streaming responses

### 📊 Community Stats
- Live tracking of believers (10,000+)
- Matches won statistics (1M+)
- Daily prayers counter (50K+)
- Success rate monitoring (99%)

### 🎨 Modern UI/UX
- Beautiful, responsive design built with shadcn/ui
- Easy on the eyes theme
- Mobile-first approach
- Smooth animations and transitions

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 15.0.3 with App Router
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 3.4.1
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Animations**: tailwindcss-animate

### Backend & Services
- **AI Integration**: OpenAI API (GPT-4o-mini)
- **Database**: Firebase
- **Analytics**: Vercel Analytics
- **Deployment**: Vercel (recommended)

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint with Next.js config
- **Bundler**: Turbopack (Next.js 15)
- **Type Checking**: TypeScript

## 📦 Installation

### Prerequisites
- Node.js 18.17 or later
- npm or yarn package manager
- OpenAI API key
- Firebase project (optional)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/grazie-poiso.git
   cd grazie-poiso/frontend/app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env.local` file in the `frontend/app` directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_ASSISTANT_ID=your_assistant_id_here
   
   # Firebase Configuration (if using)
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   # ... other Firebase config
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📂 Project Structure

```
frontend/app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (poiso)/           # Route groups
│   │   │   └── poiso/         # Poiso Oracle page
│   │   ├── api/               # API routes
│   │   │   ├── chat/          # Chat API endpoint
│   │   │   └── assistant/     # Assistant API endpoint
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── testimonials/     # Testimonials section
│   │   ├── providers/        # Context providers
│   │   └── icons/            # Custom icons
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility libraries
│   │   ├── openai.ts        # OpenAI configuration
│   │   └── utils.ts         # Utility functions
│   └── types/               # TypeScript type definitions
├── public/                  # Static assets
├── package.json            # Dependencies and scripts
├── tailwind.config.ts      # Tailwind configuration
├── next.config.ts          # Next.js configuration
└── tsconfig.json          # TypeScript configuration
```

## 🛠 Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🎯 Usage

### Homepage
- Explore community stats and mantras
- Read testimonials from fellow believers
- Navigate to the Poiso Oracle for guidance

### Poiso Oracle
- Access at `https://www.graziepoiso.com/`
- Ask questions about gaming, strategy, or spiritual guidance
- Use predefined examples or ask custom questions
- Receive AI-powered responses with markdown formatting

### API Endpoints
- `POST /api/chat` - Send messages to the AI chat system
- `POST /api/assistant` - Access the OpenAI assistant functionality

## 🎨 Customization

### Themes
The app supports dark/light themes out of the box. Theme switching is handled by `next-themes` and can be customized in:
- `src/components/theme-provider.tsx`
- `src/components/mode-toggle.tsx`

### UI Components
All UI components are built with shadcn/ui and can be customized in:
- `src/components/ui/` - Individual component files
- `tailwind.config.ts` - Global design tokens
- `src/app/globals.css` - Global styles

### Mantras and Content
Update the mantras, stats, and content in:
- `src/app/page.tsx` - Homepage content
- `src/app/(poiso)/poiso/page.tsx` - Oracle page content

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Add environment variables in the Vercel dashboard
3. Deploy automatically on every push to main

### Other Platforms
The app is a standard Next.js application and can be deployed to:
- Netlify
- Railway
- AWS Amplify
- Any Node.js hosting provider

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

Do whatever you want, your mileage may vary and I am not responsible for it.

## 🙏 Acknowledgments

- The Poiso community for their unwavering faith
- OpenAI for providing the spiritual guidance API
- The shadcn/ui team for the beautiful component library
- Vercel for hosting and analytics

## 📧 Support

For support, questions, or spiritual guidance, please:
- Visit the Poiso Oracle at `https://www.graziepoiso.com/poiso`
- Open an issue on GitHub
- Contact the community through our platform

---

*"Through Poiso's grace, victory awaits"* 🏆

**Grazie Poiso Foundation** - Transforming elo grinds through gratitude and divine intervention. 