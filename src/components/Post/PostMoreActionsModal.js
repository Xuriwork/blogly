import React, { useState, useContext } from 'react';
import MoreInfoDots from '../../assets/images/more.svg';
import { ReportProblem } from '@styled-icons/material/ReportProblem';
import { Edit } from '@styled-icons/typicons/Edit';
import NotyfContext from '../../utils/NotyfContext';

export const PostMoreActionsModal = (props) => {

    const body = document.body;
    const [isVisible, setVisible] = useState(false);
    const notyf = useContext(NotyfContext);

    const openModalHandler = () => {
        body.style.overflow = 'hidden';
        setVisible(true);
    }

    const closeModalHandler = () => {
        body.style.overflow = 'auto';
        setVisible(false);
    }

    window.onclick = (event) => {
        const modal = document.getElementById('modal')
        if (event.target === modal) {
            closeModalHandler();
        }
    }

    const handleCopyURL = () => {
        const dummy = document.createElement('input'),
        currentURL = window.location.href;
        document.body.appendChild(dummy);
        dummy.value = currentURL;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        notyf.success('Copied to clipboard 📋');
    }

    const handleEditPost = () => notyf.error('Sorry I haven\'t got to this yet 🙄');
    const handleReportPost = () => notyf.error('Sorry I haven\'t got to this yet 🙄');


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
                <div className='modal-content-container' style={{ maxWidth: 280, height: 160 }}>
                    <div style={{ backgroundColor: '#4e85eb' }}>
                        <h3>More actions</h3>
                        <span className='close' onClick={closeModalHandler}>&times;</span>
                    </div>
                    <div className='modal-content' style={{ flexDirection: 'column', width: 'auto' }}>
                        <span onClick={handleEditPost}><Edit size='20' /> Edit Post</span>
                        <span onClick={handleCopyURL} role='img' aria-label='copy to clipboard'>📋 Copy URL</span>
                        <span onClick={handleReportPost}><ReportProblem size='20' title='report post' /> Report this post</span>
                    </div>
                </div>
            </div>
            </>
        </>
    )
}
