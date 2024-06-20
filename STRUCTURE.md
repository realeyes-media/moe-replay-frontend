Entire App is inside `src`

Every folder under `src` should be accessible from an absolute path.

Absolute paths have to be defined in `tsconfig.extend.json` for VSCode, ESLint, and Craco to recognize the path.

`main`

- Place for configuration files related to our app logic. These are to be used or extended later to not add messy code anywhere else in the app.

`library`

these are

- standalone libraries/things that are not react specific
- common actions, components, constants, reducers
- utils
- api

`domains`

- domains are everything related to a screen separated into domains
- A "Dashboard" domain would include the layout components, constants, business logic

`resources`

- images, styles, fonts, seed data
