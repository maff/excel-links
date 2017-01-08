import React from 'react';
import FileDropzone from './FileDropzone';
import FileList from './FileList';
import FormElements from './FormElements';
import DownloadList from './DownloadList';

import axios from 'axios';
import NProgress from 'nprogress';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            formData: {
                filename: 'excel-links.xlsx',
                imagePath: 'images'
            },
            files: [],
            downloaded: []
        };
    }

    setFormData(name, value) {
        let formData = this.state.formData;
        formData[name] = value;

        this.setState({formData: formData});
    }

    addFiles(newFiles) {
        let files = this.state.files;

        newFiles.forEach((file) => {
            files.push(file);
        });

        this.setState({files: files});
    }

    removeFile(index) {
        let files = this.state.files;

        files.splice(index, 1);

        this.setState({files: files});
    }

    clearFiles() {
        this.setState({files: []});
    }

    handleSubmit(event) {
        let that = this;

        let data = Object.assign({}, this.state.formData);
        data.files = [];

        this.state.files.forEach((file) => {
            data.files.push(file.name);
        });

        let downloaded = this.state.downloaded;

        NProgress.start();
        axios.post('/process', data, {
            responseType: 'blob',
        })
            .then((response) => {
                downloaded.push({
                    name: data.filename,
                    blob: response.data
                });

                that.setState({ downloaded: downloaded });
                NProgress.done();
            })
            .catch((error) => {
                console.log(error);
                NProgress.done();
            });

        event.preventDefault();
    }

    render() {
        return (
            <div className="container">
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <div className="row">

                        <div className="col-4">

                            <div className="card">
                                <div className="card-block">
                                    <h4 className="card-title">Files</h4>
                                    <a href="#" onClick={this.clearFiles.bind(this)}>clear</a>
                                </div>
                                <div className="card-block card-block--no-pt">
                                    <FileDropzone addFiles={this.addFiles.bind(this)}/>
                                </div>
                                <div className="card-block card-block--no-pt" hidden={this.state.files.length === 0}>
                                    <FileList files={this.state.files} removeFile={this.removeFile.bind(this)}/>
                                </div>
                            </div>

                        </div>

                        <div className="col-4">
                            <FormElements formData={this.state.formData} setFormData={this.setFormData.bind(this)}/>

                            <div className="form-group submit-group">
                                <input type="submit" className="btn btn-primary btn-lg" value="Process" disabled={this.state.files.length === 0}/>
                            </div>
                        </div>

                        <div className="col-4">

                            <div className="card" hidden={this.state.downloaded.length === 0}>
                                <div className="card-block">
                                    <h4 className="card-title">Results</h4>
                                </div>
                                <div className="card-block card-block--no-pt">
                                    <DownloadList files={this.state.downloaded} />
                                </div>
                            </div>

                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default App;
