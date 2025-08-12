# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pin It is a Pinterest Create Pin link generator web application that allows users to:
- Enter image URLs and destination URLs to generate Pinterest pin creation links
- Generate embeddable HTML blocks with "Pin it" overlay icons
- Preview the generated pin appearance
- Track likes using a Val.town API

## Architecture

This is a vanilla HTML/CSS/JavaScript web application with a simple structure:

- **index.html**: Main application page with form inputs for description, media URL, destination URL, and alt text
- **js/app.js**: Core application logic including Pinterest URL generation, HTML block creation, clipboard functionality, and like counter integration
- **css/styles.css**: Complete styling with CSS custom properties, responsive grid layout, and component styles

## Key Components

### Core Functionality (js/app.js:83-138)
- `buildPinterestHref()`: Constructs Pinterest pin creation URLs with encoded parameters
- `buildEmbeddableBlock()`: Generates HTML with inline CSS for embeddable pin buttons
- `generate()`: Main form processing function with URL validation

### Like System (js/app.js:24-80)
- Integrates with Val.town API for persistent like counting
- Uses ID-based tracking with "pinit-app" as the default identifier
- Includes error handling and loading states

### UI State Management (js/app.js:101-111)
- Dynamic button enabling/disabling based on form completion
- Real-time validation of required fields (media URL and destination URL)

## Development Notes

- No build system or package manager - direct file editing
- Uses modern JavaScript features (fetch, async/await, template literals)
- CSS uses custom properties and modern layout techniques (CSS Grid, color-mix)
- All external dependencies are handled via CDN or external APIs

## Testing

- Use the "Fill with test data" button for quick testing with sample Pinterest content
- Test URL validation with various input formats
- Verify clipboard functionality across different browsers
- Check responsive behavior on mobile devices