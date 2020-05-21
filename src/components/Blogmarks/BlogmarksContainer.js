import React from 'react';
import { useSelector } from 'react-redux';
import { isLoaded } from 'react-redux-firebase';

import Loading from '../../utils/Loading';
import Blogmarks from './Blogmarks';

export const BlogmarksContainer = () => {
    const blogmarks = useSelector(state => state.firebase.profile.blogmarks);

    if (!isLoaded(blogmarks)) return <Loading />;

    return <Blogmarks blogmarks={blogmarks} />;
};

export default BlogmarksContainer;