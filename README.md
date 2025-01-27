
# Pro In Flow - Developer Productivity App

Welcome to the Developer Productivity App! This app is designed to help developers streamline their workflow with intelligent agents for code writing, code review, unit test generation, bug detection, and additional productivity features like task management, Pomodoro timer, and AI agents as copilot's for most tasks.

This README will guide you through setting up both the backend and frontend to get the app running on your local machine.

## Features

### Backend

-   **.NET Core API**: Handles API requests, integrates with the Agent.ai platform to create intelligent agents, and manages task data in an SQLite database.

### Frontend

-   **HTML & JavaScript (Bootstrap)**: A simple, responsive frontend that allows users to interact with the agents and use the app’s productivity features.

### Key Features

-   **Task Management**: Manage and organize your tasks.
-   **Pomodoro Timer**: Focus and take breaks using the Pomodoro technique.
-   **Intelligent Agents**: Automate tasks like code writing, code review, unit test generation, and bug detection.

----------

## Getting Started

### Prerequisites

Before you start, make sure you have the following installed:

1.  **.NET 6.0 (or newer)**: Required to run the backend API.
2.  **SQLite**: Lightweight database for storing task data.

### Backend Setup

1.  **Clone the Repository**
    
    Start by cloning the repository to your local machine:
    
    bash
    
    CopyEdit
    
    `git clone https://github.com/shaijut/ProInFLow.git'
    cd ProInFLow` 
    
2.  **Navigate to the Backend Folder**
    
    Change to the backend directory (assuming it’s in the `Backend` folder):
    
    bash
    
    CopyEdit
    
    `cd Backend` 
    
3.  **Restore Dependencies**
    
    Restore the necessary .NET dependencies by running:
    
    bash
    
    CopyEdit
    
    `dotnet restore` 
    
4.  **Run the Backend**
    
    To run the backend API, use the following command:
    
    bash
    
    CopyEdit
    
    `dotnet run` 
    
    The backend API will now be running on `http://localhost:5000`. Based on what it shows in cmd.


----------

### Frontend Setup

1.  **Navigate to the Frontend Folder**
    
    Change to the frontend directory (assuming it’s in the `Frontend` folder):
    
    bash
    
    CopyEdit
    
    `cd Frontend` 
    
2.  **Open the `index.html` File**
    
    The frontend is a simple HTML file that doesn't require a build step. To view it:
    
    -   Open the `index.html` file in any browser of your choice.
    -   Ensure that your backend API is running so that the frontend can communicate with it.
    
    You can open `index.html` by either:
    
    -   Double-clicking the file to open it in your default browser.
    -   Right-clicking and selecting "Open with" your preferred browser.
    
    The frontend will make API requests to interact with the backend.
    

----------

## Running the App

1.  **Start the Backend**: Ensure that your .NET Core API is running by following the backend setup instructions.
2.  **Start the Frontend**: Open the `index.html` file in your browser to start interacting with the app.

You’re now ready to use the Developer Productivity App! The frontend will allow you to interact with the agents and track your tasks, while the backend will handle agent requests and task data management.

----------

## App Features Breakdown

-   **Task Management**: Organize your tasks for the day, set goals, and track progress.
-   **Pomodoro Timer**: Work in intervals of focused time, followed by short breaks, to boost productivity.
-   **Code Writing Agent**: Generate minimal but functional code based on requirement summaries.
-   **Code Review Agent**: Review code and suggest improvements based on industry best practices.
-   **Unit Test Generation Agent**: Generate unit test cases for your code with the selected testing framework.
-   **Bug Detection Agent**: Scan your code for bugs and security risks, suggesting improvements.

----------

## Notes

-   **API Communication**: The frontend interacts with the backend API to fetch agent responses and task management data.
-   **Local Development**: This app is designed for local development and testing. You can customize the backend API and frontend to suit your needs.
-   **Agent.ai Platform**: The intelligent agents rely on the Agent.ai platform to generate responses. Make sure your backend can communicate with the API.

----------

## Contributing

We welcome contributions! If you have any suggestions or improvements for the app, feel free to fork the repository, create a branch, and submit a pull request.

1.  Fork the repository.
2.  Create a new branch for your changes.
3.  Make your changes and test them locally.
4.  Submit a pull request with a description of the changes.

----------

## License

This project is open-source and available under the MIT License.
