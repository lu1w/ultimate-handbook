# Huddle API v1.0

A brief description of what this project does and who it's for.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/cissa-unimelb/huddle-api.git
   ```
2. Navigate to the project directory:
   ```bash
   cd huddle-api
   ```
3. Install the dependencies:
   ```bash
   yarn install
   ```
4. Prepare the husky and commitizen packages:

   ```bash
   yarn prepare
   ```

5. This repository also uses Git Secrets locally (to prevent accidentally committing any secrets or passwords). Install Git Secrets following the instructions [provided here](https://github.com/awslabs/git-secrets).

## Usage

1. Clone the `.env.example` file to create `.env.development` file.
2. Start the development server:
   ```bash
   yarn run dev
   ```
3. The server will run on `http://localhost:3000`.

## Contributing

1. Fork the repository.
2. Create a new branch:

   ```bash
   git checkout -b feature-name
   ```

3. Make your changes.
4. Commit your changes:

   ```bash
   git commit -m 'change-type: Add some feature'
   ```

   The repository strictly follows the conventional commit format for writing commit messages. If the commit message does not follow the format, the commitlint hook will throw an error. You can use the commitizen CLI using the following command:

   ```bash
   yarn commit
   ```

5. Push to the branch:

   ```bash
   git push origin feature-name
   ```

6. Open a pull request. This repository follows a [pull request template](./.github/pull_request_template.md) to document the changes implemented in a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
