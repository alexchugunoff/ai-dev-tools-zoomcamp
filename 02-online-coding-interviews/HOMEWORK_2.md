# Question 1: Initial Implementation
## Ask AI to implement both frontend and backend - in one prompt.

Note: you can also follow the same path as in the videos and make it in 3 steps:

Frontend
OpenAPI specs
Backend
## What's the initial prompt you gave to AI to start the implementation?
create platform for online coding interviews. the app should be able to do the following: create a link and share it with candidates, allow everyone who connects to edit code in the code panel, show real-time updates to all connected users, support syntax highlighting for multiple languages, execute code safely in the browser.
you have to do next steps: implement frontend, analyse the content of the client and create an OpenAPI specs based on what it needs, implement backend based on these specs. use this technologies: frontend - react + vite, backend - express.js. put the whole project in existing folder '02-online-coding-interviews', use separate folder for frontend, backend. follow the guidelines in AGENTS.md

# Question 2: Integration Tests
Maybe at this point your application will already function. Maybe not. But it's always a good idea to cover it with tests.

We usually do it even before trying to run the application because it helps to resurface all the problems with implementation.

Ask AI to write integration tests that check that the interaction between client and server works.

Also it's a good idea to ask it to start creating a README.md file with all the commands for running and testing your application.

## What's the terminal command you use for executing tests?
npm test --silent

# Question 3: Running Both Client and Server
Now let's make it possible to run both client and server at the same time. Use concurrently for that.

## What's the command you have in package.json for npm dev for running both?
"concurrently \"npm run dev --prefix backend\" \"npm run dev --prefix frontend -- --host 0.0.0.0\""

# Question 4: Syntax Highlighting
Let's now add support for syntax highlighting for JavaScript and Python.

## Which library did AI use for it?
CodeMirror

# Question 5: Code Execution
Now let's add code execution.

For security reasons, we don't want to execute code directly on the server. Instead, let's use WASM to execute the code only in the browser.

## Which library did AI use for compiling Python to WASM?

# Question 6: Containerization
Now let's containerize our application. Ask AI to help you create a Dockerfile for the application. Put both backend and frontend in one container.

## What's the base image you used for your Dockerfile?

# Question 7: Deployment
Now let's deploy it. Choose a service to deploy your application.

## Which service did you use for deployment?

# Homework URL