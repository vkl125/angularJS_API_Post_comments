const fs = require('fs');
const { exec } = require('child_process');

// Check if db.json exists, if not create it with sample data
if (!fs.existsSync('db.json')) {
    console.log('Creating db.json with sample data...');
    
    const sampleData = {
        posts: [],
        comments: []
    };

    // Generate 100 sample posts
    for (let i = 1; i <= 100; i++) {
        sampleData.posts.push({
            id: i,
            title: `Post ${i}: Understanding ${['JavaScript', 'React', 'Angular', 'Node.js', 'TypeScript'][i % 5]}`,
            content: `This is the content of post ${i}. This post discusses important concepts and provides valuable insights about ${['JavaScript', 'React', 'Angular', 'Node.js', 'TypeScript'][i % 5]} development.`,
            author: `user${i}`,
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            likes: Math.floor(Math.random() * 100),
            tags: ['development', 'programming', 'web']
        });
    }

    // Generate 500+ sample comments distributed across posts
    let commentId = 1;
    for (let postId = 1; postId <= 100; postId++) {
        const commentCount = Math.floor(Math.random() * 10) + 3; // 3-12 comments per post
        for (let j = 0; j < commentCount; j++) {
            sampleData.comments.push({
                id: commentId,
                postId: postId,
                author: `commenter${commentId}`,
                content: `This is comment ${commentId} on post ${postId}. Great insights and very helpful information!`,
                createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                likes: Math.floor(Math.random() * 20)
            });
            commentId++;
        }
    }

    fs.writeFileSync('db.json', JSON.stringify(sampleData, null, 2));
    console.log('db.json created with sample data');
}

console.log('Starting json-server...');
console.log('API will be available at: http://localhost:3000');
console.log('');
console.log('Available endpoints:');
console.log('- GET /posts?_page=1&_limit=20&_embed=comments (Posts with pagination and comments)');
console.log('- GET /posts/:id?_embed=comments (Single post with comments)');
console.log('- GET /comments?postId=1 (Comments for specific post)');
console.log('- Full CRUD operations for both posts and comments');
console.log('');

// Start json-server
exec('npx json-server --watch db.json --port 3000', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error starting json-server: ${error}`);
        return;
    }
    if (stderr) {
        console.error(`json-server stderr: ${stderr}`);
    }
    console.log(`json-server output: ${stdout}`);
});