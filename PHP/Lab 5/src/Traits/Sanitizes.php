<?php
namespace App\Traits;

// Provides a clean() helper to any class that uses this trait.
trait Sanitizes
{
    public function clean($value)
    {
        return trim((string) ($value ?? ''));
    }
}
