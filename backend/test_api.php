<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$request = Illuminate\Http\Request::create('/api/dashboard-stats', 'GET');
// We need to bypass auth or log in a user for the request
$user = App\Models\User::where('role', 'admin')->first();
if ($user) {
    $request->setUserResolver(function () use ($user) {
        return $user;
    });
}
$response = $kernel->handle($request);
echo $response->getContent();
