import React, { useState } from 'react';
import MoreInfoDots from '../../assets/images/more.svg';
import { ReportProblem } from '@styled-icons/material/ReportProblem';
import { Edit } from '@styled-icons/typicons/Edit';

export const PostMoreActionsModal = (props) => {

    const [isVisible, setVisible] = useState(false);

    const openModalHandler = () => {
        setVisible(true);
    }

    const closeModalHandler = () => {
        setVisible(false);
    }

    window.onclick = (event) => {
        const modal = document.getElementById('modal')
        if (event.target === modal) {
            setVisible(false);
        }
    }

    const copyLinkWhatsup = () => {

        const dummy = document.createElement('input'),
        currentURL = window.location.href;
        document.body.appendChild(dummy);
        dummy.value = currentURL;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
    }


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
                <div className='modal-content-container' style={{ maxWidth: '240px' }}>
                    <div style={{ backgroundColor: '#4e85eb' }}>
                        <h3>More actions</h3>
                        <span className='close' onClick={closeModalHandler}>&times;</span>
                    </div>
                    <div className='modal-content' style={{ flexDirection: 'column', width: 'auto' }}>
                        <span><Edit size='20' /> Edit Post</span>
                        <span onClick={copyLinkWhatsup} role='img' aria-label='copy to clipboard'>📋 Copy URL</span>
                        <span><ReportProblem size='20' title='report post' /> Report this post</span>
                    </div>
                </div>
            </div>
            </>
        </>
    )
}
