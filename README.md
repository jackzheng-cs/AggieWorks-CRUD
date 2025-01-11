# **Blogin: A Simple Full-Stack Blog App**

Welcome to **Blogin**, a simple CRUD blog application built with **Node.js**, **Express**, **PostgreSQL**, and **EJS**.


## **Getting Started**

Follow these steps to set up and run the application on your local machine.

### **1. Install Dependencies**
Run the following command in your terminal to install the required packages:

```bash
npm install
```
---

### **2. Set Up PostgreSQL**
Make sure **PostgreSQL** is installed on your machine. You’ll need the following information to connect to your database:

- **DB_USER** (your PostgreSQL username)
- **DB_PASSWORD** (your PostgreSQL password)
- **DB_HOST** (usually `localhost`)
- **DB_NAME** (the name of your database)
- **DB_PORT** (default is `5432`)

---

### **3. Create a `.env` File**
Create a `.env` file in the root of your project and add your PostgreSQL details:

```env
DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
DB_NAME=your_database_name
DB_PORT=5432
PORT=3000
```

---

### **4. Run the Application**
Start the server by running:

```bash
npm start
```

The server will run on **http://localhost:3000** by default.

---

## **Technologies Used**

- **Node.js**  
- **Express**  
- **PostgreSQL**  
- **EJS**  
- **Body-Parser**
