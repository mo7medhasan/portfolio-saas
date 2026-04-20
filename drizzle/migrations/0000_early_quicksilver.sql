CREATE TABLE `analytics_events` (
	`id` text PRIMARY KEY NOT NULL,
	`portfolio_id` text NOT NULL,
	`event` text NOT NULL,
	`page` text,
	`referrer` text,
	`country` text,
	`device` text,
	`browser` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`portfolio_id`) REFERENCES `portfolios`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `analytics_portfolio_idx` ON `analytics_events` (`portfolio_id`);--> statement-breakpoint
CREATE INDEX `analytics_event_idx` ON `analytics_events` (`event`);--> statement-breakpoint
CREATE INDEX `analytics_date_idx` ON `analytics_events` (`portfolio_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`portfolio_id` text,
	`action` text NOT NULL,
	`entity` text NOT NULL,
	`entity_id` text,
	`before` text,
	`after` text,
	`ip_address` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`portfolio_id`) REFERENCES `portfolios`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `audit_user_idx` ON `audit_logs` (`user_id`);--> statement-breakpoint
CREATE INDEX `audit_portfolio_idx` ON `audit_logs` (`portfolio_id`);--> statement-breakpoint
CREATE TABLE `contact_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`portfolio_id` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`subject` text,
	`message` text NOT NULL,
	`phone` text,
	`status` text DEFAULT 'unread' NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`portfolio_id`) REFERENCES `portfolios`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `contact_messages_portfolio_idx` ON `contact_messages` (`portfolio_id`);--> statement-breakpoint
CREATE INDEX `contact_messages_status_idx` ON `contact_messages` (`status`);--> statement-breakpoint
CREATE TABLE `design_tokens` (
	`id` text PRIMARY KEY NOT NULL,
	`portfolio_id` text NOT NULL,
	`key` text NOT NULL,
	`value` text NOT NULL,
	`dark_value` text,
	`label` text NOT NULL,
	`category` text NOT NULL,
	`type` text NOT NULL,
	`options` text,
	`default_value` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`portfolio_id`) REFERENCES `portfolios`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `design_tokens_portfolio_key_idx` ON `design_tokens` (`portfolio_id`,`key`);--> statement-breakpoint
CREATE INDEX `design_tokens_category_idx` ON `design_tokens` (`portfolio_id`,`category`);--> statement-breakpoint
CREATE TABLE `domains` (
	`id` text PRIMARY KEY NOT NULL,
	`portfolio_id` text NOT NULL,
	`type` text NOT NULL,
	`domain` text NOT NULL,
	`is_verified` integer DEFAULT false NOT NULL,
	`verification_token` text,
	`verified_at` text,
	`ssl_status` text DEFAULT 'pending',
	`is_primary` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`portfolio_id`) REFERENCES `portfolios`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `domains_domain_idx` ON `domains` (`domain`);--> statement-breakpoint
