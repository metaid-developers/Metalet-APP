# Metalet (React Native)

A React Native wallet application for BTC/MVC chains. This repository contains the mobile app source used by the Metalet project.

## Overview

This project is a cross-platform (iOS and Android) React Native application implementing a cryptocurrency wallet. It handles wallet creation/import, network selection, and basic BTC/MVC operations. The codebase uses Expo and standard RN libraries.

## Prerequisites

- Node.js (LTS recommended)
- Yarn or npm
- Expo CLI (if using the Expo managed workflow)
- Xcode (for iOS builds on macOS)
- Android Studio (for Android builds)

## Quick start

1. Install dependencies:

	```bash
	yarn install
	# or
	npm install
	```

2. Start the Metro bundler and run on a simulator or device:

	```bash
	expo start
	```

3. For iOS or Android production builds use Xcode/Android Studio or EAS if configured.

## Useful scripts

- `yarn start` / `npm run start` - Start Metro/Expo dev server
- `yarn ios` / `npm run ios` - Run on iOS simulator (if configured)
- `yarn android` / `npm run android` - Run on Android emulator
- `eas build` - Build with EAS (if configured)

## Project structure (selected)

- `src/` - Application source code
- `assets/` - Images and static assets
- `credentials/` & `fastlane/` - iOS/Android signing & automation
- `App.js`, `index.js` - App entry points

## Contributing

Contributions are welcome. Please open issues or pull requests with a clear description of changes and testing steps.

## License

Specify the project license here (e.g., MIT) or keep a proprietary notice if the project is private.

---

If you want a more detailed README (badges, environment variables, testing, CI), tell me which sections to expand.