CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY,
	`created_at` integer NOT NULL,
	`amount` integer NOT NULL,
	`kind` text NOT NULL,
	`occurred_at` integer NOT NULL,
	`note` text NOT NULL
);
