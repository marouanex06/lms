<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Course;
use App\Models\User;
use App\Models\enrollment;
use App\Models\Review;
use Illuminate\Support\Facades\DB;

class FakeEnrollmentsSeeder extends Seeder
{
    public function run()
    {
        // Get courses
        $courses = Course::all();
        // Create 10 fake students if they don't exist
        $students = [];
        for ($i=1; $i<=10; $i++) {
            $student = User::firstOrCreate(
                ['email' => "student{$i}@example.com"],
                [
                    'name' => "Student {$i}",
                    'password' => bcrypt('password'),
                    'role' => 'user'
                ]
            );
            $students[] = $student->id;
        }

        // Add 3-8 enrollments per course
        foreach ($courses as $course) {
            $enrollCount = rand(3, 8);
            $enrolled = [];

            for ($i=0; $i<$enrollCount; $i++) {
                $studentId = $students[array_rand($students)];
                if (in_array($studentId, $enrolled)) continue;
                $enrolled[] = $studentId;

                enrollment::firstOrCreate([
                    'user_id' => $studentId,
                    'course_id' => $course->id
                ]);

                // 50% chance to leave a review
                if (rand(0, 1)) {
                    Review::firstOrCreate([
                        'user_id' => $studentId,
                        'course_id' => $course->id
                    ], [
                        'rating' => rand(4, 5),
                        'comment' => "Great course!",
                        'status' => 1
                    ]);
                }
            }
        }
    }
}
