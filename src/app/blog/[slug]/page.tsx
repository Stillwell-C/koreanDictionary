import { getAllBlogPostIds, getBlogPost } from "@/lib/dbData";
import Markdown from "markdown-to-jsx";
import styles from "./singleBlogPage.module.css";

type Props = {
  params: {
    slug: string;
  };
};

export const generateStaticParams = async () => {
  const postIds = await getAllBlogPostIds();

  return postIds.map((postId) => ({
    slug: postId._id.toString(),
  }));
};

export const generateMetadata = async ({ params: { slug } }: Props) => {
  const blogPost = await getBlogPost(slug);

  return {
    title: `${blogPost.title} | Blog`,
    description: `Blog post: ${blogPost.title}`,
  };
};

const page = async ({ params: { slug } }: Props) => {
  const blogPost = await getBlogPost(slug);

  return (
    <div className={styles.container}>
      {blogPost?.postContent && (
        <article className={styles.mdContainer}>
          <Markdown>{blogPost.postContent}</Markdown>
        </article>
      )}
    </div>
  );
};

export default page;
