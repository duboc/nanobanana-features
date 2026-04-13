# Exemplos de API com curl

Guia para testar os modelos de geração de imagem Nano Banana diretamente via `curl`.

## Modelos disponíveis

| Modelo | ID | Endpoint |
|--------|----|----------|
| Flash 3.1 | `gemini-3.1-flash-image-preview` | `global` |
| Pro 3 | `gemini-3-pro-image-preview` | `global` |
| Flash 2.5 | `gemini-2.5-flash-image` | `us-central1` |

## Autenticação

Existem duas formas de autenticar as requisições.

### Opção 1 — Application Default Credentials (ADC)

Recomendado para quem já trabalha com GCP. Usa o token de acesso do `gcloud`:

```bash
export PROJECT_ID="seu-projeto-gcp"
gcloud auth application-default login
gcloud config set project $PROJECT_ID
```

### Opção 2 — API Key

Mais simples para testes rápidos. Crie uma chave em **APIs & Services > Credentials** no Console do GCP:

```bash
export API_KEY="sua-api-key-aqui"
```

## Exemplo 1 — Geração básica de imagem (text-to-image)

### Passo 1: Criar o arquivo de requisição

```bash
cat << 'EOF' > request.json
{
  "contents": [
    {
      "role": "user",
      "parts": [
        {
          "text": "Gere uma imagem de um cachorro golden retriever brincando em folhas de outono em um parque, com luz suave de fim de tarde."
        }
      ]
    }
  ],
  "generationConfig": {
    "temperature": 1,
    "maxOutputTokens": 32768,
    "responseModalities": ["TEXT", "IMAGE"],
    "topP": 0.95,
    "imageConfig": {
      "aspectRatio": "auto",
      "imageSize": "1K",
      "imageOutputOptions": {
        "mimeType": "image/png"
      },
      "personGeneration": "ALLOW_ALL"
    },
    "thinkingConfig": {
      "thinkingLevel": "HIGH"
    }
  },
  "safetySettings": [
    { "category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "OFF" },
    { "category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "OFF" },
    { "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "OFF" },
    { "category": "HARM_CATEGORY_HARASSMENT", "threshold": "OFF" }
  ]
}
EOF
```

### Passo 2: Chamar a API

**Com ADC:**

```bash
curl \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  "https://aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/global/publishers/google/models/gemini-3.1-flash-image-preview:streamGenerateContent" \
  -d '@request.json'
```

**Com API Key:**

```bash
curl \
  -X POST \
  -H "Content-Type: application/json" \
  "https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-3.1-flash-image-preview:streamGenerateContent?key=${API_KEY}" \
  -d '@request.json'
```

## Exemplo 2 — Imagem em alta resolução (4K)

Altere `imageSize` para `4K` no corpo da requisição. Disponível nos modelos Flash 3.1 e Pro 3.

```bash
cat << 'EOF' > request_4k.json
{
  "contents": [
    {
      "role": "user",
      "parts": [
        {
          "text": "Uma fotografia macro detalhada de uma gota de orvalho em uma teia de aranha ao nascer do sol, com bokeh no fundo."
        }
      ]
    }
  ],
  "generationConfig": {
    "temperature": 1,
    "maxOutputTokens": 32768,
    "responseModalities": ["TEXT", "IMAGE"],
    "topP": 0.95,
    "imageConfig": {
      "aspectRatio": "auto",
      "imageSize": "4K",
      "imageOutputOptions": {
        "mimeType": "image/png"
      },
      "personGeneration": "ALLOW_ALL"
    },
    "thinkingConfig": {
      "thinkingLevel": "HIGH"
    }
  },
  "safetySettings": [
    { "category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "OFF" },
    { "category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "OFF" },
    { "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "OFF" },
    { "category": "HARM_CATEGORY_HARASSMENT", "threshold": "OFF" }
  ]
}
EOF
```

```bash
curl \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  "https://aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/global/publishers/google/models/gemini-3.1-flash-image-preview:streamGenerateContent" \
  -d '@request_4k.json'
```

## Exemplo 3 — Aspect ratio 16:9 (panorâmico)

Útil para gerar imagens wide para banners ou wallpapers.

```bash
cat << 'EOF' > request_wide.json
{
  "contents": [
    {
      "role": "user",
      "parts": [
        {
          "text": "Vista panorâmica de um vale montanhoso com neblina ao amanhecer, camadas de montanhas desaparecendo na distância."
        }
      ]
    }
  ],
  "generationConfig": {
    "temperature": 1,
    "maxOutputTokens": 32768,
    "responseModalities": ["TEXT", "IMAGE"],
    "topP": 0.95,
    "imageConfig": {
      "aspectRatio": "16:9",
      "imageSize": "1K",
      "imageOutputOptions": {
        "mimeType": "image/png"
      },
      "personGeneration": "ALLOW_ALL"
    },
    "thinkingConfig": {
      "thinkingLevel": "HIGH"
    }
  },
  "safetySettings": [
    { "category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "OFF" },
    { "category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "OFF" },
    { "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "OFF" },
    { "category": "HARM_CATEGORY_HARASSMENT", "threshold": "OFF" }
  ]
}
EOF
```

