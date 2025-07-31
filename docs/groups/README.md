# Group Entity System Documentation

## Overview

The Group entity represents organizations, corporates, foundations, and other collective entities in the 14Trees system. Groups can have relationships across multiple modules and functionalities, making group management operations (like merging or deleting groups) require careful consideration of all dependencies.

This document provides a comprehensive overview of how groups are integrated throughout the system and the impact of group operations.

## Group Relationships Across the System

### 1. Trees Module 🌳

Groups can have **2 different relationships** with trees:

| Relationship | Description | Impact |
|-------------|-------------|---------|
| `mapped_to_group` | Trees that are mapped/booked to the group | Group owns these trees |
| `sponsored_by_group` | Trees sponsored by the group | Group is the financial sponsor |

### 2. Gift Card System 🎁

#### Gift Card Requests (1 relationship)
| Relationship | Description | Impact |
|-------------|-------------|---------|
| `group_id` | Gift card requests associated with the group | Group-related gift card activities |

### 3. Donations System 💰

#### Donations (1 relationship)
| Relationship | Description | Impact |
|-------------|-------------|---------|
| `group_id` | Donations associated with the group | Group's financial contributions |

### 4. Gift Redeem Transactions 🎁

#### Gift Redeem Transactions (1 relationship)
| Relationship | Description | Impact |
|-------------|-------------|---------|
| `group_id` | Gift redemption transactions for the group | Group's gift redemption activities |

### 5. Group Management 👥

#### Group Members
- **Relationship**: Users who are members of the group
- **Impact**: Group membership affects user permissions and organizational structure

### 6. Visits & Activities 📍

#### Visits
- **Relationship**: Site visits organized by or associated with the group
- **Impact**: Group's engagement and participation tracking



## Group Impact Analysis

### High Impact Operations
When performing operations like **group merging** or **group deletion**, the following relationships have high impact:

1. **Trees** - Affects ownership and sponsorship responsibilities
2. **Donations** - Affects financial records and attribution

### Medium Impact Operations
3. **Group Members** - Affects organizational structure and user permissions
4. **Gift Card Requests** - Affects gift card management and redemption rights
5. **Visits** - Affects engagement tracking and event participation

### Low Impact Operations
6. **Gift Redeem Transactions** - Affects redemption history

## API Endpoint for Group Impact Assessment

### GET `/api/groups/count/:group_id`

This endpoint provides a comprehensive count of all relationships a group has across the system.

#### Request
```
GET /api/groups/count/1
```

#### Response Structure
```json
{
  "trees": {
    "mapped_trees": 150,
    "sponsored_trees": 75
  },
  "gift_card_requests": 25,
  "donations": 45,
  "gift_redeem_transactions": 12,
  "group_members": 18,
  "visits": 8,
  "total_relationships": 321
}
```

#### Response Fields Explanation

| Field Category | Description | Use Case |
|---------------|-------------|-----------|
| `trees.mapped_trees` | Trees owned by the group | Understand tree ownership |
| `trees.sponsored_trees` | Trees sponsored by the group | Understand sponsorship commitments |
| `gift_card_requests` | Gift card requests for the group | Track gift card activities |
| `donations` | Donations associated with the group | Understand financial contributions |
| `gift_redeem_transactions` | Gift redemption activities | Track redemption history |
| `group_members` | Number of users in the group | Understand organizational size |
| `visits` | Group-organized visits | Track engagement activities |
| `total_relationships` | Sum of all relationships | Overall system impact assessment |

## Best Practices for Group Operations

### Before Group Deletion
1. **Check Total Relationships**: If `total_relationships > 0`, consider impact
2. **Review High-Impact Areas**: Focus on trees and donations
3. **Backup Data**: Ensure all group data is backed up
4. **Notify Stakeholders**: Inform group members and related parties
5. **Transfer Ownership**: Consider transferring trees and assets to another group

### Before Group Merging
1. **Compare Both Groups**: Get counts for both primary and secondary groups
2. **Identify Conflicts**: Look for overlapping relationships and memberships
3. **Plan Data Migration**: Decide how to handle conflicting data
4. **Member Notification**: Inform all group members about the merge
5. **Test in Staging**: Always test group merge operations first

### Monitoring Group Impact
- Use this API endpoint regularly to understand group engagement
- Track `total_relationships` over time to see group growth
- Monitor specific categories to understand group behavior patterns
- Identify inactive groups for potential cleanup

## System Dependencies

### Critical Dependencies
- **Trees Module**: Core functionality depends on group-tree relationships
- **Financial Module**: Donations require group attribution
- **User Management**: Group membership affects user permissions

### Administrative Dependencies
- **Visit Management**: Group visits and engagement tracking
- **Gift Card System**: Group-related gift card activities

## Group Types and Their Typical Relationships

### Corporate Groups
- **High**: Trees (mapped/sponsored), Donations
- **Medium**: Group Members, Visits
- **Low**: Gift Cards, Gift Redemptions

### Foundation Groups
- **High**: Trees (sponsored), Donations, Group Members
- **Medium**: Visits, Gift Card Requests
- **Low**: Gift Redemptions

### Community Groups
- **High**: Group Members, Visits
- **Medium**: Trees (mapped), Gift Cards
- **Low**: Donations

## Conclusion

The Group entity is integrated into the 14Trees system with **6+ different relationship types** across multiple modules. Any group management operation requires careful consideration of all these relationships to maintain data integrity and system functionality.

Use the `/api/groups/count/:group_id` endpoint to assess the full impact of group operations before executing them. This comprehensive view helps ensure that no critical relationships are overlooked during group management activities.

The group system is designed to support various organizational structures, from small community groups to large corporate sponsors, each with different relationship patterns and impact levels.