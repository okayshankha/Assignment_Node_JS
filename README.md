# Assignment-for-Node-js


# Installation:
- npm i


# Project Understanding:

Well, I have used express, mongoose for setting up the Backend, and I have also used mocha and supertest to setup unit-test environment.
For the frontend part, Mustache has been used to achieving Single Page Application (SPA) like implementation, and the I have used the bootstrap form templates.

If I go with the folder structure we can see something like this,

- bin
- - www
- src
- - core
- - lib
- - middlewares
- - models
- - modules
- - routes
- test
- views

So, the starting point of this project is, bin/www. And all the business logic and core functionality of the structure in in the /src.
View folder serves all the static files or and SSR files, for this project one static file gets served for the full Frontend UI.

### 1. A textbox to enter the name of a company / stock script, and a scan button to start scanning the Realtime stock pricing.
When you open http://localhost:3000 you will asked to login to the system, after login, You will see this section, where you will be asked to enter a company symbol. (Here I could not found any search with company name, So you can search with symbols only. example: GOOGL)

### 2. Below the text box shows any kind of graph that shows the price changes for only 2 minutes from when the scan button is pressed, in real time.
After providing a Company Symbol, you need to click the Scan button. It will call the Backend API http://localhost:3000/api/stock/scan and fetch the information of the Stocks. And I have user Charts.js. Here I managed to plot a bar chart with the Stock data, for any available company.


### 3. Below the graph show a list of all previously searched scripts respective to each respective users.
This page has to tabs, one is "Scan Stocks" and "History". If you click on the "History" tab, you will be able to see all the previous searches yuo have made.



### 4. And each time any of the script is clicked, it shows the graph for 2 mins, from the past, and that was saved in the db, during the scan process for that specific script.
When, You hit the Scan, first it tries to find the data, in the database. If it finds the data, it fetches the data and returns it. But if that queried data is not available on our database, it tries to fetch the data from the 3rd Party APIs and store the data in the data in the database.


# How Login is working?
For Login, I have used the bellow setups,
- bycrpt
- jsonwetoken 



# Possible Improvements
Okay, I clearly couldn't manage that much time, to do all the things I thought, initially. These are,

- Unit tests, I have written the unit-tests, but I couldn't manage that much time to write unit-tests for all routes and with covering all possible inputs. I could make that better.
- API Doc, Again lack of time, haunted me, I thought to generate the API docs with "apiDocs". But I need to do that.






```
End points:


# Create new User
POST http://localhost:3000/api/auth/register
JSON-Payload: (example)
{
    "firstName": "Shankha",
    "middleName": "Shankha", (Optional)
    "lastName": "Shankha", (Optional)
    "password": "12345",
    "email": "shankha@shankha.com"
}


# Login
POST http://localhost:3000/api/auth/login
JSON-Payload: (example)
{
    "password": "12345",
    "email": "shankha@shankha.com"
}


# Me API
GET http://localhost:3000/api/user/me
Headers
    authorization: Bearer <token>


# Scan / Fetch Stock Data
POST http://localhost:3000/api/stock/scan
Headers
    authorization: Bearer <token>
Query-Param: (example)
    symbol: String


# Fetch Stock Search History (We can filer the data by symbol query-param)
POST http://localhost:3000/api/stock/scan/history
Headers
    authorization: Bearer <token>
Query-Param: (example)
    symbol: String

```

