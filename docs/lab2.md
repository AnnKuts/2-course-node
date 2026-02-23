## Lab2. Express Framework

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Work Progress](#work-progress)
3. [How to Run the Project](#how-to-run-the-project)
4. [Conclusion](#conclusion)
5. [Control Questions](#control-questions)
    1. [Client-Server Architecture](#1-what-is-client-server-architecture)
    2. [HTML vs HTTP](#2-what-is-the-difference-between-html-and-http)
    3. [HTTP vs HTTPS](#3-what-is-the-difference-between-http-and-https)
    4. [GET vs POST](#4-what-is-the-difference-between-get-and-post-methods)
    5. [HTTP Headers and Cookies](#5-what-are-http-headers-and-cookies)
    6. [HTTP Status Codes](#6-why-are-http-status-codes-needed)
    7. [TCP Port](#7-what-is-a-tcp-port)
    8. [Why Express](#8-why-is-express-framework-needed)
    9. [Template Engines](#9-what-are-template-engines-and-why-are-they-needed)
    10. [Routing](#10-what-is-routing-in-a-web-application)
    11. [MVC Pattern](#11-explain-mvc-pattern)
    12. [package.json](#12-what-is-packagejson-used-for)
    13. [JavaScript Modules](#13-what-are-modules-in-javascript)

### Project Structure

The project has the following structure:

```
.
├── package-lock.json
├── package.json
├── public
│   ├── assets
│   │   ├── clem.png
│   │   ├── fluttershy.png
│   │   ├── gustavo.jpg
│   │   └── hedgehog.png
│   └── styles
│       ├── index
│       │   └── index.css
│       ├── styles.css
│       └── team
│           └── team.css
├── src
│   └── server.ts
├── team.ts
├── tsconfig.json
└── views
    ├── index.ejs
    ├── main.html
    └── team.ejs
```

---

## Work Progress

### 1. Reviewing Node.js and Express.js

Express.js was used as a web framework for Node.js to simplify routing, middleware handling, and server creation.

The server was implemented in:

```
src/server.ts
```

The application was configured to:

* Serve static files from the `public` directory
* Use EJS as a template engine
* Handle routing for different pages

---

### 2. Website Implementation

The created website includes:

### Static Page

* `views/main.html`
 
---

###  Dynamic Page (EJS Template)

* `views/index.ejs`
* `views/team.ejs`

Student and team information is rendered dynamically from data.

---

###  Images

Images are stored in:

```
public/assets/
```

Examples:

* `clem.png`
* `fluttershy.png`
* `gustavo.jpg`
* `hedgehog.png`

They are served as static files by Express.

---

###  Relative Link

Example of a relative link inside the website:

```html
<a href="/team">Our Team</a>
```

This navigates between internal pages.

---

###  Absolute Link

Each student added an absolute link of their Linkedin as an external resource

---

## How to Run the Project
1. Go to the project directory:

```bash
cd lab2
```
2. Install dependencies:

```bash
npm install
```

3. Run the server:

```bash
npm run start
```


4. Open in browser:

```
http://localhost:3000
```

---

## Conclusion

During this laboratory work, a web application was created using Node.js and Express.js.
The project includes static and dynamic pages, image assets, routing, and template rendering with EJS.
Basic understanding of server-side web development and Express framework architecture was acquired.

---

# Control Questions

---

### 1. What is client-server architecture?

Client-server architecture is a model where clients (browsers) send requests to a server, and the server processes these requests and returns responses.

---

### 2. What is the difference between HTML and HTTP?

* **HTML** is a markup language used to structure web pages.
* **HTTP** is a protocol used to transfer data between client and server.

---

### 3. What is the difference between HTTP and HTTPS?

* **HTTP** transfers data without encryption.
* **HTTPS** encrypts data using SSL/TLS, providing secure communication.

---

### 4. What is the difference between GET and POST methods?

**GET:**

* Used to retrieve data
* Data is sent via URL
* Can be cached

**POST:**

* Used to send data to the server
* Data is sent in the request body
* More secure for sensitive data

---

### 5. What are HTTP headers and cookies?

* **HTTP headers** contain metadata about requests and responses.
* **Cookies** are small pieces of data stored on the client side.

Both are used to exchange additional information between client and server.

---

### 6. Why are HTTP status codes needed?

HTTP status codes indicate the result of a request (e.g., 200 OK, 404 Not Found, 500 Internal Server Error).

---

### 7. What is a TCP port?

A TCP port is a communication endpoint used by applications to exchange data over a network (e.g., port 3000 for a web server).

---

### 8. Why is Express framework needed?

Express simplifies:

* Routing
* Middleware handling
* Server setup
* Request/response processing

It makes building web applications faster and more structured.

---

### 9. What are template engines and why are they needed?

Template engines (like EJS) allow dynamic generation of HTML pages by embedding JavaScript logic inside templates.

---

### 10. What is routing in a web application?

Routing defines how the application responds to client requests for specific URLs.

Routers organize route handling logic into modular components.

---

### 11. Explain MVC pattern

MVC stands for:

* **Model** – handles data and business logic
* **View** – handles presentation (UI)
* **Controller** – handles request logic and connects Model with View

---

### 12. What is package.json used for?

`package.json`:

* Stores project metadata
* Lists dependencies
* Defines scripts
* Manages project configuration

---

### 13. What are modules in JavaScript?

Modules allow splitting code into reusable files.

There are two main systems:

* **CommonJS** (`require`, `module.exports`)
* **ES Modules** (`import`, `export`)

