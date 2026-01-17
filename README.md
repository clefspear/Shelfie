# 📚 BookShelfie - Reading with Friends

<div align="center">
  <img src="https://imgur.com/d8McKRN" alt="BookShelfie Banner" width="100%" style="border-radius: 16px; margin-bottom: 24px;"/>
  
  **Track your reading progress. Share with friends. Celebrate every page.**

  [Try BookShelfie Now](https://bookshelfie.vercel.app) • [Report Bug](https://github.com/clefspear/bookshelfie/issues) • [Request Feature](https://github.com/clefspear/bookshelfie/issues)

</div>

---

## 📖 What is BookShelfie?

**BookShelfie is the simplest way to track the books you're reading and share with friends.** 

No complicated spreadsheets. No overwhelming features. Just a beautiful, cozy place to see your reading progress and share it with friends.

Think of it like a digital bookshelf on your phone's home screen — glance at it, see what you're reading, update your progress, and keep going.

<div align="center">
  <img src="https://imgur.com/GRwwpZk" alt="Reading Preview" width="300" style="border-radius: 12px;"/>
</div>

---

## ✨ Key Features

### 📱 **Glanceable Widget** (Coming to iOS)
See your currently reading books right on your home screen. No need to open an app — your progress is always visible.

### 🔍 **Find Any Book**
Search for any book — physical books from the library, Kindle ebooks, or even PDF textbooks. We automatically find the page count so you can start tracking immediately.

### 📊 **Beautiful Progress Tracking**
Gorgeous coral progress bars that celebrate every page you turn. Update by dragging a slider or typing the page number.

### 🎨 **Personalized Avatar**
Create your unique reading avatar with custom colors and photos. It syncs to your iOS widget too!

### 📱 **Share Everywhere**
Generate beautiful share cards for:
- Instagram Stories & Feed
- Snapchat
- X (Twitter)
- TikTok
- WhatsApp
- Threads
- ...and more!

### 👥 **Reading Friends**
Connect with friends via phone number and see what they're reading. Discover new books through people you trust.

---

## 🚀 Getting Started

### For Users (Non-Technical)

1. **Visit** [BookShelfie](https://bookshelfie.vercel.app)
2. **Sign up** with your email
3. **Complete your profile** — add your name, phone number, and create a password
4. **Customize your avatar** — pick a color and optionally add a photo
5. **Search for a book** you're reading
6. **Start tracking!** Update your progress as you read

That's it! No downloads required. Works on any device with a browser.

---

## 💡 How It Works

```
1. Search → Find any book by title, author, or ISBN
                ↓
2. Add → We auto-detect the page count
                ↓
3. Track → Update your progress with a slider
                ↓
4. Share → Generate beautiful cards for social media
                ↓
5. Connect → See what your friends are reading
```

---

## 🎯 Perfect For...

- 📚 **Book lovers** who want a simple way to track reading
- 📱 **iOS users** who love home screen widgets (coming soon!)
- 📸 **Bookstagrammers** who want to share progress beautifully
- 👫 **Book clubs** who want to see what friends are reading
- 🎓 **Students** tracking textbooks and assigned reading
- ⏱️ **Busy readers** who want quick, glanceable progress

---

## 🛠️ For Developers

### Tech Stack
- **Frontend:** Next.js 14 (App Router), React, TypeScript
- **Styling:** Tailwind CSS, Shadcn/ui components
- **Backend:** Supabase (Auth, Database, Edge Functions)
- **Payments:** Stripe (for Premium features)
- **Image Generation:** html2canvas

### Local Development

```bash
# Clone the repository
git clone https://github.com/clefspear/bookshelfie.git
cd bookshelfie

# Install dependencies
npm install

# Set up environment variables
# Copy .env.example to .env.local and fill in your Supabase credentials

# Run the development server
npm run dev

# Open http://localhost:3000
```

### Environment Variables Needed
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_service_key
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

---

## 🗺️ Roadmap

- [x] Book search with automatic page detection
- [x] Progress tracking with beautiful UI
- [x] Social sharing to multiple platforms
- [x] Friend connections via phone number
- [x] Avatar customization
- [ ] iOS Widget (in development)
- [ ] Reading statistics and insights
- [ ] Book recommendations
- [ ] Reading challenges
- [ ] Dark mode

---

## 💰 Pricing

| Free | Premium ($4.99/mo) |
|------|-------------------|
| Track up to 5 books | Unlimited books |
| Basic share cards | Custom share themes |
| Friend connections | Advanced statistics |
| | Priority support |

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Created By

<div align="center">
  
  **Peter Azmy**
  
  [![GitHub](https://img.shields.io/badge/GitHub-clefspear-181717?style=for-the-badge&logo=github)](https://github.com/clefspear)
  
  *Built with ❤️ for book lovers everywhere*

</div>

---

<div align="center">
  <p>If you enjoy BookShelfie, please ⭐ this repository!</p>
  
  <img src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=80" alt="Happy Reading" width="200" style="border-radius: 12px;"/>
  
  **Happy Reading! 📖**
</div>
