# Adding New Modal Features to Gift Card System (End-to-End Guide)

This guide explains how to add new modal features to the gift card request system, covering both backend API development and frontend implementation. The modals are managed through the `GiftCardModals.tsx` component and integrated with the parent gift card management pages.

## Overview

The gift card system uses a full-stack architecture:
- **Backend**: Express.js API with TypeScript, Sequelize ORM, PostgreSQL database
- **Frontend**: React with TypeScript, Redux for state management, Material-UI components
- **API Integration**: RESTful API endpoints with proper error handling and validation

## End-to-End Implementation Steps

### Part 1: Backend Development

#### Step 1: Database Schema Changes (if needed)

If your new feature requires new database fields, update the database schema:

```sql
-- Example: Adding a new field to gift_card_request table
ALTER TABLE gift_card_request 
ADD COLUMN your_new_field VARCHAR(255) DEFAULT NULL;

-- Example: Creating a new table for complex features
CREATE TABLE gift_card_comments (
    id SERIAL PRIMARY KEY,
    gift_card_request_id INTEGER REFERENCES gift_card_request(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Step 2: Update Sequelize Models

Update or create Sequelize models in `apps/api/src/models/`:

```typescript
// Update existing model: apps/api/src/models/gift_card_request.ts
interface GiftCardRequestAttributes {
    // ... existing fields ...
    your_new_field?: string | null;
}

// Or create new model: apps/api/src/models/gift_card_comment.ts
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { GiftCardRequest } from './gift_card_request';
import { User } from './user';

export interface GiftCardCommentAttributes {
    id: number;
    gift_card_request_id: number;
    user_id: number;
    comment: string;
    created_at: Date;
    updated_at: Date;
}

export interface GiftCardCommentCreationAttributes extends Optional<GiftCardCommentAttributes, 'id' | 'created_at' | 'updated_at'> {}

@Table({
    tableName: 'gift_card_comments',
    timestamps: true,
    underscored: true,
})
export class GiftCardComment extends Model<GiftCardCommentAttributes, GiftCardCommentCreationAttributes> {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    id!: number;

    @ForeignKey(() => GiftCardRequest)
    @Column({ type: DataType.INTEGER, allowNull: false })
    gift_card_request_id!: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    user_id!: number;

    @Column({ type: DataType.TEXT, allowNull: false })
    comment!: string;

    @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
    created_at!: Date;

    @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
    updated_at!: Date;

    @BelongsTo(() => GiftCardRequest)
    giftCardRequest!: GiftCardRequest;

    @BelongsTo(() => User)
    user!: User;
}
```

#### Step 3: Create Repository Layer

Create or update repository in `apps/api/src/repo/`:

```typescript
// apps/api/src/repo/giftCardCommentsRepo.ts
import { GiftCardComment, GiftCardCommentCreationAttributes } from '../models/gift_card_comment';

export class GiftCardCommentsRepository {
    static async create(data: GiftCardCommentCreationAttributes): Promise<GiftCardComment> {
        return await GiftCardComment.create(data);
    }

    static async findByGiftCardRequestId(giftCardRequestId: number): Promise<GiftCardComment[]> {
        return await GiftCardComment.findAll({
            where: { gift_card_request_id: giftCardRequestId },
            include: ['user'],
            order: [['created_at', 'DESC']],
        });
    }

    static async update(id: number, data: Partial<GiftCardCommentCreationAttributes>): Promise<[number, GiftCardComment[]]> {
        return await GiftCardComment.update(data, {
            where: { id },
            returning: true,
        });
    }

    static async delete(id: number): Promise<number> {
        return await GiftCardComment.destroy({
            where: { id },
        });
    }
}
```

#### Step 4: Create Controller Methods

Add controller methods in `apps/api/src/controllers/giftCardController.ts`:

```typescript
// Import your repository
import { GiftCardCommentsRepository } from '../repo/giftCardCommentsRepo';

// Add controller methods
export const getGiftCardComments = async (req: Request, res: Response) => {
    try {
        const { giftCardRequestId } = req.params;
        const comments = await GiftCardCommentsRepository.findByGiftCardRequestId(parseInt(giftCardRequestId));
        res.status(status.success).send(comments);
    } catch (error: any) {
        await Logger.logError('giftCardController', 'getGiftCardComments', error, req);
        res.status(status.error).send({ error: error.message });
    }
};

export const createGiftCardComment = async (req: Request, res: Response) => {
    try {
        const { giftCardRequestId } = req.params;
        const { comment } = req.body;
        const userId = req.user?.id; // Assuming user is attached to request

        if (!comment || comment.trim() === '') {
            return res.status(status.bad).send({ error: 'Comment is required' });
        }

        const newComment = await GiftCardCommentsRepository.create({
            gift_card_request_id: parseInt(giftCardRequestId),
            user_id: userId,
            comment: comment.trim(),
        });

        res.status(status.success).send(newComment);
    } catch (error: any) {
        await Logger.logError('giftCardController', 'createGiftCardComment', error, req);
        res.status(status.error).send({ error: error.message });
    }
};

export const updateGiftCardComment = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;
        const { comment } = req.body;

        if (!comment || comment.trim() === '') {
            return res.status(status.bad).send({ error: 'Comment is required' });
        }

        const [affectedCount, updatedComments] = await GiftCardCommentsRepository.update(parseInt(commentId), {
            comment: comment.trim(),
        });

        if (affectedCount === 0) {
            return res.status(status.notfound).send({ error: 'Comment not found' });
        }

        res.status(status.success).send(updatedComments[0]);
    } catch (error: any) {
        await Logger.logError('giftCardController', 'updateGiftCardComment', error, req);
        res.status(status.error).send({ error: error.message });
    }
};

