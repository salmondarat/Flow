# Comprehensive Profile Settings Design

**Date:** 2026-03-04
**Status:** Approved for Implementation

## Overview

Enhance the admin Profile Settings tab with comprehensive user account management capabilities. The current implementation only includes basic fields (Display Name, Email, Bio). This design adds security controls, language/region preferences, privacy options, and account management features.

## Current State

File: `src/app/(admin)/admin/settings/page.tsx`

The Profile tab currently contains:
- Display Name input
- Email input
- Bio textarea

This is insufficient for a production-ready admin panel.

## Design

### Overall Structure

The Profile tab will contain 6 expandable card sections:

1. **Basic Information** - Core profile details
2. **Security** - Password, 2FA, session management
3. **Language & Region** - Display and formatting preferences
4. **Privacy Preferences** - Visibility and data sharing controls
5. **Connected Accounts** - Third-party authentication links
6. **Account Actions** - Data export and account deletion

### 1. Basic Information Card

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Profile Photo | File upload | No | 1MB max, JPG/PNG, circular preview |
| Display Name | Text | Yes | Min 2 characters |
| Username/Handle | Text | Yes | URL-friendly, unique, used for @mentions |
| Email | Email | Yes | Read-only, verified badge |
| Bio | Textarea | No | Max 300 chars, character counter |
| Location | Text | No | City, Country (optional) |
| Website | URL | No | Portfolio or social link |

### 2. Security Card

#### Password & Authentication
- Change Password form (current, new, confirm)
- Two-Factor Auth toggle with setup wizard (QR code for authenticator apps)
- Backup codes display with "Generate new" option

#### Active Sessions
- Table with columns: Device/Browser, Location, Last Active, Current (badge)
- "Revoke all other sessions" button

#### Login History
- List of recent logins (last 20)
- Shows: timestamp, IP address, device, success/failed status

### 3. Language & Region Card

#### Display Settings
- Interface Language dropdown
- Date Format (MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD)
- Time Format (12-hour AM/PM, 24-hour)
- First Day of Week (Sunday, Monday)

#### Regional Settings
- Timezone dropdown with current time preview
- Currency Format (IDR decimals, symbol position)

#### Number Formatting
- Decimal separator (. or ,)
- Thousands separator

### 4. Privacy Preferences Card

#### Profile Visibility
- Make profile public/private toggle
- Show email on profile toggle
- Show location on profile toggle

#### Data & Communications
- Receive marketing emails toggle
- Receive product updates toggle
- Share anonymous usage data toggle
- Allow others to find me by email toggle

#### Account Privacy
- Activity visibility (everyone/only me/admins)
- Comment notifications toggle
- Message from unknown users toggle

### 5. Connected Accounts Card

- List of linked providers (Google, GitHub, etc.)
- Link new account button
- Unlink button per provider with confirmation

### 6. Account Actions Card

#### Data Export
- Export profile data button (JSON/CSV format)
- Last export date display

#### Account Deletion
- Delete account button with multi-step confirmation:
  1. Reason dropdown
  2. Re-authentication (password)
  3. "I understand" checkbox
  4. Final delete button

## Technical Considerations

### State Management
- Consider using React state for form inputs with debounced saves
- Use optimistic updates for non-critical settings
- Validation before submission with inline error messages

### File Upload (Profile Photo)
- Client-side validation (size, type)
- Preview image before upload
- Loading state during upload
- Error handling for failed uploads

### Security
- All password changes require current password
- 2FA setup requires re-authentication
- Session management requires server-side session tracking
- Rate limiting on password reset attempts

### Database Schema
- User table may need new columns:
  - `username` (unique)
  - `location`
  - `website`
  - `language_preference`
  - `timezone`
  - `two_factor_enabled`
  - `profile_image_url`
  - `privacy_settings` (JSON or separate table)
- Sessions table for active session tracking
- Login history table for audit log

### API Endpoints Needed
- `PUT /api/admin/profile` - Update basic info
- `POST /api/admin/profile/avatar` - Upload profile photo
- `POST /api/admin/profile/change-password` - Change password
- `POST /api/admin/profile/2fa/enable` - Enable 2FA
- `POST /api/admin/profile/2fa/disable` - Disable 2FA
- `GET /api/admin/profile/sessions` - List active sessions
- `DELETE /api/admin/profile/sessions/:id` - Revoke session
- `DELETE /api/admin/profile/sessions/others` - Revoke all others
- `GET /api/admin/profile/login-history` - List recent logins
- `POST /api/admin/profile/export` - Export data
- `DELETE /api/admin/profile/delete-account` - Delete account

## UI/UX Considerations

### Card Design
- Each section is a collapsible card with expand/collapse button
- Save button per card (not global) for focused actions
- Success toast after saving each section
- Loading states during async operations

### Accessibility
- All form inputs have associated labels
- Keyboard navigation support
- ARIA attributes for collapsible sections
- Focus management after actions

### Mobile Responsive
- Stack cards vertically on mobile
- Touch-friendly tap targets (44px min)
- Horizontal scroll for wide tables

## Success Criteria

- [ ] All 6 card sections implemented
- [ ] Form validation working for all inputs
- [ ] Profile photo upload with preview
- [ ] Password change with current password verification
- [ ] 2FA setup flow complete
- [ ] Active sessions display and revocation
- [ ] Login history display
- [ ] Language/region preferences persisted
- [ ] Privacy toggles functional
- [ ] Data export working
- [ ] Account deletion with proper confirmation flow
- [ ] Responsive design on mobile/tablet
- [ ] Dark mode compatibility

## Next Steps

This design document will be used to create a detailed implementation plan via the writing-plans skill.
