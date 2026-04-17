-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 17, 2026 at 07:31 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lms_korean`
--

-- --------------------------------------------------------

--
-- Table structure for table `chat_history`
--

CREATE TABLE `chat_history` (
  `id` int(11) NOT NULL,
  `user_message` text NOT NULL,
  `ai_response` text NOT NULL,
  `response_time` int(11) NOT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `users_id` varchar(7) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `class_member`
--

CREATE TABLE `class_member` (
  `id` int(11) NOT NULL,
  `users_id` varchar(7) NOT NULL,
  `course_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course`
--

CREATE TABLE `course` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `day` enum('Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu') NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `teacher_id` varchar(7) NOT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `level`
--

CREATE TABLE `level` (
  `id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `level`
--

INSERT INTO `level` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'Beginner 1', '2026-03-18 17:25:23', '2026-03-18 17:25:23'),
(2, 'Beginner 2', '2026-03-18 17:25:23', '2026-03-18 17:25:23'),
(3, 'Intermediate 1', '2026-03-18 17:25:23', '2026-03-18 17:25:23');

-- --------------------------------------------------------

--
-- Table structure for table `level_detail`
--

CREATE TABLE `level_detail` (
  `id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `levels_id` int(11) NOT NULL,
  `prompt_tech_id` int(11) NOT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `level_detail`
--

INSERT INTO `level_detail` (`id`, `name`, `levels_id`, `prompt_tech_id`, `createdAt`, `updatedAt`) VALUES
(1, 'R1-1', 1, 1, '2026-04-08 19:30:37', '2026-04-08 19:30:37'),
(2, 'R1-2', 1, 1, '2026-04-08 19:30:37', '2026-04-08 19:30:37'),
(3, 'R1-3', 1, 1, '2026-04-08 19:30:37', '2026-04-08 19:30:37'),
(4, 'R1-4', 1, 1, '2026-04-08 19:30:37', '2026-04-08 19:30:37'),
(5, 'R2-1', 1, 1, '2026-04-08 19:30:37', '2026-04-08 19:30:37'),
(6, 'R2-2', 1, 1, '2026-04-08 19:30:37', '2026-04-08 19:30:37'),
(7, 'R2-3', 1, 1, '2026-04-08 19:30:37', '2026-04-08 19:30:37'),
(8, 'R2-4', 1, 1, '2026-04-08 19:30:37', '2026-04-08 19:30:37'),
(9, 'U1-1', 2, 1, '2026-04-08 19:30:37', '2026-04-08 19:30:37'),
(10, 'U1-2', 2, 1, '2026-04-08 19:30:37', '2026-04-08 19:30:37'),
(11, 'U1-3', 2, 1, '2026-04-08 19:30:37', '2026-04-08 19:30:37'),
(12, 'U1-4', 2, 1, '2026-04-08 19:30:37', '2026-04-08 19:30:37'),
(13, 'U1-5', 2, 1, '2026-04-08 19:30:37', '2026-04-08 19:30:37'),
(14, 'A1-1', 3, 1, '2026-04-08 19:30:37', '2026-04-08 19:30:37'),
(15, 'A1-2', 3, 1, '2026-04-08 19:30:37', '2026-04-08 19:30:37'),
(16, 'A1-3', 3, 1, '2026-04-08 19:30:37', '2026-04-08 19:30:37');

-- --------------------------------------------------------

--
-- Table structure for table `materials`
--

CREATE TABLE `materials` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(1028) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `modules_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `modules`
--

CREATE TABLE `modules` (
  `id` int(11) NOT NULL,
  `week` enum('1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16') NOT NULL,
  `description` varchar(1028) DEFAULT NULL,
  `course_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `prompt_tech`
--

CREATE TABLE `prompt_tech` (
  `id` int(11) NOT NULL,
  `prompt_detail` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `prompt_tech`
--

INSERT INTO `prompt_tech` (`id`, `prompt_detail`) VALUES
(1, 'Anda adalah tutor bahasa Korea untuk level Beginner. Jawab dengan ramah.');

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `id` int(11) NOT NULL,
  `level_detail_id` int(11) NOT NULL,
  `question_data` longtext NOT NULL CHECK (json_valid(`question_data`)),
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(10) NOT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'Admin', '2026-03-18 17:25:23', '2026-03-18 17:25:23'),
(2, 'Student', '2026-03-18 17:25:23', '2026-03-18 17:25:23'),
(3, 'Teacher', '2026-03-18 17:25:23', '2026-03-18 17:25:23');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(7) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(100) NOT NULL,
  `status` enum('Active','Inactive') NOT NULL,
  `xp` int(11) NOT NULL,
  `url_photo` varchar(255) DEFAULT NULL,
  `refresh_token` text DEFAULT NULL,
  `last_daily_xp` date DEFAULT NULL,
  `roles_id` int(11) NOT NULL,
  `level_id` int(11) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `password`, `status`, `xp`, `url_photo`, `refresh_token`, `last_daily_xp`, `roles_id`, `level_id`, `createdAt`, `updatedAt`) VALUES
('2372034', 'Exalt', '$2a$12$wiPlhsNsHZYEP2kc93ZtxO/5JUR2KyEFNSsJ/vdrvgfGSk8AuAxvS', 'Active', 0, NULL, NULL, NULL, 3, NULL, '2026-03-18 17:25:23', '2026-03-18 17:25:23'),
('2372036', 'Capa', '$2a$12$wiPlhsNsHZYEP2kc93ZtxO/5JUR2KyEFNSsJ/vdrvgfGSk8AuAxvS', 'Active', 120, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyMzcyMDM2IiwibmFtZSI6IkNhcGEiLCJzdGF0dXMiOiJBY3RpdmUiLCJyb2xlc19pZCI6MiwibGV2ZWxfaWQiOjEsInhwIjoxMjAsImlhdCI6MTc3NTcyNzY2MCwiZXhwIjoxNzc1ODE0MDYwfQ.ID02s9r9xilB0yFyjyRpFr4gHlxdl5EVN6eSYJWl8iY', '2026-04-09', 2, 1, '2026-03-18 17:25:23', '2026-04-09 09:41:00'),
('2372040', 'Kaisar Naufal Naratama', '$2a$12$wiPlhsNsHZYEP2kc93ZtxO/5JUR2KyEFNSsJ/vdrvgfGSk8AuAxvS', 'Active', 440, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyMzcyMDQwIiwibmFtZSI6IkthaXNhciBOYXVmYWwgTmFyYXRhbWEiLCJzdGF0dXMiOiJBY3RpdmUiLCJyb2xlc19pZCI6MiwibGV2ZWxfaWQiOjEsInhwIjo0NDAsImlhdCI6MTc3NjM4ODI5MywiZXhwIjoxNzc2NDc0NjkzfQ.6WB7aDFLWj3rJOJ45juY-NlUv0BAYlVYrwvrOKuBe7g', '2026-04-17', 2, 1, '2026-03-18 17:25:23', '2026-04-17 01:11:33'),
('ADM0001', 'Admin Utama', '$2a$12$wiPlhsNsHZYEP2kc93ZtxO/5JUR2KyEFNSsJ/vdrvgfGSk8AuAxvS', 'Active', 0, NULL, NULL, NULL, 1, NULL, '2026-03-18 17:25:23', '2026-03-18 17:27:32');

-- --------------------------------------------------------

--
-- Table structure for table `user_progress`
--

CREATE TABLE `user_progress` (
  `id` int(11) NOT NULL,
  `users_id` varchar(7) NOT NULL,
  `level_detail_id` int(11) NOT NULL,
  `status` enum('completed','failed') NOT NULL DEFAULT 'completed',
  `score` int(11) DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `user_progress`
--

INSERT INTO `user_progress` (`id`, `users_id`, `level_detail_id`, `status`, `score`, `createdAt`, `updatedAt`) VALUES
(1, '2372040', 1, 'completed', 100, '2026-04-01 19:58:34', '2026-04-01 19:58:34'),
(2, '2372040', 2, 'completed', 100, '2026-04-01 20:06:03', '2026-04-01 20:06:03'),
(3, '2372036', 1, 'completed', 100, '2026-04-01 20:06:30', '2026-04-01 20:06:30'),
(4, '2372040', 3, 'completed', 50, '2026-04-08 18:48:58', '2026-04-08 18:48:58'),
(5, '2372040', 4, 'completed', 50, '2026-04-08 18:49:16', '2026-04-08 18:49:16');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chat_history`
--
ALTER TABLE `chat_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_chat_history_users1_idx` (`users_id`);

--
-- Indexes for table `class_member`
--
ALTER TABLE `class_member`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_class_member_users1_idx` (`users_id`),
  ADD KEY `fk_class_member_course1_idx` (`course_id`);

--
-- Indexes for table `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_course_users1_idx` (`teacher_id`);

--
-- Indexes for table `level`
--
ALTER TABLE `level`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `level_detail`
--
ALTER TABLE `level_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_level_detail_levels1_idx` (`levels_id`),
  ADD KEY `fk_level_detail_prompt_tech1_idx` (`prompt_tech_id`);

--
-- Indexes for table `materials`
--
ALTER TABLE `materials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_materials_modules1_idx` (`modules_id`);

--
-- Indexes for table `modules`
--
ALTER TABLE `modules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_modules_course1_idx` (`course_id`);

--
-- Indexes for table `prompt_tech`
--
ALTER TABLE `prompt_tech`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_questions_level_detail_idx` (`level_detail_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_users_roles_idx` (`roles_id`),
  ADD KEY `fk_users_level1_idx` (`level_id`);

--
-- Indexes for table `user_progress`
--
ALTER TABLE `user_progress`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user_progress_users_idx` (`users_id`),
  ADD KEY `fk_user_progress_level_detail_idx` (`level_detail_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chat_history`
--
ALTER TABLE `chat_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `class_member`
--
ALTER TABLE `class_member`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `course`
--
ALTER TABLE `course`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `level`
--
ALTER TABLE `level`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `level_detail`
--
ALTER TABLE `level_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `materials`
--
ALTER TABLE `materials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `modules`
--
ALTER TABLE `modules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `prompt_tech`
--
ALTER TABLE `prompt_tech`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user_progress`
--
ALTER TABLE `user_progress`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chat_history`
--
ALTER TABLE `chat_history`
  ADD CONSTRAINT `fk_chat_history_users1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `class_member`
--
ALTER TABLE `class_member`
  ADD CONSTRAINT `fk_class_member_course1` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_class_member_users1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `course`
--
ALTER TABLE `course`
  ADD CONSTRAINT `fk_course_users1` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `level_detail`
--
ALTER TABLE `level_detail`
  ADD CONSTRAINT `fk_level_detail_levels1` FOREIGN KEY (`levels_id`) REFERENCES `level` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_level_detail_prompt_tech1` FOREIGN KEY (`prompt_tech_id`) REFERENCES `prompt_tech` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `materials`
--
ALTER TABLE `materials`
  ADD CONSTRAINT `fk_materials_modules1` FOREIGN KEY (`modules_id`) REFERENCES `modules` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `modules`
--
ALTER TABLE `modules`
  ADD CONSTRAINT `fk_modules_course1` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `fk_questions_level_detail` FOREIGN KEY (`level_detail_id`) REFERENCES `level_detail` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_level1` FOREIGN KEY (`level_id`) REFERENCES `level_detail` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_users_roles` FOREIGN KEY (`roles_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_progress`
--
ALTER TABLE `user_progress`
  ADD CONSTRAINT `fk_user_progress_level_detail` FOREIGN KEY (`level_detail_id`) REFERENCES `level_detail` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_user_progress_users` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
