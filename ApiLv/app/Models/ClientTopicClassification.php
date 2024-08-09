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

    public function clientsubgroup()
    {
        return $this->belongsTo(ClientSubGroup::class, 'clientSubGroupId');
    }

    // In ClientTopicClassification model

    // Relationship to the ClientTopicClassificationCategorization
    public function answers()
    {
        return $this->hasMany(ClientTopicClassificationCategorization::class, 'clientTopicClassificationId');
    }


    public function stakeholders()
    {
        return $this->hasMany(ClientTopicClassificationClientStakeholders::class, 'clientTopicClassificationId');
    }

    // public function questions()
    // {
    //     return $this->hasMany(TopicClassificationCategorization::class, 'clientTopicClassificationId');
    // }
}
