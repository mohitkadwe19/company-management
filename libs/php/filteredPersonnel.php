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

// Function to filter personnel based on criteria
function filterPersonnel($conn, $filterDepartment) {
    $sql = "SELECT * FROM personnel WHERE 1";

    if (!empty($filterDepartment)) {
        $sql .= " AND departmentID = $filterDepartment";
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

// Filter personnel based on criteria
$filteredPersonnel = filterPersonnel($conn, $filterDepartment);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data']['personnel'] = $filteredPersonnel;

mysqli_close($conn);

echo json_encode($output); 

?>
