#!/bin/bash

# Audexa AI Landing Page Deployment Script
# This script builds and deploys the static site to AWS S3

set -e

echo "🚀 Audexa AI Deployment Script"
echo "================================"

# Configuration (update these values for your environment)
S3_BUCKET="${S3_BUCKET:-audexa-landing-prod}"
CLOUDFRONT_DISTRIBUTION_ID="${CLOUDFRONT_DISTRIBUTION_ID:-}"

# Build the site
echo "📦 Building static site..."
pnpm build

# Check if out directory exists
if [ ! -d "out" ]; then
  echo "❌ Build failed - 'out' directory not found"
  exit 1
fi

echo "✅ Build complete"

# Upload to S3
echo "☁️  Uploading to S3 bucket: $S3_BUCKET"
aws s3 sync ./out s3://$S3_BUCKET/ --delete

echo "✅ Upload complete"

# Invalidate CloudFront cache if distribution ID is set
if [ -n "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
  echo "🔄 Invalidating CloudFront cache..."
  aws cloudfront create-invalidation \
    --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
    --paths "/*"
  echo "✅ CloudFront invalidation initiated"
fi

echo ""
echo "✨ Deployment complete!"
echo "================================"

