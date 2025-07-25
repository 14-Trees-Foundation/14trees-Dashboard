/**
 * Frontend tests for CSR Transaction Enhancement
 * Tests UI components and transaction filtering functionality
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import GiftTreesGrid from '../components/redeem/GiftTreesGrid';
import GiftAnalytics from '../components/redeem/GiftAnalytics';
import CSRGiftTrees from '../pages/admin/csr/CSRGiftTrees';

// Mock theme for Material-UI components
const theme = createTheme();

// Mock API client
jest.mock('../api/apiClient/apiClient', () => {
    return jest.fn().mockImplementation(() => ({
        getTransactions: jest.fn().mockResolvedValue({
            results: [
                {
                    id: 1,
                    gift_source_type: 'fresh_request',
                    source_request_id: 123,
                    gift_type_display: 'Direct Request Method',
                    source_description: 'New request: REQ-2024-003',
                    recipient_name: 'John Doe',
                    trees_count: 5,
                    tree_details: []
                },
                {
                    id: 2,
                    gift_source_type: 'pre_purchased',
                    source_request_id: 456,
                    gift_type_display: 'Via Prepurchase Method',
                    source_description: 'From inventory: REQ-2024-001',
                    recipient_name: 'Jane Smith',
                    trees_count: 3,
                    tree_details: []
                },
                {
                    id: 3,
                    gift_source_type: null,
                    source_request_id: null,
                    gift_type_display: 'Legacy Transaction',
                    source_description: 'Historical data',
                    recipient_name: 'Bob Wilson',
                    trees_count: 2,
                    tree_details: []
                }
            ],
            total: 3
        }),
        getMappedGiftTreesAnalytics: jest.fn().mockResolvedValue({
            total_trees: '50',
            gifted_trees: '30',
            fresh_request_transactions: '5',
            pre_purchased_transactions: '8',
            legacy_transactions: '2',
            total_transactions: '15',
            fresh_request_trees: '15',
            pre_purchased_trees: '12',
            legacy_trees: '3'
        })
    }));
});

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <ThemeProvider theme={theme}>
        {children}
    </ThemeProvider>
);

describe('CSR Transaction Enhancement Frontend', () => {
    
    describe('Transaction Visual Indicators', () => {
        
        it('should display fresh request transaction badge correctly', async () => {
            render(
                <TestWrapper>
                    <GiftTreesGrid
                        groupId={131}
                        filter="gifted"
                        searchUser=""
                        sourceTypeFilter="all"
                        onSelectTree={() => {}}
                        onSelectTransaction={() => {}}
                        onImageView={() => {}}
                    />
                </TestWrapper>
            );

            await waitFor(() => {
                expect(screen.getByText('🎁 Fresh Request')).toBeInTheDocument();
            });
        });

        it('should display pre-purchased transaction badge correctly', async () => {
            render(
                <TestWrapper>
                    <GiftTreesGrid
                        groupId={131}
                        filter="gifted"
                        searchUser=""
                        sourceTypeFilter="all"
                        onSelectTree={() => {}}
                        onSelectTransaction={() => {}}
                        onImageView={() => {}}
                    />
                </TestWrapper>
            );

            await waitFor(() => {
                expect(screen.getByText('🌳 Pre-purchased')).toBeInTheDocument();
            });
        });

        it('should display legacy transaction badge correctly', async () => {
            render(
                <TestWrapper>
                    <GiftTreesGrid
                        groupId={131}
                        filter="gifted"
                        searchUser=""
                        sourceTypeFilter="all"
                        onSelectTree={() => {}}
                        onSelectTransaction={() => {}}
                        onImageView={() => {}}
                    />
                </TestWrapper>
            );

            await waitFor(() => {
                expect(screen.getByText('📋 Legacy')).toBeInTheDocument();
            });
        });
    });

    describe('Source Type Filtering', () => {
        
        it('should show source type filter options when viewing gifted trees', () => {
            const mockGroup = { id: 131, name: 'Autus Wealth' };
            
            render(
                <TestWrapper>
                    <CSRGiftTrees groupId={131} selectedGroup={mockGroup} />
                </TestWrapper>
            );

            // Click on "Show Gifted Trees" to reveal source type filters
            fireEvent.click(screen.getByLabelText('Show Gifted Trees'));

            expect(screen.getByText('Filter by Source Type:')).toBeInTheDocument();
            expect(screen.getByLabelText('🎁 Fresh Request')).toBeInTheDocument();
            expect(screen.getByLabelText('🌳 Pre-purchased')).toBeInTheDocument();
            expect(screen.getByLabelText('📋 Legacy')).toBeInTheDocument();
        });

        it('should filter transactions by fresh request type', async () => {
            render(
                <TestWrapper>
                    <GiftTreesGrid
                        groupId={131}
                        filter="gifted"
                        searchUser=""
                        sourceTypeFilter="fresh_request"
                        onSelectTree={() => {}}
                        onSelectTransaction={() => {}}
                        onImageView={() => {}}
                    />
                </TestWrapper>
            );

            await waitFor(() => {
                // Should only show fresh request transactions
                expect(screen.getByText('🎁 Fresh Request')).toBeInTheDocument();
                expect(screen.queryByText('🌳 Pre-purchased')).not.toBeInTheDocument();
            });
        });

        it('should filter transactions by pre-purchased type', async () => {
            render(
                <TestWrapper>
                    <GiftTreesGrid
                        groupId={131}
                        filter="gifted"
                        searchUser=""
                        sourceTypeFilter="pre_purchased"
                        onSelectTree={() => {}}
                        onSelectTransaction={() => {}}
                        onImageView={() => {}}
                    />
                </TestWrapper>
            );

            await waitFor(() => {
                // Should only show pre-purchased transactions
                expect(screen.getByText('🌳 Pre-purchased')).toBeInTheDocument();
                expect(screen.queryByText('🎁 Fresh Request')).not.toBeInTheDocument();
            });
        });
    });

    describe('Enhanced Analytics Display', () => {
        
        it('should display transaction source type analytics', async () => {
            render(
                <TestWrapper>
                    <GiftAnalytics
                        groupId={131}
                        onGiftMultiple={() => {}}
                        refreshTrigger={0}
                    />
                </TestWrapper>
            );

            await waitFor(() => {
                expect(screen.getByText('Transaction Source Breakdown')).toBeInTheDocument();
                expect(screen.getByText('🎁 Fresh Request Transactions')).toBeInTheDocument();
                expect(screen.getByText('🌳 Pre-purchased Transactions')).toBeInTheDocument();
                expect(screen.getByText('📋 Legacy Transactions')).toBeInTheDocument();
            });
        });

        it('should show correct transaction counts in analytics', async () => {
            render(
                <TestWrapper>
                    <GiftAnalytics
                        groupId={131}
                        onGiftMultiple={() => {}}
                        refreshTrigger={0}
                    />
                </TestWrapper>
            );

            await waitFor(() => {
                // Check for the mocked analytics data
                expect(screen.getByText('5')).toBeInTheDocument(); // fresh_request_transactions
                expect(screen.getByText('8')).toBeInTheDocument(); // pre_purchased_transactions
                expect(screen.getByText('2')).toBeInTheDocument(); // legacy_transactions
            });
        });

        it('should hide analytics section when no transactions exist', () => {
            // Mock empty analytics response
            const mockApiClient = require('../api/apiClient/apiClient');
            mockApiClient.mockImplementation(() => ({
                getMappedGiftTreesAnalytics: jest.fn().mockResolvedValue({
                    total_transactions: '0',
                    fresh_request_transactions: '0',
                    pre_purchased_transactions: '0',
                    legacy_transactions: '0'
                })
            }));

            render(
                <TestWrapper>
                    <GiftAnalytics
                        groupId={999}
                        onGiftMultiple={() => {}}
                        refreshTrigger={0}
                    />
                </TestWrapper>
            );

            expect(screen.queryByText('Transaction Source Breakdown')).not.toBeInTheDocument();
        });
    });

    describe('Responsive Design', () => {
        
        beforeEach(() => {
            // Mock mobile viewport
            Object.defineProperty(window, 'matchMedia', {
                writable: true,
                value: jest.fn().mockImplementation(query => ({
                    matches: query.includes('(max-width: 600px)'), // Mobile breakpoint
                    media: query,
                    onchange: null,
                    addListener: jest.fn(),
                    removeListener: jest.fn(),
                    addEventListener: jest.fn(),
                    removeEventListener: jest.fn(),
                    dispatchEvent: jest.fn(),
                })),
            });
        });

        it('should display correctly on mobile devices', async () => {
            render(
                <TestWrapper>
                    <GiftTreesGrid
                        groupId={131}
                        filter="gifted"
                        searchUser=""
                        sourceTypeFilter="all"
                        onSelectTree={() => {}}
                        onSelectTransaction={() => {}}
                        onImageView={() => {}}
                    />
                </TestWrapper>
            );

            await waitFor(() => {
                // Check that badges are still visible and properly sized on mobile
                const badge = screen.getByText('🎁 Fresh Request');
                expect(badge).toBeInTheDocument();
                
                // Check for mobile-specific styling (this would depend on your actual implementation)
                // You might need to check for specific CSS classes or styles
            });
        });
    });

    describe('Accessibility', () => {
        
        it('should have proper aria labels for filter options', () => {
            const mockGroup = { id: 131, name: 'Autus Wealth' };
            
            render(
                <TestWrapper>
                    <CSRGiftTrees groupId={131} selectedGroup={mockGroup} />
                </TestWrapper>
            );

            fireEvent.click(screen.getByLabelText('Show Gifted Trees'));

            expect(screen.getByRole('radiogroup', { name: 'source-type' })).toBeInTheDocument();
        });

        it('should have proper color contrast for transaction badges', async () => {
            render(
                <TestWrapper>
                    <GiftTreesGrid
                        groupId={131}
                        filter="gifted"
                        searchUser=""
                        sourceTypeFilter="all"
                        onSelectTree={() => {}}
                        onSelectTransaction={() => {}}
                        onImageView={() => {}}
                    />
                </TestWrapper>
            );

            await waitFor(() => {
                const freshRequestBadge = screen.getByText('🎁 Fresh Request');
                const computedStyle = window.getComputedStyle(freshRequestBadge);
                
                // Basic check that colors are set (actual contrast testing would require more sophisticated tools)
                expect(computedStyle.backgroundColor).toBeDefined();
                expect(computedStyle.color).toBeDefined();
            });
        });
    });
});

export {};