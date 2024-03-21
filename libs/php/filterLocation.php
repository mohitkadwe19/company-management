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

// Function to filter locations based on criteria
function filterLocations($conn, $filterName) {
    $sql = "SELECT * FROM location WHERE 1";

    if (!empty($filterName)) {
        $sql .= " AND name LIKE '%$filterName%'";
    }

    $result = mysqli_query($conn, $sql);

    $locations = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $locations[] = $row;
    }

    return $locations;
}

// Get filter criteria from request
$filterName = isset($_GET['filterName']) ? $_GET['filterName'] : '';

// Filter locations based on criteria
$filteredLocations = filterLocations($conn, $filterName);

// Modify the filtered locations array to include locationName
foreach ($filteredLocations as &$location) {
    $location['locationName'] = $location['name'];
    unset($location['name']);
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data']['locations'] = $filteredLocations;

mysqli_close($conn);

echo json_encode($output); 
?>
