import React, { useEffect, useRef } from 'react';
import { Box, Container, Typography } from '@mui/material';

/**
 * PageContainer - Reusable page layout container with consistent styling
 * 
 * @param {React.ReactNode} children - Page content
 * @param {string} title - Page title
 * @param {React.ReactNode} headerContent - Optional content to display in the header area
 */
const PageContainer = ({ children, title, headerContent }) => {
    const mainRef = useRef(null);

    // Focus main content when page loads/changes
    useEffect(() => {
        if (mainRef.current) {
            mainRef.current.focus();
        }
    }, [title]); // Re-focus when title changes (new page)

    return (
        <Box
            ref={mainRef}
            component="main"
            role="main"
            tabIndex={-1}
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(to bottom, #f0f4f8, #d9e2ec)',
                padding: { xs: '1.5rem 1rem', md: '2rem 2rem' },
                outline: 'none', // Remove focus outline since it's for programmatic focus only
            }}
        >
            <Container maxWidth="md">
                <Box>
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
