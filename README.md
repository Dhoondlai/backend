# backend-dhoondlai

## Description

Backend application for Dhoondlai. Built on ExpressTS, Deployed on Lambda.
Node version: 20.11.1

Yarn version 1.22.22

## Project setup

```bash

yarn install

```

### Prettier Setup

Project uses prettier as code formatter. Therefore it is advised to <strong>install</strong> prettier vscode extension, <strong>configure</strong> prettier as default formatter for .ts files, and <strong>enable</strong> format on save in vscode settings. Follow these steps for complete walkthrough:

- Install prettier extension from vscode marketplace
- Open any .ts file in the project.
- press <kbd>ctrl</kbd> + <kbd>shift</kbd> + <kbd>P</kbd> to open command pallete.
- Search "Format Document With" and choose the option.
- Select "Configure default formmatter"
- Select "Prettier" from the list of formatters.

And you are done! All formatting will be applied when you save any file.

Alternatively, you can run command `yarn prettier` to format all files at once in the project.

#### ATTENTION!

It is highly advised to run the above command before commiting your code, in order to rectify any mis-formatting. (Once CI is designed, this need for checking formatting will no longer be needed).

### sample .env file

create a `.env` file for environment variables. You can use the sample below:

```Dotenv
PORT=3001
LAMBDA=false
```

## Project run

### Local:

run server with:

```bash

yarn dev

```
