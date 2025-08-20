# ちまうた (Chimauta) - VTuber Song Archive

ちまうた is a Japanese fan website for VTuber Machita Chima (町田ちま) that allows users to search and play her songs from YouTube archives. The site has a vanilla HTML/CSS/JavaScript frontend and a Google Apps Script backend.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap the Repository
- Clone the repository: `git clone https://github.com/Chimachans-Engineer-Group/chimauta.git`
- `cd chimauta`
- No package installation required - this project uses vanilla web technologies

### Frontend Development
- Serve the frontend locally: `cd frontend && python3 -m http.server 8000` -- takes 2-3 seconds to start. NEVER CANCEL.
- Open browser to `http://localhost:8000` to view the site
- The frontend works standalone but will show API errors without the backend connection
- Frontend files are in `/frontend/`:
  - `index.html` - Main HTML file with embedded YouTube player
  - `css/base.css` - Base styles and CSS variables  
  - `css/detail.css` - Component and responsive styles
  - `js/main.js` - Main application logic and YouTube API integration
  - `js/util.js` - HTML escaping utility function
  - `img/` - Icon and image assets

### Backend Development (Google Apps Script)
- Install clasp (Google Apps Script CLI): `npm install -g @google/clasp` -- takes 5-10 seconds. NEVER CANCEL.
- Backend files are in `/backend/src/`:
  - `API.js` - Main API endpoint that serves song/video data as JSON
  - `const.js` - Shared constants and spreadsheet sheet proxy
  - `onSheetChange.js` - Trigger functions for spreadsheet changes
  - `util.js` - Duration parsing and formula conversion utilities
  - `appsscript.json` - Apps Script project configuration

### Setting Up Backend (First Time)
- IMPORTANT: Backend deployment requires Google authentication and a valid Google Apps Script project
- Copy `.clasp.json.sample` to `.clasp.json` and add your script ID: `cp backend/.clasp.json.sample backend/.clasp.json`
- Edit `.clasp.json` to include your Google Apps Script project ID
- Login to Google Apps Script: `cd backend && clasp login` (requires browser authentication)
- Push backend code: `cd backend && clasp push` -- takes 5-10 seconds. NEVER CANCEL.
- Deploy as web app: `cd backend && clasp deploy` -- takes 5-10 seconds. NEVER CANCEL.

## Validation

### Frontend Testing
- ALWAYS start the local HTTP server: `cd frontend && python3 -m http.server 8000`
- Verify the website loads at `http://localhost:8000`
- Check that the page structure displays correctly (header, search box, song table placeholder)
- The site will show "読込中..." (Loading...) and then an error message about failing to fetch songList - this is expected without backend connection
- ALWAYS test responsive design by resizing browser window to mobile/tablet sizes

### Backend Testing  
- Backend can only be fully tested when deployed to Google Apps Script with proper authentication
- Without deployment, you can syntax-check JavaScript files but cannot test API functionality
- The live API endpoint is hardcoded in `frontend/js/main.js` line 15

### Manual Validation Scenarios
- ALWAYS validate that the HTML structure loads correctly after making frontend changes
- Test search functionality (requires backend connection for full testing)
- Test YouTube player integration (requires valid video data from backend)
- Verify responsive design on mobile/tablet/desktop viewports

## Project Structure

### Key Files and Directories
```
├── frontend/           # Static website files
│   ├── index.html      # Main page (single-page application)
│   ├── css/           # Stylesheets
│   ├── js/            # JavaScript application logic  
│   └── img/           # Icons and images
├── backend/           # Google Apps Script backend
│   ├── src/           # Apps Script source files
│   ├── .clasp.json.sample  # Template for clasp configuration
│   └── .gitignore     # Excludes .clasp.json from git
├── README.md          # Project documentation (in Japanese)
└── LICENSE           # MIT license
```

### Technology Stack
- **Frontend**: Vanilla HTML, CSS, JavaScript + YouTube IFrame Player API, Font Awesome (via CDN)
- **Backend**: Google Apps Script, YouTube Data API v3
- **Database**: Google Spreadsheet (tracks and videos sheets)
- **Deployment**: Cloudflare Pages (frontend), Google Apps Script (backend)
- **Development Tools**: clasp, Python HTTP server, Visual Studio Code

## Common Tasks

### Making Frontend Changes
- Edit files in `/frontend/` directory
- Start local server: `cd frontend && python3 -m http.server 8000`
- Test changes at `http://localhost:8000`
- No build process required - changes are immediate

### Making Backend Changes  
- Edit files in `/backend/src/` directory
- Test syntax: `cd backend && clasp status` (requires valid .clasp.json)
- Deploy changes: `cd backend && clasp push && clasp deploy` -- each command takes 5-10 seconds. NEVER CANCEL.

### Deployment
- **Frontend**: Automatically deployed via Cloudflare Pages when pushed to main branch
- **Backend**: Manual deployment via `clasp deploy` command
- The frontend fetches data from the deployed Google Apps Script web app URL

## Important Notes

### Timing Expectations
- Frontend server startup: 2-3 seconds
- clasp installation: 5-10 seconds  
- clasp push/deploy: 5-10 seconds each
- NEVER CANCEL these operations - they complete quickly

### Limitations in Sandboxed Environments
- External CDN resources (fonts, icons) may be blocked
- Google Apps Script authentication requires browser access
- YouTube API requires valid API keys and deployed backend
- Full functionality testing requires live deployment

### File Locations to Remember
- Main application logic: `frontend/js/main.js`
- API endpoint code: `backend/src/API.js`  
- Styles: `frontend/css/base.css` and `frontend/css/detail.css`
- Configuration: `backend/src/appsscript.json`

### Common Outputs

#### Repository Root
```
$ ls -la
LICENSE
README.md  
backend/
frontend/
```

#### Frontend Directory
```
$ ls frontend/
css/
img/ 
index.html
js/
```

#### Backend Source Directory  
```
$ ls backend/src/
API.js
appsscript.json
const.js
onSheetChange.js
util.js
```

## Troubleshooting

### Frontend Issues
- If website doesn't load: Ensure HTTP server is running on port 8000
- If styles are missing: Check that CSS files exist in `frontend/css/`
- If JavaScript errors occur: Check browser console for specific error messages

### Backend Issues
- If clasp commands fail: Ensure you're authenticated with `clasp login`
- If push fails: Check that `.clasp.json` has valid script ID
- If API returns errors: Verify Google Apps Script deployment is active

### External Dependencies
- The site uses external CDNs that may be blocked in restricted environments
- YouTube API functionality requires backend deployment with valid API credentials
- Full testing requires access to Google Services