<?php
// config/database.php
class Database {
    // CAMBIAR ESTOS DATOS SI ES NECESARIO
    private $host = 'localhost';
    private $db_name = 'wayku_db';
    private $username = 'root';        // Usuario por defecto de MySQL
    private $password = '';            // Contraseña vacía por defecto
    private $conn;

    public function getConnection() {
        $this->conn = null;
        
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4",
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            echo "Error de conexión: " . $exception->getMessage();
        }
        
        return $this->conn;
    }
}
?>