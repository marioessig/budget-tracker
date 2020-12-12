# Budget Tracker

## Table of Contents
* [Challenge Goal](#challenge-goal)
* [Challenge Requirements](#challenge-requirements)
* [Challenge Result](#challenge-result)
---

## Challenge Goal
This Application provides the users the ability to track budget off/online using a NoSQL database.

## Challenge Requirements

### User Story
>AS AN avid traveler <br>
I WANT to be able to track my withdrawals and deposits with or without a data/internet connection <br>
SO THAT my account balance is accurate when I am traveling  <br>

### Acceptance Criteria
>GIVEN a budget tracker without an internet connection <br>
WHEN the user inputs an expense or deposit <br>
*THEN* they will receive a notification that they have added an expense or deposit <br>
WHEN the user reestablishes an internet connection <br>
*THEN* the deposits or expenses added while they were offline are added to their transaction history and their totals are updated <br>


## Challenge Result

### Application
[Application](Heroku?)

### GitHub Repository
[GitHub Repository URL](https://github.com/marioessig/budget-tracker)

---
Install dependencies listed in package.json: `npm i` <br>
or <br>
Packages to install:
1. `npm init -y`
2. `npm i compression express mongoose morgan`
3. Update package.json script: `"start": "node server.js"`