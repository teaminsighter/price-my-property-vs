# Price My Property - Landing Page

A modern, responsive landing page built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- ✨ **Image Slideshow Hero Section** - Automatically rotating background images
- 📱 **Fully Responsive Design** - Works on all devices
- 🎨 **Smooth Animations** - Using Framer Motion
- 📝 **Address Input Form** - Lead capture functionality
- 🔄 **Scrolling Text Ticker** - Continuous scrolling information banner
- 🚀 **SEO Optimized** - Meta tags and Open Graph support
- ⚡ **Static Export Ready** - Optimized for Hostinger deployment

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Add Your Images

Place your hero section images in the `public/images/` directory:
- `hero-1.jpg` - Main background image
- `hero-2.jpg` - Second background image
- `hero-3.jpg` - Third background image

These images should be of the same aspect ratio (recommended: 1920x1080 or similar).

### 3. Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### 4. Build for Production

```bash
npm run build
```

This creates an optimized static export in the `out/` directory.

## Deploying to Hostinger

### Method 1: FTP Upload

1. Build your project:
   ```bash
   npm run build
   ```

2. The build creates an `out/` folder with static files

3. Upload the contents of the `out/` folder to your Hostinger public_html directory via FTP

4. Your site will be live at your domain!

### Method 2: Git Deployment (if Hostinger supports it)

1. Push your code to a Git repository
2. Connect your Hostinger hosting to the repository
3. Set build command: `npm run build`
4. Set output directory: `out`

## Customization

### Colors

Edit `tailwind.config.ts` to change the color scheme:

```typescript
colors: {
  primary: "#3B9FE5",  // Main brand color
  secondary: "#2B7AC5", // Secondary brand color
},
```

### Content

- **Header Navigation**: Edit `components/Header.tsx`
- **Hero Section Text**: Edit `components/HeroSection.tsx`
- **Scrolling Text**: Edit `components/ScrollingText.tsx`
- **Form Submission**: Edit `components/AddressForm.tsx` to connect to your backend API

### SEO

Update SEO metadata in `app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: "Your Title",
  description: "Your Description",
  // ... other meta tags
};
```

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animation library

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with SEO
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/
│   ├── Header.tsx          # Navigation header
│   ├── HeroSection.tsx     # Hero with slideshow
│   ├── AddressForm.tsx     # Lead capture form
│   └── ScrollingText.tsx   # Bottom ticker
├── public/
│   └── images/             # Place your images here
└── next.config.js          # Next.js configuration
```

## Support

For issues or questions, please refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)

## License

MIT
