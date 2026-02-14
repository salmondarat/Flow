# authentication Specification

## Purpose

Defines authentication and authorization for both admin and client users. Admins access the dashboard to manage orders and configure forms. Clients access their portal to create orders, track progress, and manage their orders.

## Baseline Requirements

The following requirements from the existing authentication spec continue to apply:

### Admin Login

- Login page at `/admin/login` with email/password authentication via Supabase Auth
- Successful login redirects to `/admin/dashboard`
- Failed login shows error message

### Protected Admin Routes

- All routes under `/admin/*` except `/admin/login` require authentication
- Unauthenticated access redirects to `/admin/login`
- Post-login redirect to original destination

### Admin Logout

- Clears Supabase session and redirects to login page

### Session Management

- Session persists across page refreshes
- Session expiration triggers redirect to login

### Role-Based Access (Admin)

- Admin role required for admin routes
- Non-admin users denied access to admin routes

## ADDED Requirements

### Requirement: Client Registration

The system MUST provide a registration page at `/client/register` allowing new clients to create an account.

#### Scenario: Successful client registration

- GIVEN a new client navigates to `/client/register`
- WHEN the user enters:
  - Full name (required)
  - Email (required, must be unique)
  - Phone (required, must match +62 format)
  - Password (required, minimum 8 characters)
- AND clicks "Create Account"
- THEN a new client account is created in Supabase Auth
- AND a client profile is created in the profiles table with role="client"
- AND the user is redirected to `/client/dashboard`
- AND a welcome session is established

#### Scenario: Registration with duplicate email

- GIVEN a client account already exists with email "client@example.com"
- WHEN a new user attempts to register with "client@example.com"
- THEN an error message is displayed: "An account with this email already exists"
- AND the form remains populated
- AND no new account is created

#### Scenario: Registration validation

- GIVEN a new client navigates to `/client/register`
- WHEN the user submits with invalid phone format (e.g., "08123456789")
- THEN a validation error is displayed: "Phone must start with +62"
- AND the form is not submitted

### Requirement: Client Login

The system MUST provide a login page at `/client/login` for clients to access their portal.

#### Scenario: Successful client login

- GIVEN a client user exists in Supabase Auth
- WHEN the user navigates to `/client/login`
- AND enters valid email and password
- AND clicks the "Sign in" button
- THEN the user is authenticated
- AND redirected to `/client/dashboard`
- AND a session is established

#### Scenario: Client login redirects admins to admin portal

- GIVEN a user with admin role attempts to login via `/client/login`
- WHEN the user enters valid admin credentials
- AND clicks "Sign in"
- THEN the user is redirected to `/admin/dashboard` instead
- AND an info message is displayed: "Admin detected - redirected to admin portal"

### Requirement: Protected Client Routes

All routes under `/client/*` except `/client/login` and `/client/register` MUST require client authentication.

#### Scenario: Accessing protected client route while authenticated as client

- GIVEN a user is authenticated as client
- WHEN the user navigates to `/client/dashboard`
- THEN the client dashboard page is displayed
- AND no redirect occurs

#### Scenario: Accessing protected client route while unauthenticated

- GIVEN a user is NOT authenticated
- WHEN the user navigates to `/client/orders`
- THEN the user is redirected to `/client/login`
- AND the original path is stored for post-login redirect

#### Scenario: Admin cannot access client routes

- GIVEN a user is authenticated as admin
- WHEN the user attempts to access `/client/dashboard`
- THEN the user is redirected to `/admin/dashboard`
- AND an error message is displayed: "Admins cannot access client portal"

### Requirement: Client Logout

The system MUST provide a logout function for clients that clears the session and redirects to the client login page.

#### Scenario: Successful client logout

- GIVEN a user is authenticated as client
- WHEN the user clicks the "Logout" button
- THEN the Supabase session is cleared
- AND the user is redirected to `/client/login`
- AND session cookies are removed

### Requirement: Client Profile Management

The system MUST allow clients to view and update their profile information.

#### Scenario: View client profile

- GIVEN a client user is authenticated
- WHEN the user navigates to `/client/profile`
- THEN the profile page displays:
  - Name
  - Email (read-only)
  - Phone number
  - Address (if provided)
  - Account creation date

#### Scenario: Update client profile

- GIVEN a client user is viewing their profile
- WHEN the user modifies:
  - Phone number
  - Address
- AND clicks "Save Changes"
- THEN the profile is updated in the database
- AND a success message is displayed
- AND the updated information is shown

#### Scenario: Change password

- GIVEN a client user is viewing their profile
- WHEN the user clicks "Change Password"
- AND enters current password
- AND enters new password (minimum 8 characters)
- AND confirms new password
- AND submits the form
- THEN the password is updated in Supabase Auth
- AND the user remains logged in
- AND a success message is displayed

### Requirement: Password Reset

The system MUST provide password reset functionality for both admin and client users.

#### Scenario: Request password reset

- GIVEN a user has forgotten their password
- WHEN the user navigates to the login page
- AND clicks "Forgot Password"
- AND enters their email address
- AND clicks "Send Reset Link"
- THEN a password reset email is sent via Supabase Auth
- AND a confirmation message is displayed

#### Scenario: Reset password with valid token

- GIVEN a user has received a password reset email
- WHEN the user clicks the reset link
- AND enters a new password
- AND confirms the new password
- AND submits the form
- THEN the password is updated
- AND the user can login with the new password

### Requirement: Authentication API

The system MUST provide API endpoints for authentication operations.

#### Scenario: Client registration API

- WHEN a POST request is made to `/api/auth/register`
- AND the request body contains valid client data
- THEN a new client account is created
- AND a 201 status is returned
- AND the client profile is returned

#### Scenario: Check auth status API

- GIVEN a user is authenticated
- WHEN a GET request is made to `/api/auth/me`
- THEN the user's profile is returned
- AND the role is included in the response

## MODIFIED Requirements

### Requirement: Role-Based Access

The system MUST verify that authenticated users have the appropriate role (admin or client) in the profiles table before granting access to corresponding routes.

#### Scenario: Non-client user is denied access to client routes (NEW)

- GIVEN a user is authenticated but does NOT have the client role
- WHEN the user attempts to access `/client/dashboard`
- THEN the user is redirected to `/client/login`
- AND an "Unauthorized" error message is displayed

#### Scenario: Client user is granted access to client routes (NEW)

- GIVEN a user is authenticated AND has the client role
- WHEN the user attempts to access `/client/dashboard`
- THEN the client dashboard page is displayed
