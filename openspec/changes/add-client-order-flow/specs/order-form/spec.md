## ADDED Requirements

### Requirement: Multi-Step Order Form

The system SHALL provide a multi-step wizard for order creation with clear progression and validation.

#### Scenario: Step 1 - Client information

- **WHEN** a client starts the order form
- **THEN** Step 1 shall collect client name, phone, and optional email/address
- **AND** validation SHALL require name (min 2 chars) and phone (+62 format)
- **AND** the "Next" button SHALL be disabled until validation passes
- **AND** upon completion, proceed to Step 2

#### Scenario: Step 2 - Add model kits

- **WHEN** a client reaches Step 2
- **THEN** the form SHALL allow adding one or more model kits
- **AND** for each kit, the client SHALL provide kit name/grade
- **AND** a "Add Another Kit" button SHALL be available
- **AND** validation SHALL require at least one kit
- **AND** upon completion, proceed to Step 3

#### Scenario: Step 3 - Select services and complexity

- **WHEN** a client reaches Step 3 for a kit
- **THEN** the form SHALL display service options (full_build, repair, repaint)
- **AND** the form SHALL display complexity options (low, medium, high)
- **AND** selection SHALL be required for each kit
- **AND** validation SHALL require service and complexity for all kits
- **AND** upon completion, proceed to Step 4

#### Scenario: Step 4 - Review and estimation

- **WHEN** a client reaches Step 4
- **THEN** the form SHALL display a summary of all order details
- **AND** the form SHALL display the estimated price and completion time
- **AND** a "Submit Order" button SHALL be available
- **AND** upon submission, the order SHALL be created and redirect to success page

#### Scenario: Navigation between steps

- **WHEN** a client clicks "Back" on any step
- **THEN** the form SHALL return to the previous step
- **AND** previously entered data SHALL be preserved
- **AND** the client SHALL be able to edit any previous information

### Requirement: Real-Time Estimation Preview

The system SHALL display live price and time estimates as the client makes selections.

#### Scenario: Update estimation on service change

- **WHEN** a client selects or changes a service for a kit
- **THEN** the estimation preview SHALL update immediately
- **AND** display the new price and time for that kit
- **AND** update the total order estimation

#### Scenario: Update estimation on complexity change

- **WHEN** a client selects or changes complexity for a kit
- **THEN** the estimation preview SHALL update immediately
- **AND** display the new price and time for that kit
- **AND** update the total order estimation

#### Scenario: Update estimation on kit add/remove

- **WHEN** a client adds or removes a kit
- **THEN** the estimation preview SHALL update immediately
- **AND** recalculate the total order estimation

### Requirement: Order Form Validation

The system SHALL validate all form inputs before submission using React Hook Form and Zod.

#### Scenario: Client name validation

- **WHEN** a client enters a name with less than 2 characters
- **THEN** an error message SHALL display "Name must be at least 2 characters"
- **AND** the form SHALL not proceed to the next step

#### Scenario: Phone number validation

- **WHEN** a client enters a phone number not matching +62 format
- **THEN** an error message SHALL display "Phone must start with +62 followed by 8-12 digits"
- **AND** the form SHALL not proceed to the next step

#### Scenario: Email validation when provided

- **WHEN** a client enters an email address
- **THEN** validation SHALL check for valid email format
- **AND** if invalid, display "Please enter a valid email address"
- **AND** the field SHALL be optional

#### Scenario: At least one kit required

- **WHEN** a client tries to proceed from Step 2 without adding kits
- **THEN** an error message SHALL display "Please add at least one model kit"
- **AND** the form SHALL not proceed to the next step

### Requirement: Order Submission

The system SHALL submit valid orders to the API and handle success/error states.

#### Scenario: Successful order submission

- **WHEN** a client submits a valid order
- **THEN** the order SHALL be sent to the API endpoint
- **AND** upon success, redirect to the success page with order ID
- **AND** the order SHALL be saved with status "draft" in the database

#### Scenario: Submission error handling

- **WHEN** order submission fails due to network or server error
- **THEN** an error message SHALL display "Failed to submit order. Please try again."
- **AND** the client SHALL remain on the review step
- **AND** the form data SHALL be preserved for retry

#### Scenario: Loading state during submission

- **WHEN** order submission is in progress
- **THEN** the submit button SHALL show a loading indicator
- **AND** the button SHALL be disabled to prevent double submission
