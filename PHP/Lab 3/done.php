<!DOCTYPE html>
<html>
<head>
    <title>Review</title>
</head>
<body>
    <h2>Review</h2>

    <?php
    $firstname  = $_POST["firstname"] ?? "";
    $lastname   = $_POST["lastname"] ?? "";
    $email      = $_POST["email"] ?? "";
    $address    = $_POST["address"] ?? "";
    $gender     = $_POST["gender"] ?? "";
    $department = $_POST["department"] ?? "";
    $skills     = $_POST["skills"] ?? [];

    $errors = [];
    
    if (trim($firstname) == "") {
        $errors[] = "First name is required.";
    }
    if (trim($lastname) == "") {
        $errors[] = "Last name is required.";
    }
    if (trim($email) == "") {
        $errors[] = "Email is required.";
    }
    if ($gender != "Male" && $gender != "Female") {
        $errors[] = "Please select gender.";
    }

    if (!empty($errors)) {
        echo "<p style='color:red;'>Please fix these errors:</p>";
        echo "<ul>";
        foreach ($errors as $err) {
            echo "<li>" . $err . "</li>";
        }
        echo "</ul>";
        echo "<p><a href='registration.php'>Go back to form</a></p>";
        exit;
    }

    $title = ($gender == "Male") ? "Mr." : "Miss";

    $filename = "customer.txt";
    $file = fopen($filename, "a");
    
    if ($file) {
        $skillsString = implode(", ", $skills);
        $data = [$firstname, $lastname, $email, $gender, $address, $skillsString, $department];
        fputcsv($file, $data);
        fclose($file);
    } else {
        echo "<p style='color:red;'>Error: Could not save data. Check file permissions.</p>";
    }

    $records = [];
    if (file_exists("customer.txt")) {
        $file = fopen("customer.txt", "r");
        while (($row = fgetcsv($file)) !== false) {
            $records[] = $row;
        }
        fclose($file);
    }
    ?>

    <p>Thanks <?php echo "$title $firstname $lastname"; ?>!</p>

    <h3>Your Submitted Info:</h3>
    <p>Name: <?php echo "$firstname $lastname"; ?></p>
    <p>Email: <?php echo $email; ?></p>
    <p>Address: <?php echo $address; ?></p>
    <p>Skills: <?php echo $skillsString; ?></p>
    <p>Department: <?php echo $department; ?></p>

    <hr>

    <h3>All Customers (from customer.txt)</h3>
    <table border="1" cellpadding="5">
        <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Address</th>
            <th>Skills</th>
            <th>Department</th>
        </tr>
        <?php foreach ($records as $row): ?>
        <tr>
            <td><?php echo $row[0] ?? ""; ?></td>
            <td><?php echo $row[1] ?? ""; ?></td>
            <td><?php echo $row[2] ?? ""; ?></td>
            <td><?php echo $row[3] ?? ""; ?></td>
            <td><?php echo $row[4] ?? ""; ?></td>
            <td><?php echo $row[5] ?? ""; ?></td>
            <td><?php echo $row[6] ?? ""; ?></td>
        </tr>
        <?php endforeach; ?>
    </table>

    <p><a href="registration.php">Register another user</a></p>

</body>
</html>