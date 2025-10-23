import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  Grid2 as Grid,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Chip,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import theme from '../../styles/theme';
import PageContainer from '../../components/PageContainer';

const Gallery = () => {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Import media files
  const v1Images = [
    { src: require('../../v1_1.JPG'), name: 'Braillearn V1', type: 'image' },
    { src: require('../../v1_2.JPG'), name: 'Braillearn V1', type: 'image' },
    { src: require('../../v1_3.JPG'), name: 'Braillearn V1', type: 'image' },
    { src: require('../../v1_4.JPG'), name: 'Braillearn V1', type: 'image' },
  ];

  const v1Video = [
    { src: require('../../v1.MOV'), name: 'Braillearn V1 Video', type: 'video' },
  ];

  const v2Images = [
    { src: require('../../v2_1.jpg'), name: 'Braillearn V2', type: 'image' },
    { src: require('../../v2_2.jpg'), name: 'Braillearn V2', type: 'image' },
    { src: require('../../v2_3.jpg'), name: 'Braillearn V2', type: 'image' },
    { src: require('../../v2_4.jpg'), name: 'Braillearn V2', type: 'image' },
    { src: require('../../v2_5.jpg'), name: 'Braillearn V2', type: 'image' },
  ];

  const v2Files = [
    { src: require('../../Braillearn_Box.stl'), name: 'Braillearn_Box.stl', type: 'file' },
    { src: require('../../Braillearn_Lid.stl'), name: 'Braillearn_Lid.stl', type: 'file' },
  ];

  const handleMediaClick = (media) => {
    setSelectedMedia(media);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedMedia(null);
  };

  const MediaCard = ({ media, index }) => (
    <Card
      sx={{
        borderRadius: '12px',
        backgroundColor: '#ffffff',
        border: '2px solid #e2e8f0',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        cursor: media.type === 'video' ? 'default' : 'pointer',
        overflow: 'hidden',
        '&:hover': {
          transform: media.type === 'video' ? 'none' : 'translateY(-4px)',
          boxShadow: media.type === 'video' ? '0 4px 12px rgba(0, 0, 0, 0.1)' : '0 8px 24px rgba(0, 0, 0, 0.15)',
          borderColor: media.type === 'video' ? '#e2e8f0' : theme.palette.custom.buttonBackground,
        },
      }}
      onClick={() => media.type !== 'video' && handleMediaClick(media)}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '200px',
          overflow: 'hidden',
        }}
      >
        {media.type === 'image' ? (
          <img
            src={media.src}
            alt={media.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : media.type === 'video' ? (
          <video
            controls
            preload="metadata"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          >
            <source src={media.src} type="video/mp4" />
            <source src={media.src} type="video/quicktime" />
            <source src={media.src} type="video/webm" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundColor: '#f8f9fc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                fontSize: '3rem',
                color: theme.palette.custom.buttonBackground,
                marginBottom: '0.5rem',
              }}
            >
              📦
            </Box>
            <Typography variant="body2" sx={{ color: '#4a5568' }}>
              3D Model
            </Typography>
          </Box>
        )}

        {/* Overlay with type indicator */}
        <Box
          sx={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '4px',
            padding: '4px 8px',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            {media.type}
          </Typography>
        </Box>
      </Box>
    </Card>
  );

  const SectionHeader = ({ title, description, color }) => (
    <Box sx={{ marginBottom: '2rem', textAlign: 'center' }}>
      <Typography
        variant="h4"
        component="h2"
        sx={{
          fontSize: { xs: '1.75rem', md: '2.25rem' },
          fontWeight: 700,
          color: color,
          marginBottom: '0.5rem',
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontSize: '1.125rem',
          color: '#4a5568',
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        {description}
      </Typography>
    </Box>
  );

  return (
    <PageContainer title="Gallery">
      <Box
        sx={{
          minHeight: 'calc(100vh - 70px)',
          background: 'linear-gradient(135deg, #f8f9fc 0%, #e8ecf7 100%)',
          paddingBottom: '4rem',
        }}
      >
        <Container maxWidth="lg">
          {/* Header */}
          <Box
            sx={{
              textAlign: 'center',
              marginBottom: '3rem',
              paddingTop: '2rem',
            }}
          >
            {/* <Typography
              variant="h3"
              component="h1"
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 700,
                color: '#1a1a1a',
                marginBottom: '1rem',
              }}
            >
              Braillearn Gallery
            </Typography> */}
            <Typography
              variant="body1"
              sx={{
                fontSize: '1.125rem',
                color: '#4a5568',
                maxWidth: '600px',
                margin: '0 auto',
              }}
            >
              Explore the evolution of Braillearn.
              V1 is our initial design, which was showcased at nwHacks.
              V2 is the refined design, making braille more independent and accessible for the visually impaired.
            </Typography>
          </Box>

          {/* Braillearn V1 Card */}
          <Card
            sx={{
              borderRadius: '16px',
              backgroundColor: '#ffffff',
              border: '2px solid #e2e8f0',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              marginBottom: '3rem',
              padding: '2rem',
            }}
          >
            <SectionHeader
              title="Braillearn V1"
              description="Our initial hardware prototype showcasing how the visually impaired can feel the braille"
              color="#5e67bf"
            />

            {/* V1 Images */}
            <Box sx={{ marginBottom: '2rem' }}>
              <Typography
                variant="h6"
                sx={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#1a1a1a',
                  marginBottom: '1rem',
                  textAlign: 'center',
                }}
              >
                Images
              </Typography>
              <Grid container spacing={2}>
                {v1Images.map((image, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <MediaCard media={image} index={index} />
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* V1 Video */}
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#1a1a1a',
                  marginBottom: '1rem',
                  textAlign: 'center',
                }}
              >
                Demonstration Video
              </Typography>
              <Grid container spacing={2} justifyContent="center">
                {v1Video.map((video, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <MediaCard media={video} index={index} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Card>

          {/* Braillearn V2 Card */}
          <Card
            sx={{
              borderRadius: '16px',
              backgroundColor: '#ffffff',
              border: '2px solid #e2e8f0',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              padding: '2rem',
            }}
          >
            <SectionHeader
              title="Braillearn V2 (NEW!)"
              description="Our refined design with improved functionality, better ergonomics, and enhanced user experience"
              color="#10b981"
            />

            {/* V2 Images */}
            <Box sx={{ marginBottom: '2rem' }}>
              <Typography
                variant="h6"
                sx={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#1a1a1a',
                  marginBottom: '1rem',
                  textAlign: 'center',
                }}
              >
                Images
              </Typography>
              <Grid container spacing={2}>
                {v2Images.map((image, index) => (
                  <Grid item xs={12} sm={6} md={2.4} key={index}>
                    <MediaCard media={image} index={index} />
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* V2 STL Files */}
            {/* <Box>
              <Typography
                variant="h6"
                sx={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#1a1a1a',
                  marginBottom: '1rem',
                  textAlign: 'center',
                }}
              >
                3D Model Files
              </Typography>
              <Grid container spacing={2} justifyContent="center">
                {v2Files.map((file, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <MediaCard media={file} index={index} />
                  </Grid>
                ))}
              </Grid>
            </Box> */}
          </Card>
        </Container>

        {/* Media Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: '16px',
              backgroundColor: '#ffffff',
            },
          }}
        >
          <DialogTitle
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.5rem 1.5rem 0',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#1a1a1a',
              }}
            >
              {selectedMedia?.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: '0.5rem' }}>
              <Chip
                label={selectedMedia?.type.toUpperCase()}
                size="small"
                sx={{
                  backgroundColor: theme.palette.custom.buttonBackground,
                  color: 'white',
                  fontWeight: 600,
                }}
              />
              <IconButton
                onClick={handleCloseDialog}
                sx={{
                  color: '#6b7280',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ padding: '1.5rem' }}>
            {selectedMedia?.type === 'image' && (
              <Box sx={{ textAlign: 'center' }}>
                <img
                  src={selectedMedia.src}
                  alt={selectedMedia.name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '70vh',
                    objectFit: 'contain',
                    borderRadius: '8px',
                  }}
                />
              </Box>
            )}

            {selectedMedia?.type === 'file' && (
              <Box
                sx={{
                  textAlign: 'center',
                  padding: '3rem',
                  backgroundColor: '#f8f9fc',
                  borderRadius: '12px',
                  border: '2px dashed #e2e8f0',
                }}
              >
                <Box
                  sx={{
                    fontSize: '4rem',
                    marginBottom: '1rem',
                  }}
                >
                  📦
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: '#1a1a1a',
                    marginBottom: '0.5rem',
                  }}
                >
                  {selectedMedia.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#4a5568',
                    marginBottom: '1.5rem',
                  }}
                >
                  3D Model File (STL Format)
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#6b7280',
                    fontStyle: 'italic',
                  }}
                >
                  Click and drag to rotate • Scroll to zoom • Right-click to pan
                </Typography>
                <Box
                  sx={{
                    marginTop: '2rem',
                    padding: '2rem',
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    minHeight: '300px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#4a5568',
                      marginBottom: '1rem',
                    }}
                  >
                    Interactive 3D Model Viewer
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#6b7280',
                      textAlign: 'center',
                    }}
                  >
                    The 3D model viewer will be integrated here.<br />
                    This allows users to interact with the STL files directly in the browser.
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </PageContainer>
  );
};

export default Gallery;
