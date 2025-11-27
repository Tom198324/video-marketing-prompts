CREATE TABLE `favorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`promptId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `favorites_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `prompts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`promptNumber` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`scenarioType` varchar(100) NOT NULL,
	`industrySector` varchar(100) NOT NULL,
	`visualStyle` varchar(100) NOT NULL,
	`durationSeconds` int NOT NULL,
	`originalDuration` int NOT NULL,
	`promptJson` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `prompts_id` PRIMARY KEY(`id`),
	CONSTRAINT `prompts_promptNumber_unique` UNIQUE(`promptNumber`)
);
