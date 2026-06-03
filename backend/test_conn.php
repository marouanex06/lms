<?php
ini_set('default_socket_timeout', 2);
try {
    $pdo = new PDO('mysql:host=127.0.0.1;port=3307', 'root', '', [PDO::ATTR_TIMEOUT => 2, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    echo "CONNECTED TO MYSQL ON 3307\n";
    $stmt = $pdo->query('SHOW DATABASES');
    foreach($stmt as $row) {
        echo "DB: " . $row[0] . "\n";
    }
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
