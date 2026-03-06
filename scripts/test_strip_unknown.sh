#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"
EVENT_ID="evt_$(head -c 16 /dev/urandom | xxd -p | head -c 12)"

echo "=== Extra fields in payload (should be accepted, extras stripped) ==="
curl -s -X POST "${BASE_URL}/events/package-scan" \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "'"${EVENT_ID}"'",
    "source": "edge-camera",
    "timestamp": "2026-01-20T10:15:00Z",
    "unexpectedField": "should be stripped",
    "package": {
      "trackingId": "PKG-001",
      "extraNested": true,
      "dimensions": {
        "length": 120,
        "width": 80,
        "height": 60,
        "unit": "cm"
      },
      "weight": {
        "value": 25,
        "unit": "kg"
      }
    }
  }' | jq .
