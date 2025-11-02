<?php

namespace Database\Factories;

use App\Models\Article;       
use Illuminate\Database\Eloquent\Factories\Factory;

class ArticleFactory extends Factory
{
    /**
     * Het bijbehorende model voor deze factory.
     */
    protected $model = Article::class;

    public function definition(): array
    {
        return [
            'title'      => $this->faker->sentence(),
            'content'    => $this->faker->paragraph(5),
            'created_at' => now(),
        ];
    }
}
