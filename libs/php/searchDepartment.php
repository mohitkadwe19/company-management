<?php

// example use from browser
// http://localhost/companydirectory/libs/php/searchDepartmentByName.php?name=<search_query>

// remove next two lines for production    

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);

    exit;

}   

// Check if the search query parameter is provided
if (isset($_GET['name'])) {
    // Sanitize the search query parameter to prevent SQL injection
    $searchQuery = '%' . $conn->real_escape_string($_GET['name']) . '%';

    // Use prepared statement to prevent SQL injection
    $query = $conn->prepare("SELECT department.id, department.name as departmentName, location.name as locationName 
                             FROM department 
                             LEFT JOIN location ON department.locationID = location.id 
                             WHERE department.name LIKE ?");

    // Bind the parameter to the query
    $query->bind_param("s", $searchQuery);

    // Execute the query
    $query->execute();

    // Get the result
    $result = $query->get_result();
} else {
    // If no search query parameter is provided, return an empty result set
    $query = "SELECT department.id, department.name as departmentName, location.name as locationName 
              FROM department 
              LEFT JOIN location ON department.locationID = location.id 
              WHERE 1 = 0";

    $result = $conn->query($query);
}

if (!$result) {

    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed";    
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output); 

    exit;

}
   
$data = [];

while ($row = mysqli_fetch_assoc($result)) {

    array_push($data, $row);

}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = $data;

mysqli_close($conn);

echo json_encode($output); 

?>
