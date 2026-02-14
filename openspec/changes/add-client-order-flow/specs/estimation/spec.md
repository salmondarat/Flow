## ADDED Requirements

### Requirement: Pricing Calculation

The system SHALL calculate order pricing based on selected services, complexity, and quantity of kits.

#### Scenario: Full build service with low complexity

- **WHEN** a client selects "full_build" service with "low" complexity
- **THEN** the base price of Rp 500,000 shall be applied
- **AND** the complexity multiplier of 1.0 shall be applied
- **AND** the final price shall be Rp 500,000 per kit

#### Scenario: Repair service with high complexity

- **WHEN** a client selects "repair" service with "high" complexity
- **THEN** the base price of Rp 150,000 shall be applied
- **AND** the complexity multiplier of 2.0 shall be applied
- **AND** the final price shall be Rp 300,000 per kit

#### Scenario: Multiple kits with different services

- **WHEN** a client adds multiple kits with different services and complexities
- **THEN** the price for each kit SHALL be calculated independently
- **AND** the total price SHALL be the sum of all kit prices

### Requirement: Time Estimation

The system SHALL calculate estimated completion time based on service type and complexity.

#### Scenario: Full build base time estimation

- **WHEN** a client selects "full_build" service with "low" complexity
- **THEN** the base time of 14 days shall be applied
- **AND** the complexity multiplier of 1.0 shall be applied
- **AND** the final estimation shall be 14 days

#### Scenario: Repaint with medium complexity

- **WHEN** a client selects "repaint" service with "medium" complexity
- **THEN** the base time of 7 days shall be applied
- **AND** the complexity multiplier of 1.5 shall be applied
- **AND** the final estimation shall be 11 days (rounded)

#### Scenario: Multiple kits cumulative time

- **WHEN** a client adds multiple kits
- **THEN** the time estimation SHALL be the sum of all kit estimations
- **AND** the total shall be displayed in days

### Requirement: Estimation Types and Validation

The system SHALL provide TypeScript types for estimation inputs and outputs with proper validation.

#### Scenario: Valid estimation input

- **WHEN** creating an estimation with valid service type, complexity, and quantity
- **THEN** the estimation SHALL be accepted
- **AND** return a valid estimation result with price and time

#### Scenario: Invalid service type

- **WHEN** providing an invalid service type
- **THEN** the estimation SHALL fail validation
- **AND** return an error indicating invalid service

#### Scenario: Invalid complexity level

- **WHEN** providing an invalid complexity level
- **THEN** the estimation SHALL fail validation
- **AND** return an error indicating invalid complexity

### Requirement: Estimation Utilities

The system SHALL provide utility functions for formatting and displaying estimations.

#### Scenario: Format price in Indonesian Rupiah

- **WHEN** formatting a price of 500000 cents
- **THEN** the formatted output shall be "Rp 500.000"

#### Scenario: Format days in human-readable format

- **WHEN** formatting 14 days
- **THEN** the formatted output shall be "14 days" or "2 weeks" as appropriate
