<?php
try {
    $pdo = new PDO('mysql:host=localhost;port=3307', 'root', '');
    $stmt = $pdo->query('SHOW DATABASES');
    foreach($stmt as $row) {
        echo $row[0] . PHP_EOL;
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
