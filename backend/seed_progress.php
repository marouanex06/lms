<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Course;
use App\Models\User;
use App\Models\enrollment;
use App\Models\lesson;
use App\Models\LessonCompletion;
use Illuminate\Support\Facades\DB;

// Fetch enrollments that we just seeded
$enrollments = enrollment::all();

foreach ($enrollments as $enrollment) {
    // get all lessons for this course
    $lessons = lesson::whereHas('chapter', function($query) use ($enrollment) {
        $query->where('course_id', $enrollment->course_id);
    })->get();

    if ($lessons->isEmpty()) continue;

    // complete a random number of lessons
    $numToComplete = rand(0, $lessons->count());
    $lessonsToComplete = $lessons->random($numToComplete);

    foreach ($lessonsToComplete as $lesson) {
        LessonCompletion::firstOrCreate([
            'user_id' => $enrollment->user_id,
            'lesson_id' => $lesson->id,
            'course_id' => $enrollment->course_id
        ]);
    }
}

echo "Added random lesson completions!\n";
