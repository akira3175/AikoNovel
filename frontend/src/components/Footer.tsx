import type React from "react"
import { Box, Container, Grid, Typography, Link } from "@mui/material"
import { styled } from "@mui/material/styles"

const FooterWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(6, 0),
}))

const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  "&:hover": {
    color: theme.palette.secondary.light,
  },
}))

const Footer: React.FC = () => {
  return (
    <FooterWrapper>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              AikoNovel
            </Typography>
            <Typography variant="body2">
              Your favorite place for reading novels online. Discover new stories, follow your favorite authors, and
              join a community of passionate readers.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Typography variant="body2">
              <FooterLink href="/" underline="none">
                Home
              </FooterLink>
            </Typography>
            <Typography variant="body2">
              <FooterLink href="/genres" underline="none">
                Genres
              </FooterLink>
            </Typography>
            <Typography variant="body2">
              <FooterLink href="/latest" underline="none">
                Latest
              </FooterLink>
            </Typography>
            <Typography variant="body2">
              <FooterLink href="/search" underline="none">
                Search
              </FooterLink>
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Legal
            </Typography>
            <Typography variant="body2">
              <FooterLink href="/terms" underline="none">
                Terms of Service
              </FooterLink>
            </Typography>
            <Typography variant="body2">
              <FooterLink href="/privacy" underline="none">
                Privacy Policy
              </FooterLink>
            </Typography>
            <Typography variant="body2">
              <FooterLink href="/copyright" underline="none">
                Copyright Notice
              </FooterLink>
            </Typography>
          </Grid>
        </Grid>
        <Box mt={5}>
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} AikoNovel. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </FooterWrapper>
  )
}

export default Footer

