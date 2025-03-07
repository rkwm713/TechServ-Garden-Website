# TechServ Community Garden - Firebase Integration

This document provides guidance on setting up and using the Firebase integration for the TechServ Community Garden website.

## Overview

The Firebase integration provides the following features:

- **User Authentication**: Email/password and Google Sign-in
- **Task Management**: Create, update, delete, and assign tasks
- **Real-time Updates**: Live updates for tasks, comments, and notifications
- **Comments & Social Features**: Add comments, likes, and shares
- **Notifications**: Receive notifications for task assignments, updates, and mentions
- **Security Rules**: Comprehensive security rules for database and storage
- **Cloud Functions**: Background processing for notifications, task assignments, etc.

## Setup Instructions

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter "TechServ Garden" as the project name
4. Follow the setup wizard, enabling Google Analytics if desired

### 2. Enable Firebase Services

Enable the following services in your Firebase project:

- **Authentication**: Go to Build > Authentication > Get started
  - Enable Email/Password and Google sign-in methods
- **Firestore Database**: Go to Build > Firestore Database > Create database
  - Start in production mode
  - Choose a location close to your users
- **Storage**: Go to Build > Storage > Get started
  - Start in production mode
  - Choose the same location as your Firestore database
- **Functions**: Go to Build > Functions > Get started
  - Choose a plan that meets your needs (Blaze plan required for external API access)

### 3. Configure Web App

1. In the Firebase console, click the gear icon > Project settings
2. Under "Your apps", click the web icon (</>) to add a web app
3. Register app with nickname "TechServ Garden Web"
4. Copy the Firebase configuration object
5. Replace the placeholder config in `src/firebase/config.js` with your actual config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

### 4. Deploy Firebase Configuration

Deploy Firebase security rules and indexes:

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project (select the services you enabled)
firebase init

# Deploy Firestore rules and indexes
firebase deploy --only firestore

# Deploy Storage rules
firebase deploy --only storage

# Deploy Functions
firebase deploy --only functions
```

## Key Components

### Firebase Organization

The Firebase integration is organized as follows:

1. **Configuration** (`src/firebase/config.js`): Firebase initialization and configuration
2. **Authentication** (`src/firebase/auth.js`): User authentication services
3. **Tasks** (`src/firebase/tasks.js`): Task management services
4. **Social** (`src/firebase/social.js`): Comments, likes, shares, and notifications
5. **UI Services** (`src/firebase/ui-services/`): UI-specific services like tasks-ui.js
6. **Cloud Functions** (`functions/`): Backend processing

### Authentication

The authentication service provides:

- User registration with email/password
- Sign in with email/password or Google
- User profile management
- Role-based permissions (user, moderator, admin)

Example usage:
```javascript
import { signInWithEmail, getCurrentUserData } from './firebase/auth.js';

// Sign in user
const userData = await signInWithEmail('user@example.com', 'password');

// Get current user
const user = await getCurrentUserData();
if (user) {
  console.log(`Hello, ${user.displayName}!`);
}
```

### Task Management

The task management service handles:

- Creating, updating, and deleting tasks
- Assigning tasks to users
- Filtering and querying tasks
- Real-time task updates

Example usage:
```javascript
import { createTask, getTasks, subscribeToTasks } from './firebase/tasks.js';

// Create a task
const taskId = await createTask({
  title: 'Water the garden',
  description: 'The tomatoes need water',
  priority: 'high',
  status: 'todo'
});

// Get tasks
const { tasks } = await getTasks({ isPersonal: false });

// Subscribe to task updates
const unsubscribe = subscribeToTasks({}, (tasks) => {
  console.log('Tasks updated:', tasks);
});
```

### Social Features

The social service manages:

- Comments on tasks and other content
- Likes and shares
- Notifications
- Activity feed

Example usage:
```javascript
import { addComment, likeContent, getNotifications } from './firebase/social.js';

// Add a comment
const commentId = await addComment({
  contentId: taskId,
  contentType: 'task',
  text: 'I completed this yesterday!'
});

// Like a task
await likeContent(taskId, 'task');

// Get notifications
const { notifications } = await getNotifications({ unreadOnly: true });
```

### Cloud Functions

Cloud Functions automatically handle:

- Task assignment notifications
- Comment notifications and mentions
- Task status update notifications
- User role management
- Cleanup of old notifications

## Development Workflow

### Local Development

For local development, Firebase Emulators are configured to run locally:

1. Start the emulators:
   ```bash
   firebase emulators:start
   ```

2. The Firebase config in `src/firebase/config.js` automatically connects to emulators when in development mode.

3. Access the Emulator UI at http://localhost:4000 to view and manage your local Firebase data.

### Deployment

To deploy your changes to production:

1. Update Firebase configuration as needed.

2. Deploy updated rules, indexes, or functions:
   ```bash
   # Deploy everything
   firebase deploy

   # Or deploy specific services
   firebase deploy --only firestore,functions
   ```

3. Deploy your web application with the rest of your site.

## Security Considerations

- The implemented security rules enforce proper access control for all resources.
- User roles (user, moderator, admin) control administrative capabilities.
- Personal tasks are only visible to their creators.
- Proper authentication checks are implemented throughout the application.

## Troubleshooting

Common issues and solutions:

- **Authentication issues**: Check Firebase Authentication console for user status.
- **Security rule denials**: Check Firebase logs for specific security rule failures.
- **Function errors**: Review Functions logs in the Firebase console.
- **Connection issues**: Ensure your API keys and configuration are correct.

For more extensive debugging, enable Firebase debugging:
```javascript
firebase.firestore.setLogLevel('debug');
