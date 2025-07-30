# User Entity System Documentation

## Overview

The User entity is one of the most interconnected entities in the 14Trees system. A single user can have relationships across multiple modules and functionalities, making user management operations (like merging or deleting users) complex and requiring careful consideration of all dependencies.

This document provides a comprehensive overview of how users are integrated throughout the system and the impact of user operations.

## User Relationships Across the System

### 1. Trees Module 🌳

Users can have **5 different relationships** with trees:

| Relationship | Description | Impact |
|-------------|-------------|---------|
| `mapped_to_user` | Trees that are mapped/booked to the user | User owns these trees |
| `sponsored_by_user` | Trees sponsored by the user | User is the financial sponsor |
| `assigned_to` | Trees assigned to the user for care/maintenance | User is responsible for tree care |
| `gifted_by` | Trees gifted by the user to others | User is the gift giver |
| `gifted_to` | Trees received as gifts by the user | User is the gift recipient |

### 2. Gift Card System 🎁

#### Gift Card Requests (4 roles)
| Role | Description | Impact |
|------|-------------|---------|
| `as_user` | User requesting gift cards | Primary requestor |
| `as_sponsor` | User sponsoring gift card requests | Financial sponsor |
| `as_creator` | User who created the request | Administrative role |
| `as_processor` | User who processed the request | Administrative role |

#### Gift Cards (2 relationships)
| Relationship | Description | Impact |
|-------------|-------------|---------|
| `gifted_to` | Gift cards received by the user | User owns the gift card |
| `assigned_to` | Gift cards assigned to the user | User manages the gift card |

#### Gift Request Users (2 roles)
| Role | Description | Impact |
|------|-------------|---------|
| `as_recipient` | User receiving gift requests | Beneficiary |
| `as_assignee` | User assigned to handle requests | Administrative role |

#### Gift Redeem Transactions (2 roles)
| Role | Description | Impact |
|------|-------------|---------|
| `as_recipient` | User receiving redeemed gifts | Beneficiary |
| `as_creator` | User who created the redemption | Administrative role |

### 3. Donations System 💰

#### Donations (3 roles)
| Role | Description | Impact |
|------|-------------|---------|
| `as_donor` | User making donations | Financial contributor |
| `as_processor` | User processing donations | Administrative role |
| `as_creator` | User who created donation records | Administrative role |

#### Donation Users (2 roles)
| Role | Description | Impact |
|------|-------------|---------|
| `as_assignee` | User assigned to handle donations | Administrative role |
| `as_recipient` | User receiving donation benefits | Beneficiary |

### 4. User Management 👥

#### User Groups
- **Relationship**: Members of groups
- **Impact**: User belongs to organizational groups, affects permissions and access

#### User Relations
| Relationship | Description | Impact |
|-------------|-------------|---------|
| `as_primary` | User is the primary in a relationship | Main relationship holder |
| `as_secondary` | User is the secondary in a relationship | Related party |

### 5. Visits & Activities 📍

#### Visit Users
- **Relationship**: Participation in site visits
- **Impact**: User's visit history and engagement tracking

#### Albums
- **Relationship**: Photo albums created by user
- **Impact**: User-generated content and memories

#### Events
- **Relationship**: Events assigned by the user
- **Impact**: User's administrative activities and event management

## User Impact Analysis

### High Impact Operations
When performing operations like **user merging** or **user deletion**, the following relationships have high impact:

1. **Trees** - Affects ownership, sponsorship, and care responsibilities
2. **Donations** - Affects financial records and attribution
3. **Gift Cards** - Affects gift card ownership and redemption rights

### Medium Impact Operations
4. **User Groups** - Affects organizational structure and permissions
5. **Albums** - Affects user-generated content
6. **Events** - Affects administrative records

### Low Impact Operations
7. **Visit Users** - Affects historical tracking
8. **User Relations** - Affects relationship mapping

## API Endpoint for User Impact Assessment

### GET `/api/trees/count/user/:user_id`

This endpoint provides a comprehensive count of all relationships a user has across the system.

#### Request
```
GET /api/trees/count/user/18009
```

#### Response Structure
```json
{
  "trees": {
    "mapped_trees": 25,
    "sponsored_trees": 12,
    "assigned_trees": 8,
    "gifted_trees": 5,
    "received_gift_trees": 3
  },
  "gift_card_requests": {
    "as_user": 10,
    "as_sponsor": 2,
    "as_creator": 0,
    "as_processor": 1
  },
  "gift_cards": {
    "gifted_to": 3,
    "assigned_to": 1
  },
  "gift_request_users": {
    "as_recipient": 5,
    "as_assignee": 0
  },
  "gift_redeem_transactions": {
    "as_recipient": 2,
    "as_creator": 0
  },
  "donations": {
    "as_donor": 15,
    "as_processor": 0,
    "as_creator": 0
  },
  "donation_users": {
    "as_assignee": 0,
    "as_recipient": 8
  },
  "user_groups": 3,
  "user_relations": {
    "as_secondary": 2,
    "as_primary": 1
  },
  "visit_users": 12,
  "albums": 4,
  "events_assigned_by": 0,
  "total_relationships": 102
}
```

#### Response Fields Explanation

| Field Category | Description | Use Case |
|---------------|-------------|-----------|
| `trees.*` | All tree-related relationships | Understand tree ownership and responsibilities |
| `gift_card_requests.*` | Gift card request involvement | Track gift card request history |
| `gift_cards.*` | Gift card ownership | Understand gift card assets |
| `gift_request_users.*` | Gift request participation | Track gift request involvement |
| `gift_redeem_transactions.*` | Gift redemption activity | Track redemption history |
| `donations.*` | Donation involvement | Understand financial contributions |
| `donation_users.*` | Donation user relationships | Track donation beneficiaries |
| `user_groups` | Group memberships | Understand organizational ties |
| `user_relations.*` | User relationship mapping | Track personal connections |
| `visit_users` | Visit participation | Understand engagement level |
| `albums` | Content creation | Track user-generated content |
| `events_assigned_by` | Event management | Track administrative activities |
| `total_relationships` | Sum of all relationships | Overall system impact assessment |

## Best Practices for User Operations

### Before User Deletion
1. **Check Total Relationships**: If `total_relationships > 0`, consider impact
2. **Review High-Impact Areas**: Focus on trees, donations, and gift cards
3. **Backup Data**: Ensure all user data is backed up
4. **Notify Stakeholders**: Inform relevant parties about the deletion

### Before User Merging
1. **Compare Both Users**: Get counts for both primary and secondary users
2. **Identify Conflicts**: Look for overlapping relationships
3. **Plan Data Migration**: Decide how to handle conflicting data
4. **Test in Staging**: Always test user merge operations first

### Monitoring User Impact
- Use this API endpoint regularly to understand user engagement
- Track `total_relationships` over time to see user growth
- Monitor specific categories to understand user behavior patterns

## System Dependencies

### Critical Dependencies
- **Trees Module**: Core functionality depends on user-tree relationships
- **Financial Module**: Donations and gift cards require user attribution
- **Content Module**: Albums and user-generated content

### Administrative Dependencies
- **User Management**: Groups and relations affect system access
- **Event Management**: Administrative activities tracking
- **Visit Tracking**: Engagement and participation metrics

## Conclusion

The User entity is deeply integrated into the 14Trees system with **13+ different relationship types** across multiple modules. Any user management operation requires careful consideration of all these relationships to maintain data integrity and system functionality.

Use the `/api/trees/count/user/:user_id` endpoint to assess the full impact of user operations before executing them. This comprehensive view helps ensure that no critical relationships are overlooked during user management activities.