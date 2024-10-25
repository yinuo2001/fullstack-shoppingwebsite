# Deployment Link
https://cs-5610-assignment-03-ttteam-1.onrender.com

## API 
- have /ping endpoint
- have endpoints that use the auth0 token (provided in the Authorization header)

## Database
- include 3 tables in the database.
- use Prisma

## Page
have the following pages:

### Homepage
- The landing page of web application. It is the first page users see when they visit this website.
- display generic content for anonymous users. The content is dynamic based on the latest data.
- display specific content for the logged-in user. The content is dynamic based on the most recent data entered by the logged-in user.
Log in/Register page (use auth0 for this)
The login and register page allows users to register (create a new account) with the website and then log in later on  (use auth0 for this)
force login only when identity is required

### Profile page
- Users can see all the information about themselves
- allow users to change their personal information (don't change data related to auth0, only change your own user's database table)

### Details page
- The details page allows users to view a detailed view for each item. They can see more information when they click on the item.
- include a unique identifier in the URL

## Login and Security
- use Auth0 integration based on https://docs.google.com/document/d/1lYmaGZAS51aeCxfPzCwZHIk6C5mmOJJ7yHBNPJuGimU/edit?usp=sharing
- have an Auth Debugger page that shows the authentication token
- generate a token and send the it in the Authorization header when needed

## Responsive design
- Web application is usable on a desktop, tablet, or phone
- Web pages are responsive at any width of the browser

## External Web API
- have an interface to an external Web API

## Accessibility
- Include Lighthouse accessibility reports from 3 pages using https://developers.google.com/web/tools/lighthouse (90%)

## Testing
- have unit tests.

## Deployment
- follow the deployment instructions here https://docs.google.com/document/d/1EAXheb9Q7at094xKAhRikD5uQE15q7G_OWaC5KmuARc/edit#heading=h.njhk7lekv5qz
