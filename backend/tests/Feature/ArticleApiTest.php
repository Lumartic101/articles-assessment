<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ArticleApiTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function guest_can_view_articles()
    {
        Article::factory()->count(3)->create();

        $response = $this->getJson('/api/articles');

        $response
            ->assertStatus(200)
            ->assertJsonCount(3);
    }

    /** @test */
    public function user_can_create_article_with_image()
    {
        /**
         * Test user can create article with image 
         * To use this you need to change php.ini with extension=gd enabled
         */
        Storage::fake('public');

        $user = User::factory()->create();
        $file = UploadedFile::fake()->image('photo.jpg');

        $payload = [
            'title'   => 'Test Article',
            'content' => str_repeat('a', 30),
            'image'   => $file,
        ];

        $response = $this
            ->actingAs($user, 'sanctum')
            ->post('/api/articles', $payload, ['Accept' => 'application/json']);

        $response->assertStatus(201)
                ->assertJsonFragment(['title' => 'Test Article']);

        $this->assertDatabaseHas('articles', ['title' => 'Test Article']);

        Storage::disk('public')->assertExists('articles/'.$file->hashName());
    }

    /** @test */
    public function user_can_update_article()
    {
        $user = User::factory()->create();
        $article = Article::factory()->create();

        $payload = [
            'title'   => 'Updated Title',
            'content' => str_repeat('b', 30),
        ];

        $response = $this
            ->actingAs($user, 'sanctum')
            ->putJson("/api/articles/{$article->id}", $payload);

        $response
            ->assertStatus(200)
            ->assertJsonFragment(['title' => 'Updated Title']);

        $this->assertDatabaseHas('articles', ['id' => $article->id, 'title' => 'Updated Title']);
    }

    /** @test */
    public function test_user_can_delete_article()
    {
        $user = User::factory()->create();
        $article = Article::factory()->create();

        $response = $this
            ->actingAs($user, 'sanctum')
            ->deleteJson("/api/articles/{$article->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('articles', ['id' => $article->id]);
    }

    /** @test */
    public function validation_fails_with_short_content()
    {
        $user = User::factory()->create();

        $payload = [
            'title'   => 'Invalid Article',
            'content' => 'short',
        ];

        $response = $this
            ->actingAs($user, 'sanctum')
            ->postJson('/api/articles', $payload);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['content']);
    }
}
