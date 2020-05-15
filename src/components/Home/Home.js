import React from 'react';
import { Link } from 'react-router-dom';

import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import Loading from '../../utils/Loading';

import Heart from '../../assets/images/icons/Heart.svg';
import Chat from '../../assets/images/icons/Chat.svg';

dayjs.extend(relativeTime);

export const Home = React.memo(
  ({
    loading,
    posts,
    featuredPost,
    PostImagePlaceholder,
    handleFavoritePost,
    handleUnfavoritePost,
    checkUserBlogmarks,
    auth,
  }) => {
    if (loading) return <Loading />;

    return (
      <div className='home-component'>
        <div className='home-component-featured-post'>
          <Link
            to={`/p/${featuredPost.postId}`}
            aria-label={`Link to ${featuredPost.title}`}
          >
            <div
              className='featured-post-img'
              style={{
                backgroundImage: `url("${featuredPost.coverImageURL}")`,
              }}
            ></div>
          </Link>
          <div className='featured-post-content'>
            <span className='usertag-span-home'>
              <img
                src={featuredPost.authorProfilePictureURL}
                alt='Profile'
                className='profile-picture'
              />
              <span>
                <span>{featuredPost.author}</span>
                <span>
                  {dayjs(featuredPost.createdAt.toDate()).format('DD-MM-YYYY')}
                </span>
              </span>
            </span>
            <div>
              <Link to={`/p/${featuredPost.postId}`}>
                <h1>{featuredPost.title}</h1>
              </Link>
              <div className='post-bottom'>
                <span>
                  <img src={Heart} alt='Heart' /> {featuredPost.likeCount}
                  <span className='hidden-mobile'> reactions</span>
                </span>
                <span>
                  <img src={Chat} alt='Chat' /> {featuredPost.commentCount}
                  <span className='hidden-mobile'> comments</span>
                </span>
                {!auth ? (
                  <>
                    {checkUserBlogmarks(featuredPost.postId).length === 0 ? (
                      <button
                        onClick={() =>
                          handleFavoritePost(
                            featuredPost.postId,
                            featuredPost.title
                          )
                        }
                      >
                        Mark
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleUnfavoritePost(
                            featuredPost.postId,
                            featuredPost.title
                          )
                        }
                      >
                        Unmark
                      </button>
                    )}
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div className='home-component-posts-container'>
          {posts &&
            posts.map((post) => (
              <span key={post.postId}>
                <article className='card'>
                  <Link to={`/p/${post.postId}`} className='card-link'>
                    <LazyLoadImage
                      src={post.coverImageURL}
                      alt={post.coverImageAlt}
                      effect='blur'
                      placeholderSrc={PostImagePlaceholder}
                    />
                  </Link>
                  <div className='card-content'>
                    <span className='card-title'>
                      <Link to={`/p/${post.postId}`}>
                        <h3>{post.title}</h3>
                      </Link>
                      <span>
                        {dayjs(post.createdAt.toDate()).format('DD-MM-YYYY')}
                      </span>
                    </span>
                    <Link to={`/p/${post.postId}`}>
                      <p
                        style={{
                          fontSize: '0.9em',
                          marginBottom: '15px',
                        }}
                      >
                        {`${post.body.substring(0, 90)}...`}
                      </p>
                    </Link>
                    <div className='post-bottom'>
                      <span className='usertag-span-home'>
                        <img
                          src={post.authorProfilePictureURL}
                          alt='Profile'
                          className='profile-picture'
                        />
                        {post.author}
                      </span>
                      {!auth ? (
                        <>
                          {checkUserBlogmarks(post.postId).length === 0 ? (
                            <button
                              onClick={() =>
                                handleFavoritePost(post.postId, post.title)
                              }
                            >
                              Mark
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleUnfavoritePost(post.postId, post.title)
                              }
                            >
                              Unmark
                            </button>
                          )}
                        </>
                      ) : null}
                    </div>
                  </div>
                </article>
              </span>
            ))}
        </div>
      </div>
    );
  }
);

export default Home;
