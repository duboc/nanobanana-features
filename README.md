# Nano Banana Features Explorer

Interactive web app showcasing all Gemini native image generation capabilities (codename: Nano Banana). Built with Next.js and the `@google/genai` SDK using GCP Application Default Credentials via Vertex AI.

## Features

| Feature | Description |
|---------|-------------|
| **Text to Image** | Generate images from text prompts with model, aspect ratio, and resolution controls |
| **Image Editing** | Upload an image and edit it with natural language instructions (inpainting, outpainting, style transfer, background swap, object removal, and more) |
| **Multi-turn Chat** | Conversational image generation that maintains context across turns |
| **Reference Images** | Generate new images guided by up to 14 reference images |
| **Search Grounding** | Generate images informed by real-time Google Search results |
| **Style Gallery** | Pre-built prompt templates organized by category for one-click generation |
| **Documentation** | Comprehensive in-app docs covering every feature, technique, and best practice |
| **Pricing Calculator** | Interactive cost estimator for all three models with per-request and monthly projections |

## Models

| Model | Codename | Strengths |
|-------|----------|-----------|
| `gemini-3.1-flash-image-preview` | Nano Banana 2 | 512px support, 14 aspect ratios, image search grounding, 4K resolution |
| `gemini-3-pro-image-preview` | Nano Banana Pro | Best quality, advanced reasoning, high-fidelity text rendering |
| `gemini-2.5-flash-image` | Nano Banana | Fastest, lowest cost, high-volume workloads |

## Prerequisites

- **Node.js** 22+
- **GCP project** with Vertex AI API enabled
- **Application Default Credentials** configured:
  ```bash
  gcloud auth application-default login
  ```

## Local Development

```bash
# Install dependencies
npm install

# Set your GCP project (or create .env.local)
export GOOGLE_CLOUD_PROJECT=your-project-id
export GOOGLE_CLOUD_LOCATION=us-central1

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GOOGLE_CLOUD_PROJECT` | Yes | — | GCP project ID |
| `GOOGLE_CLOUD_LOCATION` | No | `us-central1` | Region for Gemini 2.5 Flash (3.1 Flash and 3 Pro always use `global`) |

## Deploy to Cloud Run

Three scripts handle deployment with IAP authentication:

```bash
# 1. Deploy the app (builds from source using Dockerfile)
./deploy.sh --project your-project-id

# 2. One-time: configure OAuth consent screen & allowed domains
./setup-iap.sh --project your-project-id

# 3. One-time: grant access to google.com domain
./configure-iap.sh --project your-project-id
```

On subsequent deploys, only step 1 is needed.

### Deploy Script Options

```bash
./deploy.sh \
  --project my-project \
  --region us-central1 \
  --service nanobanana-features \
  --memory 1Gi \
  --cpu 1
```

### IAP Configuration

```bash
# Grant a specific domain
./configure-iap.sh --domain example.com

# Grant a specific user
./configure-iap.sh --user user@example.com

# Check current IAP policy
./configure-iap.sh --status

# Remove access
./configure-iap.sh --remove --domain example.com
```

## Tech Stack

- [Next.js 16](https://nextjs.org/) — App Router, TypeScript, standalone output
- [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) — Google Cloud-inspired dark theme
- [@google/genai](https://www.npmjs.com/package/@google/genai) — Gemini API with Vertex AI mode
- [Vitest](https://vitest.dev/) + Testing Library — 39 tests across 4 test files

## Project Structure

```
src/
├── app/
│   ├── api/              # Server-side Gemini API routes
│   │   ├── generate/     # Text-to-image
│   │   ├── edit/         # Image editing
│   │   ├── chat/         # Multi-turn chat
│   │   ├── reference/    # Reference image generation
│   │   └── search-grounded/  # Search-grounded generation
│   ├── text-to-image/    # Feature pages
│   ├── image-editing/
│   ├── multi-turn/
│   ├── reference-images/
│   ├── search-grounding/
│   ├── style-gallery/
│   ├── docs/             # In-app documentation
│   └── pricing/          # Pricing calculator
├── components/
│   ├── layout/           # Sidebar, page container
│   ├── image/            # Gallery, upload, lightbox
│   ├── generation/       # Prompt input, model/ratio/resolution pickers
│   ├── chat/             # Chat message, history
│   └── ui/               # shadcn/ui primitives
├── hooks/                # useImageGeneration, useChatSession
├── lib/                  # Gemini client, models, image utils, style templates
└── types/                # TypeScript interfaces
```

## Testing

```bash
npm test          # Watch mode
npm run test:run  # Single run
```

## License

See [LICENSE](LICENSE).
