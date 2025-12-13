# 🤝 FMS Frontend Team Workflow

This document serves as the **Standard Operating Procedure (SOP)** for all developers working on the Finance Management System frontend. Follow these guidelines to ensure code consistency and easy integration.

---

## 🏗️ Architecture Overview

We use a **Feature-Based** directory structure. 

### 1. Key Directories
| Directory | Purpose | Rules |
| :--- | :--- | :--- |
| **`src/pages/`** | Full page views. | Group by Role: `auth/`, `student/`, `finance/`. |
| **`src/components/ui/`** | Reusable "dumb" components. | **ALWAYS** use these (Button, Input, Card) instead of raw HTML. |
| **`src/contexts/`** | Global Logic. | Only use for app-wide state (Auth, Theme). |
| **`src/services/`** | API Calls. | **NEVER** write `axios` calls in components. Use strictly typed service functions. |

---

## 🎨 Design System Guide

We have a custom **Dark Premium Theme**. Do not hardcode hex colors; use the variables in `index.css`.

### Common Variables
*   **Backgrounds**: `var(--color-bg-primary)` (Dark Navy) | `var(--color-bg-secondary)` (Lighter Navy)
*   **Accents**: `var(--color-accent-desc)` (Teal) | `var(--color-accent-yellow)` (Warning/Highlight)
*   **Text**: `var(--color-text-primary)` (White) | `var(--color-text-secondary)` (Grey)

### How to Create a New Page
1.  **Create File**: `src/pages/[role]/MyNewPage.jsx`.
2.  **Import Styles**: Use CSS Modules or a dedicated `.css` file for page-specific styles.
3.  **Layout**: Wrap content in `<div className="page-container">`.

---

## 🔐 Authentication Flow

The Authentication system is centralized.

1.  **Login**: User clicks "Login" -> Modal Overlay opens -> Enters Credentials.
2.  **Submit**: Form calls `authService.login()`.
3.  **Success**:
    *   Token saved to `localStorage`.
    *   User role checked (Student vs Finance).
    *   Redirected to Dashboard (`/student/dashboard` or `/finance/dashboard`).

**Do NOT implement your own login logic.** Use the `AuthContext` (Coming Soon).

---

## ➕ How to Add a New Feature (Step-by-Step)

### Example: Adding a "Pay Tuition" Page

1.  **Backend Check**: Ensure the API endpoint exists (e.g., `POST /api/payments`).
2.  **Service Layer**:
    *   Open `src/services/studentService.js`.
    *   Add function:
        ```javascript
        export const payTuition = async (amount) => {
          return await api.post('/payments', { amount });
        };
        ```
3.  **UI Component**:
    *   Create `src/pages/student/PaymentPage.jsx`.
    *   Use `<Button>` and proper form inputs.
    *   Call `payTuition()` on submit.
4.  **Route**:
    *   Open `src/App.jsx`.
    *   Add `<Route path="/student/pay" element={<PaymentPage />} />`.

---

## ⚠️ Coding Standards

*   **Naming**: PascalCase for Components (`MyComponent.jsx`), camelCase for functions (`handleSubmit`).
*   **Commits**: Use descriptive messages: `feat: add payment page`, `fix: login modal z-index`.
*   **Clean Code**: Remove `console.log` before pushing.

---

### 🚀 Ready to Code?
Run the dev server:
```bash
npm run dev
```
