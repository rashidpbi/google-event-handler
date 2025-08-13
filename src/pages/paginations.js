import { useState, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function PostsClient() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 2;

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/posts`)
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  const start = (page - 1) * limit;
  const paginatedPosts = posts.slice(start, start + limit);
  const totalPages = Math.ceil(posts.length / limit);

  return (
    <div>
      <h1>Posts - Page {page}</h1>
      <ul>
        {paginatedPosts.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>

      {/* Controls */}
      <button disabled={page === 1}>⬅ Prev</button>
      <button disabled={page === totalPages} >Next ➡</button>
       <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious   onClick={() => setPage(page - 1)} disabled={page === 1}/>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink >1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink  isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink >3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext onClick={() => setPage(page + 1)}  />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
    </div>
  );
}
