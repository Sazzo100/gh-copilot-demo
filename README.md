# Github Copilot demo 

## Demo Scenarios

### To start discovering Github Copilot jump to [`The Ultimate GitHub Copilot Tutorial on MOAW`](https://aka.ms/github-copilot-hol)
<br/>


## Solution Overview


This repository has been inspired by the [Azure Container Apps: Dapr Albums Sample](https://github.com/Azure-Samples/containerapps-dapralbums)

It's used as a code base to demonstrate Github Copilot capabilities.

The solution is composed of two services: the .net album API and the NodeJS album viewer.


### Album API (`album-api`)

The [`album-api`](./album-api) is an .NET 8 minimal Web API that manage a list of Albums in memory.

### Album Viewer (`album-viewer`)

The [`album-viewer`](./album-viewer) is a modern Vue.js 3 application built with TypeScript through which the albums retrieved by the API are surfaced. The application uses the Vue 3 Composition API with full TypeScript support for enhanced developer experience and type safety. In order to display the repository of albums, the album viewer contacts the backend album API.

## Getting Started

There are multiple ways to run this solution locally. Choose the method that best fits your development workflow.

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (version 16 or higher)
- [TypeScript](https://www.typescriptlang.org/) (automatically installed with project dependencies)
- [Visual Studio Code](https://code.visualstudio.com/) (recommended)

### Option 1: Using VS Code Debug Panel (Recommended)

This is the easiest way to run the solution with full debugging capabilities.

1. Open the solution in Visual Studio Code
2. Open the Debug panel (Ctrl+Shift+D / Cmd+Shift+D)
3. Select **"All services"** from the dropdown
4. Click the green play button or press F5

This will automatically:
- Build the .NET API and start it on `http://localhost:3000`
- Start the Vue.js TypeScript app on `http://localhost:3001`
- Open both services in your default browser

You can also run individual services:
- **"C#: Album API Debug"** - Runs only the .NET API
- **"Node.js: Album Viewer Debug"** - Runs only the Vue.js TypeScript frontend

### Option 2: Command Line

#### Starting the Album API (.NET)

```powershell
# Navigate to the API directory
cd albums-api

# Restore dependencies (first time only)
dotnet restore

# Run the API
dotnet run
```

The API will start on `http://localhost:3000` and you can access the Swagger documentation at `http://localhost:3000/swagger`.

#### Starting the Album Viewer (Vue.js + TypeScript)

```powershell
# Navigate to the viewer directory
cd album-viewer

# Install dependencies (first time only)
npm install

# Start the development server
npm run dev

# Optional: Run TypeScript type checking
npm run type-check
```

The Vue.js TypeScript app will start on `http://localhost:3001` and automatically open in your browser.

#### Running Both Services

You can run both services simultaneously using separate terminal windows:

```powershell
# Terminal 1 - Start the API
cd albums-api
dotnet run

# Terminal 2 - Start the Vue TypeScript app
cd album-viewer
npm run dev
```

### Environment Configuration

The solution uses the following default configuration:

- **Album API**: Runs on `http://localhost:3000`
- **Album Viewer**: Runs on `http://localhost:3001` (TypeScript + Vue 3)
- **API Endpoint**: The Vue app is configured to call the API at `localhost:3000`

If you need to change these settings, you can modify:
- API port: `albums-api/Properties/launchSettings.json`
- Vue app configuration: Environment variables in `.vscode/launch.json` or set `VITE_ALBUM_API_HOST` environment variable

### Alternative: GitHub Codespaces

The easiest way is to open this solution in a GitHub Codespace, or run it locally in a devcontainer. The development environment will be automatically configured for you.

## Deploy to Azure (Azure Container Apps)

Use this flow to deploy both services (`albums-api` and `album-viewer`) to Azure.

### Prerequisites

- [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli)
- Docker Desktop (running)
- An Azure subscription with permission to create resources

### 1) Sign in and set variables

```powershell
az login
az account set --subscription "<your-subscription-id>"

$RG="rg-copilot-demo"
$LOC="uksouth"
$ACR="acrcopilotdemo123"   # must be globally unique
$ENV="cae-copilot-demo"
$APIAPP="albums-api"
$WEBAPP="album-viewer"
$TAG="v1"
```

### 2) Create resource group and Azure Container Registry

```powershell
az group create --name $RG --location $LOC

az acr create `
  --resource-group $RG `
  --name $ACR `
  --sku Basic `
  --admin-enabled true
```

### 3) Build and push container images

```powershell
az acr build --registry $ACR --image "$APIAPP:$TAG" .\albums-api
az acr build --registry $ACR --image "$WEBAPP:$TAG" .\album-viewer
```

### 4) Create Container Apps environment

```powershell
az containerapp env create `
  --name $ENV `
  --resource-group $RG `
  --location $LOC
```

### 5) Deploy API container app

```powershell
$ACR_SERVER=$(az acr show -n $ACR --query loginServer -o tsv)
$ACR_USER=$(az acr credential show -n $ACR --query username -o tsv)
$ACR_PASS=$(az acr credential show -n $ACR --query "passwords[0].value" -o tsv)

az containerapp create `
  --name $APIAPP `
  --resource-group $RG `
  --environment $ENV `
  --image "$ACR_SERVER/$APIAPP:$TAG" `
  --target-port 3000 `
  --ingress external `
  --registry-server $ACR_SERVER `
  --registry-username $ACR_USER `
  --registry-password $ACR_PASS
```

### 6) Deploy viewer container app

```powershell
az containerapp create `
  --name $WEBAPP `
  --resource-group $RG `
  --environment $ENV `
  --image "$ACR_SERVER/$WEBAPP:$TAG" `
  --target-port 3001 `
  --ingress external `
  --registry-server $ACR_SERVER `
  --registry-username $ACR_USER `
  --registry-password $ACR_PASS
```

### 7) Get public URLs

```powershell
$API_URL=$(az containerapp show -n $APIAPP -g $RG --query properties.configuration.ingress.fqdn -o tsv)
$WEB_URL=$(az containerapp show -n $WEBAPP -g $RG --query properties.configuration.ingress.fqdn -o tsv)

"API: https://$API_URL"
"Viewer: https://$WEB_URL"
```

> Note: If your viewer requires API URL at build-time (for example `VITE_ALBUM_API_HOST`), rebuild/redeploy the viewer image with that value set.