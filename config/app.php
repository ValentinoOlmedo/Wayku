<?php
// config/app.php

function json_headers() {
    header('Content-Type: application/json; charset=utf-8');
}
function json_out($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}
function require_method($method) {
    if ($_SERVER['REQUEST_METHOD'] !== $method) {
        json_out(['error' => 'Método no permitido'], 405);
    }
}
function boot_session() {
    if (session_status() === PHP_SESSION_NONE) {
        session_set_cookie_params([
            'lifetime' => 60*60*24*7,
            'path' => '/',
            'secure' => isset($_SERVER['HTTPS']),
            'httponly' => true,
            'samesite' => 'Lax'
        ]);
        session_start();
    }
}
function require_login() {
    boot_session();
    if (empty($_SESSION['user_id'])) json_out(['error' => 'No autorizado'], 401);
}
function current_user_id() {
    boot_session();
    return $_SESSION['user_id'] ?? null;
}
