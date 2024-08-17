<div align="center">
    <img src="https://github.com/user-attachments/assets/d1556d01-1c69-49e4-b43c-5271186b5920" width="150"/>
</div>

# Tamely

**Tamely** is a web application for managing and tracking tasks, integrated with Firebase for authentication and data storage. The application allows users to track tasks, view completed tasks, and manage tasks through a user-friendly interface.

<div align="center">
<p>If you like my work, consider buying me a coffee! ☕️</p>
</div>


<div align="center">
<a href="https://www.buymeacoffee.com/bogusdeck" target="_blank">
    <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me a Coffee" width="150" />
</a>
</div>

## Features

- **Authentication**: Secure sign-in with Firebase Authentication.
- **Task Management**: Create, view, update, and delete tasks.
- **Task Tracking**: Track task progress and completion with dynamic timers.
- **Completed Tasks**: View tasks that are marked as completed.
- **Dropped Tasks**: View tasks that are marked as dropped.
- **Dashboard**: A central place to view ongoing tasks, their statuses, and relevant statistics.
- **Project Log**: Maintain a detailed log of all your projects.

## Technologies Used

- **Frontend**: React, Next.js, Tailwind CSS
- **Backend**: Firebase Firestore, Firebase Authentication
- **Deployment**: Vercel

## Getting Started

To get a local copy of Tamely up and running, follow these steps:

### Prerequisites

- Node.js (>=14.x)
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/bogusdeck/tamely.git
    cd tamely
    ```

2. **Install dependencies**

    ```bash
    npm install
    # or
    yarn install
    ```

3. **Set up environment variables**

    Create a `.env.local` file in the root directory of the project and add your Firebase configuration:

    ```bash
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    ```

4. **Start the development server**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

    Navigate to `http://localhost:3000` to view the application.

## Deployment

To deploy the project to Vercel:

1. **Push your code to GitHub**.

2. **Import the repository into Vercel**.

3. **Configure environment variables** in the Vercel dashboard.

4. **Deploy** the project.

## Usage

- **Sign In**: Use Firebase Authentication to sign in or sign up.
- **Dashboard**: View and manage ongoing tasks.
- **Complete Tasks**: View tasks marked as completed.
- **Dropped Tasks**: View tasks marked as dropped.

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes.
4. Push to your forked repository.
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or feedback, you can reach out via [tanishvashisth@gmail.com] or open an issue on the repository.
