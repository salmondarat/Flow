## ADDED Requirements

### Requirement: Dynamic Service Configuration

The system SHALL provide admin-configurable service types that replace hardcoded service options.

#### Scenario: Admin creates new service type

- GIVEN an admin user is authenticated
- AND the user navigates to `/admin/settings/services/new`
- WHEN the user fills in:
  - Name: "Custom Paint"
  - Slug: "custom_paint"
  - Description: "Custom color scheme with premium materials"
  - Icon: "palette"
  - Base price: Rp 300,000
  - Base days: 10
- AND submits the form
- THEN the service type is created in the database
- AND the service appears in the public order form
- AND clients can select this service

#### Scenario: Admin updates service pricing

- GIVEN a service type "Full Build" exists with base price Rp 500,000
- AND an admin user is authenticated
- WHEN the user navigates to `/admin/settings/services/full-build/edit`
- AND updates base price to Rp 550,000
- AND submits the form
- THEN the service pricing is updated
- AND new orders use the updated pricing
- AND existing orders are not affected

#### Scenario: Admin disables service type

- GIVEN a service type "Repair" exists
- AND an admin user is authenticated
- WHEN the user navigates to `/admin/settings/services`
- AND toggles the "Repair" service to inactive
- THEN the service is marked as inactive
- AND the service no longer appears in the public order form
- AND existing orders with "Repair" service remain valid

### Requirement: Complexity Level Management

The system SHALL provide admin-configurable complexity levels with custom multipliers.

#### Scenario: Admin creates new complexity level

- GIVEN an admin user is authenticated
- AND the user navigates to `/admin/settings/complexities/new`
- WHEN the user fills in:
  - Name: "Expert"
  - Slug: "expert"
  - Multiplier: 2.5
- AND submits the form
- THEN the complexity level is created
- AND the level appears in complexity selectors
- AND pricing uses the 2.5× multiplier

#### Scenario: Admin sets custom multiplier per service

- GIVEN a service "Full Build" exists
- AND a complexity "Expert" (2.5×) exists
- AND an admin user is authenticated
- WHEN the user navigates to `/admin/settings/services/full-build/edit`
- AND sets a custom multiplier of 2.0× for "Expert" complexity
- AND submits the form
- THEN the custom multiplier is saved
- AND "Expert" complexity for "Full Build" uses 2.0× instead of 2.5×
- AND other services continue using the default 2.5×

### Requirement: Service Add-ons

The system SHALL support optional add-ons for each service type with additional pricing.

#### Scenario: Admin creates add-on for service

- GIVEN a service type "Full Build" exists
- AND an admin user is authenticated
- WHEN the user navigates to `/admin/settings/addons/new`
- AND fills in:
  - Service: "Full Build"
  - Name: "LED Lighting Kit"
  - Description: "Add LED lights to the model"
  - Price: Rp 50,000
  - Required: No
- AND submits the form
- THEN the add-on is created
- AND it appears as an option when "Full Build" is selected
- AND selecting it adds Rp 50,000 to the order total

#### Scenario: Client selects add-ons during order

- GIVEN a service "Full Build" has an add-on "LED Lighting Kit" (Rp 50,000)
- AND a client is creating an order
- WHEN the client selects "Full Build" service
- THEN the "LED Lighting Kit" add-on is displayed
- AND the client can select/deselect the add-on
- AND the order estimate updates when add-on is selected

#### Scenario: Admin creates required add-on

- GIVEN a service type "Custom Paint" exists
- AND an admin user is authenticated
- WHEN the user creates an add-on "Base Coat"
- AND marks it as required
- THEN the add-on is automatically selected when "Custom Paint" is chosen
- AND the client cannot deselect it
- AND the price is always included in estimates

### Requirement: Real-time Pricing Updates

The system SHALL calculate pricing in real-time based on selected service, complexity, and add-ons.

#### Scenario: Price updates with service selection

- GIVEN a client is on the order form
- WHEN the client selects a service with base price Rp 500,000
- AND selects complexity "Medium" (1.5×)
- THEN the estimated price displays Rp 750,000
- AND the estimate updates immediately

#### Scenario: Price updates with add-on selection

- GIVEN a client has selected "Full Build" (Rp 500,000) with "Medium" complexity (Rp 750,000)
- AND an add-on "LED Lighting" (Rp 50,000) exists
- WHEN the client selects the add-on
- THEN the estimated price updates to Rp 800,000
- AND the add-on price is shown in the breakdown

### Requirement: Service Icon Configuration

The system SHALL support icon selection for service types using a predefined icon set.

#### Scenario: Admin selects icon for service

- GIVEN an admin user is creating a service
- WHEN the user selects an icon from the dropdown
- THEN the icon name is saved with the service
- AND the icon displays in the service selector card

#### Scenario: Available icons

- GIVEN the system has predefined icons
- THEN the following icons are available:
  - "hammer" (for build services)
  - "wrench" (for repair services)
  - "palette" (for paint services)
  - "sparkles" (for premium services)
  - "star" (for special services)

## MODIFIED Requirements

### Requirement: Order Items Display

The order details page MUST display all order items with their selected services, complexity, add-ons, and individual pricing.

#### Scenario: Display order items with add-ons

- GIVEN an order has multiple kits
- WHEN an admin user views the order details
- THEN each kit is displayed as a card or row
- AND each item shows:
  - Kit name/model
  - Selected services (dynamic service types)
  - Complexity level
  - Selected add-ons (if any)
  - Individual price estimate (including add-ons)
  - Notes if provided

#### Scenario: Display add-on pricing breakdown

- GIVEN an order item has add-ons selected
- WHEN an admin views the order details
- THEN the add-ons are listed separately
- AND each add-on shows its name and price
- AND the total item price is the sum of: (base price × complexity) + add-ons

### Requirement: Service Selector

The service selector component MUST display all active service types configured by admin with their pricing and descriptions.

#### Scenario: Display dynamic services

- GIVEN multiple service types are configured
- WHEN a client views the order form
- THEN all active services are displayed as cards
- AND each card shows:
  - Service icon
  - Service name
  - Service description
  - Base pricing
- AND inactive services are not displayed

#### Scenario: Service pricing display

- GIVEN a service has base price Rp 500,000
- WHEN the service card is displayed
- THEN the price is shown as "From Rp 500,000"
- AND the actual price updates based on complexity selection

### Requirement: Complexity Selector

The complexity selector component MUST display all active complexity levels configured by admin with their multipliers.

#### Scenario: Display dynamic complexity levels

- GIVEN multiple complexity levels are configured
- WHEN a client selects a service
- THEN all active complexity levels are displayed
- AND each level shows:
  - Level name
  - Multiplier value (e.g., "1.5×")
- AND inactive levels are not displayed

#### Scenario: Custom multiplier display

- GIVEN a service has a custom multiplier for a complexity level
- WHEN the client selects that service
- AND views complexity options
- THEN the custom multiplier is shown if different from default
- OR the default multiplier is shown if no custom override exists
