import React from 'react';
import Dropzone from 'react-dropzone';

class FileDropzone extends React.Component {
    onDrop(acceptedFiles, rejectedFiles) {
        this.props.addFiles(acceptedFiles);
    }

    render() {
        let onDrop = this.onDrop.bind(this);

        return (
            <Dropzone onDrop={onDrop} accept="image/*" className="dropzone" activeClassName="dropzone--active" rejectClassName="dropzone--reject" >
                Drop images here or click to select
            </Dropzone>
        );
    }
}

export default FileDropzone;
