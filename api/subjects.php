<?php
require __DIR__ . '/helpers.php';
$subjects = require __DIR__ . '/data/initial-subjects.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id'])) {
        $id = (int) $_GET['id'];
        foreach ($subjects as $s) {
            if ($s['id'] === $id) {
                response($s);
            }
        }
        response(['error' => 'Materia no encontrada'], 404);
    }
    response($subjects);
}

response(['error' => 'Método no permitido'], 405);