import React from 'react';
import FileSaver from 'file-saver';

class DownloadList extends React.Component {
    downloadFile(index) {
        let files = this.props.files;

        FileSaver.saveAs(files[index].blob, files[index].name);
    }

    render() {
        let that = this;
        let downloadFile = this.downloadFile.bind(this);

        let listItems = this.props.files.map(function (file, index) {
            return (
                <li key={index}>
                    <a href="#" onClick={() => that.downloadFile(index)}>
                        {file.name}
                    </a>
                </li>
            );
        });

        return (
            <ul hidden={this.props.files.length === 0}>
                {listItems}
            </ul>
        );
    }
}

export default DownloadList;