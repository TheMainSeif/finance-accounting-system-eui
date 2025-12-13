# FMS Frontend Documentation

Welcome to the **Financial Management System (FMS)** Frontend! 
This project is built with **React (Vite)** and is designed to be modular, scalable, and easy to maintain for the entire team.

👉 **[READ THE TEAM WORKFLOW GUIDE HERE](./TEAM_WORKFLOW.md)** for step-by-step development instructions.

---

## 📂 Project Structure (Where to find things)

We follow a strict "Feature-First" and "Atomic Design" hybrid approach.

### `src/components/` (The Building Blocks)
*   **`ui/`**: "Dumb" components that just look good. Buttons, Inputs, Cards. **Use these everywhere.**
    *   *Example*: `<Button variant="primary">Submit</Button>`
*   **`layout/`**: Structural parts like `Navbar`, `Sidebar`, `Footer`.
*   **`common/`**: Reusable widgets like `Modal`, `LoadingSpinner`.

### `src/pages/` (The Views)
Each role has its own directory.
*   **`auth/`**: Login & Registration pages.
*   **`student/`**: ALL pages seen by the Student role (Dashboard, Pay Fees).
*   **`finance/`**: ALL pages seen by the Admin/Finance role (Reports, Dues).

### `src/services/` (The API Layer - IMPORTANT)
**Do not write `fetch()` or `axios.get()` inside your pages!**
*   **`api.js`**: The central Axios configuration (baseURL, Interceptors).
*   **`authService.js`**: `login()`, `register()`.
*   **`studentService.js`**: `enrollCourse()`, `payFees()`.
*   *Why?* If the backend URL changes, we fix it in ONE place.

### `src/contexts/` (Global State)
*   **`AuthContext.jsx`**: Manages the "Logged In" state. Wraps the whole app so we can know `user.isAdmin` anywhere.

---

## 🚀 How to Start Development

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Locally**:
    ```bash
    npm run dev
    ```

3.  **Authentication Rules**:
    *   The `api.js` automatically attaches the **JWT Token** from `localStorage` to every request.
    *   You don't need to manually header handling.

---

## ✅ Current Status (Implemented Features)
- **Project Setup**: Vite + React + Axios + React Router initialized.
- **Design System**: Global CSS (`index.css`), Dark/Navy Theme, Typography variables.
- **Components**:
    - `Button` (Primary/Outline variants)
    - `Navbar` (Sticky, Responsive, Logo integration)
    - `Footer` (Dark theme)
- **Pages**:
    - **Landing Page** (`Home.jsx`): Complete with Hero, Features (Smooth scroll), About, and Contact sections.
- **Next Steps**: Portal Selection (Login), Student Dashboard, Finance Dashboard.

## 🎨 Design System

We use **Vanilla CSS Variables** defined in `index.css`.
*   **Primary Color**: `var(--color-bg-primary)` (Dark Navy)
*   **Accent Color**: `var(--color-accent-yellow)` (Warning Yellow)

**Usage Example**:
```css
.my-new-card {
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border-dark);
}
```

Happy Coding! 🚀
