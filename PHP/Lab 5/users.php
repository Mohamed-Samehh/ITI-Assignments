<?php
require_once 'includes/db.php';
require_once 'includes/functions.php';

// Handle delete request
if (isset($_GET['delete'])) {
    $deleteId = (int) $_GET['delete'];
    $user = getUserById($conn, $deleteId);

    if ($user) {
        // Remove profile picture file if it exists
        if (!empty($user['profile_pic']) && file_exists(__DIR__ . '/' . $user['profile_pic'])) {
            unlink(__DIR__ . '/' . $user['profile_pic']);
        }

        $stmt = mysqli_prepare($conn, 'DELETE FROM users WHERE id = ?');
        mysqli_stmt_bind_param($stmt, 'i', $deleteId);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);
    }

    header('Location: users.php?message=' . urlencode('User deleted successfully.'));
    exit;
}

$message = $_GET['message'] ?? '';
$users = getAllUsers($conn);
?>
<!DOCTYPE html>
<html>
<head>
    <title>All Users</title>
</head>
<body>
    <h2>All Users</h2>

    <?php if ($message): ?>
        <p style="color:green;"><?php echo e($message); ?></p>
    <?php endif; ?>

    <p><a href="registration.php">Add New User</a></p>

    <table border="1" cellpadding="5" cellspacing="0">
        <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Country</th>
            <th>Gender</th>
            <th>Skills</th>
            <th>Username</th>
            <th>Department</th>
            <th>Room</th>
            <th>Profile Picture</th>
            <th>Actions</th>
        </tr>

        <?php foreach ($users as $user): ?>
            <tr>
                <td><?php echo e($user['id']); ?></td>
                <td><?php echo e($user['firstname']); ?></td>
                <td><?php echo e($user['lastname']); ?></td>
                <td><?php echo e($user['email']); ?></td>
                <td><?php echo e($user['country']); ?></td>
                <td><?php echo e($user['gender']); ?></td>
                <td><?php echo e($user['skills']); ?></td>
                <td><?php echo e($user['username']); ?></td>
                <td><?php echo e($user['department']); ?></td>
                <td><?php echo e($user['room']); ?></td>
                <td>
                    <?php if (!empty($user['profile_pic'])): ?>
                        <a href="<?php echo e($user['profile_pic']); ?>" target="_blank">View</a>
                    <?php else: ?>
                        No image
                    <?php endif; ?>
                </td>
                <td>
                    <a href="registration.php?id=<?php echo e($user['id']); ?>">Edit</a>
                    |
                    <a href="users.php?delete=<?php echo e($user['id']); ?>" onclick="return confirm('Delete this user?');">Delete</a>
                </td>
            </tr>
        <?php endforeach; ?>
    </table>
</body>
</html>
