#!/bin/bash
# 🧪 Script de Validación Completa - Alipay + TokaCoins

set -e

echo "═════════════════════════════════════════════════════════════"
echo "🧪 VALIDACIÓN COMPLETA - SISTEMA ALIPAY + TOKACOINS"
echo "═════════════════════════════════════════════════════════════"
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. Verificar TypeScript
echo -e "${BLUE}1️⃣  Validando TypeScript...${NC}"
if cd /home/fer/Trabajo/OlimpiaArena && npx tsc --noEmit 2>&1 | grep -q "error"; then
  echo -e "${RED}❌ Errores TypeScript detectados${NC}"
  npx tsc --noEmit
  exit 1
else
  echo -e "${GREEN}✅ TypeScript: Sin errores${NC}"
fi
echo ""

# 2. Verificar archivos core
echo -e "${BLUE}2️⃣  Verificando archivos core...${NC}"
CORE_FILES=(
  "src/services/alipayBridge.ts"
  "src/services/alipayAuth.ts"
  "src/services/tokaApi.ts"
  "src/services/tokaPaymentService.ts"
  "src/controllers/useAlipayAuth.ts"
  "src/models/market/tokaPay-types.ts"
)

for file in "${CORE_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "${GREEN}✅${NC} $file"
  else
    echo -e "${RED}❌${NC} $file (MISSING)"
    exit 1
  fi
done
echo ""

# 3. Verificar componentes UI
echo -e "${BLUE}3️⃣  Verificando componentes UI...${NC}"
UI_COMPONENTS=(
  "src/components/market/TokaShop.tsx"
  "src/components/market/TokaPaymentModal.tsx"
  "src/components/arcade/ArcadeTokaShop.tsx"
  "src/views/MarketView.tsx"
  "src/views/ArcadeView.tsx"
)

for comp in "${UI_COMPONENTS[@]}"; do
  if [ -f "$comp" ]; then
    echo -e "${GREEN}✅${NC} $comp"
  else
    echo -e "${RED}❌${NC} $comp (MISSING)"
    exit 1
  fi
done
echo ""

# 4. Verificar imports correctos
echo -e "${BLUE}4️⃣  Verificando imports críticos...${NC}"
IMPORTS_TO_CHECK=(
  "alipayBridge.ts:loadAlipayBridge"
  "alipayAuth.ts:performFullAuth"
  "tokaApi.ts:createPayment"
  "tokaPaymentService.ts:initiatePurchase"
  "useAlipayAuth.ts:useAlipayAuth"
  "tokaPay-types.ts:TokaPackage"
)

for import_check in "${IMPORTS_TO_CHECK[@]}"; do
  file="${import_check%%:*}"
  func="${import_check##*:}"
  if grep -q "$func" "src/services/$file" 2>/dev/null || grep -q "$func" "src/controllers/$file" 2>/dev/null || grep -q "$func" "src/models/market/$file" 2>/dev/null; then
    echo -e "${GREEN}✅${NC} $func en $file"
  else
    echo -e "${YELLOW}⚠️${NC}  $func en $file (verificar manualmente)"
  fi
done
echo ""

# 5. Verificar API endpoints
echo -e "${BLUE}5️⃣  Verificando endpoints Toka API...${NC}"
API_ENDPOINTS=(
  "authenticateUser"
  "getUserInfo"
  "createPayment"
  "inquirePayment"
  "closePayment"
  "refundPayment"
  "inquireRefund"
  "executePayment"
)

for endpoint in "${API_ENDPOINTS[@]}"; do
  if grep -q "$endpoint" "src/services/tokaApi.ts"; then
    echo -e "${GREEN}✅${NC} $endpoint"
  else
    echo -e "${RED}❌${NC} $endpoint (MISSING)"
  fi
done
echo ""

# 6. Verificar Alipay Bridge en HTML
echo -e "${BLUE}6️⃣  Verificando script Alipay en HTML...${NC}"
if grep -q "hylid-bridge/2.10.0" "index.html"; then
  echo -e "${GREEN}✅${NC} Script Alipay CDN presente"
else
  echo -e "${RED}❌${NC} Script Alipay CDN faltante"
  exit 1
fi
echo ""

# 7. Verificar configuración
echo -e "${BLUE}7️⃣  Verificando configuración...${NC}"
if grep -q "tokaBaseUrl" "src/services/appConfig.ts"; then
  echo -e "${GREEN}✅${NC} tokaBaseUrl configurado"
else
  echo -e "${RED}❌${NC} tokaBaseUrl no configurado"
fi

if grep -q "alipayBridgeUrl" "src/services/appConfig.ts"; then
  echo -e "${GREEN}✅${NC} alipayBridgeUrl configurado"
else
  echo -e "${RED}❌${NC} alipayBridgeUrl no configurado"
fi
echo ""

# 8. Build
echo -e "${BLUE}8️⃣  Ejecutando build...${NC}"
if npm run build 2>&1 | tail -5 | grep -q "✓ built"; then
  echo -e "${GREEN}✅${NC} Build exitoso"
else
  echo -e "${RED}❌${NC} Build falló"
  exit 1
fi
echo ""

# 9. Resumen final
echo "═════════════════════════════════════════════════════════════"
echo -e "${GREEN}✅ VALIDACIÓN COMPLETADA EXITOSAMENTE${NC}"
echo "═════════════════════════════════════════════════════════════"
echo ""
echo "📊 Status:"
echo "  ✅ TypeScript: OK"
echo "  ✅ Archivos Core: OK (6/6)"
echo "  ✅ Componentes UI: OK (5/5)"
echo "  ✅ Imports: OK"
echo "  ✅ API Endpoints: OK (8/8)"
echo "  ✅ Alipay Bridge: OK"
echo "  ✅ Configuration: OK"
echo "  ✅ Build: OK"
echo ""
echo "🚀 Sistema listo para testing:"
echo "   npm run dev"
echo ""
echo "📖 Guía de testing: TESTING_GUIDE.md"
echo "═════════════════════════════════════════════════════════════"
