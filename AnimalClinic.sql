-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Feb 25, 2025 at 07:35 AM
-- Server version: 8.0.40
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `AnimalClinic`
--

-- --------------------------------------------------------

--
-- Table structure for table `profilepet`
--

CREATE TABLE `profilepet` (
  `id` int NOT NULL COMMENT 'Primary Key',
  `name` varchar(255) DEFAULT NULL COMMENT 'Pet Name',
  `typepet` varchar(255) DEFAULT NULL COMMENT 'Type of Pet',
  `birthday` date DEFAULT NULL COMMENT 'Birthday',
  `weight` decimal(5,2) DEFAULT NULL COMMENT 'Weight (kg)',
  `ownerId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `profilepet`
--

INSERT INTO `profilepet` (`id`, `name`, `typepet`, `birthday`, `weight`, `ownerId`) VALUES
(8, 'test', 'แมว', '2025-02-25', 29.00, 31);

-- --------------------------------------------------------

--
-- Table structure for table `reservationqueue`
--

CREATE TABLE `reservationqueue` (
  `id` int NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `numphone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `reservation_type` varchar(50) DEFAULT NULL,
  `dataday` date DEFAULT NULL,
  `time` time DEFAULT NULL,
  `status` int NOT NULL,
  `doctordescription` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `symptom` varchar(100) DEFAULT NULL,
  `namepet` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `reservationqueue`
--

INSERT INTO `reservationqueue` (`id`, `name`, `numphone`, `email`, `reservation_type`, `dataday`, `time`, `status`, `doctordescription`, `symptom`, `namepet`) VALUES
(357, 'สพลดนัย พรหมศรี', '0899111111', '64020811@up.ac.th', 'ฉีดวัคซีน', '2024-10-21', '18:30:00', 3, NULL, 'asdas', 'โชกุล'),
(358, 'สพลดนัย พรหมศรี', '0899111111', '64020811@up.ac.th', 'ฉีดวัคซีน', '2024-10-21', '16:30:00', 3, NULL, 'dsadas', 'โชกุล'),
(359, 'user', '0899948392', 'trinsapoldanai@gmail.com', 'ตรวจร่างกายทั่วไป', '2024-10-22', '12:00:00', 3, NULL, 'เบื่ออาหาร', 'ติน'),
(360, 'สพลดนัย พรหมศรี', '0899111111', '64020811@up.ac.th', 'ฉีดวัคซีน', '2024-10-21', '13:30:00', 3, NULL, 'as', 'โชกุล'),
(361, 'user', '0899948392', 'trinsapoldanai@gmail.com', 'ตรวจร่างกายทั่วไป', '2024-10-19', '18:30:00', 3, NULL, 'เบื่ออาหาร', 'เอม');

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `role_id` int NOT NULL,
  `role_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`role_id`, `role_name`) VALUES
(1, 'user'),
(2, 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `status`
--

CREATE TABLE `status` (
  `id` int NOT NULL,
  `status_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `status`
--

INSERT INTO `status` (`id`, `status_name`) VALUES
(1, 'กำลังดำเนินการ'),
(2, 'เสร็จสิ้น'),
(3, 'ไม่มา');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `numphone` varchar(20) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` int DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `resetToken` varchar(64) DEFAULT NULL,
  `resetTokenExpiry` bigint DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `numphone`, `email`, `password`, `role`, `token`, `resetToken`, `resetTokenExpiry`, `created_at`, `updated_at`) VALUES
(28, 'user', '0899948392', 'trinsapoldanai@gmail.com', '$2b$10$FydSPLCPav6Rp2WKk9mSQebmkfIdirpNQwLE4ajyYFptVuPNhxQCG', 1, NULL, '9aaa801318f92fa9e8cd34baee7c2f21f1b98c8e', 1728957948163, '2024-09-12 18:56:12', '2024-10-15 01:05:48'),
(29, 'doc', '0432492349', 'admin@gmail.com', '$2b$10$5ErbQ11TTHXTZMOR3oZD4eNic.vhvUQdEiAFPi0k0g9.TWXmI2Gn2', 2, NULL, NULL, NULL, '2024-09-12 18:56:12', '2024-09-12 18:56:12'),
(30, 'สพลดนัย พรหมศรี', '0899111111', '64020811@up.ac.th', '$2b$10$6t2DWV.yE7lITsbhpeV5IOS/NXAe/KkSoWXJMS54l6jePB6K1Y2NK', 1, NULL, NULL, NULL, '2024-09-30 06:38:02', '2024-10-16 18:47:27'),
(31, 'sirawittoptest', '0996633516', 'sirawit.code@gmail.com', '$2b$10$8Ke/JFWSgWk4nzlDAa/R5eKFoT4TOwokh8n38PdQuhoAN4.GqWOc2', 1, NULL, NULL, NULL, '2025-02-25 07:10:11', '2025-02-25 07:10:11');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `profilepet`
--
ALTER TABLE `profilepet`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_profilepet_owner` (`ownerId`);

--
-- Indexes for table `reservationqueue`
--
ALTER TABLE `reservationqueue`
  ADD PRIMARY KEY (`id`),
  ADD KEY `status` (`status`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`role_id`);

--
-- Indexes for table `status`
--
ALTER TABLE `status`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_role` (`role`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `profilepet`
--
ALTER TABLE `profilepet`
  MODIFY `id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key', AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `reservationqueue`
--
ALTER TABLE `reservationqueue`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=363;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `role_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `status`
--
ALTER TABLE `status`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `profilepet`
--
ALTER TABLE `profilepet`
  ADD CONSTRAINT `fk_profilepet_owner` FOREIGN KEY (`ownerId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reservationqueue`
--
ALTER TABLE `reservationqueue`
  ADD CONSTRAINT `reservationqueue_ibfk_1` FOREIGN KEY (`status`) REFERENCES `status` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_role` FOREIGN KEY (`role`) REFERENCES `role` (`role_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
