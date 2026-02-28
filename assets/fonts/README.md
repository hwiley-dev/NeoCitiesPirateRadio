# Local Font Assets

This project does not load fonts from Google Fonts or any external CDN.

The stylesheet expects these files:
1. `PressStart2P-Regular.woff2` or `PressStart2P-Regular.ttf`
2. `VT323-Regular.woff2` or `VT323-Regular.ttf`

Because network access is restricted in this environment, font binaries are not bundled automatically.
Place OFL-licensed copies in this folder before production deploy.

Recommended sources:
1. https://github.com/google/fonts/tree/main/ofl/pressstart2p
2. https://github.com/google/fonts/tree/main/ofl/vt323

If local font files are missing, the site falls back to system monospace fonts.
