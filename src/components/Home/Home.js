import React from 'react';
import { Link } from 'react-router-dom';
import Loading from '../../utils/Loading';
import IronImage from 'react-image-lazy-load-component';
import LazyLoad from 'react-lazyload';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export const Home = React.memo(({ loading, posts, PostImagePlaceholder }) => {
   if (loading) {
      return <Loading />;
   }

   return (
      <div className='home-component'>
         {posts &&
            posts.map((post) => (
               <span key={post.postId}>
                  <Link to={`/p/${post.postId}`}>
                     <section className='card'>
                        <LazyLoad>
                           <IronImage
                              src={post.coverImageURL}
                              alt={post.coverImageAlt}
                              placeholder={PostImagePlaceholder()}
                           />
                        </LazyLoad>
                        <div className='card-content'>
                           <span className='card-title'>
                              {post.title}
                              <br />
                              <span
                                 style={{
                                    fontSize: '0.7em',
                                    textTransform: 'uppercase',
                                    fontWeight: '100',
                                 }}>
                                 {dayjs(post.createdAt?.toDate()).fromNow()}
                              </span>
                           </span>
                           <p
                              style={{
                                 fontSize: '0.9em',
                                 marginBottom: '15px',
                              }}>
                              {`${post.body.substring(0, 100)}...`}
                           </p>
                           <span className='usertag-span-home'>
                              <img
                                 src={post.authorProfilePictureURL}
                                 alt='Profile'
                                 className='profile-picture'
                              />
                              {post.author}
                           </span>
                        </div>
                     </section>
                  </Link>
               </span>
            ))}
      </div>
   );
});

export default Home;
