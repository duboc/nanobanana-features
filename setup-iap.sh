#!/usr/bin/env bash
# setup-iap.sh — One-time IAP setup for Cloud Run service
#
# This script configures the OAuth consent screen and IAP allowed domains
# so that users can access the Cloud Run service through IAP without
# getting "Hostname not in allowed domains" errors.
#
# Usage:
#   ./setup-iap.sh                          # Uses defaults
#   ./setup-iap.sh --project my-project     # Override project
#   ./setup-iap.sh --region us-central1     # Override region
#   ./setup-iap.sh --service my-service     # Override service name
#
# Prerequisites:
#   - Service deployed with IAP enabled (run deploy.sh first)
#   - gcloud CLI installed and authenticated
#
# Run order:
#   1. ./deploy.sh          — Deploy the app with IAP enabled
#   2. ./setup-iap.sh       — Configure OAuth consent screen & allowed domains (once)
#   3. ./configure-iap.sh   — Grant google.com domain access (once)

set -euo pipefail

# ---------------------------------------------------------------------------
# Defaults
# ---------------------------------------------------------------------------
PROJECT="${GOOGLE_CLOUD_PROJECT:-$(gcloud config get-value project 2>/dev/null)}"
REGION="${GOOGLE_CLOUD_LOCATION:-us-central1}"
SERVICE_NAME="${CLOUD_RUN_SERVICE:-nanobanana-features}"

# ---------------------------------------------------------------------------
# Parse arguments
# ---------------------------------------------------------------------------
while [[ $# -gt 0 ]]; do
  case $1 in
    --project)  PROJECT="$2"; shift 2 ;;
    --region)   REGION="$2"; shift 2 ;;
    --service)  SERVICE_NAME="$2"; shift 2 ;;
    *)          echo "Unknown flag: $1"; exit 1 ;;
  esac
done

# ---------------------------------------------------------------------------
# Validation
# ---------------------------------------------------------------------------
if [[ -z "${PROJECT}" ]]; then
  echo "ERROR: No project set. Use --project or set GOOGLE_CLOUD_PROJECT."
  exit 1
fi

echo "============================================"
echo "  Nano Banana Features — IAP Setup"
echo "============================================"
echo ""
echo "  Project:  ${PROJECT}"
echo "  Region:   ${REGION}"
echo "  Service:  ${SERVICE_NAME}"
echo ""

# ---------------------------------------------------------------------------
# Get the Cloud Run service URL and extract the hostname
# ---------------------------------------------------------------------------
echo ">>> Retrieving service URL..."
SERVICE_URL=$(gcloud run services describe "${SERVICE_NAME}" \
  --project="${PROJECT}" \
  --region="${REGION}" \
  --format="value(status.url)" 2>/dev/null || echo "")

if [[ -z "${SERVICE_URL}" ]]; then
  echo "ERROR: Could not find service '${SERVICE_NAME}' in ${REGION}."
  echo "       Run deploy.sh first."
  exit 1
fi

# Extract hostname from URL (e.g., nanobanana-features-xxxxx-uc.a.run.app)
SERVICE_HOST=$(echo "${SERVICE_URL}" | sed 's|https://||')
echo "  Service URL:  ${SERVICE_URL}"
echo "  Hostname:     ${SERVICE_HOST}"
echo ""

# ---------------------------------------------------------------------------
# Enable IAP API (should already be enabled from deploy, but just in case)
# ---------------------------------------------------------------------------
echo ">>> Ensuring IAP API is enabled..."
gcloud services enable iap.googleapis.com --project="${PROJECT}" --quiet

# ---------------------------------------------------------------------------
# Configure OAuth consent screen (internal)
# ---------------------------------------------------------------------------
echo ""
echo ">>> Checking OAuth consent screen (brand)..."

# Check if a brand already exists
BRAND=$(gcloud iap oauth-brands list \
  --project="${PROJECT}" \
  --format="value(name)" 2>/dev/null | head -1 || echo "")

if [[ -z "${BRAND}" ]]; then
  echo "  Creating OAuth consent screen (internal)..."

  # Get the authenticated user's email for the support email
  SUPPORT_EMAIL=$(gcloud config get-value account 2>/dev/null)

  gcloud iap oauth-brands create \
    --project="${PROJECT}" \
    --application_title="Nano Banana Features Explorer" \
    --support_email="${SUPPORT_EMAIL}" \
    --quiet

  BRAND=$(gcloud iap oauth-brands list \
    --project="${PROJECT}" \
    --format="value(name)" 2>/dev/null | head -1)

  echo "  Brand created: ${BRAND}"
else
  echo "  Brand already exists: ${BRAND}"
fi

# ---------------------------------------------------------------------------
# Create OAuth client for IAP (if needed)
# ---------------------------------------------------------------------------
echo ""
echo ">>> Checking OAuth client for IAP..."

EXISTING_CLIENT=$(gcloud iap oauth-clients list "${BRAND}" \
  --format="value(name)" 2>/dev/null | head -1 || echo "")

if [[ -z "${EXISTING_CLIENT}" ]]; then
  echo "  Creating OAuth client..."

  gcloud iap oauth-clients create "${BRAND}" \
    --display_name="IAP-Cloud-Run-${SERVICE_NAME}" \
    --quiet

  echo "  OAuth client created."
else
  echo "  OAuth client already exists."
fi

# ---------------------------------------------------------------------------
# Set IAP allowed domains to include the Cloud Run hostname
# ---------------------------------------------------------------------------
echo ""
echo ">>> Setting IAP allowed domains..."

# The allowed domain should be the run.app parent domain
gcloud iap settings set \
  --project="${PROJECT}" \
  --resource-type=cloud-run \
  --service="${SERVICE_NAME}" \
  --region="${REGION}" \
  --allowed-domains="${SERVICE_HOST}" \
  --quiet 2>/dev/null || {
    # Fallback: try with just the run.app domain
    echo "  Trying with run.app domain..."
    gcloud iap settings set \
      --project="${PROJECT}" \
      --resource-type=cloud-run \
      --service="${SERVICE_NAME}" \
      --region="${REGION}" \
      --allowed-domains="run.app" \
      --quiet
  }

echo "  Allowed domains configured."

# ---------------------------------------------------------------------------
# Output
# ---------------------------------------------------------------------------
echo ""
echo "============================================"
echo "  IAP Setup Complete!"
echo "============================================"
echo ""
echo "  OAuth consent screen:  Configured (internal)"
echo "  Allowed domains:       ${SERVICE_HOST}"
echo ""
echo "  Next steps:"
echo "    1. Run ./configure-iap.sh to grant domain/user access"
echo "    2. Visit ${SERVICE_URL} and sign in"
echo ""
echo "  Full deployment order:"
echo "    ./deploy.sh          — Deploy with IAP enabled"
echo "    ./setup-iap.sh       — Configure OAuth & allowed domains (once)"
echo "    ./configure-iap.sh   — Grant google.com domain access (once)"
echo ""
