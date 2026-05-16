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
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .main-nav .nav-left a {
            color: white;
            text-decoration: none;
            margin-right: 2rem;
            font-size: 1rem;
        }

        .main-nav .nav-left a:hover {
            text-decoration: underline;
        }

        .main-nav .nav-right a, .main-nav .nav-right button {
            color: white;
            text-decoration: none;
            margin-left: 1rem;
            font-size: 0.9rem;
            background: none;
            border: 1px solid rgba(255,255,255,0.4);
            padding: 0.3rem 0.7rem;
            border-radius: 4px;
            cursor: pointer;
        }

        .main-nav .nav-right a:hover, .main-nav .nav-right button:hover {
            background-color: rgba(255,255,255,0.15);
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

        h1 { color: #e74c3c; margin-bottom: 2rem; }
        h2 { color: #2c3e50; margin-bottom: 1rem; }

        button, a.btn {
            padding: 0.35rem 0.6rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            margin-right: 0.4rem;
        }

        .btn-primary { background-color: #3498db; color: white; }
        .btn-primary:hover { background-color: #2980b9; }
        .btn-secondary { background-color: #27ae60; color: white; }
        .btn-secondary:hover { background-color: #229954; }
        .btn-danger { background-color: #e74c3c; color: white; }
        .btn-danger:hover { background-color: #c0392b; }

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

        table td { padding: 1rem; border-bottom: 1px solid #ddd; }
        table tr:hover { background-color: #ecf0f1; }

        .card-form {
            background-color: white;
            padding: 2rem;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            max-width: 600px;
            margin-bottom: 2rem;
        }

        .inline-form {
            display: inline;
            margin: 0;
            padding: 0;
            background: none;
            box-shadow: none;
        }

        .actions {
            display: flex;
            gap: 0.5rem;
            align-items: center;
            flex-wrap: nowrap;
        }

        td { vertical-align: middle; }

        .actions form {
            display: inline;
            margin: 0;
            padding: 0;
            background: transparent;
            box-shadow: none;
        }

        .actions .btn { margin: 0; }

        table { overflow: visible; }

        .form-group { margin-bottom: 1.5rem; }

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

        textarea { resize: vertical; min-height: 150px; }

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

        .pagination a:hover { background-color: #ecf0f1; }

        .pagination .active {
            background-color: #ecf3f6;
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

        .post-info p { margin-bottom: 1rem; line-height: 1.6; }

        .post-creator {
            background-color: #ecf0f1;
            padding: 2rem;
            border-radius: 4px;
            margin-top: 2rem;
        }

        .post-creator h3 { color: #2c3e50; margin-bottom: 1rem; }
        .post-creator p { margin-bottom: 0.5rem; }

        .errors {
            background-color: #fdecea;
            border: 1px solid #e74c3c;
            border-radius: 4px;
            padding: 1rem;
            margin-bottom: 1.5rem;
            color: #c0392b;
        }
    </style>
</head>
<body>
    <nav class="main-nav">
        <div class="nav-left">
            <a href="/">ITI Blog</a>
            <a href="/posts">All Posts</a>
            <a href="/posts/trashed">Trashed Posts</a>
        </div>

        <div class="nav-right">
            @auth
                <span style="color: rgba(255,255,255,0.7); font-size:0.9rem;">{{ auth()->user()->name }}</span>
                <form method="POST" action="{{ route('logout') }}" style="display:inline;">
                    @csrf
                    <button type="submit">Logout</button>
                </form>
            @else
                <a href="{{ route('login') }}">Login</a>
                <a href="{{ route('register') }}">Register</a>
            @endauth
        </div>
    </nav>

    <div class="container">
        @yield('content')
    </div>
</body>
</html>
