<?php
require __DIR__ . '/helpers.php';
$tasks = require __DIR__ . '/db.php';

function validateTask(array $input): array{
    $title = trim($input['title'] ?? '');
    $description = trim($input['description'] ?? '');
    $subjectId = (int) ($input['subjectId'] ?? 0);
    $dueDate = trim($input['dueDate'] ?? '');
    $dueTime = trim($input['dueTime'] ?? '');
    $status = $input['status'] ?? 'PENDIENTE';

    if ($title === '' ){
        response(['error' => 'El título es obligatorio'], 422);
    };

    if (strlen($title) < 3) {
        response(['error' => 'El título debe contener al menos 3 letras'], 422);
    }

    if ($subjectId <= 0){
        response(['error' => 'Debes seleccionar una materia'], 422);
    };

    if ($dueDate === ''){
        response(['error' => 'La fecha de entrega es obligatoria'], 422);
    };

    return [$title, $description, $subjectId, $dueDate, $dueTime, $status];
}



try {
    $pdo = conect();
    $method = $_SERVER['REQUEST_METHOD'];
    $id = isset($_GET['id']) ? (int) $_GET['id'] : null;

    switch($method){
        case 'GET':
            if (isset($_GET['id'])) {
                $stmt = $pdo->prepare('SELECT id, title, description, subject_id, due_date, due_time, status FROM tasks WHERE id = :id');
                
                $stmt->execute(['id' => (int) $_GET['id']]);
                $task = $stmt->fetch();

                if (!$task){
                    response(['error' => 'Tarea no encontrada'], 404);
                }
                response($task);
            }

            $search = trim($_GET['search'] ?? '');
            $stmt = $pdo->prepare(
                'SELECT id, title, description, subject_id, due_date, due_time, status FROM tasks WHERE title LIKE :search ORDER BY id'
            );
            $stmt->execute(['search' => "%$search%"]);

            response($stmt->fetchAll());
            break;

        case 'POST':

            [$title, $description, $subjectId, $dueDate, $dueTime, $status] = validateTask(readJson());

            $stmt = $pdo->prepare(
                'INSERT INTO tasks (title, description, subject_id, due_date, due_time, status) VALUES (:title, :description, :subjectId, :dueDate, :dueTime, :status)'
            );
            $stmt->execute(['title' => $title, 'description' => $description, 'subjectId' => $subjectId,
            'dueDate' => $dueDate,
            'dueTime' => $dueTime,
            'status' => $status]);

            response(['id' => (int) $pdo->lastInsertId(),
            'title' => $title,
            'description' => $description,
            'subjectId' => $subjectId,
            'dueDate' => $dueDate,
            'dueTime' => $dueTime,
            'status' => $status], 201);
            break;

        case 'PUT':
            if ($id === null){
                response(['error' => 'Ingrese un id'], 400);
            };

            [$title, $description, $subjectId, $dueDate, $dueTime, $status] = validateTask(readJson());
            
            $exists = $pdo->prepare('SELECT id FROM tasks WHERE id = :id');
            $exists->execute(['id' => $id]);

            if(!$exists->fetch()) {
                response(['error' => 'No se encontró la tarea'], 404);
            }

            $stmt = $pdo->prepare(
                'UPDATE tasks SET title = :title, description = :description, subject_id = :subjectId, due_date = :dueDate, due_time = :dueTime, status = :status WHERE id = :id'
            );

            $stmt->execute([
                'id' => $id,
                'title' => $title, 
                'description' => $description, 
                'subjectId' => $subjectId,
                'dueDate' => $dueDate,
                'dueTime' => $dueTime,
                'status' => $status]);

            response(['id' => $id,
            'title' => $title,
            'description' => $description,
            'subjectId' => $subjectId,
            'dueDate' => $dueDate,
            'dueTime' => $dueTime,
            'status' => $status]);
            break;

        case 'DELETE':
            if ($id === null){
                response(['error' => 'Ingrese un id'], 400);
            }

            try{
                $stmt = $pdo->prepare('DELETE FROM tasks WHERE id = :id');
                $stmt->execute(['id'=>$id]);
            } catch (PDOException $e){
                if ($e->getCode() === '23000'){
                    response(['error' => 'La tarea no se puede eliminar'], 409);
                }
                throw $e;
            }

            if ($stmt->rowCount() === 0){
                response(['error' => 'No se encontró la tarea'], 404);
            }

            http_response_code(204);
            exit;

        default:
            response(['error' => 'Método no permitido'], 405);
    }
} catch (PDOException $e){
    if ($e->getCode() === '45000') {
        response(['error' => $e->errorInfo[2] ?? 'La fecha de entrega no puede ser anterior a la actual'], 422);
    }
    response(['error' => 'Ocurrió un error'], 500);
}
