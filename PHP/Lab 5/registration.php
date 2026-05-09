<?php
// Registration form: creates a new user, or edits an existing one when ?id=X is passed
require_once 'includes/db.php';
require_once 'includes/functions.php';
require_once 'helpers/validation.php';

$errors = [];
$editingId = 0;
$existingUser = null;
$selectedSkills = [];

$user = [
    'id' => '',
    'firstname' => '',
    'lastname' => '',
    'email' => '',
    'address' => '',
    'country' => '',
    'gender' => '',
    'skills' => '',
    'username' => '',
    'department' => '',
    'room' => '',
    'profile_pic' => '',
];

// Form submitted: validate, then save
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $editingId      = (int) ($_POST['id'] ?? 0);
    $firstname      = trim($_POST['firstname'] ?? '');
    $lastname       = trim($_POST['lastname'] ?? '');
    $email          = trim($_POST['email'] ?? '');
    $address        = trim($_POST['address'] ?? '');
    $country        = trim($_POST['country'] ?? '');
    $gender         = trim($_POST['gender'] ?? '');
    $selectedSkills = $_POST['skills'] ?? [];
    $username       = trim($_POST['username'] ?? '');
    $password       = $_POST['password'] ?? '';
    $department     = trim($_POST['department'] ?? '');
    $room           = trim($_POST['room'] ?? '');

    if ($editingId > 0) {
        $existingUser = getUserById($conn, $editingId);
    }

    $formData = [
        'firstname' => $firstname,
        'lastname'  => $lastname,
        'email'     => $email,
        'country'   => $country,
        'gender'    => $gender,
        'username'  => $username,
        'password'  => $password,
        'room'      => $room,
    ];
    $isNewUser = ($editingId === 0);
    $errors = validateUserForm($formData, $isNewUser);

    // Validate and handle profile picture
    $profilePicPath = $existingUser['profile_pic'] ?? '';
    if (isset($_FILES['profile_pic']) && $_FILES['profile_pic']['error'] === UPLOAD_ERR_OK) {
        $uploaded = saveUploadedImage($_FILES['profile_pic']);
        if ($uploaded === false) {
            $errors[] = 'Profile picture must be an image.';
        } else {
            $profilePicPath = $uploaded;
        }
    }

    // Check for duplicate username
    if (empty($errors)) {
        if ($editingId > 0) {
            $dupStmt = mysqli_prepare($conn, 'SELECT id FROM users WHERE username = ? AND id != ? LIMIT 1');
            mysqli_stmt_bind_param($dupStmt, 'si', $username, $editingId);
        } else {
            $dupStmt = mysqli_prepare($conn, 'SELECT id FROM users WHERE username = ? LIMIT 1');
            mysqli_stmt_bind_param($dupStmt, 's', $username);
        }
        mysqli_stmt_execute($dupStmt);
        mysqli_stmt_store_result($dupStmt);
        if (mysqli_stmt_num_rows($dupStmt) > 0) {
            $errors[] = 'Username already exists. Please choose a different username.';
        }
        mysqli_stmt_close($dupStmt);
    }

    if (empty($errors)) {
        // Hash new password, or keep existing hash if left blank
        if ($password !== '') {
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        } else {
            $hashedPassword = $existingUser['password'] ?? '';
        }

        $skillsString = implode(', ', $selectedSkills);

        if ($editingId > 0 && $existingUser) {
            $stmt = mysqli_prepare($conn, 'UPDATE users SET firstname=?, lastname=?, email=?, address=?, country=?, gender=?, skills=?, username=?, password=?, department=?, room=?, profile_pic=? WHERE id=?');
            mysqli_stmt_bind_param($stmt, 'ssssssssssssi', $firstname, $lastname, $email, $address, $country, $gender, $skillsString, $username, $hashedPassword, $department, $room, $profilePicPath, $editingId);
        } else {
            $stmt = mysqli_prepare($conn, 'INSERT INTO users (firstname, lastname, email, address, country, gender, skills, username, password, department, room, profile_pic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
            mysqli_stmt_bind_param($stmt, 'ssssssssssss', $firstname, $lastname, $email, $address, $country, $gender, $skillsString, $username, $hashedPassword, $department, $room, $profilePicPath);
        }

        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);

        header('Location: users.php?message=' . urlencode('User saved successfully.'));
        exit;
    }

    // Re-populate form with submitted values on error
    $user['id']         = $editingId;
    $user['firstname']  = $firstname;
    $user['lastname']   = $lastname;
    $user['email']      = $email;
    $user['address']    = $address;
    $user['country']    = $country;
    $user['gender']     = $gender;
    $user['username']   = $username;
    $user['department'] = $department;
    $user['room']       = $room;

