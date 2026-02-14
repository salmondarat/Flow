# form-configuration Specification

## Purpose

The form-configuration capability allows administrators to create customizable order form templates. Admins can define which fields appear on the order form, configure validation rules, set up multi-step workflows, and customize available services and pricing. This enables business agility without requiring code changes.

## ADDED Requirements

### Requirement: Form Template Management

The system MUST provide an interface for administrators to create, edit, and delete form templates.

#### Scenario: Create new form template

- GIVEN an admin user is authenticated
- WHEN the user navigates to `/admin/settings/form-templates`
- AND clicks "Create New Template"
- AND enters a template name (e.g., "Standard Order Form")
- AND configures form steps and fields
- AND saves the template
- THEN the template is saved to the database
- AND the template appears in the templates list
- AND the template can be selected for use

#### Scenario: Edit existing form template

- GIVEN an admin user is viewing the form templates list
- WHEN the user clicks "Edit" on a template
- AND modifies the template configuration
- AND saves the changes
- THEN the template is updated in the database
- AND existing drafts using the old configuration are unaffected
- AND new orders use the updated configuration

#### Scenario: Delete form template

- GIVEN an admin user is viewing the form templates list
- WHEN the user clicks "Delete" on a template
- AND confirms the deletion
- THEN the template is marked as deleted (soft delete)
- AND the template is no longer available for new orders
- AND existing orders using the template remain intact

#### Scenario: Set default template

- GIVEN an admin user has multiple form templates
- WHEN the user marks a template as "Default"
- THEN the template is used for new orders
- AND only one template can be default at a time
- AND the previous default template is automatically unset

### Requirement: Form Step Configuration

The system MUST allow administrators to configure multi-step form workflows with customizable step ordering.

#### Scenario: Configure form steps

- GIVEN an admin user is creating or editing a form template
- WHEN the user adds steps to the form
- AND arranges them in the desired order
- THEN each step has:
  - A step title (e.g., "Client Information", "Kit Details")
  - A step description (optional)
  - An order/index
  - One or more configured fields
- AND steps are displayed to users in the configured order

#### Scenario: Reorder form steps

- GIVEN an admin user is editing a form template with multiple steps
- WHEN the user drags a step to a new position
- AND saves the template
- THEN the step order is updated
- AND the step indices are recalculated
- AND future form renders use the new order

#### Scenario: Remove form step

- GIVEN an admin user is editing a form template
- WHEN the user removes a step
- AND saves the template
- THEN the step is removed from the template
- AND fields in that step are also removed

### Requirement: Form Field Configuration

The system MUST allow administrators to configure individual form fields with type, validation, and requirement settings.

#### Scenario: Add text field

- GIVEN an admin user is configuring a form step
- WHEN the user adds a text field
- AND configures:
  - Field label (e.g., "Full Name")
  - Field key (e.g., "client_name")
  - Placeholder text
  - Required/optional status
  - Minimum length (optional)
  - Maximum length (optional)
  - Validation pattern (optional regex)
- THEN the field is added to the step
- AND the field renders as a text input on the form
- AND validation rules are enforced on submission

#### Scenario: Add select field

- GIVEN an admin user is configuring a form step
- WHEN the user adds a select dropdown field
- AND configures:
  - Field label (e.g., "Preferred Contact Method")
  - Field key (e.g., "contact_method")
  - Options list (e.g., "WhatsApp", "Email", "Phone")
  - Default value (optional)
  - Required/optional status
- THEN the field is added to the step
- AND the field renders as a dropdown on the form
- AND only configured options are selectable

#### Scenario: Add textarea field

- GIVEN an admin user is configuring a form step
- WHEN the user adds a textarea field
- AND configures:
  - Field label (e.g., "Special Instructions")
  - Field key (e.g., "notes")
  - Placeholder text
  - Required/optional status
  - Minimum/maximum length
- THEN the field is added to the step
- AND the field renders as a multi-line textarea

#### Scenario: Configure field as required

- GIVEN an admin user is configuring a field
- WHEN the user marks the field as "Required"
- THEN the field shows a required indicator on the form
- AND form submission fails if the field is empty
- AND an appropriate error message is displayed

#### Scenario: Configure field validation pattern

- GIVEN an admin user is configuring a text field
- WHEN the user enters a regex validation pattern (e.g., "^62\d{8,12}$" for phone)
- AND optionally provides a validation error message
- THEN the field input is validated against the pattern
- AND the custom error message is shown on validation failure

### Requirement: Service and Pricing Configuration

