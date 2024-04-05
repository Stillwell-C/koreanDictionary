import { getBlogPostsInfo } from "@/lib/dbData";
import { Metadata } from "next";
import BlogPostLinkCard from "@/components/blogPostLinkCard/BlogPostLinkCard";
import styles from "./blogPage.module.css";

export const metadata: Metadata = {
  title: "Blog",
  description: "Korean Dictionary Blog Page",
};

const BlogPage = async () => {
  const posts = await getBlogPostsInfo();

  return (
    <ul className={styles.blogPosts}>
      {posts.results.map((post) => (
        <BlogPostLinkCard key={post._id} postData={post} />
      ))}
    </ul>
  );
};

export default BlogPage;
