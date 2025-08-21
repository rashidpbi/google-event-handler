// import { fetchPosts } from "@/lib/api";
import PostList from './post-list';
import { PaginationWithLinks } from "./pagination-with-links";

export default  function Posts({ searchParams }) {


const {page,posts,postsPerPage,totalPosts} = searchParams
  return (
    <div className='my-8'>
      <h1 className='text-3xl font-bold mb-6'>Posts</h1>
      <PostList posts={posts} />
      <div className='mt-8'>
        <PaginationWithLinks
          page={page}
          pageSize={postsPerPage}   
          totalCount={totalPosts}
          pageSizeSelectOptions={{
            pageSizeOptions: [5, 10, 25, 50],
          }}
        />
      </div>
    </div>
  );
}
