<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\ClientGroupController;
use App\Http\Controllers\TopicClassificationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


/*
|--------------------------------------------------------------------------
| client-groups
|--------------------------------------------------------------------------
*/

Route::apiResource('client-groups', ClientGroupController::class);
Route::get('/topicClassifictaion', TopicClassificationController::class);

Route::post('/getGroups', [ClientGroupController::class, 'getClientGroups']);



Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