export const deleteGiftCardComment = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;
        const deletedCount = await GiftCardCommentsRepository.delete(parseInt(commentId));

        if (deletedCount === 0) {
            return res.status(status.notfound).send({ error: 'Comment not found' });
        }

        res.status(status.success).send({ message: 'Comment deleted successfully' });
    } catch (error: any) {
        await Logger.logError('giftCardController', 'deleteGiftCardComment', error, req);
        res.status(status.error).send({ error: error.message });
    }
};
```

#### Step 5: Add API Routes

Update `apps/api/src/routes/giftCardRoutes.ts`:

```typescript
import { verifyToken } from '../auth/verifyToken';

// Add your new routes
routes.get('/requests/:giftCardRequestId/comments', verifyToken, giftCards.getGiftCardComments);
routes.post('/requests/:giftCardRequestId/comments', verifyToken, giftCards.createGiftCardComment);
routes.put('/comments/:commentId', verifyToken, giftCards.updateGiftCardComment);
routes.delete('/comments/:commentId', verifyToken, giftCards.deleteGiftCardComment);
```

#### Step 6: Add Swagger Documentation

Add Swagger documentation for your new endpoints:

```typescript
/**
 * @swagger
 * /gift-cards/requests/{giftCardRequestId}/comments:
 *   get:
 *     summary: Get comments for a gift card request
 *     tags:
 *       - Gift Cards
 *     parameters:
 *       - name: giftCardRequestId
 *         in: path
 *         required: true
 *         type: integer
 *         description: Gift card request ID
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               comment:
 *                 type: string
 *               user:
 *                 type: object
 *               created_at:
 *                 type: string
 *                 format: date-time
 *   post:
 *     summary: Create a new comment for a gift card request
 *     tags:
 *       - Gift Cards
 *     parameters:
 *       - name: giftCardRequestId
 *         in: path
 *         required: true
 *         type: integer
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             comment:
 *               type: string
 *               description: The comment text
 *     responses:
 *       200:
 *         description: Comment created successfully
 *       400:
 *         description: Bad request
 */
```

### Part 2: Frontend Development

#### Step 7: Update TypeScript Types

Add or update types in `apps/frontend/src/types/`:

```typescript
// apps/frontend/src/types/gift_card.ts
export interface GiftCardComment {
    id: number;
    gift_card_request_id: number;
    user_id: number;
    comment: string;
    created_at: string;
    updated_at: string;
    user?: {
        id: number;
        name: string;
        email: string;
    };
}

export interface GiftCardCommentCreationRequest {
    comment: string;
}
```

#### Step 8: Update API Client

Add API methods in `apps/frontend/src/api/apiClient/apiClient.ts`:

```typescript
// Add to ApiClient class
async getGiftCardComments(giftCardRequestId: number): Promise<GiftCardComment[]> {
    try {
        const response = await this.api.get<GiftCardComment[]>(`/gift-cards/requests/${giftCardRequestId}/comments`);
        return response.data;
    } catch (error: any) {
        throw new Error(`Failed to fetch gift card comments: ${error.message}`);
    }
}

async createGiftCardComment(giftCardRequestId: number, comment: string): Promise<GiftCardComment> {
    try {
        const response = await this.api.post<GiftCardComment>(`/gift-cards/requests/${giftCardRequestId}/comments`, {
            comment
        });
        return response.data;
    } catch (error: any) {
        throw new Error(`Failed to create gift card comment: ${error.message}`);
    }
}

async updateGiftCardComment(commentId: number, comment: string): Promise<GiftCardComment> {
    try {
        const response = await this.api.put<GiftCardComment>(`/gift-cards/comments/${commentId}`, {
            comment
        });
        return response.data;
    } catch (error: any) {
        throw new Error(`Failed to update gift card comment: ${error.message}`);
    }
}

async deleteGiftCardComment(commentId: number): Promise<void> {
    try {
        await this.api.delete(`/gift-cards/comments/${commentId}`);
    } catch (error: any) {
        throw new Error(`Failed to delete gift card comment: ${error.message}`);
    }
}
```

#### Step 9: Create Redux Actions (if using Redux)

Add Redux actions in `apps/frontend/src/redux/actions/giftCardActions.ts`:

```typescript
// Action types
export const GET_GIFT_CARD_COMMENTS_REQUEST = 'GET_GIFT_CARD_COMMENTS_REQUEST';
export const GET_GIFT_CARD_COMMENTS_SUCCESS = 'GET_GIFT_CARD_COMMENTS_SUCCESS';
export const GET_GIFT_CARD_COMMENTS_FAILURE = 'GET_GIFT_CARD_COMMENTS_FAILURE';

export const CREATE_GIFT_CARD_COMMENT_REQUEST = 'CREATE_GIFT_CARD_COMMENT_REQUEST';
export const CREATE_GIFT_CARD_COMMENT_SUCCESS = 'CREATE_GIFT_CARD_COMMENT_SUCCESS';
export const CREATE_GIFT_CARD_COMMENT_FAILURE = 'CREATE_GIFT_CARD_COMMENT_FAILURE';

