# Spec: Authentication & Authorization

## ADDED Requirements

### Requirement: Admin Login

The system MUST provide a login page at `/admin/login` that allows authenticated users to sign in with email and password credentials using Supabase Auth.

#### Scenario: Successful login

- GIVEN an admin user exists in Supabase Auth
- WHEN the user navigates to `/admin/login`
- AND enters valid email and password
- AND clicks the "Sign in" button
- THEN the user is authenticated
- AND redirected to `/admin/dashboard`
- AND a session is established

#### Scenario: Failed login with invalid credentials

- GIVEN an admin user exists in Supabase Auth
- WHEN the user navigates to `/admin/login`
- AND enters invalid email or password
- AND clicks the "Sign in" button
- THEN an error message is displayed
- AND the user remains on the login page
- AND no session is established

### Requirement: Protected Admin Routes

All routes under `/admin/*` except `/admin/login` MUST require authentication. Unauthenticated access MUST redirect to `/admin/login`.

#### Scenario: Accessing protected route while authenticated

- GIVEN a user is authenticated as admin
- WHEN the user navigates to `/admin/dashboard`
- THEN the dashboard page is displayed
- AND no redirect occurs

#### Scenario: Accessing protected route while unauthenticated

- GIVEN a user is NOT authenticated
- WHEN the user navigates to `/admin/dashboard`
- THEN the user is redirected to `/admin/login`
- AND the original path is stored for post-login redirect

#### Scenario: Post-login redirect to original destination

- GIVEN an unauthenticated user navigates to `/admin/orders/123`
- AND is redirected to `/admin/login`
- WHEN the user successfully logs in
- THEN the user is redirected to `/admin/orders/123`
- AND the session is established

### Requirement: Admin Logout

The system MUST provide a logout function that clears the Supabase session and redirects to the login page.

#### Scenario: Successful logout

- GIVEN a user is authenticated as admin
- WHEN the user clicks the "Logout" button in the header
- THEN the Supabase session is cleared
- AND the user is redirected to `/admin/login`
- AND session cookies are removed

### Requirement: Session Management

The system MUST maintain authentication state across page refreshes using Supabase server-side auth with proper cookie handling.

#### Scenario: Session persists across page refresh

- GIVEN a user is authenticated as admin
- WHEN the user refreshes the page
- THEN the user remains authenticated
- AND the session is still valid

#### Scenario: Session expires

- GIVEN a user is authenticated as admin
- WHEN the Supabase session expires
- AND the user attempts to navigate to a protected route
- THEN the user is redirected to `/admin/login`
- AND an appropriate error message is displayed

### Requirement: Role-Based Access

The system MUST verify that authenticated users have the `admin` role in the profiles table before granting access to admin routes.

#### Scenario: Non-admin user is denied access

- GIVEN a user is authenticated but does NOT have the admin role
- WHEN the user attempts to access `/admin/dashboard`
- THEN the user is redirected to `/admin/login`
- AND an "Unauthorized" error message is displayed

#### Scenario: Admin user is granted access

- GIVEN a user is authenticated AND has the admin role
- WHEN the user attempts to access `/admin/dashboard`
- THEN the dashboard page is displayed
