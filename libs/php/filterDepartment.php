<?php
// Turn on error display for debugging
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

// Function to filter departments based on criteria
function filterDepartments($conn, $filterLocation) {
    $sql = "SELECT d.name AS departmentName, l.name AS locationName 
            FROM department d 
            INNER JOIN location l ON d.locationID = l.id";

    if (!empty($filterLocation)) {
        $sql .= " WHERE d.locationID = $filterLocation";
    }

    $result = mysqli_query($conn, $sql);

    $departments = [];

    while ($row = mysqli_fetch_assoc($result)) {
        $departments[] = $row;
    }

    return $departments;
}

// Get filter criteria from request
$filterLocation = isset($_GET['filterLocation']) ? $_GET['filterLocation'] : '';

// Filter departments based on criteria
$filteredDepartments = filterDepartments($conn, $filterLocation);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data']['departments'] = $filteredDepartments;

mysqli_close($conn);

echo json_encode($output); 

?>
