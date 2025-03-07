# TechServ Garden Website - File Synchronization Workflow

## Overview

This document explains how to work with the TechServ Garden Website codebase without duplicating effort across multiple copies of files.

## The Problem

The project previously required maintaining two sets of files:
- Files in the root/src directories for development
- Duplicate files in the `public` directory for Firebase hosting

## The Solution

We've implemented a synchronization workflow that allows you to:
1. Work only with files in the root/src directories
2. Use a single command to sync these files to the public directory

## How to Use This Workflow

### Development

When developing the website, you only need to edit files in the main directories:
- Edit HTML files in the root and `pages/` directory
- Edit JavaScript in `src/`, `js/` directories
- Edit CSS in `css/` directories
- All other source files should be kept in their original locations

**DO NOT edit files in the `public` directory** - these will be overwritten when syncing.

### Commands

We've added new npm scripts to simplify the workflow:

```bash
# Start the development server
npm run dev

# Synchronize files from source to public directory
npm run sync

# Deploy to Firebase (this automatically runs sync first)
npm run deploy
```

### Workflow

1. Make changes to files in the source directories
2. Test your changes locally with `npm run dev`
3. When ready to deploy, run `npm run deploy` which will:
   - Run the sync script to copy all files to the public directory
   - Deploy the synchronized files to Firebase hosting

## Technical Details

- The synchronization is handled by `prepare-deploy.bat` which:
  - Cleans up necessary directories in `public/`
  - Creates required directory structure
  - Copies all files from source directories to their corresponding locations in `public/`

By following this workflow, you only need to maintain a single set of source files, and the synchronization process ensures that Firebase hosting receives an up-to-date copy of all files.
