#!/usr/bin/env bash
# deploy.sh — Deploy Nano Banana Features Explorer to Cloud Run with IAP
#
# Usage:
#   ./deploy.sh                          # Uses defaults
#   ./deploy.sh --project my-project     # Override project
#   ./deploy.sh --region us-central1     # Override region
#   ./deploy.sh --service my-service     # Override service name
#
# Prerequisites:
#   - gcloud CLI installed and authenticated
#   - IAP API enabled (run configure-iap.sh first for initial setup)
#   - Application Default Credentials configured

set -euo pipefail

# ---------------------------------------------------------------------------
# Defaults (override with flags or environment variables)
# ---------------------------------------------------------------------------
PROJECT="${GOOGLE_CLOUD_PROJECT:-$(gcloud config get-value project 2>/dev/null)}"
REGION="${GOOGLE_CLOUD_LOCATION:-us-central1}"
SERVICE_NAME="${CLOUD_RUN_SERVICE:-nanobanana-features}"
MEMORY="1Gi"
CPU="1"
MAX_INSTANCES="10"
MIN_INSTANCES="0"

# ---------------------------------------------------------------------------
# Parse arguments
# ---------------------------------------------------------------------------
while [[ $# -gt 0 ]]; do
  case $1 in
    --project)  PROJECT="$2"; shift 2 ;;
    --region)   REGION="$2"; shift 2 ;;
    --service)  SERVICE_NAME="$2"; shift 2 ;;
    --memory)   MEMORY="$2"; shift 2 ;;
    --cpu)      CPU="$2"; shift 2 ;;
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
echo "  Nano Banana Features Explorer — Deploy"
echo "============================================"
echo ""
echo "  Project:     ${PROJECT}"
echo "  Region:      ${REGION}"
echo "  Service:     ${SERVICE_NAME}"
echo "  Memory:      ${MEMORY}"
echo "  CPU:         ${CPU}"
echo "  Max Inst:    ${MAX_INSTANCES}"
echo ""

# ---------------------------------------------------------------------------
# Enable required APIs
# ---------------------------------------------------------------------------
echo ">>> Enabling required APIs..."
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  iap.googleapis.com \
  --project="${PROJECT}" \
  --quiet

# ---------------------------------------------------------------------------
# Deploy to Cloud Run from source with IAP enabled
# ---------------------------------------------------------------------------
echo ""
echo ">>> Deploying to Cloud Run from source..."
echo "    This will build the container using Cloud Build and deploy it."
echo ""

gcloud run deploy "${SERVICE_NAME}" \
  --project="${PROJECT}" \
  --region="${REGION}" \
  --source=. \
  --no-allow-unauthenticated \
  --iap \
  --memory="${MEMORY}" \
  --cpu="${CPU}" \
  --max-instances="${MAX_INSTANCES}" \
  --min-instances="${MIN_INSTANCES}" \
  --set-env-vars="GOOGLE_CLOUD_PROJECT=${PROJECT},GOOGLE_CLOUD_LOCATION=${REGION}" \
  --build-arg="GOOGLE_CLOUD_PROJECT=${PROJECT}" \
  --build-arg="GOOGLE_CLOUD_LOCATION=${REGION}" \
  --port=3000 \
  --quiet

# ---------------------------------------------------------------------------
# Grant IAP service agent the Cloud Run Invoker role
# ---------------------------------------------------------------------------
echo ""
echo ">>> Granting IAP service agent invoker permissions..."

PROJECT_NUMBER=$(gcloud projects describe "${PROJECT}" --format="value(projectNumber)")

gcloud run services add-iam-policy-binding "${SERVICE_NAME}" \
  --project="${PROJECT}" \
  --region="${REGION}" \
  --member="serviceAccount:service-${PROJECT_NUMBER}@gcp-sa-iap.iam.gserviceaccount.com" \
  --role="roles/run.invoker" \
  --quiet

# ---------------------------------------------------------------------------
# Output
# ---------------------------------------------------------------------------
SERVICE_URL=$(gcloud run services describe "${SERVICE_NAME}" \
  --project="${PROJECT}" \
  --region="${REGION}" \
  --format="value(status.url)")

echo ""
echo "============================================"
echo "  Deployment complete!"
echo "============================================"
echo ""
echo "  Service URL: ${SERVICE_URL}"
echo "  IAP:         Enabled"
echo ""
echo "  Next steps:"
echo "    1. Run ./configure-iap.sh to grant access to google.com domain"
echo "    2. Visit ${SERVICE_URL} and sign in with your @google.com account"
echo ""
