CREATE TABLE `folders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`parentFolderId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `folders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `promptComments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`promptId` int NOT NULL,
	`userId` int NOT NULL,
	`commentText` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `promptComments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `promptShares` (
	`id` int AUTO_INCREMENT NOT NULL,
	`promptId` int NOT NULL,
	`ownerId` int NOT NULL,
	`sharedWithUserId` int NOT NULL,
	`permission` enum('view','edit') NOT NULL DEFAULT 'view',
	`sharedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `promptShares_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `promptVersions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`promptId` int NOT NULL,
	`versionNumber` int NOT NULL,
	`promptJson` text NOT NULL,
	`createdBy` int NOT NULL,
	`changeDescription` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `promptVersions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `templates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`industry` varchar(100) NOT NULL,
	`useCase` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`templateJson` text NOT NULL,
	`previewImage` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `templates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userPrompts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`promptJson` text NOT NULL,
	`folderId` int,
	`tags` text,
	`qualityScore` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userPrompts_id` PRIMARY KEY(`id`)
);
