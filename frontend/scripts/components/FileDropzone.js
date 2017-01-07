const React = require('react');
const Dropzone = require('react-dropzone');

class FileDropzone extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            files: []
        };

        this.onDrop = this.onDrop.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
    }

    onDrop(acceptedFiles, rejectedFiles) {
        console.log('Accepted files: ', acceptedFiles);
        console.log('Rejected files: ', rejectedFiles);

        let files = this.state.files;

        acceptedFiles.forEach((file) => {
            files.push(file);
        });

        this.setState({ files: files });
        console.log('STATE', this.state);
    }

    handleRemove(index) {
        let files = this.state.files;
        files.splice(index, 1);

        this.setState({ files: files });
        console.log('STATE', this.state);
    }

    render() {
        let that = this;

        let fileListItems = this.state.files.map(function (file, index) {
            return (
                <li className="list-group-item" key={index}>
                    {file.name}

                    <span className="badge badge-default badge-pill">
                        <span className="" onClick={() => that.handleRemove(index)}>remove</span>
                    </span>
                </li>
            );
        });

        return (
            <div>
                <Dropzone onDrop={this.onDrop}>
                    <div>Try dropping some files here, or click to select files to upload.</div>
                </Dropzone>

                <ul className="list-group">
                    {fileListItems}
                </ul>
            </div>
        );
    }
}

export default FileDropzone;
