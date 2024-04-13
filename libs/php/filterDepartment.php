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
function filterDepartments($conn, $filterName, $filterLocation) {
    $sql = "SELECT d.name AS departmentName, d.locationID 
            FROM department d 
            WHERE 1";

    if (!empty($filterName)) {
        $sql .= " AND d.name = '$filterName'";
    }

    if (!empty($filterLocation)) {
        $sql .= " AND d.locationID = $filterLocation";
    }

    $result = mysqli_query($conn, $sql);

    $departments = [];

    while ($row = mysqli_fetch_assoc($result)) {
        $departments[] = $row;
    }

    return $departments;
}

// Function to get location name from locationID
function getLocationName($conn, $locationID) {
    $sql = "SELECT name FROM location WHERE id = $locationID";
    $result = mysqli_query($conn, $sql);
    $row = mysqli_fetch_assoc($result);
    return $row['name'];
}

// Get filter criteria from request
$filterName = isset($_GET['filterName']) ? $_GET['filterName'] : '';
$filterLocation = isset($_GET['filterLocation']) ? $_GET['filterLocation'] : '';

// Filter departments based on criteria
$filteredDepartments = filterDepartments($conn, $filterName, $filterLocation);

// Add locationName to each department in the response
foreach ($filteredDepartments as &$department) {
    $department['locationName'] = getLocationName($conn, $department['locationID']);
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data']['departments'] = $filteredDepartments;

mysqli_close($conn);

echo json_encode($output); 
?>