// Action creators
export const getGiftCardComments = (giftCardRequestId: number) => {
    return async (dispatch: any) => {
        dispatch({ type: GET_GIFT_CARD_COMMENTS_REQUEST });
        try {
            const comments = await apiClient.getGiftCardComments(giftCardRequestId);
            dispatch({ type: GET_GIFT_CARD_COMMENTS_SUCCESS, payload: comments });
        } catch (error: any) {
            dispatch({ type: GET_GIFT_CARD_COMMENTS_FAILURE, payload: error.message });
            toast.error('Failed to fetch comments');
        }
    };
};

export const createGiftCardComment = (giftCardRequestId: number, comment: string) => {
    return async (dispatch: any) => {
        dispatch({ type: CREATE_GIFT_CARD_COMMENT_REQUEST });
        try {
            const newComment = await apiClient.createGiftCardComment(giftCardRequestId, comment);
            dispatch({ type: CREATE_GIFT_CARD_COMMENT_SUCCESS, payload: newComment });
            toast.success('Comment added successfully');
            // Refresh comments
            dispatch(getGiftCardComments(giftCardRequestId));
        } catch (error: any) {
            dispatch({ type: CREATE_GIFT_CARD_COMMENT_FAILURE, payload: error.message });
            toast.error('Failed to add comment');
        }
    };
};
```

#### Step 10: Frontend Modal Implementation

Now follow the frontend modal implementation steps:

### Step 10.1: Define Modal State and Handlers

Add modal state and handlers to your parent component:

```typescript
// Add to your parent component state
const [commentsModal, setCommentsModal] = useState<boolean>(false);
const [comments, setComments] = useState<GiftCardComment[]>([]);
const [loadingComments, setLoadingComments] = useState<boolean>(false);

// Add handler functions
const handleCommentsModalOpen = async () => {
    if (selectedGiftCard) {
        setCommentsModal(true);
        setLoadingComments(true);
        try {
            const fetchedComments = await apiClient.getGiftCardComments(selectedGiftCard.id);
            setComments(fetchedComments);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
            toast.error('Failed to fetch comments');
        } finally {
            setLoadingComments(false);
        }
    }
};

const handleCommentsModalClose = () => {
    setCommentsModal(false);
    setComments([]);
};

const handleCommentsSubmit = async (comment: string) => {
    if (selectedGiftCard) {
        try {
            await apiClient.createGiftCardComment(selectedGiftCard.id, comment);
            toast.success('Comment added successfully');
            // Refresh comments
            const updatedComments = await apiClient.getGiftCardComments(selectedGiftCard.id);
            setComments(updatedComments);
        } catch (error) {
            console.error('Failed to add comment:', error);
            toast.error('Failed to add comment');
        }
    }
};
```

### Step 10.2: Update GiftCardModalsProps Interface

Add your new modal props to the interface:

```typescript
interface GiftCardModalsProps {
    // ... existing props ...
    
    // Comments Modal
    commentsModal: boolean;
    setCommentsModal: (open: boolean) => void;
    comments: GiftCardComment[];
    loadingComments: boolean;
    handleCommentsSubmit: (comment: string) => void;
}
```

### Step 10.3: Create Your Modal Component

Create a comprehensive comments modal component:

```typescript
// apps/frontend/src/pages/admin/gift/Components/GiftCardCommentsModal.tsx
import React, { useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    Typography,
    Box,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    Divider,
    Avatar,
    IconButton,
} from '@mui/material';
import { Send as SendIcon, Person as PersonIcon } from '@mui/icons-material';
import { GiftCardComment } from '../../../../types/gift_card';
import { formatDistanceToNow } from 'date-fns';

interface GiftCardCommentsModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (comment: string) => void;
    comments: GiftCardComment[];
    loading: boolean;
    selectedGiftCard?: any;
}

