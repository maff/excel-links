import React from 'react';

class FileList extends React.Component {
    render() {
        let that = this;

        let fileListItems = this.props.files.map(function (file, index) {
            return (
                <li className="list-group-item" key={index}>
                    <i className="fa fa-file-image-o" />
                    {file}

                    <a className="close list-group-icon list-group-icon--right" onClick={() => that.props.removeFile(index)}>
                        <span>&times;</span>
                    </a>
                </li>
            );
        });

        return (
            <ul className="list-group list-group-flush">
                {fileListItems}
            </ul>
        );
    }
}

export default FileList;
