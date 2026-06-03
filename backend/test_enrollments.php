<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$user = \App\Models\User::where('role', 'admin')->first();
$enrollments = \App\Models\enrollment::with(['user', 'course'])
    ->whereHas('course', function($q) use ($user) {
        $q->where('user_id', $user->id);
    })
    ->get();

echo "Enrollments count: " . $enrollments->count() . "\n";
