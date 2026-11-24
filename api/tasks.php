<?php
require __DIR__ . '/helpers.php';
$tasks = require __DIR__ . '/data/initial-tasks.php';

$file = __DIR__ . '/data/tasks.json'; 
$newTasks = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
foreach ($newTasks as $t) {
    $tasks[] = $t;
}

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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!is_array($input)) {
        responder(['error' => 'Cuerpo JSON inválido'], 422);
    }

    $title = trim($input['title'] ?? '');
    $description = trim($input['description'] ?? '');
    $subjectId = (int) ($input['subjectId'] ?? 0);
    $dueDate = trim($input['dueDate'] ?? '');
    $dueTime = trim($input['dueTime'] ?? '');

    if ($title === '' ){
        responder(['error' => 'El título es obligatorio'], 422);
    };

    if (strlen($title) < 3) {
        responder(['error' => 'El título debe contener al menos 3 letras'], 422);
    }

    if ($subjectId <= 0){
        responder(['error' => 'Debes seleccionar una materia'], 422);
    };

    if ($dueDate === ''){
        responder(['error' => 'La fecha de entrega es obligatoria'], 422);
    };

    if ($dueDate === ''){
        responder(['error' => 'La hora de entrega es obligatoria'], 422);
    };

    $maxId = 0;
    foreach ($tasks as $t) {
        if (isset($t['id']) && (int) $t['id'] > $maxId) {
            $maxId = (int) $t['id'];
        }
    }

    $task = [
        'id' => $maxId + 1,
        'title' => $title,
        'description' => $description,
        'subjectId' => $subjectId,
        'dueDate' => $dueDate,
        'dueTime' => $dueTime,
        'created' => date('c'),
    ];

    $newTasks[] = $task;

    file_put_contents(
        $file,
        json_encode($newTasks, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE),
        LOCK_EX
    );

    responder($task, 201);
}


responder(['error' => 'Método no permitido'], 405);
