<!DOCTYPE html>
<html>
<head>
    <title>Review</title>
</head>
<body>
    <h2>Review</h2>

    <?php
        $firstname  = $_POST["firstname"];
        $lastname   = $_POST["lastname"];
        $address    = $_POST["address"];
        $gender     = $_POST["gender"];
        $department = $_POST["department"];
        $skills     = $_POST["skills"];

        if ($gender == "Male") {
            $title = "Mr.";
        } else {
            $title = "Miss";
        }
    ?>

    <p>Thanks <?php echo $title . " " . $firstname . " " . $lastname; ?></p>

    <p>Please Review Your Information:</p>

    <p>Name: <?php echo $firstname . " " . $lastname; ?></p>

    <p>Address: <?php echo $address; ?></p>

    <p>
        Your Skills: 
        <?php
            foreach ($skills as $skill) {
                echo $skill . " ";
            }
        ?>
    </p>

    <p>Department: <?php echo $department; ?></p>

</body>
</html>