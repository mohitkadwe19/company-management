<?php

// example use from browser
// http://localhost/companydirectory/libs/php/getLocationInfo.php?id=<id>

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

// Check if the 'id' parameter is provided
if (!isset($_REQUEST['id'])) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "bad request";
    $output['status']['description'] = "Missing location ID";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    echo json_encode($output);
    mysqli_close($conn);
    exit;
}

// SQL statement accepts parameters and so is prepared to avoid SQL injection
$query = $conn->prepare('SELECT l.id, l.name, COUNT(d.id) AS departmentCount FROM location l LEFT JOIN department d ON l.id = d.locationID WHERE l.id = ? GROUP BY l.id');

$query->bind_param("i", $_REQUEST['id']);

$query->execute();

if (!$query) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed";
    $output['data'] = [];
    echo json_encode($output);
    mysqli_close($conn);
    exit;
}

$result = $query->get_result();

if (!$result) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query result failed";
    $output['data'] = [];
    echo json_encode($output);
    mysqli_close($conn);
    exit;
}

$row = $result->fetch_assoc();

$locationInfo = [
    'id' => $row['id'],
    'locationName' => $row['name'],
    'departmentCount' => $row['departmentCount']
];

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = $locationInfo;

echo json_encode($output);

mysqli_close($conn);

?>
