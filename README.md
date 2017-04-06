# Lunch Time!

## USERS:
How many times have you looked glumly at yet another lunch from the same old place and wondered where your classmates were getting theirs?  Surely there must be enough recommendations that it would be worth seeing them all in one place.

**LunchPad** allows you to do just that.  Anyone working, studying or otherwise routinely occupying themselves at a given location can start a **LunchPad** community -- or join one that already exists -- and invite others to join them in posting brief reports on where they have had lunch.  Users log in and instantly see the most recent lunch experiences for their community, including time required, price and quality of the fare, and whether or not it was a worthwhile pick.  Experiences can be grouped either by vendor or by user, and **LunchPad** allows you to save your favorite users in order to quickly access just their experiences.  Have someone whose recommendations you especially value?  Just add them to your favorites.

### SIGNING UP IN LUNCHPAD
1. Point your browser to [lunch-fellows.herokuapp.com](https://lunch-fellows.herokuapp.com).  
1. Click "Sign Up" and enter your desired username and password; if a username is taken you will be prompted to try another.
1. At the next screen you will be able to either join an existing community or create a new one.  If you know the community for your location, type that name; otherwise get it from someone else.  If your location has no **LunchPad** community, you can be the first!  Just choose a name, enter it, and click "Create a community".
1. If you are joining an existing community you will see a list of the most recently-reported restaurants with their average stats for price, time required and lunch-worthines.  If you're the first member, it's time to post the first lunch experience!  

### USING LUNCHPAD
1. *To view the 25 most recent experiences for a vendor* on the list just click on that vendor.  Users' lunch experiences will expand to a full detail view.
1. *To post a new lunch experience* first click the "POST" button at the top of the screen.  
  - Fill out the form and click "Submit".  You will now see your experience in the detail view when that vendor is clicked in the community list.
1. *To see the experiences for a particular user* click the user's name in one of their posts.  The experience detail view will expand into the main view. To add the user to your favorites just click "Favorites" at the top of the screen.
1. *To edit your own previously posted experiences* click your name on one of your own posts.
  - You will see your 25 most recent posts arranged chronologically under your name.
  - To edit, just click the edit button on the post, and then fill out and resubmit the form.

## DEVELOPERS:

### Coding standards:
- ES6 coding conventions are standard for this project.
- Core coding standards apply primarily to format and are as defined in `.eslintrc`.
  - **NOTE** that all scripts use strict mode globally.
- Arrow functions and other modern syntax are preferred, though destructuring is used sparingly.
- `const` and `let` are generally preferred over `var` for declaring value references.
- Generally speaking, code blocks should be offset by one line of white space if they represent a distinct concern; blocks that are chained in some way or otherwise serve a shared purpose may be grouped without interspersed white space.
- Functions and other objects containing nested code blocks may include a line of white space at the end to offset the outer scope from that of the last nested scope; this applies only to the outermost scope of a nested grouping.

### Application structure:
- The application proper is organized into a `/lib` and a `/public` directory with only ancillary configuration files stored at the project root along with this document and the main executable, called `server.js`
- All npm installs are included in the `/node_modules` directory, also at project root.  Additionally, a third-party `normalize.css` is included in `/public/vendors/styles`; otherwise, all code originates within this project.
- In tree order, the project is organized as follows:
  - The `/lib/auth` directory contains gatekeeper middleware for issuing, signing, and checking authorization and user-role data using tokens.
  - `/lib/models` contains **Mongoose** database Models defining document structure for each of the project's four **MongoDB** database collections.
  - `/lib/routes` contains backend routes for connecting to the DB in order to carry out CRUD operations.
  - `/lib/app.js` contains all of the possible calls to each of these routes.
  - `/lib/error-handler.js` and `/lib/setup-mongoose.js` are error handling and database connection middleware, respectively.
  - `/public/scripts/controllers` contains event handling and CRUD routing files for the front end.
  - `/public/scripts/models` contains models for the three sub-views available in Community and User views.
  - `/public/styles` contains the project-specific css file.
  - `/test` contains all unit and e2e testing files for the project and is relevant only to developers.

### Initial execution pathway:
- LunchPad is a single-page app, meaning that`/public/index.html` is the only html file used.  All page views are simulated by jQuery transitions, executed via route calls through the **pagejs** library, which hide and reveal specified html `section` elements.
- The initial pathway into the app is as follows:
  - On server start `app` is invoked as exported by `/lib/app.js`, and in turn loads `/public/index.html` on the default route.
  - `index.html` loads `/public/scripts/controllers/page-routes.js` along with its other scripts, thus also calling that file's `page('/')` front-end route with `authController.render` as its callback (found in `/public/scripts/controllers/signup-signin.js`) in order to show only the `#signup-signin-div` (actually a `<section>`) of `index.html`.
  - The user now has access to a set of three event listeners in `#signup-signin-div`, the last of which emits a `submit` event triggering a call to the `page('/community/:id')` front end route in `/public/scripts/controllers/page-routes.js`, either directly or via `/public/scripts/controllers/choose-community`, depending on previous input.
  - This route calls, in succession, `communityController.render`, `userController.hideUser`, and `viewController.showCommunity` from `/public/scripts/controllers/community-controller.js`, `/public/scripts/controllers/see-user.js` and `/public/scripts/controllers/view-controller.js`, respectively.  ¶The first function passes **pagejs** context parameters to the backend in order to fetch user experience data from the MongoDB `Users` and `Experiences` collections (see below); ¶the second either empties or conceals any visible DOM elements displaying user-specific information (which may be displayed in subsequent views but at this point has never been populated) and shows the signup/signin view with the `#experience-interface` `<div>` to display user experience information; ¶and the third shows the enclosing (again somewhat misleadingly id'd) `#community-div` `<section>` as if it were the current page.
    - Specifically, `communityController.render`, uses **superagentjs** to pass the current user's `communityId` in an AJAX call to the `app.use(/lunch/community/)` backend route with its `ensureAuth` (`/lib/auth/ensure-auth.js`) and `communities` (`/lib/routes/communities.js`) callbacks to `Express.router` in order to assemble user posts (or "experiences") associated with the user's community from the backend, sort them from most to least recent and return them in the response.
    - `communityController.render` then aggregates key data from these chronologically-ordered posts into capsule views according to the vendor reviewed, extracts the relevant community name for display in the `#current-community` `<h3>` element of `#community-div` and passes the rest on to `experienceView.populateHandlebars`, a **handlebarsjs** method that populates the display template for post views, renders the results and finally appends them to the `#experiences` `<div>` element of the `#community-div` `<section>`.
  - Along with associated navigation and display controls, the resulting page view shows the current user's login name and community along with  names of vendors reviewed in that community from most to least-recent, and aggregate review data for each one covering the relative cost, time required, and trade-worthiness of that vendor as averaged from all users posting about the vendor.

### Build/test/run:
1. Fork from `https://github.com/TheLunchBunch/lunch/tree/development/lib/auth`, clone to a local directory and set `origin` and `upstream` to reflect your personal fork and the organization remote, respectively.
1. Make sure you have `package.json` in project root and `nmp install` in the same destination to get all dependencies up and running.
1. Make a new branch called `development` to use as development master.  Do all local work on feature branches off of `development` ONLY.
1. Push ONLY to your own GitHub `origin` and then make PRs from there.  PR will automatically redirect to the upstream; make sure you are setting the PR to merge into `development` and not `master`.
1. To test, simply type `npm test` in the cli.  New unit tests should be added to `/test/unit-testing`, API tests to `/test/e2e`.
1. To run, set your local PORT variable as desired and type either `nodemon server.js` or `node server.js` in the cli and hit `return`.
  - Point a browser to `localhost:PORT` to test-drive the app.  
  - Robomongo recommended for direct db management.
  - Postman recommended for backend CRUD operations.
