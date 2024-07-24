<?php
// Set the content type to JSON
include( 'inc/include.php' );
require_once __DIR__ . '/../inc/all.php';
// Ensure that error reporting is enabled for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if files were uploaded
    if (isset($_FILES['upload'])) {
        $file = $_FILES['upload'];

        // Check if there was an error during the upload
        if ($file['error'] !== UPLOAD_ERR_OK) {
            echo json_encode(['error' => 'File upload failed']);
            http_response_code(500); // Internal Server Error
            exit;
        }

        // Define the upload directory and ensure it exists
        $uploadDir = __DIR__ . '/uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        // Define the path where the file will be saved
        $uploadFile = $uploadDir . basename($file['name']);

        // Move the uploaded file to the upload directory
        if (move_uploaded_file($file['tmp_name'], $uploadFile)) {
            echo json_encode([
                'message' => 'File successfully uploaded',
                'file' => $file['name'],
                'path' => $uploadFile
            ]);
            http_response_code(200); // OK
        } else {
            echo json_encode(['error' => 'Failed to move uploaded file']);
            http_response_code(500); 
        }
    } else {
        
        echo json_encode(['error' => 'No file uploaded']);
        http_response_code(400); 
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
    http_response_code(405); 
}