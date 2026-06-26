# Avatar Play

A premium, modern game distribution platform built with **Next.js 14**, **Tailwind CSS**, and **Firebase**.

![Avatar Play Hero](https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop)

## 🚀 Features

### for Users
*   **Epic-Style Hero Carousel**: Interactive, auto-rotating hero section with progress fill animations and immersive visuals.
*   **Universal Video Support**: Watch gameplay trailers via direct upload, YouTube videos, or **YouTube Shorts**.
*   **Responsive Design**: Fully optimized UI for Desktops, Tablets, and Mobile devices.
*   **Smart Search**: Real-time searching and filtering by genre/platform.
*   **Dual Platform Support**: Clear distinction and download links for **PC** and **Android** versions.
*   **Email Notifications**: Welcome emails triggers for new signups and newsletter subscriptions.

### 🎮 Gamification & Social
*   **XP & Leveling System**: Earn XP by downloading games, writing reviews, and engaging with the community.
*   **Interactive Profile**: Fully immersive **Cyber/Sci-Fi** profile page with holographic avatar, particle backgrounds, and glassmorphism UI.
*   **Badges & Achievements**: Unlockable 3D-style badges for milestones (e.g., "Pioneer", "Critic", "Influencer").
*   **Real-time Activity Feed**: deep-linked notification system for tracking comments, reviews, and posts..

### for Admins
*   **Secure Dashboard**: Protected admin panel with Firebase Authentication.
*   **Game Management**: Create, Edit, and Delete games with a user-friendly interface.
*   **AI-Powered Image Generation**: Automatically converts any cover image into a perfect 3:4 aspect ratio card using **Cloudinary Generative Fill**.
*   **Hybrid Upload System**: Option to upload a specific **Card Image** manually OR let the AI generate one from the **Cover Image**.
*   **Cloudinary Integration**: Automatic high-performance image hosting, smart cropping, and AI-based enhancements.
*   **Mobile Admin**: Manage your store on-the-go with a mobile-optimized admin layout.

### 📰 Autonomous AI Gaming Blog & GEO (AdSense Ready)
*   **Gemini-Powered Articles**: Fully automated news engine that brainstorms and writes 600-word, high-quality, SEO-optimized articles about trending blockbusters (e.g., GTA 6), hardware trends, and technical updates.
*   **Unsplash Image Search**: Dynamic integration with the Unsplash API to automatically find and link copyright-free, high-resolution cover images.
*   **Custom Override Triggers**: Secure API endpoint `/api/cron/update-blog?topic=...` to force-generate an article on any specific topic instantly.
*   **Server-Side Pagination**: High-performance offset pagination and Firestore count aggregation (`.count().get()`) keeping loading speeds fast and database reads minimal.
*   **Generative Engine Optimization (GEO)**: Automated JSON-LD schema injection (`BlogPosting` and `SoftwareApplication`/`Game` schemas) for Google AI Overviews and Gemini citation optimization.
*   **Vercel Cron Automation**: Configured daily midnight cron triggers via `vercel.json` for hands-free operations.
*   **XML Sitemap Integration**: Automatically registers new AI articles dynamically in the XML sitemap for instant crawler discovery.
*   **Mobile Bottom Navigation Bar**: A sleek 5-button bottom nav bar containing a dedicated newspaper icon for the blog.

## 🛠️ Tech Stack

*   **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Components)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) + CSS Variables
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **Database**: Firebase Firestore
*   **Auth**: Firebase Authentication
*   **Media**: Cloudinary (Image & Video optimization)
*   **AI/ML**: [TensorFlow.js](https://www.tensorflow.org/js) + [NSFWJS](https://github.com/infinitered/nsfwjs) (Content Moderation)
*   **Visualization**: [Chart.js](https://www.chartjs.org/) (Data Visualization)
*   **Icons**: Lucide React

## 📦 Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Akhilesh10gupta/Avatar-store.git
    cd Avatar-store
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**
    Create a `.env.local` file in the root directory and add your keys:

    ```env
    # Firebase Configuration
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

    # Cloudinary Configuration
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
    NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret

    # Email Configuration
    EMAIL_USER=your_gmail_address
    EMAIL_PASS=your_16_char_app_password

    # Google AdSense AI Blog Configuration
    GEMINI_API_KEY=your_gemini_api_key
    UNSPLASH_ACCESS_KEY=your_unsplash_access_key
    CRON_SECRET=your_custom_cron_security_secret
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result..

## 📂 Project Structure

```
├── app/                  # Next.js App Router pages
│   ├── admin/            # Protected admin routes
│   ├── game/[id]/        # Game details page
│   ├── profile/          # User profile & gamification
│   ├── globals.css       # Global styles & Tailwind
│   └── layout.tsx        # Root layout with Navbar/Footer
├── components/           # Reusable UI components
│   ├── Navbar.tsx        # Responsive navigation
│   ├── Hero.tsx          # Carousel component
│   ├── GameCard.tsx      # Game display card
│   └── ui/               # Atomic UI elements (Button, Input)
├── lib/                  # Utilities and Services
│   ├── firebase.ts       # Firebase config
│   ├── firestore.ts      # Database operations
│   ├── gamification.ts   # XP & Leveling logic
│   ├── cloudinary.ts     # Image optimization helpers
│   └── youtube.ts        # YouTube URL parsing
└── public/               # Static assets
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📄 License

[MIT](LICENSE)