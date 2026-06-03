<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;


class DummyDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * Creates 5 Modern Web Development courses, each with:
     *  - 3 chapters (topic-specific)
     *  - 2 lessons per chapter (with real YouTube IDs from educational channels)
     */
    public function run(): void
    {
        // Users
        $userId = DB::table('users')->insertGetId([
            'name'       => 'Ayoub',
            'last_name'  => 'Admin',
            'role'       => 'admin',
            'email'      => 'admin@lms.com',
            'password'   => Hash::make('password'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Categories
        foreach (['Development', 'Business', 'Design', 'Marketing'] as $cat) {
            DB::table('categories')->insert([
                'name'       => $cat,
                'status'     => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
        $catId = DB::table('categories')->first()->id;

        // Languages
        foreach (['English', 'French', 'Arabic'] as $lang) {
            DB::table('languages')->insert([
                'name'       => $lang,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
        $langId = DB::table('languages')->first()->id;

        // Levels
        foreach (['Beginner', 'Intermediate', 'Advanced'] as $lvl) {
            DB::table('levels')->insert([
                'name'       => $lvl,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
        $lvlId = DB::table('levels')->first()->id;

        /**
         * Course map: each course has 3 chapters × 2 lessons.
         * YouTube IDs are real educational videos from:
         *   - Traversy Media, FreeCodeCamp, Academind, Kevin Powell, etc.
         */
        $courseData = [

            // ─── Course 1: HTML & CSS ────────────────────────────────────────────
            1 => [
                'title' => 'HTML & CSS Fundamentals',
                'desc'  => 'Master the building blocks of the web. Learn HTML5 structure and CSS3 styling from scratch to build beautiful, responsive web pages.',
                'chapters' => [
                    [
                        'title'   => 'Chapter 1: Introduction to HTML',
                        'lessons' => [
                            ['title' => 'What is HTML? Structure & Syntax',   'youtube_id' => 'UB1O30fR-EE', 'duration' => 2700],
                            ['title' => 'HTML Elements, Tags & Attributes',   'youtube_id' => 'pQN-pnXPaVg', 'duration' => 2400],
                        ],
                    ],
                    [
                        'title'   => 'Chapter 2: Styling with CSS',
                        'lessons' => [
                            ['title' => 'CSS Selectors, Properties & Values', 'youtube_id' => 'yfoY53QXEnI', 'duration' => 3600],
                            ['title' => 'Box Model, Padding & Margin',        'youtube_id' => 'rg7Fvvl3taU', 'duration' => 1800],
                        ],
                    ],
                    [
                        'title'   => 'Chapter 3: Responsive Design',
                        'lessons' => [
                            ['title' => 'Flexbox Layout System',              'youtube_id' => '3YW65K6LcIA', 'duration' => 2700],
                            ['title' => 'CSS Grid & Media Queries',           'youtube_id' => 'jV8B24rSN5o', 'duration' => 3000],
                        ],
                    ],
                ],
            ],

            // ─── Course 2: JavaScript ────────────────────────────────────────────
            2 => [
                'title' => 'JavaScript Essentials',
                'desc'  => 'Learn JavaScript from zero to hero. Understand variables, functions, DOM manipulation, ES6+ features, and asynchronous programming.',
                'chapters' => [
                    [
                        'title'   => 'Chapter 1: JavaScript Basics',
                        'lessons' => [
                            ['title' => 'Variables, Data Types & Operators',       'youtube_id' => 'hdI2bqOjy3c', 'duration' => 3000],
                            ['title' => 'Functions, Scope & Closures',             'youtube_id' => 'jS4aFq5-91M', 'duration' => 2700],
                        ],
                    ],
                    [
                        'title'   => 'Chapter 2: DOM Manipulation',
                        'lessons' => [
                            ['title' => 'Selecting & Modifying DOM Elements',      'youtube_id' => '5fb2aPlgoys', 'duration' => 2400],
                            ['title' => 'Events & Event Listeners',                'youtube_id' => 'XF1_MlZ5l6M', 'duration' => 2100],
                        ],
                    ],
                    [
                        'title'   => 'Chapter 3: Modern JavaScript (ES6+)',
                        'lessons' => [
                            ['title' => 'Arrow Functions, Destructuring & Spread', 'youtube_id' => 'NCwa_xi0Uuc', 'duration' => 3300],
                            ['title' => 'Promises & Async/Await',                  'youtube_id' => 'V_Kr9OSfDeU', 'duration' => 2700],
                        ],
                    ],
                ],
            ],

            // ─── Course 3: React JS ──────────────────────────────────────────────
            3 => [
                'title' => 'React JS for Beginners',
                'desc'  => 'Build dynamic user interfaces with React. Learn components, hooks, state management, routing, and how to connect to a REST API.',
                'chapters' => [
                    [
                        'title'   => 'Chapter 1: React Fundamentals',
                        'lessons' => [
                            ['title' => 'Introduction to React & JSX',             'youtube_id' => 'w7ejDZ8SWv8', 'duration' => 3600],
                            ['title' => 'Components, Props & State',               'youtube_id' => 'Ke90Tje7VS0', 'duration' => 3000],
                        ],
                    ],
                    [
                        'title'   => 'Chapter 2: React Hooks',
                        'lessons' => [
                            ['title' => 'useState & useEffect Explained',          'youtube_id' => 'O6P86uwfdR0', 'duration' => 2700],
                            ['title' => 'useContext & Custom Hooks',               'youtube_id' => 'lhMKvyLRWo0', 'duration' => 2400],
                        ],
                    ],
                    [
                        'title'   => 'Chapter 3: React Router & API Calls',
                        'lessons' => [
                            ['title' => 'Client-Side Routing with React Router',   'youtube_id' => 'oTIJunBa6MA', 'duration' => 2100],
                            ['title' => 'Fetching Data from a REST API',           'youtube_id' => 'T3Px88x_PsA', 'duration' => 2400],
                        ],
                    ],
                ],
            ],

            // ─── Course 4: Node.js & Express ─────────────────────────────────────
            4 => [
                'title' => 'Node.js & Express Backend',
                'desc'  => 'Build robust REST APIs with Node.js and Express. Learn server setup, routing, middleware, JWT authentication, and database integration.',
                'chapters' => [
                    [
                        'title'   => 'Chapter 1: Node.js Fundamentals',
                        'lessons' => [
                            ['title' => 'Introduction to Node.js & npm',           'youtube_id' => 'fBNz5xF-Kx4', 'duration' => 3000],
                            ['title' => 'Modules, File System & Events',           'youtube_id' => 'ENrzD9HAZK4', 'duration' => 2700],
                        ],
                    ],
                    [
                        'title'   => 'Chapter 2: Building REST APIs with Express',
                        'lessons' => [
                            ['title' => 'Express Setup, Routes & Controllers',     'youtube_id' => 'L72fhGm1tfE', 'duration' => 3600],
                            ['title' => 'Middleware, Error Handling & Validation', 'youtube_id' => 'SccSCuHhOw0', 'duration' => 2400],
                        ],
                    ],
                    [
                        'title'   => 'Chapter 3: Authentication & Database',
                        'lessons' => [
                            ['title' => 'JWT Authentication with Express',         'youtube_id' => 'mbsmsi7l3r4', 'duration' => 2700],
                            ['title' => 'MongoDB & Mongoose Integration',          'youtube_id' => '-PdjUx9JkZo', 'duration' => 3000],
                        ],
                    ],
                ],
            ],

            // ─── Course 5: Full-Stack & Deployment ──────────────────────────────
            5 => [
                'title' => 'Full-Stack Development & Deployment',
                'desc'  => 'Combine frontend and backend skills. Learn Git workflows, TypeScript, Docker containers, and deploy your app to the cloud.',
                'chapters' => [
                    [
                        'title'   => 'Chapter 1: Version Control with Git',
                        'lessons' => [
                            ['title' => 'Git Basics: Commit, Branch & Merge',          'youtube_id' => 'RGOj5yH7evk', 'duration' => 2700],
                            ['title' => 'GitHub, Pull Requests & Collaboration',       'youtube_id' => 'nhNq2kIvi9s', 'duration' => 2400],
                        ],
                    ],
                    [
                        'title'   => 'Chapter 2: TypeScript Essentials',
                        'lessons' => [
                            ['title' => 'TypeScript Types, Interfaces & Generics',     'youtube_id' => 'BCg4U1tmrQE', 'duration' => 3300],
                            ['title' => 'TypeScript with React & Node.js',             'youtube_id' => 'WlxcujsvcIY', 'duration' => 2700],
                        ],
                    ],
                    [
                        'title'   => 'Chapter 3: Deployment & DevOps',
                        'lessons' => [
                            ['title' => 'Docker Containers for Web Developers',        'youtube_id' => 'fqMOX6JJhGo', 'duration' => 3600],
                            ['title' => 'Deploying to AWS / Vercel / Railway',        'youtube_id' => 'l134cBAJCuc', 'duration' => 2700],
                        ],
                    ],
                ],
            ],
        ];

        // ── Insert courses, chapters, and lessons ──────────────────────────────
        for ($i = 1; $i <= 5; $i++) {
            $data = $courseData[$i];

            $courseId = DB::table('courses')->insertGetId([
                'title'       => "Course $i: {$data['title']}",
                'user_id'     => $userId,
                'category_id' => $catId,
                'level_id'    => $lvlId,
                'language_id' => $langId,
                'description' => $data['desc'],
                'price'       => round(49.99 * $i, 2),
                'cross_price' => round(99.99 * $i, 2),
                'status'      => 1,
                'is_featured' => 'yes',
                'created_at'  => now(),
                'updated_at'  => now(),
            ]);

            foreach ($data['chapters'] as $chIdx => $chapter) {
                $chapterId = DB::table('chapters')->insertGetId([
                    'course_id'  => $courseId,
                    'title'      => $chapter['title'],
                    'sort_order' => $chIdx + 1,
                    'status'     => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                foreach ($chapter['lessons'] as $lIdx => $lesson) {
                    DB::table('lessons')->insert([
                        'chapter_id'      => $chapterId,
                        'title'           => $lesson['title'],
                        'is_free_preview' => $lIdx === 0 ? 'yes' : 'no',
                        'duration'        => $lesson['duration'],
                        'video'           => null,
                        'youtube_id'      => $lesson['youtube_id'],
                        'description'     => "In this lesson you will learn: <strong>{$lesson['title']}</strong>. Follow along with hands-on examples and practical exercises.",
                        'sort_order'      => $lIdx + 1,
                        'status'          => 1,
                        'created_at'      => now(),
                        'updated_at'      => now(),
                    ]);
                }
            }
        }
    }
}
