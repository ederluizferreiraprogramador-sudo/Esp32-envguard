#!/usr/bin/env bash
# Monta o pacote do FenixInglês para o Lovable: código do app (sem os dados das unidades,
# que já estão lá) + imagens dos personagens. Uso: tools/pacote-lovable.sh <saida.zip>
set -euo pipefail
OUT="${1:?informe o arquivo .zip de saída}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)/fenixingles"
TMP="$(mktemp -d)"
mkdir -p "$TMP/pacote/src" "$TMP/pacote/public"
cp -r "$ROOT/src/components" "$ROOT/src/lib" "$ROOT/src/routes" "$TMP/pacote/src/"
cp "$ROOT/src/styles.fx.css" "$ROOT/src/"*.test.ts "$TMP/pacote/src/"
cp -r "$ROOT/public/characters" "$TMP/pacote/public/"
cp "$(dirname "$0")/../docs/LOVABLE-LOGIN.md" "$TMP/pacote/LEIA-ME.md"
(cd "$TMP" && zip -qr "$OUT" pacote)
rm -rf "$TMP"
echo "ok: $OUT"
