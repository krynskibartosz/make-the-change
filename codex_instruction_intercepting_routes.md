# Prompt for Codex: Implementing Intercepting Routes for Projects & Products

## 1. Context Analysis
You are working on a **Next.js 16+** project using **App Router** and **Supabase**.
The goal is to implement **Intercepting Routes** (`(.)folder`) to display detailed content (Projects, Products) in a modal overlay when navigated to via soft navigation (client-side transitions), while preserving direct access to the full page on hard navigation.

### Existing Architecture
*   **Root Layout**: `src/app/[locale]/layout.tsx` has been updated to accept a `@modal` parallel route slot.
*   **Modal Parallel Route**: `src/app/[locale]/@modal` exists and handles the modal rendering logic.
*   **Reference Implementation**: The Authentication flows (Login, Register, Forgot Password) have already been successfully implemented using this pattern.
    *   **Login**: `src/app/[locale]/@modal/(.)login/page.tsx` intercepts `/login`.
    *   **Register**: `src/app/[locale]/@modal/(.)register/page.tsx` intercepts `/register`.
    *   **Forgot Password**: `src/app/[locale]/@modal/(.)forgot-password/page.tsx` intercepts `/forgot-password`.
*   **Component Architecture**: The logic for these pages was extracted into reusable client components (e.g., `LoginForm`, `RegisterForm`) to be shared between the full page and the modal.

## 2. Task Description
Your mission is to replicate this success for the **Projects** and **Products** sections of the application. These are more complex because they involve dynamic data fetching (slugs/IDs).

### Objective A: Intercepting Projects
**Target Route**: `src/app/[locale]/(marketing)/projects/[slug]`

1.  **Analyze**: Examine `src/app/[locale]/(marketing)/projects/[slug]/page.tsx` to understand how data is fetched and rendered.
2.  **Refactor**: Extract the presentation logic into a reusable component (e.g., `ProjectDetails` or `ProjectQuickView`). Ideally, this component should accept the project data as props.
3.  **Implement Interception**:
    *   Create `src/app/[locale]/@modal/(.)projects/[slug]/page.tsx`.
    *   This page must:
        *   Accept the same `params` (slug).
        *   Fetch the necessary project data (using the same logic or service function as the main page).
        *   Render the `ProjectDetails` component inside a `Dialog` (similar to `src/app/[locale]/@modal/(.)login/page.tsx`).
4.  **Verify**: Ensure clicking a project card in `/projects` opens the modal with the correct data, and refreshing the page shows the full project details page.

### Objective B: Intercepting Products
**Target Route**: `src/app/[locale]/(marketing)/products/[id]`

1.  **Analyze**: Examine `src/app/[locale]/(marketing)/products/[id]/page.tsx`.
2.  **Refactor**: Extract product detail presentation logic into a reusable component (e.g., `ProductDetails`).
3.  **Implement Interception**:
    *   Create `src/app/[locale]/@modal/(.)products/[id]/page.tsx`.
    *   Fetch product data based on `id`.
    *   Render the `ProductDetails` component inside a `Dialog` modal.
4.  **Verify**: Ensure navigation from the product list opens the modal, and direct access loads the full page.

## 3. Technical Guidelines
*   **Directory Structure**: Pay close attention to route groups like `(marketing)`. The interception folder structure must match the target route structure relative to the layout defining the slot.
    *   Since `@modal` is in `src/app/[locale]/layout.tsx`, the interception for `src/app/[locale]/(marketing)/projects` should likely be `src/app/[locale]/@modal/(.)projects` (ignoring the route group in the folder name if it's just for organization, or including it if it affects the URL path - check Next.js docs on Intercepting Routes with Route Groups).
    *   *Correction/Hint*: Intercepting routes match the **URL path segments**, not the file system path directly. If the URL is `/projects/my-slug`, the interceptor should be `@modal/(.)projects/[slug]`.
*   **Data Fetching**: You will likely need to duplicate the data fetching call in the intercepting route page. Ensure you use cached data fetching functions if available to avoid double requests on the server (though these are distinct requests - one for the previous page, one for the modal content). Ideally, extract the fetching logic into a shared utility function if it isn't already.
*   **UI Components**: Use the existing `Dialog` components from `@make-the-change/core/ui`. Refer to `src/app/[locale]/@modal/(.)login/page.tsx` for the correct implementation pattern (using `router.back()` on close).

## 4. Deliverables
*   `src/app/[locale]/@modal/(.)projects/[slug]/page.tsx`
*   Refactored Project components.
*   `src/app/[locale]/@modal/(.)products/[id]/page.tsx`
*   Refactored Product components.
*   Verification that soft navigation opens modals and hard navigation opens full pages.