CREATE INDEX `domains_portfolio_idx` ON `domains` (`portfolio_id`);--> statement-breakpoint
CREATE TABLE `media` (
	`id` text PRIMARY KEY NOT NULL,
	`portfolio_id` text NOT NULL,
	`uploaded_by` text NOT NULL,
	`file_name` text NOT NULL,
	`original_name` text NOT NULL,
	`mime_type` text NOT NULL,
	`size_bytes` integer NOT NULL,
	`url` text NOT NULL,
	`thumbnail_url` text,
	`width` integer,
	`height` integer,
	`alt` text,
	`caption` text,
	`folder` text DEFAULT 'uploads',
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`portfolio_id`) REFERENCES `portfolios`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `media_portfolio_idx` ON `media` (`portfolio_id`);--> statement-breakpoint
CREATE TABLE `plans` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`price_monthly` real DEFAULT 0 NOT NULL,
	`price_yearly` real DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`max_portfolios` integer DEFAULT 1 NOT NULL,
	`allow_custom_domain` integer DEFAULT false NOT NULL,
	`allow_custom_scripts` integer DEFAULT false NOT NULL,
	`allow_advanced_seo` integer DEFAULT false NOT NULL,
	`allow_analytics` integer DEFAULT false NOT NULL,
	`allow_password_protect` integer DEFAULT false NOT NULL,
	`allow_remove_branding` integer DEFAULT false NOT NULL,
	`max_media_mb` integer DEFAULT 100 NOT NULL,
	`max_sections` integer DEFAULT 10 NOT NULL,
	`support_level` text DEFAULT 'community' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `portfolio_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`portfolio_id` text NOT NULL,
	`meta_title` text,
	`meta_description` text,
	`meta_keywords` text,
	`og_title` text,
	`og_description` text,
	`og_image_url` text,
	`og_type` text DEFAULT 'website',
	`twitter_card` text DEFAULT 'summary_large_image',
	`twitter_handle` text,
	`canonical_url` text,
	`robots_directive` text DEFAULT 'index, follow',
	`structured_data_json` text,
	`sitemap_enabled` integer DEFAULT true NOT NULL,
	`robots_txt` text,
	`head_scripts` text,
	`body_start_scripts` text,
	`body_end_scripts` text,
	`custom_css` text,
	`custom_js` text,
	`google_analytics_id` text,
	`google_tag_manager_id` text,
	`facebook_pixel_id` text,
	`hotjar_id` text,
	`header_style` text DEFAULT 'sticky',
	`header_layout` text DEFAULT 'default',
	`footer_enabled` integer DEFAULT true NOT NULL,
	`footer_content` text,
	`social_links` text,
	`favicon_url` text,
	`apple_icon_url` text,
	`maintenance_mode` integer DEFAULT false NOT NULL,
	`maintenance_message` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`portfolio_id`) REFERENCES `portfolios`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `portfolios` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`tagline` text,
	`description` text,
	`locale` text DEFAULT 'en' NOT NULL,
	`direction` text DEFAULT 'ltr' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`published_at` text,
	`is_password_protected` integer DEFAULT false NOT NULL,
	`password_hash` text,
	`show_platform_branding` integer DEFAULT true NOT NULL,
	`thumbnail_url` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `portfolios_slug_idx` ON `portfolios` (`slug`);--> statement-breakpoint
CREATE INDEX `portfolios_user_idx` ON `portfolios` (`user_id`);--> statement-breakpoint
CREATE TABLE `sections` (
	`id` text PRIMARY KEY NOT NULL,
	`portfolio_id` text NOT NULL,
	`type` text NOT NULL,
	`label` text,
	`variant` text DEFAULT 'default' NOT NULL,
	`content` text DEFAULT '{}' NOT NULL,
	`is_visible` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`background_color` text,
	`padding_top` integer,
	`padding_bottom` integer,
	`full_width` integer DEFAULT false NOT NULL,
	`anchor_id` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`portfolio_id`) REFERENCES `portfolios`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `sections_portfolio_idx` ON `sections` (`portfolio_id`);--> statement-breakpoint
CREATE INDEX `sections_order_idx` ON `sections` (`portfolio_id`,`sort_order`);--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`plan_id` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`billing_cycle` text DEFAULT 'monthly' NOT NULL,
	`gateway_provider` text,
	`gateway_subscription_id` text,
	`gateway_customer_id` text,
	`trial_ends_at` text,
	`current_period_start` text,
	`current_period_end` text,
	`canceled_at` text,
	`cancel_reason` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`plan_id`) REFERENCES `plans`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `subscriptions_user_idx` ON `subscriptions` (`user_id`);--> statement-breakpoint
CREATE INDEX `subscriptions_status_idx` ON `subscriptions` (`status`);--> statement-breakpoint
CREATE TABLE `theme_presets` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`preview_image_url` text,
	`tokens` text NOT NULL,
	`is_global` integer DEFAULT false NOT NULL,
	`created_by` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`avatar_url` text,
	`hashed_password` text,
	`email_verified` integer DEFAULT false NOT NULL,
	`email_verified_at` text,
	`provider` text DEFAULT 'credentials',
	`provider_id` text,
	`role` text DEFAULT 'user' NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`is_banned` integer DEFAULT false NOT NULL,
	`banned_reason` text,
	`onboarding_completed` integer DEFAULT false NOT NULL,
	`onboarding_step` integer DEFAULT 0,
	`last_login_at` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `users_provider_idx` ON `users` (`provider`,`provider_id`);