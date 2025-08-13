# HomeSchool Tracker

A production-ready web application for tracking homeschool progress with attendance, subject completion, and comprehensive reporting. Built with Next.js 14, TypeScript, and designed to work fully offline with local data storage.

## Features

### 🎯 Core Functionality
- **Daily Dashboard**: Track today's progress for multiple children
- **Subject Management**: Customizable subjects with completion tracking
- **Attendance Tracking**: Automatic attendance calculation based on subject completion
- **Comprehensive Reports**: View attendance summaries and subject progress
- **PDF Export**: Generate professional reports for record keeping
- **Offline Support**: Works completely offline with IndexedDB storage

### 📱 Progressive Web App (PWA)
- Installable on desktop and mobile devices
- Offline functionality with service worker caching
- Native app-like experience
- Background sync capabilities

### 🎨 Modern UI/UX
- Clean, responsive design with Tailwind CSS
- Intuitive navigation and user interface
- Real-time progress indicators
- Mobile-first responsive design

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Database**: IndexedDB (via idb package)
- **PDF Generation**: jsPDF + jsPDF-AutoTable
- **Date Handling**: Day.js
- **Icons**: Lucide React

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd homeschool-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## Project Structure

```
homeschool-tracker/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Dashboard page
│   ├── reports/           # Reports page
│   └── settings/          # Settings page
├── components/            # Reusable components
│   ├── ChildCard.tsx      # Individual child display
│   ├── DateRangePicker.tsx # Date selection component
│   ├── Navigation.tsx     # App navigation
│   └── PdfExportButton.tsx # PDF export controls
├── lib/                   # Core utilities
│   ├── db.ts             # IndexedDB wrapper
│   ├── store.ts          # Zustand state management
│   ├── types.ts          # TypeScript definitions
│   └── pdf-export.ts     # PDF generation utilities
├── public/               # Static assets
│   ├── manifest.webmanifest # PWA manifest
│   ├── sw.js            # Service worker
│   └── icons/           # App icons
└── package.json          # Dependencies and scripts
```

## Data Model

### Children
```typescript
interface Child {
  id: string;
  name: string;
  order: number;
}
```

### Subjects
```typescript
interface Subject {
  id: string;
  name: string;
  order: number;
}
```

### Records
```typescript
interface Record {
  date: string;
  childId: string;
  subjectId: string;
  completed: boolean;
}
```

### School Year
```typescript
interface SchoolYear {
  startDate: string;
  endDate: string;
}
```

## Usage Guide

### Getting Started
1. **First Launch**: The app will initialize with default children (Child A, B, C) and subjects (Math, Reading, Writing, Science, History, Bible, Elective, PE)
2. **Customize**: Go to Settings to rename children, add/remove subjects, and set school year dates
3. **Daily Tracking**: Use the Dashboard to mark subjects as completed for each child
4. **Reports**: View attendance summaries and export PDF reports from the Reports page

### Dashboard
- View today's date and current time
- See all children with their progress for today
- Click on subjects to toggle completion status
- View real-time progress indicators and attendance status

### Reports
- Select date ranges using preset options or custom dates
- View attendance summaries and subject breakdowns
- Export three types of PDF reports:
  - **Attendance Summary**: Overview of attendance days
  - **Subject Summary**: Detailed subject completion data
  - **Detailed Report**: Comprehensive individual child reports

### Settings
- **Children Management**: Add, edit, or remove children
- **Subject Management**: Customize subjects for your curriculum
- **School Year**: Set academic year start and end dates
- **Data Management**: Clear all data with confirmation

## PWA Installation

### Desktop (Chrome/Edge)
1. Open the app in your browser
2. Click the install icon in the address bar
3. Follow the prompts to install

### Mobile (iOS Safari)
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"

### Mobile (Android Chrome)
1. Open the app in Chrome
2. Tap the menu (three dots)
3. Select "Add to Home screen"

## Deployment

### Netlify Deployment
1. **Connect Repository**: Link your Git repository to Netlify
2. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. **Environment Variables**: No environment variables required
4. **Deploy**: Netlify will automatically build and deploy your app

### Vercel Deployment
1. **Import Project**: Connect your Git repository to Vercel
2. **Framework Preset**: Select Next.js
3. **Deploy**: Vercel will automatically detect and deploy your app

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- AWS Amplify
- Google Cloud Platform
- Azure Static Web Apps
- DigitalOcean App Platform

## Browser Support

- **Chrome**: 88+
- **Firefox**: 85+
- **Safari**: 14+
- **Edge**: 88+

## Performance

The app is optimized for:
- **Lighthouse Performance**: 90+ score
- **Accessibility**: WCAG 2.1 AA compliant
- **PWA**: Full PWA functionality
- **Offline**: Complete offline operation
- **Mobile**: Responsive design for all devices

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in this README
- Review the code comments for implementation details

## Roadmap

- [ ] Data import/export functionality
- [ ] Multiple school years support
- [ ] Advanced analytics and charts
- [ ] Cloud sync (optional)
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Custom subject categories
- [ ] Attendance calendar view

---

Built with ❤️ for the homeschooling community
