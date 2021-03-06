import React, { useState, useContext } from 'react';

import { ReportProblem } from '@styled-icons/material/ReportProblem';
import { Edit } from '@styled-icons/typicons/Edit';
import { Twitter } from '@styled-icons/boxicons-logos/Twitter';

import NotyfContext from '../../context/NotyfContext';
import ReportPost from './ReportPost';

import MoreInfoDots from '../../assets/images/more.svg';

export const PostMoreActionsModal = React.memo(({ auth, post }) => {

    const body = document.body;
    const [isVisible, setVisible] = useState(false);
    const notyf = useContext(NotyfContext);
    const [reportPost, setReportPost] = useState(false);

    const openModalHandler = () => {
        body.style.overflow = 'hidden';
        setVisible(true);
    };

    const closeModalHandler = () => {
        body.style.overflow = 'auto';
        setVisible(false);
    };

    window.onclick = (event) => {
        const modal = document.getElementById('modal')
        if (event.target === modal) {
            setReportPost(false);
            closeModalHandler();
        };
    };

    const handleCopyURL = () => {
        const dummy = document.createElement('input'),
        currentURL = window.location.href;
        document.body.appendChild(dummy);
        dummy.value = currentURL;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        notyf.success('Copied to clipboard 📋');
    };

    const handleEditPost = () => notyf.error('Sorry I haven\'t got to this yet');
    const handleReportPost = () => setReportPost(true);

    const ShareToTwitter = () => {
        const text = encodeURIComponent('Check out this post on Blogly:');
        const url = window.location.href;
        const hash_tags = 'Blogs,Programming';
        const params = 'menubar=no,toolbar=no,status=no,width=570,height=570';
        const shareToTwitterURL = `https://twitter.com/intent/tweet?url=${url}&text=${text}&hashtags=${hash_tags}`;
        window.open(shareToTwitterURL, 'NewWindow', params);
    };

    return (
        <>
            <img 
                src={MoreInfoDots} 
                alt='More info' 
                className='more-info-dots' 
                onClick={openModalHandler} 
            />
            <>
            <div 
                style={{ display: isVisible ? 'flex' : 'none' }} 
                id='modal' 
                className='modal' 
            >
                <div className='modal-content-container'>
                    <div style={{ backgroundColor: '#4e85eb' }}>
                        <h3>More actions</h3>
                        <span className='close' onClick={closeModalHandler}>&times;</span>
                    </div>
                    {
                        !reportPost ? 
                            <div className='modal-content' style={{ flexDirection: 'column', width: 'auto' }}>
                                {
                                    (!auth.isEmpty && post.authorId === auth.uid) &&
                                    <span onClick={handleEditPost}><Edit size='20' /> Edit Post</span>
                                }
                                <span onClick={handleCopyURL} role='img' aria-label='copy to clipboard'>📋 Copy URL</span>
                                <span onClick={ShareToTwitter}><Twitter size='20' color='#1DA1F2' />Share to Twitter</span>
                                {
                                    (auth.isEmpty || post.authorId ===! auth.uid) &&
                                    <span onClick={handleReportPost} className='report-port-span'><ReportProblem size='20' title='report post' /> Report this post</span>
                                }
                            </div> : <ReportPost postId={post.postId} closeModalHandler={closeModalHandler} />
                    }
                </div>
            </div>
            </>
        </>
    )
});
