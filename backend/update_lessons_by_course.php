<?php
/**
 * Script: update_lessons_by_course.php
 * Usage:  php artisan tinker update_lessons_by_course.php
 *
 * Maps each existing lesson to a course-relevant YouTube video ID
 * based on which course it belongs to (via chapter → course).
 */

// Map of course-relevant YouTube IDs per course number
// Key = course order (1st course in DB = 1, etc.)
// Each course has 3 chapters × 2 lessons = 6 YouTube IDs
$courseYoutubeMap = [
    1 => [ // HTML & CSS
        'UB1O30fR-EE', // What is HTML?
        'pQN-pnXPaVg', // HTML Elements
        'yfoY53QXEnI', // CSS Crash Course
        'rg7Fvvl3taU', // Box Model
        '3YW65K6LcIA', // Flexbox
        'jV8B24rSN5o', // CSS Grid
    ],
    2 => [ // JavaScript
        'hdI2bqOjy3c', // JS Crash Course
        'jS4aFq5-91M', // Functions & Scope
        '5fb2aPlgoys', // DOM Manipulation
        'XF1_MlZ5l6M', // Events
        'NCwa_xi0Uuc', // ES6+
        'V_Kr9OSfDeU', // Promises & Async/Await
    ],
    3 => [ // React JS
        'w7ejDZ8SWv8', // React Crash Course
        'Ke90Tje7VS0', // Components & Props
        'O6P86uwfdR0', // useState & useEffect
        'lhMKvyLRWo0', // useContext
        'oTIJunBa6MA', // React Router
        'T3Px88x_PsA', // Fetching Data
    ],
    4 => [ // Node.js & Express
        'fBNz5xF-Kx4', // Node.js Crash Course
        'ENrzD9HAZK4', // Modules & File System
        'L72fhGm1tfE', // Express Setup
        'SccSCuHhOw0', // Middleware
        'mbsmsi7l3r4', // JWT Auth
        '-PdjUx9JkZo', // MongoDB
    ],
    5 => [ // Full-Stack & Deployment
        'RGOj5yH7evk', // Git Crash Course
        'nhNq2kIvi9s', // GitHub
        'BCg4U1tmrQE', // TypeScript
        'WlxcujsvcIY', // TypeScript + React
        'fqMOX6JJhGo', // Docker
        'l134cBAJCuc', // Deployment
    ],
];

// Get all courses ordered by creation
$courses = DB::table('courses')->orderBy('id')->get();

$courseIndex = 1;
foreach ($courses as $course) {
    $ytIds = isset($courseYoutubeMap[$courseIndex]) ? $courseYoutubeMap[$courseIndex] : array_values($courseYoutubeMap[1]);
    $lessonIdx = 0;

    // Get chapters for this course ordered
    $chapters = DB::table('chapters')->where('course_id', $course->id)->orderBy('sort_order')->get();

    foreach ($chapters as $chapter) {
        // Get lessons for this chapter ordered
        $lessons = DB::table('lessons')->where('chapter_id', $chapter->id)->orderBy('sort_order')->get();

        foreach ($lessons as $lesson) {
            $ytId = isset($ytIds[$lessonIdx]) ? $ytIds[$lessonIdx] : $ytIds[0];

            DB::table('lessons')->where('id', $lesson->id)->update([
                'youtube_id' => $ytId,
                'video'      => null,
                'updated_at' => now(),
            ]);

            echo "Course {$courseIndex} | Chapter: {$chapter->title} | Lesson: {$lesson->title} => {$ytId}\n";
            $lessonIdx++;
        }
    }

    $courseIndex++;
}

echo "\nDone! All " . ($courseIndex - 1) . " courses updated.\n";
