<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TopicClassificationCategorization extends Model
{
    use HasFactory;

    protected $table = 'wa_topicClassificationCategorization';

    protected $fillable = [
        'title'
    ];

    public function question()
    {
        return $this->belongsTo(ClientTopicClassificationCategorization::class, 'topicClassificationCategorizationId');
    }

    public function categorizationValues()
    {
        return $this->hasMany(TopicClassificationCategorizationValues::class, 'topicClassificationCategorizationId', 'id');
    }
}
