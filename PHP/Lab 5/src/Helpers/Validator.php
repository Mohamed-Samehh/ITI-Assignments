<?php
namespace App\Helpers;

use App\Traits\Sanitizes;

// Validates registration form input. validate() returns a list of error messages.
class Validator
{
    use Sanitizes;

    private $data;
    private $isNew;

    public function __construct(array $data, bool $isNew)
    {
        $this->data  = $data;
        $this->isNew = $isNew;
    }

    public function validate(): array
    {
        $errors = [];

        if ($this->clean($this->data['firstname'] ?? '') === '') {
            $errors[] = 'First name is required.';
        }

        if ($this->clean($this->data['lastname'] ?? '') === '') {
            $errors[] = 'Last name is required.';
        }

        $email = $this->clean($this->data['email'] ?? '');
        if ($email === '') {
            $errors[] = 'Email is required.';
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Email is not valid.';
        }

        if ($this->clean($this->data['country'] ?? '') === '') {
            $errors[] = 'Please select a country.';
        }

        $gender = $this->clean($this->data['gender'] ?? '');
        if ($gender !== 'Male' && $gender !== 'Female') {
            $errors[] = 'Please select gender.';
        }

        if ($this->clean($this->data['username'] ?? '') === '') {
            $errors[] = 'Username is required.';
        }

        // When editing, blank password means "keep the current password".
        if ($this->isNew && ($this->data['password'] ?? '') === '') {
            $errors[] = 'Password is required.';
        }

        if ($this->clean($this->data['room'] ?? '') === '') {
            $errors[] = 'Please select a room.';
        }

        return $errors;
    }
}
