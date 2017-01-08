import React from 'react';

class FileList extends React.Component {
    render() {
        let that = this;

        let fileListItems = this.props.files.map(function (file, index) {
            return (
                <li className="list-group-item" key={index}>
                    {file.name}

                    <span className="badge badge-default badge-pill">
                        <span className="" onClick={() => that.props.removeFile(index)}>remove</span>
                    </span>
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
