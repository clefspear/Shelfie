# BookShelfie iOS App with WidgetKit

A beautiful native iOS companion app for BookShelfie with stunning glass effect widgets that integrate seamlessly with your web app.

## ✨ Features

### 🎨 Glass Effect Design

- **Ultra-thin Material**: Modern glassmorphism with .ultraThinMaterial
- **Gradient Accents**: Coral (#FF6B6B) to (#FF8787) gradients throughout
- **Subtle Shadows**: Layered shadows for depth and elegance
- **Transparent Background**: Adapts beautifully to any wallpaper

### 📱 Widget Sizes

- **Small**: Single book with cover, title, and glass progress bar
- **Medium**: 2-3 books in grid layout with individual progress
- **Large**: User's books + friends' reading with glass divider

### 🔐 Secure Authentication

- **Keychain Storage**: Secure user ID storage in iOS Keychain
- **App Groups**: Shared storage between main app and widget
- **Deep Linking**: Opens web app for full functionality

### 🔄 Real-time Sync

- **API Integration**: Fetches from Shelfie backend every 30 minutes
- **Progress Tracking**: Visual progress bars with coral gradients
- **Friends Activity**: See what friends are currently reading

## 🏗️ Project Structure

```
BookShelfie/
├── BookShelfie.xcodeproj/          # Xcode project
├── BookShelfie/
│   ├── BookShelfieApp/            # Main app source
│   │   ├── BookShelfieApp.swift    # App entry point
│   │   ├── AuthManager.swift        # Authentication + Keychain
│   │   ├── ContentView.swift        # Main navigation
│   │   ├── WidgetSetupView.swift   # Widget setup instructions
│   │   ├── Color+Hex.swift        # Coral color extensions
│   │   └── Assets.xcassets/       # App icons + colors
│   └── ShelfieWidgetExtension/     # Widget extension
│       ├── ShelfieWidget.swift      # Widget entry point
│       └── WidgetViews.swift        # UI components
└── BookShelfie.entitlements        # App Groups + Keychain
```

## 🚀 Getting Started

### 1. Open in Xcode

```bash
open ios/BookShelfie/BookShelfie.xcodeproj
```

### 2. Add KeychainAccess Package

1. **File** → **Add Package Dependencies**
2. URL: `https://github.com/kishikawakatsumi/KeychainAccess.git`
3. Add to **both** targets
4. Select **KeychainAccess** product

### 3. Verify Capabilities

- **BookShelfie** target: App Groups + Keychain Sharing enabled
- **ShelfieWidgetExtension** target: App Groups enabled
- **Group ID**: `group.com.bookshelfie.shelfie`

### 4. Build and Run

1. Select **BookShelfie** scheme
2. Choose simulator or device
3. Press **⌘+R** to build and run

## 🔧 Configuration

### Bundle Identifiers

- **Main App**: `com.bookshelfie.shelfie`
- **Widget**: `com.bookshelfie.shelfie.widget`
- **App Group**: `group.com.bookshelfie.shelfie`

### API Integration

The widget connects to: `https://bookshelfie.vercel.app/api/widget-data`
Requires `user_id` parameter from shared UserDefaults.

### Deployment Target

- **iOS 17.0+**: Required for WidgetKit and modern glass effects
- **Swift 5.0**: Language version
- **iPhone + iPad**: Universal app

## 🎯 Widget Features

### Small Widget

```swift
// Shows single book with:
- Async book cover with glass effect
- Truncated title (2 lines max)
- Glass progress bar with coral gradient
- Progress percentage text
```

### Medium Widget

```swift
// Shows 2-3 books in grid:
- Async covers with rounded corners
- Individual progress bars
- Responsive layout
- Glass background effect
```

### Large Widget

```swift
// Two sections with glass divider:
- Top: User's books (2x2 grid)
- Bottom: Friends' reading (3 items)
- Glass divider with gradient
- Avatar circles with emojis/initials
```

## 🎨 Design System

### Colors

- **Primary Coral**: #FF6B6B (main accent)
- **Light Coral**: #FF8787 (gradient end)
- **Background**: Cream gradient #FFF9F5 → #FFF5F0
- **Glass**: .ultraThinMaterial with white gradients

### Typography

- **SF Pro**: System font family
- **Weights**: Medium, Semibold, Bold
- **Sizes**: Caption, Caption2, Subheadline, Headline

### Components

- **Progress Bars**: 4px height with gradient fills
- **Buttons**: Rounded 12px with shadow effects
- **Cards**: Glass background with 16px radius
- **Avatars**: Circles with gradient fills

## 📲 Testing

### Simulator Testing

1. Add test User ID in auth screen
2. Verify main app navigation
3. Add widget to Home Screen
4. Test all three widget sizes
5. Verify glass effects and progress updates

### Device Testing

- Widgets work only on physical devices
- Test on iPhone and iPad
- Verify with different wallpapers
- Check real-time updates

## 🔨 Development

### Adding New Features

1. Update `WidgetData` models in `ShelfieWidget.swift`
2. Modify views in `WidgetViews.swift`
3. Test in simulator first
4. Deploy to device for widget testing

### API Changes

- Backend endpoint: `/api/widget-data`
- Response format matches `WidgetData` struct
- Real-time updates every 30 minutes

## 🚀 Deployment

### App Store

1. **Product** → **Archive**
2. **Window** → **Organizer**
3. **Distribute App**
4. Upload both main app and widget extension

### Requirements

- **Xcode 15.0+**: For modern project structure
- **iOS 17.0+**: For WidgetKit features
- **KeychainAccess**: External dependency
- **App Groups**: For widget data sharing

## 🎉 Success Metrics

### Widget Engagement

- Track widget installation rates
- Monitor API call frequency
- User retention through widget usage
- Progress update success rates

### Performance

- Fast image loading with AsyncImage
- Efficient API calls with 30min intervals
- Smooth animations with spring effects
- Memory efficient glass rendering

## 🐛 Troubleshooting

### Common Issues

1. **Widget not showing**: Check App Groups configuration
2. **No data**: Verify user ID in shared UserDefaults
3. **Build errors**: Ensure KeychainAccess is linked
4. **Crashes**: Check API response handling

### Debug Tips

- Use Xcode Console for widget logs
- Test API endpoint in browser first
- Verify entitlements in build settings
- Check bundle identifiers match

## 📞 Support

For issues with the iOS app or widget:

1. Check Xcode build logs
2. Verify backend API endpoint
3. Test with fresh simulator
4. Check entitlements configuration

The glass widget provides a stunning, modern experience that beautifully complements the BookShelfie web app! 🎨✨
