
# Real Estate Admin Dashboard

A modern, clean, and professional admin dashboard to manage real estate listings. This application is built with React and TypeScript and uses Google Firestore for a real-time database and Firebase Storage for image uploads.

![Real Estate Dashboard Screenshot](https://storage.googleapis.com/vighnesh-public-stuff/real-estate-dashboard-screenshot.png)

## Features

- **Full CRUD Functionality:** Create, Read, Update, and Delete property listings.
- **Real-Time Database:** Utilizes Firestore's `onSnapshot` listener to ensure the UI is always synchronized with the database in real-time.
- **Image Uploads:** Seamlessly upload property images to Firebase Storage.
- **Modern UI/UX:** Clean, responsive card-based layout built with Tailwind CSS.
- **Component-Based Architecture:** Organized into reusable React components for maintainability.
- **State Management:** Simple and effective state management using React Hooks (`useState`, `useEffect`).
- **User-Friendly Modals:** Non-intrusive modals for creating/editing listings and confirming deletions.
- **Loading States:** Skeleton loaders provide a better user experience while data is being fetched.

## Tech Stack

- **Frontend:** React (v19), TypeScript
- **Database:** Google Firestore (v12)
- **File Storage:** Firebase Storage (v12)
- **Styling:** Tailwind CSS (via CDN)
- **Module Loading:** ES Modules via `esm.sh` (no build step required)

## Getting Started

This project is set up to run directly in the browser without any build tools like Vite or Create React App.

### Prerequisites

- A modern web browser (like Chrome, Firefox, or Edge).
- A Google Firebase account.

### Setup Instructions

#### 1. Clone the Repository

```bash
git clone https://github.com/your-username/real-estate-dashboard.git
cd real-estate-dashboard
```

#### 2. Configure Firebase

This is the most important step. **Your API keys are kept secure and are not committed to the repository.**

1.  Navigate to the `services/` directory.
2.  Rename the file `firebase.ts.example` to `firebase.ts`.
3.  Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project (or use an existing one).
4.  In your project, go to **Build > Firestore Database** and create a new database. Start in **test mode** for now.
5.  Go to **Build > Storage** and enable it.
6.  Go to your Project Settings (click the gear icon) > General tab. Scroll down to "Your apps" and create a new **Web app**.
7.  Firebase will provide you with a `firebaseConfig` object. Copy this object.
8.  Open your new `services/firebase.ts` file and replace the placeholder `firebaseConfig` object with the one you just copied from the Firebase console.

#### 3. Update Firebase Storage Rules

By default, Firebase Storage does not allow uploads from unauthenticated users. For this demo application, you need to update the rules to allow public access.

1.  In the Firebase Console, navigate to **Storage > Rules**.
2.  Replace the existing rules with the following:
    ```
    rules_version = '2';
    service firebase.storage {
      match /b/{bucket}/o {
        // Allow read and write access to everyone.
        // WARNING: This is for development only. Secure your rules for production.
        match /{allPaths=**} {
          allow read, write: if true;
        }
      }
    }
    ```
3.  Click **Publish**.

### Running the Application

You can simply open the `index.html` file in your browser. However, for the best experience (to avoid potential CORS issues with local file access), it's recommended to use a lightweight local server.

If you are using Visual Studio Code, you can use the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension:
1.  Install the "Live Server" extension.
2.  Right-click on the `index.html` file in the VS Code explorer.
3.  Select "Open with Live Server".

Your Real Estate Admin Dashboard should now be running in your browser and fully connected to your Firebase backend.

## File Structure

```
.
├── .gitignore                # Tells Git which files to ignore
├── components/               # Reusable React components
│   ├── ...
├── services/
│   ├── firebase.ts           # Your local Firebase config (Not committed)
│   └── firebase.ts.example   # Template for Firebase config (Safe to commit)
├── App.tsx
├── index.html
├── index.tsx
├── metadata.json
├── README.md
└── types.ts
```
