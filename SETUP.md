# Setup Guide for HomeSchool Tracker

This guide will help you set up the HomeSchool Tracker application on your system.

## Prerequisites

### 1. Install Node.js

The HomeSchool Tracker requires Node.js version 18 or higher. You can download it from:

**Windows:**
- Visit [nodejs.org](https://nodejs.org/)
- Download the LTS version (recommended)
- Run the installer and follow the setup wizard

**macOS:**
- Visit [nodejs.org](https://nodejs.org/)
- Download the LTS version
- Run the installer package

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Linux (CentOS/RHEL/Fedora):**
```bash
curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
sudo yum install -y nodejs
```

### 2. Verify Installation

After installation, verify that Node.js and npm are available:

```bash
node --version
npm --version
```

You should see version numbers displayed for both commands.

## Project Setup

### 1. Install Dependencies

Navigate to the project directory and install dependencies:

```bash
cd "path/to/homeschool-tracker"
npm install
```

### 2. Generate Icons (Optional)

The project includes placeholder SVG icons. For production use, you may want to replace them with proper PNG icons:

```bash
npm run generate-icons
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Alternative Setup Methods

### Using Yarn (Alternative to npm)

If you prefer using Yarn instead of npm:

1. Install Yarn: `npm install -g yarn`
2. Install dependencies: `yarn install`
3. Start development: `yarn dev`

### Using Docker

If you have Docker installed:

```bash
# Build the Docker image
docker build -t homeschool-tracker .

# Run the container
docker run -p 3000:3000 homeschool-tracker
```

## Production Build

To create a production build:

```bash
npm run build
npm start
```

## Troubleshooting

### Common Issues

1. **"npm is not recognized"**
   - Node.js is not installed or not in your PATH
   - Reinstall Node.js and restart your terminal

2. **Port 3000 already in use**
   - Use a different port: `npm run dev -- -p 3001`

3. **Permission errors on Linux/macOS**
   - Use `sudo` for global installations
   - Or configure npm to use a different directory

4. **Build errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Getting Help

If you encounter issues:

1. Check the [Node.js documentation](https://nodejs.org/docs/)
2. Review the project's [README.md](README.md)
3. Check the console for error messages
4. Ensure you're using Node.js version 18 or higher

## Next Steps

Once the application is running:

1. Open [http://localhost:3000](http://localhost:3000) in your browser
2. The app will initialize with default children and subjects
3. Go to Settings to customize children and subjects
4. Start tracking your homeschool progress!

## Deployment

For deployment instructions, see the [README.md](README.md) file.