const GiftCardCommentsModal: React.FC<GiftCardCommentsModalProps> = ({
    open,
    onClose,
    onSubmit,
    comments,
    loading,
    selectedGiftCard,
}) => {
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!newComment.trim()) return;
        
        setSubmitting(true);
        try {
            await onSubmit(newComment.trim());
            setNewComment('');
        } finally {
            setSubmitting(false);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
            handleSubmit();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>
                Comments - {selectedGiftCard?.request_id}
            </DialogTitle>
            <DialogContent dividers>
                <Box sx={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                    {/* Comments List */}
                    <Box sx={{ flex: 1, mb: 2 }}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : comments.length === 0 ? (
                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                                No comments yet. Be the first to add a comment!
                            </Typography>
                        ) : (
                            <List>
                                {comments.map((comment, index) => (
                                    <React.Fragment key={comment.id}>
                                        <ListItem alignItems="flex-start">
                                            <Avatar sx={{ mr: 2 }}>
                                                <PersonIcon />
                                            </Avatar>
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography variant="subtitle2" component="span">
                                                            {comment.user?.name || 'Unknown User'}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                                        </Typography>
                                                    </Box>
                                                }
                                                secondary={
                                                    <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                                                        {comment.comment}
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                        {index < comments.length - 1 && <Divider variant="inset" component="li" />}
                                    </React.Fragment>
                                ))}
                            </List>
                        )}
                    </Box>

                    {/* Add Comment Form */}
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            variant="outlined"
                            label="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={submitting}
                            placeholder="Press Ctrl+Enter to submit"
                        />
                        <IconButton
                            color="primary"
                            onClick={handleSubmit}
                            disabled={!newComment.trim() || submitting}
                            sx={{ mb: 0.5 }}
                        >
                            {submitting ? <CircularProgress size={24} /> : <SendIcon />}
                        </IconButton>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary" variant="outlined">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default GiftCardCommentsModal;
```

### Step 10.4: Update GiftCardModals Component

Add your new modal to the JSX:

```typescript
// Add import
import GiftCardCommentsModal from './GiftCardCommentsModal';

// Add to destructured parameters
export const GiftCardModals: React.FC<GiftCardModalsProps> = ({
    // ... existing props ...
    commentsModal,
    setCommentsModal,
    comments,
    loadingComments,
    handleCommentsSubmit,
}) => {
    return (
        <>
            {/* ... existing modals ... */}
            
            {/* Comments Modal */}
            <GiftCardCommentsModal
                open={commentsModal}
                onClose={() => setCommentsModal(false)}
                onSubmit={handleCommentsSubmit}
                comments={comments}
                loading={loadingComments}
                selectedGiftCard={selectedGiftCard}
            />
        </>
    );
};
```

### Step 10.5: Pass Props from Parent Component

Update your parent component to pass the new modal props:

```typescript
<GiftCardModals
    // ... existing props ...
    commentsModal={commentsModal}
    setCommentsModal={setCommentsModal}
    comments={comments}
    loadingComments={loadingComments}
    handleCommentsSubmit={handleCommentsSubmit}
/>
```

### Step 10.6: Add Trigger Button

Add a button to trigger your modal:

```typescript
<Button
    variant="outlined"
    color="primary"
    onClick={handleCommentsModalOpen}
    startIcon={<CommentIcon />}
    disabled={!selectedGiftCard}
>
    Comments ({comments.length})
</Button>
```

## Part 3: Testing and Integration

### Step 11: Backend Testing

Create comprehensive tests for your API endpoints:

```typescript
// apps/api/src/tests/giftCardComments.test.ts
import request from 'supertest';
import app from '../server';

describe('Gift Card Comments API', () => {
    let authToken: string;
    let giftCardRequestId: number;
    let commentId: number;

    beforeAll(async () => {
        // Setup test data and authentication
        authToken = await getTestAuthToken();
        giftCardRequestId = await createTestGiftCardRequest();
    });

    afterAll(async () => {
        // Cleanup test data
        await cleanupTestData();
    });

    describe('GET /gift-cards/requests/:giftCardRequestId/comments', () => {
        it('should fetch comments for a gift card request', async () => {
            const response = await request(app)
                .get(`/gift-cards/requests/${giftCardRequestId}/comments`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });

        it('should return 404 for non-existent gift card request', async () => {
            await request(app)
                .get(`/gift-cards/requests/999999/comments`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404);
        });
    });

    describe('POST /gift-cards/requests/:giftCardRequestId/comments', () => {
        it('should create a new comment', async () => {
            const commentData = {
                comment: 'Test comment for integration'
            };

            const response = await request(app)
                .post(`/gift-cards/requests/${giftCardRequestId}/comments`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(commentData)
                .expect(200);

            expect(response.body.comment).toBe(commentData.comment);
            expect(response.body.gift_card_request_id).toBe(giftCardRequestId);
            commentId = response.body.id;
        });

        it('should return 400 for empty comment', async () => {
            const commentData = {
                comment: ''
            };

            await request(app)
                .post(`/gift-cards/requests/${giftCardRequestId}/comments`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(commentData)
                .expect(400);
        });

        it('should return 401 for unauthorized request', async () => {
            const commentData = {
                comment: 'Test comment'
            };

            await request(app)
                .post(`/gift-cards/requests/${giftCardRequestId}/comments`)
                .send(commentData)
                .expect(401);
        });
    });

    describe('PUT /gift-cards/comments/:commentId', () => {
        it('should update an existing comment', async () => {
            const updatedData = {
                comment: 'Updated test comment'
            };

            const response = await request(app)
                .put(`/gift-cards/comments/${commentId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updatedData)
                .expect(200);

            expect(response.body.comment).toBe(updatedData.comment);
        });

        it('should return 404 for non-existent comment', async () => {
            await request(app)
                .put(`/gift-cards/comments/999999`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ comment: 'Updated comment' })
                .expect(404);
        });
    });

    describe('DELETE /gift-cards/comments/:commentId', () => {
        it('should delete a comment', async () => {
            await request(app)
                .delete(`/gift-cards/comments/${commentId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);
        });

        it('should return 404 for non-existent comment', async () => {
            await request(app)
                .delete(`/gift-cards/comments/999999`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404);
        });
    });
});
```

### Step 12: Frontend Component Testing

Create tests for your React components:

```typescript
// apps/frontend/src/components/GiftCardCommentsModal.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import GiftCardCommentsModal from './GiftCardCommentsModal';
import { store } from '../redux/store';

const mockComments = [
    {
        id: 1,
        gift_card_request_id: 1,
        user_id: 1,
        comment: 'Test comment 1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: { id: 1, name: 'Test User', email: 'test@example.com' }
    },
    {
        id: 2,
        gift_card_request_id: 1,
        user_id: 2,
        comment: 'Test comment 2',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: { id: 2, name: 'Another User', email: 'another@example.com' }
    }
];

describe('GiftCardCommentsModal', () => {
    const mockProps = {
        open: true,
        onClose: jest.fn(),
        onSubmit: jest.fn(),
        comments: mockComments,
        loading: false,
        selectedGiftCard: { id: 1, request_id: 'GR-123' }
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders modal when open', () => {
        render(
            <Provider store={store}>
                <GiftCardCommentsModal {...mockProps} />
            </Provider>
        );

        expect(screen.getByText('Comments - GR-123')).toBeInTheDocument();
    });

    it('displays existing comments', () => {
        render(
            <Provider store={store}>
                <GiftCardCommentsModal {...mockProps} />
            </Provider>
        );

        expect(screen.getByText('Test comment 1')).toBeInTheDocument();
        expect(screen.getByText('Test comment 2')).toBeInTheDocument();
        expect(screen.getByText('Test User')).toBeInTheDocument();
        expect(screen.getByText('Another User')).toBeInTheDocument();
    });

    it('shows loading state', () => {
        render(
            <Provider store={store}>
                <GiftCardCommentsModal {...mockProps} loading={true} />
            </Provider>
        );

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('shows empty state when no comments', () => {
        render(
            <Provider store={store}>
                <GiftCardCommentsModal {...mockProps} comments={[]} />
            </Provider>
        );

        expect(screen.getByText('No comments yet. Be the first to add a comment!')).toBeInTheDocument();
    });

    it('submits comment when form is submitted', async () => {
        render(
            <Provider store={store}>
                <GiftCardCommentsModal {...mockProps} />
            </Provider>
        );

        const commentInput = screen.getByLabelText('Add a comment...');
        const submitButton = screen.getByRole('button', { name: /send/i });

        fireEvent.change(commentInput, { target: { value: 'New test comment' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockProps.onSubmit).toHaveBeenCalledWith('New test comment');
        });
    });

    it('submits comment with Ctrl+Enter', async () => {
        render(
            <Provider store={store}>
                <GiftCardCommentsModal {...mockProps} />
            </Provider>
        );

        const commentInput = screen.getByLabelText('Add a comment...');
        
        fireEvent.change(commentInput, { target: { value: 'Keyboard shortcut comment' } });
        fireEvent.keyPress(commentInput, { key: 'Enter', ctrlKey: true });

        await waitFor(() => {
            expect(mockProps.onSubmit).toHaveBeenCalledWith('Keyboard shortcut comment');
        });
    });

    it('disables submit button when comment is empty', () => {
        render(
            <Provider store={store}>
                <GiftCardCommentsModal {...mockProps} />
            </Provider>
        );

        const submitButton = screen.getByRole('button', { name: /send/i });
        expect(submitButton).toBeDisabled();
    });

    it('calls onClose when close button is clicked', () => {
        render(
            <Provider store={store}>
                <GiftCardCommentsModal {...mockProps} />
            </Provider>
        );

        const closeButton = screen.getByText('Close');
        fireEvent.click(closeButton);

        expect(mockProps.onClose).toHaveBeenCalled();
    });
});
```

### Step 13: Integration Testing

Test the complete end-to-end flow:

```typescript
// apps/frontend/src/integration/giftCardComments.integration.test.ts
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import GiftCardManagementPage from '../pages/admin/gift/GiftCardManagementPage';
import { store } from '../redux/store';
import { server } from '../mocks/server';
import { rest } from 'msw';

// Mock API responses
const mockGiftCardRequests = [
    {
        id: 1,
        request_id: 'GR-123',
        user_email: 'test@example.com',
        no_of_cards: 5,
        status: 'pending_assignment'
    }
];

const mockComments = [
    {
        id: 1,
        gift_card_request_id: 1,
        user_id: 1,
        comment: 'Initial comment',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: { id: 1, name: 'Test User', email: 'test@example.com' }
    }
];

describe('Gift Card Comments Integration', () => {
    beforeEach(() => {
        // Setup API mocks
        server.use(
            rest.post('/gift-cards/requests/get', (req, res, ctx) => {
                return res(ctx.json({ results: mockGiftCardRequests, totalResults: 1 }));
            }),
            rest.get('/gift-cards/requests/:id/comments', (req, res, ctx) => {
                return res(ctx.json(mockComments));
            }),
            rest.post('/gift-cards/requests/:id/comments', (req, res, ctx) => {
                const { comment } = req.body;
                return res(ctx.json({
                    id: 2,
                    gift_card_request_id: 1,
                    user_id: 1,
                    comment,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    user: { id: 1, name: 'Test User', email: 'test@example.com' }
                }));
            })
        );
    });

    it('should allow viewing and adding comments to a gift card request', async () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <GiftCardManagementPage />
                </BrowserRouter>
            </Provider>
        );

        // Wait for gift card requests to load
        await waitFor(() => {
            expect(screen.getByText('GR-123')).toBeInTheDocument();
        });

        // Select a gift card request
        const giftCardRow = screen.getByText('GR-123').closest('tr');
        fireEvent.click(giftCardRow);

        // Open comments modal
        const commentsButton = screen.getByText(/comments/i);
        fireEvent.click(commentsButton);

        // Verify modal opens with existing comments
        await waitFor(() => {
            expect(screen.getByText('Comments - GR-123')).toBeInTheDocument();
            expect(screen.getByText('Initial comment')).toBeInTheDocument();
        });

        // Add new comment
        const commentInput = screen.getByLabelText('Add a comment...');
        fireEvent.change(commentInput, { target: { value: 'Integration test comment' } });
        
        const submitButton = screen.getByRole('button', { name: /send/i });
        fireEvent.click(submitButton);

        // Verify comment was added
        await waitFor(() => {
            expect(screen.getByText('Integration test comment')).toBeInTheDocument();
        });

        // Close modal
        const closeButton = screen.getByText('Close');
        fireEvent.click(closeButton);

        // Verify modal closes
        await waitFor(() => {
            expect(screen.queryByText('Comments - GR-123')).not.toBeInTheDocument();
        });
    });

    it('should handle API errors gracefully', async () => {
        // Mock API error
        server.use(
            rest.get('/gift-cards/requests/:id/comments', (req, res, ctx) => {
                return res(ctx.status(500), ctx.json({ error: 'Internal server error' }));
            })
        );

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <GiftCardManagementPage />
                </BrowserRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('GR-123')).toBeInTheDocument();
        });

        const giftCardRow = screen.getByText('GR-123').closest('tr');
        fireEvent.click(giftCardRow);

        const commentsButton = screen.getByText(/comments/i);
        fireEvent.click(commentsButton);

        // Verify error handling
        await waitFor(() => {
            expect(screen.getByText(/failed to fetch comments/i)).toBeInTheDocument();
        });
    });
});
```

### Step 14: Deployment Preparation

#### Database Migration

Create migration script:

```sql
-- apps/api/migrations/add_gift_card_comments_table.sql
CREATE TABLE gift_card_comments (
    id SERIAL PRIMARY KEY,
    gift_card_request_id INTEGER REFERENCES gift_card_request(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better performance
CREATE INDEX idx_gift_card_comments_request_id ON gift_card_comments(gift_card_request_id);
CREATE INDEX idx_gift_card_comments_user_id ON gift_card_comments(user_id);
CREATE INDEX idx_gift_card_comments_created_at ON gift_card_comments(created_at);
```

#### Environment Configuration

Update environment variables if needed:

```env
# .env.example
# Add any new environment variables your feature requires
FEATURE_COMMENTS_ENABLED=true
COMMENTS_MAX_LENGTH=1000
```

#### Documentation Updates

Update API documentation and user guides:

```markdown
# API Documentation Update
## Comments Endpoints

### GET /gift-cards/requests/:id/comments
Retrieves all comments for a specific gift card request.

**Parameters:**
- `id` (path): Gift card request ID

**Response:**
- `200`: Array of comment objects
- `404`: Gift card request not found
- `401`: Unauthorized

### POST /gift-cards/requests/:id/comments
Creates a new comment for a gift card request.

**Parameters:**
- `id` (path): Gift card request ID
- `comment` (body): Comment text

**Response:**
- `200`: Created comment object
- `400`: Invalid comment data
- `401`: Unauthorized
```

## Best Practices Summary

### 1. Error Handling
- Implement proper error handling at all levels
- Use consistent error messages and status codes
- Log errors for debugging
- Show user-friendly error messages in UI

### 2. Performance Optimization
- Use database indexes for frequently queried fields
- Implement pagination for large datasets
- Use loading states in UI
- Optimize API responses (only return needed fields)

### 3. Security
- Validate all input data
- Use proper authentication and authorization
- Sanitize user input to prevent XSS
- Implement rate limiting for API endpoints

### 4. Testing
- Write comprehensive unit tests
- Create integration tests for end-to-end flows
- Test error scenarios and edge cases
- Use meaningful test data and scenarios

### 5. Documentation
- Document API endpoints with Swagger
- Create user guides for new features
- Update README files
- Include code examples

### 6. Code Quality
- Follow TypeScript best practices
- Use consistent naming conventions
- Write clean, readable code
- Implement proper separation of concerns

Remember to follow the existing patterns in the codebase and maintain consistency with the current implementations. This end-to-end approach ensures that your new modal feature is properly integrated throughout the entire application stack.
            toast.success('Comment added successfully');
            // Refresh comments
            dispatch(getGiftCardComments(giftCardRequestId));
        } catch (error: any) {
            dispatch({ type: CREATE_GIFT_CARD_COMMENT_FAILURE, payload: error.message });
            toast.error('Failed to add comment');
        }
    };
};
```

#### Step 10: Frontend Modal Implementation

Now follow the original frontend steps (Step 1-6 from the original guide) to implement the modal interface.

### Part 3: Testing and Integration

#### Step 11: Backend Testing

Create tests for your API endpoints:

```typescript
// apps/api/src/tests/giftCardComments.test.ts
import request from 'supertest';
import app from '../server';

describe('Gift Card Comments API', () => {
    let authToken: string;
    let giftCardRequestId: number;

    beforeAll(async () => {
        // Setup test data and authentication
        authToken = await getTestAuthToken();
        giftCardRequestId = await createTestGiftCardRequest();
    });

    describe('GET /gift-cards/requests/:giftCardRequestId/comments', () => {
        it('should fetch comments for a gift card request', async () => {
            const response = await request(app)
                .get(`/gift-cards/requests/${giftCardRequestId}/comments`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe('POST /gift-cards/requests/:giftCardRequestId/comments', () => {
        it('should create a new comment', async () => {
            const commentData = {
                comment: 'Test comment'
            };

            const response = await request(app)
                .post(`/gift-cards/requests/${giftCardRequestId}/comments`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(commentData)
                .expect(200);

            expect(response.body.comment).toBe(commentData.comment);
        });

        it('should return 400 for empty comment', async () => {
            const commentData = {
                comment: ''
            };

            await request(app)
                .post(`/gift-cards/requests/${giftCardRequestId}/comments`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(commentData)
                .expect(400);
        });
    });
});
```

#### Step 12: Frontend Testing

Create tests for your React components:

```typescript
// apps/frontend/src/components/GiftCardComments.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import GiftCardCommentsModal from './GiftCardCommentsModal';
import { store } from '../redux/store';

describe('GiftCardCommentsModal', () => {
    const mockProps = {
        open: true,
        onClose: jest.fn(),
        giftCardRequestId: 1,
        onSubmit: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders modal when open', () => {
        render(
            <Provider store={store}>
                <GiftCardCommentsModal {...mockProps} />
            </Provider>
        );

        expect(screen.getByText('Comments')).toBeInTheDocument();
    });

    it('submits comment when form is submitted', async () => {
        render(
            <Provider store={store}>
                <GiftCardCommentsModal {...mockProps} />
            </Provider>
        );

        const commentInput = screen.getByLabelText('Add Comment');
        const submitButton = screen.getByText('Add Comment');

        fireEvent.change(commentInput, { target: { value: 'Test comment' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockProps.onSubmit).toHaveBeenCalledWith('Test comment');
        });
    });
});
```

#### Step 13: Integration Testing

Test the complete flow:

```typescript
// apps/frontend/src/integration/giftCardComments.integration.test.ts
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import GiftCardManagementPage from '../pages/admin/gift/GiftCardManagementPage';
import { store } from '../redux/store';

describe('Gift Card Comments Integration', () => {
    it('should allow adding comments to a gift card request', async () => {
        render(
            <Provider store={store}>
                <GiftCardManagementPage />
            </Provider>
        );

        // Open comments modal
        const commentsButton = screen.getByText('Comments');
        fireEvent.click(commentsButton);

        // Add comment
        const commentInput = screen.getByLabelText('Add Comment');
        fireEvent.change(commentInput, { target: { value: 'Integration test comment' } });
        
        const submitButton = screen.getByText('Add Comment');
        fireEvent.click(submitButton);

        // Verify comment appears
        await waitFor(() => {
            expect(screen.getByText('Integration test comment')).toBeInTheDocument();
        });
    });
});
```

### Part 4: Step-by-Step Frontend Modal Implementation

### Step 1: Define Modal State and Handlers

First, add the modal state and handlers to your parent component (e.g., gift card admin page):

```typescript
// Add to your parent component state
const [yourNewModal, setYourNewModal] = useState<boolean>(false);

// Add handler functions
const handleYourNewModalOpen = () => {
    setYourNewModal(true);
};

const handleYourNewModalClose = () => {
    setYourNewModal(false);
};

const handleYourNewModalSubmit = (data: YourDataType) => {
    // Handle modal submission logic
    console.log('Modal submitted with data:', data);
    setYourNewModal(false);
    // Refresh data or update state as needed
};
```

### Step 2: Update GiftCardModalsProps Interface

Add your new modal props to the `GiftCardModalsProps` interface in `GiftCardModals.tsx`:

```typescript
interface GiftCardModalsProps {
    // ... existing props ...
    
    // Your New Modal
    yourNewModal: boolean;
    setYourNewModal: (open: boolean) => void;
    handleYourNewModalSubmit: (data: YourDataType) => void;
    // Add any additional props needed by your modal
}
```

### Step 3: Create Your Modal Component

#### Option A: Simple Inline Modal (for basic forms/confirmations)

Add directly to the JSX in `GiftCardModals.tsx`:

```typescript
{/* Your New Modal */}
<Dialog open={yourNewModal} onClose={() => setYourNewModal(false)} fullWidth maxWidth="md">
    <DialogTitle>Your Modal Title</DialogTitle>
    <DialogContent dividers>
        {/* Your modal content */}
        <Typography variant="body1">
            Your modal content goes here
        </Typography>
        {/* Add form fields, inputs, etc. */}
    </DialogContent>
    <DialogActions>
        <Button onClick={() => setYourNewModal(false)} color="error" variant="outlined">
            Cancel
        </Button>
        <Button onClick={() => handleYourNewModalSubmit(data)} color="success" variant="contained">
            Submit
        </Button>
    </DialogActions>
</Dialog>
```

#### Option B: Complex Modal Component (for advanced features)

Create a separate component file:

```typescript
// Create: apps/frontend/src/pages/admin/gift/Components/YourNewModal.tsx
import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

interface YourNewModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: YourDataType) => void;
    // Add other props as needed
    selectedGiftCard?: GiftCard | null;
}

const YourNewModal: React.FC<YourNewModalProps> = ({
    open,
    onClose,
    onSubmit,
    selectedGiftCard
}) => {
    const [formData, setFormData] = useState<YourDataType>({});

    const handleSubmit = () => {
        onSubmit(formData);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Your Modal Title</DialogTitle>
            <DialogContent dividers>
                {/* Your complex modal content */}
                {/* Forms, tables, complex UI components */}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="error" variant="outlined">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="success" variant="contained">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default YourNewModal;
```

Then import and use it in `GiftCardModals.tsx`:

```typescript
// Add import at top of file
import YourNewModal from './YourNewModal';

// Add to JSX
<YourNewModal
    open={yourNewModal}
    onClose={handleYourNewModalClose}
    onSubmit={handleYourNewModalSubmit}
    selectedGiftCard={selectedGiftCard}
/>
```

### Step 4: Update GiftCardModals Component

Add your new modal props to the destructured parameters and JSX:

```typescript
export const GiftCardModals: React.FC<GiftCardModalsProps> = ({
    // ... existing props ...
    yourNewModal,
    setYourNewModal,
    handleYourNewModalSubmit,
}) => {
    return (
        <>
            {/* ... existing modals ... */}
            
            {/* Your New Modal - add at appropriate position */}
            {/* Modal JSX goes here */}
        </>
    );
};
```

### Step 5: Pass Props from Parent Component

Update your parent component to pass the new modal props:

```typescript
<GiftCardModals
    // ... existing props ...
    yourNewModal={yourNewModal}
    setYourNewModal={setYourNewModal}
    handleYourNewModalSubmit={handleYourNewModalSubmit}
/>
```

### Step 6: Add Trigger Button/Action

Add a button or action to trigger your modal in the parent component:

```typescript
<Button
    variant="outlined"
    color="primary"
    onClick={handleYourNewModalOpen}
    startIcon={<YourIcon />}
>
    Open Your Modal
</Button>
```

## Best Practices

### 1. Modal Naming Convention
- Use descriptive names: `userDetailsEditModal`, `emailConfirmationModal`
- Follow camelCase convention
- Include "Modal" suffix for clarity

### 2. State Management
- Keep modal state in parent component
- Pass handlers as props rather than managing state in modal
- Use controlled components pattern

### 3. Data Handling
- Validate data before submission
- Handle loading states appropriately
- Provide user feedback for actions

### 4. UI/UX Guidelines
- Use consistent button colors and positions
- Provide clear modal titles
- Include cancel/close options
- Use appropriate modal sizes (`sm`, `md`, `lg`, `xl`)

### 5. Error Handling
```typescript
const handleYourNewModalSubmit = async (data: YourDataType) => {
    try {
        setLoading(true);
        await yourApiCall(data);
        setYourNewModal(false);
        // Success notification
    } catch (error) {
        console.error('Modal submission failed:', error);
        // Error notification
    } finally {
        setLoading(false);
    }
};
```

### 6. TypeScript Types
- Define proper interfaces for your data types
- Use optional props where appropriate
- Extend existing types when possible

## Common Modal Patterns

### Confirmation Modal
```typescript
// Simple yes/no confirmation
<Dialog open={confirmModal} onClose={() => setConfirmModal(false)}>
    <DialogTitle>Confirm Action</DialogTitle>
    <DialogContent>
        <Typography>Are you sure you want to perform this action?</Typography>
    </DialogContent>
    <DialogActions>
        <Button onClick={() => setConfirmModal(false)}>Cancel</Button>
        <Button onClick={handleConfirmAction} color="error">Confirm</Button>
    </DialogActions>
</Dialog>
```

### Form Modal
```typescript
// Modal with form inputs
<Dialog open={formModal} onClose={() => setFormModal(false)}>
    <DialogTitle>Edit Details</DialogTitle>
    <DialogContent>
        <TextField
            fullWidth
            label="Field Name"
            value={fieldValue}
            onChange={(e) => setFieldValue(e.target.value)}
            margin="normal"
        />
    </DialogContent>
    <DialogActions>
        <Button onClick={() => setFormModal(false)}>Cancel</Button>
        <Button onClick={handleFormSubmit}>Save</Button>
    </DialogActions>
</Dialog>
```

## Testing Your Modal

1. **Functional Testing**
   - Test opening and closing modal
   - Verify form submission
   - Check data validation
   - Test error scenarios

2. **Integration Testing**
   - Ensure modal integrates properly with parent component
   - Verify data flow between components
   - Test modal state management

3. **UI Testing**
   - Check modal positioning and sizing
   - Verify responsive design
   - Test accessibility features

## Example: Adding a Comments Modal

Here's a complete example of adding a comments modal:

```typescript
// 1. Parent component state
const [commentsModal, setCommentsModal] = useState(false);
const [comments, setComments] = useState<string>('');

// 2. Handler functions
const handleCommentsModalOpen = () => {
    setComments(selectedGiftCard?.comments || '');
    setCommentsModal(true);
};

const handleCommentsSubmit = async (newComments: string) => {
    try {
        await updateGiftCardComments(selectedGiftCard?.id, newComments);
        setCommentsModal(false);
        getGiftCardData(); // Refresh data
    } catch (error) {
        console.error('Failed to update comments:', error);
    }
};

// 3. Modal JSX in GiftCardModals.tsx
<Dialog open={commentsModal} onClose={() => setCommentsModal(false)} fullWidth maxWidth="md">
    <DialogTitle>Edit Comments</DialogTitle>
    <DialogContent dividers>
        <TextField
            fullWidth
            multiline
            rows={4}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add your comments here..."
        />
    </DialogContent>
    <DialogActions>
        <Button onClick={() => setCommentsModal(false)} color="error" variant="outlined">
            Cancel
        </Button>
        <Button onClick={() => handleCommentsSubmit(comments)} color="success" variant="contained">
            Save Comments
        </Button>
    </DialogActions>
</Dialog>
```

## Troubleshooting

### Common Issues

1. **Modal not opening**: Check boolean state and handler functions
2. **Props not passing**: Verify interface definition and prop passing
3. **State not updating**: Ensure proper state management in parent component
4. **Styling issues**: Check MUI Dialog props and custom CSS

### Debug Tips

1. Add console logs to track modal state changes
2. Use React DevTools to inspect component props and state
3. Check browser console for TypeScript errors
4. Test modal in isolation before integration

Remember to follow the existing patterns in the codebase and maintain consistency with the current modal implementations.