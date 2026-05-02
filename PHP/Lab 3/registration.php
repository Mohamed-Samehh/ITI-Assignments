<!DOCTYPE html>
<html>
<head>
    <title>Registration</title>
</head>
<body>
    <h2>Registration</h2>

    <form action="done.php" method="post">
        
        First Name: <input type="text" name="firstname"><br><br>
        
        Last Name: <input type="text" name="lastname"><br><br>

        Email: <input type="text" name="email"><br><br>
        
        Address: <br>
        <textarea name="address" rows="4" cols="30"></textarea><br><br>
        
        Country:
        <select name="country">
            <option value="Select Country">Select Country</option>
            <option value="Egypt">Egypt</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
            <option value="Germany">Germany</option>
        </select><br><br>
        
        Gender:
        <input type="radio" name="gender" value="Male"> Male
        <input type="radio" name="gender" value="Female"> Female
        <br><br>
        
        Skills: <br>
        <input type="checkbox" name="skills[]" value="PHP"> PHP
        <input type="checkbox" name="skills[]" value="Java"> Java <br>
        <input type="checkbox" name="skills[]" value="MySQL"> MySQL
        <input type="checkbox" name="skills[]" value="PostgreSQL"> PostgreSQL
        <br><br>
        
        Username: <input type="text" name="username"><br><br>
        
        Password: <input type="password" name="password"><br><br>
        
        Department: <input type="text" name="department" placeholder="OpenSource"><br><br>
        
        <input type="submit" value="Submit">
        <input type="reset" value="Reset">
        
    </form>
</body>
</html>