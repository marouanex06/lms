<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use App\Models\User;
use App\Models\Course;

class NewEnrollmentNotification extends Notification
{
    use Queueable;

    public $student;
    public $course;

    public function __construct(User $student, $course)
    {
        $this->student = $student;
        $this->course = $course;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'new_enrollment',
            'title' => 'New Course Enrollment',
            'message' => $this->student->name . ' enrolled in "' . $this->course->title . '".',
            'course_id' => $this->course->id,
            'user_id' => $this->student->id,
        ];
    }
}
