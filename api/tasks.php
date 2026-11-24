<?php
require __DIR__ . '/helpers.php';
$tasks = require __DIR__ . '/data/initial-tasks.php';

// NEW TASKS
$file = __DIR__ . '/data/tasks.json'; // the POST creates it; it may not exist yet
$newTasks = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
foreach ($newTasks as $t) {
    $tasks[] = $t;
}

// GET: LIST OR ONE TASK
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id'])) {
        $id = (int) $_GET['id'];
        foreach ($tasks as $t) {
            if ($t['id'] === $id) {
                responder($t);
            }
        }
        responder(['error' => 'Tarea no encontrada'], 404);
    }
    responder($tasks);
}

responder(['error' => 'Método no permitido'], 405);
