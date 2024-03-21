<?php
// Include the configuration file
include("config.php");

// Set headers
header('Content-Type: application/json; charset=UTF-8');

// Check if the request is a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the POST data
    $id = $_POST['id'];
    $name = $_POST['name'];
    $locationID = $_POST['locationID'];

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
    $query = $conn->prepare('UPDATE `department` SET `name`=?, `locationID`=? WHERE `id`=?');
    $query->bind_param("ssi", $name, $locationID, $id);

    if ($query->execute()) {
        $response = array(
            'status' => array(
                'code' => "200",
                'name' => "ok",
                'description' => "Department data updated successfully"
            )
        );
    } else {
        $response = array(
            'status' => array(
                'code' => "400",
                'name' => "failure",
                'description' => "Failed to update department data"
            )
        );
    }

    // Close the database connection
    $conn->close();

    // Send the response
    echo json_encode($response);
}
?>
