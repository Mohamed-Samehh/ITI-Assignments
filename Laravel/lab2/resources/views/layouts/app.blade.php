<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ITI Blog</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
        }

        .main-nav {
            background-color: #2c3e50;
            padding: 1rem;
            margin-bottom: 2rem;
        }

        .main-nav a {
            color: white;
            text-decoration: none;
            margin-right: 2rem;
            font-size: 1rem;
        }

        .main-nav a:hover {
            text-decoration: underline;
        }
        .btn {
            vertical-align: middle;
            font-size: 0.875rem;
            line-height: 1;
        }

        .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 0 1rem;
        }

        h1 {
            color: #e74c3c;
            margin-bottom: 2rem;
        }

        h2 {
            color: #2c3e50;
            margin-bottom: 1rem;
        }

        button, a.btn {
            padding: 0.35rem 0.6rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            margin-right: 0.4rem;
        }

        .btn-primary {
            background-color: #3498db;
            color: white;
        }

        .btn-primary:hover {
            background-color: #2980b9;
        }

        .btn-secondary {
            background-color: #27ae60;
            color: white;
        }

        .btn-secondary:hover {
            background-color: #229954;
        }

        .btn-danger {
            background-color: #e74c3c;
            color: white;
        }

        .btn-danger:hover {
            background-color: #c0392b;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            background-color: white;
            margin-bottom: 2rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        table th {
            background-color: #34495e;
            color: white;
            padding: 1rem;
            text-align: left;
        }

        table td {
            padding: 1rem;
            border-bottom: 1px solid #ddd;
        }

        table tr:hover {
            background-color: #ecf0f1;
        }

        /* Card-style forms (use class="card-form" on create/edit) */
        .card-form {
            background-color: white;
            padding: 2rem;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            max-width: 600px;
            margin-bottom: 2rem;
        }

        /* Simple inline forms for small actions (delete) */
        .inline-form {
            display: inline;
            margin: 0;
            padding: 0;
            background: none;
            box-shadow: none;
        }

        /* Actions container to keep buttons in one row */
        .actions {
            display: flex;
            gap: 0.5rem;
            align-items: center;
            flex-wrap: nowrap;
        }

        td {
            vertical-align: middle;
        }
        /* ensure forms inside actions don't create extra boxes */
        .actions form {
            display: inline;
            margin: 0;
            padding: 0;
            background: transparent;
            box-shadow: none;
        }

        .actions .btn {
            margin: 0;
        }

        table {
            overflow: visible;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        label {
            display: block;
            margin-bottom: 0.5rem;
            color: #2c3e50;
            font-weight: bold;
        }

        input[type="text"],
        textarea,
        select {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
        }

        textarea {
            resize: vertical;
            min-height: 150px;
        }

        .pagination {
            display: flex;
            gap: 0.4rem;
            margin-top: 2rem;
            margin-bottom: 2rem;
            list-style: none;
            padding: 0;
            flex-wrap: wrap;
        }

        .pagination a, .pagination span {
            padding: 0.3rem 0.5rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            text-decoration: none;
            color: #3498db;
            background-color: white;
            font-size: 0.875rem;
        }

        .pagination a:hover {
            background-color: #ecf0f1;
        }

        .pagination .active {
            background-color: #ecf3f6; /* subtle shade */
            color: #2c3e50;
            border-color: #e0e6ea;
            font-weight: 600;
        }

        .post-info {
            background-color: white;
            padding: 2rem;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
        }

        .post-info h2 {
            margin-bottom: 1rem;
            color: #2c3e50;
        }

        .post-info p {
            margin-bottom: 1rem;
            line-height: 1.6;
        }

        .post-creator {
            background-color: #ecf0f1;
            padding: 2rem;
            border-radius: 4px;
            margin-top: 2rem;
        }

        .post-creator h3 {
            color: #2c3e50;
            margin-bottom: 1rem;
        }

        .post-creator p {
            margin-bottom: 0.5rem;
        }
    </style>
</head>
<body>
    <nav class="main-nav">
        <a href="/">ITI Blog</a>
        <a href="/posts">All Posts</a>
    </nav>

    <div class="container">
        @yield('content')
    </div>
</body>
</html>
