import React from 'react';
import Dropzone from 'react-dropzone';

class FileDropzone extends React.Component {
    onDrop(acceptedFiles, rejectedFiles) {
        let filenames = [];
        acceptedFiles.forEach((file) => {
            filenames.push(file.name);
        });

        this.props.addFiles(filenames);
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
