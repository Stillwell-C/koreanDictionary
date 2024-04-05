import { formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import styles from "./blogPostLinkCard.module.css";

type Props = {
  postData: BlogPostData;
};

const BlogPostCard = ({ postData }: Props) => {
  const formattedDate = formatDate(postData.updatedAt);

  return (
    <article className={styles.container}>
      <div className={styles.topContainer}>
        <Link
          className={styles.imgContainer}
          href={`/blog/${postData._id.toString()}`}
        >
          {postData?.thumbnail && (
            <Image
              className={styles.img}
              src={postData?.thumbnail}
              fill
              alt=''
              sizes='200'
            />
          )}
        </Link>

        <span className={styles.date}>{formattedDate}</span>
      </div>
      <Link
        href={`/blog/${postData._id.toString()}`}
        className={styles.textLink}
      >
        {postData.title}
      </Link>
    </article>
  );
};

export default BlogPostCard;
