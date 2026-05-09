<?php
// Registration form: creates a new user, or edits an existing one when ?id=X is passed.
require_once __DIR__ . '/autoload.php';

use App\Models\User;
use App\Helpers\Validator;
use App\Helpers\Uploader;

$errors         = [];
$editingId      = 0;
$existingUser   = null;
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

// Form submitted: validate, then save.
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
        $existingUser = User::findById($editingId);
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

    $validator = new Validator($formData, $isNewUser);
    $errors    = $validator->validate();

    // Handle profile picture upload (keeps existing one if no new file).
    $profilePicPath = $existingUser['profile_pic'] ?? '';
    if (isset($_FILES['profile_pic']) && $_FILES['profile_pic']['error'] === UPLOAD_ERR_OK) {
        $uploader = new Uploader();
        $uploaded = $uploader->save($_FILES['profile_pic']);
        if ($uploaded === false) {
            $errors[] = 'Profile picture must be an image.';
        } else {
            $profilePicPath = $uploaded;
        }
    }

    // Check for duplicate username.
    if (empty($errors) && User::usernameExists($username, $editingId)) {
        $errors[] = 'Username already exists. Please choose a different username.';
    }

    if (empty($errors)) {
        // Blank password on edit means keep the existing hash.
        if ($password !== '') {
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        } else {
            $hashedPassword = $existingUser['password'] ?? '';
        }

        $skillsString = implode(', ', $selectedSkills);

        $data = [
            'firstname'   => $firstname,
            'lastname'    => $lastname,
            'email'       => $email,
            'address'     => $address,
            'country'     => $country,
            'gender'      => $gender,
            'skills'      => $skillsString,
            'username'    => $username,
            'password'    => $hashedPassword,
            'department'  => $department,
            'room'        => $room,
            'profile_pic' => $profilePicPath,
        ];

        if ($editingId > 0 && $existingUser) {
            User::update($editingId, $data);
        } else {
            User::create($data);
        }

        header('Location: users.php?message=' . urlencode('User saved successfully.'));
        exit;
    }

    // Re-populate the form with submitted values when there are errors.
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

// Edit mode: pre-fill the form from the database.
} elseif (isset($_GET['id'])) {
    $editingId = (int) $_GET['id'];
    $loaded = User::findById($editingId);
    if ($loaded) {
        $user = $loaded;
        // Stored skills string -> array for the checkboxes.
        $selectedSkills = [];
        if (!empty($user['skills'])) {
            foreach (explode(',', $user['skills']) as $skill) {
                $selectedSkills[] = trim($skill);
            }
        }
    }
}

$isEditing = ($editingId > 0);
$title     = $isEditing ? 'Edit User' : 'Registration';
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
