#!/bin/bash

# 🔍 UI Components Audit Script
# ==============================
# Usage: bash scripts/audit-ui-components.sh
# Purpose: Identify all UI components and their locations
# Outputs: audit-report.md

OUTPUT_FILE="UI_AUDIT_REPORT.md"

echo "# 🔍 UI Components Audit Report" > $OUTPUT_FILE
echo "" >> $OUTPUT_FILE
echo "**Generated**: $(date)" >> $OUTPUT_FILE
echo "**Purpose**: Identify all UI components and fragmentation" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

echo "## 1. Composants dans packages/core/src/shared/ui/" >> $OUTPUT_FILE
echo "---" >> $OUTPUT_FILE
find packages/core/src/shared/ui -maxdepth 1 -name "*.tsx" -o -name "*.ts" | sort | while read file; do
  if [[ ! "$file" == *"node_modules"* ]]; then
    echo "- $(basename $file)" >> $OUTPUT_FILE
  fi
done
echo "" >> $OUTPUT_FILE

echo "## 2. Composants dans apps/web/src/components/ui/" >> $OUTPUT_FILE
echo "---" >> $OUTPUT_FILE
find apps/web/src/components/ui -maxdepth 1 -name "*.tsx" 2>/dev/null | sort | while read file; do
  echo "- $(basename $file)" >> $OUTPUT_FILE
done
echo "" >> $OUTPUT_FILE

echo "## 3. Composants dans apps/web/src/components/form/" >> $OUTPUT_FILE
echo "---" >> $OUTPUT_FILE
find apps/web/src/components/form -maxdepth 1 -name "*.tsx" 2>/dev/null | sort | while read file; do
  echo "- $(basename $file)" >> $OUTPUT_FILE
done
echo "" >> $OUTPUT_FILE

echo "## 4. Composants dans apps/web/src/app/[locale]/admin/(dashboard)/components/" >> $OUTPUT_FILE
echo "---" >> $OUTPUT_FILE
find "apps/web/src/app/[locale]/admin/(dashboard)/components" -maxdepth 2 -name "*.tsx" 2>/dev/null | sort | while read file; do
  echo "- $(basename $file)" >> $OUTPUT_FILE
done
echo "" >> $OUTPUT_FILE

echo "## 5. Duplication Checker" >> $OUTPUT_FILE
echo "---" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

# Check for Badge duplicates
echo "### Badge Duplicates" >> $OUTPUT_FILE
echo "Found at:" >> $OUTPUT_FILE
find apps/web -name "badge.tsx" -o -name "*badge*" | grep -i badge | while read file; do
  echo "  - $file" >> $OUTPUT_FILE
done
echo "" >> $OUTPUT_FILE

# Check for pagination duplicates
echo "### Pagination Duplicates" >> $OUTPUT_FILE
echo "Found at:" >> $OUTPUT_FILE
find apps/web -name "*pagination*.tsx" | while read file; do
  echo "  - $file" >> $OUTPUT_FILE
done
echo "" >> $OUTPUT_FILE

# Check for input duplicates
echo "### Input/Checkbox/Form Duplicates" >> $OUTPUT_FILE
echo "Found at:" >> $OUTPUT_FILE
find apps/web -name "*input*.tsx" -o -name "*checkbox*.tsx" | while read file; do
  echo "  - $file" >> $OUTPUT_FILE
done
echo "" >> $OUTPUT_FILE

echo "## 6. Import Analysis" >> $OUTPUT_FILE
echo "---" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

echo "### Files importing from @/components/ui/" >> $OUTPUT_FILE
grep -r "from '@/components/ui'" apps/web/src/ 2>/dev/null | wc -l | xargs echo "Count:" >> $OUTPUT_FILE
grep -r "from '@/components/ui'" apps/web/src/ 2>/dev/null | head -10 >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

echo "### Files importing from @/components/form/" >> $OUTPUT_FILE
grep -r "from '@/components/form'" apps/web/src/ 2>/dev/null | wc -l | xargs echo "Count:" >> $OUTPUT_FILE
grep -r "from '@/components/form'" apps/web/src/ 2>/dev/null | head -10 >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

echo "### Files importing from core/ui" >> $OUTPUT_FILE
grep -r "from '@make-the-change/core/ui'" apps/ 2>/dev/null | wc -l | xargs echo "Count:" >> $OUTPUT_FILE
grep -r "from '@make-the-change/core/ui'" apps/ 2>/dev/null | head -10 >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

echo "## 7. Dépendances Non-Déclarées" >> $OUTPUT_FILE
echo "---" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

echo "### framer-motion usage" >> $OUTPUT_FILE
grep -r "from 'framer-motion'" apps/web/src 2>/dev/null | while read file; do
  echo "  - $file" >> $OUTPUT_FILE
done
echo "" >> $OUTPUT_FILE

echo "### leaflet usage" >> $OUTPUT_FILE
grep -r "from 'leaflet'" apps/web/src 2>/dev/null | while read file; do
  echo "  - $file" >> $OUTPUT_FILE
done
echo "" >> $OUTPUT_FILE

echo "" >> $OUTPUT_FILE
echo "---" >> $OUTPUT_FILE
echo "**Report generated**: $OUTPUT_FILE" >> $OUTPUT_FILE

cat $OUTPUT_FILE
