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

function filterPersonnel($conn, $filterDepartment, $filterName, $filterJobTitle) {
    $sql = "SELECT id, firstName, lastName, jobTitle, email, departmentID FROM personnel WHERE 1";

    if (!empty($filterDepartment)) {
        $sql .= " AND departmentID = $filterDepartment";
    }

    if (!empty($filterName)) {
        $sql .= " AND CONCAT(firstName, ' ', lastName) = '$filterName'";
    }

    if (!empty($filterJobTitle)) {
        $sql .= " AND jobTitle = '$filterJobTitle'";
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
$filterName = isset($_GET['filterName']) ? $_GET['filterName'] : '';
$filterJobTitle = isset($_GET['filterJobTitle']) ? $_GET['filterJobTitle'] : '';

// Filter personnel based on criteria
$filteredPersonnel = filterPersonnel($conn, $filterDepartment, $filterName, $filterJobTitle);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data']['personnel'] = $filteredPersonnel;

mysqli_close($conn);

echo json_encode($output); 


?>