```bash
curl \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  "https://aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/global/publishers/google/models/gemini-3.1-flash-image-preview:streamGenerateContent" \
  -d '@request_wide.json'
```

## Exemplo 4 — Geração rápida (thinking minimal)

Para prompts simples, use `thinkingLevel: "minimal"` para gerar mais rápido:

```bash
cat << 'EOF' > request_fast.json
{
  "contents": [
    {
      "role": "user",
      "parts": [
        {
          "text": "Um ícone flat design de um foguete vermelho em fundo branco."
        }
      ]
    }
  ],
  "generationConfig": {
    "temperature": 1,
    "maxOutputTokens": 32768,
    "responseModalities": ["TEXT", "IMAGE"],
    "topP": 0.95,
    "imageConfig": {
      "aspectRatio": "auto",
      "imageSize": "1K",
      "imageOutputOptions": {
        "mimeType": "image/png"
      },
      "personGeneration": "ALLOW_ALL"
    },
    "thinkingConfig": {
      "thinkingLevel": "minimal"
    }
  },
  "safetySettings": [
    { "category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "OFF" },
    { "category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "OFF" },
    { "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "OFF" },
    { "category": "HARM_CATEGORY_HARASSMENT", "threshold": "OFF" }
  ]
}
EOF
```

```bash
curl \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  "https://aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/global/publishers/google/models/gemini-3.1-flash-image-preview:streamGenerateContent" \
  -d '@request_fast.json'
```

## Exemplo 5 — Usando o modelo Pro 3

O Pro 3 usa o mesmo endpoint `global`, mas com o model ID diferente. A qualidade de imagem é superior, com custo maior:

```bash
curl \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  "https://aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/global/publishers/google/models/gemini-3-pro-image-preview:streamGenerateContent" \
  -d '@request.json'
```

## Exemplo 6 — Usando o modelo Flash 2.5

O Flash 2.5 usa o endpoint regional `us-central1` (não `global`):

```bash
curl \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  "https://us-central1-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/us-central1/publishers/google/models/gemini-2.5-flash-image:streamGenerateContent" \
  -d '@request.json'
```

## Entendendo a resposta

A API retorna um JSON com a imagem codificada em base64. A estrutura é:

```json
{
  "candidates": [{
    "content": {
      "parts": [
        { "text": "Aqui está a imagem gerada..." },
        {
          "inlineData": {
            "mimeType": "image/png",
            "data": "<imagem-codificada-em-base64>"
          }
        }
      ]
    }
  }]
}
```

### Salvando a imagem

Para extrair e salvar a imagem da resposta (requer `jq`):

```bash
# Salvar a resposta primeiro
curl ... -o response.json

# Extrair e decodificar a imagem
cat response.json \
  | jq -r '.[0].candidates[0].content.parts[] | select(.inlineData) | .inlineData.data' \
  | base64 -d > output.png
```

## Parâmetros importantes

| Parâmetro | Valores | Descrição |
|-----------|---------|-----------|
| `imageSize` | `512`, `1K`, `2K`, `4K` | Resolução da imagem. 512 só no Flash 3.1 |
| `aspectRatio` | `auto`, `1:1`, `16:9`, `9:16`, `4:3`, `3:4`, etc. | Proporção da imagem |
| `thinkingLevel` | `minimal`, `HIGH` | Nível de raciocínio. `minimal` = mais rápido |
| `personGeneration` | `ALLOW_ALL`, `DONT_ALLOW` | Permite ou bloqueia geração de pessoas |
| `mimeType` | `image/png`, `image/jpeg` | Formato da imagem de saída |
| `temperature` | `0` a `2` | Criatividade. Valores maiores = mais variação |
| `responseModalities` | `["TEXT", "IMAGE"]` | Tipos de resposta desejados |

## Dicas

- Use `streamGenerateContent` para respostas em streaming ou `generateContent` para resposta única.
- Os modelos Flash 3.1 e Pro 3 usam o endpoint `global`. O Flash 2.5 usa `us-central1`.
- As `safetySettings` com threshold `OFF` desabilitam filtros de conteúdo — ajuste para uso em produção.
- Resoluções disponíveis variam por modelo: Flash 3.1 suporta 512/1K/2K/4K, Pro 3 suporta 1K/2K/4K, Flash 2.5 apenas 1K.
