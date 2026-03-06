#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=========================================="
echo " Running all validation test scripts"
echo "=========================================="
echo ""

bash "${SCRIPT_DIR}/test_success.sh"
echo ""

bash "${SCRIPT_DIR}/test_fail_idempotency.sh"
echo ""

bash "${SCRIPT_DIR}/test_fail_negative_dimensions.sh"
echo ""

bash "${SCRIPT_DIR}/test_fail_missing_dimensions.sh"
echo ""

bash "${SCRIPT_DIR}/test_fail_future_timestamp.sh"
echo ""

bash "${SCRIPT_DIR}/test_fail_missing_tracking_id.sh"
echo ""

bash "${SCRIPT_DIR}/test_warn_small_dimensions.sh"
echo ""

bash "${SCRIPT_DIR}/test_warn_absurd_height.sh"
echo ""

bash "${SCRIPT_DIR}/test_strip_unknown.sh"
echo ""

echo "=========================================="
echo " All validation tests completed"
echo "=========================================="
