<?php
// Include the configuration file
include("config.php");

// Set headers
header('Content-Type: application/json; charset=UTF-8');

// Check if the request is a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the POST data
    $id = $_POST['id'];
    $firstName = $_POST['firstName'];
    $lastName = $_POST['lastName'];
    $jobTitle = $_POST['jobTitle'];
    $email = $_POST['email'];
    $departmentID = $_POST['departmentID'];

    // Connect to the database
    $conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

    // Check the database connection
    if ($conn->connect_error) {
        $response = array(
            'status' => array(
                'code' => "300",
                'name' => "failure",
                'description' => "Database connection failed"
            )
        );
        echo json_encode($response);
        exit();
    }

    // Prepare and execute the update query
    $query = $conn->prepare('UPDATE `personnel` SET `firstName`=?, `lastName`=?, `jobTitle`=?, `email`=?, `departmentID`=? WHERE `id`=?');
    $query->bind_param("ssssii", $firstName, $lastName, $jobTitle, $email, $departmentID, $id);

    if ($query->execute()) {
        $response = array(
            'status' => array(
                'code' => "200",
                'name' => "ok",
                'description' => "Personnel data updated successfully"
            )
        );
    } else {
        $response = array(
            'status' => array(
                'code' => "400",
                'name' => "failure",
                'description' => "Failed to update personnel data"
            )
        );
    }

    // Close the database connection
    $conn->close();

    // Send the response
    echo json_encode($response);
} else {
    // Handle invalid request method
    $response = array(
        'status' => array(
            'code' => "400",
            'name' => "failure",
            'description' => "Invalid request method"
        )
    );
    echo json_encode($response);
}
?>
