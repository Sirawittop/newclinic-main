-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 31, 2024 at 03:21 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `clinic_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `reservationqueue`
--

CREATE TABLE `reservationqueue` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `numphone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `reservation_type` varchar(50) DEFAULT NULL,
  `dataday` date DEFAULT NULL,
  `time` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `reservationqueue`
--

INSERT INTO `reservationqueue` (`id`, `name`, `numphone`, `email`, `reservation_type`, `dataday`, `time`) VALUES
(90, 'trintrintrin', '0899586951', 'trinsapoldanai@gmail.com', 'ฉีดวีกซีน', '2024-08-01', '12:00:00'),
(91, 'trintrintrin', '0899586951', 'trinsapoldanai@gmail.com', 'ตรวจร่างกายทั่วไป', '2024-08-01', '12:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `role_id` int(11) NOT NULL,
  `role_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`role_id`, `role_name`) VALUES
(1, 'user'),
(2, 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `numphone` varchar(20) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` int(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `numphone`, `email`, `password`, `role`) VALUES
(21, 'สิรวิชญ์ คำชุ่ม', '0895965963', 'sirawit.code@gmail.com', '$2b$10$g7p4VrxL1DPpAQTMIpJJnu8msYmhEwFe4v0y2tOT.ipoHdebdAvLO', 1),
(22, 'trintrintrin', '0899586951', 'trinsapoldanai@gmail.com', '$2b$10$Hkb1d.EVYYAy8brB3nu9i.NFUpMovKSg6z7/qjC/BP5duxrWkzX9a', 1),
(23, 'Trinlovebamlion', '0695695863', 'praprakajoa@gmail.com', '$2b$10$suHoQtVJ53WXiML9zZb.zOEEn/8JMBXZnc49cYPtYimQqvk166eWW', 1),
(24, 'trinja', '0498182189', 'trin123@gmail.com', '$2b$10$e8G1VwdMhcRNV7Dxy5oO1.JcPeuNF0hyXU9I3Ooe1ZAExrQTn0NAC', 1),
(25, 'trin kub', '0958460796', 'test@gmail.com', '$2b$10$qt0DxOmb/mZZDZf7w5OPM.THkBT3l1gTrplbQc9kSRAZGzKUKv8MC', 1),
(26, 'aum', '0925818852', '64020721@up.ac.th', '$2b$10$9LXfPRAVSHnBXco96DIQcOL6CjAymaLxKSrR9N6FQ53A931U1Cmbe', 1),
(27, 'top', '0512128152', 'sirawitkc@gmail.com', '$2b$10$WfrFImAhPtPr9ZUARYqgt.HeD3wJ3EboZMxdDJHBUa0XQSy9eBxPW', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `reservationqueue`
--
ALTER TABLE `reservationqueue`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`role_id`);

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
-- AUTO_INCREMENT for table `reservationqueue`
--
ALTER TABLE `reservationqueue`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=92;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_role` FOREIGN KEY (`role`) REFERENCES `role` (`role_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
