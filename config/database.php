<?php
// config/database.php - VERSIÓN CORREGIDA
class Database {
    // AJUSTA ESTOS DATOS SEGÚN TU MYSQL WORKBENCH
    private $host = 'localhost';
    private $db_name = 'wayku_db';
    private $username = 'root';        // ¿Es root tu usuario?
    private $password = 'Valen.0509'; // PON AQUÍ tu contraseña de MySQL
    private $port = '3306';
    private $conn;

    public function getConnection() {
        $this->conn = null;
        
        try {
            // Conexión con puerto específico
            $dsn = "mysql:host=" . $this->host . ";port=" . $this->port . ";dbname=" . $this->db_name . ";charset=utf8mb4";
            
            $this->conn = new PDO($dsn, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Mensaje de debug (quitar después)
            error_log("Conexión exitosa a MySQL");
            
        } catch(PDOException $exception) {
            // Mensaje de error más detallado
            error_log("Error de conexión: " . $exception->getMessage());
            echo json_encode(['error' => 'Error de conexión: ' . $exception->getMessage()]);
        }
        
        return $this->conn;
    }
}
?>