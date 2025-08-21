
    export default async function GET(req,res) {
      // Access query parameters
   const {page,perPage} = req.query
console.log("req.query: ",req.query)

    //   const category = searchParams.get('category');
    //   const limit = searchParams.get('limit');
console.log("page: ",page,"perpage: ",perPage)
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_start=${page}&_limit=${perPage}`);
   console.log("rspnse: ",response)
     const posts = await response.json();
     console.log("posts: ",posts)
//   const totalPosts = parseInt(res.headers.get('X-Total-Count') || '0');
    //   // Example: Filter products based on query parameters
    //   let products = [
    //     { id: 1, name: 'Laptop', category: 'Electronics' },
    //     { id: 2, name: 'Keyboard', category: 'Electronics' },
    //     { id: 3, name: 'T-shirt', category: 'Apparel' },
    //   ];

    //   if (category) {
    //     products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    //   }

    //   if (limit) {
    //     products = products.slice(0, parseInt(limit));
    //   }

       res.json({posts});
    }