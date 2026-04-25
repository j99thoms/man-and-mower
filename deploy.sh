#!/usr/bin/env bash
set -euo pipefail

BUCKET="manandhismower.ca"
DISTRIBUTION="E26TIIMP64NNQ3"

echo "Syncing to S3..."
aws s3 sync . "s3://$BUCKET" \
  --exclude ".git/*" \
  --exclude ".claude/*" \
  --exclude "lambda/*" \
  --exclude "deploy.sh" \
  --exclude "CLAUDE.md" \
  --exclude "README.md" \
  --delete

echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION" \
  --paths "/*" \
  --query "Invalidation.{Id:Id,Status:Status}" \
  --output table

echo "Done. Cache flush takes ~30–60 seconds to propagate."
