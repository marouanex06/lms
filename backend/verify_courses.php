<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$user = \App\Models\User::where('role', 'admin')->first();
$courses = \App\Models\Course::withCount('enrollments')
            ->withAvg('reviews', 'rating')
            ->where('user_id', $user->id)
            ->orderByDesc('enrollments_count')
            ->limit(5)
            ->get();
echo "Total courses returned: " . $courses->count() . "\n";
