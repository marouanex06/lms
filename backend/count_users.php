<?php
try {
    $pdo = new PDO('mysql:host=127.0.0.1;port=3307;dbname=lms_project', 'root', '');
    $stmt = $pdo->query('SELECT COUNT(*) FROM users');
    echo 'User Count: ' . $stmt->fetchColumn() . PHP_EOL;
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
