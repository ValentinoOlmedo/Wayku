<?php
// api/auth.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de conexión a la base de datos']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

if ($method == 'POST') {
    $action = $_GET['action'] ?? '';
    
    switch($action) {
        case 'register':
            registrarUsuario($db, $input);
            break;
        case 'login':
            iniciarSesion($db, $input);
            break;
        case 'recovery':
            recuperarPassword($db, $input);
            break;
        default:
            http_response_code(400);
            echo json_encode(['error' => 'Acción no válida']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
}

function registrarUsuario($db, $data) {
    try {
        // Validaciones
        if (empty($data['email']) || empty($data['password']) || empty($data['nombre'])) {
            throw new Exception('Todos los campos son requeridos');
        }
        
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Email no válido');
        }
        
        if (strlen($data['password']) < 8) {
            throw new Exception('La contraseña debe tener al menos 8 caracteres');
        }
        
        // Verificar si el email ya existe
        $stmt = $db->prepare("SELECT id FROM usuarios WHERE email = ?");
        $stmt->execute([$data['email']]);
        
        if ($stmt->fetch()) {
            throw new Exception('Este email ya está registrado');
        }
        
        // Crear usuario
        $password_hash = password_hash($data['password'], PASSWORD_DEFAULT);
        
        $stmt = $db->prepare("INSERT INTO usuarios (nombre, email, password_hash) VALUES (?, ?, ?)");
        $stmt->execute([$data['nombre'], $data['email'], $password_hash]);
        
        $user_id = $db->lastInsertId();
        
        echo json_encode([
            'success' => true,
            'message' => 'Usuario registrado exitosamente',
            'user' => [
                'id' => $user_id,
                'nombre' => $data['nombre'],
                'email' => $data['email']
            ]
        ]);
        
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function iniciarSesion($db, $data) {
    try {
        if (empty($data['email']) || empty($data['password'])) {
            throw new Exception('Email y contraseña son requeridos');
        }
        
        $stmt = $db->prepare("SELECT id, nombre, email, password_hash FROM usuarios WHERE email = ? AND activo = 1");
        $stmt->execute([$data['email']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user || !password_verify($data['password'], $user['password_hash'])) {
            throw new Exception('Email o contraseña incorrectos');
        }
        
        // Actualizar último acceso
        $stmt = $db->prepare("UPDATE usuarios SET fecha_ultimo_acceso = NOW() WHERE id = ?");
        $stmt->execute([$user['id']]);
        
        unset($user['password_hash']);
        
        echo json_encode([
            'success' => true,
            'message' => 'Sesión iniciada exitosamente',
            'user' => $user
        ]);
        
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function recuperarPassword($db, $data) {
    try {
        if (empty($data['email'])) {
            throw new Exception('Email es requerido');
        }
        
        $stmt = $db->prepare("SELECT id, nombre FROM usuarios WHERE email = ? AND activo = 1");
        $stmt->execute([$data['email']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user) {
            throw new Exception('No encontramos una cuenta con ese email');
        }
        
        // En una implementación real, aquí enviarías el email
        echo json_encode([
            'success' => true,
            'message' => 'Se envió un enlace de recuperación a tu email'
        ]);
        
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
?>