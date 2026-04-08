#!/bin/bash
# Sync shared blog posts into this repo's content directory.
# Run before committing/deploying to pick up new posts.
# Usage: bash scripts/sync-blog-posts.sh

SHARED_DIR="/home/nelly/shared-content/blog/combatdietitian"
LOCAL_DIR="src/content/blog"

if [ ! -d "$SHARED_DIR" ]; then
  echo "Shared content directory not found: $SHARED_DIR"
  echo "Skipping sync (Vercel build will use committed files)"
  exit 0
fi

rm -f "$LOCAL_DIR"/*.md
cp "$SHARED_DIR"/*.md "$LOCAL_DIR/"
echo "Synced $(ls "$LOCAL_DIR"/*.md | wc -l) posts from shared content"
