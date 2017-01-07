const React = require('react');
const Dropzone = require('react-dropzone');

class FileDropzone extends React.Component {
    onDrop(acceptedFiles, rejectedFiles) {
        console.log('Accepted: ', acceptedFiles);
        console.log('Rejected: ', rejectedFiles);

        this.props.addFiles(acceptedFiles);
    }

    render() {
        let onDrop = this.onDrop.bind(this);

        return (
            <Dropzone onDrop={onDrop}>
                <div>Try dropping some files here, or click to select files to upload.</div>
            </Dropzone>
        );
    }
}

export default FileDropzone;
