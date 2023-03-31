import React from 'react';
import { BsShare } from 'react-icons/bs';

const CustomShareButton = ({ url, title }) => {
    const handleShare = async () => {
        try {
            await navigator.share({
                title: title,
                text: 'Description of your shared content',
                url: url,
            });
        } catch (error) {
            alert('Error sharing content: ', error);
        }
    }

    return (
        <button
        className='shareButton'
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 5,
                background:'#007BFF',
                color:'#fff',
                fontSize:'18px',
                cursor:'pointer',
                border:'none',
                padding:'5px 10px',
                borderRadius:'30px'
            }}
            onClick={handleShare}>
            <BsShare /> <span className='shareText'>Share</span> 
        </button>
    );
};

export default CustomShareButton;
