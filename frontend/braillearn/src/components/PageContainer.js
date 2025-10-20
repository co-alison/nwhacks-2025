import React from 'react';
import { Box, Container, Typography } from '@mui/material';

/**
 * PageContainer - Reusable page layout container with consistent styling
 * 
 * @param {React.ReactNode} children - Page content
 * @param {string} title - Page title
 * @param {React.ReactNode} headerContent - Optional content to display in the header area
 */
const PageContainer = ({ children, title, headerContent }) => {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(to bottom, #f0f4f8, #d9e2ec)',
                padding: { xs: '2rem 1rem', md: '4rem 2rem' },
            }}
        >
            <Container maxWidth="md">
                <Box sx={{ marginTop: { xs: '1rem', md: '2rem' } }}>
                    {/* Page Title */}
                    {title && (
                        <Typography
                            variant="h3"
                            component="h1"
                            sx={{
                                fontSize: { xs: '2rem', md: '2.5rem' },
                                fontWeight: 700,
                                color: '#1a1a1a',
                                marginBottom: '2rem',
                                textAlign: 'center',
                            }}
                        >
                            {title}
                        </Typography>
                    )}

                    {/* Optional Header Content */}
                    {headerContent && (
                        <Box sx={{ marginBottom: '2rem' }}>
                            {headerContent}
                        </Box>
                    )}

                    {/* Main Content */}
                    {children}
                </Box>
            </Container>
        </Box>
    );
};

export default PageContainer;
