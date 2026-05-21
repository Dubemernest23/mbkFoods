CREATE TABLE users (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    public_id CHAR(36) NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL,
    phone VARCHAR(30) NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('customer', 'admin', 'super_admin') NOT NULL DEFAULT 'customer',
    status ENUM('active', 'blocked', 'deleted') NOT NULL DEFAULT 'active',
    email_verified_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_public_id (public_id),
    UNIQUE KEY uq_users_email (email),
    KEY idx_users_role (role),
    KEY idx_users_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE delivery_addresses (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    label VARCHAR(80) NULL,
    recipient_name VARCHAR(120) NOT NULL,
    recipient_phone VARCHAR(30) NOT NULL,
    street_address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(80) NOT NULL DEFAULT 'Nigeria',
    landmark VARCHAR(160) NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_delivery_addresses_user_id (user_id),
    CONSTRAINT fk_delivery_addresses_user_id FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE food_categories (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_food_categories_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE foods (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    category_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(140) NOT NULL,
    slug VARCHAR(160) NOT NULL,
    description TEXT NULL,
    price_kobo INT UNSIGNED NOT NULL,
    image_url VARCHAR(500) NULL,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    stock_quantity INT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_foods_slug (slug),
    KEY idx_foods_category_id (category_id),
    KEY idx_foods_available_featured (is_available, is_featured),
    CONSTRAINT fk_foods_category_id FOREIGN KEY (category_id) REFERENCES food_categories(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE orders (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    public_id CHAR(36) NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    idempotency_key VARCHAR(120) NOT NULL,
    status ENUM('draft', 'pending_payment', 'paid', 'preparing', 'ready', 'out_for_delivery', 'completed', 'cancelled', 'refunded') NOT NULL DEFAULT 'pending_payment',
    subtotal_kobo INT UNSIGNED NOT NULL DEFAULT 0,
    delivery_fee_kobo INT UNSIGNED NOT NULL DEFAULT 0,
    discount_kobo INT UNSIGNED NOT NULL DEFAULT 0,
    total_kobo INT UNSIGNED NOT NULL DEFAULT 0,
    currency CHAR(3) NOT NULL DEFAULT 'NGN',
    delivery_address_snapshot JSON NOT NULL,
    customer_note TEXT NULL,
    paid_at DATETIME NULL,
    completed_at DATETIME NULL,
    cancelled_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_orders_public_id (public_id),
    UNIQUE KEY uq_orders_user_idempotency (user_id, idempotency_key),
    KEY idx_orders_user_id (user_id),
    KEY idx_orders_status (status),
    CONSTRAINT fk_orders_user_id FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE order_items (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    order_id BIGINT UNSIGNED NOT NULL,
    food_id BIGINT UNSIGNED NOT NULL,
    food_name_snapshot VARCHAR(140) NOT NULL,
    unit_price_kobo INT UNSIGNED NOT NULL,
    quantity INT UNSIGNED NOT NULL,
    line_total_kobo INT UNSIGNED NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_order_items_order_food (order_id, food_id),
    KEY idx_order_items_food_id (food_id),
    CONSTRAINT fk_order_items_order_id FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_order_items_food_id FOREIGN KEY (food_id) REFERENCES foods(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE payments (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    order_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    idempotency_key VARCHAR(120) NOT NULL,
    provider ENUM('paystack') NOT NULL DEFAULT 'paystack',
    provider_reference VARCHAR(160) NOT NULL,
    access_code VARCHAR(180) NULL,
    authorization_url VARCHAR(500) NULL,
    amount_kobo INT UNSIGNED NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'NGN',
    status ENUM('initialized', 'pending', 'success', 'failed', 'abandoned', 'reversed') NOT NULL DEFAULT 'initialized',
    gateway_response VARCHAR(255) NULL,
    paid_at DATETIME NULL,
    verified_at DATETIME NULL,
    raw_response JSON NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_payments_order_idempotency (order_id, idempotency_key),
    UNIQUE KEY uq_payments_provider_reference (provider, provider_reference),
    KEY idx_payments_order_id (order_id),
    KEY idx_payments_user_id (user_id),
    KEY idx_payments_status (status),
    CONSTRAINT fk_payments_order_id FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_payments_user_id FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE payment_events (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    provider ENUM('paystack') NOT NULL DEFAULT 'paystack',
    provider_event_id VARCHAR(180) NOT NULL,
    provider_reference VARCHAR(160) NULL,
    event_type VARCHAR(120) NOT NULL,
    payload JSON NOT NULL,
    signature VARCHAR(255) NULL,
    processed_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_payment_events_provider_event (provider, provider_event_id),
    KEY idx_payment_events_reference (provider_reference),
    KEY idx_payment_events_processed_at (processed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE approved_transactions (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    payment_id BIGINT UNSIGNED NOT NULL,
    order_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    provider ENUM('paystack') NOT NULL DEFAULT 'paystack',
    provider_reference VARCHAR(160) NOT NULL,
    amount_kobo INT UNSIGNED NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'NGN',
    approved_at DATETIME NOT NULL,
    verification_payload JSON NOT NULL,
    recorded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_approved_transactions_payment_id (payment_id),
    UNIQUE KEY uq_approved_transactions_provider_reference (provider, provider_reference),
    KEY idx_approved_transactions_order_id (order_id),
    KEY idx_approved_transactions_user_id (user_id),
    CONSTRAINT fk_approved_transactions_payment_id FOREIGN KEY (payment_id) REFERENCES payments(id),
    CONSTRAINT fk_approved_transactions_order_id FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_approved_transactions_user_id FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TRIGGER trg_approved_transactions_no_update
BEFORE UPDATE ON approved_transactions
FOR EACH ROW
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = 'approved_transactions is immutable';

CREATE TRIGGER trg_approved_transactions_no_delete
BEFORE DELETE ON approved_transactions
FOR EACH ROW
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = 'approved_transactions is immutable';

CREATE TABLE idempotency_keys (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NULL,
    scope_key VARCHAR(180) NOT NULL,
    idempotency_key VARCHAR(120) NOT NULL,
    request_method VARCHAR(12) NOT NULL,
    request_path VARCHAR(255) NOT NULL,
    request_hash CHAR(64) NOT NULL,
    response_status SMALLINT UNSIGNED NULL,
    response_body JSON NULL,
    locked_until DATETIME NULL,
    completed_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_idempotency_scope (scope_key, idempotency_key, request_method, request_path),
    KEY idx_idempotency_key (idempotency_key),
    KEY idx_idempotency_user_id (user_id),
    KEY idx_idempotency_locked_until (locked_until),
    CONSTRAINT fk_idempotency_keys_user_id FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
