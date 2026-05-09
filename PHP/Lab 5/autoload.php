<?php
// PSR-4 autoloader: maps "App\Foo\Bar" -> "src/Foo/Bar.php".
spl_autoload_register(function ($class) {
    $prefix = 'App\\';
    $baseDir = __DIR__ . '/src/';

    if (strncmp($prefix, $class, strlen($prefix)) !== 0) {
        return;
    }

    $relative = substr($class, strlen($prefix));
    $file = $baseDir . str_replace('\\', '/', $relative) . '.php';

    if (file_exists($file)) {
        require $file;
    }
});

// Global helpers (e.g. e() for HTML escaping).
require_once __DIR__ . '/src/helpers.php';
