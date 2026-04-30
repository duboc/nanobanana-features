# Identity-Aware Proxy (IAP)

This project sits behind Google Cloud's [Identity-Aware Proxy](https://cloud.google.com/iap) on Cloud Run. IAP is the **only** authentication layer — the Next.js app contains no auth code (no JWT validation, no session handling). All access control happens at the infrastructure level before requests reach the container.

## Request flow

```
User browser
    │
    ▼
Cloud Run URL  ──►  IAP intercepts request
                        │
                        ▼
                   Google sign-in (if no session)
                        │
                        ▼
                   Check IAM policy on the Cloud Run resource
                   (roles/iap.httpsResourceAccessor)
                        │
                        ▼ (if allowed)
                   IAP service agent invokes Cloud Run
                   (uses roles/run.invoker)
                        │
                        ▼
                   Next.js app receives request
```

The app trusts that any incoming request has already been authenticated by IAP. There is no fallback path — `--no-allow-unauthenticated` blocks any request that doesn't come through IAP.

## Setup scripts

Three scripts in the project root configure IAP. Run them in order on the first deployment.

| Script | When to run | What it does |
|--------|-------------|--------------|
| `deploy.sh` | Every deploy | Deploys the service to Cloud Run with IAP enabled and grants the IAP service agent invoker permission |
| `setup-iap.sh` | Once per project | Creates the OAuth consent screen, OAuth client, and configures allowed domains |
| `configure-iap.sh` | Once per audience (and any time you change access) | Grants/revokes access to specific users or domains via IAM |

On subsequent deploys, only `deploy.sh` is needed.

### 1. `deploy.sh`

Deploys the Cloud Run service with IAP enabled in a single `gcloud run deploy` call:

```bash
gcloud run deploy "${SERVICE_NAME}" \
  --no-allow-unauthenticated \
  --iap \
  --source=. \
  ...
```

After the service is up, the script grants the IAP service agent permission to invoke Cloud Run:

```bash
gcloud run services add-iam-policy-binding "${SERVICE_NAME}" \
  --member="serviceAccount:service-${PROJECT_NUMBER}@gcp-sa-iap.iam.gserviceaccount.com" \
  --role="roles/run.invoker"
```

Without this binding, IAP authenticates users successfully but Cloud Run rejects the forwarded request with `403 Forbidden`.

### 2. `setup-iap.sh`

One-time project setup. The script:

1. Enables `iap.googleapis.com`.
2. Creates an OAuth brand (the consent screen) if one does not exist, using the current `gcloud` account as the support email and `"Nano Banana Features Explorer"` as the application title.
3. Creates an OAuth client for IAP under that brand.
4. Sets the IAP allowed domains to the Cloud Run hostname (e.g. `nanobanana-features-xxxxx-uc.a.run.app`), falling back to `run.app` if the per-host setting is rejected.

Re-running the script is safe — it skips steps that already exist.

### 3. `configure-iap.sh`

Manages who can access the service. Wraps `gcloud iap web add-iam-policy-binding` / `remove-iam-policy-binding` against the `roles/iap.httpsResourceAccessor` role.

```bash
# Grant the entire google.com domain (default behavior)
./configure-iap.sh

# Grant a different domain
./configure-iap.sh --domain example.com

# Grant a single user
./configure-iap.sh --user alice@example.com

# Inspect the current IAM policy
./configure-iap.sh --status

# Revoke access
./configure-iap.sh --remove --domain example.com
./configure-iap.sh --remove --user alice@example.com
```

Granting a domain is equivalent to:

```bash
gcloud iap web add-iam-policy-binding \
  --member="domain:google.com" \
  --role="roles/iap.httpsResourceAccessor" \
  --resource-type=cloud-run \
  --service="${SERVICE_NAME}" \
  --region="${REGION}"
```

## Configuration

All three scripts read the same environment variables (from `.env` or the shell), with these defaults:

| Variable | Default | Used for |
|----------|---------|----------|
| `GOOGLE_CLOUD_PROJECT` | `gcloud config get-value project` | GCP project ID |
| `CLOUD_RUN_REGION` | `us-central1` | Cloud Run region |
| `CLOUD_RUN_SERVICE` | `nanobanana-features` | Cloud Run service name |

CLI flags (`--project`, `--region`, `--service`) override env vars.

## Required IAM roles

To run the setup scripts, the operator needs:

- `roles/run.admin` — deploy and modify the Cloud Run service
- `roles/iam.serviceAccountUser` — bind service accounts to the service
- `roles/iap.admin` — manage the OAuth brand, allowed domains, and IAP IAM policy
- `roles/serviceusage.serviceUsageAdmin` — enable the IAP API

## Troubleshooting

**`403 Forbidden` after sign-in**
The user authenticated with Google but is not in the IAP IAM policy. Run `./configure-iap.sh --status` to see who has access, then add the user/domain.

**`502 Bad Gateway` on every request**
IAP authenticates but cannot invoke Cloud Run. Re-run the invoker binding from `deploy.sh`:

```bash
gcloud run services add-iam-policy-binding "${SERVICE_NAME}" \
  --member="serviceAccount:service-${PROJECT_NUMBER}@gcp-sa-iap.iam.gserviceaccount.com" \
  --role="roles/run.invoker" \
  --region="${REGION}"
```

**"Hostname not in allowed domains"**
The OAuth allowed-domains list does not include the current Cloud Run hostname. Re-run `./setup-iap.sh` — it re-applies the allowed-domains setting against the live service URL.

**Need to test the API without IAP in the loop**
IAP cannot be bypassed on the deployed service. For local testing, run `npm run dev` against the local Next.js dev server, which has no IAP in front of it.
