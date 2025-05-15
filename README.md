# Intro to Programming Frontend

This is a frontend Angular project designed for introductory programming with a fake backend for demonstration and testing purposes.

---

## 📁 Project Structure

- `/src`: Main source code
- `/src/app`: Contains all Angular components, services, and routes
- `fake-backend.ts`: Simulates a backend API using Angular's HTTP interceptor

---

## 🚀 Getting Started

### 1. Install Dependencies

Use the following command to install project dependencies:

```bash
npm install --legacy-peer-deps
````

> ⚠️ If you encounter issues, you can also use `--force` as a last resort:
>
> ```bash
> npm install --force
> ```

---

### 2. Run the Application

To start the development server, run:

```bash
ng serve
```

Open your browser and navigate to:

```
http://localhost:4200/
```

---

### 3. Fake Backend

This project uses a fake backend (`fake-backend.ts`) to mock API responses for features like:

* User login
* Employee and department handling
* Requests and workflows

No actual database or server is required.

---

## 🧰 Tools and Versions

* Angular CLI
* Node.js (v16+ recommended)
* TypeScript

---

## 📎 Notes

* Ensure your Node.js version is compatible with Angular 13+.
* Avoid updating `tslint` or `codelyzer` beyond the compatible versions unless you also upgrade the Angular version.

---

## 👨‍💻 Development

Feel free to modify the `fake-backend.ts` file to extend or simulate more endpoints as needed.

---

## 📝 License

This project is for educational use.

```
