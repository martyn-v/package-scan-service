.PHONY: test_success test_fail_idempotency test_fail_negative_dimensions test_fail_missing_dimensions test_fail_future_timestamp test_fail_missing_tracking_id test_all_validations

test_success:
	bash scripts/test_success.sh

test_fail_idempotency:
	bash scripts/test_fail_idempotency.sh

test_fail_negative_dimensions:
	bash scripts/test_fail_negative_dimensions.sh

test_fail_missing_dimensions:
	bash scripts/test_fail_missing_dimensions.sh

test_fail_future_timestamp:
	bash scripts/test_fail_future_timestamp.sh

test_fail_missing_tracking_id:
	bash scripts/test_fail_missing_tracking_id.sh

test_all_validations:
	bash scripts/test_all_validations.sh
