<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RealCoursesSeeder extends Seeder
{
    public function run(): void
    {
        // Get the admin user (first user with 'admin' role)
        $adminUser = DB::table('users')->where('role', 'admin')->first();
        if (!$adminUser) {
            $this->command->error('No admin user found. Run DummyDataSeeder first.');
            return;
        }
        $userId = $adminUser->id;

        // Get category IDs (create if missing)
        $catMap = [];
        $catNames = ['Development', 'Design', 'Marketing', 'Data Science'];
        foreach ($catNames as $name) {
            $cat = DB::table('categories')->where('name', $name)->first();
            if (!$cat) {
                $id = DB::table('categories')->insertGetId([
                    'name' => $name, 'status' => 1,
                    'created_at' => now(), 'updated_at' => now(),
                ]);
                $catMap[$name] = $id;
            } else {
                $catMap[$name] = $cat->id;
            }
        }

        // Get level IDs (create if missing)
        $lvlMap = [];
        $lvlNames = ['Beginner', 'Intermediate', 'Advanced'];
        foreach ($lvlNames as $name) {
            $lvl = DB::table('levels')->where('name', $name)->first();
            if (!$lvl) {
                $id = DB::table('levels')->insertGetId([
                    'name' => $name,
                    'created_at' => now(), 'updated_at' => now(),
                ]);
                $lvlMap[$name] = $id;
            } else {
                $lvlMap[$name] = $lvl->id;
            }
        }

        // Get language ID
        $lang = DB::table('languages')->where('name', 'English')->first();
        $langId = $lang ? $lang->id : DB::table('languages')->insertGetId([
            'name' => 'English', 'created_at' => now(), 'updated_at' => now(),
        ]);

        // The 9 showcase courses
        $courses = [
            [
                'title'       => 'React JS & Redux - Complete Masterclass',
                'description' => 'Master React JS and Redux from scratch. Build real-world applications with hooks, context, routing, and state management.',
                'price'       => 49.99,
                'cross_price' => 99.99,
                'category'   => 'Development',
                'level'      => 'Intermediate',
                'is_featured' => 'yes',
            ],
            [
                'title'       => 'UI/UX Design Masterclass: From Beginner to Pro',
                'description' => 'Learn user interface and experience design principles. Master Figma, wireframing, prototyping, and design systems.',
                'price'       => 39.99,
                'cross_price' => 89.99,
                'category'   => 'Design',
                'level'      => 'Beginner',
                'is_featured' => 'yes',
            ],
            [
                'title'       => 'Node.js REST APIs & Microservices',
                'description' => 'Build scalable REST APIs and microservices with Node.js, Express, MongoDB, and Docker.',
                'price'       => 59.99,
                'cross_price' => 119.99,
                'category'   => 'Development',
                'level'      => 'Advanced',
                'is_featured' => 'yes',
            ],
            [
                'title'       => 'Digital Marketing & SEO Strategies 2024',
                'description' => 'Master digital marketing, SEO, Google Ads, social media marketing and content strategy to grow any business.',
                'price'       => 29.99,
                'cross_price' => 69.99,
                'category'   => 'Marketing',
                'level'      => 'Beginner',
                'is_featured' => 'yes',
            ],
            [
                'title'       => 'Python for Data Science & Machine Learning',
                'description' => 'Complete Python course covering data analysis, machine learning, deep learning, and visualization with real projects.',
                'price'       => 54.99,
                'cross_price' => 109.99,
                'category'   => 'Data Science',
                'level'      => 'Intermediate',
                'is_featured' => 'no',
            ],
            [
                'title'       => 'AWS Cloud Practitioner & Solutions Architect',
                'description' => 'Prepare for AWS certifications. Learn cloud fundamentals, EC2, S3, Lambda, VPC and cloud architecture.',
                'price'       => 64.99,
                'cross_price' => 129.99,
                'category'   => 'Development',
                'level'      => 'Advanced',
                'is_featured' => 'no',
            ],
            [
                'title'       => 'Figma for Beginners: Design Like a Pro',
                'description' => 'Get started with Figma and learn to design beautiful, professional UI/UX for web and mobile apps.',
                'price'       => 24.99,
                'cross_price' => 59.99,
                'category'   => 'Design',
                'level'      => 'Beginner',
                'is_featured' => 'no',
            ],
            [
                'title'       => 'Full-Stack TypeScript with Next.js 14',
                'description' => 'Build full-stack applications with TypeScript, Next.js 14, Prisma, and PostgreSQL. Includes authentication and deployment.',
                'price'       => 69.99,
                'cross_price' => 139.99,
                'category'   => 'Development',
                'level'      => 'Advanced',
                'is_featured' => 'no',
            ],
            [
                'title'       => 'Content Marketing & Brand Storytelling',
                'description' => 'Learn how to create compelling content strategies, build brand narratives, and grow an audience online.',
                'price'       => 34.99,
                'cross_price' => 74.99,
                'category'   => 'Marketing',
                'level'      => 'Intermediate',
                'is_featured' => 'no',
            ],
        ];

        foreach ($courses as $course) {
            // Skip if already exists
            $exists = DB::table('courses')->where('title', $course['title'])->exists();
            if ($exists) {
                $this->command->info("Skipping (already exists): {$course['title']}");
                continue;
            }

            DB::table('courses')->insert([
                'title'       => $course['title'],
                'description' => $course['description'],
                'price'       => $course['price'],
                'cross_price' => $course['cross_price'],
                'user_id'     => $userId,
                'category_id' => $catMap[$course['category']],
                'level_id'    => $lvlMap[$course['level']],
                'language_id' => $langId,
                'status'      => '1',
                'is_featured' => $course['is_featured'],
                'created_at'  => now(),
                'updated_at'  => now(),
            ]);

            $this->command->info("Created: {$course['title']}");
        }

        $this->command->info('✅ RealCoursesSeeder completed!');
    }
}
