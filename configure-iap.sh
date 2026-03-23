#!/usr/bin/env bash
# configure-iap.sh — Configure IAP for Cloud Run to allow google.com domain access
#
# Usage:
#   ./configure-iap.sh                          # Grant google.com domain access
#   ./configure-iap.sh --domain example.com     # Grant a different domain
#   ./configure-iap.sh --user user@google.com   # Grant a specific user
#   ./configure-iap.sh --remove                 # Remove access instead of adding
#   ./configure-iap.sh --status                 # Show current IAP policy
#
# Prerequisites:
#   - Service deployed with IAP enabled (run deploy.sh first)
#   - IAP Policy Admin role (roles/iap.admin)

set -euo pipefail

# ---------------------------------------------------------------------------
# Defaults
# ---------------------------------------------------------------------------
PROJECT="${GOOGLE_CLOUD_PROJECT:-$(gcloud config get-value project 2>/dev/null)}"
REGION="${GOOGLE_CLOUD_LOCATION:-us-central1}"
SERVICE_NAME="${CLOUD_RUN_SERVICE:-nanobanana-features}"
DOMAIN="google.com"
SPECIFIC_USER=""
ACTION="add"
SHOW_STATUS=false

# ---------------------------------------------------------------------------
# Parse arguments
# ---------------------------------------------------------------------------
while [[ $# -gt 0 ]]; do
  case $1 in
    --project)  PROJECT="$2"; shift 2 ;;
    --region)   REGION="$2"; shift 2 ;;
    --service)  SERVICE_NAME="$2"; shift 2 ;;
    --domain)   DOMAIN="$2"; shift 2 ;;
    --user)     SPECIFIC_USER="$2"; shift 2 ;;
    --remove)   ACTION="remove"; shift ;;
    --status)   SHOW_STATUS=true; shift ;;
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
echo "  Nano Banana Features — IAP Configuration"
echo "============================================"
echo ""
echo "  Project:  ${PROJECT}"
echo "  Region:   ${REGION}"
echo "  Service:  ${SERVICE_NAME}"
echo ""

# ---------------------------------------------------------------------------
# Show current policy
# ---------------------------------------------------------------------------
if [[ "${SHOW_STATUS}" == true ]]; then
  echo ">>> Current IAP policy:"
  echo ""
  gcloud iap web get-iam-policy \
    --project="${PROJECT}" \
    --region="${REGION}" \
    --resource-type=cloud-run \
    --service="${SERVICE_NAME}"
  exit 0
fi

# ---------------------------------------------------------------------------
# Verify IAP is enabled on the service
# ---------------------------------------------------------------------------
echo ">>> Verifying IAP is enabled on the service..."
IAP_STATUS=$(gcloud run services describe "${SERVICE_NAME}" \
  --project="${PROJECT}" \
  --region="${REGION}" \
  --format="value(spec.template.metadata.annotations['run.googleapis.com/iap-enabled'])" 2>/dev/null || echo "")

if [[ "${IAP_STATUS}" != "true" ]]; then
  # Try alternate check
  IAP_CHECK=$(gcloud run services describe "${SERVICE_NAME}" \
    --project="${PROJECT}" \
    --region="${REGION}" 2>/dev/null | grep -i "Iap Enabled" || echo "")

  if [[ -z "${IAP_CHECK}" ]]; then
    echo "WARNING: Could not confirm IAP is enabled. Run deploy.sh first."
    echo "         Continuing anyway..."
  fi
fi

# ---------------------------------------------------------------------------
# Determine the member string
# ---------------------------------------------------------------------------
if [[ -n "${SPECIFIC_USER}" ]]; then
  MEMBER="user:${SPECIFIC_USER}"
  DESCRIPTION="${SPECIFIC_USER}"
else
  MEMBER="domain:${DOMAIN}"
  DESCRIPTION="all users in ${DOMAIN}"
fi

# ---------------------------------------------------------------------------
# Add or remove IAP access
# ---------------------------------------------------------------------------
if [[ "${ACTION}" == "add" ]]; then
  echo ">>> Granting IAP access to ${DESCRIPTION}..."
  echo ""

  gcloud iap web add-iam-policy-binding \
    --project="${PROJECT}" \
    --member="${MEMBER}" \
    --role="roles/iap.httpsResourceAccessor" \
    --region="${REGION}" \
    --resource-type=cloud-run \
    --service="${SERVICE_NAME}" \
    --quiet

  echo ""
  echo "============================================"
  echo "  Access granted!"
  echo "============================================"
  echo ""
  echo "  ${DESCRIPTION} can now access the service."
  echo ""
  echo "  Users will be prompted to sign in with their"
  echo "  Google account when visiting the service URL."
  echo ""

elif [[ "${ACTION}" == "remove" ]]; then
  echo ">>> Removing IAP access for ${DESCRIPTION}..."
  echo ""

  gcloud iap web remove-iam-policy-binding \
    --project="${PROJECT}" \
    --member="${MEMBER}" \
    --role="roles/iap.httpsResourceAccessor" \
    --region="${REGION}" \
    --resource-type=cloud-run \
    --service="${SERVICE_NAME}" \
    --quiet

  echo ""
  echo "  Access removed for ${DESCRIPTION}."
  echo ""
fi

# ---------------------------------------------------------------------------
# Show final policy
# ---------------------------------------------------------------------------
echo ">>> Current IAP policy:"
echo ""
gcloud iap web get-iam-policy \
  --project="${PROJECT}" \
  --region="${REGION}" \
  --resource-type=cloud-run \
  --service="${SERVICE_NAME}"
