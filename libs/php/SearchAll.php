<?php

// example use from browser
// http://localhost/companydirectory/libs/php/searchPersonnel.php?query=<search_query>

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
if (isset($_GET['query'])) {
    // Sanitize the search query parameter to prevent SQL injection
    $searchQuery = $conn->real_escape_string($_GET['query']);

    // SQL does not accept parameters and so is not prepared
    $query = "SELECT p.id, p.firstName, p.lastName, p.jobTitle, p.email, d.name AS departmentName, l.name AS locationName
              FROM personnel p
              LEFT JOIN department d ON p.departmentID = d.id
              LEFT JOIN location l ON d.locationID = l.id
              WHERE 
              p.firstName LIKE '%$searchQuery%'"; // Only searching first name
} else {
    // If no search query parameter is provided, return an empty result set
    $query = "SELECT p.id, p.firstName, p.lastName, p.jobTitle, p.email, d.name AS departmentName, l.name AS locationName
              FROM personnel p
              LEFT JOIN department d ON p.departmentID = d.id
              LEFT JOIN location l ON d.locationID = l.id
              WHERE 1 = 0";
}

$result = $conn->query($query);

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
