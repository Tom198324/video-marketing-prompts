CREATE TABLE `user_tags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`prompt_number` int NOT NULL,
	`tag` varchar(100) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_tags_id` PRIMARY KEY(`id`)
);
