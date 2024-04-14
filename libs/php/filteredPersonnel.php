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

function filterPersonnel($conn, $filterDepartment, $filterLocation) {
    $sql = "SELECT p.id, p.firstName, p.lastName, p.jobTitle, p.email, p.departmentID, d.name as departmentName, l.id as locationID, l.name as locationName
            FROM personnel p
            JOIN department d ON p.departmentID = d.id";

    // If filterDepartment is provided, include it in the query
    if (!empty($filterDepartment)) {
        $sql .= " WHERE p.departmentID = $filterDepartment";
        // If filterLocation is provided, include it in the query
        if (!empty($filterLocation)) {
            $sql .= " AND d.locationID = $filterLocation";
        }
    } elseif (!empty($filterLocation)) {
        // If only filterLocation is provided, filter based on location only
        $sql .= " JOIN location l ON d.locationID = l.id WHERE l.id = $filterLocation";
    }

    $result = mysqli_query($conn, $sql);

    $personnel = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $personnel[] = $row;
    }

    return $personnel;
}

// Get filter criteria from request
$filterDepartment = isset($_GET['filterDepartment']) ? $_GET['filterDepartment'] : '';
$filterLocation = isset($_GET['filterLocation']) ? $_GET['filterLocation'] : '';

// Filter personnel based on criteria
$filteredPersonnel = filterPersonnel($conn, $filterDepartment, $filterLocation);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data']['personnel'] = $filteredPersonnel;

mysqli_close($conn);

echo json_encode($output); 
?>
