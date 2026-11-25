<?php
require __DIR__ . '/helpers.php';
require __DIR__ . '/db.php';

function validateSubject(array $input): array
{
    $name = trim($input['name'] ?? '');
    $color = trim($input['color'] ?? '');

    if ($name === '') {
        response(['error' => 'El nombre de la materia es obligatorio'], 422);
    }

    if (strlen($name) > 50) {
        response(['error' => 'El nombre de la materia no puede tener más de 50 caracteres'], 422);
    }

    if (strlen($color) > 10) {
        response(['error' => 'El color no puede tener más de 10 caracteres'], 422);
    }

    return [$name, $color !== '' ? $color : null]; // an empty color is saved as NULL
}

try {
    $pdo = conect();
    $method = $_SERVER['REQUEST_METHOD'];
    $id = isset($_GET['id']) ? (int) $_GET['id'] : null;

    switch ($method) {
        case 'GET':
            if ($id !== null) {
                $stmt = $pdo->prepare('SELECT id, name, color FROM subjects WHERE id = :id');
                $stmt->execute(['id' => $id]);
                $subject = $stmt->fetch();

                if (!$subject) {
                    response(['error' => 'Materia no encontrada'], 404);
                }
                response($subject);
            }

            $search = trim($_GET['search'] ?? '');
            $stmt = $pdo->prepare('SELECT id, name, color FROM subjects WHERE name LIKE :search ORDER BY id');
            $stmt->execute(['search' => "%$search%"]);

            response($stmt->fetchAll());
            break;

        case 'POST':
            [$name, $color] = validateSubject(readJson());

            $stmt = $pdo->prepare('INSERT INTO subjects (name, color) VALUES (:name, :color)');
            $stmt->execute(['name' => $name, 'color' => $color]);

            response(['id' => (int) $pdo->lastInsertId(), 'name' => $name, 'color' => $color], 201);
            break;

        case 'PUT':
            if ($id === null) {
                response(['error' => 'Ingrese un id'], 400);
            }

            [$name, $color] = validateSubject(readJson());

            // rowCount() is also 0 when no value changes, so check first that it exists
            $exists = $pdo->prepare('SELECT id FROM subjects WHERE id = :id');
            $exists->execute(['id' => $id]);

            if (!$exists->fetch()) {
                response(['error' => 'No se encontró la materia'], 404);
            }

            $stmt = $pdo->prepare('UPDATE subjects SET name = :name, color = :color WHERE id = :id');
            $stmt->execute(['name' => $name, 'color' => $color, 'id' => $id]);

            response(['id' => $id, 'name' => $name, 'color' => $color]);
            break;

        case 'DELETE':
            if ($id === null) {
                response(['error' => 'Ingrese un id'], 400);
            }

            try {
                $stmt = $pdo->prepare('DELETE FROM subjects WHERE id = :id');
                $stmt->execute(['id' => $id]);
            } catch (PDOException $e) {
                if ($e->getCode() === '23000') { // foreign key: some tasks still use this subject
                    response(['error' => 'La materia tiene tareas y no se puede eliminar'], 409);
                }
                throw $e;
            }

            if ($stmt->rowCount() === 0) {
                response(['error' => 'No se encontró la materia'], 404);
            }

            http_response_code(204);
            exit;

        default:
            response(['error' => 'Método no permitido'], 405);
    }
} catch (PDOException $e) {
    response(['error' => 'Ocurrió un error'], 500);
}
