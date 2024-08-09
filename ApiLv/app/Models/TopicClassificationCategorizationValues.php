<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TopicClassificationCategorizationValues extends Model
{
    use HasFactory;

    protected $table = 'wa_topicClassificationCategorizationValues';

    protected $fillable = [
        'topicClassificationCategorizationId',
        'text'
    ];

    public function categorizationValues()
    {
        return $this->belongsTo(TopicClassificationCategorization::class, 'topicClassificationCategorizationId');
    }
}
