import React, {} from 'react';
import { Image } from 'react-native';

const CustomAvatar = (props) => {
    const {color, image, width, height, borderWidth, onLoadEnd} = props;

    return (
        <Image 
            source={image}
            onLoadEnd={onLoadEnd}
            style={{
                borderRadius: 90,
                borderWidth: borderWidth != null ? borderWidth : 1.5,
                borderColor: color != null ? color : '#555555',
                width: width != null ? width : 50,
                height: height != null ? height : 50,
            }}/>
    )
}

export default CustomAvatar;