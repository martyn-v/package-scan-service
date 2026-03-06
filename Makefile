.PHONY: test_success test_fail_idempotency

test_success:
	bash scripts/test_success.sh

test_fail_idempotency:
	bash scripts/test_fail_idempotency.sh
