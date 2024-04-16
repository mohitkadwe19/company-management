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
    $output['status']['description'] = "database unavailable: " . mysqli_connect_error();
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);

    exit;
}   

function filterPersonnel($conn, $filterDepartment, $filterLocation) {
    $sql = "SELECT p.id, p.firstName, p.lastName, p.jobTitle, p.email, p.departmentID, d.name as departmentName, l.id as locationID, l.name as locationName
            FROM personnel p
            JOIN department d ON p.departmentID = d.id
            JOIN location l ON d.locationID = l.id";

    // If filterDepartment is provided, include it in the query
    if (!empty($filterDepartment)) {
        $sql .= " WHERE p.departmentID = ?";
        $params[] = $filterDepartment;
        // If filterLocation is provided, include it in the query
        if (!empty($filterLocation)) {
            $sql .= " AND d.locationID = ?";
            $params[] = $filterLocation;
        }
    } elseif (!empty($filterLocation)) {
        // If only filterLocation is provided, filter based on location only
        $sql .= " WHERE l.id = ?";
        $params[] = $filterLocation;
    }

    $stmt = $conn->prepare($sql);
    if ($stmt) {
        if (!empty($params)) {
            $stmt->bind_param(str_repeat('i', count($params)), ...$params);
        }
        $stmt->execute();
        $result = $stmt->get_result();

        $personnel = [];
        while ($row = $result->fetch_assoc()) {
            $personnel[] = $row;
        }
        $stmt->close();

        return $personnel;
    } else {
        return null; // Return null on failure
    }
}

// Get filter criteria from request
$filterDepartment = isset($_GET['filterDepartment']) ? $_GET['filterDepartment'] : '';
$filterLocation = isset($_GET['filterLocation']) ? $_GET['filterLocation'] : '';

// Filter personnel based on criteria
$filteredPersonnel = filterPersonnel($conn, $filterDepartment, $filterLocation);

if ($filteredPersonnel !== null) {
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data']['personnel'] = $filteredPersonnel;
} else {
    $output['status']['code'] = "400";
    $output['status']['name'] = "error";
    $output['status']['description'] = "error in executing SQL query";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
}

mysqli_close($conn);

echo json_encode($output); 
?>
