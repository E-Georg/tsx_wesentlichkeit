<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientTopicClassification extends Model
{
    use HasFactory;
    protected $table = 'wa_clientTopicClassification';

    protected $fillable = [
        'clientId',
        'active',
        'clientSubGroupId',
        'specificAmountCase'
    ];


    public function categorizations()
    {
        return $this->hasMany(ClientTopicClassificationCategorization::class, 'clientTopicClassificationId', 'id');
    }

    public function stakeholders()
    {
        return $this->hasMany(ClientTopicClassificationClientStakeholders::class, 'clientTopicClassificationId', 'id');
    }
}
