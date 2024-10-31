# infinion_cohort

# Frontend Test Challenge

**Duration:** 1 week

## Introduction

Welcome to the **infinion_cohort** frontend repository! This project is part of a full-stack application, with the backend already completed and documented. You will focus on developing the frontend using **Vue 3** with **Vite**. The project will connect to a set of predefined API endpoints as documented in Swagger.

## Project Overview

This frontend application interacts with a REST API that provides data for our application. Your tasks include creating responsive and interactive components and pages based on design specifications and integrating them with the backend endpoints. Please read through the instructions carefully before beginning the challenge.

## Objective

Your task is to create a frontend interface based on the provided Figma design and integrate it with the backend API, following the requirements outlined below.

## Design and API Documentation

- **Figma Design:** [Link to Figma Design](https://www.figma.com/file/njiVc0y2UTy1XDZE9UKNX3/Untitled?type=design&node-id=0%3A1&mode=design&t=qE9KVrLQEtieJiuD-1)

- **Backend API Documentation:** [Link to Swagger Documentation](https://infinion-test-int-test.azurewebsites.net/index.html)

## Requirements

1. **Design the Overview Interface**

   - Implement the overview interface as per the provided design.

2. **Create a New Campaign**

   - Users should be able to create a new campaign by filling in the necessary details.
   - Upon submission, the campaign should be added to the list of campaigns via the backend API.

3. **List of All Campaigns**

   - Retrieve and populate the list of all campaigns, including all details (as given in the design).

4. **View, Edit, and Delete a Campaign**
   - Users should be able to view a campaign's details by clicking on it.
   - Provide functionality to edit the details of a campaign and save the changes via the backend API.
   - Allow users to delete a campaign, with confirmation.


## Contribution Guidelines

1. **Branching**: Create a new branch for each feature or bug fix (e.g., `feature/navbar`, `fix/button-style`).

2. **Pull Requests**: When a feature is complete, open a pull request to the main branch for review.

3. **Code Quality**: Ensure code is clean, well-commented, and follows the project’s coding standards.


## Submission Guidelines

- Host the application and share the link along with the repository link [here](https://forms.gle/uiYGfhRqBa93pYZK7)

- Implement the frontend interface and functionality according to the requirements.

## Evaluation Criteria

Your submission will be evaluated based on the following criteria:

- Adherence to the provided design and requirements.
- Functionality: ability to create, view, edit, and delete campaigns.
- Code quality, structure, and organization.
- Integration with the backend API.

## Additional Notes

- **Technology:** Please ensure this is built using Vue.

- **Questions:** If you encounter any ambiguities or have questions about the requirements, don't hesitate to reach out for clarification.

- **Creativity:** Feel free to be creative in your implementations.

- **Good luck, and happy coding!**

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Project Setup

```sh
git clone https://github.com/samthatcode/infinion_cohort.git
cd infinion_cohort
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

## Customize Configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).
