<?php
require_once __DIR__ . '/config/database.php';

$db = new Database();
$conn = $db->getConnection();

if ($conn) {
    echo "✅ Conexión a MySQL exitosa";
} else {
    echo "❌ Error al conectar";
}
