<?php
// Returns an array of error messages; empty array means all good.
function validateUserForm(array $data, bool $isNew): array
{
    $errors = [];

    if ($data['firstname'] === '') {
        $errors[] = 'First name is required.';
    }

    if ($data['lastname'] === '') {
        $errors[] = 'Last name is required.';
    }

    if ($data['email'] === '') {
        $errors[] = 'Email is required.';
    } elseif (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Email is not valid.';
    }

    if ($data['country'] === '') {
        $errors[] = 'Please select a country.';
    }

    if ($data['gender'] !== 'Male' && $data['gender'] !== 'Female') {
        $errors[] = 'Please select gender.';
    }

    if ($data['username'] === '') {
        $errors[] = 'Username is required.';
    }

    // Password only required for new users (blank means "keep existing" when editing)
    if ($isNew && $data['password'] === '') {
        $errors[] = 'Password is required.';
    }

    if ($data['room'] === '') {
        $errors[] = 'Please select a room.';
    }

    return $errors;
}
