# Change: Add Dynamic Order Configuration

## Why

The current new order process has hardcoded service types (only 3), complexity levels (only 3), and pricing. Neither clients nor admins can customize order options without code changes. This limits flexibility and requires developer intervention for any pricing or service adjustments.

## What Changes

- Add database tables for dynamic service configuration
- Add admin interface for managing services, complexity levels, and pricing
- Add support for custom order options/add-ons per service
- Make service selection and pricing configurable by admin
- Add ability to enable/disable services without code changes
- Support for custom complexity multipliers per service type

## Impact

- Affected specs: orders-management
- Affected code:
  - `/lib/estimation/constants.ts` - Migrate to database-driven configuration
  - `/lib/estimation/calculate.ts` - Update to use dynamic pricing
  - `/components/public/service-selector.tsx` - Load services from database
  - `/components/public/complexity-selector.tsx` - Load complexity levels from database
  - New admin pages at `/admin/settings/services` for configuration

## Breaking Changes

- Migration from hardcoded constants to database-driven configuration
- Existing orders will continue to work with legacy service_type values
- Default services will be seeded during migration
