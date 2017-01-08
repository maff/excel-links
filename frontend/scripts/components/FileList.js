import React from 'react';

class FileList extends React.Component {
    render() {
        let that = this;

        let fileListItems = this.props.files.map(function (file, index) {
            return (
                <li className="list-group-item" key={index}>
                    {file}

                    <a className="close" onClick={() => that.props.removeFile(index)}>
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
