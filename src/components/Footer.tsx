/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Box, Container, Grid, Typography, Link as MuiLink, IconButton, Divider } from "@mui/material"
import { Facebook, Twitter, Instagram, LinkedIn, GitHub } from "@mui/icons-material"

export default function Footer() {
  const footerLinks = [
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Our Team", href: "/team" },
        { label: "Careers", href: "/careers" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Blog", href: "/blog" },
        { label: "Help Center", href: "/help" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
      ],
    },
    {
      title: "Features",
      links: [
        { label: "Gallery", href: "/gallery" },
        { label: "Collections", href: "/collections" },
        { label: "Upload", href: "/upload" },
        { label: "API", href: "/api-docs" },
      ],
    },
  ]

  const socialLinks = [
    { icon: <Facebook />, href: "https://facebook.com", label: "Facebook" },
    { icon: <Twitter />, href: "https://twitter.com", label: "Twitter" },
    { icon: <Instagram />, href: "https://instagram.com", label: "Instagram" },
    { icon: <LinkedIn />, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: <GitHub />, href: "https://github.com", label: "GitHub" },
  ]

  return (
    <Box component="footer" sx={{ bgcolor: "gray", py: 6, mt: "auto" }} className="">
      <Container >
        <Grid container spacing={4} justifyContent="space-between">
         {/* @ts-ignore */}
          <Grid item xs={12} md={4} >
            <Typography variant="h6" color="text.primary" gutterBottom className="font-bold">
              ImageGallery
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              A beautiful platform for sharing and discovering amazing images. Upload, organize, and share your visual
              content with the world.
            </Typography>
            <Box sx={{ mt: 2 }}>
              {socialLinks.map((social) => (
                <IconButton
                  key={social.label}
                  component="a"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-gray-600 hover:text-gray-900"
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

        
          {footerLinks.map((section) => (
            // @ts-ignore
            <Grid item xs={6} sm={4} md={2} key={section.title}>
              <Typography variant="h6" color="text.primary" gutterBottom className="font-bold text-sm">
                {section.title}
              </Typography>
              <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none" }}>
                {section.links.map((link) => (
                  <Box component="li" key={link.label} sx={{ pb: 1 }}>
                    <MuiLink
                      href={link.href}
                      variant="body2"
                      color="text.secondary"
                      className="no-underline hover:underline"
                    >
                      {link.label}
                    </MuiLink>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} ImageGallery. All rights reserved.
          </Typography>
          <Box>
            <MuiLink href="/privacy" variant="body2" color="text.secondary" sx={{ ml: 2 }} className="hover:underline">
              Privacy
            </MuiLink>
            <MuiLink href="/terms" variant="body2" color="text.secondary" sx={{ ml: 2 }} className="hover:underline">
              Terms
            </MuiLink>
            <MuiLink href="/cookies" variant="body2" color="text.secondary" sx={{ ml: 2 }} className="hover:underline">
              Cookies
            </MuiLink>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
