import React, { useState } from 'react';

export const Modal = (props) => {

    const [isVisible, setVisible] = useState(false);

    const openModalHandler = () => {
        setVisible(true);
    }

    const closeModalHandler = () => {
        setVisible(false);
    }

    const actionHandler = () => {
        props.buttonAction();
        closeModalHandler();
    }

    window.onclick = (event) => {
        const modal = document.getElementById('modal')
        if (event.target === modal) {
            setVisible(false);
        }
    }

    return (
        <span>
            <button style={props.visibleButtonStyle} className={props.visibleButtonClassName} onClick={openModalHandler}>{props.buttonActionName}</button>
            <>
                <div 
                    style={{ display: isVisible ? 'flex' : 'none' }} 
                    id='modal' 
                    className='modal' 
                >
                    <div className='modal-content-container'>
                        <div style={{ backgroundColor: props.modalContentHeaderBackgroundColor }}>
                            <h3>{props.title}</h3>
                            <span className='close' onClick={closeModalHandler}>&times;</span>
                        </div>
                        <div className='modal-content'>
                            <p>{props.modalContent}</p>
                        </div>
                        <div className='buttons-container'>
                            <button onClick={closeModalHandler}>Cancel</button>
                            <button onClick={actionHandler} className={props.buttonActionClassName}>{props.buttonActionName}</button>
                        </div>
                    </div>
                </div>
            </>
        </span>
    )
}
