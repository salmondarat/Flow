# Design: Dynamic Order Configuration

## Context

The current order system uses hardcoded constants for:
- Service types (full_build, repair, repaint)
- Complexity levels (low, medium, high)
- Pricing rules (base prices and multipliers)

This creates inflexibility where:
- Adding new services requires code changes
- Price updates require developer intervention
- No way to offer seasonal or promotional pricing
- Cannot customize options per client
- Admin has no control over order options

### Stakeholders

- **Admins**: Need to manage services, pricing, and options independently
- **Clients**: Need more service options and transparent pricing
- **Developers**: Need maintainable system that doesn't require constant code changes

## Goals / Non-Goals

### Goals

- Enable admin configuration of all service options without code changes
- Support dynamic pricing based on configurable rules
- Maintain backward compatibility with existing orders
- Provide real-time pricing updates for users
- Support future pricing models (bulk, seasonal, client-specific)

### Non-Goals

- Real-time bidding/auction pricing (not in scope)
- Multi-currency support (IDR only for now)
- Advanced pricing rules (tiered, bulk discounts) - may add later
- Public API for service management (admin-only for now)

## Decisions

### 1. Database Schema Design

**Decision**: Use separate normalized tables for services, complexities, and their relationships.

**Rationale**:
- Separation of concerns: services and complexities are distinct concepts
- Junction table allows custom multipliers per service-complexity combination
- Add-ons as separate table allows flexibility for optional extras
- Proper foreign keys ensure referential integrity

**Alternatives Considered**:
- Single table with JSONB for complexities: Rejected because less queryable, harder to validate
- Embedded in existing tables: Rejected because would require migration of all order data

### 2. Backward Compatibility Strategy

**Decision**: Keep existing `service_type` enum in `order_items` table but add nullable `service_type_id` column.

**Rationale**:
- Existing orders continue to work without migration
- New orders use the new ID-based system
- Can migrate old orders gradually
- Application code handles both enum and ID lookups

**Migration Path**:
1. Add new columns (service_type_id, complexity_id)
2. Update application to prefer IDs, fallback to enum
3. Create migration script to link old enums to new IDs
4. Eventually deprecate enum columns (after 6 months)

### 3. Pricing Calculation Architecture

**Decision**: Create a `PricingService` class that encapsulates all pricing logic and fetches from database.

**Rationale**:
- Single source of truth for pricing calculations
- Easy to test in isolation
- Can cache results for performance
- Clear separation from UI components

**Implementation**:
```typescript
// lib/services/pricing.ts
class PricingService {
  async calculatePrice(serviceTypeId: string, complexityId: string, addonIds: string[]): Promise<PricingResult>
  async getBasePrice(serviceTypeId: string): Promise<number>
  async getMultiplier(serviceTypeId: string, complexityId: string): Promise<number>
}
```

### 4. Admin UI/UX Approach

**Decision**: Create dedicated settings pages under `/admin/settings/` with CRUD interfaces.

**Rationale**:
- Follows existing admin patterns
- Clear separation from order management
- Can be extended with additional settings later
- Uses existing UI components (shadcn/ui)

**Pages Structure**:
- `/admin/settings/services` - List, create, edit services
- `/admin/settings/complexities` - List, create, edit complexities
- `/admin/settings/addons` - List, create, edit add-ons
- Each with sort order controls and active/inactive toggles

### 5. Icon System

**Decision**: Use predefined icon names mapped to lucide-react icons.

**Rationale**:
- Lucide icons already used in project
- String names are simple to store
- No need for custom icon uploads
- Consistent visual style

**Icons Available**:
- `hammer`, `wrench`, `palette` (existing)
- `sparkles`, `star`, `crown` (premium/special)
- `settings`, `zap`, `shield` (utility)
- Extensible as needed

## Risks / Trade-offs

### Risk 1: Performance Impact

**Risk**: Database queries on every page load could slow down the order form.

**Mitigation**:
- Implement caching with React Query (SWR)
- Cache service/complexity data for 5-10 minutes
- Use Supabase edge functions for faster queries
- Consider CDN caching for static configuration

### Risk 2: Data Migration Complexity

**Risk**: Existing orders may not migrate cleanly to new system.

**Mitigation**:
- Keep old enum columns as backup
- Write comprehensive migration script with validation
- Test migration on staging first
- Keep fallback logic in production for 6+ months
- Create rollback plan

### Risk 3: Admin Configuration Errors

**Risk**: Admin could misconfigure pricing (zeros, negative numbers, etc).

**Mitigation**:
- Add validation in admin forms (min values, required fields)
- Show warnings for unusual pricing
- Keep "last modified" tracking
- Consider approval workflow for major pricing changes
- Log all pricing changes for audit

### Trade-off: Complexity vs Flexibility

**Trade-off**: More database tables and relations add complexity.

**Justification**:
- Flexibility gained outweighs complexity
- Complexity is isolated in pricing module
- Good database design pays off long-term
- Can always add simpler UI layer on top

## Migration Plan

### Phase 1: Database Setup (1-2 days)

1. Create new tables with migrations
2. Add seed data for existing services
3. Add new columns to existing tables (nullable)
4. Run migration in staging

### Phase 2: Backend Implementation (2-3 days)

1. Create new API functions
2. Implement PricingService
3. Update estimation calculation
4. Write tests for pricing logic
5. Add server actions for admin

### Phase 3: Frontend Components (2-3 days)

1. Update service and complexity selectors
2. Create add-on selector component
3. Update order form to use new data
4. Test order creation flow
5. Add loading/error states

### Phase 4: Admin Interface (2-3 days)

1. Create services management pages
2. Create complexities management pages
3. Create add-ons management pages
4. Test admin CRUD operations
5. Add validation and error handling

### Phase 5: Testing & Rollout (1-2 days)

1. End-to-end testing
2. Performance testing
3. Deploy to staging
4. User acceptance testing
5. Production deployment

### Rollback Plan

If critical issues arise:
1. Revert frontend to use hardcoded constants
2. Keep database tables (no data loss)
3. Fix issues, then re-deploy
4. Old orders always work with enum fallback

## Open Questions

1. **Should we support per-client pricing tiers?**
   - Deferred for future consideration
   - Would require client tier system

2. **Should complexity multipliers be required or optional per service?**
   - Decision: Optional (defaults to global multiplier)
   - More flexible for admin

3. **How to handle orders with deleted services?**
   - Decision: Soft delete (is_active flag)
   - Historical orders always valid

4. **Should we support service categories?**
   - Deferred: Can add later if needed
   - Current flat structure is sufficient

5. **Add-on pricing: flat fee or percentage?**
   - Decision: Flat fee only for now
   - Percentage can be added later if needed