// Edit mode: load the user from the database to pre-fill the form
} elseif (isset($_GET['id'])) {
    $editingId = (int) $_GET['id'];
    $loaded = getUserById($conn, $editingId);
    if ($loaded) {
        $user = $loaded;
        // Convert the stored skills string back into an array for the checkboxes
        $selectedSkills = [];
        if (!empty($user['skills'])) {
            foreach (explode(',', $user['skills']) as $skill) {
                $selectedSkills[] = trim($skill);
            }
        }
    }
}

$isEditing = ($editingId > 0);
if ($isEditing) {
    $title = 'Edit User';
} else {
    $title = 'Registration';
}
?>
<!DOCTYPE html>
<html>
<head>
    <title><?php echo $title; ?></title>
</head>
<body>
    <h2><?php echo $title; ?></h2>

    <?php if (!empty($errors)): ?>
        <ul style="color:red;">
            <?php foreach ($errors as $err): ?>
                <li><?php echo e($err); ?></li>
            <?php endforeach; ?>
        </ul>
    <?php endif; ?>

    <form method="post" enctype="multipart/form-data">
        <input type="hidden" name="id" value="<?php echo e($user['id']); ?>">

        First Name: <input type="text" name="firstname" value="<?php echo e($user['firstname']); ?>"><br><br>

        Last Name: <input type="text" name="lastname" value="<?php echo e($user['lastname']); ?>"><br><br>

        Email: <input type="text" name="email" value="<?php echo e($user['email']); ?>"><br><br>

        Address (Optional):<br>
        <textarea name="address" rows="4" cols="30"><?php echo e($user['address']); ?></textarea><br><br>

        Country:
        <select name="country">
            <option value="">Select Country</option>
            <?php foreach (['Egypt', 'USA', 'UK', 'Germany'] as $c): ?>
                <option value="<?php echo $c; ?>" <?php if ($user['country'] === $c) echo 'selected'; ?>>
                    <?php echo $c; ?>
                </option>
            <?php endforeach; ?>
        </select><br><br>

        Gender:
        <input type="radio" name="gender" value="Male" <?php if ($user['gender'] === 'Male') echo 'checked'; ?>> Male
        <input type="radio" name="gender" value="Female" <?php if ($user['gender'] === 'Female') echo 'checked'; ?>> Female
        <br><br>

        Skills:<br>
        <?php foreach (['PHP', 'Java', 'MySQL', 'PostgreSQL'] as $skill): ?>
            <input type="checkbox" name="skills[]" value="<?php echo $skill; ?>" <?php if (in_array($skill, $selectedSkills)) echo 'checked'; ?>>
            <?php echo $skill; ?>
        <?php endforeach; ?>
        <br><br>

        Username: <input type="text" name="username" value="<?php echo e($user['username']); ?>"><br><br>

        Password: <input type="password" name="password">
        <?php if ($isEditing): ?>
            <em>(leave blank to keep current)</em>
        <?php endif; ?>
        <br><br>

        Department: <input type="text" name="department" value="<?php echo e($user['department']); ?>" placeholder="OpenSource"><br><br>

        Room:
        <select name="room">
            <option value="">Select Room</option>
            <?php foreach (['Open source', 'Telecom', 'Cloud'] as $r): ?>
                <option value="<?php echo $r; ?>" <?php if ($user['room'] === $r) echo 'selected'; ?>>
                    <?php echo $r; ?>
                </option>
            <?php endforeach; ?>
        </select><br><br>

        Profile Picture (Optional): <input type="file" name="profile_pic" accept="image/*"><br>
        <?php if (!empty($user['profile_pic'])): ?>
            Current: <a href="<?php echo e($user['profile_pic']); ?>" target="_blank">View image</a><br>
        <?php endif; ?>
        <br>

        <input type="submit" value="Save">
        <input type="reset" value="Reset">
        <a href="users.php">View Users</a>
    </form>
</body>
</html>
