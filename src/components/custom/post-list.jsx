import { Card, CardContent, CardHeader,CardTitle } from "../ui/card";

export default function PostList({ posts }) {
  return (
    <div className='space-y-4'>
      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <CardTitle>{`${post.title} (post ${post.id})`}</CardTitle>
          </CardHeader>
          <CardContent>{post.body}</CardContent>
        </Card>
      ))}
    </div>
  );
}