The system MUST allow administrators to configure available service types, complexity levels, and pricing rules.

#### Scenario: Configure service types

- GIVEN an admin user is editing a form template
- WHEN the user navigates to "Services" configuration
- AND adds or modifies service types (e.g., "full_build", "repair", "repaint", "custom")
- AND sets base price and base days for each service
- THEN the services are available for selection on the order form
- AND pricing calculations use the configured base values

#### Scenario: Configure complexity levels

- GIVEN an admin user is editing a form template
- WHEN the user navigates to "Complexity" configuration
- AND adds or modifies complexity levels (e.g., "low", "medium", "high", "expert")
- AND sets multiplier for each level (e.g., 1.0, 1.5, 2.0, 3.0)
- THEN the complexity levels are available for selection
- AND pricing calculations multiply base price by the complexity multiplier

#### Scenario: Override default pricing for template

- GIVEN an admin user is editing a form template
- WHEN the user customizes pricing for this specific template
- AND sets different base prices or multipliers than the global defaults
- THEN orders using this template use the template-specific pricing
- AND other templates continue to use global defaults

### Requirement: Form Template Preview

The system MUST provide a preview of the configured form template before it is published.

#### Scenario: Preview form template

- GIVEN an admin user is configuring a form template
- WHEN the user clicks "Preview Form"
- THEN a modal or separate page displays the form as it would appear to clients
- AND the user can navigate through the form steps
- AND validation can be tested
- AND no data is saved during preview

#### Scenario: Test form submission in preview

- GIVEN an admin user is previewing a form template
- WHEN the user fills out the form fields
- AND clicks "Submit"
- THEN the form data is validated
- AND a summary of collected data is displayed
- AND no order is actually created
- AND the user can return to editing

### Requirement: Form Template Versioning

The system MUST maintain version history for form templates to track changes and enable rollback.

#### Scenario: Create new version on edit

- GIVEN a form template exists and has been used for orders
- WHEN an admin user edits and saves the template
- THEN a new version of the template is created
- AND the previous version is archived
- AND existing orders reference their template version

#### Scenario: View template version history

- GIVEN an admin user is viewing a form template
- WHEN the user clicks "Version History"
- THEN a list of previous versions is displayed
- AND each version shows:
  - Version number
  - Created date
  - Created by (admin user)
  - Change summary

#### Scenario: Rollback to previous version

- GIVEN an admin user is viewing template version history
- WHEN the user selects a previous version
- AND clicks "Restore"
- THEN the template is restored to the selected version
- AND a new version is created to track the rollback
- AND the current configuration is archived

### Requirement: Dynamic Form Rendering

The system MUST render forms dynamically based on the template configuration.

#### Scenario: Render form from template

- GIVEN a form template is configured and set as default
- WHEN a client navigates to create a new order
- THEN the form is rendered based on the template configuration
- AND steps appear in the configured order
- AND fields appear within their configured steps
- AND validation rules are enforced

#### Scenario: Handle missing template gracefully

- GIVEN an order was created with a template that has been deleted
- WHEN the form is viewed or edited
- THEN the order data is still accessible
- AND a default fallback template is used for rendering
- OR the form shows a read-only view of the submitted data

### Requirement: Form Configuration API

The system MUST provide API endpoints for form template CRUD operations.

#### Scenario: List form templates (admin only)

- GIVEN an admin user is authenticated
- WHEN a GET request is made to `/api/form-templates`
- THEN a list of form templates is returned
- AND each template includes: id, name, description, isDefault, createdAt, updatedAt
- AND only non-deleted templates are included

#### Scenario: Get single form template

- GIVEN an admin user is authenticated
- WHEN a GET request is made to `/api/form-templates/[templateId]`
- AND the template exists
- THEN the full template configuration is returned
- AND all steps, fields, and settings are included

#### Scenario: Create form template

- GIVEN an admin user is authenticated
- WHEN a POST request is made to `/api/form-templates`
- AND the request body contains valid template configuration
- THEN the template is created
- AND a 201 status is returned
- AND the created template ID is returned

#### Scenario: Update form template

- GIVEN an admin user is authenticated
- AND a form template exists
- WHEN a PUT request is made to `/api/form-templates/[templateId]`
- AND the request body contains updated configuration
- THEN the template is updated
- AND a new version is created
- AND a 200 status is returned

#### Scenario: Delete form template

- GIVEN an admin user is authenticated
- AND a form template exists
- WHEN a DELETE request is made to `/api/form-templates/[templateId]`
- THEN the template is soft deleted
- AND a 204 status is returned
