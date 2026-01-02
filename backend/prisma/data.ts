import { RunbookPrivacy } from '@prisma/client';
import { RunbookUncheckedCreateInput } from 'src/generated/prisma/models';

export const userData = {
  email: 'marleybob@gmail.com',
  username: 'bobmarley',
};

export const runbooksData: RunbookUncheckedCreateInput[] = [
  {
    title: 'Django Setup Guide',
    runtime: 'python:3.11-slim',
    content: `# Django Setup Guide

This guide will walk you through setting up a Django project from scratch.

## Prerequisites

Make sure you have Python installed.

## Step 1: Install Django

First, install Django using pip:

\`\`\`bash runnable
pip install django
\`\`\`

## Step 2: Create Project

Create a new Django project:

\`\`\`bash runnable
django-admin startproject mysite
cd mysite
\`\`\`

## Step 3: Run Development Server

Start the development server:

\`\`\`bash runnable
python manage.py runserver 0.0.0.0:8000
\`\`\`

Your Django app is now running!`,
    privacy: RunbookPrivacy.PRIVATE,
    shareToken: 'laksj234jq0dasf',
    userId: 1,
  },

  {
    title: 'Node Quick Start Guide',
    runtime: 'node:20-alpine',
    content: ` # Node.js Quick Start

Get started with Node.js in minutes.

## Check Node Version

\`\`\`bash runnable
node --version
\`\`\``,
    privacy: RunbookPrivacy.PRIVATE,
    shareToken: 'avasdklagb231bl',
    userId: 1,
  },
];
