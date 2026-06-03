<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use App\Models\User;

class NewUserNotification extends Notification
{
    use Queueable;

    public $newUser;

    public function __construct(User $newUser)
    {
        $this->newUser = $newUser;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'new_user',
            'title' => 'New student registration',
            'message' => $this->newUser->name . ' has registered as a student.',
            'user_id' => $this->newUser->id,
        ];
    }
}
